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
let crmEnabled = true;
let failedTable = null;
let backendError = null;
globalThis.fetch = async (url, options) => {
  const path = new URL(url).pathname;
  if (failedTable && path.endsWith(`/${failedTable}`)) return Response.json(backendError, { status: 401 });
  if (path.endsWith('/companies')) return Response.json({ id: company_id });
  if (path.endsWith('/company_modules')) {
    assert.equal(new URL(url).searchParams.get('company_id'), `eq.${company_id}`);
    assert.equal(new URL(url).searchParams.get('module_key'), 'eq.crm');
    return Response.json({ is_enabled: crmEnabled });
  }
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
  process.env.VITE_COMPANY_ID = company_id;
  assert.equal((await track(request({}))).status, 204);
  assert.equal((await lead(request(null))).status, 400);
  assert.equal((await lead(request({ company_website: 'spam' }))).status, 200);
  assert.equal((await lead(request({ company_id, name: 'Test' }))).status, 400);
  assert.equal((await lead(request({ company_id, name: 'Test', phone: '123' }))).status, 500);
  assert.equal(inserted.length, 0);
});

test('lead endpoint requires deployment tenant and an enabled CRM module', async () => {
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key';
  const body = { company_id, name: 'Test', phone: '123' };
  const count = inserted.length;
  delete process.env.VITE_COMPANY_ID;
  assert.equal((await lead(request(body))).status, 503);
  process.env.VITE_COMPANY_ID = 'invalid';
  assert.equal((await lead(request(body))).status, 503);
  process.env.VITE_COMPANY_ID = company_id;
  crmEnabled = false;
  assert.equal((await lead(request(body))).status, 503);
  crmEnabled = true;
  assert.equal(inserted.length, count);
});

test('lead attribution is limited to public fields and consent requires an explicit boolean and text version', async () => {
  const body = { company_id, name: 'Test', phone: '123', source_item: 'x'.repeat(250),
    source_referrer: 'https://example.com', source_path: '/proyectos/test', source_campaign: 'reformas',
    utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'reformas', utm_term: 'cocinas', utm_content: 'banner',
    consent_given: true, consent_text_version: 'navagli-contact-2026-10-v1', contact_id: 'forged' };
  assert.equal((await lead(request(body))).status, 201);
  const saved = inserted.at(-1).body;
  assert.equal(saved.source_item.length, 200);
  assert.equal(saved.source_utm_source, 'google');
  assert.equal(saved.source_utm_medium, 'cpc');
  assert.equal(saved.source_utm_content, 'banner');
  assert.equal(saved.source_utm_term, 'cocinas');
  assert.equal(saved.source_referrer, 'https://example.com');
  assert.equal(saved.consent_given, true);
  assert.ok(saved.consent_at);
  assert.equal(saved.consent_source, 'public_contact_form');
  assert.equal('contact_id' in saved, false);
  for (const values of [{ consent_given: false }, { consent_given: 'true' }, { consent_text_version: '' }]) {
    assert.equal((await lead(request({ ...body, ...values }))).status, 201);
    assert.equal(inserted.at(-1).body.consent_given, false);
  }
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

test('lead failures distinguish invalid credentials and schema problems without exposing backend details', async () => {
  const count = inserted.length;
  const body = { company_id, name: 'Test', phone: '123' };
  failedTable = 'companies';
  backendError = { message: 'Invalid API key', hint: 'secret-backend-hint' };
  const auth = await lead(request(body));
  assert.equal(auth.status, 500);
  assert.equal((await auth.json()).code, 'LEAD_BACKEND_AUTH');
  assert.equal(inserted.length, count);
  failedTable = 'lead';
  backendError = { code: 'PGRST204', message: 'Missing column', details: 'private-value' };
  const schema = await lead(request(body));
  assert.equal(schema.status, 500);
  const schemaBody = await schema.text();
  assert.ok(schemaBody.includes('LEAD_SCHEMA_MISMATCH'));
  assert.ok(!schemaBody.includes('private-value'));
  failedTable = 'company_modules';
  backendError = { code: 'PGRST205', message: 'Missing table' };
  const moduleResponse = await lead(request(body));
  assert.equal(moduleResponse.status, 503);
  failedTable = null;
  backendError = null;
});
