// __tests__/app.js
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-ons-javascript-template:app', () => {
  describe('public repository', () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: 'test-project',
          description: 'Test project description',
          isPublic: true,
          initGit: false, // Disable git for testing
        });
    });

    it('creates expected files', () => {
      assert.file([
        'package.json',
        'README.md',
        '.gitignore',
        '.nvmrc',
        'src/index.js',
        'test/index.test.js',
        '.github/dependabot.yml',
        '.github/workflows/ci.yml',
        '.github/workflows/codeql.yml',
        'CODE_OF_CONDUCT.md',
        'CONTRIBUTING.md',
        'SECURITY.md',
      ]);
    });

    it('does not create PIRR.md for public repos', () => {
      assert.noFile('PIRR.md');
    });

    it('fills package.json with correct values', () => {
      assert.jsonFileContent('package.json', {
        name: 'test-project',
        description: 'Test project description',
      });
    });

    it('documentation files contain project name', () => {
      assert.fileContent('README.md', 'test-project');
      assert.fileContent('CONTRIBUTING.md', 'test-project');
    });
  });

  describe('private repository', () => {
    beforeAll(() => {
      return helpers
        .run(path.join(__dirname, '../generators/app'))
        .withPrompts({
          name: 'private-project',
          description: 'Private project',
          isPublic: false,
          initGit: false,
        });
    });

    it('creates all documentation files including PIRR.md', () => {
      assert.file([
        'CODE_OF_CONDUCT.md',
        'CONTRIBUTING.md',
        'SECURITY.md',
        'PIRR.md',
      ]);
    });

    it('PIRR.md contains correct repository status', () => {
      assert.fileContent('PIRR.md', 'Repository: private-project');
      assert.fileContent('PIRR.md', 'This repository is set to: **Private**');
    });

    it('does not create CodeQL workflow for private repos', () => {
      assert.noFile('.github/workflows/codeql.yml');
    });

    it('creates other security files', () => {
      assert.file(['.github/dependabot.yml', '.github/workflows/ci.yml']);
    });
  });

  describe('input validation', () => {
    it('validates project name format', async () => {
      const generator = helpers.createGenerator(
        require.resolve('../generators/app'),
        [],
        {},
      );

      const promptModule = {
        type: 'input',
        name: 'name',
        validate: generator._prompts[0].validate,
      };

      expect(promptModule.validate('valid-name')).toBe(true);
      expect(promptModule.validate('Invalid Name')).toContain('lowercase');
      expect(promptModule.validate('invalid_name')).toContain('lowercase');
    });
  });
});
