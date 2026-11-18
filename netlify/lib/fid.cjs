const crypto = require("crypto");
const {
  queryEqual, queryOrderDesc, queryLimit,
  listDocuments, getDocument, updateDocument, deleteDocument,
  commitOperations, transactionCreate, transactionUpdate, transactionDelete,
} = require("./supabase-db.cjs");
const { mintToken, verifyToken, bearer, verifyRestaurantSecret } = require("./fid-auth.cjs");
const { supabase, createAuthClient } = require("./supabase.cjs");

const digits = value => String(value || "").replace(/\D/g, "");
const isoNow = () => new Date().toISOString();
const parseConfig = value => {
  if (value && typeof value === "object") return value;
  try { return JSON.parse(value || "{}"); } catch (_) { return {}; }
};
async function rpc(name, args) {
  const { data, error } = await supabase.rpc(name, args);
  if (error) {
    const match = /^E\|([^|]+)\|([\s\S]*)$/.exec(error.message || "");
    if (match) throw Object.assign(new Error(match[2]), { code: match[1], status: 400 });
    console.error("Supabase RPC", name, error.message);
    throw Object.assign(new Error("No se pudo completar la operación"), { code: "db", status: 500 });
  }
  return data;
}
const publicCustomer = c => ({
  id: c.id, name: c.name, phone: c.phone, code: c.code, birthday: c.birthday || null,
  points: c.points, lifetime: c.lifetime, visits: c.visits,
  lastVisit: c.last_visit || null, createdAt: c.created_at,
  optedOut: !!c.opted_out, confirmed: !!c.wa_confirmed_at, marketingConsent: !!c.wa_confirmed_at && !c.opted_out,
});
async function many(collection, queries = [], limit = 100) {
  const result = await listDocuments(collection, [...queries, queryLimit(limit)]);
  return result.documents || [];
}
async function one(collection, queries) {
  return (await many(collection, queries, 1))[0] || null;
}
async function restaurantBySlug(slug) {
  const r = await one("restaurants", [queryEqual("slug", slug)]);
  if (!r) throw Object.assign(new Error("Restaurante no encontrado"), { status: 404, code: "restaurant" });
  r.config = parseConfig(r.config);
  return r;
}
async function customerByToken(r, token) {
  if (!/^[a-f0-9]{36}$/.test(String(token || ""))) throw Object.assign(new Error("Link no válido"), { status: 401, code: "token" });
  const c = await one("customers", [queryEqual("restaurant_id", r.id), queryEqual("access_token", token)]);
  if (!c) throw Object.assign(new Error("Link no válido"), { status: 401, code: "token" });
  return c;
}
async function customerById(r, id) {
  const c = await getDocument("customers", String(id || ""));
  if (c.restaurant_id !== r.id) throw Object.assign(new Error("Cliente no encontrado"), { status: 404, code: "customer" });
  return c;
}
async function customerByCode(r, value) {
  const code = String(value || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  if (code.length < 3) throw Object.assign(new Error("Ingresá tu código de socio"), { status: 400, code: "customer-not-found" });
  const c = await one("customers", [queryEqual("restaurant_id", r.id), queryEqual("code", code)]);
  if (!c) throw Object.assign(new Error("No encontramos ese código. Revisalo e intentá de nuevo."), { status: 404, code: "customer-not-found" });
  return c;
}
function makeCustomerCode(name) {
  const base = String(name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 3).padEnd(3, "X");
  return base + String(100 + crypto.randomInt(0, 900));
}
async function uniqueCode(r, name) {
  for (let i = 0; i < 30; i++) {
    const code = makeCustomerCode(name);
    if (!(await one("customers", [queryEqual("restaurant_id", r.id), queryEqual("code", code)]))) return code;
  }
  throw new Error("No se pudo generar un código único");
}
async function registerCustomer(r, input) {
  const name = String(input.name || "").trim();
  const phone = digits(input.phone);
  if (name.length < 2 || name.length > 80) throw Object.assign(new Error("Escribí tu nombre"), { code: "name" });
  if (phone.length < 8 || phone.length > 15) throw Object.assign(new Error("Revisá tu número de celular con código de área"), { code: "phone" });
  const birthday = String(input.birthday || "").trim();
  const birthdayDate = new Date(birthday + "T00:00:00Z");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday) || !Number.isFinite(birthdayDate.getTime()) ||
      birthdayDate.toISOString().slice(0, 10) !== birthday || birthday > isoNow().slice(0, 10)) {
    throw Object.assign(new Error("Ingresá tu fecha de nacimiento para recibir tu saludo y beneficio de cumpleaños"), { code: "birthday" });
  }
  if (!input.consent || input.waConsent !== true) {
    throw Object.assign(new Error("Para unirte al club necesitás aceptar las comunicaciones y el uso de tus datos informados en el alta"), { code: "consent" });
  }
  const data = await rpc("fid_register", {
    p_slug: r.slug,
    p_name: name,
    p_phone: phone,
    p_birthday: birthday,
    p_ref: String(input.ref || "").trim() || null,
    p_consent: true
  });
  const now = isoNow();
  return {
    id: data.id, name: data.name, phone, code: data.code, birthday: data.birthday || birthday,
    points: data.points, lifetime: data.lifetime, visits: data.visits,
    last_visit: data.lastVisit || null, created_at: data.createdAt || now,
    opted_out: !!data.optedOut, wa_confirmed_at: data.confirmed ? now : null,
    access_token: data.accessToken
  };
}
function localParts(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short" }).formatToParts(date);
  const p = Object.fromEntries(parts.map(x => [x.type, x.value]));
  return { year: Number(p.year), month: Number(p.month), day: Number(p.day), weekday: ({ Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 })[p.weekday] };
}
function addCalendarMonths(value, months) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return new Date(NaN);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date;
}
function birthdayWithinDays(birthday, today, days = 30) {
  if (!birthday) return false;
  const [, month, day] = String(birthday).split("-").map(Number);
  if (!month || !day) return false;
  for (let offset = 0; offset <= days; offset++) {
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + offset));
    if (date.getUTCMonth() + 1 === month && date.getUTCDate() === day) return true;
  }
  return false;
}
function cleanConfig(old, input) {
  const num = (v, min, max, integer = true) => {
    const n = Number(v);
    if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isInteger(n))) throw Object.assign(new Error("Revisá los números"), { code: "config" });
    return n;
  };
  const out = { ...old };
  out.earn = { points: num(input?.earn?.points, 1, 1000), perAmount: num(input?.earn?.perAmount, 1, 10000000) };
  out.bonus = {
    welcome: num(input?.bonus?.welcome, 0, 100000), referral: num(input?.bonus?.referral, 0, 100000),
    birthday: num(input?.bonus?.birthday, 0, 100000), review: num(input?.bonus?.review, 0, 100000),
  };
  out.inactiveDays = num(input?.inactiveDays, 7, 365);
  const multipliers = {};
  for (const [day, value] of Object.entries(input?.multipliers || {})) {
    if (/^[0-6]$/.test(day)) { const n = num(value, 1, 10, false); if (n > 1) multipliers[day] = n; }
  }
  out.multipliers = multipliers;
  const rewards = Array.isArray(input?.rewards) ? input.rewards : [];
  if (rewards.length < 1 || rewards.length > 12) throw Object.assign(new Error("Dejá entre 1 y 12 premios"), { code: "config" });
  const ids = new Set();
  out.rewards = rewards.map((x, i) => {
    let id = String(x?.id || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 20) || "p" + i;
    while (ids.has(id)) id += "x";
    ids.add(id);
    const name = String(x?.name || "").trim().slice(0, 60);
    if (!name) throw Object.assign(new Error("Cada premio necesita un nombre"), { code: "config" });
    const img = /^assets\/[A-Za-z0-9._-]{1,80}$/.test(String(x?.img || "")) ? x.img : (old?.rewards?.[0]?.img || "assets/logo.webp");
    return { id, name, pts: num(x?.pts, 1, 10000000), note: String(x?.note || "").trim().slice(0, 120), img };
  });
  return out;
}
async function statsFor(r) {
  const [customers, visits, redemptions] = await Promise.all([
    many("customers", [queryEqual("restaurant_id", r.id)], 5000),
    many("visits", [queryEqual("restaurant_id", r.id)], 5000),
    many("redemptions", [queryEqual("restaurant_id", r.id)], 5000),
  ]);
  const now = new Date(), tz = r.config?.tz || "America/Argentina/Buenos_Aires";
  const today = localParts(now, tz), dayStart = new Date(now.getTime() - 30 * 86400000);
  const recentVisits = visits.filter(v => new Date(v.created_at) >= dayStart);
  const inactiveDays = Number(r.config?.inactiveDays || 30);
  const inactive = customers.filter(c => c.wa_confirmed_at && !c.opted_out && c.visits >= 1 && c.last_visit && now - new Date(c.last_visit) > inactiveDays * 86400000)
    .sort((a,b) => new Date(a.last_visit) - new Date(b.last_visit)).slice(0,100)
    .map(c => ({ id:c.id, name:c.name, phone:c.phone, points:c.points, last_visit:c.last_visit }));
  const dayMap = new Map();
  for (let i=13;i>=0;i--) {
    const d = new Date(now.getTime() - i*86400000), parts = localParts(d,tz);
    const key = `${parts.year}-${parts.month}-${parts.day}`;
    dayMap.set(key,{ label:parts.day,n:0,sum:0 });
  }
  for (const v of visits) {
    const p=localParts(new Date(v.created_at),tz), key=`${p.year}-${p.month}-${p.day}`, slot=dayMap.get(key);
    if(slot){slot.n++;slot.sum+=Number(v.amount)||0;}
  }
  const birthdays = customers.filter(c => birthdayWithinDays(c.birthday, today, 30))
    .slice(0,50).map(c=>({name:c.name,birthday:c.birthday}));
  const repeat=customers.filter(c=>c.visits>=1);
  return {
    customers:customers.length,new30:customers.filter(c=>new Date(c.created_at)>=dayStart).length,
    visits30:recentVisits.length,revenue30:recentVisits.reduce((s,v)=>s+(Number(v.amount)||0),0),
    avgTicket:recentVisits.length?Math.round(recentVisits.reduce((s,v)=>s+(Number(v.amount)||0),0)/recentVisits.length):0,
    returnRate:repeat.length?Math.round(100*repeat.filter(c=>c.visits>=2).length/repeat.length):0,
    refTotal:customers.filter(c=>c.referred_by).length,refDone:customers.filter(c=>c.referred_by&&c.visits>=1).length,
    redeemed:redemptions.filter(x=>x.status==="canjeado").length,pending:redemptions.filter(x=>x.status==="pendiente").length,
    inactive,top:customers.sort((a,b)=>b.lifetime-a.lifetime).slice(0,5).map(c=>({name:c.name,visits:c.visits,lifetime:c.lifetime})),
    days:Array.from(dayMap.values()),birthdays,
  };
}
async function waCall(r, action) {
  if (!r.n8n_wa_webhook) return { state: "unconfigured" };
  try {
    const response = await fetch(r.n8n_wa_webhook, {
      method:"POST",headers:{"content-type":"application/json","x-fid-event-key":r.n8n_secret||""},
      body:JSON.stringify({action,slug:r.slug}),signal:AbortSignal.timeout(50000),
    });
    if(!response.ok) return {state:"unavailable",status:response.status};
    const j=await response.json().catch(()=>({}));
    const qr=typeof j.qr==="string"&&j.qr.startsWith("data:image/")&&j.qr.length<300000?j.qr:"";
    return {state:String(j.state||"unknown").slice(0,20),qr,pairingCode:String(j.pairingCode||"").slice(0,20)};
  } catch (_) { return {state:"unavailable"}; }
}
async function notifyVisitWebhook(r, customer, visitId, surveyToken, visit) {
  const url = process.env.N8N_VISIT_WEBHOOK_URL || "";
  const apiKey = process.env.N8N_VISIT_WEBHOOK_API_KEY || "";
  if (!url || !apiKey) return { state: "not_configured" };
  if (!surveyToken || !visitId) return { state: "missing_survey" };

  const siteUrl = (r.config?.siteUrl || process.env.URL || "https://larueditaclub2.netlify.app").replace(/\/$/, "");
  const surveyUrl = `${siteUrl}/surveys?t=${surveyToken}`;
  const payload = {
    event: "visit.registered",
    visitId,
    restaurantSlug: r.slug,
    customerId: customer.id,
    customerName: customer.name,
    phone: customer.phone,
    consentWhatsApp: Boolean(customer.wa_confirmed_at && !customer.opted_out),
    surveyUrl,
    visitAt: visit.created_at,
    amount: visit.amount,
    points: visit.points
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: apiKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });
    return { state: response.ok ? "sent" : "failed", status: response.status, surveyUrl };
  } catch (error) {
    console.error("visit-webhook", error);
    return { state: "failed", surveyUrl };
  }
}

