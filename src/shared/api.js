// Client API Helper untuk sinkronisasi Cloudflare D1
// Menggunakan arsitektur resilient (Graceful Fallback) agar tidak ada runtime crash jika D1 offline

const isBrowser = typeof window !== 'undefined';

export async function checkAndInitD1() {
  if (!isBrowser) return { connected: false };
  try {
    const res = await fetch('/api/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) {
      return { connected: false, status: res.status };
    }
    const data = await res.json();
    return { connected: !!data.connected, ...data };
  } catch (e) {
    // API endpoint tidak tersedia (misal running di localhost Vite biasa atau D1 belum dibind)
    return { connected: false, offline: true, error: e.message };
  }
}

export async function fetchRemoteInventory() {
  if (!isBrowser) return null;
  try {
    const res = await fetch('/api/inventory');
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
}

export async function fetchRemoteOrders() {
  if (!isBrowser) return null;
  try {
    const res = await fetch('/api/orders');
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

export async function createRemoteOrder(order) {
  if (!isBrowser) return false;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateRemoteOrderStatus(orderCode, payload) {
  if (!isBrowser) return false;
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderCode)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteRemoteOrder(orderCode) {
  if (!isBrowser) return false;
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderCode)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function clearRemoteOrders(type = 'completed') {
  if (!isBrowser) return false;
  try {
    const res = await fetch(`/api/orders?type=${encodeURIComponent(type)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function updateRemoteItemStatus(itemId, status) {
  if (!isBrowser) return false;
  try {
    const res = await fetch(`/api/inventory/${encodeURIComponent(itemId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch {
    return false;
  }
}
