import React from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah } from '../../shared/utils/formatters';

export default function AdminKPIs() {
  const { inventory, orders } = useRental();
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const total = safeInventory.length;
  const available = safeInventory.filter((i) => i && i.status === 'Available').length;
  const onrent = safeInventory.filter((i) => i && (i.status === 'On Rent' || i.status === 'Booked')).length;
  const totalRevenue = safeOrders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card p-4 space-y-1">
        <span className="text-xs font-semibold text-slate-500">Total Inventaris</span>
        <div className="text-2xl font-black text-slate-900" id="admin-kpi-total">
          {total} Alat
        </div>
        <span className="text-[11px] text-slate-500">Kamera, Lensa, Audio, dll</span>
      </div>

      <div className="card p-4 space-y-1 bg-emerald-50/50 border-emerald-100">
        <span className="text-xs font-semibold text-emerald-800">Available</span>
        <div className="text-2xl font-black text-emerald-700" id="admin-kpi-available">
          {available}
        </div>
        <span className="text-[11px] text-emerald-600">Siap disewa</span>
      </div>

      <div className="card p-4 space-y-1 bg-amber-50/50 border-amber-100">
        <span className="text-xs font-semibold text-amber-800">Sedang Disewa (On Rent)</span>
        <div className="text-2xl font-black text-amber-700" id="admin-kpi-onrent">
          {onrent}
        </div>
        <span className="text-[11px] text-amber-600">Di tangan pelanggan</span>
      </div>

      <div className="card p-4 space-y-1 bg-blue-50/50 border-blue-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-800">Pendapatan Total</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
            {safeOrders.length} Order
          </span>
        </div>
        <div className="text-2xl font-black text-blue-700" id="admin-kpi-revenue">
          {formatRupiah(totalRevenue)}
        </div>
        <span className="text-[11px] text-blue-600">
          Transaksi aktif &amp; selesai (otomatis update jika dibatalkan)
        </span>
      </div>
    </div>
  );
}
