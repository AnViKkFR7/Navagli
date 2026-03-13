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
            <li><strong className={styles.textDark}>CIF:</strong> [CIF de la empresa]</li>
            <li><strong className={styles.textDark}>Dirección:</strong> [Dirección], Barcelona</li>
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
          <h2 className={styles.sectionTitle}>6. Cesión de datos</h2>
          <p className={styles.bodyText}>
            No se cederán datos a terceros, salvo obligación legal o requerimiento de autoridad
            competente.
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
