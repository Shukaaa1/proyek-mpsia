// Cloudflare Pages Function: /api/orders
// GET: Ambil seluruh pesanan
// POST: Buat pesanan baru & sinkronkan inventaris
// DELETE: Bersihkan histori atau reset pesanan

export async function onRequestGet(context) {
  const { env } = context;
  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM orders ORDER BY createdAt DESC'
    ).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const {
      code,
      customerName,
      phone,
      institution,
      itemId,
      itemName,
      packageType,
      durationDays,
      durationBlock,
      durationText,
      totalPrice,
      paymentMethod = 'qris',
      status = 'Booked',
      datePickup,
      estimatedReturnTime,
      handoverTime = null,
      returnTime = null,
      guaranteeType = 'KTP/KTM Asli (Fisik di Lokasi)'
    } = body;

    if (!code || !customerName || !itemId) {
      return new Response(JSON.stringify({ error: 'Data pesanan tidak lengkap' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Jalankan batch: Simpan order baru & update status alat inventaris menjadi 'Booked'
    const insertOrder = env.DB.prepare(`
      INSERT INTO orders (
        code, customerName, phone, institution, itemId, itemName,
        packageType, durationDays, durationBlock, durationText, totalPrice,
        paymentMethod, status, datePickup, estimatedReturnTime, handoverTime,
        returnTime, guaranteeType
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      code,
      customerName,
      phone,
      institution || '',
      itemId,
      itemName,
      packageType,
      durationDays,
      durationBlock,
      durationText,
      totalPrice,
      paymentMethod,
      status,
      datePickup,
      estimatedReturnTime,
      handoverTime,
      returnTime,
      guaranteeType
    );

    const updateInventory = env.DB.prepare(
      "UPDATE inventory SET status = 'Booked' WHERE id = ? AND status != 'Maintenance'"
    ).bind(itemId);

    await env.DB.batch([insertOrder, updateInventory]);

    return new Response(JSON.stringify({ ok: true, order: body }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(request.url);
    const actionType = url.searchParams.get('type') || 'completed';

    if (actionType === 'completed') {
      // Hapus hanya pesanan yang sudah selesai (Returned atau Cancelled)
      await env.DB.prepare(
        "DELETE FROM orders WHERE status IN ('Returned', 'Cancelled')"
      ).run();
      return new Response(
        JSON.stringify({ ok: true, message: 'Histori pesanan selesai berhasil dibersihkan' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else if (actionType === 'all') {
      // Reset seluruh pesanan dan pulihkan status inventaris non-maintenance ke Available
      await env.DB.batch([
        env.DB.prepare('DELETE FROM orders'),
        env.DB.prepare("UPDATE inventory SET status = 'Available' WHERE status != 'Maintenance'")
      ]);
      return new Response(
        JSON.stringify({ ok: true, message: 'Seluruh pesanan dikosongkan dan alat dipulihkan ke Available' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ error: 'Tipe aksi tidak valid' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
