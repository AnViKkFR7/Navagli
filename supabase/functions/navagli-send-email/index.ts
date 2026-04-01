const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function escapeHtml(str: string): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SERVICE_LABELS: Record<string, string> = {
  integral: 'Reforma integral',
  kitchen: 'Reforma Cocina',
  bathroom: 'Reforma Baño',
  interior: 'Interiorismo',
  rehabilitation: 'Rehabilitación',
  commercial: 'Local Comercial',
  office: 'Oficina',
  other: 'Otros',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const { name, city, serviceType, email, phone, description } = body;

  if (!name || !city || !serviceType || !email || !phone) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email address' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const serviceLabel = SERVICE_LABELS[serviceType] ?? escapeHtml(serviceType);
  const resendApiKey = Deno.env.get('RESEND_NAVAGLI_API_KEY');

  if (!resendApiKey) {
    console.error('RESEND_NAVAGLI_API_KEY secret is not set');
    return new Response(JSON.stringify({ error: 'Server misconfiguration' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  let emailRes: Response;
  try {
    emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Navagli Web <info@navagli.com>',
      to: ['info@navagli.com'],
      reply_to: email,
      subject: `Nueva solicitud de presupuesto – ${serviceLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#151515">
          <h2 style="background:#da9a4d;color:white;padding:1rem 1.5rem;margin:0">
            Nueva solicitud de presupuesto
          </h2>
          <table cellpadding="12" style="border-collapse:collapse;width:100%;font-size:0.9rem">
            <tr style="border-bottom:1px solid #e7ded2">
              <td style="width:35%;font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em">Nombre</td>
              <td>${escapeHtml(name)}</td>
            </tr>
            <tr style="border-bottom:1px solid #e7ded2">
              <td style="font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em">Población</td>
              <td>${escapeHtml(city)}</td>
            </tr>
            <tr style="border-bottom:1px solid #e7ded2">
              <td style="font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em">Servicio</td>
              <td>${serviceLabel}</td>
            </tr>
            <tr style="border-bottom:1px solid #e7ded2">
              <td style="font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em">Email</td>
              <td><a href="mailto:${escapeHtml(email)}" style="color:#da9a4d">${escapeHtml(email)}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #e7ded2">
              <td style="font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em">Teléfono</td>
              <td>${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="font-weight:600;color:#8f999b;text-transform:uppercase;font-size:0.75rem;letter-spacing:0.05em;vertical-align:top;padding-top:12px">Descripción</td>
              <td style="white-space:pre-wrap">${escapeHtml(description || '—')}</td>
            </tr>
          </table>
          <p style="font-size:0.75rem;color:#8f999b;padding:1rem 1.5rem;margin:0;border-top:1px solid #e7ded2">
            Este mensaje fue enviado desde el formulario de solicitud de presupuesto de navagli.com
          </p>
        </div>
      `,
    }),
  });
  } catch (err) {
    console.error('Fetch to Resend failed:', err);
    return new Response(JSON.stringify({ error: 'Failed to reach email service' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!emailRes.ok) {
    const detail = await emailRes.text();
    console.error('Resend error:', detail);
    return new Response(JSON.stringify({ error: 'Failed to send email', detail }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
});
