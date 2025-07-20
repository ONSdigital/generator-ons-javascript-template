/**
 * Greets a person by name
 * @param {string} name - The name to greet
 * @returns {string} A greeting message
 */
function greet(name = 'World') {
  return `Hello, ${name}!`;
}

// Run if called directly
if (require.main === module) {
  console.log(greet());
}

module.exports = { greet };
