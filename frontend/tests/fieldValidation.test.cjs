const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function setup() {
  let errors = {};
  let focused;
  const exports = {};
  const source = fs.readFileSync(
    path.join(__dirname, '../src/hooks/useFieldValidation.ts'),
    'utf8'
  );
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: () => ({
      useState: () => [
        errors,
        value => {
          errors = typeof value === 'function' ? value(errors) : value;
        },
      ],
    }),
    document: {
      getElementById: id => ({
        focus() {
          focused = id;
        },
      }),
    },
  });
  return { exports, errors: () => JSON.parse(JSON.stringify(errors)), focused: () => focused };
}

test('blank and whitespace-only required fields get individual errors', () => {
  const app = setup();
  const errors = app.exports.validateFields([
    { id: 'email', label: 'Email', value: '' },
    { id: 'name', label: 'Category name', value: '   ' },
    { id: 'status', label: 'Status', value: '' },
  ]);
  assert.equal(errors.email, 'Email is required.');
  assert.equal(errors.name, 'Category name is required.');
  assert.equal(errors.status, 'Status is required.');
});
test('email and password confirmation validate without trimming passwords', () => {
  const app = setup();
  const errors = app.exports.validateFields([
    { id: 'email', label: 'Email', value: 'invalid', email: true },
    { id: 'confirmPassword', label: 'Confirm password', value: 'password ', matches: 'password' },
  ]);
  assert.equal(errors.email, 'Enter a valid email address.');
  assert.equal(errors.confirmPassword, 'Passwords do not match.');
});
test('valid auth and movie values pass', () => {
  const app = setup();
  assert.equal(
    Object.keys(
      app.exports.validateFields([
        { id: 'email', label: 'Email', value: ' person@example.com ', email: true },
        { id: 'category', label: 'Category', value: 1 },
        { id: 'status', label: 'Status', value: 2 },
        {
          id: 'confirmPassword',
          label: 'Confirm password',
          value: 'password',
          matches: 'password',
        },
      ])
    ).length,
    0
  );
});
test('invalid submission focuses first field; touching clears only its error', () => {
  const app = setup();
  const hook = app.exports.default();
  assert.equal(
    hook.validate([
      { id: 'email', label: 'Email', value: '' },
      { id: 'password', label: 'Password', value: '' },
    ]),
    false
  );
  assert.equal(app.focused(), 'email');
  hook.clearField('email');
  assert.deepEqual(app.errors(), { password: 'Password is required.' });
  hook.clearFields();
  assert.deepEqual(app.errors(), {});
});
