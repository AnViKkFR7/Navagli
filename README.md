# Navagli

Web React + Vite desplegada en Vercel.

## Imágenes

Los originales se conservan en `img/`; `public/img/` contiene las versiones utilizadas por la web. Las fotos sobredimensionadas se limitan a 2560 píxeles en su lado mayor y se convierten a WebP con calidad 92. Los PNG convertidos usan WebP sin pérdida, con las dimensiones originales y la transparencia intacta. El favicon conserva su formato PNG. Las fotos con un ahorro inferior al 20 % se mantienen intactas para evitar recomprimirlas sin una mejora significativa.

`image-optimization-report.json` recoge tamaños, dimensiones y tratamiento por imagen. Para regenerar los WebP desde sus originales: `python scripts/optimize-images.py` (requiere Pillow con soporte WebP). El script no modifica los originales, las referencias del código ni elimina archivos antiguos de `public/`.

## Desarrollo y comprobaciones

```sh
npm ci
npm run dev
npm run build
npm run lint
npm test
```

## SEO de proyectos (Items)

Implementación, inventario, preflight de solo lectura y plan de activación en [`docs/items-seo/README.md`](docs/items-seo/README.md). Las consultas de proyectos usan el tenant y tipo fijos de Navagli, sin fallback a mocks. La activación de slugs indexables exige `VITE_ITEMS_SEO_ENABLED=true` tras revisar el export real y los metadatos. Con la opción desactivada se conservan las fichas UUID publicadas con `noindex`; el listado sigue disponible. No se ha ejecutado SQL ni desplegado esta migración.

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

Diagnóstico sin insertar solicitudes ni recuperar datos personales: `npm run leads:check`. Comprueba la empresa, el módulo CRM y las columnas con las credenciales privadas del entorno local. Un 401 / «Invalid API key» requiere sustituir `SUPABASE_SERVICE_ROLE_KEY` por una service-role/secret válida de la **misma instancia** que `SUPABASE_URL`; la clave anon/public no sirve para escribir leads. En producción, verifica esas dos variables en Vercel y redespliega tras cambiarlas. No publiques ni pegues la clave en logs o chats. El endpoint registra la etapa del fallo y devuelve códigos `LEAD_BACKEND_AUTH`, `LEAD_CONFIG_MISSING`, `LEAD_SCHEMA_MISMATCH` o `LEAD_BACKEND_ERROR`, sin incluir los datos de la solicitud.

`submitLead` envía nombre, email o teléfono, mensaje, página y campaña a `/api/lead`. La bandeja debe confirmar la inserción (201) antes de mostrar éxito y emitir `moira:lead-sent`, que cuenta una única conversión `form_submit`. El honeypot recibe 200 sin insertar ni contar conversión. Un fallo de la bandeja muestra error aunque el correo pueda funcionar.

El servidor exige un `VITE_COMPANY_ID` válido, rechaza un ID distinto enviado por el navegador y comprueba `company_modules` (`module_key = 'crm'`, `is_enabled = true`). Sin empresa configurada o con CRM desactivado devuelve 503; un error de consulta devuelve 500. No se aceptan IDs de contactos enviados por el cliente.

La solicitud conserva `source_item` (título e identificador público del proyecto desde su ficha), `source_referrer`, los cinco campos `utm_*` y `source_campaign`. La casilla de privacidad es opcional: solo registra `consent_given: true` cuando se marca y se envía `consent_text_version`. La versión actual es `navagli-contact-2026-10-v1`; debe cambiarse cuando cambie el texto. Instala en el backend las migraciones `COMPANY_MODULES.sql`, `CRM_CONTACTS_PIPELINE.sql` y `CRM_LEAD_ITEM_ATTRIBUTION.sql` antes del despliegue.

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

Sin configuración de servidor, `/api/track` devuelve 204 sin insertar. `/api/lead` devuelve 503 si falta la empresa configurada y 500 si faltan las credenciales privadas. Los tests usan respuestas simuladas; no envían solicitudes reales al panel.

## Blog público

Rutas: `/blog` (9 artículos por página), `/blog/:slug` y `/sitemap.xml`. El menú y el pie enlazan al blog. Las consultas usan exclusivamente la clave pública, el `VITE_COMPANY_ID` de este despliegue y `status = 'published'`. Los errores se muestran como fallos de carga; no se ocultan como un blog vacío. Los artículos ausentes, de otra empresa o no publicados devuelven 404 al abrir directamente su URL en Vercel.

El contenido Markdown se representa con `react-markdown`, HTML embebido desactivado y transformación segura de URLs. Las imágenes publicadas se consultan solo para los IDs de posts devueltos, en orden, con sus textos alternativos; se admiten imágenes HTTPS.

Configura `VITE_SITE_URL` con el dominio público HTTPS definitivo. Si el blog vive en una instancia distinta de la usada para los proyectos, configura también `VITE_BLOG_SUPABASE_URL` y `VITE_BLOG_SUPABASE_ANON_KEY` (clave anon/public, nunca service role). Si se omiten ambas, se usan `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Estas variables públicas deben estar disponibles tanto en la compilación como en las funciones de Vercel.

Antes de desplegar:

1. Aplica `CONTENT_SEO_FIELDS.sql` en el backend y verifica las políticas RLS públicas de posts y medios.
2. Ejecuta el fichero completo `CONTENT_SEO_FIELDS_AUDIT.sql` de la guía en Supabase SQL Editor. Corrige los slugs publicados inválidos o duplicados desde el panel.
3. Ejecuta `npm run blog:preflight` como comprobación adicional de solo lectura para esta empresa, con `.env` configurado. Detecta posts publicados sin slug válido y duplicados visibles para la clave pública. No sustituye la auditoría SQL de la guía.
4. Ejecuta build y tests y prueba las rutas en un despliegue de Vercel con esas variables.

Las reglas de `vercel.json` sirven las rutas del blog desde una función que carga la plantilla compilada y entrega título, descripción, canonical, Open Graph y contenido en el HTML inicial. El sitemap solo añade artículos publicados de esta empresa con slug válido. Las páginas de listado tienen canonical por página. Vite por sí solo permite probar las vistas, pero no ejecuta las funciones: comprueba 404 HTTP, metadatos iniciales y sitemap usando Vercel.

No se han aplicado migraciones ni publicado cambios en el backend desde este repositorio. Las pruebas cubren consultas y respuestas simuladas, incluida la representación HTML sin ejecutar JavaScript; la verificación del contenido real requiere la configuración y la auditoría anteriores.
