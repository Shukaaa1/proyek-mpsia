import React, { useState } from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah } from '../../shared/utils/formatters';

export default function InventoryTable() {
  const { inventory, orders, updateItemStatus } = useRental();
  const [filterCat, setFilterCat] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const query = searchTerm.toLowerCase().trim();
  const filtered = inventory.filter((item) => {
    const matchCat = filterCat === 'all' ? true : item.category === filterCat;
    const matchSearch =
      !query ||
      (item.id || '').toLowerCase().includes(query) ||
      (item.name || '').toLowerCase().includes(query) ||
      (item.desc || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query);
    return matchCat && matchSearch;
  });

  return (
    <div className="card p-6 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Manajemen Status 25 Alat Inventaris Real-Time (WBS Poin 5)
          </h3>
          <p className="text-xs text-slate-500">
            Terhubung langsung dengan pemesanan: status alat otomatis sinkron dengan serah-terima dan pengembalian.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
          {filtered.length} dari {inventory.length} Alat
        </span>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari kode aset (CAM-01), nama alat, lensa, lighting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold whitespace-nowrap">Kategori:</span>
          <select
            id="admin-filter-category"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="input py-1.5 text-xs w-auto"
          >
            <option value="all">Semua Kategori (6)</option>
            <option value="Kamera">Kamera</option>
            <option value="Lensa">Lensa</option>
            <option value="Lighting">Lighting</option>
            <option value="Tripod">Tripod &amp; Stabilizer</option>
            <option value="Baterai">Baterai &amp; Power</option>
            <option value="Audio">Audio &amp; Mic</option>
          </select>
          {(searchTerm || filterCat !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCat('all');
              }}
              className="btn-secondary py-1 px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 bg-slate-100">
              <th className="p-3">Kode Asset</th>
              <th className="p-3">Nama Alat &amp; Spesifikasi</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Tarif (12j / 24j)</th>
              <th className="p-3 text-right">Status Inventaris Real-Time</th>
            </tr>
          </thead>
          <tbody id="admin-inventory-tbody" className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-400">
                  Tidak ada alat inventaris yang cocok dengan pencarian &quot;{searchTerm}&quot;.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                // Find active matching order for this item
                const activeOrder = orders.find(
                  (o) => o.itemId === item.id && (o.status === 'On Rent' || o.status === 'Booked')
                );

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono text-slate-600 font-bold whitespace-nowrap">
                      {item.id}
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{item.name}</span>
                      <span className="block text-[10px] text-slate-400 font-normal line-clamp-1">
                        {item.desc}
                      </span>
                      {activeOrder && (
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            activeOrder.status === 'On Rent'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              activeOrder.status === 'On Rent' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}></span>
                            {activeOrder.status === 'On Rent' ? 'Sedang dipegang:' : 'Dipesan oleh:'}{' '}
                            <strong>{activeOrder.customerName}</strong> ({activeOrder.code})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 font-medium whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="p-3 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                      {formatRupiah(item.rate12h)} / {formatRupiah(item.rate24h)}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => updateItemStatus(item.id, e.target.value)}
                        className={`input py-1 px-2.5 text-xs font-semibold inline-block w-auto cursor-pointer ${
                          item.status === 'Available'
                            ? 'text-emerald-700 border-emerald-300 bg-emerald-50/50'
                            : item.status === 'On Rent'
                            ? 'text-amber-700 border-amber-300 bg-amber-50/50'
                            : item.status === 'Booked'
                            ? 'text-blue-700 border-blue-300 bg-blue-50/50'
                            : 'text-red-700 border-red-300 bg-red-50/50'
                        }`}
                      >
                        <option value="Available">Available (Siap)</option>
                        <option value="Booked">Booked (Dipesan)</option>
                        <option value="On Rent">On Rent (Disewa)</option>
                        <option value="Maintenance">Maintenance (Perawatan)</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
