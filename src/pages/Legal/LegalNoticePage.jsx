import styles from './Legal.module.css';

export default function LegalNoticePage() {
  return (
    <div id="legal-notice" className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>Aviso Legal</h1>
      <p className={styles.dateLine}>Última actualización: marzo 2026</p>

      <div className={styles.sections}>
        <section>
          <h2 className={styles.sectionTitle}>1. Datos del titular</h2>
          <p className={styles.bodyText}>
            En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la
            Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los
            siguientes datos:
          </p>
          <ul className={styles.listBasic}>
            <li><strong className={styles.textDark}>Razón social:</strong> Inversiones y Construcciones Navagli S.L.</li>
            <li><strong className={styles.textDark}>CIF:</strong> B44755841</li>
            <li><strong className={styles.textDark}>Domicilio:</strong> Calle Sant Isidre 10, 08818 Olivella, Barcelona</li>
            <li><strong className={styles.textDark}>Email:</strong> info@navagli.com</li>
            <li><strong className={styles.textDark}>Teléfono:</strong> +34 627 65 37 87</li>
          </ul>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>2. Objeto y ámbito de aplicación</h2>
          <p className={styles.bodyText}>
            El presente aviso legal regula el acceso y uso del sitio web www.navagli.com, cuyo
            titular es Inversiones y Construcciones Navagli S.L. El acceso al sitio web implica la
            aceptación de las presentes condiciones.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>3. Propiedad intelectual e industrial</h2>
          <p className={styles.bodyText}>
            Todos los contenidos del sitio web, incluyendo textos, imágenes, diseños, logotipos y
            software, son propiedad de Navagli S.L. o de terceros que han autorizado su uso. Queda
            prohibida su reproducción, distribución o comunicación pública sin autorización expresa.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>4. Responsabilidad</h2>
          <p className={styles.bodyText}>
            Navagli S.L. no se hace responsable de los daños y perjuicios que pudieran derivarse del
            acceso o uso del sitio web, ni de posibles errores en los contenidos. La empresa se
            reserva el derecho a modificar o retirar el sitio web sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className={styles.sectionTitle}>5. Legislación aplicable</h2>
          <p className={styles.bodyText}>
            Este aviso legal se rige por la legislación española. Para cualquier controversia, las
            partes se someten a los Juzgados y Tribunales de Barcelona.
          </p>
        </section>
      </div>
    </div>
  );
}
