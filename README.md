# Navagli

Web React + Vite desplegada en Vercel.

## Desarrollo y comprobaciones

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

Vite sirve el frontend; para probar `/api/lead` y `/api/track` hace falta el entorno de funciones de Vercel. La medición se desactiva en desarrollo.

## Integración con moira ordo

Copia `.env.example` a `.env` para desarrollo y configura las mismas variables en el proyecto Vercel:

- `VITE_COMPANY_ID`: UUID público de Navagli en `companies` del panel.
- `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`: acceso público existente a los proyectos de la web.
- `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`: instancia del panel y clave privada, solo en servidor.
- `ANALYTICS_SALT`: secreto aleatorio largo y distinto por entorno (por ejemplo, 32 bytes aleatorios en hexadecimal).

La URL pública de los proyectos puede pertenecer a otra instancia. La integración con el panel utiliza exclusivamente la URL privada de servidor. Nunca publiques la service role key ni la sal con prefijo `VITE_`.

Los archivos se han adaptado de `company-site-snippet` a JavaScript. No se modifican el panel ni la base de datos desde esta web. El backend debe tener disponibles `lead`, `companies`, `analytics_events`, `analytics_event_definitions`, la RPC `analytics_salt` y las migraciones de privacidad, engagement y agregación indicadas en la guía. La rotación y borrado de sales, el límite de 500 eventos y las purgas son responsabilidad de ese backend.

### Formularios

`submitLead` envía nombre, email o teléfono, mensaje, página y campaña a `/api/lead`. La bandeja debe confirmar la inserción (201) antes de mostrar éxito y emitir `moira:lead-sent`, que cuenta una única conversión `form_submit`. El honeypot recibe 200 sin insertar ni contar conversión. Un fallo de la bandeja muestra error aunque el correo pueda funcionar.

La notificación adicional por email utiliza la función Supabase `navagli-send-email`; no determina el éxito de la solicitud. Despliega también la actualización de esa función para admitir email o teléfono como único canal de contacto.

### Medición y privacidad

`initAutoTracking()` se ejecuta antes del router. Registra páginas, clics tel/mailto, lectura y tiempo visible; las páginas inexistentes llaman a `trackNotFound()`. Solo las claves personalizadas requieren alta en el panel. No añadas `data-track-event="form_submit"` al botón del formulario.

La medición no crea identificadores en el navegador. El servidor normaliza rutas, descarta bots, comprueba origen y genera un visitante diario con sal de base de datos y secreto de entorno. Las preferencias de privacidad se guardan separadamente durante un año. «Solo necesarias» desactiva cookies opcionales y conserva la elección de medición. La oposición y GPC desactivan la medición inmediatamente. Actualmente no se cargan GA4, Meta ni otros scripts de publicidad.

### Comprobación tras desplegar

1. Verifica las variables de entorno y redespliega si cambias `VITE_COMPANY_ID`.
2. Envía una solicitud y comprueba su estado Nueva en el panel de Navagli.
3. Navega, usa enlaces de contacto y desplázate por una página larga; comprueba el panel de analítica.
4. Visita una URL inexistente y comprueba el evento de página no encontrada.
5. Cambia la medición desde «Preferencias de cookies» en el pie y comprueba que no se envían eventos tras oponerte.

Sin configuración de servidor, `/api/track` devuelve 204 sin insertar y `/api/lead` devuelve 500. Los tests usan respuestas simuladas; no envían solicitudes reales al panel.
