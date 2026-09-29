const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');

const ALLOWED_ORIGIN = 'https://frontend.test';
const ADMIN_TOKEN = 'test-admin-token-with-sufficient-entropy';

process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/test';
process.env.FRONTEND_ORIGIN = ALLOWED_ORIGIN;
process.env.ADMIN_API_TOKEN = ADMIN_TOKEN;
process.env.NODE_ENV = 'test';

const insertedContacts = [];
const uploadedFiles = [];

const fakePrisma = {
  contact: {
    async create({ data }) {
      insertedContacts.push(data);
      return { id: insertedContacts.length, ...data };
    },
    async findMany() {
      return [];
    },
    async update() {
      throw new Error('Not implemented in this test');
    },
  },
  product: {
    async findMany() {
      return [];
    },
  },
  project: {
    async findMany() {
      return [];
    },
  },
  service: {
    async findMany() {
      return [];
    },
  },
};

const fakeDb = {
  prisma: fakePrisma,
  async testConnection() {},
  async disconnect() {},
};

const dbModulePath = require.resolve('../db');
require.cache[dbModulePath] = {
  id: dbModulePath,
  filename: dbModulePath,
  loaded: true,
  exports: fakeDb,
  children: [],
  paths: [],
};

const storageModulePath = require.resolve('../storage/supabaseStorage');
require.cache[storageModulePath] = {
  id: storageModulePath,
  filename: storageModulePath,
  loaded: true,
  exports: {
    async uploadImage(file, folder) {
      uploadedFiles.push({ file, folder });
      return {
        publicUrl: `https://storage.test/${folder}/image.png`,
        path: `${folder}/image.png`,
      };
    },
  },
  children: [],
  paths: [],
};

