import React, { useState, useEffect } from 'react';
import { useRental } from '../../context/RentalContext';
import { formatRupiah, calculateEstimatedReturn, formatDateTime } from '../../shared/utils/formatters';
import { compressImageFile } from '../../shared/utils/imageCompressor';

export default function BookingPage() {
  const {
    selectedEquipment,
    selectedPackage,
    setBookingPackage,
    dailyDays,
    adjustDailyDays,
    createOrder,
    switchView,
    showToast,
    openOnRentModal,
    cart,
    checkoutCart,
    removeFromCart
  } = useRental();

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [datePickup, setDatePickup] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');

  // Bukti Transfer State
  const [paymentProof, setPaymentProof] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(null);

  // Initialize datePickup with current local time
  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDatePickup(now.toISOString().slice(0, 16));
  }, []);

  // Multi-item cart vs single equipment
  const isCartBooking = cart && cart.length > 0;

  // Price & Duration calculations
  let basePrice = 0;
  let totalPrice = 0;
  let durationText = '';
  let durationHours = 24;

  if (isCartBooking) {
    totalPrice = cart.reduce((sum, item) => sum + (item.itemPrice || 0), 0);
  } else if (selectedEquipment) {
    if (selectedPackage === '12h') {
      basePrice = selectedEquipment.rate12h;
      totalPrice = selectedEquipment.rate12h;
      durationText = 'Blok 12 Jam';
      durationHours = 12;
    } else if (selectedPackage === '24h') {
      basePrice = selectedEquipment.rate24h;
      totalPrice = selectedEquipment.rate24h;
      durationText = 'Blok 24 Jam (1 Hari)';
      durationHours = 24;
    } else if (selectedPackage === 'daily') {
      basePrice = selectedEquipment.rate24h;
      totalPrice = selectedEquipment.rate24h * dailyDays;
      durationText = `${dailyDays} Hari (${dailyDays * 24} Jam)`;
      durationHours = dailyDays * 24;
    }
  }

  const estimatedReturn = calculateEstimatedReturn(datePickup, durationHours);

  // File upload handler dengan kompresi otomatis
  const handleProofChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      const compressed = await compressImageFile(file, 900, 900, 0.75);
      setPaymentProof(compressed);
      showToast('Foto bukti pembayaran berhasil diunggah & dikompresi!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memproses gambar bukti pembayaran', 'error');
    } finally {
      setIsCompressing(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    showToast(`Nomor rekening ${text} berhasil disalin!`, 'info');
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Constraint: Only digits and 8-15 numbers length
    if (phone.length < 8 || phone.length > 15) {
      showToast('Nomor WhatsApp harus terdiri dari 8 hingga 15 digit angka.', 'error');
      return;
    }

    // Constraint: Wajib unggah bukti pembayaran jika QRIS atau Transfer Bank
    if (paymentMethod !== 'cash' && !paymentProof) {
      showToast('Wajib mengunggah foto struk/bukti transfer untuk metode QRIS atau Transfer Bank!', 'error');
      return;
    }

    if (isCartBooking) {
      const success = checkoutCart({
        customerName,
        phone,
        institution,
        paymentMethod,
        paymentProof: paymentMethod === 'cash' ? null : paymentProof
      });

      if (success) {
        setCustomerName('');
        setPhone('');
        setInstitution('');
        setPaymentProof(null);
      }
    } else {
      if (!selectedEquipment) {
        showToast('Silakan pilih alat dari katalog terlebih dahulu.', 'error');
        return;
      }

      const success = createOrder({
        customerName,
        phone,
        institution,
        datePickup,
        paymentMethod,
        paymentProof: paymentMethod === 'cash' ? null : paymentProof
      });

      if (success) {
        setCustomerName('');
        setPhone('');
        setInstitution('');
        setPaymentProof(null);
      }
    }
  };

  const activeBtnClass =
    'p-2 rounded-xl border text-center transition-all border-brand-500 bg-brand-50 text-brand-800 font-bold text-xs shadow-sm';
  const inactiveBtnClass =
    'p-2 rounded-xl border text-center transition-all border-slate-200 text-slate-700 font-semibold text-xs hover:border-slate-300';

  return (
    <section id="view-booking" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <button
            onClick={() => switchView('catalog')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 mb-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Katalog
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Formulir Pemesanan &amp; Jaminan Sewa
          </h2>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
          Booking Mandiri 24/7
        </span>
      </div>

      <div id="booking-content-container" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Item Selected (Col 1) */}
        <div className="md:col-span-1 space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                {isCartBooking ? `Alat di Keranjang (${cart.length})` : 'Item Yang Dipilih'}
              </h3>
              {isCartBooking && (
                <button
                  type="button"
                  onClick={() => switchView('catalog')}
                  className="text-[11px] font-bold text-brand-600 hover:underline"
                >
                  + Tambah Alat
                </button>
              )}
            </div>

            {/* Jika Booking dari Keranjang Multi-Alat */}
            {isCartBooking ? (
              <div className="space-y-3">
                {cart.map((c) => (
                  <div key={c.cartItemId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-brand-600 block">
                          {c.category} &bull; {c.itemId}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs truncate">
                          {c.name}
                        </h4>
                        <span className="text-xs font-black text-brand-700">
                          {formatRupiah(c.itemPrice)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(c.cartItemId)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Hapus alat"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-200/60 space-y-0.5 text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Jadwal Ambil:</span>
                        <span className="font-semibold text-slate-700 font-mono">
                          {formatDateTime(c.datePickup)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paket Durasi:</span>
                        <span className="font-semibold text-slate-700">{c.durationText}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-100 pt-0.5">
                        <span className="text-slate-400">Estimasi Selesai:</span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {formatDateTime(c.estimatedReturnTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Keranjang */}
                <div className="bg-brand-50 p-3.5 rounded-xl border border-brand-200 space-y-1.5 mt-3">
                  <div className="flex justify-between text-xs text-brand-900">
                    <span>Total Unit:</span>
                    <span className="font-bold">{cart.length} Unit Alat</span>
                  </div>
                  <div className="flex justify-between text-xs text-brand-900">
                    <span>Deposit Jaminan:</span>
                    <span className="font-semibold text-emerald-700">KTP/KTM Asli di Lokasi</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-brand-900 border-t border-brand-200 pt-1.5">
                    <span>Total Biaya Sewa:</span>
                    <span className="text-base text-brand-700">{formatRupiah(totalPrice)}</span>
                  </div>
                </div>
              </div>
            ) : selectedEquipment ? (
              /* Jika Booking Tunggal dari selectedEquipment */
              <div className="space-y-4">
                <div id="booking-item-card" className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedEquipment.image}
                      alt={selectedEquipment.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-brand-600 block uppercase">
                        {selectedEquipment.category} &bull; {selectedEquipment.id}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs leading-tight">
                        {selectedEquipment.name}
                      </h4>
                      <span className="text-[11px] text-slate-500 block">
                        Status:{' '}
                        <span className="font-semibold text-emerald-600">
                          {selectedEquipment.status}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Package & Duration Selector */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="label">Pilih Paket Durasi Sewa</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      id="block-12h-btn"
                      onClick={() => setBookingPackage('12h')}
                      className={selectedPackage === '12h' ? activeBtnClass : inactiveBtnClass}
                    >
                      Blok 12 Jam
                    </button>
                    <button
                      type="button"
                      id="block-24h-btn"
                      onClick={() => setBookingPackage('24h')}
                      className={selectedPackage === '24h' ? activeBtnClass : inactiveBtnClass}
                    >
                      Blok 24 Jam
                    </button>
                    <button
                      type="button"
                      id="block-daily-btn"
                      onClick={() => setBookingPackage('daily')}
                      className={selectedPackage === 'daily' ? activeBtnClass : inactiveBtnClass}
                    >
                      Per-Hari
                    </button>
                  </div>

                  {selectedPackage === 'daily' && (
                    <div
                      id="daily-counter-box"
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 mt-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700">Durasi Hari Sewa:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => adjustDailyDays(-1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            -
                          </button>
                          <span id="daily-days-count" className="font-bold text-xs text-slate-900 w-12 text-center">
                            {dailyDays} Hari
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustDailyDays(1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 active:scale-95 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Tarif sewa per-hari mengikuti tarif Blok 24 Jam.
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Price Calculation Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Paket Dipilih:</span>
                    <span id="price-duration-calc" className="font-medium text-slate-800">
                      {durationText}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Estimasi Selesai:</span>
                    <span id="price-estimated-return" className="font-bold text-slate-900 bg-slate-200/70 px-1.5 py-0.5 rounded text-[11px]">
                      {estimatedReturn}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Tarif Sewa Base:</span>
                    <span id="price-base-calc" className="font-medium">
                      {selectedPackage === 'daily'
                        ? `${formatRupiah(basePrice)} / hari`
                        : formatRupiah(basePrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Deposit Jaminan:</span>
                    <span className="font-medium text-emerald-600">KTM / KTP Asli di Tempat</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-200 pt-1.5 mt-1.5">
                    <span>Total Estimasi:</span>
                    <span id="price-total-calc" className="text-brand-600">
                      {formatRupiah(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <p className="text-xs text-slate-500">Belum ada alat yang dipilih.</p>
                <button
                  type="button"
                  onClick={() => switchView('catalog')}
                  className="btn-primary text-xs mx-auto"
                >
                  Buka Katalog Alat &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Input Customer & Payment (Col 2-3) */}
        <div className="md:col-span-2 space-y-6">
          <form id="booking-form" onSubmit={handleSubmit} className="card p-6 space-y-5">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              Informasi Penyewa &amp; Verifikasi
            </h3>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cust-name" className="label">
                  Nama Lengkap (Sesuai KTP/KTM)
                </label>
                <input
                  type="text"
                  id="cust-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Contoh: Veri Galih"
                  className="input"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="cust-phone" className="label mb-0">
                    Nomor WhatsApp Aktif
                  </label>
                  <span className={`text-[10px] font-semibold ${phone.length >= 8 && phone.length <= 15 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {phone.length}/15 digit {phone.length < 8 ? '(min. 8)' : ''}
                  </span>
                </div>
                <input
                  type="tel"
                  id="cust-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                  required
                  inputMode="numeric"
                  pattern="[0-9]{8,15}"
                  maxLength={15}
                  placeholder="081234567890 (Hanya angka)"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="cust-inst" className="label">
                  Instansi / Universitas / Tim / Pribadi
                </label>
                <input
                  type="text"
                  id="cust-inst"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  placeholder="Contoh: Politeknik Negeri Jakarta"
                  className="input"
                />
              </div>
              <div>
                <label htmlFor="cust-date" className="label">
                  Tanggal &amp; Jam Ambil
                </label>
                <input
                  type="datetime-local"
                  id="cust-date"
                  value={datePickup}
                  onChange={(e) => setDatePickup(e.target.value)}
                  required
                  className="input"
                />
              </div>
            </div>

            {/* Guarantee Policy Banner (No KTP Upload Needed) */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-emerald-950 block">
                  Jaminan Identitas Fisik di Lokasi
                </span>
                <p className="text-emerald-800 leading-relaxed">
                  Tidak perlu mengunggah foto KTP/KTM secara online.{' '}
                  <strong>Kartu identitas asli (KTP / KTM Aktif)</strong> wajib dibawa dan diserahkan sebagai jaminan fisik saat pengambilan/serah-terima alat di studio Layarasa.
                </p>
              </div>
            </div>

            {/* Payment Method Selection with Elevated Green Effect */}
            <div className="space-y-2">
              <label className="label">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'qris', name: 'QRIS', desc: 'Instant Verification' },
                  { id: 'bank', name: 'Transfer Bank', desc: 'BCA / Mandiri' },
                  { id: 'cash', name: 'Tunai', desc: 'Bayar di Studio' }
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3.5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-2 border-emerald-600 bg-emerald-50/90 shadow-lg shadow-emerald-600/15 scale-[1.02] ring-2 ring-emerald-500/30'
                          : 'border border-slate-200 bg-white hover:border-slate-300 opacity-80 hover:opacity-100 hover:shadow-sm'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={m.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(m.id)}
                        className="sr-only"
                      />
                      <span className={`font-black text-xs ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                        {m.name}
                      </span>
                      <span className={`text-[10px] ${isSelected ? 'text-emerald-700 font-medium' : 'text-slate-500'}`}>
                        {m.desc}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-1 border border-emerald-300">
                          ✓ Terpilih
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel Rincian Pembayaran & Upload Bukti Transfer */}
            {paymentMethod === 'qris' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-extrabold text-xs text-slate-900">Pembayaran Instan QRIS Layarasa</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    NMID: ID1020039281923
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-center p-1.5 flex-shrink-0">
                    <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h7v7H3V3zm2 2v3h3V5H5zm9-2h7v7h-7V3zm2 2v3h3V5h-3zM3 14h7v7H3v-7zm2 2v3h3v-3H5zm8-2h3v3h-3v-3zm4 0h3v3h-3v-3zm-4 4h3v3h-3v-3zm4 0h3v3h-3v-3zm-6-2h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                    </svg>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-slate-800">Scan QRIS dari Mobile Banking / E-Wallet</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      Mendukung BCA Mobile, Livin Mandiri, BRImo, BNI, GoPay, OVO, Dana, dan ShopeePay.
                    </p>
                    <p className="font-extrabold text-emerald-700 text-sm pt-0.5">
                      Total Nominal: {formatRupiah(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Upload Struk Bukti QRIS */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Unggah Bukti / Tangkapan Layar QRIS <span className="text-red-500">*Wajib</span>
                  </label>
                  {!paymentProof ? (
                    <label className="border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        disabled={isCompressing}
                        className="sr-only"
                      />
                      <svg className="w-7 h-7 text-emerald-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-bold text-xs text-emerald-950">
                        {isCompressing ? 'Mengompresi Gambar...' : 'Klik untuk Pilih / Foto Bukti Transfer'}
                      </span>
                      <span className="text-[10px] text-slate-500">Mendukung Kamera HP atau Galeri (JPG, PNG)</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-emerald-300 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={paymentProof}
                          alt="Bukti Transfer"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <span className="text-xs font-extrabold text-emerald-800 block">✓ Bukti Transfer Siap</span>
                          <span className="text-[10px] text-slate-400">Telah terkompresi &amp; siap diverifikasi</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentProof(null)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 border border-red-200"
                      >
                        Hapus / Ganti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span className="font-extrabold text-xs text-slate-900">Rekening Resmi Layarasa Studio</span>
                  </div>
                  <span className="font-extrabold text-blue-700 text-xs">
                    Nominal: {formatRupiah(totalPrice)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Rekening BCA */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank BCA</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">869-123-4567</span>
                      <span className="text-[10px] text-slate-500 block">a.n. Layarasa Rental</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('8691234567', 'bca')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold text-slate-700"
                    >
                      {copiedAccount === 'bca' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>

                  {/* Rekening Mandiri */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank Mandiri</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">157-00-1234567-8</span>
                      <span className="text-[10px] text-slate-500 block">a.n. Layarasa Multimedia</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('1570012345678', 'mandiri')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-semibold text-slate-700"
                    >
                      {copiedAccount === 'mandiri' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>
                </div>

                {/* Upload Struk Bukti Transfer */}
                <div className="pt-1">
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Unggah Struk / Bukti Transfer Bank <span className="text-red-500">*Wajib</span>
                  </label>
                  {!paymentProof ? (
                    <label className="border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                        disabled={isCompressing}
                        className="sr-only"
                      />
                      <svg className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-bold text-xs text-blue-950">
                        {isCompressing ? 'Mengompresi Gambar...' : 'Klik untuk Pilih / Foto Struk ATM/M-Banking'}
                      </span>
                      <span className="text-[10px] text-slate-500">Mendukung Kamera HP atau Galeri (JPG, PNG)</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-white border border-blue-300 rounded-xl">
                      <div className="flex items-center gap-3">
                        <img
                          src={paymentProof}
                          alt="Bukti Transfer"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        />
                        <div>
                          <span className="text-xs font-extrabold text-blue-800 block">✓ Struk Transfer Terlampir</span>
                          <span className="text-[10px] text-slate-400">Telah terkompresi &amp; siap diverifikasi</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentProof(null)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1 rounded-lg hover:bg-red-50 border border-red-200"
                      >
                        Hapus / Ganti
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === 'cash' && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 flex items-start gap-2.5 animate-fade-in">
                <span className="text-slate-400 font-bold">ℹ️</span>
                <p className="leading-relaxed">
                  <strong>Pembayaran Tunai di Studio:</strong> Anda dapat membayar lunas saat mengambil alat di studio Layarasa setelah melakukan pengecekan fisik unit bersama staf. <em>Tidak perlu mengunggah bukti transfer sekarang.</em>
                </p>
              </div>
            )}

            {/* Submit / Contact Admin Button */}
            {selectedEquipment && selectedEquipment.status !== 'Available' ? (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                  ⚠️ Unit <strong>{selectedEquipment.name}</strong> saat ini berstatus <strong>{selectedEquipment.status}</strong>. Pemesanan mandiri tidak tersedia, silakan tanyakan ketersediaan jadwal ke Admin Layarasa.
                </div>
                <button
                  type="button"
                  onClick={() => openOnRentModal(selectedEquipment)}
                  className="btn-primary w-full justify-center py-3 text-sm bg-[#25D366] hover:bg-[#1ebd59] text-white shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.228-1.157z" />
                  </svg>
                  Tanya Jadwal Alat ke Admin via WhatsApp
                </button>
              </div>
            ) : (
              <button
                type="submit"
                disabled={!selectedEquipment}
                className="btn-primary w-full justify-center py-3 text-sm shadow-md"
              >
                Konfirmasi Booking &amp; Dapatkan Kode Unik
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
