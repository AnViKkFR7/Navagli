import styles from './Legal.module.css';

export default function CookiesPolicyPage() {
  return (
    <div id="cookies-policy" className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Política de Cookies</h1>
      <p className={styles.dateLine}>Última actualización: 22 de octubre de 2026</p>
      <div className={styles.sections}>
        <section>
          <h2 className={styles.sectionTitle}>Responsable</h2>
          <p className={styles.bodyText}>Inversiones y Construcciones Navagli S.L., CIF B44755841. Calle Sant Isidre 10, 08818 Olivella, Barcelona. Contacto: info@navagli.com.</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Medición propia sin cookies</h2>
          <p className={styles.bodyText}>Medimos visitas, páginas vistas, clics de contacto, solicitudes recibidas, profundidad de lectura, tiempo con la pestaña visible y páginas no encontradas. Esta medición no utiliza cookies ni guarda identificadores en el almacenamiento de tu navegador. Su base es el interés legítimo de mejorar la web (artículo 6.1.f RGPD), con derecho de oposición (artículo 21 RGPD); se distingue de las cookies sujetas al artículo 22.2 LSSI.</p>
          <p className={styles.bodyText}>El servidor genera un hash diario a partir de la dirección IP y el navegador; no guarda la IP ni el agente de usuario completo en los eventos. La sal cambia cada día y se elimina a las 48 horas. Se registran la ruta normalizada sin parámetros, dispositivo, idioma, país, región, ciudad, dominio de origen y campaña de entrada. Los eventos se purgan a los 35 días y se conservan resúmenes diarios sin identificador de visitante.</p>
          <p className={styles.bodyText}>Puedes oponerte desactivando «Medición sin cookies» en las preferencias del pie de página. Respetamos también la señal Global Privacy Control de tu navegador. Elegir «Solo necesarias» rechaza cookies opcionales y conserva tu decisión sobre la medición propia.</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Almacenamiento necesario</h2>
          <ul className={styles.listDisc}>
            <li><strong>i18nextLng:</strong> preferencia de idioma en localStorage, hasta que la cambies o elimines los datos del sitio.</li>
            <li><strong>moira.consent.v1:</strong> preferencias de privacidad en localStorage. La decisión caduca al año y se solicita de nuevo si cambian las finalidades.</li>
          </ul>
          <p className={styles.bodyText}>Este almacenamiento recuerda tus elecciones y no se utiliza para identificarte en la medición.</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Cookies de analítica y publicidad de terceros</h2>
          <p className={styles.bodyText}>Las cookies de analítica (por ejemplo, Google Analytics) y publicidad (por ejemplo, Meta) requieren consentimiento explícito y previo (artículo 6.1.a RGPD y artículo 22.2 LSSI). Actualmente no cargamos estos servicios. Los interruptores de analítica y publicidad guardan tu elección, pero no instalan herramientas de terceros.</p>
        </section>
        <section>
          <h2 className={styles.sectionTitle}>Proveedores y preferencias</h2>
          <p className={styles.bodyText}>La web se aloja en Vercel y utiliza Supabase para almacenar los datos. Estos proveedores pueden tratar datos técnicos para prestar sus servicios. Consulta la política de privacidad para conocer el tratamiento de las solicitudes de contacto.</p>
          <p className={styles.bodyText}>Puedes cambiar tus opciones en cualquier momento:</p>
          <button type="button" className={styles.accentLink} onClick={() => window.dispatchEvent(new Event('moira:cookie-preferences'))}>Preferencias de cookies</button>
          <p className={styles.bodyText}>También puedes borrar el almacenamiento del sitio o bloquear cookies desde las preferencias de tu navegador. Puedes ejercer tus derechos de protección de datos escribiendo a info@navagli.com.</p>
        </section>
      </div>
    </div>
  );
}
