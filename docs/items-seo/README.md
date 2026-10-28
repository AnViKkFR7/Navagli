# Navagli: migración SEO de proyectos

## Inventario de código y alcance (28/10/2026)

| Aspecto | Inventario |
| --- | --- |
| Empresa | `b58a5ab9-dd4a-4bbe-8289-2cf3a134e49a` |
| Tipo | `proyecto-reforma-navagli` |
| Datos | `public.items`; permanecen en la misma tabla |
| Ruta anterior | `/proyectos/:uuid` |
| Ruta canónica prevista | `/proyectos/:slug` |
| Framework | React 19 + React Router 7, Vite, funciones Node de Vercel |
| Catálogo | Home (3 destacados) y `/proyectos` (12 por página) |
| Atributos públicos representados | `description`, `what_was_done`, interpretados y escapados |
| Medios | `item_media`, imágenes de IDs publicados resueltos, ordenadas; portada `is_cover`, `alt_text` |
| Render de ficha/listado | `api/project-page.js`, HTML inicial y navegación React |
| Sitemap | `/sitemap.xml`: páginas estáticas, blog existente y proyectos válidos tras activar SEO |
| Credenciales | Exclusivamente URL y anon de `VITE_SUPABASE_*`; alcance fijo de proyectos independiente del tenant del blog |

El catálogo anterior filtraba los publicados por empresa/tipo, pero el detalle UUID no filtraba tipo/estado y los errores podían cargar mocks. Ambas situaciones se corrigen. Todos los lectores de proyectos filtran ahora empresa, tipo y estado; se propagan errores de atributos/medios. No se consultan atributos privados ni estados no publicados desde la web.

## Riesgos y decisiones

- **Datos reales:** tras confirmar la ubicación con el usuario se generó `public-items-export.json` en modo lectura con la clave anon. Contiene un único proyecto publicado del alcance, sus valores previos y sus atributos públicos. El preflight confirmó que existen las columnas SEO y detectó slug, título SEO y descripción vacíos. No se ejecutaron migraciones ni se cambiaron filas. Los mocks no se utilizan para redactar SEO ni como fallback.
- **Revisión del inventario y propuesta:** este documento deja el alcance, riesgos y redacción preparados para revisión humana. `proposals.csv` y `PROPOSED_ITEMS_SEO_VALUES.sql` contienen la propuesta del proyecto real; el SQL no se ha ejecutado y termina con rollback. `proposal-review.json` registra la huella SHA-256 del export, URL anterior/nueva, límites y estado pendiente.
- **Activación gradual:** `VITE_ITEMS_SEO_ENABLED=false` por defecto. Conserva los UUID públicos con HTML inicial y `noindex,follow`; las rutas nuevas por slug y las URLs de proyectos del sitemap requieren `true`. No activar hasta tener slugs válidos/únicos y lote revisado. Una ficha UUID sin slug válido continúa accesible con `noindex` incluso con SEO activo.
- **Colisiones:** el índice de slugs abarca todos los tipos de la misma empresa. La auditoría anon verifica lo visible del tipo acordado; la comprobación SQL cubre también conflictos con otros tipos/estados sin exportar sus contenidos.
- **Cambio de URL previo:** los UUID publicados redirigen con 308 al slug válido. Para cualquier slug ya compartido que se cambie, añadir el slug anterior y el UUID a `src/data/projectRedirects.js` en el mismo despliegue. El destino se resuelve de nuevo con los tres filtros; si se archiva devuelve 404, sin redirección.
- **Caché:** HTML, redirects y sitemap usan `Cache-Control: no-store`. Cada petición refleja el estado publicado actual sin requerir un webhook de invalidación. Al cambiar un slug, probar URL anterior, nueva y sitemap.
- **OG:** solo HTTPS, sin credenciales en URL; fallback a portada HTTPS. No se inventa URL ni se utiliza una imagen local como OG absoluto. La accesibilidad real de cada URL debe comprobarse durante la revisión del lote.
- **`lastmod`:** se omite deliberadamente; el lote SEO cambia `updated_at` y todavía no existe garantía de que represente una edición editorial útil.
- **Servicios de blog/proyectos distintos:** el blog conserva su configuración. El sitemap solo se devuelve completo; si falla una fuente necesaria responde 503 en vez de simular una lista vacía.
- **Origen de las plantillas SQL:** se localizaron los originales del panel en `Regiamare/WebProject/database`. `preflight.sql` es el preflight original con el tenant/tipo sustituidos. Se conserva `ITEMS_SEO_VALUES_TEMPLATE.sql` sin cambios; `values-review.sql` adapta esa estructura y añade alcance fijo, copia previa, bloqueo de filas, comprobación de concurrencia y rollback por defecto. Ninguno se ha ejecutado.

## Preflight y export de solo lectura

