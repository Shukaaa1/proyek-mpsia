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
            id="nav-btn-cart"
            onClick={openCart}
            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 transition-all flex items-center gap-1.5"
          >
            <span>🛒 Keranjang</span>
            {cart && cart.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
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

        {/* Quick Action / Status */}
        <div className="hidden md:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistem Real-Time Online
          </span>
        </div>
      </div>
    </header>
  );
}
