const STORAGE_KEY = "moira.consent.v1";
const CONSENT_VERSION = 1;
const CONSENT_MAX_DAYS = 365;
const globalPrivacyControl = () => typeof navigator !== "undefined" && navigator.globalPrivacyControl === true;
function readConsent() {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    if (typeof parsed.decidedAt !== "string") return null;
    const age = (Date.now() - new Date(parsed.decidedAt).getTime()) / 864e5;
    if (!Number.isFinite(age) || age > CONSENT_MAX_DAYS || age < 0) return null;
    return {
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      measurement: parsed.measurement !== false,
      decidedAt: parsed.decidedAt,
      version: CONSENT_VERSION
    };
  } catch {
    return null;
  }
}
function writeConsent(decision) {
  const consent = { ...decision, decidedAt: (new Date()).toISOString(), version: CONSENT_VERSION };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage may be blocked; the choice still applies to this visit.
  }
  return consent;
}
const measurementAllowed = (consent) => !globalPrivacyControl() && consent?.measurement !== false;
const needsDecision = (consent) => consent === null;
export {
  CONSENT_MAX_DAYS,
  CONSENT_VERSION,
  globalPrivacyControl,
  measurementAllowed,
  needsDecision,
  readConsent,
  writeConsent
};
