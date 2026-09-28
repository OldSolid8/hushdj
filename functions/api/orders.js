import { json, CORS } from './_shared.js';

export async function onRequestPost(context) {
  const { env } = context;
  
  try {
    const body = await context.request.json();
    const { service_id, customer_contact, remark } = body;
    
    if (!service_id || !customer_contact) {
      return json({ error: '缺少必要参数：service_id / customer_contact' }, 400);
    }
    
    // 验证 service_id 是否存在
    const service = await env.DB.prepare('SELECT id, name FROM services WHERE id = ?')
      .bind(service_id).first();
    if (!service) {
      return json({ error: '服务不存在' }, 404);
    }
    
    const orderId = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO orders (id, service_id, customer_contact, remark) VALUES (?, ?, ?, ?)'
    ).bind(orderId, service_id, customer_contact, remark || '').run();
    
    return json({ success: true, order_id: orderId, service_name: service.name });
  } catch (e) {
    return json({ error: '请求格式错误', detail: e.message }, 400);
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}
