// generators/app/index.js

const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  async prompting() {
    this.log(chalk.blue('\nWelcome to the ONS JavaScript/TypeScript Template Generator!\n'));

    // Collect user input
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-new-project'
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language do you want to use?',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' }
        ],
        default: 'js'
      },
      {
        type: 'confirm',
        name: 'githubActions',
        message: 'Include GitHub Actions CI/CD configuration?',
        default: true
      },
      {
        type: 'confirm',
        name: 'codeQL',
        message: 'Include GitHub CodeQL Scanning (public repos)?',
        default: true
      },
      {
        type: 'confirm',
        name: 'dependabot',
        message: 'Include Dependabot config?',
        default: true
      }
    ]);
  }

  writing() {
    const { projectName, language, githubActions, codeQL, dependabot } = this.answers;

    // Create a destination path for the new project
    const dest = this.destinationPath(projectName);

    // Copy universal markdown/docs (CODE_OF_CONDUCT, CONTRIBUTING, LICENSE, SECURITY, README, etc.)
    // Adjust these if you want to prompt whether to include them.
    
    // Copy .editorconfig
    this.fs.copy(
      this.templatePath('.editorconfig'),
      this.destinationPath(`${projectName}/.editorconfig`)
    );
    
    this.fs.copy(
      this.templatePath('CODE_OF_CONDUCT.md'),
      this.destinationPath(`${projectName}/CODE_OF_CONDUCT.md`)
    );

    this.fs.copy(
      this.templatePath('CONTRIBUTING.md'),
      this.destinationPath(`${projectName}/CONTRIBUTING.md`)
    );

    this.fs.copy(
      this.templatePath('LICENSE'),
      this.destinationPath(`${projectName}/LICENSE`)
    );

    this.fs.copy(
      this.templatePath('SECURITY.md'),
      this.destinationPath(`${projectName}/SECURITY.md`)
    );

    // Optionally rename PIRR.md -> PULL_REQUEST_TEMPLATE.md or some other usage
    this.fs.copy(
      this.templatePath('PIRR.md'),
      this.destinationPath(`${projectName}/PIRR.md`)
    );

    this.fs.copy(
      this.templatePath('README.md'),
      this.destinationPath(`${projectName}/README.md`)
    );

    // Copy ESlint config
    this.fs.copy(
      this.templatePath('eslint.config.mjs'),
      this.destinationPath(`${projectName}/eslint.config.mjs`)
    );

    // Copy .gitignore (with underscore to avoid ignoring itself)
    this.fs.copy(
      this.templatePath('_.gitignore'),
      this.destinationPath(`${projectName}/.gitignore`)
    );

    // Copy Prettier config
    this.fs.copy(
      this.templatePath('_.prettierrc'),
      this.destinationPath(`${projectName}/.prettierrc`)
    );

    // Copy (or template) package.json
    // We use copyTpl so we can dynamically insert projectName, language, etc.
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(`${projectName}/package.json`),
      { projectName, language }
    );

    // If you have a lockfile template:
    this.fs.copy(
      this.templatePath('package-lock.json'),
      this.destinationPath(`${projectName}/package-lock.json`)
    );

    // Copy GitHub Actions workflows if selected
    if (githubActions) {
      this.fs.copy(
        this.templatePath('.github/workflows/ci.yml'),
        this.destinationPath(`${projectName}/.github/workflows/ci.yml`)
      );
      if (codeQL) {
        this.fs.copy(
          this.templatePath('.github/workflows/codeql.yml'),
          this.destinationPath(`${projectName}/.github/workflows/codeql.yml`)
        );
      }
    }

    // Copy Dependabot config if selected
    if (dependabot) {
      this.fs.copy(
        this.templatePath('.github/dependabot.yml'),
        this.destinationPath(`${projectName}/.github/dependabot.yml`)
      );
    }

    // Copy language-specific source and test folders
    if (language === 'ts') {
      // Create a src directory in the destination and copy TypeScript index
      this.fs.copy(
        this.templatePath('ts/index.ts'),
        this.destinationPath(`${projectName}/src/index.ts`)
      );

      // Copy test folder (with your TS tests inside)
      this.fs.copy(
        this.templatePath('ts/test'),
        this.destinationPath(`${projectName}/test`)
      );

      // Copy tsconfig.json
      this.fs.copy(
        this.templatePath('ts/tsconfig.json'),
        this.destinationPath(`${projectName}/tsconfig.json`)
      );
    } else {
      // JavaScript
      this.fs.copy(
        this.templatePath('js/index.js'),
        this.destinationPath(`${projectName}/src/index.js`)
      );

      // Copy JS test folder
      this.fs.copy(
        this.templatePath('js/test'),
        this.destinationPath(`${projectName}/test`)
      );
    }
  }

  install() {
    // Change into the new project folder
    process.chdir(this.destinationPath(this.answers.projectName));
  
    // Use spawnCommandSync (blocking) or spawnCommand (non-blocking) to run npm install
    this.spawnCommandSync('npm', ['install']);
  
    // Alternatively, if you prefer asynchronous spawn:
    // return this.spawnCommand('npm', ['install']);
  }
  

  end() {
    this.log(chalk.green('\nYour new project is ready!'));
    this.log(`\n  1) cd ${this.answers.projectName}`);
    this.log('  2) npm run build / test / lint, etc.\n');
  }
};