async function notifySurveyWebhook(r, surveyToken, rating, comment, result) {
  const visitWebhookUrl = process.env.N8N_VISIT_WEBHOOK_URL || "";
  const apiKey = process.env.N8N_VISIT_WEBHOOK_API_KEY || "";
  if (!visitWebhookUrl || !apiKey) return { state: "not_configured" };

  const url = visitWebhookUrl.replace(
    /\/webhook\/la-ruedita\/visit-review-campaign\/?$/,
    "/webhook/la-ruedita/survey-response"
  );
  if (url === visitWebhookUrl) return { state: "invalid_webhook_config" };

  try {
    const survey = await one("surveys", [
      queryEqual("restaurant_id", r.id),
      queryEqual("token", surveyToken)
    ]);
    if (!survey) return { state: "survey_not_found" };

    const customer = await getDocument("customers", survey.customer_id);
    if (!customer?.phone || !customer.wa_confirmed_at || customer.opted_out) {
      return { state: "not_eligible" };
    }

    const payload = {
      event: "survey.submitted",
      restaurantSlug: r.slug,
      customerId: customer.id,
      customerName: customer.name,
      phone: customer.phone,
      rating,
      comment,
      reviewUrl: result.reviewUrl || ""
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: apiKey },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000)
    });
    return { state: response.ok ? "sent" : "failed", status: response.status };
  } catch (error) {
    console.error("survey-webhook", error);
    return { state: "failed" };
  }
}

