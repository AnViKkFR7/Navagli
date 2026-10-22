import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePath, isInternalPath, isBot, isSameOrigin, parseTrackPayload, referrerHost, visitorHash, businessDay } from '../src/lib/trackCore.js';
const company_id = '0aad4a59-d6ee-47c9-bb9e-da5e2bb3fb48';

test('normalizes identifiers and removes queries; excludes internal traffic', () => {
  assert.equal(normalizePath(`/pedido/${company_id}?email=private#x`), '/pedido/:id');
  assert.equal(normalizePath('/reserva/123456'), '/reserva/:token');
  assert.equal(normalizePath('//acceso//abcdefghijklmnopqrstuvwx/'), '/acceso/:token');
  assert.equal(isInternalPath('/ADMIN/proyectos'), true);
  assert.equal(parseTrackPayload({ company_id, event_type: 'page_view', path: '/ADMIN' }), null);
});

test('rejects bots and cross-origin traffic', () => {
  for (const ua of ['', 'Googlebot', 'HeadlessChrome', 'Lighthouse']) assert.equal(isBot(ua), true);
  assert.equal(isBot('Mozilla/5.0 Safari/604.1'), false);
  assert.equal(isSameOrigin((key) => ({ 'sec-fetch-site': 'same-origin' })[key]), true);
  assert.equal(isSameOrigin((key) => ({ 'sec-fetch-site': 'cross-site' })[key]), false);
  assert.equal(isSameOrigin(() => null), false);
});

test('accepts reserved conversions without definitions and validates engagement', () => {
  const base = { company_id, path: '/contacto' };
  for (const key of ['phone_click', 'email_click', 'form_submit']) {
    assert.equal(parseTrackPayload({ ...base, event_type: 'cta_click', event_key: key }, { activeEventKeys: new Set() }).event_key, key);
  }
  assert.equal(parseTrackPayload({ ...base, event_type: 'cta_click', event_key: 'unregistered' }, { activeEventKeys: new Set() }), null);
  assert.equal(parseTrackPayload({ ...base, event_type: 'scroll_depth', value: 26 }), null);
  assert.equal(parseTrackPayload({ ...base, event_type: 'engagement', value: 99999 }).value, 7200);
  assert.equal(parseTrackPayload(null), null);
  assert.equal(parseTrackPayload({ ...base, company_id: 'invalid', event_type: 'page_view' }), null);
});

test('referrers contain only external domains', () => {
  assert.equal(referrerHost('https://www.google.com/search?email=x', 'navagli.com'), 'google.com');
  assert.equal(referrerHost('https://navagli.com/contacto', 'navagli.com'), undefined);
  assert.equal(referrerHost('https://checkout.stripe.com/private', 'navagli.com'), undefined);
});

test('visitor hash is stable within a day and changes next day', async () => {
  const hash = await visitorHash('secret', '2026-10-22', '192.0.2.1', 'browser');
  assert.equal(hash, await visitorHash('secret', '2026-10-22', '192.0.2.1', 'browser'));
  assert.notEqual(hash, await visitorHash('secret', '2026-10-23', '192.0.2.1', 'browser'));
  assert.equal(businessDay(new Date('2026-10-22T23:00:00Z')), '2026-10-23');
});