1. Revisar este inventario, confirmar el Supabase de los proyectos y que la migración SEO ya aplicada incluye las columnas esperadas. **No repetir la migración.**
2. Ejecutar el preflight original del roadmap con el alcance anterior o revisar `preflight.sql`. Usa únicamente SELECT; detecta columnas ausentes mediante error SQL, campos incompletos y colisiones por empresa.
3. Con `.env` público configurado, ejecutar deliberadamente:

   ```sh
   npm run items:preflight
   npm run items:preflight -- --export docs/items-seo/public-items-export.json
   ```

   El script no hace escrituras remotas. El export contiene únicamente los proyectos publicados del alcance, sus campos editoriales/SEO, fecha original, atributos públicos representados y portada. Antes de editar datos, conservar ese fichero como copia de los valores actuales. Los errores o problemas generan salida no cero; el export, si se pidió, se guarda también cuando hay campos incompletos para poder revisarlos.

4. Revisar `proposals.csv`, limitado a `id,company_id,item_type,slug,seo_title,seo_description,seo_og_image_url`. Conserva slugs válidos salvo redirección revisada; límites 120/70/160/2048. OG `NULL` si no hay URL pública HTTPS comprobada. La portada del único proyecto devolvió HTTP 200 `image/png` mediante HEAD sin cookies; evidencia en `og-verification.json`.
5. El responsable revisa la tabla antes de ejecutar `PROPOSED_ITEMS_SEO_VALUES.sql`, preparado con la estructura original y las protecciones de `values-review.sql`. Comprueba alcance, publicación, cambios concurrentes y colisiones; solo modifica columnas SEO y `updated_at`, muestra antes/después y termina con `ROLLBACK`. Una persona debe decidir la confirmación; este trabajo no lo ejecuta. Se conserva la plantilla vacía para lotes posteriores.

### Propuesta concreta pendiente de aprobación

| Campo | Propuesta |
| --- | --- |
| Item | `a4ca89ab-6cb3-44b5-bff4-8467cdffb2bf` |
| Título original | Reforma integral en Oasis de Sitges |
| Slug | `reforma-integral-oasis-sitges` |
| SEO title | Reforma integral en Oasis de Sitges \| Navagli |
| SEO description | Reforma integral en Oasis de Sitges: dos baños renovados, cocina con mármol natural y parquet laminado en toda la vivienda. |
| OG | Portada pública HTTPS exportada, comprobada HTTP 200/image/png |
| Ruta anterior | `/proyectos/a4ca89ab-6cb3-44b5-bff4-8467cdffb2bf` |
| Nueva ruta tras aplicar y activar | `/proyectos/reforma-integral-oasis-sitges` |

El slug anterior es NULL, por lo que no hay un slug compartido que reemplazar en el export. El UUID se conserva con redirect 308 al activar. El SQL vuelve a comprobar colisiones contra todos los tipos/estados de la empresa antes de cualquier actualización.

## Preview y publicación

Tras revisar/aplicar los datos, repetir preflight, configurar `VITE_ITEMS_SEO_ENABLED=true` tanto al compilar como en funciones y generar un preview Vercel. `VITE_SITE_URL` debe ser el dominio canónico definitivo HTTPS; los proyectos leen `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. No añadir service-role.

Comprobar por HTTP sin JavaScript:

```sh
curl -i https://DOMINIO/proyectos/SLUG_PUBLICADO
curl -i https://DOMINIO/proyectos/UUID_PUBLICADO
curl -i https://DOMINIO/proyectos/SLUG_INEXISTENTE
curl -i https://DOMINIO/sitemap.xml
```

Esperado: 200 con contenido, title/description/canonical/OG/robots; 308 UUID→slug; 404/noindex para inexistentes, draft, archived o fuera de alcance; 503/noindex si falla Supabase. Fallbacks fieles a título/resumen y OG omitido cuando no haya imagen HTTPS apta. No hay JSON-LD inventado ni URLs UUID en sitemap.

Comparar recuentos con el export publicado **con slug válido**. Probar navegación, paginación y portadas en móvil/tablet/escritorio, error/reintento y estados vacíos. Verificar que otra empresa/tipo no aparece al resolver, que archivar cambia respuesta y sitemap y que el alias anterior sigue redirigiendo al cambiar slug. Aprobar el preview antes de desplegar producción.

## Verificado localmente y pendiente

Pruebas automatizadas con Supabase simulado: aislamiento, medios/atributos, paginación, fallback SEO, escaping de texto y atributos, HTML inicial sin JavaScript, UUID 308, 404 de no públicos, 503 en fallos, puerta de activación y actualización del sitemap tras archivo/cambio de slug. Build correcto y 25 tests correctos. El lint de los archivos de implementación comprobados pasa; el lint global mantiene los tres errores previos en Header/About/Asesoramiento.

El export y la portada se verificaron con lecturas públicas reales; también se llamó a la función de ficha con el UUID real y la plantilla compilada, obteniendo 200 con contenido, fallback de título y noindex durante la transición. No se escribió en Supabase. Se intentó abrir el listado local en el navegador de comprobación, pero este no pudo conectar al servidor local (timeout); por ello no se da por validada la apariencia responsive. Pendientes: aprobación de redacción/SQL, auditoría SQL/RLS de colisiones que anon no ve, aplicación humana del lote, dominio canónico/configuración, validación visual/HTTP del preview y aprobación de despliegue. El SEO permanece desactivado hasta completar esas revisiones.
