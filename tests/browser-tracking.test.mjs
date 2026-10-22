import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
const company = '0aad4a59-d6ee-47c9-bb9e-da5e2bb3fb48';
async function browserModule(entry, prod = true) {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, format: 'esm', define: { 'import.meta.env.VITE_COMPANY_ID': JSON.stringify(company), 'import.meta.env.PROD': String(prod) } });
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
}
const blobs = [];
let clock = 0;
globalThis.window = Object.assign(new EventTarget(), { location: { pathname: '/', search: '?utm_campaign=test', host: 'navagli.com' }, innerHeight: 800, scrollY: 0 });
globalThis.document = Object.assign(new EventTarget(), { visibilityState: 'visible', referrer: 'https://www.google.com/search?private=true', documentElement: { scrollHeight: 2000 } });
globalThis.localStorage = { getItem: () => null };
globalThis.requestAnimationFrame = (callback) => callback();
Object.defineProperty(globalThis, 'performance', { value: { now: () => clock }, configurable: true });
navigator.sendBeacon = (_, blob) => { blobs.push(blob); return true; };
const events = () => Promise.all(blobs.map(async (blob) => JSON.parse(await blob.text())));

test('production browser tracking deduplicates pages, measures visibility, scroll and conversions', async () => {
  const analytics = await browserModule('src/lib/analytics.js');
  analytics.initAutoTracking();
  analytics.initAutoTracking();
  analytics.trackPageview('/');
  analytics.trackPageview('/');
  assert.equal((await events()).filter((x) => x.event_type === 'page_view').length, 1);
  assert.equal((await events())[0].referrer, 'google.com');
  window.scrollY = 1200;
  window.dispatchEvent(new Event('scroll'));
  window.dispatchEvent(new Event('scroll'));
  assert.equal((await events()).filter((x) => x.event_type === 'scroll_depth').length, 4);
  clock = 5000;
  document.visibilityState = 'hidden';
  document.dispatchEvent(new Event('visibilitychange'));
  assert.equal((await events()).find((x) => x.event_type === 'engagement').value, 5);
  clock = 15000;
  document.visibilityState = 'visible';
  document.dispatchEvent(new Event('visibilitychange'));
  clock = 18000;
  analytics.trackPageview('/contacto');
  assert.equal((await events()).filter((x) => x.event_type === 'engagement').at(-1).value, 3);
  assert.equal((await events()).filter((x) => x.event_type === 'page_view').at(-1).utm_campaign, undefined);
  const before = blobs.length;
  analytics.setMeasurement(false);
  window.dispatchEvent(new Event('moira:lead-sent'));
  analytics.trackEvent('phone_click');
  assert.equal(blobs.length, before);
  analytics.setMeasurement(true);
  window.dispatchEvent(new Event('moira:lead-sent'));
  assert.equal((await events()).filter((x) => x.event_key === 'form_submit').length, 1);
  analytics.trackNotFound();
  analytics.trackNotFound();
  assert.equal((await events()).filter((x) => x.event_type === 'not_found').length, 1);
  assert.equal(analytics.keyForClick({ closest: (selector) => selector === '[data-track-event]' ? { getAttribute: () => 'custom_click' } : null }), 'custom_click');
});

test('lead conversion is emitted only after a saved request, never on error or honeypot acknowledgement', async () => {
  const { submitLead } = await browserModule('src/lib/leads.js');
  let notifications = 0;
  window.addEventListener('moira:lead-sent', () => notifications++);
  for (const status of [400, 500, 200, 201]) {
    globalThis.fetch = async () => new Response(null, { status });
    const result = await submitLead({ name: 'Test', phone: '123' });
    assert.equal(result.ok, status < 400);
  }
  assert.equal(notifications, 1);
});

test('development tracking sends no events', async () => {
  const analytics = await browserModule('src/lib/analytics.js', false);
  const before = blobs.length;
  analytics.trackPageview('/development');
  analytics.trackEvent('phone_click');
  assert.equal(blobs.length, before);
});
