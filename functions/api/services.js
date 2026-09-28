export async function onRequestGet(context) {
  const { env } = context;

  const [categories, services] = await Promise.all([
    env.DB.prepare('SELECT id, name, tag FROM categories ORDER BY id').all(),
    env.DB.prepare(`
      SELECT s.id, s.category_id, s.name, s.description, s.note, s.price, s.unit, s.badges, s.sort_order,
             c.name as category_name, c.tag as category_tag
      FROM services s
      LEFT JOIN categories c ON s.category_id = c.id
      ORDER BY s.sort_order
    `).all()
  ]);

  const rows = services.rows.map(row => ({
    ...row,
    badges: JSON.parse(row.badges || '[]')
  }));

  return new Response(
    JSON.stringify({ categories: categories.rows, services: rows }),
    { headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}
