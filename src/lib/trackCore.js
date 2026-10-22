const TRACK_EVENTS = ["page_view", "cta_click", "scroll_depth", "engagement", "not_found"];
const RESERVED_EVENT_KEYS = ["phone_click", "email_click", "form_submit"];
const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const MAX_ENGAGEMENT_SECONDS = 7200;
const LIMITS = {
  path: 300,
  event_key: 80,
  lang: 12,
  referrer: 120,
  utm: 100
};
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOT_A_SOURCE = ["stripe.com", "stripe.network", "paypal.com", "supabase.co", "checkout.stripe.com"];
const INTERNAL_PATH_RE = /^\/(en\/)?(admin|_ds|_emails|api)(\/|$)/i;
const BOT_RE = /bot|crawl|spider|slurp|headless|lighthouse|curl|wget|python|axios|node-fetch|phantom|puppeteer|playwright|preview|monitor|pingdom|uptime/i;
const text = (value, max) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : undefined;
};
function isBot(userAgent) {
  if (!userAgent || userAgent.trim() === "") return true;
  return BOT_RE.test(userAgent);
}
function deviceFromUa(userAgent) {
  const ua = (userAgent ?? "").toLowerCase();
  if (/ipad|tablet/.test(ua) || /android/.test(ua) && !/mobile/.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android/.test(ua)) return "mobile";
  return "desktop";
}
function isSameOrigin(get) {
  const site = get("sec-fetch-site");
  if (site) return site === "same-origin";
  const origin = get("origin");
  const host = get("x-forwarded-host") ?? get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}
function normalizePath(path) {
  const clean = path.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  const parts = clean.split("/").map((segment) => {
    if (UUID_RE.test(segment)) return ":id";
    if (/\d{5,}/.test(segment) || /^[A-Za-z0-9_-]{24,}$/.test(segment)) return ":token";
    return segment;
  });
  const out = parts.join("/");
  return out.length > 1 ? out.replace(/\/$/, "") : "/";
}
const isInternalPath = (path) => INTERNAL_PATH_RE.test(path);
const isReservedEventKey = (key) => RESERVED_EVENT_KEYS.includes(key);
const isEventKeyAllowed = (key, activeKeys) => isReservedEventKey(key) || activeKeys.has(key);
function referrerHost(referrer, ownHost) {
  if (!referrer) return undefined;
  let host;
  try {
    host = new URL(referrer).host.toLowerCase().replace(/^www\./, "");
  } catch {
    host = referrer.toLowerCase().replace(/^www\./, "");
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host)) return undefined;
  }
  const own = (ownHost ?? "").toLowerCase().replace(/^www\./, "");
  if (host === own) return undefined;
  if (NOT_A_SOURCE.some((domain) => host === domain || host.endsWith(`.${domain}`))) return undefined;
  return host.slice(0, LIMITS.referrer);
}
function geoFromHeaders(get) {
  const country = get("x-vercel-ip-country") ?? get("cf-ipcountry") ?? null;
  const region = get("x-vercel-ip-country-region") ?? null;
  const rawCity = get("x-vercel-ip-city") ?? get("cf-ipcity") ?? null;
  let city = null;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }
  return {
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
    region: region ? region.slice(0, 80) : null,
    city: city ? city.slice(0, 80) : null
  };
}
async function visitorHash(secret, day, ip, userAgent) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const salt = hex(await crypto.subtle.sign("HMAC", key, enc.encode(day)));
  const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${salt}|${ip}|${userAgent}`));
  return hex(digest).slice(0, 24);
}
function hex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function businessDay(now, timeZone = "Europe/Madrid") {
  return new Intl.DateTimeFormat("sv-SE", { timeZone }).format(now);
}
function parseTrackPayload(input, options = {}) {
  if (!input || typeof input !== "object") return null;
  const body = input;
  const company_id = text(body.company_id, 64);
  if (!company_id || !UUID_RE.test(company_id)) return null;
  const event_type = body.event_type;
  if (typeof event_type !== "string" || !TRACK_EVENTS.includes(event_type)) return null;
  const rawPath = text(body.path, LIMITS.path) ?? "/";
  if (!rawPath.startsWith("/")) return null;
  const path = normalizePath(rawPath);
  if (isInternalPath(path)) return null;
  let event_key;
  if (event_type === "cta_click") {
    event_key = text(body.event_key, LIMITS.event_key);
    if (!event_key || !/^[\w.:-]+$/.test(event_key)) return null;
    if (options.activeEventKeys && !isEventKeyAllowed(event_key, options.activeEventKeys)) return null;
  }
  let value;
  if (event_type === "scroll_depth") {
    const depth = Number(body.value);
    if (!SCROLL_THRESHOLDS.includes(depth)) return null;
    value = depth;
  }
  if (event_type === "engagement") {
    const seconds = Math.round(Number(body.value));
    if (!Number.isFinite(seconds) || seconds < 1) return null;
    value = Math.min(seconds, MAX_ENGAGEMENT_SECONDS);
  }
  const lang = text(body.lang, LIMITS.lang)?.toLowerCase();
  return {
    company_id,
    event_type,
    event_key,
    value,
    path,
    lang: lang && /^[a-z]{2}(-[a-z0-9]{2,8})?$/.test(lang) ? lang : undefined,
    referrer: referrerHost(text(body.referrer, LIMITS.referrer), options.ownHost),
    utm_source: text(body.utm_source, LIMITS.utm)?.toLowerCase(),
    utm_medium: text(body.utm_medium, LIMITS.utm)?.toLowerCase(),
    utm_campaign: text(body.utm_campaign, LIMITS.utm)?.toLowerCase()
  };
}
export {
  MAX_ENGAGEMENT_SECONDS,
  RESERVED_EVENT_KEYS,
  SCROLL_THRESHOLDS,
  TRACK_EVENTS,
  businessDay,
  deviceFromUa,
  geoFromHeaders,
  isBot,
  isEventKeyAllowed,
  isInternalPath,
  isReservedEventKey,
  isSameOrigin,
  normalizePath,
  parseTrackPayload,
  referrerHost,
  visitorHash
};
