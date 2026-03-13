export default function CookiesPolicyPage() {
  return (
    <div className="pt-32 pb-24 px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light text-[#151515] mb-2">Política de Cookies</h1>
      <p className="text-sm text-[#8f999b] mb-10">Última actualización: marzo 2026</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">¿Qué son las cookies?</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo
            al navegarlos. Sirven para que el sitio funcione correctamente, recuerde tus preferencias
            y recopile información estadística.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">
            Cookies utilizadas en este sitio
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#e7ded2]">
                  <th className="text-left p-3 text-[#151515] font-semibold">Cookie</th>
                  <th className="text-left p-3 text-[#151515] font-semibold">Tipo</th>
                  <th className="text-left p-3 text-[#151515] font-semibold">Finalidad</th>
                  <th className="text-left p-3 text-[#151515] font-semibold">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#e7ded2]">
                  <td className="p-3 text-[#8f999b]">i18nextLng</td>
                  <td className="p-3 text-[#8f999b]">Técnica</td>
                  <td className="p-3 text-[#8f999b]">Guardar preferencia de idioma</td>
                  <td className="p-3 text-[#8f999b]">1 año</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">
            ¿Cómo gestionar las cookies?
          </h2>
          <p className="text-[#8f999b] leading-relaxed">
            Puedes configurar tu navegador para rechazar todas o algunas cookies, o para que te
            avise cuando un sitio web las instale o acceda a ellas. Sin embargo, si deshabilitas o
            rechazas las cookies, algunas partes del sitio pueden volverse inaccesibles o no
            funcionar correctamente.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-[#151515] mb-3">Base legal</h2>
          <p className="text-[#8f999b] leading-relaxed">
            Esta política cumple con el Reglamento General de Protección de Datos (RGPD), la Ley
            Orgánica 3/2018 (LOPDGDD) y la Ley 34/2002 de Servicios de la Sociedad de la
            Información (LSSI-CE).
          </p>
        </section>
      </div>
    </div>
  );
}
