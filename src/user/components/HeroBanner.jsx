import React from 'react';
import logoImg from '../../images/logo.jpg';

export default function HeroBanner() {
  return (
    <div className="hero-gradient text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-200 border border-white/20">
            <img src={logoImg} alt="Layarasa" className="w-5 h-5 rounded-full object-cover border border-white/30" />
            <span>Solusi Digitalisasi UMKM &amp; Kampus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Sewa Peralatan Video Profesional Kualitas Studio
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Jelajahi 25 unit inventaris alat produksi video Layarasa. Cek ketersediaan otomatis 24 jam, pilih paket tarif sewa fleksibel (12 Jam, 24 Jam, atau Harian), dan selesaikan booking mandiri tanpa ribet.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <a
              href="#catalog-grid"
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg flex items-center gap-2"
            >
              Lihat Katalog Alat
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <span className="px-4 py-2.5 rounded-xl bg-white/10 text-emerald-100 border border-white/20 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Jaminan Fisik KTP/KTM Asli di Lokasi
            </span>
          </div>
        </div>

        {/* Live Stats Widget */}
        <div className="w-full md:w-auto grid grid-cols-2 gap-3 sm:gap-4 max-w-sm">
          <div className="card-glass p-4 rounded-2xl border border-white/30 text-slate-800 shadow-xl">
            <span className="text-xs font-semibold text-slate-500 block">Total Aset Layarasa</span>
            <span className="text-2xl font-black text-emerald-700">25 Unit</span>
            <span className="text-[11px] text-slate-500 block mt-1">Terawat &amp; Siap Pakai</span>
          </div>
          <div className="card-glass p-4 rounded-2xl border border-white/30 text-slate-800 shadow-xl">
            <span className="text-xs font-semibold text-slate-500 block">Skema Tarif Blok</span>
            <span className="text-2xl font-black text-slate-900">12j / 24j</span>
            <span className="text-[11px] text-slate-500 block mt-1">Transparan 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
