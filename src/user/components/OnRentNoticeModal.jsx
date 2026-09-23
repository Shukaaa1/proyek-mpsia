import React from 'react';
import { useRental } from '../../context/RentalContext';
import { WHATSAPP_NUMBER } from '../../data/initialOrders';

export default function OnRentNoticeModal() {
  const { onRentNoticeItem, closeOnRentModal } = useRental();

  if (!onRentNoticeItem) return null;

  const item = onRentNoticeItem;
  const isBooked = item.status === 'Booked';

  const modalTitle = isBooked ? 'Unit Sedang Dipesan (Terbooking)' : 'Unit Sedang Aktif Disewa';
  const statusBadge = isBooked ? 'Status: Terbooking (Booked)' : 'Status: Sedang Disewa (On Rent)';
  const badgeColors = isBooked
    ? 'bg-sky-100 text-sky-800'
    : 'bg-amber-100 text-amber-800';

  const headerMessage = isBooked
    ? 'Alat ini telah dibooking oleh penyewa lain dan sedang menunggu waktu serah-terima fisik.'
    : 'Alat ini saat ini masih berada di tangan penyewa lain di lapangan.';

  const detailMessage = isBooked
    ? 'Untuk menanyakan ketersediaan slot jadwal berikutnya atau memesan antrean (pre-booking) untuk kebutuhan proyek Anda, silakan hubungi admin Layarasa langsung via WhatsApp.'
    : 'Untuk memastikan estimasi jam pengembalian alat hari ini atau melakukan reservasi antrean (pre-booking) jadwal berikutnya, silakan langsung menghubungi staf Admin Layarasa via WhatsApp.';

  const handleContactWA = () => {
    const statusText = isBooked ? 'Terbooking (Sudah Dipesan)' : 'Sedang Disewa (On Rent)';
    const text = encodeURIComponent(
      `Halo Admin Layarasa! Saya tertarik untuk menyewa alat *${item.name}* (Kode: ${item.id}) yang saat ini berstatus *${statusText}*.\n\n` +
      `Apakah ada estimasi jadwal kosong berikutnya atau unit alternatif yang siap disewa? Terima kasih!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div
      id="modal-onrent-notice"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isBooked ? 'bg-sky-500 animate-pulse' : 'bg-amber-500 animate-pulse'
              }`}
            ></span>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {modalTitle}
            </h3>
          </div>
          <button
            onClick={closeOnRentModal}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item preview */}
        <div className="flex items-center gap-3.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <img
            src={item.image}
            alt={item.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wide">
              {item.category} &bull; {item.id}
            </span>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
              {item.name}
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${badgeColors}`}
            >
              {statusBadge}
            </span>
          </div>
        </div>

        {/* Explanation message */}
        <div
          className={`text-xs space-y-2 leading-relaxed p-4 rounded-xl border ${
            isBooked
              ? 'bg-sky-50/70 border-sky-200 text-slate-700'
              : 'bg-amber-50/70 border-amber-200 text-slate-700'
          }`}
        >
          <p className="font-semibold text-slate-900">{headerMessage}</p>
          <p className="text-slate-600">{detailMessage}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            onClick={handleContactWA}
            className="btn-primary flex-1 justify-center py-2.5 text-xs bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-md flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
            </svg>
            Tanya Jadwal via WhatsApp
          </button>
          <button
            onClick={closeOnRentModal}
            className="btn-secondary flex-1 justify-center py-2.5 text-xs"
          >
            Pilih Alat Lain di Katalog
          </button>
        </div>
      </div>
    </div>
  );
}
