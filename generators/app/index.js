const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { execSync } = require('child_process');

module.exports = class extends Generator {
  async prompting() {
    this.log(chalk.blue('\n🚀 ONS JavaScript Template Generator\n'));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: this.appname.replace(/\s+/g, '-').toLowerCase(),
        validate: (input) => {
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Project name must be lowercase letters, numbers, and hyphens only';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: 'A new JavaScript project',
      },
      {
        type: 'confirm',
        name: 'isPublic',
        message: 'Is this a public repository?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize git repository and configure GitHub?',
        default: true,
      },
    ]);
  }

  writing() {
    const templateData = {
      name: this.answers.name,
      description: this.answers.description,
      year: new Date().getFullYear(),
    };

    // Copy all templates
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      templateData,
      {},
      { globOptions: { dot: true } },
    );

    // Remove CodeQL for private repos
    if (!this.answers.isPublic) {
      this.fs.delete(this.destinationPath('.github/workflows/codeql.yml'));
    }

    // Remove PIRR.md for public repos
    if (this.answers.isPublic) {
      this.fs.delete(this.destinationPath('PIRR.md'));
    }
  }

  install() {
    this.log(chalk.blue('\n📦 Installing dependencies...\n'));

    // Change to the project directory before installing
    const projectPath = this.destinationPath();
    process.chdir(projectPath);

    // Use spawnCommandSync for npm install
    this.spawnCommandSync('npm', ['install'], { stdio: 'inherit' });
  }

  async end() {
    if (this.answers.initGit) {
      this.log(chalk.blue('\n🔧 Setting up Git and GitHub...\n'));

      try {
        // Initialize git
        execSync('git init', { cwd: this.destinationPath() });
        execSync('git add .', { cwd: this.destinationPath() });
        execSync('git commit -m "Initial commit"', {
          cwd: this.destinationPath(),
        });

        // Create GitHub repo and push
        const visibility = this.answers.isPublic ? '--public' : '--private';
        execSync(
          `gh repo create ${this.answers.name} ${visibility} --source=. --push`,
          { cwd: this.destinationPath(), stdio: 'inherit' },
        );

        // Configure branch protection
        this.log(chalk.yellow('\n⚡ Configuring branch protection...\n'));
        const protectionCmd = `gh api repos/:owner/${this.answers.name}/branches/main/protection \
          --method PUT \
          --field required_status_checks='{"strict":true,"contexts":["test"]}' \
          --field enforce_admins=false \
          --field required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
          --field restrictions=null \
          --silent`;

        execSync(protectionCmd, { cwd: this.destinationPath(), shell: true });

        this.log(chalk.green('\n✅ Git repository created and configured!\n'));
        this.log(chalk.cyan('📝 Next steps:'));
        this.log(
          chalk.cyan(
            '   1. Configure commit signing: https://docs.github.com/en/authentication/managing-commit-signature-verification',
          ),
        );
        this.log(
          chalk.cyan('   2. Enable Dependabot alerts in repository settings'),
        );
        this.log(
          chalk.cyan('   3. Enable secret scanning in repository settings\n'),
        );
      } catch (error) {
        this.log(
          chalk.red('\n❌ Git setup failed. You can set it up manually later.'),
        );
        this.log(chalk.yellow(`   Error: ${error.message}\n`));
      }
    }

    this.log(chalk.green('\n🎉 Your project is ready!\n'));
    this.log(chalk.white(`   cd ${this.answers.name}`));
    this.log(chalk.white('   npm test'));
    this.log(chalk.white('   npm start\n'));
  }
};
