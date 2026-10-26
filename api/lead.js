import { createClient } from "@supabase/supabase-js";
let supabase;
function getSupabase() {
  return supabase ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}
const MAX = { name: 120, email: 160, phone: 40, message: 4e3, path: 300, campaign: 120 };
const UUID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const clean = (value, max) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
};
const looksLikeEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
async function saveLead(req) {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return new Response('Bad request', { status: 400 });
  }
  // A filled honeypot is acknowledged without saving or notifying analytics.
  if (clean(body.company_website, 200)) return new Response('OK', { status: 200 });
  const company_id = process.env.VITE_COMPANY_ID?.trim();
  if (!company_id || !UUID.test(company_id)) return new Response('Service unavailable', { status: 503 });
  if (body.company_id !== company_id) return new Response('Bad request', { status: 400 });
  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const message = clean(body.message, MAX.message);
  if (!company_id || !/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(company_id) || !name || !email && !phone) {
    return new Response("Bad request", { status: 400 });
  }
  if (email && !looksLikeEmail(email)) {
    return new Response("Bad request", { status: 400 });
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Server error', { status: 500 });
  }
  const { data: company, error: companyError } = await getSupabase().from("companies").select("id").eq("id", company_id).maybeSingle();
  if (companyError) return new Response('Server error', { status: 500 });
  if (!company) return new Response("Bad request", { status: 400 });
  const { data: crm, error: moduleError } = await getSupabase().from('company_modules')
    .select('is_enabled').eq('company_id', company_id).eq('module_key', 'crm').maybeSingle();
  if (moduleError) return new Response('Server error', { status: 500 });
  if (!crm?.is_enabled) return new Response('Service unavailable', { status: 503 });
  const { error } = await getSupabase().from("lead").insert({
    company_id,
    name,
    email,
    phone,
    message,
    source_path: clean(body.source_path, MAX.path),
    source_item: clean(body.source_item, 200),
    source_referrer: clean(body.source_referrer, 2048),
    source_campaign: clean(body.source_campaign, MAX.campaign),
    ...Object.fromEntries(['source', 'medium', 'campaign', 'term', 'content'].map((key) =>
      [`utm_${key}`, clean(body[`utm_${key}`], MAX.campaign)])),
    consent_given: body.consent_given === true && Boolean(clean(body.consent_text_version, 120)),
    consent_text_version: clean(body.consent_text_version, 120),
  });
  if (error) {
    console.error("[lead] insert failed", error);
    return new Response("Server error", { status: 500 });
  }
  return new Response("OK", { status: 201 });
}
async function POST(req) {
  try {
    return await saveLead(req);
  } catch {
    console.error('[lead] request failed');
    return new Response('Server error', { status: 500 });
  }
}
export {
  POST
};
