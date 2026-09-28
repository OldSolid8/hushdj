export async function onRequestGet({env}) {
  try {
    const result = await env?.DB?.prepare('SELECT wechat, qq, qr_image FROM contact LIMIT 1').first();
    return new Response(JSON.stringify(result || {wechat: '', qq: '', qr_image: ''}), {
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {status: 500});
  }
}