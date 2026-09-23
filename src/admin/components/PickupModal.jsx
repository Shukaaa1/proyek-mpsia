import React from 'react';
import { useRental } from '../../context/RentalContext';

export default function PickupModal() {
  const {
    isPickupModalOpen,
    closePickupModal,
    pickupVerifyCode,
    setPickupVerifyCode,
    verifyOrderCode,
    pickupVerifyResult,
    executePickupTransition,
    cancelOrDeleteOrder
  } = useRental();

  if (!isPickupModalOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    verifyOrderCode(pickupVerifyCode);
  };

  return (
    <div
      id="modal-pickup"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-base">
            Validasi Kode Booking (Serah-Terima)
          </h3>
          <button onClick={closePickupModal} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <label htmlFor="input-verify-code" className="label">
            Masukkan / Scan Kode Booking Unik
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="input-verify-code"
              placeholder="Contoh: LAYA-2026-X9K2"
              value={pickupVerifyCode}
              onChange={(e) => setPickupVerifyCode(e.target.value)}
              className="input font-mono uppercase font-bold tracking-wider"
              autoFocus
            />
            <button type="submit" className="btn-primary text-xs px-4">
              Cari
            </button>
          </div>
        </form>

        {/* Result Verification Details Box */}
        {pickupVerifyResult && (
          <div
            id="verify-result-box"
            className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs"
          >
            {!pickupVerifyResult.found ? (
              <div className="text-red-600 font-bold text-center py-2">
                Kode Booking &quot;{pickupVerifyResult.code}&quot; tidak ditemukan! Mohon periksa kembali.
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {pickupVerifyResult.order.code}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {pickupVerifyResult.order.status}
                  </span>
                </div>
                <div className="text-slate-700 space-y-1">
                  <p>
                    <strong>Penyewa:</strong> {pickupVerifyResult.order.customerName} (
                    {pickupVerifyResult.order.phone})
                  </p>
                  <p>
                    <strong>Item Disewa:</strong> {pickupVerifyResult.order.itemName}
                  </p>
                  <p>
                    <strong>Dokumen Jaminan:</strong> KTP/KTM Asli di Lokasi{' '}
                    <span className="text-emerald-600 font-semibold">(Terverifikasi)</span>
                  </p>
                  <p>
                    <strong>Durasi Sewa:</strong>{' '}
                    {pickupVerifyResult.order.durationText ||
                      `Blok ${pickupVerifyResult.order.durationBlock} Jam`}
                  </p>
                  <p>
                    <strong>Estimasi Selesai:</strong>{' '}
                    <span className="font-semibold text-slate-900 font-mono">
                      {pickupVerifyResult.order.estimatedReturnTime || '-'}
                    </span>
                  </p>
                  {pickupVerifyResult.order.handoverTime && (
                    <p>
                      <strong>Waktu Serah-Terima:</strong>{' '}
                      <span className="text-emerald-700 font-mono">
                        {pickupVerifyResult.order.handoverTime.replace('T', ' ')}
                      </span>
                    </p>
                  )}
                  {pickupVerifyResult.order.returnTime && (
                    <p>
                      <strong>Waktu Pengembalian:</strong>{' '}
                      <span className="text-blue-700 font-mono">
                        {pickupVerifyResult.order.returnTime.replace('T', ' ')}
                      </span>
                    </p>
                  )}
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-200">
                  <button
                    onClick={() =>
                      executePickupTransition(pickupVerifyResult.order.code, 'On Rent')
                    }
                    className="btn-primary text-xs flex-1 justify-center bg-emerald-600 hover:bg-emerald-700"
                  >
                    Serahkan (On Rent)
                  </button>
                  <button
                    onClick={() =>
                      executePickupTransition(pickupVerifyResult.order.code, 'Returned')
                    }
                    className="btn-secondary text-xs flex-1 justify-center hover:bg-slate-200"
                  >
                    Kembalikan (Available)
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Yakin ingin membatalkan/menghapus pesanan ${pickupVerifyResult.order.code}?\n\nAlat ${pickupVerifyResult.order.itemId} (${pickupVerifyResult.order.itemName}) akan otomatis kembali menjadi 'Available' dan total pendapatan akan berkurang.`
                        )
                      ) {
                        cancelOrDeleteOrder(pickupVerifyResult.order.code);
                      }
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-1"
                    title="Batalkan Booking & Hapus Pesanan"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Batalkan / Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button onClick={closePickupModal} className="btn-secondary text-xs">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
