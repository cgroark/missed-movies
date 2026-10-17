const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function setup(route, { authenticated = true, found = true, moveFails = false } = {}) {
  const handlers = {};
  const operations = [];
  const router = Object.fromEntries(
    ['get', 'post', 'patch', 'delete'].map(method => [
      method,
      (url, handler) => {
        handlers[`${method} ${url}`] = handler;
      },
    ])
  );
  const supabase = {
    from(table) {
      const operation = { table, filters: [] };
      operations.push(operation);
      const query = {
        select() {
          return query;
        },
        eq(key, value) {
          operation.filters.push([key, value]);
          return query;
        },
        update(value) {
          operation.action = 'update';
          operation.value = value;
          return query;
        },
        delete() {
          operation.action = 'delete';
          return query;
        },
        maybeSingle() {
          return Promise.resolve({ data: found ? { id: 5 } : null, error: null });
        },
        then(resolve, reject) {
          const error =
            moveFails && operation.action === 'update' ? new Error('Move failed') : null;
          return Promise.resolve({ data: [{ id: 5 }], error }).then(resolve, reject);
        },
      };
      return query;
    },
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/routes', `${route}.ts`), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(compiled, {
    exports: {},
    Error,
    require(name) {
      if (name === 'express') return { Router: () => router };
      if (name.includes('supabaseClient')) return { supabase };
      if (name.includes('utils'))
        return {
          getUserFromRequest: async (_req, res) => {
            if (authenticated) return { id: 'user-1' };
            res.status(401).json({ error: 'Unauthorized' });
            return null;
          },
        };
      throw new Error(`Unexpected import ${name}`);
    },
  });
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  return { operations, res, run: id => handlers['delete /:id']({ params: { id } }, res) };
}

test('category delete requires authentication', async () => {
  const app = setup('categories', { authenticated: false });
  await app.run('5');
  assert.equal(app.res.statusCode, 401);
  assert.equal(app.operations.length, 0);
});
test('default category and malformed IDs cannot be deleted', async () => {
  for (const id of ['1', 'bad', '-2']) {
    const app = setup('categories');
    await app.run(id);
    assert.equal(app.res.statusCode, 400);
    assert.equal(app.operations.length, 0);
  }
});
test('missing or unowned category does not move or delete movies', async () => {
  const app = setup('categories', { found: false });
  await app.run('5');
  assert.equal(app.res.statusCode, 404);
  assert.equal(app.operations.length, 1);
  assert.deepEqual(app.operations[0].filters, [
    ['id', 5],
    ['user_id', 'user-1'],
  ]);
});
test('category movies move to default before deleting, scoped to user', async () => {
  const app = setup('categories');
  await app.run('5');
  assert.equal(app.res.statusCode, 200);
  assert.deepEqual(JSON.parse(JSON.stringify(app.operations)), [
    {
      table: 'categories',
      filters: [
        ['id', 5],
        ['user_id', 'user-1'],
      ],
    },
    {
      table: 'movies',
      filters: [
        ['category', 5],
        ['user_id', 'user-1'],
      ],
      action: 'update',
      value: { category: 1 },
    },
    {
      table: 'categories',
      filters: [
        ['id', 5],
        ['user_id', 'user-1'],
      ],
      action: 'delete',
    },
  ]);
});
test('failed movie move prevents category deletion', async () => {
  const app = setup('categories', { moveFails: true });
  await app.run('5');
  assert.equal(app.res.statusCode, 500);
  assert.equal(
    app.operations.some(operation => operation.action === 'delete'),
    false
  );
});
test('movie deletion is scoped to authenticated user', async () => {
  const app = setup('movies');
  await app.run('5');
  assert.deepEqual(app.operations[0].filters, [
    ['id', '5'],
    ['user_id', 'user-1'],
  ]);
  const denied = setup('movies', { authenticated: false });
  await denied.run('5');
  assert.equal(denied.res.statusCode, 401);
  assert.equal(denied.operations.length, 0);
});
