// src/lib/analytics.js
const ENDPOINT = '/api/track';
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;

// Un id aleatorio por PESTAÑA/SESIÓN, en memoria — no en localStorage ni en
// cookie. Se pierde al cerrar la pestaña a propósito: así no se accede a
// ningún almacenamiento del dispositivo y no hace falta consentimiento.
const sessionId = crypto.randomUUID();

function send(eventType, extra) {
  if (!COMPANY_ID) {
    console.warn('[analytics] VITE_COMPANY_ID no está configurado — evento descartado');
    return;
  }
  const body = JSON.stringify({
    company_id: COMPANY_ID,
    event_type: eventType,
    session_id: sessionId,
    ...extra,
  });
  // sendBeacon no bloquea la navegación ni se pierde si el usuario cambia
  // de página justo después del clic (a diferencia de un fetch normal).
  navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
}

export const trackPageview = (path) => send('page_view', { path });

export const trackEvent = (eventKey) =>
  send('cta_click', { path: window.location.pathname, event_key: eventKey });

// Auto-instrumentación: UN solo listener delegado en toda la app. Cualquier
// botón/link/CTA nuevo se mide con solo añadirle un atributo HTML — sin
// escribir una función nueva por evento cada vez. La "clave" tiene que
// coincidir con un evento dado de alta (y activo) para esta empresa en el
// panel de admin — si no coincide, el backend lo descarta en silencio.
export function initAutoTracking() {
  document.addEventListener('click', (e) => {
    const target = e.target;
    const el = target?.closest?.('[data-track-event]');
    const key = el?.getAttribute('data-track-event');
    if (key) trackEvent(key);
  });
}
