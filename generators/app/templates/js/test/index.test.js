const { add, subtract, multiply, divide } = require('../index');

test('should add two numbers', () => {
  expect(add(2, 3)).toBe(5);
});

test('should subtract two numbers', () => {
  expect(subtract(5, 3)).toBe(2);
});

test('should multiply two numbers', () => {
  expect(multiply(2, 3)).toBe(6);
});

test('should divide two numbers', () => {
  expect(divide(6, 3)).toBe(2);
});

test('should throw an error when dividing by zero', () => {
  expect(() => divide(6, 0)).toThrow('Cannot divide by zero');
});
