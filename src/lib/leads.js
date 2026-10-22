// src/lib/leads.js — envía el formulario de contacto a /api/lead.
const ENDPOINT = '/api/lead';
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

/**
 * Devuelve { ok: true } o { ok: false, reason: 'invalid' | 'network' | 'server' }.
 * No usa sendBeacon: hay que saber si ha llegado.
 */
export async function submitLead(input) {
  if (!COMPANY_ID) {
    console.warn('[leads] VITE_COMPANY_ID no está configurado — solicitud descartada');
    return { ok: false, reason: 'invalid' };
  }
  if (!input.name?.trim() || (!input.email?.trim() && !input.phone?.trim())) {
    return { ok: false, reason: 'invalid' };
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_id: COMPANY_ID,
        ...input,
        source_path: window.location.pathname,
        source_campaign: new URLSearchParams(window.location.search).get('utm_campaign') ?? undefined,
      }),
    });
    if (response.ok) return { ok: true };
    return { ok: false, reason: response.status === 400 ? 'invalid' : 'server' };
  } catch {
    return { ok: false, reason: 'network' };
  }
}
