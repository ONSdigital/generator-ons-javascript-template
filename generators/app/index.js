const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  async prompting() {
    this.log(chalk.blue('\n🚀 ONS JavaScript Template Generator\n'));

    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: '🎤 What is your repository name? (e.g. my-awesome-project)',
        default: this.appname.replace(/\s+/g, '-').toLowerCase(),
        validate: (input) => {
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Repository name must be lowercase letters, numbers, and hyphens only';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: '🎤 What is your repository description?',
        default: 'A new JavaScript project',
      },
      {
        type: 'input',
        name: 'owner',
        message:
          '🎤 What is your repository owner? (e.g. your GitHub username)',
        default: 'ONSDigital',
      },
      {
        type: 'confirm',
        name: 'isPublic',
        message: '🎤 Is this a public repository?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'dependabotUpdates',
        message:
          '🎤 Do you want to enable Dependabot version updates? (Default is Yes - Note: Security updates are always enabled)',
        default: true,
      },
    ]);

    // Only ask for PR limit if Dependabot updates are enabled
    if (this.answers.dependabotUpdates) {
      const dependabotAnswer = await this.prompt([
        {
          type: 'number',
          name: 'dependabotPRLimit',
          message:
            '🎤 Maximum number of open pull requests at once for Dependabot version updates',
          default: 10,
          validate: (input) => {
            if (input < 1 || input > 100) {
              return 'Please enter a number between 1 and 100';
            }
            return true;
          },
        },
      ]);
      this.answers.dependabotPRLimit = dependabotAnswer.dependabotPRLimit;
    }

    // Git setup questions
    const gitAnswers = await this.prompt([
      {
        type: 'confirm',
        name: 'initGit',
        message:
          '🎤 Do you want to set up the git repository? (Create/Push/Configure the repo in GitHub) (Default is Yes)',
        default: true,
      },
    ]);
    this.answers.initGit = gitAnswers.initGit;

    if (this.answers.initGit) {
      const branchAnswers = await this.prompt([
        {
          type: 'input',
          name: 'defaultBranch',
          message: '🎤 What is your default branch name?',
          default: 'main',
        },
        {
          type: 'list',
          name: 'repoSettings',
          message:
            '🎤 Would you like to customise your repository settings or apply recommended settings? (Default is recommended)',
          choices: ['recommended', 'custom'],
          default: 'recommended',
        },
      ]);
      this.answers.defaultBranch = branchAnswers.defaultBranch;
      this.answers.repoSettings = branchAnswers.repoSettings;

      // Custom settings
      if (this.answers.repoSettings === 'custom') {
        const customSettings = await this.prompt([
          {
            type: 'confirm',
            name: 'dismissStaleReviews',
            message:
              '🎤 Dismiss stale pull request approvals when new commits are pushed? (Default is Yes)',
            default: true,
          },
          {
            type: 'number',
            name: 'requiredReviewers',
            message:
              '🎤 Number of approving reviews required to merge a pull request (Default is 1)',
            default: 1,
            validate: (input) => {
              if (input < 0 || input > 10) {
                return 'Please enter a number between 0 and 10';
              }
              return true;
            },
          },
          {
            type: 'confirm',
            name: 'requireUpToDateBranch',
            message:
              '🎤 Require approval of the most recent reviewable push? (Default is Yes)',
            default: true,
          },
          {
            type: 'confirm',
            name: 'requireConversationResolution',
            message:
              '🎤 Require conversation resolution before merging? (Default is Yes)',
            default: true,
          },
        ]);
        Object.assign(this.answers, customSettings);
      } else {
        // Apply recommended settings
        this.answers.dismissStaleReviews = true;
        this.answers.requiredReviewers = 1;
        this.answers.requireUpToDateBranch = true;
        this.answers.requireConversationResolution = true;
      }
    }
  }

  writing() {
    const templateData = {
      name: this.answers.name,
      description: this.answers.description,
      owner: this.answers.owner,
      year: new Date().getFullYear(),
      isPublic: this.answers.isPublic,
      dependabotPRLimit: this.answers.dependabotPRLimit || 10,
      defaultBranch: this.answers.defaultBranch || 'main',
    };

    // Set destination path to new project directory
    this.destinationRoot(this.destinationPath(this.answers.name));

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

    // Update dependabot.yml based on settings
    if (!this.answers.dependabotUpdates) {
      // Modify dependabot.yml to only include security updates
      const dependabotPath = this.destinationPath('.github/dependabot.yml');
      const securityOnlyContent = `version: 2
updates:
  # Security updates only - version updates disabled
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 0
    labels:
      - "dependencies"
      - "security"
`;
      this.fs.write(dependabotPath, securityOnlyContent);
    }
  }

  install() {
    this.log(chalk.blue('\n📦 Installing dependencies...\n'));

    // Skip auto install and do it manually in the end() method
    this.skipInstall = false;
  }

  async end() {
    // Install dependencies first
    try {
      this.log(chalk.blue('Installing npm packages...\n'));
      this.spawnCommandSync('npm', ['install'], {
        cwd: this.destinationPath(),
        stdio: 'inherit',
      });
    } catch (error) {
      this.log(
        chalk.yellow(
          '⚠️  npm install failed. You can run it manually later.\n',
        ),
      );
    }

    if (this.answers.initGit) {
      this.log(chalk.blue('\n🔧 Setting up Git and GitHub...\n'));

      const projectPath = this.destinationPath();

      try {
        // Initialize git with custom default branch
        this.spawnCommandSync(
          'git',
          ['init', '-b', this.answers.defaultBranch],
          { cwd: projectPath },
        );
        this.spawnCommandSync('git', ['add', '.'], { cwd: projectPath });
        this.spawnCommandSync('git', ['commit', '-m', 'Initial commit'], {
          cwd: projectPath,
        });

        // Create GitHub repo and push
        const visibility = this.answers.isPublic ? '--public' : '--private';
        this.spawnCommandSync(
          'gh',
          [
            'repo',
            'create',
            `${this.answers.owner}/${this.answers.name}`,
            visibility,
            '--source=.',
            '--push',
          ],
          { cwd: projectPath, stdio: 'inherit' },
        );

        // Configure branch protection
        this.log(chalk.yellow('\n⚡ Configuring branch protection...\n'));

        // Build the protection rules based on user settings
        const protectionRules = {
          required_status_checks: {
            strict: this.answers.requireUpToDateBranch,
            contexts: ['test'],
          },
          enforce_admins: false,
          required_pull_request_reviews: {
            dismiss_stale_reviews: this.answers.dismissStaleReviews,
            require_code_owner_reviews: false,
            required_approving_review_count: this.answers.requiredReviewers,
          },
          required_conversation_resolution:
            this.answers.requireConversationResolution,
          restrictions: null,
        };

        const protectionCmd = `gh api repos/${this.answers.owner}/${this.answers.name}/branches/${this.answers.defaultBranch}/protection \
          --method PUT \
          --input - \
          --silent`;

        this.spawnCommandSync(
          'sh',
          [
            '-c',
            `echo '${JSON.stringify(protectionRules)}' | ${protectionCmd}`,
          ],
          { cwd: projectPath },
        );

        this.log(chalk.green('\n✅ Git repository created and configured!\n'));
        this.log(chalk.cyan('📝 Next steps:'));
        this.log(
          chalk.cyan(
            '   1. Configure commit signing: https://docs.github.com/en/authentication/managing-commit-signature-verification',
          ),
        );
        this.log(
          chalk.cyan('   2. Enable secret scanning in repository settings'),
        );
        this.log(
          chalk.cyan(
            '   3. Review and adjust branch protection rules if needed\n',
          ),
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
