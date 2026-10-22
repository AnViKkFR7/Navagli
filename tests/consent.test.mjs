import test from 'node:test';
import assert from 'node:assert/strict';
import { readConsent, writeConsent, measurementAllowed, needsDecision } from '../src/lib/consent.js';
let stored;
globalThis.localStorage = { getItem: () => stored, setItem: (_, value) => { stored = value; } };

test('default measurement is independent of optional cookies; choices expire', () => {
  assert.equal(needsDecision(readConsent()), true);
  assert.equal(measurementAllowed(null), true);
  const consent = writeConsent({ measurement: true, analytics: false, marketing: false });
  assert.equal(measurementAllowed(consent), true);
  assert.equal(readConsent().analytics, false);
  assert.equal(measurementAllowed(writeConsent({ measurement: false, analytics: true, marketing: true })), false);
  stored = JSON.stringify({ ...consent, decidedAt: '2020-01-01T00:00:00Z' });
  assert.equal(readConsent(), null);
  stored = JSON.stringify({ ...consent, version: 0 });
  assert.equal(readConsent(), null);
  stored = 'broken json';
  assert.equal(readConsent(), null);
});

test('GPC takes precedence over saved measurement preference', () => {
  Object.defineProperty(navigator, 'globalPrivacyControl', { configurable: true, value: true });
  assert.equal(measurementAllowed({ measurement: true }), false);
  assert.equal(measurementAllowed(null), false);
  delete navigator.globalPrivacyControl;
});

test('blocked storage does not prevent a current-visit decision', () => {
  localStorage.setItem = () => { throw new Error('blocked'); };
  assert.equal(writeConsent({ measurement: false, analytics: false, marketing: false }).measurement, false);
});
