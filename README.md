# ONS JavaScript Template

[![CI – Build Status](https://github.com/ONSDigital/generator-ons-javascript-template/actions/workflows/ci.yml/badge.svg)](https://github.com/ONSDigital/generator-ons-javascript-template/actions/workflows/ci.yml)  
[![CodeQL – Security Scan](https://github.com/ONSDigital/generator-ons-javascript-template/actions/workflows/codeql.yml/badge.svg)](https://github.com/ONSDigital/generator-ons-javascript-template/actions/workflows/codeql.yml)  
[![License – MIT](https://img.shields.io/badge/license-MIT-1ac403.svg)](LICENSE)

A minimalistic Yeoman generator to scaffold new JavaScript repositories with sensible defaults and GitHub automation baked in—so you can focus on writing code, not configuration.

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [GitHub Template](#github-template)
  - [Local Generation](#local-generation)
- [Post‑Generation Steps](#post‑generation-steps)
- [Repository Structure](#repository-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Yeoman‑powered**: interactively prompt for repo name, description, owner, visibility, and Dependabot PR limit
- **Dependabot**: weekly version updates, with customizable `open-pull-requests-limit`
- **GitHub Actions**
  - **CI**: runs on Node.js 20.x & 22.x (`npm ci`, `npm test`, coverage upload)
  - **CodeQL**: automated security scanning for public repositories
- **Lint & Format**: ESLint + Prettier preconfigured
- **GitHub Repo Setup**: optional `git init`, initial commit, GitHub CLI repo creation, branch‑protection rules
- **Templates**:
  - Issue & Pull Request templates
  - `.gitignore`, `LICENSE` (MIT), starter `README.md`
- **Test Harness**: sample `src/index.js` + `test/index.test.js`

---

## Getting Started

### GitHub Template

> **Note:** If this repo is enabled as a [GitHub Template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template), you can click **Use this template** to bootstrap a new project in the browser.

### Local Generation

1. **Install Yeoman & the generator**
   ```bash
   npm install -g yo generator-ons-javascript-template
   ```
2. **Run the generator**
   ```bash
   # If you want to scaffold into the current directory:
   yo ons-javascript-template
   ```
3. **Answer the prompts** (repository name, description, owner, public/private, Dependabot PR limit, git setup, branch protection…)
4. **Jump in and code**
   ```bash
   npm start
   npm test
   ```

---

## Post‑Generation Steps

1. **Review branch protection**  
   Ensure the settings (required reviews, stale‑approval dismissal, conversation resolution) match your team’s policy.
2. **Configure commit signing**  
   Follow [GitHub docs](https://docs.github.com/authentication/managing-commit-signature-verification).
3. **Enable secret scanning**  
   In your repo’s **Settings → Security → Secret scanning**.

---

## Repository Structure

```
.
├── __tests__
│   └── app.js
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── generators
│   └── app
│       ├── index.js
│       └── templates
│           ├── CODE_OF_CONDUCT.md
│           ├── CONTRIBUTING.md
│           ├── LICENSE.md
│           ├── package.json
│           ├── PIRR.md
│           ├── README.md
│           ├── SECURITY.md
│           ├── src
│           │   └── index.js
│           └── test
│               └── index.test.js
├── LICENSE.md
├── package-lock.json
├── package.json
├── README.md
└── SECURITY.md
```

---

## Contributing

Pull requests, issues, and ⭐️ are all very welcome. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## License

This project is licensed under the [MIT License](LICENSE).