const { app } = require('../server');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve, reject) => {
    server = app.listen(0, '127.0.0.1', resolve);
    server.once('error', reject);
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

function request(path, options = {}) {
  const {
    headers: inputHeaders,
    ip = '203.0.113.10',
    ...requestOptions
  } = options;
  const headers = new Headers(inputHeaders);
  headers.set('Origin', headers.get('Origin') || ALLOWED_ORIGIN);
  headers.set('X-Forwarded-For', ip);

  return fetch(`${baseUrl}${path}`, {
    ...requestOptions,
    headers,
  });
}

function jsonRequest(path, body, options = {}) {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  return request(path, {
    ...options,
    method: options.method || 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function uploadRequest(formData, options = {}) {
  const headers = new Headers(options.headers);
  if (options.authorized !== false) {
    headers.set('x-admin-token', ADMIN_TOKEN);
  }

  return request('/api/admin/uploads/image', {
    method: 'POST',
    ...options,
    headers,
    body: formData,
  });
}

function createPngBuffer(size) {
  const minimumPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64',
  );

  if (!size || size <= minimumPng.length) return minimumPng;
  const buffer = Buffer.alloc(size);
  minimumPng.copy(buffer);
  return buffer;
}

test('health endpoints and defensive headers are available', async () => {
  const liveResponse = await request('/api/health/live');
  assert.equal(liveResponse.status, 200);
  assert.equal(liveResponse.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(liveResponse.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(liveResponse.headers.get('x-frame-options'), 'DENY');
  assert.equal(liveResponse.headers.get('x-powered-by'), null);

  const readyResponse = await request('/api/health/ready');
  assert.equal(readyResponse.status, 200);
  assert.deepEqual(await readyResponse.json(), {
    ok: true,
    service: 'Kyoru Studio API',
    database: 'reachable',
  });
});

test('HSTS is emitted only for production HTTPS requests', async () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    const response = await request('/api/health/live', {
      headers: { 'X-Forwarded-Proto': 'https' },
      ip: '203.0.113.11',
    });
    assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
  } finally {
    process.env.NODE_ENV = previousNodeEnv;
  }
});

test('CORS allows the configured origin and rejects other origins with 403', async () => {
  const preflight = await request('/api/contacts', {
    method: 'OPTIONS',
    headers: {
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
    ip: '203.0.113.12',
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), ALLOWED_ORIGIN);

  const rejected = await request('/api/health/live', {
    headers: { Origin: 'https://untrusted.test' },
    ip: '203.0.113.13',
  });
  assert.equal(rejected.status, 403);
  assert.deepEqual(await rejected.json(), {
    ok: false,
    error: 'Origin is not allowed by the CORS policy',
  });
});

test('admin endpoints require the token and never allow caching', async () => {
  const unauthorized = await request('/api/admin/projects', {
    ip: '203.0.113.14',
  });
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get('cache-control'), 'no-store');

  const authorized = await request('/api/admin/projects', {
    headers: { 'x-admin-token': ADMIN_TOKEN },
    ip: '203.0.113.15',
  });
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await authorized.json(), { ok: true, data: [] });

  const publicResponse = await request('/api/projects', { ip: '203.0.113.16' });
  assert.equal(publicResponse.status, 200);
  assert.equal(publicResponse.headers.get('cache-control'), null);
});

test('admin authentication rejects malformed JSON before body parsing', async () => {
  const response = await jsonRequest('/api/admin/projects', '{"title":', {
    method: 'POST',
    ip: '203.0.113.17',
  });
  assert.equal(response.status, 401);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await response.json(), { ok: false, error: 'Unauthorized' });
});

test('contact submission is normalized, private and deduplicated', async () => {
  const payload = {
    name: '  Ana  ',
    email: ' ANA@EXAMPLE.COM ',
    subject: ' Desarrollo Web ',
    message: '  Necesito desarrollar un sitio corporativo accesible.  ',
  };

  const first = await jsonRequest('/api/contacts', payload, { ip: '203.0.113.20' });
  assert.equal(first.status, 201);
  assert.equal(first.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await first.json(), {
    ok: true,
    message: 'Contact message received',
  });
  assert.deepEqual(insertedContacts[0], {
    name: 'Ana',
    email: 'ana@example.com',
    phone: null,
    subject: 'Desarrollo Web',
    message: 'Necesito desarrollar un sitio corporativo accesible.',
  });

  const duplicate = await jsonRequest('/api/contacts', payload, { ip: '203.0.113.20' });
  assert.equal(duplicate.status, 201);
  assert.deepEqual(await duplicate.json(), {
    ok: true,
    message: 'Contact message received',
  });
  assert.equal(insertedContacts.length, 1);
});

test('concurrent duplicate contacts share persistence and never mask a failure', async () => {
  const originalCreate = fakePrisma.contact.create;
  let rejectInsert;
  let notifyStarted;
  let insertAttempts = 0;
  const insertStarted = new Promise((resolve) => {
    notifyStarted = resolve;
  });
  const payload = {
    name: 'Mario',
    email: 'mario.concurrent@example.com',
    subject: 'Consulta general',
    message: 'Este mensaje comprueba la deduplicación concurrente segura.',
  };

  fakePrisma.contact.create = async () => {
    insertAttempts += 1;
    notifyStarted();
    return new Promise((resolve, reject) => {
      rejectInsert = reject;
    });
  };

  let responses;
  try {
    const firstRequest = jsonRequest('/api/contacts', payload, { ip: '203.0.113.25' });
    await insertStarted;
    const duplicateRequest = jsonRequest('/api/contacts', payload, { ip: '203.0.113.25' });
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(insertAttempts, 1);

    rejectInsert(new Error('Simulated database failure'));
    responses = await Promise.all([firstRequest, duplicateRequest]);
  } finally {
    fakePrisma.contact.create = originalCreate;
  }

  assert.deepEqual(
    responses.map((response) => response.status),
    [500, 500],
  );

  const retry = await jsonRequest('/api/contacts', payload, { ip: '203.0.113.25' });
  assert.equal(retry.status, 201);
  assert.equal(insertedContacts.length, 2);
});

test('contact validation rejects invalid types, short messages and malformed JSON', async () => {
  const initialContactCount = insertedContacts.length;
  const shortMessage = await jsonRequest(
    '/api/contacts',
    { name: 'Ana', email: 'ana@example.com', message: 'Muy corto' },
    { ip: '203.0.113.21' },
  );
  assert.equal(shortMessage.status, 400);

  const wrongType = await jsonRequest(
    '/api/contacts',
    { name: { value: 'Ana' }, email: 'ana@example.com', message: 'Un mensaje suficientemente largo.' },
    { ip: '203.0.113.22' },
  );
  assert.equal(wrongType.status, 400);

  const malformed = await jsonRequest('/api/contacts', '{"name":', {
    ip: '203.0.113.23',
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), {
    ok: false,
    error: 'Invalid JSON payload',
  });
  assert.equal(insertedContacts.length, initialContactCount);
});

test('contact validation enforces every field maximum', async () => {
  const initialContactCount = insertedContacts.length;
  const validBase = {
    name: 'Ana',
    email: 'ana@example.com',
    message: 'Un mensaje suficientemente largo para validación.',
  };
  const invalidPayloads = [
    { ...validBase, name: 'n'.repeat(141) },
    { ...validBase, email: `${'e'.repeat(243)}@example.com` },
    { ...validBase, phone: '1'.repeat(81) },
    { ...validBase, subject: 's'.repeat(181) },
    { ...validBase, message: 'm'.repeat(5_001) },
  ];

  for (const [index, payload] of invalidPayloads.entries()) {
    const response = await jsonRequest('/api/contacts', payload, {
      ip: `198.51.100.${index + 10}`,
    });
    assert.equal(response.status, 400);
  }

  assert.equal(insertedContacts.length, initialContactCount);
});

test('contact body limit and rate limit return controlled responses', async () => {
  const oversized = await jsonRequest(
    '/api/contacts',
    {
      name: 'Ana',
      email: 'ana@example.com',
      message: 'x'.repeat(40 * 1_024),
    },
    { ip: '203.0.113.24' },
  );
  assert.equal(oversized.status, 413);
  assert.deepEqual(await oversized.json(), {
    ok: false,
    error: 'Request payload too large',
  });

  let response;
  for (let attempt = 1; attempt <= 11; attempt += 1) {
    response = await jsonRequest(
      '/api/contacts',
      { name: 'Ana', email: 'invalid', message: 'Mensaje inválido pero suficientemente largo.' },
      { ip: `192.0.2.${attempt}, 198.51.100.90` },
    );

    if (attempt <= 10) assert.equal(response.status, 400);
  }

  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get('retry-after')) > 0);
});

