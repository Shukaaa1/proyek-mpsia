import React from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryFilters from '../components/CategoryFilters';
import EquipmentGrid from '../components/EquipmentGrid';

export default function CatalogPage() {
  return (
    <section id="view-catalog" className="block space-y-8 pb-16">
      <HeroBanner />
      <div id="catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <CategoryFilters />
        <EquipmentGrid />
      </div>
    </section>
  );
}
