import { globalPrivacyControl, measurementAllowed, readConsent } from "./consent.js";
import { normalizePath, referrerHost } from './trackCore.js';
const ENDPOINT = "/api/track";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
const ENABLED_ENV = import.meta.env.PROD;
const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const MIN_SCROLLABLE_PX = 200;
let enabled = true;
let pageviewCount = 0;
let pagePath = typeof window !== "undefined" ? window.location.pathname : "/";
let reachedDepths = new Set();
let activeMs = 0;
let visibleSince = null;
let scrollQueued = false;
let lastNotFoundPath = null;
function setMeasurement(on) {
  enabled = on && !globalPrivacyControl();
  activeMs = 0;
  visibleSince = enabled && document.visibilityState === 'visible' ? performance.now() : null;
  reachedDepths = new Set();
}
function initAnalytics() {
  setMeasurement(measurementAllowed(readConsent()));
}
function acquisition() {
  if (pageviewCount > 0) return {};
  const params = new URLSearchParams(window.location.search);
  return {
    referrer: referrerHost(document.referrer, window.location.host),
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined
  };
}
function send(payload) {
  if (!ENABLED_ENV || !enabled || typeof window === "undefined") return;
  if (!COMPANY_ID) {
    console.warn("[analytics] VITE_COMPANY_ID no est\xE1 configurado \u2014 evento descartado");
    return;
  }
  const body = JSON.stringify({
    company_id: COMPANY_ID,
    lang: navigator.language,
    ...payload,
    // Después de ...payload y con ??: un path undefined NO debe pisar la ruta
    // actual (antes, trackPageview() sin argumento se guardaba como "/")
    path: normalizePath(payload.path ?? window.location.pathname)
  });
  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.(ENDPOINT, blob)) return;
    void fetch(ENDPOINT, { method: "POST", body, keepalive: true }).catch(() => {
    });
  } catch {
    // Tracking must never interrupt navigation.
  }
}
const pauseClock = () => {
  if (visibleSince !== null) {
    activeMs += performance.now() - visibleSince;
    visibleSince = null;
  }
};
const resumeClock = () => {
  if (enabled && visibleSince === null) visibleSince = performance.now();
};
function flushEngagement() {
  pauseClock();
  const seconds = Math.round(activeMs / 1e3);
  activeMs = 0;
  if (seconds >= 1) send({ event_type: "engagement", value: seconds, path: pagePath });
}
function checkScroll() {
  scrollQueued = false;
  if (!enabled) return;
  const doc = document.documentElement;
  if (doc.scrollHeight - window.innerHeight < MIN_SCROLLABLE_PX) return;
  const depth = Math.round((window.scrollY + window.innerHeight) / doc.scrollHeight * 100);
  for (const threshold of SCROLL_THRESHOLDS) {
    if (depth >= threshold && !reachedDepths.has(threshold)) {
      reachedDepths.add(threshold);
      send({ event_type: "scroll_depth", value: threshold, path: pagePath });
    }
  }
}
function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(checkScroll);
}
function trackPageview(path) {
  const next = path ?? window.location.pathname;
  // React StrictMode replays mount effects; count the route once.
  if (pageviewCount > 0 && next === pagePath) return;
  if (next !== lastNotFoundPath) lastNotFoundPath = null;
  if (pageviewCount > 0) {
    flushEngagement();
    reachedDepths = new Set();
    activeMs = 0;
    visibleSince = document.visibilityState === "visible" ? performance.now() : null;
  }
  pagePath = next;
  send({ event_type: "page_view", path: next, ...acquisition() });
  pageviewCount += 1;
}
const trackEvent = (eventKey) => send({ event_type: "cta_click", event_key: eventKey });
function trackNotFound() {
  if (lastNotFoundPath === window.location.pathname) return;
  lastNotFoundPath = window.location.pathname;
  send({
    event_type: "not_found",
    path: window.location.pathname,
    // document.referrer solo vale en la carga inicial; tras navegar dentro
    // de la SPA seguiría apuntando a la entrada original y atribuiría mal.
    referrer: pageviewCount <= 1 ? referrerHost(document.referrer, window.location.host) : undefined
  });
}
function keyForClick(target) {
  const custom = target?.closest?.("[data-track-event]")?.getAttribute("data-track-event");
  if (custom) return custom;
  const href = target?.closest?.("a[href]")?.getAttribute("href")?.trim().toLowerCase() ?? "";
  if (href.startsWith("tel:")) return "phone_click";
  if (href.startsWith("mailto:")) return "email_click";
  return null;
}
let started = false;
function initAutoTracking() {
  if (typeof document === "undefined" || started) return;
  started = true;
  initAnalytics();
  document.addEventListener("click", (event) => {
    const key = keyForClick(event.target);
    if (key) trackEvent(key);
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  if (document.visibilityState === "visible") resumeClock();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushEngagement();
    } else {
      resumeClock();
    }
  });
  window.addEventListener("pagehide", flushEngagement);
  window.addEventListener("moira:lead-sent", () => trackEvent("form_submit"));
}
export {
  initAnalytics,
  initAutoTracking,
  keyForClick,
  setMeasurement,
  trackEvent,
  trackNotFound,
  trackPageview
};
