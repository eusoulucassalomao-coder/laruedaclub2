// Adapta os handlers estilo Vercel (req, res) do backend antigo para Netlify Functions v2 (Request -> Response).
// A lógica de negócio em fid.cjs / health.cjs fica idêntica à do sistema antigo.
export function adapt(handler) {
  return async (request) => {
    let body = {};
    if (request.method !== "GET" && request.method !== "HEAD") {
      try { body = await request.json(); } catch (_) { body = {}; }
    }
    const headers = Object.fromEntries(request.headers); // chaves já em minúsculas
    return new Promise((resolve) => {
      const out = new Headers();
      let status = 200;
      const res = {
        setHeader(k, v) { out.set(k, v); },
        status(code) { status = code; return res; },
        json(obj) {
          out.set("content-type", "application/json; charset=utf-8");
          resolve(new Response(JSON.stringify(obj), { status, headers: out }));
        },
        end() { resolve(new Response(null, { status, headers: out })); },
      };
      Promise.resolve(handler({ method: request.method, body, headers }, res)).catch((error) => {
        console.error("function-error", error && error.message);
        resolve(new Response(JSON.stringify({ error: "server" }), {
          status: 500, headers: { "content-type": "application/json; charset=utf-8" },
        }));
      });
    });
  };
}
