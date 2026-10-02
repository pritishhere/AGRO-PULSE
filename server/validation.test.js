const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidPhoneNumber } = require('./server.js');

test('accepts common mobile formats', () => {
  assert.equal(isValidPhoneNumber('9876543210'), true);
  assert.equal(isValidPhoneNumber('+91 98765 43210'), true);
  assert.equal(isValidPhoneNumber('+919876543210'), true);
  assert.equal(isValidPhoneNumber('98765-43210'), true);
});

test('rejects invalid phone inputs', () => {
  assert.equal(isValidPhoneNumber(''), false);
  assert.equal(isValidPhoneNumber('abc'), false);
  assert.equal(isValidPhoneNumber('12345'), false);
  assert.equal(isValidPhoneNumber('+1'), false);
});
