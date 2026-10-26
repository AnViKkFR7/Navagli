const ENDPOINT = "/api/lead";
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID;
async function submitLead(input) {
  if (!COMPANY_ID) {
    console.warn("[leads] VITE_COMPANY_ID no est\xE1 configurado \u2014 solicitud descartada");
    return { ok: false, reason: "invalid" };
  }
  if (!input.name?.trim() || !input.email?.trim() && !input.phone?.trim()) {
    return { ok: false, reason: "invalid" };
  }
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        company_id: COMPANY_ID,
        source_path: window.location.pathname,
        source_referrer: document.referrer || undefined,
        ...Object.fromEntries(['source', 'medium', 'campaign', 'term', 'content'].map((key) =>
          [`utm_${key}`, new URLSearchParams(window.location.search).get(`utm_${key}`) ?? undefined])),
        source_campaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? undefined
      })
    });
    if (response.ok) {
      if (response.status === 201) window.dispatchEvent(new CustomEvent("moira:lead-sent"));
      return { ok: true };
    }
    return { ok: false, reason: response.status === 400 ? "invalid" : "server" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
export {
  submitLead
};
