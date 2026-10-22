import { createClient } from "@supabase/supabase-js";
import {
  businessDay,
  deviceFromUa,
  geoFromHeaders,
  isBot,
  isEventKeyAllowed,
  isReservedEventKey,
  isSameOrigin,
  parseTrackPayload,
  visitorHash
} from "../src/lib/trackCore.js";
let supabase;
function getSupabase() {
  return supabase ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
const noContent = () => new Response(null, { status: 204 });
let definitionsCache = null;
async function activeEventKeys(companyId) {
  if (definitionsCache?.companyId === companyId && definitionsCache.expiresAt > Date.now()) {
    return definitionsCache.keys;
  }
  const { data } = await getSupabase().from("analytics_event_definitions").select("key").eq("company_id", companyId).eq("is_active", true);
  const keys = new Set((data ?? []).map((row) => row.key));
  definitionsCache = { companyId, keys, expiresAt: Date.now() + 5 * 60 * 1e3 };
  return keys;
}
let saltCache = null;
async function dailySalt(day) {
  if (saltCache?.day === day) return saltCache.salt;
  const { data, error } = await getSupabase().rpc("analytics_salt", { p_day: day });
  if (error || typeof data !== "string") return null;
  saltCache = { day, salt: data };
  return data;
}
async function recordEvent(req) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const get = (header) => req.headers.get(header);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.ANALYTICS_SALT) {
    return noContent();
  }
  const userAgent = get("user-agent") ?? "";
  if (isBot(userAgent)) return noContent();
  if (!isSameOrigin(get)) return noContent();
  const raw = await req.text();
  if (raw.length > 4e3) return noContent();
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return noContent();
  }
  const ownHost = get("x-forwarded-host") ?? get("host") ?? undefined;
  const preliminary = parseTrackPayload(body, { ownHost });
  if (!preliminary) return noContent();
  if (process.env.VITE_COMPANY_ID && preliminary.company_id !== process.env.VITE_COMPANY_ID) return noContent();
  if (preliminary.event_type === "cta_click") {
    if (!preliminary.event_key) return noContent();
    const keys = isReservedEventKey(preliminary.event_key) ? new Set() : await activeEventKeys(preliminary.company_id);
    if (!isEventKeyAllowed(preliminary.event_key, keys)) return noContent();
  }
  const { data: company } = await getSupabase().from("companies").select("id").eq("id", preliminary.company_id).maybeSingle();
  if (!company) return noContent();
  const day = businessDay(new Date());
  const salt = await dailySalt(day);
  if (!salt) return noContent();
  const ip = get("x-real-ip") ?? get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const visitor = await visitorHash(`${salt}:${process.env.ANALYTICS_SALT}`, day, ip, userAgent);
  const geo = geoFromHeaders(get);
  const { error } = await getSupabase().from("analytics_events").insert({
    company_id: preliminary.company_id,
    event_type: preliminary.event_type,
    event_key: preliminary.event_key ?? null,
    value: preliminary.value ?? null,
    path: preliminary.path ?? null,
    visitor,
    device: deviceFromUa(userAgent),
    country: geo.country,
    region: geo.region,
    city: geo.city,
    lang: preliminary.lang ?? null,
    referrer: preliminary.referrer ?? null,
    utm_source: preliminary.utm_source ?? null,
    utm_medium: preliminary.utm_medium ?? null,
    utm_campaign: preliminary.utm_campaign ?? null
  });
  if (error) console.error("[track] insert failed", error.message);
  return noContent();
}
async function POST(req) {
  try {
    return await recordEvent(req);
  } catch {
    console.error('[track] request failed');
    return noContent();
  }
}
export {
  POST
};
