const Generator = require('yeoman-generator');
const glob = require('glob');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
      {
        type: 'input',
        name: 'projectDescription',
        message: 'Your project description',
        default: 'A generic JavaScript/Node.js project',
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Author name',
        default: 'Your Name',
      },
    ]).then(answers => {
      // Transform projectName to be a valid npm package name
      answers.projectName = answers.projectName
        .toLowerCase()
        .replace(/\s+/g, '-');

      this.answers = answers;
    });
  }

  writing() {
    const templatePath = this.templatePath();
    const destinationPath = this.destinationPath();

    // Exclude node_modules and other unwanted directories/files
    glob
      .sync('**/*', {
        cwd: templatePath,
        dot: true,
        ignore: ['node_modules/**', '**/node_modules/**'],
      })
      .forEach(file => {
        const src = path.join(templatePath, file);
        const dest = path.join(destinationPath, file);

        // Copy template files with EJS templating
        this.fs.copyTpl(src, dest, this.answers);
      });
  }

  install() {
    this.spawnCommandSync('npm', ['install']);
  }
};
