export default function LegalNoticePage() {
  return (
    <div className="pt-32 pb-24 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-[#151515] mb-2">Aviso Legal</h1>
      <p className="text-sm text-[#8f999b] mb-10">Última actualización: marzo 2026</p>

      <div className="prose max-w-none text-[#151515] space-y-8">
        <section>
          <h2 className="text-xl font-medium mb-3">1. Datos del titular</h2>
          <p className="text-[#8f999b] leading-relaxed">
            En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la
            Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se informa de los
            siguientes datos:
          </p>
          <ul className="mt-4 space-y-2 text-[#8f999b]">
            <li><strong className="text-[#151515]">Razón social:</strong> Inversiones y Construcciones Navagli S.L.</li>
            <li><strong className="text-[#151515]">CIF:</strong> [CIF de la empresa]</li>
            <li><strong className="text-[#151515]">Domicilio:</strong> [Dirección completa], Barcelona</li>
            <li><strong className="text-[#151515]">Email:</strong> info@navagli.com</li>
            <li><strong className="text-[#151515]">Teléfono:</strong> +34 XXX XXX XXX</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">2. Objeto y ámbito de aplicación</h2>
          <p className="text-[#8f999b] leading-relaxed">
            El presente aviso legal regula el acceso y uso del sitio web www.navagli.com, cuyo
            titular es Inversiones y Construcciones Navagli S.L. El acceso al sitio web implica la
            aceptación de las presentes condiciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">3. Propiedad intelectual e industrial</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Todos los contenidos del sitio web, incluyendo textos, imágenes, diseños, logotipos y
            software, son propiedad de Navagli S.L. o de terceros que han autorizado su uso. Queda
            prohibida su reproducción, distribución o comunicación pública sin autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">4. Responsabilidad</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Navagli S.L. no se hace responsable de los daños y perjuicios que pudieran derivarse del
            acceso o uso del sitio web, ni de posibles errores en los contenidos. La empresa se
            reserva el derecho a modificar o retirar el sitio web sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">5. Legislación aplicable</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Este aviso legal se rige por la legislación española. Para cualquier controversia, las
            partes se someten a los Juzgados y Tribunales de Barcelona.
          </p>
        </section>
      </div>
    </div>
  );
}
