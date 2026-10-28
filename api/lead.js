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
function backendFailure(stage, error) {
  const backendCode = typeof error?.code === 'string' ? error.code : null;
  const authentication = error?.status === 401 || /invalid api key|invalid jwt|jwt expired/i.test(error?.message || '');
  const schema = ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(backendCode);
  const code = authentication ? 'LEAD_BACKEND_AUTH' : schema ? 'LEAD_SCHEMA_MISMATCH'
    : stage === 'configuration' ? 'LEAD_CONFIG_MISSING' : 'LEAD_BACKEND_ERROR';
  // Do not log Postgres details or request bodies: they can contain personal data.
  console.error('[lead] backend failure', { stage, code, backendCode });
  return Response.json({ error: 'No se ha podido guardar la solicitud.', code }, {
    status: stage === 'crm_lookup' && schema ? 503 : 500,
    headers: { 'Cache-Control': 'no-store' },
  });
}
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
    return backendFailure('configuration');
  }
  const { data: company, error: companyError } = await getSupabase().from("companies").select("id").eq("id", company_id).maybeSingle();
  if (companyError) return backendFailure('company_lookup', companyError);
  if (!company) return new Response("Bad request", { status: 400 });
  const { data: crm, error: moduleError } = await getSupabase().from('company_modules')
    .select('is_enabled').eq('company_id', company_id).eq('module_key', 'crm').maybeSingle();
  if (moduleError) return backendFailure('crm_lookup', moduleError);
  if (!crm?.is_enabled) return new Response('Service unavailable', { status: 503 });
  const { error } = await getSupabase().from("lead").insert({
    company_id,
    name,
    email,
    phone,
    message,
    source_path: clean(body.source_path, MAX.path),
    source_item: clean(body.source_item, 200),
    source_referrer: clean(body.source_referrer, 500),
    source_campaign: clean(body.source_campaign, MAX.campaign),
    ...Object.fromEntries(['source', 'medium', 'term', 'content'].map((key) =>
      [`source_utm_${key}`, clean(body[`source_utm_${key}`] ?? body[`utm_${key}`], MAX.campaign)])),
    consent_given: body.consent_given === true && Boolean(clean(body.consent_text_version, 120)),
    consent_at: body.consent_given === true && clean(body.consent_text_version, 120) ? new Date().toISOString() : null,
    consent_text_version: clean(body.consent_text_version, 120),
    consent_source: body.consent_given === true && clean(body.consent_text_version, 120) ? 'public_contact_form' : null,
  });
  if (error) {
    return backendFailure('insert', error);
  }
  return new Response("OK", { status: 201 });
}
async function POST(req) {
  try {
    return await saveLead(req);
  } catch (error) {
    return backendFailure('request', error);
  }
}
export {
  POST
};
