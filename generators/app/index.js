const Generator = require("yeoman-generator");

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "projectName",
        message: "Your project name",
        default: this.appname // Default to current folder name
      },
      {
        type: "input",
        name: "projectDescription",
        message: "Your project description",
        default: "A generic JavaScript/Node.js project"
      },
      {
        type: "input",
        name: "authorName",
        message: "Author name",
        default: "Your Name"
      }
    ]).then(answers => {
      this.answers = answers;
    });
  }

  writing() {
    const templates = ["package.json", "index.js", "README.md", ".gitignore"];

    templates.forEach(file => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        this.answers
      );
    });
  }
};
