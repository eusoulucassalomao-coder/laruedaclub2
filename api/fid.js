// Vercel Serverless Function: /api/fid
// A lógica é a mesma do sistema antigo (Supabase + n8n), compartilhada com a versão Netlify em netlify/lib.
import handler from '../netlify/lib/fid.cjs';

export default handler;
