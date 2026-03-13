export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-[#151515] mb-2">Política de Privacidad</h1>
      <p className="text-sm text-[#8f999b] mb-10">Última actualización: marzo 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">1. Responsable del tratamiento</h2>
          <ul className="space-y-2 text-[#8f999b]">
            <li><strong className="text-[#151515]">Identidad:</strong> Inversiones y Construcciones Navagli S.L.</li>
            <li><strong className="text-[#151515]">CIF:</strong> [CIF de la empresa]</li>
            <li><strong className="text-[#151515]">Dirección:</strong> [Dirección], Barcelona</li>
            <li><strong className="text-[#151515]">Email:</strong> info@navagli.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">
            2. Finalidad del tratamiento
          </h2>
          <p className="text-[#8f999b] leading-relaxed">
            Los datos personales recabados a través de los formularios del sitio web serán tratados
            con las siguientes finalidades:
          </p>
          <ul className="mt-4 space-y-2 text-[#8f999b] list-disc list-inside">
            <li>Gestionar solicitudes de presupuesto y consultas.</li>
            <li>Responder a las comunicaciones del usuario.</li>
            <li>Enviar información comercial, únicamente si el usuario ha dado su consentimiento.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">3. Base jurídica</h2>
          <p className="text-[#8f999b] leading-relaxed">
            El tratamiento se basa en el consentimiento del interesado (art. 6.1.a RGPD) y en la
            ejecución de un precontrato o contrato (art. 6.1.b RGPD).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">
            4. Conservación de datos
          </h2>
          <p className="text-[#8f999b] leading-relaxed">
            Los datos se conservarán durante el tiempo necesario para la gestión de la solicitud y,
            posteriormente, durante los plazos legalmente establecidos para el cumplimiento de
            obligaciones legales.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">5. Derechos del usuario</h2>
          <p className="text-[#8f999b] leading-relaxed">
            El usuario tiene derecho a acceder, rectificar, suprimir, limitar el tratamiento,
            portabilidad y oposición. Para ejercer estos derechos puede dirigirse a:{' '}
            <a href="mailto:info@navagli.com" className="text-[#da9a4d]">
              info@navagli.com
            </a>
            . También puede presentar una reclamación ante la Agencia Española de Protección de
            Datos (www.aepd.es).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">6. Cesión de datos</h2>
          <p className="text-[#8f999b] leading-relaxed">
            No se cederán datos a terceros, salvo obligación legal o requerimiento de autoridad
            competente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">7. Normativa aplicable</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Esta política se rige por el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018,
            de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos
            digitales (LOPDGDD).
          </p>
        </section>
      </div>
    </div>
  );
}
