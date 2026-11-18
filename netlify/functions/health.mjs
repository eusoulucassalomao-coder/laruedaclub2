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
  try {
    const { default: handler } = await import("../lib/health.cjs");
    const { adapt } = await import("../lib/adapter.mjs");
    const res = await adapt(handler)(request);
    const data = await res.json().catch(() => ({}));
    return json({ ...data, missing }, res.status);
  } catch (error) {
    console.error("health", error && error.message);
    return json({ ok: false, database: "unavailable", missing }, 503);
  }
};
export const config = { path: "/api/health" };
