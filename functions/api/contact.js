import { json, CORS } from './_shared.js';

export async function onRequestGet(context) {
  const { env } = context;
  const result = await env.DB.prepare('SELECT wechat, qq, qr_image FROM contact LIMIT 1').first();
  if (!result) return json({ wechat: '', qq: '', qr_image: '' });
  return json(result);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
