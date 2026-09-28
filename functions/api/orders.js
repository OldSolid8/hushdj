export async function onRequestPost({env, request}) {
  try {
    if (!env?.DB) {
      return new Response(JSON.stringify({error: 'DB not bound'}), {status: 500});
    }
    const body = await request.json();
    const {service_id, customer_contact, remark} = body;
    if (!service_id || !customer_contact) {
      return new Response(JSON.stringify({error: '缺少参数 service_id/customer_contact'}), {status: 400});
    }
    const service = await env.DB.prepare('SELECT name FROM services WHERE id = ?').bind(service_id).first();
    if (!service) {
      return new Response(JSON.stringify({error: '服务不存在'}), {status: 404});
    }
    const orderId = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO orders (id, service_id, customer_contact, remark) VALUES (?, ?, ?, ?)'
    ).bind(orderId, service_id, customer_contact, remark || '').run();
    return new Response(JSON.stringify({success: true, order_id: orderId, service_name: service.name}), {
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    });
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {status: 500});
  }
}