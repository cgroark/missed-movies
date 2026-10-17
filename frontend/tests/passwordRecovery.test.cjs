const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function initialize(hash) {
  const location = { hash };
  const source = fs
    .readFileSync(path.join(__dirname, '../src/lib/supabaseClient.ts'), 'utf8')
    .replace(/import\.meta\.env\.VITE_SUPABASE_URL/g, "'https://example.supabase.co'")
    .replace(/import\.meta\.env\.VITE_SUPABASE_ANON_KEY/g, "'test-public-key'");
  const exports = {};
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports,
    URLSearchParams,
    window: { location },
    require: () => ({
      createClient() {
        // Model the SDK consuming the callback before React mounts its auth provider.
        location.hash = '';
        return {};
      },
    }),
  });
  return { recovery: exports.isPasswordRecoveryRedirect, hash: location.hash };
}

test('recovery intent survives SDK consuming the callback before React mounts', () => {
  const result = initialize('#access_token=test&type=recovery&refresh_token=test');
  assert.equal(result.recovery, true);
  assert.equal(result.hash, '');
});
test('ordinary magic links do not trigger the password reset screen', () => {
  assert.equal(initialize('#access_token=test&type=magiclink').recovery, false);
});
test('ordinary page loads do not trigger recovery', () => {
  assert.equal(initialize('').recovery, false);
});
