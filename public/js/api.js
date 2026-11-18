// Cliente da API do servidor. O navegador nunca fala direto com o banco.
(function(){
  const C = window.CFG;
  // Em testes locais dá para trocar de restaurante com ?r=; em produção vale sempre o id do config.js.
  const slug = (location.hostname === "localhost" && new URLSearchParams(location.search).get("r")) || C.id;
  let remote = null;

  async function call(body, token){
    const headers = { "content-type": "application/json" };
    if(token) headers.authorization = "Bearer " + token;
    let r;
    try{ r = await fetch(C.api, { method: "POST", headers, body: JSON.stringify(Object.assign({ slug }, body)) }); }
    catch(e){ throw Object.assign(new Error("Sin conexión. Probá de nuevo."), { code: "network" }); }
    let j = {}; try{ j = await r.json(); }catch(e){}
    if(!r.ok){
      const msg = j.message || ({ "bad-secret": "Incorrecto", unauthorized: "La sesión venció. Entrá de nuevo.", forbidden: "No tenés permiso.", role_not_authorized: "Esta cuenta no tiene permiso para este panel.", invalid_credentials: "Correo o contraseña incorrectos." })[j.error] || "No se pudo completar. Probá de nuevo.";
      throw Object.assign(new Error(msg), { code: j.error || "server", status: r.status });
    }
    return j;
  }

  const F = {
    slug, digits: s => String(s || "").replace(/\D/g, ""),
    async init(){ try{ const j = await call({ action: "config" }); remote = j.config || null; }catch(e){ remote = null; } return F.conf(); },
    conf(){
      const o = remote || {};
      return Object.assign({}, C, { earn: o.earn || C.earn, bonus: o.bonus || C.bonus, multipliers: o.multipliers || C.multipliers,
        rewards: o.rewards || C.rewards, inactiveDays: o.inactiveDays || C.inactiveDays });
    },
    multOf: d => (F.conf().multipliers || {})[new Date(d || Date.now()).getDay()] || 1,
    calcPoints(amount, d){ const e = F.conf().earn; return Math.floor((Number(amount) || 0) / e.perAmount) * e.points * F.multOf(d); },

    // cliente
    register: d => call(Object.assign({ action: "register" }, d)),
    me: token => call({ action: "me", token }),
    claim: (token, reward) => call({ action: "claim", token, reward }),
    claimByCode: (code, reward) => call({ action: "claim_by_code", code, reward }),
    login: phone => call({ action: "login", phone }),
    lookupCode: code => call({ action: "lookup_code", code }),
    // acesso interno
    async auth(role, email, password){
      const data = await call({
        action: "auth",
        role,
        email: String(email || "").trim().toLowerCase(),
        password
      });
      return data.token;
    },
    async authCaja(email, password){
      return F.auth("caja", email, password);
    },
    // caixa
    search: (t, q) => call({ action: "search", q }, t),
    visit: (t, customer, amount) => call({ action: "visit", customer, amount }, t),
    bonus: (t, customer, type) => call({ action: "bonus", customer, type }, t),
    findCode: (t, code) => call({ action: "find_code", code }, t),
    deliver: (t, code) => call({ action: "deliver", code }, t),
    newCustomer: (t, d) => call(Object.assign({ action: "new_customer" }, d), t),
    recent: t => call({ action: "recent" }, t),
    // painel
    stats: t => call({ action: "stats" }, t),
    waStatus: t => call({ action: "wa_status" }, t),
    waConnect: t => call({ action: "wa_connect" }, t),
    waLogout: t => call({ action: "wa_logout" }, t),
    customers: (t, q) => call({ action: "customers", q }, t),
    exportCustomers: t => call({ action: "export_customers" }, t),
    exportVisits: t => call({ action: "export_visits" }, t),
    redemptions: t => call({ action: "redemptions" }, t),
    surveys: t => call({ action: "surveys" }, t),
    async saveConfig(t, config){ const j = await call({ action: "save_config", config }, t); remote = j.config; return j; }
  };
  window.Fid = F;
})();
