import React from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah, formatDateTime, calculateEstimatedReturn } from '../../shared/utils/formatters';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    openCart,
    closeCart,
    removeFromCart,
    updateCartItemSchedule,
    clearCart,
    switchView,
    activeView,
    checkEquipmentAvailability
  } = useRental();

  // Floating trigger button is visible on customer views
  const isCustomerView = ['catalog', 'booking'].includes(activeView);
  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + (item.itemPrice || 0), 0);

  const handleCheckout = () => {
    closeCart();
    switchView('booking');
  };

  return (
    <>
      {/* Floating Cart Button (Pojok Kanan Bawah) */}
      {isCustomerView && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={openCart}
            className="group relative flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:shadow-brand-500/25 border border-slate-700 transition-all transform hover:-translate-y-0.5"
            title="Buka Keranjang Sewa"
          >
            <div className="relative">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
                  {totalItems}
                </span>
              )}
            </div>

            <div className="text-left">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-300">
                Keranjang Sewa
              </span>
              <span className="text-xs font-black text-white">
                {totalItems > 0 ? formatRupiah(totalPrice) : 'Kosong'}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Drawer / Modal */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
          onClick={closeCart}
        >
          <div
            className="bg-white w-full max-w-lg h-full flex flex-col justify-between shadow-2xl animate-fade-in text-left overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center font-bold">
                  🛒
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Keranjang Sewa Multi-Alat
                  </h3>
                  <p className="text-xs text-slate-500">
                    {totalItems} alat dipilih &bull; Jadwal sewa fleksibel per alat
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {totalItems === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-2xl">
                    🛒
                  </div>
                  <h4 className="font-bold text-slate-700 text-sm">Keranjang Sewa Kosong</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Pilih alat kamera, lensa, lighting, atau audio dari katalog dan tambahkan ke keranjang untuk menyewa bersamaan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      switchView('catalog');
                    }}
                    className="btn-primary text-xs mx-auto mt-2"
                  >
                    Buka Katalog Alat &rarr;
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const availability = checkEquipmentAvailability(
                    item.itemId,
                    item.datePickup,
                    item.durationBlock
                  );

                  return (
                    <div
                      key={item.cartItemId}
                      className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3 relative hover:border-slate-300 transition-colors"
                    >
                      {/* Top Item Row */}
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0 pr-6">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
                            {item.category} &bull; {item.itemId}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-xs truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-black text-brand-700 block mt-0.5">
                            {formatRupiah(item.itemPrice)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus dari keranjang"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* Schedule Adjustment per Item */}
                      <div className="p-3 bg-slate-50 rounded-xl space-y-2.5 border border-slate-200/80 text-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <label className="text-[11px] font-bold text-slate-600 whitespace-nowrap">
                            Waktu Ambil:
                          </label>
                          <input
                            type="datetime-local"
                            value={item.datePickup}
                            onChange={(e) =>
                              updateCartItemSchedule(item.cartItemId, {
                                datePickup: e.target.value
                              })
                            }
                            className="input py-1 px-2 text-xs w-full sm:w-auto"
                          />
                        </div>

                        {/* Package buttons */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-slate-600">Durasi:</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItemSchedule(item.cartItemId, { packageType: '12h' })
                              }
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                                item.packageType === '12h'
                                  ? 'bg-brand-50 border-brand-500 text-brand-700'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              12 Jam
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItemSchedule(item.cartItemId, { packageType: '24h' })
                              }
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                                item.packageType === '24h'
                                  ? 'bg-brand-50 border-brand-500 text-brand-700'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              24 Jam
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartItemSchedule(item.cartItemId, { packageType: 'daily' })
                              }
                              className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                                item.packageType === 'daily'
                                  ? 'bg-brand-50 border-brand-500 text-brand-700'
                                  : 'bg-white border-slate-200 text-slate-600'
                              }`}
                            >
                              Harian
                            </button>
                          </div>
                        </div>

                        {/* Daily counter */}
                        {item.packageType === 'daily' && (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                            <span className="text-[11px] text-slate-500">Jumlah Hari:</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartItemSchedule(item.cartItemId, {
                                    dailyDays: Math.max(1, (item.dailyDays || 1) - 1)
                                  })
                                }
                                className="w-5 h-5 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-xs"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-xs">{item.dailyDays || 1} Hari</span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateCartItemSchedule(item.cartItemId, {
                                    dailyDays: Math.min(30, (item.dailyDays || 1) + 1)
                                  })
                                }
                                className="w-5 h-5 rounded bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center text-xs"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>Estimasi Selesai:</span>
                          <span className="font-mono font-semibold text-slate-700">
                            {formatDateTime(item.estimatedReturnTime)}
                          </span>
                        </div>

                        {/* Anti-double booking status */}
                        {!availability.available && (
                          <div className="p-2 bg-red-100/80 border border-red-200 rounded-lg text-[10px] text-red-800 font-semibold">
                            ⚠️ Waktu bentrok dengan penyewa lain! Geser waktu ambil alat ini.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {totalItems > 0 && (
              <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Jumlah Peralatan:</span>
                    <span className="font-bold text-slate-800">{totalItems} Unit</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5">
                    <span>Total Biaya Sewa:</span>
                    <span className="text-base text-brand-600 font-black">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="btn-secondary text-xs hover:text-red-700 py-2.5 px-3"
                    title="Kosongkan Keranjang"
                  >
                    Kosongkan
                  </button>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="btn-primary text-xs flex-1 justify-center py-2.5 shadow-md"
                  >
                    Lanjut ke Formulir Pemesanan &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
