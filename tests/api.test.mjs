import test from 'node:test';
import assert from 'node:assert/strict';
import { POST as lead } from '../api/lead.js';
import { POST as track } from '../api/track.js';
const company_id = '0aad4a59-d6ee-47c9-bb9e-da5e2bb3fb48';
const request = (body, headers = {}) => new Request('https://navagli.com/api', {
  method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
});
const inserted = [];
let definitions = 0;
globalThis.fetch = async (url, options) => {
  const path = new URL(url).pathname;
  if (path.endsWith('/companies')) return Response.json({ id: company_id });
  if (path.endsWith('/analytics_event_definitions')) { definitions++; return Response.json([]); }
  if (path.endsWith('/rpc/analytics_salt')) return Response.json('daily-salt-from-db');
  if (path.endsWith('/lead') || path.endsWith('/analytics_events')) {
    inserted.push({ path, body: JSON.parse(options.body) });
    return new Response(null, { status: 201 });
  }
  throw new Error(`Unexpected URL: ${url}`);
};

test('endpoints handle missing configuration, invalid bodies and honeypots', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.ANALYTICS_SALT;
  assert.equal((await track(request({}))).status, 204);
  assert.equal((await lead(request(null))).status, 400);
  assert.equal((await lead(request({ company_website: 'spam' }))).status, 200);
  assert.equal((await lead(request({ company_id, name: 'Test' }))).status, 400);
  assert.equal((await lead(request({ company_id, name: 'Test', phone: '123' }))).status, 500);
  assert.equal(inserted.length, 0);
});

test('leads are saved, trimmed and limited; email or phone is sufficient', async () => {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key';
  process.env.ANALYTICS_SALT = 'test-environment-salt';
  process.env.VITE_COMPANY_ID = company_id;
  assert.equal((await lead(request({ company_id, name: ' Test ', phone: '123', message: 'x'.repeat(5000) }))).status, 201);
  assert.equal(inserted.at(-1).body.name, 'Test');
  assert.equal(inserted.at(-1).body.message.length, 4000);
  assert.equal((await lead(request({ company_id, name: 'Test', email: 'test@example.com' }))).status, 201);
  assert.equal((await lead(request({ company_id, name: 'Test', email: 'invalid' }))).status, 400);
  assert.equal((await lead(request({ company_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Test', phone: '123' }))).status, 400);
});

test('analytics derives identity on server and reserved conversions skip definitions', async () => {
  const headers = { 'sec-fetch-site': 'same-origin', 'user-agent': 'Mozilla/5.0 Safari/604.1', host: 'navagli.com', 'x-real-ip': '192.0.2.1', 'x-vercel-ip-country': 'ES' };
  const body = { company_id, event_type: 'cta_click', event_key: 'form_submit', path: '/contacto?email=private', visitor: 'forged', country: 'US', device: 'forged', session_id: 'forged' };
  assert.equal((await track(request(body, headers))).status, 204);
  const event = inserted.at(-1).body;
  assert.equal(event.event_key, 'form_submit');
  assert.equal(event.path, '/contacto');
  assert.equal(event.country, 'ES');
  assert.equal(event.device, 'desktop');
  assert.notEqual(event.visitor, 'forged');
  assert.equal('session_id' in event, false);
  assert.equal(definitions, 0);
  const count = inserted.length;
  await track(request({ ...body, event_key: 'unregistered' }, headers));
  await track(request(body, { ...headers, 'sec-fetch-site': 'cross-site' }));
  await track(request(body, { ...headers, 'user-agent': 'Googlebot' }));
  assert.equal(inserted.length, count);
});
