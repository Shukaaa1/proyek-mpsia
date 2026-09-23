// Cloudflare Pages Function: /api/orders/[code]
// PATCH: Update status order (On Rent, Returned) & sinkronisasi inventaris
// DELETE: Batalkan / hapus pesanan & kembalikan alat ke Available

export async function onRequestPatch(context) {
  const { env, params, request } = context;
  const orderCode = params.code;

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const {
      status,
      handoverTime,
      returnTime,
      handoverPhoto,
      handoverNotes,
      returnPhoto,
      returnNotes,
      lateFee,
      otherFee,
      otherFeeNotes,
      totalSettlement
    } = body;

    // Ambil order yang ada
    const order = await env.DB.prepare('SELECT * FROM orders WHERE code = ?').bind(orderCode).first();
    if (!order) {
      return new Response(JSON.stringify({ error: 'Pesanan tidak ditemukan' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const updatedHandover = handoverTime !== undefined ? handoverTime : order.handoverTime;
    const updatedReturn = returnTime !== undefined ? returnTime : order.returnTime;
    const updatedHandoverPhoto = handoverPhoto !== undefined ? handoverPhoto : order.handoverPhoto;
    const updatedHandoverNotes = handoverNotes !== undefined ? handoverNotes : order.handoverNotes;
    const updatedReturnPhoto = returnPhoto !== undefined ? returnPhoto : order.returnPhoto;
    const updatedReturnNotes = returnNotes !== undefined ? returnNotes : order.returnNotes;
    const updatedLateFee = lateFee !== undefined ? lateFee : (order.lateFee || 0);
    const updatedOtherFee = otherFee !== undefined ? otherFee : (order.otherFee || 0);
    const updatedOtherFeeNotes = otherFeeNotes !== undefined ? otherFeeNotes : order.otherFeeNotes;
    const updatedTotalSettlement = totalSettlement !== undefined ? totalSettlement : order.totalSettlement;
    const newStatus = status || order.status;

    // Update order
    const updateOrder = env.DB.prepare(`
      UPDATE orders
      SET status = ?, handoverTime = ?, returnTime = ?,
          handoverPhoto = ?, handoverNotes = ?,
          returnPhoto = ?, returnNotes = ?,
          lateFee = ?, otherFee = ?, otherFeeNotes = ?,
          totalSettlement = ?
      WHERE code = ?
    `).bind(
      newStatus,
      updatedHandover,
      updatedReturn,
      updatedHandoverPhoto,
      updatedHandoverNotes,
      updatedReturnPhoto,
      updatedReturnNotes,
      updatedLateFee,
      updatedOtherFee,
      updatedOtherFeeNotes,
      updatedTotalSettlement,
      orderCode
    );

    // Sinkronisasi status inventaris
    let newInventoryStatus = 'Available';
    if (newStatus === 'On Rent') {
      newInventoryStatus = 'On Rent';
    } else if (newStatus === 'Booked') {
      newInventoryStatus = 'Booked';
    }

    const updateInventory = env.DB.prepare(`
      UPDATE inventory
      SET status = ?
      WHERE id = ? AND status != 'Maintenance'
    `).bind(newInventoryStatus, order.itemId);

    await env.DB.batch([updateOrder, updateInventory]);

    return new Response(
      JSON.stringify({
        ok: true,
        order: {
          ...order,
          status: newStatus,
          handoverTime: updatedHandover,
          returnTime: updatedReturn,
          handoverPhoto: updatedHandoverPhoto,
          handoverNotes: updatedHandoverNotes,
          returnPhoto: updatedReturnPhoto,
          returnNotes: updatedReturnNotes,
          lateFee: updatedLateFee,
          otherFee: updatedOtherFee,
          otherFeeNotes: updatedOtherFeeNotes,
          totalSettlement: updatedTotalSettlement
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, params } = context;
  const orderCode = params.code;

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ error: "Binding 'DB' tidak tersedia" }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const order = await env.DB.prepare('SELECT * FROM orders WHERE code = ?').bind(orderCode).first();
    if (!order) {
      return new Response(JSON.stringify({ error: 'Pesanan tidak ditemukan' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hapus order dan pulihkan alat ke Available
    await env.DB.batch([
      env.DB.prepare('DELETE FROM orders WHERE code = ?').bind(orderCode),
      env.DB.prepare(
        "UPDATE inventory SET status = 'Available' WHERE id = ? AND status != 'Maintenance'"
      ).bind(order.itemId)
    ]);

    return new Response(
      JSON.stringify({ ok: true, message: `Pesanan ${orderCode} dibatalkan & alat dipulihkan.` }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
