import React from 'react';
import { useRental } from '../../context/RentalContext';
import EquipmentCard from './EquipmentCard';

export default function EquipmentGrid() {
  const { inventory, selectedCategory, searchQuery, resetFilters } = useRental();

  const query = (searchQuery || '').toLowerCase().trim();
  const safeInventory = Array.isArray(inventory) ? inventory : [];
  const filtered = safeInventory.filter((item) => {
    if (!item) return false;
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    const itemName = (item.name || '').toLowerCase();
    const itemDesc = (item.desc || '').toLowerCase();
    const itemId = (item.id || '').toLowerCase();
    const matchSearch =
      !query ||
      itemName.includes(query) ||
      itemDesc.includes(query) ||
      itemId.includes(query);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    return (
      <div
        id="catalog-empty-state"
        className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="font-bold text-slate-800 text-base">Alat tidak ditemukan</h3>
        <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
        <button onClick={resetFilters} className="btn-secondary text-xs mx-auto">
          Reset Filter
        </button>
      </div>
    );
  }

  return (
    <div
      id="equipment-grid-container"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filtered.map((item) => (
        <EquipmentCard key={item.id} item={item} />
      ))}
    </div>
  );
}