test('readiness returns 503 after the controlled database timeout', async () => {
  const originalTestConnection = fakeDb.testConnection;
  fakeDb.testConnection = () => new Promise(() => {});
  const startedAt = Date.now();

  try {
    const response = await request('/api/health/ready', { ip: '203.0.113.30' });
    const elapsed = Date.now() - startedAt;
    assert.equal(response.status, 503);
    assert.ok(elapsed >= 2_800 && elapsed < 5_000);
    assert.deepEqual(await response.json(), {
      ok: false,
      error: 'Service temporarily unavailable',
    });
  } finally {
    fakeDb.testConnection = originalTestConnection;
  }
});

test('upload authentication runs before multipart parsing', async () => {
  const formData = new FormData();
  formData.append('file', new Blob(['not-an-image'], { type: 'text/plain' }), 'test.txt');

  const response = await uploadRequest(formData, {
    authorized: false,
    ip: '203.0.113.40',
  });
  assert.equal(response.status, 401);
  assert.equal(uploadedFiles.length, 0);
});

test('uploads reject SVG and MIME spoofing before storage', async () => {
  const svgForm = new FormData();
  svgForm.append('file', new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], { type: 'image/svg+xml' }), 'test.svg');
  const svgResponse = await uploadRequest(svgForm, { ip: '203.0.113.41' });
  assert.equal(svgResponse.status, 400);

  const spoofedForm = new FormData();
  spoofedForm.append('file', new Blob(['plain text'], { type: 'image/png' }), 'fake.png');
  const spoofedResponse = await uploadRequest(spoofedForm, { ip: '203.0.113.42' });
  assert.equal(spoofedResponse.status, 400);
  assert.equal(uploadedFiles.length, 0);
});

test('uploads accept valid PNG signatures through 5 MiB and reject larger files', async () => {
  const validForm = new FormData();
  validForm.append('file', new Blob([createPngBuffer()], { type: 'image/png' }), 'pixel.png');
  validForm.append('folder', 'projects');
  const validResponse = await uploadRequest(validForm, { ip: '203.0.113.43' });
  assert.equal(validResponse.status, 201);
  assert.equal(uploadedFiles.length, 1);
  assert.equal(uploadedFiles[0].folder, 'projects');

  const maxSizeForm = new FormData();
  maxSizeForm.append(
    'file',
    new Blob([createPngBuffer(5 * 1_024 * 1_024)], { type: 'image/png' }),
    'maximum.png',
  );
  const maxSizeResponse = await uploadRequest(maxSizeForm, { ip: '203.0.113.44' });
  assert.equal(maxSizeResponse.status, 201);
  assert.equal(uploadedFiles.length, 2);

  const oversizedForm = new FormData();
  oversizedForm.append(
    'file',
    new Blob([createPngBuffer(5 * 1_024 * 1_024 + 1)], { type: 'image/png' }),
    'too-large.png',
  );
  const oversizedResponse = await uploadRequest(oversizedForm, { ip: '203.0.113.45' });
  assert.equal(oversizedResponse.status, 413);
  assert.equal(uploadedFiles.length, 2);
});

test('unexpected multipart fields produce a controlled 400', async () => {
  const formData = new FormData();
  formData.append('file', new Blob([createPngBuffer()], { type: 'image/png' }), 'pixel.png');
  formData.append('folder', 'general');
  formData.append('unexpected', 'value');

  const response = await uploadRequest(formData, { ip: '203.0.113.46' });
  assert.equal(response.status, 400);
});
