import React from 'react';
import { useRental } from '../../context/RentalContext';
import logoImg from '../../images/logo.jpg';

export default function UserHeader() {
  const { activeView, switchView, selectedEquipment, cart, openCart } = useRental();

  const isCatalogActive = activeView === 'catalog';
  const isBookingActive = activeView === 'booking' || activeView === 'success';
  const totalCartCount = (cart?.length || 0) + (selectedEquipment && !cart?.length ? 1 : 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => switchView('catalog')}
        >
          <img
            src={logoImg}
            alt="Layarasa Logo"
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
              LAYARASA
            </span>
            <span className="text-xs font-semibold text-brand-600 tracking-wide">
              Penyewaan Alat Video
            </span>
          </div>
        </div>

        {/* Main Navigation Tabs (Halaman Pelanggan) */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl" aria-label="Navigasi Utama">
          <button
            id="nav-btn-catalog"
            onClick={() => switchView('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              isCatalogActive ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            Katalog Alat (25)
          </button>
          <button
            id="nav-btn-booking"
            onClick={() => switchView('booking')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
              isBookingActive ? 'nav-tab-active' : 'nav-tab-inactive'
            }`}
          >
            Formulir Sewa
            {totalCartCount > 0 && (
              <span
                id="cart-badge"
                className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {totalCartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Quick Action / Cart & Status (Pojok Kanan Atas) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Round Cart Button */}
          <button
            type="button"
            id="header-cart-btn"
            onClick={openCart}
            title={cart?.length > 0 ? `Keranjang Sewa (${cart.length} alat terpilih)` : 'Keranjang Sewa Kosong'}
            className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-all duration-200 shadow-sm active:scale-95 group"
            aria-label="Keranjang Sewa"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:scale-110 text-slate-800 group-hover:text-emerald-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cart && cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-[11px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow">
                {cart.length}
              </span>
            )}
          </button>

          {/* Real-time Status Badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistem Real-Time Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
