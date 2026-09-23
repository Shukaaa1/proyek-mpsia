// Cloudflare Pages Function: /api/inventory/[id]
// PATCH: Update status aset inventaris & sinkronkan pesanan aktif

export async function onRequestPatch(context) {
  const { env, params, request } = context;
  const itemId = params.id;

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return new Response(JSON.stringify({ error: 'Status baru wajib diisi' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const nowISO = new Date().toISOString();
    const batchStatements = [
      env.DB.prepare('UPDATE inventory SET status = ? WHERE id = ?').bind(status, itemId)
    ];

    if (status === 'Available') {
      batchStatements.push(
        env.DB.prepare(
          "UPDATE orders SET status = 'Returned', returnTime = COALESCE(returnTime, ?) WHERE itemId = ? AND status IN ('On Rent', 'Booked')"
        ).bind(nowISO, itemId)
      );
    } else if (status === 'On Rent') {
      batchStatements.push(
        env.DB.prepare(
          "UPDATE orders SET status = 'On Rent', handoverTime = COALESCE(handoverTime, ?) WHERE itemId = ? AND status = 'Booked'"
        ).bind(nowISO, itemId)
      );
    }

    await env.DB.batch(batchStatements);

    return new Response(
      JSON.stringify({ ok: true, itemId, status }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
