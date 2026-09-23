import React from 'react';
import { useRental } from '../../context/RentalContext';
import logoImg from '../../images/logo.jpg';

export default function AdminFooter() {
  const { switchView } = useRental();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Layarasa Logo"
            className="w-7 h-7 rounded-full object-cover border border-slate-700"
          />
          <div>
            <span className="font-bold text-white tracking-wide">LAYARASA ADMIN PORTAL</span>
            <p className="text-[11px] text-slate-500">
              Sistem Informasi Akuntansi &amp; Operasional Persewaan Alat Video
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-500">Kelompok 3 MP-SIA Layarasa &bull; 2026</span>
          <button
            onClick={() => switchView('catalog')}
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Buka Halaman Pelanggan &rarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
