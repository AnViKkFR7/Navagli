import styles from './Legal.module.css';

export default function CookiesPolicyPage() {
  return (
    <div id="cookies-policy" className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Política de Cookies</h1>
      <p className={styles.dateLine}>Última actualización: marzo 2026</p>

      <div className={styles.sections}>

        {/* 1 */}
        <section>
          <h2 className={styles.sectionTitle}>¿Qué son las cookies?</h2>
          <p className={styles.bodyText}>
            Las cookies son pequeños archivos de texto que los sitios web depositan en tu dispositivo
            cuando los visitas. Permiten que el sitio funcione correctamente, recuerde tus
            preferencias y, en su caso, recopile información estadística de uso.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className={styles.sectionTitle}>Responsable del tratamiento</h2>
          <p className={styles.bodyText}>
            <strong className={styles.textDark}>Inversiones y Construcciones Navagli S.L.</strong>
            <br />
            Correo electrónico: info@navagli.com
            <br />
            Barcelona, España
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className={styles.sectionTitle}>Cookies utilizadas en este sitio</h2>
          <p className={styles.bodyText}>
            Este sitio web utiliza exclusivamente cookies técnicas y de preferencia estrictamente
            necesarias para su funcionamiento. No se utilizan cookies de seguimiento, publicidad ni
            perfilado de usuarios.
          </p>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeadRow}>
                  <th className={styles.th}>Cookie / clave</th>
                  <th className={styles.th}>Tipo</th>
                  <th className={styles.th}>Proveedor</th>
                  <th className={styles.th}>Finalidad</th>
                  <th className={styles.th}>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.tableRow}>
                  <td className={styles.td}>i18nextLng</td>
                  <td className={styles.td}>Técnica (localStorage)</td>
                  <td className={styles.td}>i18next — propio</td>
                  <td className={styles.td}>Guardar preferencia de idioma seleccionado por el usuario</td>
                  <td className={styles.td}>Persistente</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.td}>navagli_cookies_accepted</td>
                  <td className={styles.td}>Técnica (localStorage)</td>
                  <td className={styles.td}>Propio</td>
                  <td className={styles.td}>Registrar que el usuario ha dado su consentimiento al aviso de cookies</td>
                  <td className={styles.td}>Persistente</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.td}>sb-* (sesión Supabase)</td>
                  <td className={styles.td}>Técnica (cookie/localStorage)</td>
                  <td className={styles.td}>Supabase Inc. — proveedor de infraestructura</td>
                  <td className={styles.td}>
                    Gestión de la sesión y autenticación con la API de base de datos (Supabase).
                    Solo se activan cuando se realizan consultas al backend. Los datos se almacenan en
                    servidores de AWS en la región EU (Frankfurt).
                  </td>
                  <td className={styles.td}>Sesión / 1 hora</td>
                </tr>
                <tr className={styles.tableRow}>
                  <td className={styles.td}>__vercel_live_token</td>
                  <td className={styles.td}>Técnica (cookie)</td>
                  <td className={styles.td}>Vercel Inc. — proveedor de alojamiento</td>
                  <td className={styles.td}>
                    Gestión de la infraestructura de despliegue y funcionalidades de red (CDN,
                    enrutamiento serverless). Presente únicamente en entornos de vista previa de
                    Vercel; no se activa en producción.
                  </td>
                  <td className={styles.td}>Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.bodyText} style={{ marginTop: '1rem' }}>
            Las claves marcadas como <em>localStorage</em> son mecanismos de almacenamiento local del
            navegador, no cookies en sentido estricto, pero quedan incluidas en esta política por
            transparencia y en aplicación del artículo 22.2 de la LSSI-CE.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className={styles.sectionTitle}>Proveedores de servicios de terceros</h2>

          <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginTop: '1rem' }}>
            Supabase Inc.
          </h3>
          <p className={styles.bodyText}>
            Navagli utiliza <strong className={styles.textDark}>Supabase</strong> como plataforma de
            base de datos en la nube. Supabase puede almacenar datos técnicos de conexión en sus
            servidores. Para más información consulta su{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.accentLink}
            >
              política de privacidad
            </a>
            .
          </p>

          <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
            Vercel Inc.
          </h3>
          <p className={styles.bodyText}>
            El sitio web está alojado y distribuido a través de <strong className={styles.textDark}>Vercel</strong>,
            plataforma de despliegue en la nube. Vercel puede registrar datos técnicos de acceso
            (dirección IP, agente de usuario, tiempo de respuesta) con fines de seguridad y
            rendimiento de la red. Para más información consulta su{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.accentLink}
            >
              política de privacidad
            </a>
            .
          </p>

          <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginTop: '1.5rem' }}>
            Resend Inc.
          </h3>
          <p className={styles.bodyText}>
            El envío de emails generados desde el formulario de solicitud de presupuesto se
            gestiona a través de <strong className={styles.textDark}>Resend</strong>, servicio de
            entrega de correo electrónico transaccional. Los datos introducidos en el formulario
            (nombre, población, tipo de servicio, email, teléfono y descripción) son transmitidos
            a los servidores de Resend para su envío a la dirección info@navagli.com. Resend no
            utiliza estos datos con fines propios ni establece cookies en el navegador del usuario.
            Para más información consulta su{' '}
            <a
              href="https://resend.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.accentLink}
            >
              política de privacidad
            </a>
            .
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className={styles.sectionTitle}>¿Cómo gestionar o eliminar las cookies?</h2>
          <p className={styles.bodyText}>
            Puedes retirar tu consentimiento en cualquier momento eliminando las claves de
            almacenamiento desde las herramientas de desarrollador de tu navegador
            (<em>Application → Local Storage → {window.location.origin}</em>) o borrando los datos
            de navegación del sitio.
          </p>
          <p className={styles.bodyText}>
            También puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta
            que deshabilitar las cookies técnicas puede afectar al correcto funcionamiento del sitio:
          </p>
          <ul className={styles.listDisc}>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>Google Chrome</a>
            </li>
            <li>
              <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>Mozilla Firefox</a>
            </li>
            <li>
              <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>Safari</a>
            </li>
            <li>
              <a href="https://support.microsoft.com/es-es/windows/microsoft-edge-datos-de-exploraci%C3%B3n-y-privacidad-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>Microsoft Edge</a>
            </li>
          </ul>
        </section>

        {/* 6 */}
        <section>
          <h2 className={styles.sectionTitle}>Base legal</h2>
          <p className={styles.bodyText}>
            El uso de cookies técnicas está amparado por el interés legítimo del titular del sitio
            web para garantizar su correcto funcionamiento (art. 6.1.f RGPD y art. 22.2 LSSI-CE),
            sin necesidad de consentimiento previo. Para cualquier otra cookie se recabará el
            consentimiento explícito del usuario.
          </p>
          <p className={styles.bodyText}>
            Esta política se ajusta al <strong className={styles.textDark}>Reglamento (UE) 2016/679 (RGPD)</strong>,
            la <strong className={styles.textDark}>Ley Orgánica 3/2018 (LOPDGDD)</strong> y la{' '}
            <strong className={styles.textDark}>Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI-CE)</strong>.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className={styles.sectionTitle}>Actualizaciones de esta política</h2>
          <p className={styles.bodyText}>
            Navagli se reserva el derecho de modificar esta política para adaptarla a cambios
            legislativos o a nuevas funcionalidades del sitio. Se recomienda revisarla periódicamente.
            La fecha de última actualización aparece al inicio de este documento.
          </p>
        </section>

      </div>
    </div>
  );
}
