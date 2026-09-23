import React, { useState, useEffect } from 'react';
import { useRental } from '../../context/RentalContext';
import {
  formatRupiah,
  formatDateTime,
  calculateEstimatedReturn,
  getStatusLabel,
  getStatusBadgeClass
} from '../../shared/utils/formatters';

export default function EquipmentDetailModal() {
  const {
    detailEquipmentItem,
    closeEquipmentDetail,
    getItemBookedSlots,
    checkEquipmentAvailability,
    addToCart,
    openCart,
    switchView,
    showToast
  } = useRental();

  const item = detailEquipmentItem;

  // Local schedule state for this equipment
  const [datePickup, setDatePickup] = useState('');
  const [packageType, setPackageType] = useState('24h'); // '12h' | '24h' | 'daily'
  const [dailyDays, setDailyDays] = useState(1);

  // Initialize datePickup with current local time
  useEffect(() => {
    if (item) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDatePickup(now.toISOString().slice(0, 16));
      setPackageType('24h');
      setDailyDays(1);
    }
  }, [item]);

  if (!item) return null;

  const isMaintenance = item.status === 'Maintenance';
  const bookedSlots = getItemBookedSlots(item.id);

  // Calculate duration in hours
  let durationHours = 24;
  let durationText = 'Blok 24 Jam (1 Hari)';
  let itemPrice = item.rate24h;

  if (packageType === '12h') {
    durationHours = 12;
    durationText = 'Blok 12 Jam';
    itemPrice = item.rate12h;
  } else if (packageType === 'daily') {
    durationHours = dailyDays * 24;
    durationText = `${dailyDays} Hari (${dailyDays * 24} Jam)`;
    itemPrice = item.rate24h * dailyDays;
  }

  const estimatedReturn = calculateEstimatedReturn(datePickup, durationHours);
  const availability = checkEquipmentAvailability(item.id, datePickup, durationHours);
  const isAvailable = availability.available;

  const handleAddToCart = () => {
    if (isMaintenance) return;
    if (!isAvailable) {
      showToast(
        `Jadwal bentrok! Alat ini sudah terpakai pada rentang ${formatDateTime(availability.clashingSlot?.start)} s/d ${formatDateTime(availability.clashingSlot?.end)}.`,
        'error'
      );
      return;
    }

    const success = addToCart(item, {
      packageType,
      dailyDays,
      datePickup
    });

    if (success) {
      closeEquipmentDetail();
      openCart();
    }
  };

  const handleBookNow = () => {
    if (isMaintenance) return;
    if (!isAvailable) {
      showToast(
        `Jadwal bentrok! Alat ini sudah terpakai pada rentang ${formatDateTime(availability.clashingSlot?.start)} s/d ${formatDateTime(availability.clashingSlot?.end)}.`,
        'error'
      );
      return;
    }

    const success = addToCart(item, {
      packageType,
      dailyDays,
      datePickup
    });

    if (success) {
      closeEquipmentDetail();
      switchView('booking');
    }
  };

  const badgeClass = getStatusBadgeClass(item.status);
  const statusLabel = getStatusLabel(item.status);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={closeEquipmentDetail}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 animate-fade-in my-auto max-h-[90vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header (Fixed at top) */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 pb-4 bg-white flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                {item.category}
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {item.id}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {item.name}
            </h3>
          </div>
          <button
            onClick={closeEquipmentDetail}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            title="Tutup Modal"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable with internal padded scrollbar) */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 modal-scrollable">
          {/* Media & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden bg-slate-100 h-52 border border-slate-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${badgeClass}`}
              >
                {statusLabel}
              </span>
            </div>

            {/* Rates & Specifications */}
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Deskripsi &amp; Spesifikasi
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc || 'Unit peralatan audio visual dan sinematografi profesional berstandar industri.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Tarif Sewa 12 Jam:</span>
                  <span className="font-bold text-slate-800">{formatRupiah(item.rate12h)}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500 font-medium">Tarif Sewa 24 Jam (1 Hari):</span>
                  <span className="font-extrabold text-brand-600 text-sm">{formatRupiah(item.rate24h)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: Daftar Tanggal & Waktu Terpakai (Booked Slots) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Jadwal Waktu Terpakai (Slot Penyewa Lain)
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                {bookedSlots.length} jadwal aktif
              </span>
            </div>

            {bookedSlots.length === 0 ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <p className="font-semibold">
                  ✓ Unit ini belum memiliki jadwal sewa aktif. Bebas dipesan untuk tanggal/jam kapan saja!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 modal-scrollable">
                  {bookedSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                          Slot #{idx + 1}
                        </span>
                        <span className="font-mono text-slate-700 font-semibold text-[11px]">
                          {formatDateTime(slot.start)} &rarr; {formatDateTime(slot.end)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                        {slot.status === 'On Rent' ? 'Sedang Disewa' : 'Terbooking'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  * Anda tetap dapat menyewa unit ini asalkan tanggal &amp; jam sewa Anda <strong>tidak bertabrakan</strong> dengan jadwal di atas.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: Pemilih Waktu & Deteksi Anti-Double Booking */}
          {!isMaintenance && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tentukan Jadwal &amp; Paket Sewa Anda
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tanggal & Jam Pengambilan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Tanggal &amp; Jam Ambil Unit:
                  </label>
                  <input
                    type="datetime-local"
                    value={datePickup}
                    onChange={(e) => setDatePickup(e.target.value)}
                    className="input text-xs w-full py-2"
                  />
                </div>

                {/* Paket Durasi */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Pilihan Paket Durasi:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPackageType('12h')}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                        packageType === '12h'
                          ? 'bg-brand-50 border-brand-600 text-brand-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      12 Jam
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageType('24h')}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                        packageType === '24h'
                          ? 'bg-brand-50 border-brand-600 text-brand-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      24 Jam
                    </button>
                    <button
                      type="button"
                      onClick={() => setPackageType('daily')}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                        packageType === 'daily'
                          ? 'bg-brand-50 border-brand-600 text-brand-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      Harian
                    </button>
                  </div>
                </div>
              </div>

              {/* Kontrol Harian jika paket daily dipilih */}
              {packageType === 'daily' && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Jumlah Hari Sewa:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDailyDays((d) => Math.max(1, d - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm w-8 text-center">{dailyDays}</span>
                    <button
                      type="button"
                      onClick={() => setDailyDays((d) => Math.min(30, d + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Live Anti-Double Booking Feedback Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-100/70 border border-slate-200">
                  <span className="text-slate-500">Estimasi Selesai ({durationText}):</span>
                  <span className="font-mono font-bold text-slate-800">{formatDateTime(estimatedReturn)}</span>
                </div>

                {isAvailable ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-bold">
                        Jadwal Tersedia! Unit bebas dipesan untuk rentang waktu ini.
                      </span>
                    </div>
                    <span className="font-black text-emerald-700 text-sm whitespace-nowrap">
                      {formatRupiah(itemPrice)}
                    </span>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-300 rounded-xl flex items-start gap-2.5 text-xs text-red-800">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <strong className="block font-bold mb-0.5">⚠️ Jadwal Bertabrakan (Double-Booking Dicegah)!</strong>
                      <p className="text-[11px] leading-relaxed text-red-700">
                        Alat ini telah dipesan pada rentang{' '}
                        <span className="font-mono font-semibold underline">
                          {formatDateTime(availability.clashingSlot?.start)} &rarr; {formatDateTime(availability.clashingSlot?.end)}
                        </span>
                        . Silakan geser tanggal atau jam sewa Anda agar tidak bentrok.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isMaintenance && (
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl text-center space-y-1">
              <span className="font-bold text-slate-700 text-xs block">Unit Sedang Dalam Perawatan Teknis</span>
              <p className="text-[11px] text-slate-500">
                Unit ini sedang melalui kalibrasi atau pembersihan berkala dan saat ini belum dapat disewa.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer (Fixed at bottom) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex-shrink-0 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeEquipmentDetail}
            className="btn-secondary text-xs w-full sm:w-auto justify-center"
          >
            Tutup
          </button>
          {!isMaintenance && (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`text-xs flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold border transition-all w-full sm:w-auto ${
                  isAvailable
                    ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                + Tambah ke Keranjang
              </button>
              <button
                type="button"
                onClick={handleBookNow}
                disabled={!isAvailable}
                className={`btn-primary text-xs w-full sm:w-auto justify-center ${
                  !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Pesan Sekarang (Langsung) &rarr;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
