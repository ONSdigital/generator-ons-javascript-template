module.exports = {
  // Run ESLint and Prettier on staged JS/TS files
  '**/*.{js,ts}': ['eslint --fix', 'prettier --write'],
};
