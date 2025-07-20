const Generator = require('yeoman-generator');
const chalk = require('chalk');
const { Octokit } = require('@octokit/rest');

// Central defaults
const DEFAULTS = {
  branch: 'main',
  dependabotPRLimit: 10,
  requiredReviewers: 1,
};

// Prompt helper
const ask = (type, name, message, options = {}) => ({
  type,
  name,
  message: `🎤 ${message}`,
  ...options,
});

const validateNumber = (min, max) => (input) =>
  input >= min && input <= max ? true : `Please enter a number between ${min} and ${max}`;

module.exports = class extends Generator {
  async prompting() {
    this.log(chalk.blue('\n🚀 ONS JavaScript Template Generator\n'));

    const repoAnswers = await this.prompt([
      ask('input', 'name', 'What is your repository name? (e.g. my-awesome-project)', {
        default: this.appname.replace(/\s+/g, '-').toLowerCase(),
        validate: (input) =>
          /^[a-z0-9-]+$/.test(input)
            ? true
            : 'Repository name must be lowercase letters, numbers, and hyphens only',
      }),
      ask('input', 'description', 'What is your repository description?', {
        default: 'A new JavaScript project',
      }),
      ask('input', 'owner', 'What is your repository owner? (e.g. your GitHub username)', {
        default: 'ONSDigital',
      }),
      ask('confirm', 'isPublic', 'Is this a public repository?', {
        default: true,
      }),
      ask(
        'confirm',
        'dependabotUpdates',
        'Enable Dependabot version updates? (security always on)',
        { default: true },
      ),
    ]);
    this.answers = { ...repoAnswers };

    if (this.answers.dependabotUpdates) {
      const { dependabotPRLimit } = await this.prompt([
        ask('number', 'dependabotPRLimit', 'Maximum open Dependabot PRs', {
          default: DEFAULTS.dependabotPRLimit,
          validate: validateNumber(1, 100),
        }),
      ]);
      this.answers.dependabotPRLimit = dependabotPRLimit;
    } else {
      this.answers.dependabotPRLimit = 0;
    }

    const { initGit } = await this.prompt([
      ask('confirm', 'initGit', 'Set up Git repo and push to GitHub?', {
        default: true,
      }),
    ]);
    this.answers.initGit = initGit;

    if (initGit) {
      const gitAnswers = await this.prompt([
        ask('input', 'defaultBranch', 'Default branch name', {
          default: DEFAULTS.branch,
        }),
        ask('list', 'repoSettings', 'Customize repo settings or use recommended?', {
          choices: ['recommended', 'custom'],
          default: 'recommended',
        }),
      ]);
      Object.assign(this.answers, gitAnswers);

      if (this.answers.repoSettings === 'custom') {
        const custom = await this.prompt([
          ask('confirm', 'dismissStaleReviews', 'Dismiss stale PR approvals on new commits?', {
            default: true,
          }),
          ask('number', 'requiredReviewers', 'Number of approving reviews required', {
            default: DEFAULTS.requiredReviewers,
            validate: validateNumber(0, 10),
          }),
          ask('confirm', 'requireUpToDateBranch', 'Require up-to-date branch before merge?', {
            default: true,
          }),
          ask(
            'confirm',
            'requireConversationResolution',
            'Require conversation resolution before merge?',
            { default: true },
          ),
        ]);
        Object.assign(this.answers, custom);
      } else {
        Object.assign(this.answers, {
          dismissStaleReviews: true,
          requiredReviewers: DEFAULTS.requiredReviewers,
          requireUpToDateBranch: true,
          requireConversationResolution: true,
        });
      }
    }
  }

  writing() {
    const tpl = { ...this.answers };

    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      tpl,
      {},
      { globOptions: { dot: true } },
    );

    if (!this.answers.isPublic) {
      this.fs.delete(this.destinationPath('.github/workflows/codeql.yml'));
    }
    if (this.answers.isPublic) {
      this.fs.delete(this.destinationPath('PIRR.md'));
    }
  }

  install() {
    this.log(chalk.blue(`\n📦 Installing dependencies...`));
    try {
      this.spawnCommandSync('npm', ['install'], {
        cwd: this.destinationPath(),
        stdio: 'inherit',
      });
    } catch (err) {
      // Log the actual error and satisfy ESLint
      this.log(
        chalk.yellow(`⚠️ npm install failed. You can run it manually later:\n${err.message}`),
      );
    }
  }

  async end() {
    if (!this.answers.initGit) {
      this.log(chalk.green(`\n🎉 Your project is ready!`));
      return;
    }

    this.log(chalk.blue(`\n🔧 Setting up Git and GitHub...`));
    const projectPath = this.destinationPath();
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    try {
      await this.spawnCommand('git', ['init', '-b', this.answers.defaultBranch], {
        cwd: projectPath,
      });
      await this.spawnCommand('git', ['add', '.'], { cwd: projectPath });
      await this.spawnCommand('git', ['commit', '-m', 'Initial commit'], {
        cwd: projectPath,
      });

      await this.spawnCommand(
        'gh',
        [
          'repo',
          'create',
          `${this.answers.owner}/${this.answers.name}`,
          this.answers.isPublic ? '--public' : '--private',
          '--source=.',
          '--push',
        ],
        { cwd: projectPath },
      );

      await octokit.repos.updateBranchProtection({
        owner: this.answers.owner,
        repo: this.answers.name,
        branch: this.answers.defaultBranch,
        required_status_checks: {
          strict: this.answers.requireUpToDateBranch,
          contexts: ['test'],
        },
        enforce_admins: false,
        required_pull_request_reviews: {
          dismiss_stale_reviews: this.answers.dismissStaleReviews,
          required_approving_review_count: this.answers.requiredReviewers,
        },
        required_conversation_resolution: this.answers.requireConversationResolution,
      });

      this.log(chalk.green(`\n✅ Git repository created and configured!`));
    } catch (err) {
      this.log(chalk.red(`\n❌ Git setup encountered errors:`));
      this.log(err.message);
    }

    this.log(chalk.cyan(`\n📝 Next steps:`));
    this.log(chalk.cyan('   1. Configure commit signing'));
    this.log(chalk.cyan('   2. Enable secret scanning in repository settings'));
    this.log(chalk.cyan('   3. Review branch protection rules'));

    this.log(chalk.green(`\n🎉 Your project is ready!`));
    this.log(chalk.white(`   cd ${this.answers.name}`));
    this.log(chalk.white('   npm test'));
    this.log(chalk.white('   npm start\n'));
  }
};
