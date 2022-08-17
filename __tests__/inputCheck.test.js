const inputCheck = require('../utils/inputCheck');

test('inputCheck() returns null when all properties exist', () => {
  const obj = {role: 'service'};

  expect(inputCheck(obj, 'role')).toBe(null);
});

test('inputCheck() returns an object when a property is missing', () => {
  const obj = {role: 'service', department: ''};

  expect(inputCheck(obj, 'role', 'department')).toEqual(
    expect.objectContaining({
      error: expect.stringContaining('No department specified')
    })
  );
});