const { greet } = require('../src/index');

describe('greet function', () => {
  test('returns greeting with provided name', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
  });

  test('returns default greeting when no name provided', () => {
    expect(greet()).toBe('Hello, World!');
  });

  test('handles empty string', () => {
    expect(greet('')).toBe('Hello, !');
  });
});
