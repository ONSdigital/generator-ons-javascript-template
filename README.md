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
>Sanjeev to add the tech part

## Getting Started

You have two options for generating a project from this template:

1. **Using GitHub Template Feature**: Click [Use this template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) on GitHub to create a new repository based on this template directly from the web interface. This method is quick and convenient, however it has limited customisation options compared to local generation.
2. **Running Yeoman Locally**: Use Yeoman on your local machine to tailor the template to your specific requirements. This approach allows for greater customisation according to your project's needs and will automatically set up the repository and branch protection.

## Using GitHub Template Feature

To get started:

1. Click on [Use this template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
2. Name your new repository and provide a description, then click *Create repository*. *Note: The repository name should be lowercase and use hyphens (-) instead of underscores*.
3. GitHub will now copy the contents over, and GitHub Actions will process the template and commit to your new repository shortly after you click *Create repository*.
4. Wait until the *Rename Project from Template* job in GitHub Actions finishes running!
5. Once the *Rename Project from Template* action has run, you can clone your new repository and start working on your project.

**Known Limitations**: Some GitHub Actions workflows may fail on the initial run post-clone because the repository will not be fully configured until the *Rename Project from Template* job has completed. This is expected behaviour and can be safely ignored. Subsequent runs will not encounter this issue.

##  Running Yeoman Locally

Prerequisites:
>[!IMPORTANT]
>Sanjeev to add the tech part

1. Operating System: Ubuntu/MacOS.
2. Git: Ensure Git is installed and configured.
3. GitHub CLI (OPTIONAL): If you want to automate repository creation and configuration, including branch protection, ensure the GitHub CLI is installed and you are authenticated.

## Generate Project from Template

Yeoman will prompt you with a series of questions to customise the project according to your needs. Once you have answered all the questions, Yeoman will generate the project for you.

To initiate the project generation, run:
>[!IMPORTANT]
>Sanjeev to add the tech part

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

## License