async function addVisit(r, customer, amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0 || value > 100000000) {
    throw Object.assign(new Error("Ingresá el valor de la cuenta"), { code: "amount" });
  }

  const result = await rpc("fid_add_visit", {
    p_slug: r.slug,
    p_customer: customer.id,
    p_amount: value,
    p_staff: "caja"
  });

  const saved = result.customer || {};
  const updated = {
    ...customer,
    points: Number(saved.points ?? customer.points),
    lifetime: Number(saved.lifetime ?? customer.lifetime),
    visits: Number(saved.visits ?? customer.visits),
    last_visit: saved.lastVisit || isoNow(),
    opted_out: !!saved.optedOut,
    wa_confirmed_at: saved.confirmed ? (customer.wa_confirmed_at || isoNow()) : null
  };
  const campaignEvent = await notifyVisitWebhook(
    r,
    { ...customer, ...updated, name: saved.name || customer.name, phone: saved.phone || customer.phone },
    result.visitId,
    result.surveyToken,
    { created_at: updated.last_visit, amount: value, points: Number(result.pts || 0) }
  );

  return {
    customer: { ...publicCustomer(updated), id: customer.id },
    pts: Number(result.pts || 0),
    mult: Number(result.mult || 1),
    bonuses: result.bonuses || [],
    campaignEvent: campaignEvent.state,
    surveyUrl: campaignEvent.surveyUrl || null
  };
}
async function addBonus(r, customer, type) {
  if (!["birthday", "review"].includes(type)) {
    throw Object.assign(new Error("Bono no disponible"), { code: "bonus" });
  }
  const result = await rpc("fid_add_bonus", {
    p_slug: r.slug,
    p_customer: customer.id,
    p_type: type
  });
  const saved = result.customer || {};
  const updated = {
    ...customer,
    points: Number(saved.points ?? customer.points),
    lifetime: Number(saved.lifetime ?? customer.lifetime),
    visits: Number(saved.visits ?? customer.visits),
    last_visit: saved.lastVisit || customer.last_visit
  };
  return { customer: { ...publicCustomer(updated), id: customer.id }, pts: Number(result.pts || 0) };
}
async function expirePoints(r) {
  return await rpc("fid_expire", { p_slug: r.slug });
}
async function autoCandidates(r, kind) {
  const now=new Date(),tz=r.config?.tz||"America/Argentina/Buenos_Aires",today=localParts(now,tz);
  const customers=await many("customers",[queryEqual("restaurant_id",r.id)],5000);
  const logs=await many("message_log",[queryEqual("restaurant_id",r.id)],5000);
  const recent=(c,k,days)=>logs.some(m=>m.customer_id===c.id&&m.kind===k&&now-new Date(m.created_at)<days*86400000);
  let selected=[];
  if(kind==="winback") selected=customers.filter(c=>c.consent&&c.wa_confirmed_at&&!c.opted_out&&c.visits>=1&&c.last_visit&&now-new Date(c.last_visit)>Number(r.config?.inactiveDays||30)*86400000&&!recent(c,"winback",30));
  else if(kind==="birthday") selected=customers.filter(c=>c.consent&&c.wa_confirmed_at&&!c.opted_out&&c.birthday&&String(c.birthday).slice(5)===`${String(today.month).padStart(2,"0")}-${String(today.day).padStart(2,"0")}`&&!logs.some(m=>m.customer_id===c.id&&m.kind==="birthday"&&localParts(new Date(m.created_at),tz).year===today.year));
  else if(kind==="expiring"){
    const months=Math.max(1,Number(r.config?.expireMonths)||12);
    selected=customers.filter(c=>{
      if(!c.consent||!c.wa_confirmed_at||c.opted_out||c.points<=0||!c.last_visit) return false;
      const lastVisit=new Date(c.last_visit), start=addCalendarMonths(lastVisit,months-1), end=addCalendarMonths(lastVisit,months);
      return now>=start&&now<end&&!recent(c,"expiring",60);
    });
  } else throw Object.assign(new Error("Tipo no válido"),{code:"kind"});
  return selected.slice(0,50).map(c=>({...publicCustomer(c),token:c.access_token}));
}

