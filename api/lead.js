// api/lead.js — guarda el formulario de contacto en la bandeja de solicitudes
// (tabla `lead`). La web no escribe directamente en Supabase a propósito.
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MAX = { name: 120, email: 160, phone: 40, message: 4000, path: 300, campaign: 120 };

const clean = (value, max) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
};

const looksLikeEmail = (value) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad request', { status: 400 });
  }

  const company_id = clean(body.company_id, 64);
  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const phone = clean(body.phone, MAX.phone);
  const message = clean(body.message, MAX.message);

  if (!company_id || !name || (!email && !phone)) {
    return new Response('Bad request', { status: 400 });
  }
  if (email && !looksLikeEmail(email)) {
    return new Response('Bad request', { status: 400 });
  }

  // Trampa anti-bots: responde 200 para que el bot no reintente.
  if (clean(body.company_website, 200)) return new Response('OK', { status: 200 });

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('id', company_id)
    .maybeSingle();
  if (!company) return new Response('Bad request', { status: 400 });

  const { error } = await supabase.from('lead').insert({
    company_id,
    name,
    email,
    phone,
    message,
    source_path: clean(body.source_path, MAX.path),
    source_campaign: clean(body.source_campaign, MAX.campaign),
  });

  if (error) {
    console.error('[lead] insert failed', error);
    return new Response('Server error', { status: 500 });
  }

  return new Response('OK', { status: 201 });
}

export const config = { runtime: 'nodejs' };
