// generators/app/index.js

const Generator = require('yeoman-generator');
const chalk = require('chalk');

module.exports = class extends Generator {
  async prompting() {
    this.log(
      chalk.blue(
        '\nWelcome to the ONS JavaScript/TypeScript Template Generator!\n',
      ),
    );
    this.answers = await this.prompt(this._getPrompts());
  }

  writing() {
    const {
      projectName,
      language,
      githubActions,
      codeQL,
      dependabot,
      repoVisibility,
      lintTools,
      testTools,
      docsTools,
      precommitHooks,
      badges,
    } = this.answers;
    const dest = this.destinationPath(projectName);

    // Universal files
    this._safeCopy('.editorconfig', `${projectName}/.editorconfig`);
    this._safeCopy('CODE_OF_CONDUCT.md', `${projectName}/CODE_OF_CONDUCT.md`);
    this._safeCopy('CONTRIBUTING.md', `${projectName}/CONTRIBUTING.md`);
    this._safeCopy('LICENSE.md', `${projectName}/LICENSE.md`);
    this._safeCopy('SECURITY.md', `${projectName}/SECURITY.md`);
    this._safeCopy('.nvmrc', `${projectName}/.nvmrc`); // Always copy .nvmrc
    if (repoVisibility !== 'public') {
      this._safeCopy('PIRR.md', `${projectName}/PIRR.md`);
    }
    this._safeCopy('README.md', `${projectName}/README.md`);

    // Lint/format configs
    if (lintTools && Array.isArray(lintTools)) {
      if (lintTools.includes('eslint')) {
        this._safeCopy('eslint.config.mjs', `${projectName}/eslint.config.mjs`);
      }
      if (lintTools.includes('prettier')) {
        this._safeCopy('_.prettierrc', `${projectName}/.prettierrc`);
      }
    }

    // Test configs
    if (testTools && Array.isArray(testTools)) {
      if (testTools.includes('jest')) {
        this._safeCopy('jest.config.js', `${projectName}/jest.config.js`);
      }
      if (testTools.includes('nyc')) {
        this._safeCopy('.nycrc', `${projectName}/.nycrc`);
      }
    }

    // Docs configs
    if (docsTools && Array.isArray(docsTools) && docsTools.includes('jsdoc')) {
      this._safeCopy('jsdoc.json', `${projectName}/jsdoc.json`);
    }

    // Pre-commit hook configs
    if (precommitHooks && Array.isArray(precommitHooks)) {
      if (precommitHooks.includes('husky')) {
        this._safeCopy('.husky', `${projectName}/.husky`);
      }
      if (precommitHooks.includes('lint-staged')) {
        this._safeCopy('lint-staged.config.js', `${projectName}/lint-staged.config.js`);
      }
    }

    // README badges
    if (badges && Array.isArray(badges) && badges.length > 0) {
      this._addBadgesToReadme(projectName, badges);
    }

    // .gitignore
    this._safeCopy('_.gitignore', `${projectName}/.gitignore`);

    // Docs folder
    this._safeCopy('docs', `${projectName}/docs`);

    // package.json (templated)
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath(`${projectName}/package.json`),
      { projectName, language },
    );

    // GitHub Actions workflows
    if (githubActions) {
      this._safeCopy('.github/workflows/ci.yml', `${projectName}/.github/workflows/ci.yml`);
      if (codeQL) {
        this._safeCopy('.github/workflows/codeql.yml', `${projectName}/.github/workflows/codeql.yml`);
      }
    }
    // Dependabot config
    if (dependabot) {
      this._safeCopy('.github/dependabot.yml', `${projectName}/.github/dependabot.yml`);
    }

    // Language-specific source and test folders
    if (language === 'ts') {
      this._safeCopy('ts/index.ts', `${projectName}/src/index.ts`);
      this._safeCopy('ts/test', `${projectName}/test`); // Ensure test folder is copied
      this._safeCopy('ts/tsconfig.json', `${projectName}/tsconfig.json`);
    } else {
      this._safeCopy('js/index.js', `${projectName}/src/index.js`);
      this._safeCopy('js/test', `${projectName}/test`);
    }
  }

  install() {
    try {
      process.chdir(this.destinationPath(this.answers.projectName));
    } catch (err) {
      this.log(chalk.red('Failed to change directory: ' + err.message));
      return;
    }
    let devDeps = [];
    if (this.answers.lintTools.includes('eslint')) devDeps.push('eslint');
    if (this.answers.lintTools.includes('prettier')) devDeps.push('prettier');
    if (this.answers.testTools && this.answers.testTools.includes('jest'))
      devDeps.push('jest');
    if (this.answers.testTools && this.answers.testTools.includes('nyc'))
      devDeps.push('nyc');
    if (this.answers.docsTools && this.answers.docsTools.includes('jsdoc'))
      devDeps.push('jsdoc');
    if (
      this.answers.precommitHooks &&
      this.answers.precommitHooks.includes('husky')
    )
      devDeps.push('husky');
    if (
      this.answers.precommitHooks &&
      this.answers.precommitHooks.includes('lint-staged')
    )
      devDeps.push('lint-staged');

    // Install dev dependencies
    if (devDeps.length > 0) {
      try {
        if (this.answers.packageManager === 'yarn') {
          this.spawnCommandSync('yarn', ['add', '--dev', ...devDeps]);
        } else {
          this.spawnCommandSync('npm', ['install', '--save-dev', ...devDeps]);
        }
      } catch (err) {
        this.log(chalk.red('Dependency install failed: ' + err.message));
      }
    }
    // Install regular dependencies
    try {
      if (this.answers.packageManager === 'yarn') {
        this.spawnCommandSync('yarn', []);
      } else {
        this.spawnCommandSync('npm', ['install']);
      }
    } catch (err) {
      this.log(chalk.red('Install failed: ' + err.message));
    }
  }

  end() {
    this.log(chalk.green('\nYour new project is ready!'));
    this.log(`\n  1) cd ${this.answers.projectName}`);
    if (this.answers.packageManager === 'yarn') {
      this.log('  2) yarn run build / test / lint, etc.\n');
    } else {
      this.log('  2) npm run build / test / lint, etc.\n');
    }
  }

  // --- Helper methods ---
  _getPrompts() {
    return [
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-new-project',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language do you want to use?',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' },
        ],
        default: 'js',
      },
      {
        type: 'checkbox',
        name: 'lintTools',
        message:
          'Which lint/format tools do you want to include? (Space to select)',
        choices: [
          { name: 'ESLint', value: 'eslint' },
          { name: 'Prettier', value: 'prettier' },
        ],
      },
      {
        type: 'checkbox',
        name: 'testTools',
        message: 'Which test/coverage tools do you want to include?',
        choices: [
          { name: 'Jest', value: 'jest' },
          { name: 'Coverage (nyc)', value: 'nyc' },
        ],
      },
      {
        type: 'checkbox',
        name: 'docsTools',
        message: 'Which documentation tools do you want to include?',
        choices: [{ name: 'JSDoc', value: 'jsdoc' }],
      },
      {
        type: 'checkbox',
        name: 'precommitHooks',
        message: 'Which pre-commit tools/hooks do you want to include?',
        choices: [
          { name: 'Husky', value: 'husky' },
          { name: 'lint-staged', value: 'lint-staged' },
        ],
      },
      {
        type: 'checkbox',
        name: 'badges',
        message: 'Which README badges do you want to include?',
        choices: [
          { name: 'CI', value: 'ci' },
          { name: 'Coverage', value: 'coverage' },
          { name: 'NPM Version', value: 'npm' },
        ],
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager do you want to use?',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'Yarn', value: 'yarn' },
        ],
        default: 'npm',
      },
      {
        type: 'confirm',
        name: 'githubActions',
        message: 'Include GitHub Actions CI/CD configuration?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'codeQL',
        message: 'Include GitHub CodeQL Scanning (public repos)?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'dependabot',
        message: 'Include Dependabot config?',
        default: true,
      },
      {
        type: 'list',
        name: 'repoVisibility',
        message: 'Is this repository private, internal, or public?',
        choices: [
          { name: 'Private', value: 'private' },
          { name: 'Internal', value: 'internal' },
          { name: 'Public', value: 'public' },
        ],
        default: 'private',
      },
    ];
  }

  _safeCopy(src, dest) {
    try {
      if (this.fs.exists(this.templatePath(src))) {
        this.fs.copy(this.templatePath(src), this.destinationPath(dest));
      }
    } catch (err) {
      this.log(chalk.red(`Failed to copy ${src}: ${err.message}`));
    }
  }

  _addBadgesToReadme(projectName, badges) {
    let badgeMarkdown = '';
    if (badges.includes('ci')) {
      badgeMarkdown += `[![CI](https://github.com/ONSdigital/${projectName}/actions/workflows/ci.yml/badge.svg)](https://github.com/ONSdigital/${projectName}/actions/workflows/ci.yml)\n`;
    }
    if (badges.includes('coverage')) {
      badgeMarkdown += `[![Coverage Status](https://coveralls.io/repos/github/ONSdigital/${projectName}/badge.svg?branch=main)](https://coveralls.io/github/ONSdigital/${projectName}?branch=main)\n`;
    }
    if (badges.includes('npm')) {
      badgeMarkdown += `[![npm version](https://badge.fury.io/js/${projectName}.svg)](https://badge.fury.io/js/${projectName})\n`;
    }
    const readmePath = this.destinationPath(`${projectName}/README.md`);
    if (this.fs.exists(readmePath)) {
      let readmeContent = this.fs.read(readmePath);
      readmeContent = badgeMarkdown + '\n' + readmeContent;
      this.fs.write(readmePath, readmeContent);
    }
  }
};
