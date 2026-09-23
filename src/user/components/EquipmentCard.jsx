import React from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah, getStatusLabel, getStatusBadgeClass } from '../../shared/utils/formatters';

export default function EquipmentCard({ item }) {
  const { selectEquipmentForBooking, openOnRentModal } = useRental();

  const badgeClass = getStatusBadgeClass(item.status);
  const statusLabel = getStatusLabel(item.status);

  const isMaintenance = item.status === 'Maintenance';
  const isOnRent = item.status === 'On Rent';
  const isBooked = item.status === 'Booked';
  const isAvailable = item.status === 'Available';

  const handleButtonClick = () => {
    if (isMaintenance) return;
    if (isOnRent || isBooked) {
      openOnRentModal(item);
    } else {
      selectEquipmentForBooking(item.id);
    }
  };

  let btnLabel = 'Pesan Sekarang';
  let btnClasses = 'btn-primary w-full justify-center text-xs shadow-sm';

  if (isMaintenance) {
    btnLabel = 'Dalam Perawatan (Tidak Tersedia)';
    btnClasses = 'w-full justify-center text-xs py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-semibold border border-slate-200 cursor-not-allowed';
  } else if (isOnRent) {
    btnLabel = 'Sedang Disewa (Hubungi Admin)';
    btnClasses = 'w-full justify-center text-xs py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-300 transition-all flex items-center justify-center gap-1.5 shadow-sm';
  } else if (isBooked) {
    btnLabel = 'Terbooking (Hubungi Admin)';
    btnClasses = 'w-full justify-center text-xs py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold border border-sky-300 transition-all flex items-center justify-center gap-1.5 shadow-sm';
  }

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-all border border-slate-200 flex flex-col justify-between group">
      <div>
        {/* Thumbnail & Status Badge */}
        <div className="relative h-44 overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <span
            className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${badgeClass}`}
          >
            {statusLabel}
          </span>
          <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
            {item.id}
          </span>
        </div>

        {/* Description */}
        <div className="p-4 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
            {item.category}
          </span>
          <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>

      {/* Pricing & Action */}
      <div className="p-4 pt-0 space-y-3 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Tarif 12 Jam</span>
            <span className="text-xs font-bold text-slate-700">{formatRupiah(item.rate12h)}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Tarif 24 Jam</span>
            <span className="text-sm font-black text-brand-600">{formatRupiah(item.rate24h)}</span>
          </div>
        </div>

        <button
          onClick={handleButtonClick}
          disabled={isMaintenance}
          className={btnClasses}
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
}
