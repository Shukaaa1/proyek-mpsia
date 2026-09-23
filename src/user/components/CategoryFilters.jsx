import React from 'react';
import { useRental } from '../../context/RentalContext';

export default function CategoryFilters() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useRental();

  const categories = ['all', 'Kamera', 'Lensa', 'Lighting', 'Tripod', 'Baterai', 'Audio'];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" id="category-filters">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const label = cat === 'all' ? 'Semua Kategori (25)' : cat;
          const activeClass = isSelected
            ? 'bg-slate-900 text-white font-bold'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold';

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${activeClass}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[240px]">
        <input
          type="text"
          id="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari alat (misal: Sony, Lighting, Mic)..."
          className="input pl-9 text-xs sm:text-sm"
        />
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
