export async function onRequestGet({env}) {
  if (!env?.DB) return new Response(JSON.stringify({error:'DB not bound'}), {status:500});
  try {
    const c = await env.DB.prepare('SELECT COUNT(*) as n FROM categories').first();
    const s = await env.DB.prepare('SELECT COUNT(*) as n FROM services').first();
    const cat = await env.DB.prepare('SELECT * FROM categories').all();
    const svc = await env.DB.prepare('SELECT * FROM services').all();
    return new Response(JSON.stringify({
      catCount: c?.n, svcCount: s?.n,
      catKeys: Object.keys(cat.results?.[0] || cat.rows?.[0] || {}),
      catSample: cat.results?.[0] || cat.rows?.[0] || null,
      svcSample: svc.results?.[0] || svc.rows?.[0] || null
    }), {headers:{'Content-Type':'application/json'}});
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {status:500});
  }
}