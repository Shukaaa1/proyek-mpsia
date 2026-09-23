import React from 'react';
import { useRental } from '../../context/RentalContext';

export default function AdminHeader() {
  const { openPickupModal, logoutAdmin, switchView, d1Status, refreshFromD1 } = useRental();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
            WBS Poin 4 &amp; 5 — Sistem Operasional Layarasa
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Staf Admin Terautentikasi
          </span>
          {d1Status === 'connected' ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200"
              title="Data tersinkronisasi terpusat di Cloudflare D1 Database"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Cloud D1 Aktif
            </span>
          ) : (
            <button
              onClick={() => refreshFromD1(true)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors"
              title="Database D1 belum dibind atau offline. Klik untuk mencoba menghubungkan kembali."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Penyimpanan Lokal (Klik Hubungkan D1)
            </button>
          )}
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
