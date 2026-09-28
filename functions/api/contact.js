export async function onRequestGet(context) {
  const { env } = context;
  const result = await env.DB.prepare('SELECT wechat, qq, qr_image FROM contact LIMIT 1').first();
  const data = result || { wechat: '', qq: '', qr_image: '' };

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}
