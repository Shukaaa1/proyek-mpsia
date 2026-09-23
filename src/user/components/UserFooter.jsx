import React from 'react';
import { useRental } from '../../context/RentalContext';
import logoImg from '../../images/logo.jpg';

export default function UserFooter() {
  const { switchView } = useRental();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-12">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Profil Layarasa */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logoImg}
                alt="Layarasa Logo"
                className="w-8 h-8 rounded-full object-cover border border-slate-700 shadow"
              />
              <span className="font-black text-white text-base tracking-tight">LAYARASA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Platform digitalisasi penyewaan peralatan produksi video profesional kualitas studio. Manajemen 25 unit inventaris kamera, lensa, lighting, audio, dan stabilizer terintegrasi.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Booking Mandiri 24 Jam
            </span>
          </div>

          {/* Col 2: Alamat Studio / Workshop */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Lokasi Studio &amp; Workshop</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-xs leading-relaxed text-slate-400">
                  Jl. Prof. Dr. G.A. Siwabessy, Kampus PNJ - UI Depok, Kukusan, Kec. Beji, Kota Depok, Jawa Barat 16425
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-400 pt-1">
                <svg className="w-4 h-4 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Setiap Hari: 08.00 – 21.00 WIB</span>
              </div>
            </div>
          </div>

          {/* Col 3: Kontak & Media Sosial */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kontak &amp; Media Sosial</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://wa.me/6283199103034"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-4 h-4 text-[#25D366] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
                  </svg>
                  <span>+62 831-9910-3034 (WhatsApp)</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:layarasa.official@gmail.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-4 h-4 text-sky-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>layarasa.official@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/layarasa.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors"
                >
                  <svg className="w-4 h-4 text-pink-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>@layarasa.id (Instagram)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi & Ketentuan Sewa */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Akses &amp; Ketentuan</h4>
            <ul className="space-y-2">
              <li>
                <a href="#catalog-grid" className="text-slate-400 hover:text-white transition-colors">
                  Katalog Inventaris 25 Unit
                </a>
              </li>
              <li>
                <span className="text-slate-400">Jaminan: Fisik KTP/KTM Asli di Studio</span>
              </li>
              <li>
                <span className="text-slate-400">Pilihan Sewa: 12 Jam, 24 Jam, &amp; Harian</span>
              </li>
              <li>
                <span className="text-slate-400">Pembayaran: QRIS, Transfer, Tunai</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Sub-bar */}
      <div className="border-t border-slate-800/80 bg-slate-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>&copy; 2026 Layarasa Video Rental UMKM. Sistem Informasi Akuntansi &amp; Operasional.</p>
          <p>Digitalisasi Sistem Rental Mandiri 24/7 &bull; Kelompok 3 (2026)</p>
        </div>
      </div>
    </footer>
  );
}