module.exports = async function handler(req,res) {
  res.setHeader("Cache-Control","no-store");
  res.setHeader("Content-Type","application/json; charset=utf-8");
  if(req.method!=="POST") return res.status(405).json({error:"method"});
  const body=req.body||{},slug=String(body.slug||"").toLowerCase();
  if(!/^[a-z0-9_-]{2,40}$/.test(slug)) return res.status(400).json({error:"bad-slug"});
  try {
    const r=await restaurantBySlug(slug),action=String(body.action||"");
    if(action==="config") return res.status(200).json({name:r.name,config:r.config});
    if(action==="register"||action==="new_customer"){
      const c=await registerCustomer(r,body);
      if(action==="new_customer") return res.status(200).json({customer:{id:c.id,name:c.name,code:c.code}});
      return res.status(200).json({customer:publicCustomer(c),token:c.access_token});
    }
    if(action==="me"){
      const c=await customerByToken(r,body.token);
      const [history,redemptions]=await Promise.all([
        many("ledger",[queryEqual("customer_id",c.id),queryOrderDesc("created_at")],8),
        many("redemptions",[queryEqual("customer_id",c.id),queryOrderDesc("created_at")],10),
      ]);
      return res.status(200).json({customer:{...publicCustomer(c),confirmed:!!c.wa_confirmed_at},history:history.map(x=>({points:x.points,type:x.type,note:x.note,created_at:x.created_at})),redemptions:redemptions.map(x=>({name:x.name,points:x.points,code:x.code,status:x.status,created_at:x.created_at}))});
    }
    if(action==="lookup_code"){
      const c=await customerByCode(r,body.code);
      const redemptions=await many("redemptions",[queryEqual("customer_id",c.id),queryOrderDesc("created_at")],10);
      return res.status(200).json({
        customer:{name:c.name,code:c.code,points:c.points},
        redemptions:redemptions.map(x=>({name:x.name,points:x.points,code:x.code,status:x.status,created_at:x.created_at}))
      });
    }
    if(action==="login") return res.status(200).json({ok:true,channel:false});
    if(action==="auth"){
      const role = body.role === "panel" ? "panel" : body.role === "caja" ? "caja" : "";
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      if (!role || !email || !password) {
        return res.status(400).json({ error: "missing_credentials", message: "Ingresá tu correo y contraseña." });
      }

      const authClient = createAuthClient();
      const { data: signedIn, error: signInError } = await authClient.auth.signInWithPassword({ email, password });
      if (signInError || !signedIn?.user) {
        return res.status(401).json({ error: "invalid_credentials", message: "Correo o contraseña incorrectos." });
      }

      const { data: staff, error: staffError } = await supabase
        .from("staff_access")
        .select("role, active")
        .eq("user_id", signedIn.user.id)
        .eq("restaurant_id", r.id)
        .eq("active", true)
        .maybeSingle();

      if (staffError) {
        console.error("staff-access", staffError.message);
        return res.status(500).json({ error: "auth_unavailable", message: "No se pudo validar el acceso." });
      }
      if (!staff || staff.role !== role) {
        return res.status(403).json({ error: "role_not_authorized", message: "Esta cuenta no tiene permiso para este panel." });
      }

      return res.status(200).json({ token: mintToken(slug, role), role });
    }

    if(action.startsWith("auto_")){
      const key=String(req.headers["x-fid-key"]||"");
      if(!(await verifyRestaurantSecret(r.auto_key_hash,key))) return res.status(401).json({error:"unauthorized"});
      if(action==="auto_candidates") return res.status(200).json({customers:await autoCandidates(r,String(body.kind)),site:r.config?.siteUrl||""});
      if(action==="auto_log"){
        const log={restaurant_id:r.id,customer_id:String(body.customer||""),kind:String(body.kind||"").slice(0,40),created_at:isoNow()};
        if(body.meta!=null) log.meta=JSON.stringify(body.meta);
        await commitOperations([transactionCreate("message_log",crypto.randomUUID(),log)]);
        return res.status(200).json({ok:true});
      }
      if(action==="auto_stats") return res.status(200).json(await statsFor(r));
      if(action==="auto_expire") return res.status(200).json(await expirePoints(r));
      if(action==="auto_optout"){
        const key=digits(body.phone).slice(-8);
        if(key.length===8){
          const c=await one("customers",[queryEqual("restaurant_id",r.id),queryEqual("phone_key",key)]);
          if(c) await updateDocument("customers",c.id,{opted_out:true});
        }
        return res.status(200).json({ok:true});
      }
      return res.status(400).json({error:"bad-action"});
    }

    const token=bearer(req);
    const cashier=["search","visit","bonus","find_code","deliver","recent"].includes(action);
    const owner=["stats","customers","export_customers","export_visits","redemptions","save_config","wa_status","wa_connect","wa_logout"].includes(action);
    if(cashier||owner){
      const roles=owner?["panel"]:["caja","panel"];
      if(!verifyToken(slug,token,roles)) return res.status(401).json({error:"unauthorized",message:"La sesión venció. Entrá de nuevo."});
    }

    if(action==="search"){
      const q=String(body.q||"").trim().toLowerCase(),d=digits(q);
      const all=await many("customers",[queryEqual("restaurant_id",r.id)],5000);
      const found=all.filter(c=>c.name.toLowerCase().includes(q)||(d.length>=4&&c.phone.includes(d))||c.code.toLowerCase()===q)
        .sort((a,b)=>new Date(b.last_visit||0)-new Date(a.last_visit||0)).slice(0,8);
      return res.status(200).json({results:found.map(publicCustomer)});
    }
    if(action==="visit"){
      const c=await customerById(r,body.customer);
      return res.status(200).json(await addVisit(r,c,body.amount));
    }
    if(action==="bonus"){
      const c=await customerById(r,body.customer);
      return res.status(200).json(await addBonus(r,c,String(body.type||"")));
    }
    if(action==="find_code"){
      const code=String(body.code||"").trim().toUpperCase();
      const red=await one("redemptions",[queryEqual("restaurant_id",r.id),queryEqual("code",code)]);
      if(!red) throw Object.assign(new Error("Código de canje no encontrado. Ingresá el código del premio que empieza con P y que el cliente ve en “Mis puntos”; no el código de socio."),{status:404,code:"redemption-not-found"});
      const c=await customerById(r,red.customer_id);
      return res.status(200).json({status:red.status,name:red.name,customer:c.name,pts:red.points,code:red.code});
    }
    if(action==="deliver"){
      const result=await rpc("fid_deliver",{p_slug:r.slug,p_code:String(body.code||"").trim().toUpperCase()});
      return res.status(200).json({
        code:result.code,name:result.name,pts:result.pts,status:result.status,customer:result.customer
      });
    }
    if(action==="recent"){
      const visits=await many("visits",[queryEqual("restaurant_id",r.id),queryOrderDesc("created_at")],8);
      const rows=await Promise.all(visits.map(async v=>({amount:v.amount,pts:v.points,ts:v.created_at,name:(await getDocument("customers",v.customer_id).catch(()=>null))?.name||"—"})));
      return res.status(200).json({visits:rows});
    }
    if(action==="claim"||action==="claim_by_code"){
      const c=action==="claim_by_code"?await customerByCode(r,body.code):await customerByToken(r,body.token);
      const redemption=await rpc("fid_claim",{
        p_slug:r.slug,
        p_customer:c.id,
        p_reward:String(body.reward||"")
      });
      return res.status(200).json({redemption});
    }
    if(action==="stats") return res.status(200).json(await statsFor(r));
    if(action==="customers"){
      const q=String(body.q||"").trim().toLowerCase(),d=digits(q);
      const all=await many("customers",[queryEqual("restaurant_id",r.id)],5000);
      const rows=all.filter(c=>!q||c.name.toLowerCase().includes(q)||(d.length>=4&&c.phone.includes(d))||c.code.toLowerCase()===q)
        .sort((a,b)=>b.lifetime-a.lifetime).slice(0,80);
      return res.status(200).json({customers:rows.map(c=>({name:c.name,phone:c.phone,visits:c.visits,points:c.points,code:c.code,last_visit:c.last_visit,marketingConsent:!!c.wa_confirmed_at&&!c.opted_out}))});
    }
    if(action==="export_customers"){
      const rows=await many("customers",[queryEqual("restaurant_id",r.id)],5000);
      return res.status(200).json({customers:rows.map(c=>({name:c.name,phone:c.phone,birthday:c.birthday,code:c.code,visits:c.visits,points:c.points,lifetime:c.lifetime,last_visit:c.last_visit,created_at:c.created_at,consent:c.consent,opted_out:c.opted_out,wa_confirmed_at:c.wa_confirmed_at,marketingConsent:!!c.wa_confirmed_at&&!c.opted_out}))});
    }
    if(action==="export_visits"){
      const rows=await many("visits",[queryEqual("restaurant_id",r.id),queryOrderDesc("created_at")],5000);
      return res.status(200).json({visits:await Promise.all(rows.map(async v=>({ts:v.created_at,name:(await getDocument("customers",v.customer_id).catch(()=>null))?.name||"",amount:v.amount,pts:v.points,mult:v.multiplier})))});
    }
    if(action==="redemptions"){
      const rows=await many("redemptions",[queryEqual("restaurant_id",r.id),queryOrderDesc("created_at")],60);
      return res.status(200).json({redemptions:await Promise.all(rows.map(async x=>({name:x.name,code:x.code,status:x.status,ts:x.created_at,usedAt:x.used_at,customer:(await getDocument("customers",x.customer_id).catch(()=>null))?.name||"—"})))});
    }
    if(action==="save_config"){
      const next=cleanConfig(r.config,body.config);
      await updateDocument("restaurants",r.id,{config:JSON.stringify(next)});
      return res.status(200).json({ok:true,config:next});
    }
    if(["wa_status","wa_connect","wa_logout"].includes(action)){
      const state=await waCall(r,action.slice(3));
      return res.status(200).json(state);
    }

    if(action==="submit_survey"){
      const token=String(body.token||"");
      const rating=Number(body.rating||0);
      const comment=String(body.comment||"").trim().slice(0,500);
      const result=await rpc("fid_submit_survey",{
        p_slug:r.slug,p_token:token,p_rating:rating,p_comment:comment
      });
      const notification = await notifySurveyWebhook(r, token, rating, comment, result);
      return res.status(200).json({ ...result, notification: notification.state });
    }

    return res.status(400).json({error:"bad-action"});
  } catch(error) {
    const status=error.status||(error.code==="APPWRITE_NOT_CONFIGURED"||error.code==="APPWRITE_DATABASE_NOT_CONFIGURED"?503:500);
    if(status>=500) console.error("fid-supabase",error);
    return res.status(status).json({error:error.code||"server",message:status>=500?"No se pudo completar. Probá de nuevo.":error.message});
  }
};
