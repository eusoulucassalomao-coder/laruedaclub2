// Diagnóstico seguro: informa só os NOMES das variáveis que faltam (nunca os valores) e se o Supabase responde.
const REQUIRED = [
  "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_ANON_KEY",
  "FID_TOKEN_SECRET", "N8N_VISIT_WEBHOOK_URL", "N8N_VISIT_WEBHOOK_API_KEY",
];
const json = (obj, status) => new Response(JSON.stringify(obj), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

export default async (request) => {
  if (request.method !== "GET") return json({ ok: false, error: "method" }, 405);
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ ok: false, database: "not_configured", missing }, 503);
  }
  // Pistas de formato (só true/false, nunca os valores)
  const hints = {
    urlHostIsExpectedProject: /^https:\/\/kwgrsliviyjweluvrkow\.supabase\.co\/?$/.test(String(process.env.SUPABASE_URL || "").trim()),
    urlHasWhitespace: process.env.SUPABASE_URL !== String(process.env.SUPABASE_URL || "").trim(),
    serviceKeyLooksLikeJwt: /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(String(process.env.SUPABASE_SERVICE_ROLE_KEY || "")) || /^sb_secret_/.test(String(process.env.SUPABASE_SERVICE_ROLE_KEY || "")),
  };
  try {
    const { supabase } = await import("../lib/supabase.cjs");
    const { data, error } = await supabase.from("restaurants").select("id").eq("slug", "laruedita").maybeSingle();
    if (error || !data) {
      return json({ ok: false, database: "unavailable", reason: String((error && (error.message || error.code)) || "restaurant-not-found").slice(0, 120), missing, hints }, 503);
    }
    return json({ ok: true, database: "connected", missing, hints }, 200);
  } catch (error) {
    console.error("health", error && error.message);
    return json({ ok: false, database: "unavailable", reason: String((error && error.message) || "error").slice(0, 120), missing, hints }, 503);
  }
};
export const config = { path: "/api/health" };
