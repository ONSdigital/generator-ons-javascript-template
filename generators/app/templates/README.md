# ONS Template Repo
This project was generated using the JavaScript template repository, providing a well-structured starting point with essential tooling and configurations. Now that the setup is complete, this README outlines how to maintain and work with the project.

## Table of Contents ##
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Development](#development)
    - [Running the Application](#running-the-application)
    - [Code Formatting and Linting](#code-formatting-and-linting)
    - [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)


## Getting Started
To get a local copy up and running, follow these steps:

### Prerequisites 
Before proceeding, ensure that you have installed the necessary prerequisites as outlined in the [Getting Started](#getting-started) section of the pre-installation README. These includes:

- Node.js (14.x or later)
- npm
- Git 

If any of these are missing, please refer to the setup instructions before continuing.

### Installation
After generating the project, follow these steps to configure your environment and begin development:
#### 1. Install Dependencies
Run the following command to install all required dependencies:
```
sh

npm install
```

#### 2. Verify Configuration
Ensure the setup was successful by running:
```
sh

# Check for linting issues
npm run lint 
# Run tests
npm test 
```
Resolve any reported issues before proceeding.

#### 3. Repository Configuration
If the repository was not automatically set up during installation, manually initialise Git and push the project:

```
sh

git init
git remote add origin <your-repository-url>
git add.
git commit -m "Initial commit"
git push -u origin main
```

#### 4. GitHub Actions and Security
This project includes automated security and dependancy management via GitHub Actions (Dependabot and CodeQL). No addiitonal setup is required.
To enable automated fixes via MegaLinter, add a GitHub personal access token as a reporitory secret.

## Development
### Running the Application
Start the application:

```
sh

npm start
```

For project that require a build step, run:

```
sh

npm run build
```
### Code Formatting and Linting 
This project uses ESLint and Prettier to enforce coding standards. To format and lint your code, run:

```
sh

npm run format
npm run lint
```
### Testing
This template includes Jest for testing. To run tests:

```
sh

npm test
```
## Contributing 
See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License
See [LICENSE](LICENSE) for details.