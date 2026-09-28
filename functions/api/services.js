export async function onRequestGet({env}) {
  if (!env?.DB) return new Response(JSON.stringify({error:'DB not bound'}), {status:500});
  try {
    const [cats, svcs] = await Promise.all([
      env.DB.prepare('SELECT id, name, tag FROM categories ORDER BY id').all(),
      env.DB.prepare('SELECT id, category_id, name, description, note, price, unit, badges, sort_order FROM services ORDER BY sort_order').all()
    ]);
    const catRows = cats.results || cats.rows || [];
    const svcRows = svcs.results || svcs.rows || [];
    return new Response(JSON.stringify({
      categories: catRows.map(r => ({id: String(r.id), name: r.name || '', tag: r.tag || ''})),
      services: svcRows.map(r => ({
        id: r.id,
        category_id: String(r.category_id),
        name: r.name || '',
        description: r.description || '',
        note: r.note || '',
        price: r.price || 0,
        unit: r.unit || '',
        badges: r.badges ? JSON.parse(r.badges) : [],
        sort_order: r.sort_order || 0
      }))
    }), {headers:{'Content-Type':'application/json; charset=utf-8'}});
  } catch(e) {
    return new Response(JSON.stringify({error: e.message}), {status:500});
  }
}