// eslint.config.js
const { configs } = require('@eslint/js');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  // 1) Don’t lint templates or the config file
  {
    ignores: ['generators/app/templates/**', 'eslint.config.js'],
  },

  // 2) eslint:recommended ruleset
  configs.recommended,

  // 3) Node/CommonJS globals + Prettier
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // enforce Prettier formatting
      'no-console': 'off', // allow console.log in generator
    },
  },
];
