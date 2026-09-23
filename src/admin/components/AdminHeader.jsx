import React from 'react';
import { useRental } from '../../context/RentalContext';

export default function AdminHeader() {
  const { openPickupModal, logoutAdmin, switchView } = useRental();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
            WBS Poin 4 &amp; 5 — Sistem Operasional Layarasa
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Staf Admin Terautentikasi
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">
          Dashboard Manajemen Inventaris &amp; Serah-Terima
        </h2>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => switchView('catalog')}
          className="btn-secondary text-xs flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
          title="Buka Halaman Publik Pelanggan"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Lihat Halaman Pelanggan
        </button>
        <button
          onClick={() => openPickupModal()}
          className="btn-primary text-xs flex items-center gap-1.5 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Validasi Serah-Terima Alat (Poin 4)
        </button>
        <button
          onClick={logoutAdmin}
          className="btn-secondary text-xs flex items-center gap-1.5 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
        >
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout Admin
        </button>
      </div>
    </div>
  );
}
