import styles from './Legal.module.css';

export default function PrivacyPolicyPage() {
  return (
    <div id="privacy-policy" className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Política de Privacidad</h1>
      <p className={styles.dateLine}>Última actualización: marzo 2026</p>

      <div className={styles.sections}>
        <section>
          <h2 className={styles.sectionTitle}>1. Responsable del tratamiento</h2>
          <ul className={styles.listBasic}>
            <li><strong className={styles.textDark}>Identidad:</strong> Inversiones y Construcciones Navagli S.L.</li>
            <li><strong className={styles.textDark}>CIF:</strong> B44755841</li>
            <li><strong className={styles.textDark}>Dirección:</strong> Calle Sant Isidre 10, 08818 Olivella, Barcelona</li>
            <li><strong className={styles.textDark}>Email:</strong> info@navagli.com</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>
            2. Finalidad del tratamiento
          </h2>
          <p className={styles.bodyText}>
            Los datos personales recabados a través de los formularios del sitio web serán tratados
            con las siguientes finalidades:
          </p>
          <ul className={styles.listDisc}>
            <li>Gestionar solicitudes de presupuesto y consultas.</li>
            <li>Responder a las comunicaciones del usuario.</li>
            <li>Enviar información comercial, únicamente si el usuario ha dado su consentimiento.</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>3. Base jurídica</h2>
          <p className={styles.bodyText}>
            El tratamiento se basa en el consentimiento del interesado (art. 6.1.a RGPD) y en la
            ejecución de un precontrato o contrato (art. 6.1.b RGPD).
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>
            4. Conservación de datos
          </h2>
          <p className={styles.bodyText}>
            Los datos se conservarán durante el tiempo necesario para la gestión de la solicitud y,
            posteriormente, durante los plazos legalmente establecidos para el cumplimiento de
            obligaciones legales.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>5. Derechos del usuario</h2>
          <p className={styles.bodyText}>
            El usuario tiene derecho a acceder, rectificar, suprimir, limitar el tratamiento,
            portabilidad y oposición. Para ejercer estos derechos puede dirigirse a:{' '}
            <a href="mailto:info@navagli.com" className={styles.accentLink}>
              info@navagli.com
            </a>
            . También puede presentar una reclamación ante la Agencia Española de Protección de
            Datos (www.aepd.es).
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>6. Encargados del tratamiento</h2>
          <p className={styles.bodyText}>
            Para la prestación del servicio, Navagli S.L. cuenta con los siguientes encargados del
            tratamiento que acceden a los datos estrictamente necesarios para su función:
          </p>
          <ul className={styles.listDisc}>
            <li>
              <strong className={styles.textDark}>Supabase Inc.</strong> — Almacenamiento de datos
              de proyectos en la nube. Servidores en AWS EU (Frankfurt). Consulta su{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>política de privacidad</a>.
            </li>
            <li>
              <strong className={styles.textDark}>Resend Inc.</strong> — Servicio de entrega de
              correo electrónico transaccional utilizado para transmitir las solicitudes de
              presupuesto recibidas a través del formulario web a la dirección info@navagli.com.
              Los datos del formulario (nombre, población, servicio, email, teléfono y descripción)
              son procesados por Resend exclusivamente para este fin y no son utilizados con fines
              propios. Consulta su{' '}
              <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>política de privacidad</a>.
            </li>
            <li>
              <strong className={styles.textDark}>Vercel Inc.</strong> — Plataforma de alojamiento
              y distribución del sitio web. Puede registrar datos técnicos de acceso (IP, agente de
              usuario) con fines de seguridad y rendimiento. Consulta su{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className={styles.accentLink}>política de privacidad</a>.
            </li>
          </ul>
          <p className={styles.bodyText}>
            No se ceden datos a terceros con fines comerciales ni se realizan transferencias
            internacionales más allá de las derivadas del uso de los anteriores encargados del
            tratamiento, quienes ofrecen garantías adecuadas conforme al RGPD.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>7. Normativa aplicable</h2>
          <p className={styles.bodyText}>
            Esta política se rige por el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018,
            de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos
            digitales (LOPDGDD).
          </p>
        </section>
      </div>
    </div>
  );
}
