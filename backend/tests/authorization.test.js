import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize } from '../middleware/auth.js';
import { register } from '../controllers/authController.js';

test('authorize rejects a customer from admin operations', () => {
  let forwarded;
  authorize('admin', 'manager')({ user: { role: 'customer' } }, {}, (error) => { forwarded = error; });
  assert.equal(forwarded?.statusCode, 403);
});

test('authorize permits an allowed manager', () => {
  let nextCalled = false;
  authorize('admin', 'manager')({ user: { role: 'manager' } }, {}, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
});

test('public registration refuses administrator roles before database access', async () => {
  const error = await new Promise((resolve) => {
    register({ body: { name: 'Unauthorized', email: 'person@example.com', password: 'password123', role: 'admin' } }, {}, resolve);
  });
  assert.equal(error?.statusCode, 403);
});
