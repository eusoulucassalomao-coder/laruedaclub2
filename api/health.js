// Vercel Serverless Function: /api/health
// Diagnóstico seguro: informa só os NOMES das variáveis que faltam (nunca os valores) e se o Supabase responde.
const REQUIRED = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_ANON_KEY',
  'FID_TOKEN_SECRET',
  'N8N_VISIT_WEBHOOK_URL',
  'N8N_VISIT_WEBHOOK_API_KEY',
];

export default async function health(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method' });
  }
  const missing = REQUIRED.filter((name) => !process.env[name]);
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(503).json({ ok: false, database: 'not_configured', missing });
  }
  try {
    const { supabase } = await import('../netlify/lib/supabase.cjs');
    const { data, error } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', 'laruedita')
      .maybeSingle();
    if (error || !data) {
      return res.status(503).json({
        ok: false,
        database: 'unavailable',
        reason: String((error && (error.message || error.code)) || 'restaurant-not-found').slice(0, 120),
        missing,
      });
    }
    return res.status(200).json({ ok: true, database: 'connected', missing });
  } catch (error) {
    console.error('health', error && error.message);
    return res.status(503).json({
      ok: false,
      database: 'unavailable',
      reason: String((error && error.message) || 'error').slice(0, 120),
      missing,
    });
  }
}
