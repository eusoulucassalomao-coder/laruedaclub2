(function(){
  const F = window.Fid, $ = id => document.getElementById(id);
  const fmt = n => Number(n).toLocaleString("es-AR");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DN = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dshort = ts => ts ? new Date(ts).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" }) : "—";
  const daysAgo = ts => ts ? Math.floor((Date.now() - new Date(ts).getTime()) / 86400000) : null;
  const TK = "mkf_panel_" + F.slug;
  let tok = "", CF = F.conf(), rewards = [], cqTimer = 0;
  try{ tok = sessionStorage.getItem(TK) || ""; }catch(e){}

  function logout(msg){ try{ sessionStorage.removeItem(TK); }catch(e){} tok = ""; $("app").hidden = true; $("gate").hidden = false; $("passMsg").textContent = msg || ""; }
  async function run(fn){ try{ return await fn(); }catch(e){ if(e.code === "unauthorized" || e.code === "forbidden"){ logout("La sesión venció. Ingresá de nuevo."); } throw e; } }

  async function boot(){
    CF = await F.init();
    $("gate").hidden = true; $("app").hidden = false; $("logo").src = CF.logo; $("club").textContent = CF.name;
    render();
  }
  $("passForm").addEventListener("submit", async e => {
    e.preventDefault();
    const m = $("passMsg"), btn = $("loginBtn");
    const email = $("loginEmail").value.trim(), password = $("pass").value;
    m.textContent = ""; btn.disabled = true; btn.textContent = "Validando...";
    try{
      tok = await F.auth("panel", email, password);
      try{ sessionStorage.setItem(TK, tok); }catch(x){}
      $("pass").value = "";
      await boot();
    }catch(err){
      m.textContent = err.message;
      $("pass").value = "";
    }finally{
      btn.disabled = false; btn.textContent = "Entrar";
    }
  });
  $("out").onclick = () => logout("");
  if(tok) boot();

  async function render(){
    let st;
    try{ st = await run(() => F.stats(tok)); }catch(e){ return; }
    const k = [
      ["Clientes", fmt(st.customers), `+${st.new30} en 30 días`],
      ["Visitas (30 días)", fmt(st.visits30), "registradas en caja"],
      ["Ventas del club (30 días)", "$" + fmt(st.revenue30), "cuentas con puntos"],
      ["Ticket promedio", "$" + fmt(st.avgTicket), "por visita"],
      ["Vuelven", st.returnRate + "%", "clientes con 2+ visitas"],
      ["Por invitación", fmt(st.refTotal), `${st.refDone} ya visitaron`],
      ["Premios entregados", fmt(st.redeemed), `${st.pending} pendientes`],
      ["Para recuperar", fmt(st.inactive.length), `sin venir hace ${CF.inactiveDays}+ días`]
    ];
    $("kpis").innerHTML = k.map(([t, v, s]) => `<div class="kpi"><small>${esc(t)}</small><b>${esc(v)}</b><span>${esc(s)}</span></div>`).join("");

    const mx = Math.max(1, ...st.days.map(d => d.n));
    $("chart").innerHTML = st.days.map(d => `<div title="${d.n} visitas · $${fmt(d.sum)}"><em>${d.n || ""}</em><i style="height:${Math.round(d.n / mx * 100)}%"></i>${d.label}</div>`).join("");
    $("top").innerHTML = st.top.length ? st.top.map(c => `<li><span>${esc(c.name)}<br><small>${c.visits} visitas</small></span><b>${fmt(c.lifetime)} pts</b></li>`).join("") : "<li><small>Sin datos todavía.</small></li>";
    $("bdays").innerHTML = st.birthdays.length ? st.birthdays.map(c => `<li><span>${esc(c.name)}</span><small>${esc(String(c.birthday).slice(8, 10) + "/" + String(c.birthday).slice(5, 7))}</small></li>`).join("") : "<li><small>Ninguno por ahora.</small></li>";

    $("inactSub").textContent = st.inactive.length ? `${st.inactive.length} clientes no vienen hace más de ${CF.inactiveDays} días. Escribiles con un toque.` : "Todos vinieron hace poco. ¡Bien!";
    $("inact").innerHTML = st.inactive.slice(0, 30).map(c => {
      const msg = `Hola ${c.name.split(" ")[0]}! Hace un tiempito que no te vemos en ${CF.name}. Te esperamos: tenés ${fmt(c.points)} puntos para canjear por un premio. ${CF.menuUrl}`;
      return `<tr><td>${esc(c.name)}</td><td>${dshort(c.last_visit)} <small style="color:var(--muted)">(${daysAgo(c.last_visit)} d)</small></td><td>${fmt(c.points)}</td><td><a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/${F.digits(c.phone)}?text=${encodeURIComponent(msg)}">Escribir</a></td></tr>`;
    }).join("") || `<tr><td colspan="4"><small>Nada por recuperar.</small></td></tr>`;

    drawClients(); drawReds(); drawSurveys(); drawCfg(); waCheck();
  }

  // ---- encuestas de satisfacción ----
  let svData = null;
  const stars = n => "★".repeat(n) + "☆".repeat(5 - n);
  function paintSurveys(){
    if(!svData) return;
    const s = svData.summary, flt = $("svFilter").value;
    $("svKpis").innerHTML = [
      ["Nota promedio", s.answered ? s.avg.toFixed(1) + " / 5" : "—", `${fmt(s.answered)} respondidas`],
      ["Enviadas", fmt(s.sent), `${fmt(s.pending)} sin responder`],
      ["Notas bajas (1 a 3)", fmt(s.low), "para revisar"],
      ["Notas altas (4 y 5)", fmt(s.high), "van a Google"],
    ].map(([t, v, sub]) => `<div class="kpi"><small>${esc(t)}</small><b>${esc(v)}</b><span>${esc(sub)}</span></div>`).join("");
    const rows = svData.surveys.filter(x => flt === "low" ? x.rating <= 3 : flt === "high" ? x.rating >= 4 : true);
    $("svRows").innerHTML = rows.map(x => {
      const first = String(x.name).split(" ")[0];
      const msg = `Hola ${first}! Vimos tu opinión sobre ${CF.name} y queremos escucharte. ¿Podés contarnos qué podemos mejorar?`;
      const wa = x.rating <= 3 && x.phone ? `<a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/${F.digits(x.phone)}?text=${encodeURIComponent(msg)}">Escribir</a>` : "";
      return `<tr><td>${dshort(x.ts)}</td><td>${esc(x.name)}</td><td><span title="${x.rating} de 5" style="color:${x.rating <= 3 ? "#b0361f" : "#2f6b3a"};white-space:nowrap">${stars(x.rating)}</span></td><td>${x.comment ? esc(x.comment) : "<small>Sin comentario</small>"}</td><td>${wa}</td></tr>`;
    }).join("") || `<tr><td colspan="5"><small>${svData.summary.answered ? "Ninguna encuesta con ese filtro." : "Todavía no hay encuestas respondidas."}</small></td></tr>`;
  }
  // Aviso de nota baixa dentro do painel (substitui o alerta por WhatsApp): faixa no Resumen + contador no menu.
  function paintSvAlert(){
    const box = $("svAlert"), nav = document.querySelector('.nav2 a[href="#encuestas"]');
    if(!svData) return;
    const cut = Date.now() - 7 * 86400000;
    const low = svData.surveys.filter(x => x.rating <= 3 && new Date(x.ts).getTime() >= cut);
    if(nav) nav.textContent = low.length ? `Encuestas (${low.length})` : "Encuestas";
    if(!low.length){ box.hidden = true; return; }
    const l = low[0];
    box.hidden = false;
    box.innerHTML = `<b>⚠ ${low.length} ${low.length > 1 ? "encuestas con nota baja" : "encuesta con nota baja"} en los últimos 7 días.</b> La más reciente: ${esc(l.name)} (${l.rating} de 5)${l.comment ? ` — “${esc(l.comment)}”` : ""}. <a href="#encuestas">Ver encuestas</a>`;
  }
  async function drawSurveys(){
    try{ svData = await run(() => F.surveys(tok)); paintSurveys(); paintSvAlert(); }catch(e){}
  }
  $("svFilter").addEventListener("change", paintSurveys);

  async function drawClients(){
    try{
      const list = (await run(() => F.customers(tok, $("cq").value))).customers;
      $("clients").innerHTML = list.map(c => `<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${c.marketingConsent ? "Sí" : "No"}</td><td>${c.visits}</td><td>${fmt(c.points)}</td><td>${esc(c.code)}</td></tr>`).join("") || `<tr><td colspan="6"><small>Sin clientes.</small></td></tr>`;
    }catch(e){}
  }
  $("cq").addEventListener("input", () => { clearTimeout(cqTimer); cqTimer = setTimeout(drawClients, 300); });

  async function drawReds(){
    try{
      const r = (await run(() => F.redemptions(tok))).redemptions;
      $("reds").innerHTML = r.map(x => `<tr><td>${esc(x.name)}</td><td>${esc(x.customer)}</td><td>${esc(x.code)}</td><td>${x.status === "canjeado" ? "Entregado " + dshort(x.usedAt) : "<b style='color:#b07d00'>Pendiente</b>"}</td></tr>`).join("") || `<tr><td colspan="4"><small>Todavía no hay canjes.</small></td></tr>`;
    }catch(e){}
  }

  // ---- WhatsApp del local (QR) ----
  let waPoll = 0, waQrAt = 0, waUntil = 0;
  const WA = { open: ["Conectado", "ok"], connecting: ["Esperando que escanees el código", "wait"], close: ["Sin conectar", ""], none: ["Sin conectar", ""], unknown: ["Sin conectar", ""] };
  function waStop(){ clearInterval(waPoll); waPoll = 0; }
  function paintWa(s){
    const badge = $("waState"), box = $("waQrBox"), msg = $("waMsg");
    const st = s.state, info = WA[st];
    $("waConnect").hidden = st === "open"; $("waLogout").hidden = st !== "open";
    if(st === "unconfigured"){ badge.textContent = "Todavía no disponible"; badge.className = "wa-badge"; $("waConnect").hidden = true; msg.className = "msg"; msg.textContent = "La conexión todavía no está activada. Pedile a MK Conecta que la active."; box.hidden = true; return; }
    if(st === "unavailable"){ badge.textContent = "No se pudo consultar"; badge.className = "wa-badge"; msg.className = "msg err"; msg.textContent = "No pudimos hablar con WhatsApp ahora. Probá de nuevo en un minuto."; return; }
    badge.textContent = info ? info[0] : "Sin conectar"; badge.className = "wa-badge " + (info ? info[1] : "");
    if(st === "open"){ waStop(); box.hidden = true; msg.className = "msg ok"; msg.textContent = "Listo: el club ya puede mandar mensajes desde este número."; return; }
    if(s.qr){ $("waQr").src = s.qr; box.hidden = false; msg.className = "msg"; msg.textContent = ""; }
    if(s.pairingCode){ $("waPair").hidden = false; $("waPair").textContent = "¿No podés escanear? Código para vincular con número de teléfono: " + s.pairingCode; } else { $("waPair").hidden = true; }
    if(st !== "connecting") box.hidden = !s.qr;
  }
  async function waCheck(){
    try{ paintWa(await run(() => F.waStatus(tok))); }catch(e){ paintWa({ state: "unavailable" }); }
  }
  async function waShowQr(){
    try{ paintWa(await run(() => F.waConnect(tok))); waQrAt = Date.now(); }catch(e){ paintWa({ state: "unavailable" }); }
  }
  $("waConnect").onclick = async () => {
    const btn = $("waConnect"); btn.disabled = true; $("waMsg").className = "msg"; $("waMsg").textContent = "Generando el código...";
    await waShowQr(); btn.disabled = false;
    waStop(); waUntil = Date.now() + 4 * 60000;
    waPoll = setInterval(async () => {   // revisa si ya escaneó; el QR se renueva cada ~25 s y todo se detiene a los 4 minutos
      if(Date.now() > waUntil){ waStop(); return; }
      if(Date.now() - waQrAt > 25000){ await waShowQr(); } else { await waCheck(); }
    }, 3000);
  };
  $("waLogout").onclick = async () => {
    if(!confirm("¿Desconectar el WhatsApp del local? El club dejará de mandar mensajes hasta que lo conectes de nuevo.")) return;
    try{ paintWa(await run(() => F.waLogout(tok))); }catch(e){ paintWa({ state: "unavailable" }); }
  };

  // ---- reglas ----
  function drawCfg(){
    const cf = CF, f = $("cfgForm");
    f.points.value = cf.earn.points; f.perAmount.value = cf.earn.perAmount;
    ["welcome", "referral", "birthday"].forEach(k => f[k].value = cf.bonus[k]);
    f.inactiveDays.value = cf.inactiveDays;
    $("mults").innerHTML = DN.map((n, i) => `<label>${n}<input type="number" min="1" max="10" step="0.5" data-m="${i}" value="${(cf.multipliers || {})[i] || 1}"></label>`).join("");
    rewards = cf.rewards.map(r => Object.assign({}, r)); drawRewards();
  }
  function drawRewards(){
    $("rwEdit").innerHTML = rewards.map((r, i) => `<div class="rw-edit">
      <label>Nombre<input data-r="${i}" data-k="name" maxlength="60" value="${esc(r.name)}"></label>
      <label>Puntos<input type="number" min="1" data-r="${i}" data-k="pts" value="${r.pts}"></label>
      <label>Detalle<input data-r="${i}" data-k="note" maxlength="120" value="${esc(r.note || "")}"></label>
      <button class="btn sm ghost" type="button" data-del="${i}">Quitar</button></div>`).join("");
    $("rwEdit").querySelectorAll("input").forEach(inp => inp.oninput = () => { const r = rewards[+inp.dataset.r]; r[inp.dataset.k] = inp.dataset.k === "pts" ? Number(inp.value) : inp.value; });
    $("rwEdit").querySelectorAll("[data-del]").forEach(b => b.onclick = () => { rewards.splice(+b.dataset.del, 1); drawRewards(); });
  }
  $("addRw").onclick = () => { rewards.push({ id: "p" + Date.now().toString(36), name: "Nuevo premio", pts: 500, img: (CF.rewards[0] || {}).img || CF.logo, note: "" }); drawRewards(); };
  $("cfgForm").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target, m = $("cfgMsg");
    const mult = {}; f.querySelectorAll("[data-m]").forEach(i => { const v = Number(i.value); if(v > 1) mult[i.dataset.m] = v; });
    const o = { earn: { points: Number(f.points.value), perAmount: Number(f.perAmount.value) },
      bonus: { welcome: Number(f.welcome.value), referral: Number(f.referral.value), birthday: Number(f.birthday.value), review: Number(CF.bonus.review || 0) },
      inactiveDays: Number(f.inactiveDays.value), multipliers: mult, rewards: rewards.filter(r => r.name && r.pts > 0) };
    m.className = "msg"; m.textContent = "Guardando...";
    try{ await run(() => F.saveConfig(tok, o)); CF = F.conf(); m.className = "msg ok"; m.textContent = "✓ Reglas guardadas."; drawCfg(); }
    catch(err){ m.className = "msg err"; m.textContent = err.message; }
  });
  $("resetCfg").onclick = () => { drawCfg(); $("cfgMsg").textContent = ""; };

  // ---- exportar (CSV com BOM para Excel) ----
  function csv(rows, name){
    const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const blob = new Blob(["﻿" + rows.map(r => r.map(q).join(";")).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  $("expC").onclick = async () => {
    try{
      const r = (await run(() => F.exportCustomers(tok))).customers;
      csv([["Nombre", "WhatsApp", "Cumpleaños", "Código", "Visitas", "Puntos", "Puntos históricos", "Última visita", "Alta", "Permite mensajes WhatsApp", "Fecha de autorización"]]
        .concat(r.map(c => [c.name, c.phone, c.birthday, c.code, c.visits, c.points, c.lifetime, dshort(c.last_visit), dshort(c.created_at), c.marketingConsent ? "Sí" : "No", dshort(c.wa_confirmed_at)])), "clientes.csv");
    }catch(e){ alert(e.message); }
  };
  $("expV").onclick = async () => {
    try{
      const r = (await run(() => F.exportVisits(tok))).visits;
      csv([["Fecha", "Cliente", "Cuenta ($)", "Puntos", "Multiplicador"]].concat(r.map(v => [new Date(v.ts).toLocaleString("es-AR"), v.name, v.amount, v.pts, v.mult])), "visitas.csv");
    }catch(e){ alert(e.message); }
  };
})();
