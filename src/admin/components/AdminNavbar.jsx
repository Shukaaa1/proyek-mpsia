import React from 'react';
import { useRental } from '../../context/RentalContext';
import logoImg from '../../images/logo.jpg';

export default function AdminNavbar() {
  const { switchView, logoutAdmin, openPickupModal } = useRental();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="Layarasa Logo"
            className="w-10 h-10 rounded-full object-cover border border-slate-700 shadow-sm cursor-pointer"
            onClick={() => switchView('admin')}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white block leading-none">
                LAYARASA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-brand-500 text-white">
                PORTAL ADMIN
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              Sistem Informasi Akuntansi &amp; Operasional Rental
            </span>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-400 border border-emerald-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Server Real-Time Aktif
          </span>

          <button
            onClick={() => openPickupModal()}
            className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3 bg-brand-600 hover:bg-brand-500 text-white shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Serah-Terima</span>
          </button>

          <button
            onClick={() => switchView('catalog')}
            className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            title="Buka Katalog Publik Pelanggan"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span className="hidden sm:inline">Lihat Halaman Pelanggan</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3 bg-slate-800 text-slate-300 border-slate-700 hover:bg-red-950 hover:text-red-400 hover:border-red-900 transition-colors"
            title="Keluar dari Dashboard Admin"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
