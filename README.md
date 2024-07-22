# ONS-JavaScript-Template

This repository provides a foundational template for developing JavaScript projects, complete with essential tools and configurations.

This template is designed to help you quickly start new JavaScript projects, allowing you to focus on writing code. It handles the setup of directory structures, tool configurations, and automated testing until you are ready to customise these aspects yourself.

This template is generated using Yeoman, an open-source tool for creating projects from templates. It also supports seamless updates as the template evolves.

For an example built using this template, see this [demo repository]().

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - Using GitHub Template Feature
  - Using Yeoman Locally
  - Post-clone Steps
- [Updating Project with Template Changes](#updating-project-with-template-changes)
- [Structure](#structure)
- [Design Decisions](#design-decisions)
- [Alternative Software/ Tools](#alternative-software-tools)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Features

This template includes a number of features to help you get started developing your JavaScript project quickly:

>[!IMPORTANT]
>To review again:
>- [ESLint](https://eslint.org/) (linting tool) to analyse code to find and fix problems. This includes identifying syntax errors, potential bugs, stylistic errors, and deviation from coding standards.
>- [Prettier](https://prettier.io/docs/en/index.html) (code formatting tool) to format your code to ensure it adheres to a consistent style.
>- Continuous Integration using [GitHub Actions](https://docs.github.com/en/actions) with jobs to lint and test your project.

## Getting Started

You have two options for generating a project from this template:

1. **Using GitHub Template Feature**: Click [Use this template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) on GitHub to create a new repository based on this template directly from the web interface. This method is quick and convenient, however it has limited customisation options compared to local generation.
2. **Running Yeoman Locally**: Use Yeoman on your local machine to tailor the template to your specific requirements. This approach allows for greater customisation according to your project's needs and will automatically set up the repository and branch protection.

## Using GitHub Template Feature

>[!NOTE]
>DO NOT FORK this repository. Instead use the [Use this template](https://github.com/new?template_name=ons-javascript-template&template_owner=ONSdigital) feature.

To get started:

1. Click on [Use this template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
2. Name your new repository and provide a description, then click *Create repository*. *Note: The repository name should be lowercase and use hyphens (-) instead of underscores*.
3. GitHub will now copy the contents over, and GitHub Actions will process the template and commit to your new repository shortly after you click *Create repository*.
4. Wait until the *Rename Project from Template* job in GitHub Actions finishes running!
5. Once the *Rename Project from Template* action has run, you can clone your new repository and start working on your project.

**Known Limitations**: Some GitHub Actions workflows may fail on the initial run post-clone because the repository will not be fully configured until the *Rename Project from Template* job has completed. This is expected behaviour and can be safely ignored. Subsequent runs will not encounter this issue.

##  Running Yeoman Locally

#### Prerequisites:
>[!IMPORTANT]
>To review again:
>1. **Node.js version 14.x or later**: We recommend using nvm (Node Version Manager) to manage Node.js versions.
>2. **npm** (Node package manager, which comes with Node.js): Ensure npm is installed and updated
```bash

# Update npm to the latest version
npm install -g npm
# Verify installation
npm -v
```
>3. **Yeoman**: Install Yeoman globally using npm:
```bash

npm install -g yo

# Verify installation
yo --version
```
>4. **Yeoman Generator**: Install the specific Yeoman generator for your project. Yeoman requires a generator to scaffold a new project. Each generator is tailored for different frameworks, libraries, or project types.
```bash
npm install -g generator-name # Replace generator-name with the actual generator you intend to use

# Verify installation
yo generator-name --help
```
>5. **Operating System**: Ubuntu/MacOS.
>6. **Git**: Ensure Git is installed and configured.
>7. **GitHub CLI** (OPTIONAL): If you want to automate repository creation and configuration, including branch protection, ensure the GitHub CLI is installed and you are authenticated.

## Generate Project from Template

Once all prerequisites are installed, you can generate your project using Yeoman. Follow these steps:

>[!IMPORTANT]
>To review again:
>1. **Run Yeoman**:
```bash
yo generator-name
```
>2. **Answer the Prompts**: Yeoman will prompt you with a series of questions to customise the project template according to your needs. Answer these questions to tailor the project to your specifications.
>3. **Complete the Generation**: After answering all the questions, Yeoman will generate the project for you.
>4. **Navigate to your Project Directory**:
```bash
cd your-project-directory
```
>5. **Start Working on your Project**: You can now start working on your newly generated JavaScript project.

>By following these steps, you will set up a new JavaScript project using Yeoman locally, ensuring you have a consistent and efficient starting point for your development work.

#### Initialising a Git Repository and Pushing to GitHub

**This step is only required if you answered `No` to the `Do you want to set up the git repository?` question.
Otherwise, this would
have been automatically done for you.**

1. Go to your project directory, and initialise a git repository and make the initial commit

   ```bash
   cd /path/to/your/new/project
   git init -b main
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repo in GitHub.
   See [GitHub How-to](<https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories>]

3. Push your project to the repository on GitHub:

   ```bash
   git remote add origin https://github.com/<repository_owner>/<repository_name>.git
   git push -u origin main
   ```

Now you can start working on your project.

## Post-Clone Steps
There are a few steps to take after cloning your new repository to ensure it is fully configured and ready for use.

#### 1. Private Internal Reasoning Record (PIRR)

If your repository is private/internal, you should update the `PIRR.md` file in the root of your repository with the
reasoning for the private/internal status of the repository.

#### 2. Repository Settings

Familiarise yourself with the [ONS GitHub Policy](https://github.com/ONSdigital/ons-template/wiki#github-policy) and
ensure your repository is compliant with the policy.
Few key points to note are:

- **[Branch Protection](https://github.com/ONSdigital/ons-template/wiki/5.7-Branch-Protection-rules)**: Ensure
  the `main` or any other primary branch is protected.
- **[Signed Commits](https://github.com/ONSdigital/ons-template/wiki/5.8-Signed-Commits)**: Use GPG keys to sign your commits.
- **[Security Alerts](https://github.com/ONSdigital/ons-template/wiki/6.2-Security)**: Make use of Secret scanning and Push protection. Dependabot alerts will be enabled by default when using this template.

If you answered `Yes` to the `Do you want to set up the git repository?` question, then these settings would have been
automatically configured for you. However, it is recommended to review these settings to ensure they meet your requirements.

#### 3. MegaLinter

##### Reducing the Docker image size for MegaLinter

MegaLinter is set up to use the largest Docker image by default, containing all available linters and code analysis
tools. This setup is designed for comprehensive coverage and serves as a solid starting point for new projects. However,
you might not need every tool included in this image, as it can be quite large.

To save space and optimise your setup, you can choose a more specific MegaLinter Docker image, called a [flavor](https://megalinter.io/latest/flavors/). Each flavor includes a subset of linters and tools suited for particular languages or frameworks.

If you are unsure which flavor is best for you, try running MegaLinter with the default set up after your project has matured. After the run, MegaLinter will analyse the output and suggest a more suitable flavor if necessary. This helps you to customise your setup to include only the tools you need, reducing the Docker image size and improving efficiency.

##### Auto-fixing linting issues via GitHub Actions

If you would like to auto-fix issues using MegaLinter and commit the changes back to the PR, you will need to create
a **Personal Access Token** and add it as a [secret to your repository](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions).
Without a **PAT** token, commits/PRs made by workflows do not trigger other workflows, including the MegaLinter workflow. This is a security feature of GitHub Actions to prevent infinite loops. For more info, see [MegaLinter: Auto-fixing issues](https://megalinter.io/latest/config-apply-fixes/#apply-fixes-issues).

## Updating Project with Template Changes

## Structure

## Design Decisions

## Alternative Software/ Tools

## Future Plans
- Add more documentation and developer guidance.
- Add support for pre-commit hooks.
- Further customisation options for the template:
    - Ability to choose your own Package Manager.
    - Ability to choose your own Linting/Formatting tools.
    - Ability to choose your own Type Checking tools.
    - Ability to configure the GitHub repo setting post-generation via GitHub Template feature.
- Integrate with the ONS Software Developer Portal.
- Ability to update the project with the latest template changes.

## Development

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License
See [LICENSE](LICENSE) for details.
