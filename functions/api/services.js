export async function onRequestGet({env}) {
  try {
    if (!env?.DB) {
      return new Response(JSON.stringify({error: 'DB not bound'}), {status: 500});
    }
    const categories = await env.DB.prepare('SELECT id, name, tag FROM categories ORDER BY id').all();
    const services = await env.DB.prepare('SELECT id, category_id, name, description, note, price, unit, sort_order FROM services ORDER BY sort_order').all();
    return new Response(JSON.stringify({
      categories: categories.result || [],
      services: (services.result || []).map(s => ({...s, badges: JSON.parse(s.badges || '[]')}))
    }), {headers: {'Content-Type': 'application/json; charset=utf-8'}});
  } catch(e) {
    return new Response(JSON.stringify({error: 'SQL error', message: e.message}), {status: 500});
  }
}