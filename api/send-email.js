import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const SERVICE_LABELS = {
  integral: 'Reforma integral',
  kitchen: 'Reforma Cocina',
  bathroom: 'Reforma Baño',
  interior: 'Interiorismo',
  rehabilitation: 'Rehabilitación',
  commercial: 'Local Comercial',
  office: 'Oficina',
  other: 'Otros',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, city, serviceType, email, phone, description } = req.body ?? {};

  if (!name || !city || !serviceType || !email || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const serviceLabel = SERVICE_LABELS[serviceType] ?? escapeHtml(serviceType);

  try {
    await resend.emails.send({
      from: 'Navagli Web <info@navagli.com>',
      to: 'info@navagli.com',
      replyTo: email,
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
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
