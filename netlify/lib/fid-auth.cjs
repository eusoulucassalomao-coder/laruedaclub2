const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const secret = () => process.env.FID_TOKEN_SECRET || "";
const b64 = value => Buffer.from(value).toString("base64url");

function sign(value) {
  const key = secret();
  if (!key) throw new Error("FID_TOKEN_SECRET is not configured");
  return crypto.createHmac("sha256", "fid-token:" + key).update(value).digest("base64url");
}
function mintToken(slug, role, ttlMs = 12 * 60 * 60 * 1000) {
  const body = [slug, role, Date.now() + ttlMs].join(".");
  return body + "." + sign(body);
}
function verifyToken(slug, token, allowedRoles) {
  const parts = String(token || "").split(".");
  if (parts.length !== 4) return false;
  const [tokenSlug, role, expires, signature] = parts;
  const body = [tokenSlug, role, expires].join(".");
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  if (tokenSlug !== slug || !Number.isFinite(Number(expires)) || Number(expires) < Date.now()) return false;
  return allowedRoles.includes(role);
}
function bearer(req) {
  const value = req.headers.authorization || "";
  return value.replace(/^Bearer\s+/i, "");
}
async function verifyRestaurantSecret(hash, candidate) {
  if (!hash || !candidate) return false;
  try { return await bcrypt.compare(String(candidate), String(hash)); }
  catch (_) { return false; }
}
function hashRestaurantSecret(value) {
  return bcrypt.hash(String(value), 12);
}
module.exports = { mintToken, verifyToken, bearer, verifyRestaurantSecret, hashRestaurantSecret };
