(function(){
  const F = window.Fid, $ = id => document.getElementById(id);
  const fmt = n => Number(n).toLocaleString("es-AR");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ago = ts => { if(!ts) return "nunca"; const d = Math.floor((Date.now() - new Date(ts).getTime()) / 86400000); return d <= 0 ? "hoy" : d === 1 ? "ayer" : `hace ${d} días`; };
  const TK = "mkf_caja_" + F.slug;
  let tok = "", sel = null, CF = F.conf(), timer = 0;
  const phoneInput = $("phoneInput");
  const phoneIti = window.intlTelInput && phoneInput ? window.intlTelInput(phoneInput, {
    initialCountry: "ar",
    preferredCountries: ["ar", "br", "us", "gb", "es"],
    separateDialCode: true,
    nationalMode: true,
    autoPlaceholder: "polite",
    loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js")
  }) : null;
  try{ tok = sessionStorage.getItem(TK) || ""; }catch(e){}

  function logout(msg){ try{ sessionStorage.removeItem(TK); }catch(e){} tok = ""; $("app").hidden = true; $("gate").hidden = false; $("loginMsg").textContent = msg || ""; }
  // toda chamada passa por aqui: se a sessão venceu, volta ao PIN
  async function run(fn){ try{ return await fn(); }catch(e){ if(e.code === "unauthorized" || e.code === "forbidden"){ logout("La sesión venció. Ingresá nuevamente."); } throw e; } }

  async function boot(){
    CF = await F.init();
    $("gate").hidden = true; $("app").hidden = false;
    $("logo").src = CF.logo; $("club").textContent = CF.name;
    $("bBirth").textContent = `Cumpleaños +${fmt(CF.bonus.birthday)}`;
    recent();
  }
  $("loginForm").addEventListener("submit", async e => {
    e.preventDefault(); const m = $("loginMsg"); m.textContent = "";
    try{ tok = await F.authCaja($("cajaEmail").value.trim(), $("cajaPassword").value); try{ sessionStorage.setItem(TK, tok); }catch(x){} $("cajaPassword").value = ""; boot(); }
    catch(err){ m.textContent = err.message; $("cajaPassword").value = ""; }
  });
  $("out").onclick = () => logout("");
  if(tok) boot();

  document.querySelectorAll(".tab").forEach(t => t.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === t));
    ["visita", "canje", "nuevo"].forEach(n => $("p-" + n).hidden = (n !== t.dataset.tab));
  });

  // ---- visita ----
  function showCust(c){
    sel = c; $("res").innerHTML = ""; $("sel").hidden = false; $("q").value = "";
    const nx = CF.rewards.slice().sort((a, b) => a.pts - b.pts).find(w => w.pts > c.points);
    $("custBox").innerHTML = `<h3>${esc(c.name)}</h3><div class="meta">${esc(c.phone)} · código ${esc(c.code)}</div>
      <div class="pts">${fmt(c.points)}<span>puntos</span></div>
      <div class="tags"><span class="tag">${c.visits} visita${c.visits === 1 ? "" : "s"}</span><span class="tag">última: ${ago(c.lastVisit)}</span>${c.referredBy ? `<span class="tag">invitado por ${esc(c.referredBy)}</span>` : ""}${nx ? `<span class="tag">faltan ${fmt(nx.pts - c.points)} p/ ${esc(nx.name)}</span>` : ""}</div>`;
    $("amount").value = ""; $("prev").hidden = true; $("vMsg").textContent = ""; $("vMsg").className = "msg"; $("amount").focus();
  }
  $("q").addEventListener("input", () => {
    clearTimeout(timer);
    const q = $("q").value;
    timer = setTimeout(async () => {
      if(q.trim().length < 2){ $("res").innerHTML = ""; return; }
      try{
        const r = (await run(() => F.search(tok, q))).results;
        if($("q").value !== q) return;   // chegou resposta velha
        $("res").innerHTML = r.map(c => `<button type="button" data-i="${esc(c.id)}"><span><b>${esc(c.name)}</b><br><small>${esc(c.phone)} · ${esc(c.code)}</small></span><small>${fmt(c.points)} pts</small></button>`).join("")
          || `<small style="color:var(--muted)">No hay resultados. Usá “Cliente nuevo”.</small>`;
        $("res").querySelectorAll("button").forEach(b => b.onclick = () => showCust(r.find(x => x.id === b.dataset.i)));
      }catch(e){ $("res").innerHTML = `<small style="color:var(--bad)">${esc(e.message)}</small>`; }
    }, 250);
  });
  $("amount").addEventListener("input", () => {
    const raw = $("amount").value.replace(/\D/g, ""), n = Number(raw);
    $("amount").value = raw ? fmt(n) : "";
    const m = F.multOf(Date.now());
    $("prev").hidden = !(n > 0);
    if(n > 0) $("prev").textContent = `Suma ${fmt(F.calcPoints(n))} puntos${m > 1 ? ` (hoy valen x${m})` : ""}`;
  });
  $("doVisit").onclick = async () => {
    const m = $("vMsg"), btn = $("doVisit"); m.className = "msg"; btn.disabled = true;
    try{
      const n = Number($("amount").value.replace(/\D/g, ""));
      const r = await run(() => F.visit(tok, sel.id, n));
      let t = `✓ ${r.customer.name} suma ${fmt(r.pts)} puntos. Total: ${fmt(r.customer.points)}.`;
      if(r.bonuses.length) t += ` Bono de invitación: +${fmt(r.bonuses[0].pts)} para cada uno.`;
      if(r.campaignEvent === "sent") t += " Aviso enviado al sistema de WhatsApp.";
      else if(r.campaignEvent === "not_configured") t += " Aviso: falta configurar la conexión con n8n.";
      else if(r.campaignEvent === "failed") t += " La visita quedó registrada, pero n8n no respondió.";
      showCust(r.customer);
      m.textContent = t;
      m.className = "msg ok"; recent();
    }catch(e){ m.textContent = e.message; m.className = "msg err"; }
    btn.disabled = false;
  };
  [["bBirth", "birthday"]].forEach(([id, type]) => $(id).onclick = async () => {
    try{
      const r = await run(() => F.bonus(tok, sel.id, type));
      showCust(r.customer); $("vMsg").textContent = `✓ +${fmt(r.pts)} puntos para ${r.customer.name}.`; $("vMsg").className = "msg ok"; recent();
    }catch(e){ $("vMsg").textContent = e.message; $("vMsg").className = "msg err"; }
  });

  // ---- premios ----
  async function lookCode(){
    const m = $("cMsg"), box = $("cBox"); m.className = "msg"; m.textContent = ""; box.innerHTML = "";
    const code = $("code").value.trim();
    if(!code) return;
    try{
      const r = await run(() => F.findCode(tok, code));
      if(r.status === "canjeado"){ m.textContent = "Este premio ya fue entregado"; m.className = "msg err"; return; }
      if(r.status !== "pendiente"){ m.textContent = "Código no válido"; m.className = "msg err"; return; }
      box.innerHTML = `<div class="rcpt"><b>${esc(r.name)}</b><br>Para ${esc(r.customer || "—")} · ${fmt(r.pts)} puntos<br><button class="btn full" id="doDeliver" type="button" style="margin-top:12px">Entregar premio</button></div>`;
      $("doDeliver").onclick = async () => {
        try{ await run(() => F.deliver(tok, r.code)); box.innerHTML = ""; m.textContent = `✓ Premio entregado: ${r.name}`; m.className = "msg ok"; $("code").value = ""; }
        catch(e){ m.textContent = e.message; m.className = "msg err"; }
      };
    }catch(e){ m.textContent = e.message; m.className = "msg err"; }
  }
  $("doCode").onclick = lookCode;
  $("code").addEventListener("keydown", e => { if(e.key === "Enter") lookCode(); });

  // ---- alta rápida ----
  $("newForm").addEventListener("submit", async e => {
    e.preventDefault(); const f = e.target, m = $("nMsg"); m.className = "msg err"; m.textContent = "";
    try{
      if(!phoneIti){ throw new Error("No se pudo cargar el selector de país. Actualizá la página e intentá nuevamente."); }
      if(phoneIti.promise) await phoneIti.promise;
      if(!phoneIti.isValidNumber()){ phoneInput.focus(); throw new Error("Revisá el número de WhatsApp y el país seleccionado."); }
      const internationalPhone = phoneIti.getNumber();
      const r = await run(() => F.newCustomer(tok, { name: f.name.value, phone: internationalPhone, birthday: f.birthday.value, consent: true, waConsent: true }));
      f.reset(); m.className = "msg ok"; m.textContent = `✓ ${r.customer.name} ya está en el club (código ${r.customer.code}).`;
    }catch(err){ m.textContent = err.message; }
  });

  async function recent(){
    try{
      const r = (await run(() => F.recent(tok))).visits;
      $("recent").innerHTML = r.length ? r.map(v => `<li><span>${esc(v.name)}<br><small>${new Date(v.ts).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</small></span><span style="text-align:right">$${fmt(v.amount)}<br><small>+${fmt(v.pts)} pts</small></span></li>`).join("") : "<li><small>Todavía no hay visitas.</small></li>";
    }catch(e){}
  }
})();
