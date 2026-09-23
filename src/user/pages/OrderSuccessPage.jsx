import React, { useEffect } from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah, getPaymentLabel } from '../../shared/utils/formatters';

export default function OrderSuccessPage() {
  const {
    lastOrderResult,
    sendWhatsAppReminder,
    switchView,
    hasDownloadedBookingCode,
    downloadBookingTicket,
    showToast
  } = useRental();

  // Protect against accidental tab closing or reloading before downloading unique booking code
  useEffect(() => {
    if (lastOrderResult && !hasDownloadedBookingCode) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'Perhatian: Anda belum mengunduh Tiket / Kode Booking unik Anda!';
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [lastOrderResult, hasDownloadedBookingCode]);

  if (!lastOrderResult) {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Belum ada pemesanan aktif.</h2>
        <button onClick={() => switchView('catalog')} className="btn-primary mx-auto text-xs">
          Kembali ke Katalog
        </button>
      </section>
    );
  }

  const order = lastOrderResult;
  const paymentLabel = getPaymentLabel(order.paymentMethod);
  const durasi = order.durationText || `${order.durationBlock || 24} Jam`;

  return (
    <section id="view-success" className="max-w-xl mx-auto px-4 py-10">
      <div className="card p-7 sm:p-8 text-center space-y-6 shadow-2xl border-emerald-200">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-extrabold text-brand-600 tracking-wider uppercase">
            Pemesanan Berhasil Dicatat
          </span>
          <h2 className="text-2xl font-black text-slate-900">Kode Booking Unik Anda</h2>
          <p className="text-xs text-slate-600">
            Tunjukkan kode ini kepada petugas Layarasa di lokasi saat serah-terima alat.
          </p>
        </div>

        {/* Order Code Box */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2 relative overflow-hidden shadow-md">
          <span className="text-xs text-slate-400 block font-medium">KODE UNIQUE ORDER</span>
          <div
            id="success-code-display"
            className="text-3xl sm:text-4xl font-black tracking-widest text-emerald-400 font-mono"
          >
            {order.code}
          </div>
          <span className="text-[11px] text-slate-400 block">
            Status:{' '}
            <span className="text-yellow-400 font-semibold" id="success-status-tag">
              Menunggu Serah-Terima Fisik
            </span>
          </span>
        </div>

        {/* Mandatory Download Warning / Status Card */}
        {!hasDownloadedBookingCode ? (
          <div className="bg-amber-50/90 border-2 border-amber-300 rounded-2xl p-4 text-left space-y-3 shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>WAJIB MENGUNDUH KODE BOOKING</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Anda <strong>diwajibkan mendownload tiket kode booking unik</strong> ini terlebih dahulu sebagai bukti reservasi resmi sebelum berpindah ke halaman lain atau menutup browser.
            </p>
            <button
              type="button"
              id="btn-download-ticket"
              onClick={() => downloadBookingTicket(order)}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all border border-slate-700 cursor-pointer"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Tiket &amp; Kode Booking (.txt)
            </button>
          </div>
        ) : (
          <div className="bg-emerald-50/90 border border-emerald-300 rounded-2xl p-4 text-left space-y-2 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>TIKET &amp; KODE BOOKING TELAH DIUNDUH</span>
              </div>
              <button
                type="button"
                onClick={() => downloadBookingTicket(order)}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                Unduh Ulang
              </button>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              File <strong>Tiket_Booking_{order.code}.txt</strong> siap ditunjukkan kepada staf Layarasa bersama KTP/KTM fisik asli saat serah-terima alat di lokasi.
            </p>
          </div>
        )}

        {/* Summary Details */}
        <div
          id="success-details-box"
          className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200"
        >
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 mb-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Penyewa:</span>
              <span className="font-bold text-slate-800">
                {order.customerName} ({order.institution})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">No. WhatsApp:</span>
              <span className="font-bold text-slate-800">{order.phone}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 mb-2">
            <div>
              <span className="text-slate-400 block text-[11px]">Item Alat:</span>
              <span className="font-bold text-emerald-700">{order.itemName}</span>
              <span className="text-[10px] text-slate-400 font-mono block">{order.itemId}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Durasi &amp; Biaya:</span>
              <span className="font-bold text-slate-800">{durasi}</span>
              <span className="text-brand-600 font-black text-sm block">
                {formatRupiah(order.totalPrice)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block">Metode Pembayaran:</span>
              <span className="font-semibold text-slate-700">{paymentLabel}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Jaminan Serah-Terima:</span>
              <span className="font-semibold text-emerald-700">KTP/KTM Asli di Lokasi</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={sendWhatsAppReminder}
            className="btn-primary flex-1 justify-center bg-[#25D366] hover:bg-[#1ebd59] text-white text-xs py-2.5"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
            </svg>
            Kirim Reminder WA
          </button>

          {!hasDownloadedBookingCode ? (
            <button
              type="button"
              onClick={() => {
                showToast('Wajib mengunduh Tiket / Kode Booking unik Anda terlebih dahulu!', 'error');
              }}
              className="btn-secondary flex-1 justify-center text-xs py-2.5 opacity-60 cursor-not-allowed border-dashed flex items-center gap-1.5"
              title="Harap unduh tiket booking terlebih dahulu untuk membuka tombol ini"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Kembali ke Katalog (Terkunci)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchView('catalog')}
              className="btn-secondary flex-1 justify-center text-xs py-2.5 font-bold hover:bg-slate-200"
            >
              ✓ Kembali ke Katalog
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
