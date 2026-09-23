import React, { useState } from 'react';
import { useRental } from '../../context/RentalContext';
import { compressImageFile } from '../../shared/utils/imageCompressor';
import { formatRupiah, formatDateTime, calculateLateFee } from '../../shared/utils/formatters';

export default function PickupModal() {
  const {
    isPickupModalOpen,
    closePickupModal,
    pickupVerifyCode,
    setPickupVerifyCode,
    verifyOrderCode,
    pickupVerifyResult,
    executePickupTransition,
    cancelOrDeleteOrder,
    showToast,
    inventory
  } = useRental();

  // Condition Checklist State
  const [handoverPhoto, setHandoverPhoto] = useState(null);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [returnPhoto, setReturnPhoto] = useState(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Denda Lain-lain State (Poin 3b)
  const [otherFee, setOtherFee] = useState(0);
  const [otherFeeNotes, setOtherFeeNotes] = useState('');

  // Checklist verification checkboxes
  const [checkSensor, setCheckSensor] = useState(false);
  const [checkBody, setCheckBody] = useState(false);
  const [checkAccessories, setCheckAccessories] = useState(false);
  const [checkFunctions, setCheckFunctions] = useState(false);

  // Full-size image preview modal
  const [previewPhotoModal, setPreviewPhotoModal] = useState(null);

  if (!isPickupModalOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    verifyOrderCode(pickupVerifyCode);
    // Reset local checklist inputs when new order is loaded
    setHandoverPhoto(null);
    setHandoverNotes('');
    setReturnPhoto(null);
    setReturnNotes('');
    setOtherFee(0);
    setOtherFeeNotes('');
    setCheckSensor(false);
    setCheckBody(false);
    setCheckAccessories(false);
    setCheckFunctions(false);
  };

  // Upload Handover Photo
  const handleHandoverPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImageFile(file, 900, 900, 0.75);
      setHandoverPhoto(compressed);
      showToast('Foto kondisi fisik serah-terima berhasil diambil!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memproses foto fisik', 'error');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Upload Return Photo
  const handleReturnPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingPhoto(true);
      const compressed = await compressImageFile(file, 900, 900, 0.75);
      setReturnPhoto(compressed);
      showToast('Foto kondisi fisik pengembalian berhasil diambil!', 'success');
    } catch (err) {
      showToast(err.message || 'Gagal memproses foto fisik', 'error');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const currentOrder = orders.find((o) => o.code === pickupVerifyResult?.order?.code) || pickupVerifyResult?.order;

  return (
    <>
      <div
        id="modal-pickup"
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto modal-scrollable">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Validasi Fisik &amp; Digital Condition Checklist
              </h3>
              <p className="text-[11px] text-slate-500">
                Pemeriksaan fisik wajib foto unit sebelum serah-terima dan pengembalian (WBS Poin 4).
              </p>
            </div>
            <button onClick={closePickupModal} className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label htmlFor="input-verify-code" className="label text-xs">
              Masukkan / Scan Kode Booking Unik
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="input-verify-code"
                placeholder="Contoh: LAYA-2026-X9K2"
                value={pickupVerifyCode}
                onChange={(e) => setPickupVerifyCode(e.target.value)}
                className="input font-mono uppercase font-bold tracking-wider text-xs"
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
                <div className="space-y-3">
                  {/* Multi-Item Booking Indicator & Item Selector Tabs */}
                  {pickupVerifyResult.matchedOrders && pickupVerifyResult.matchedOrders.length > 1 && (
                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-amber-900">
                        <span>📦 Paket Booking Satu Keranjang ({pickupVerifyResult.matchedOrders.length} Unit Alat):</span>
                        <span className="font-mono text-xs">{pickupVerifyResult.sharedCode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {pickupVerifyResult.matchedOrders.map((mo, idx) => {
                          const liveItem = orders.find((o) => o.code === mo.code) || mo;
                          const isSelected = currentOrder.code === liveItem.code;
                          return (
                            <button
                              key={liveItem.code}
                              type="button"
                              onClick={() => {
                                setPickupVerifyResult((prev) => ({ ...prev, order: liveItem }));
                                // Reset form input checklist untuk unit ini
                                setHandoverPhoto(null);
                                setHandoverNotes('');
                                setReturnPhoto(null);
                                setReturnNotes('');
                                setOtherFee(0);
                                setOtherFeeNotes('');
                                setCheckSensor(false);
                                setCheckBody(false);
                                setCheckAccessories(false);
                                setCheckFunctions(false);
                              }}
                              className={`p-2 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                                isSelected
                                  ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span className="block font-bold text-[11px] truncate">
                                #{idx + 1} {liveItem.itemName}
                              </span>
                              <span className={`text-[10px] font-medium block ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                                {liveItem.itemId} &bull; <strong className="font-semibold">{liveItem.status}</strong>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Order Header */}
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm font-mono block">
                        {currentOrder.groupCode || currentOrder.code}
                      </span>
                      {currentOrder.groupCode && orders.filter((x) => x.groupCode === currentOrder.groupCode).length > 1 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID Unit: {currentOrder.code}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentOrder.status === 'On Rent'
                        ? 'bg-blue-100 text-blue-800'
                        : currentOrder.status === 'Returned'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {currentOrder.status === 'Booked' ? 'Menunggu Serah-Terima' : currentOrder.status}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="text-slate-700 space-y-1">
                    <p>
                      <strong>Penyewa:</strong> {currentOrder.customerName} ({currentOrder.phone})
                    </p>
                    <p>
                      <strong>Item Disewa:</strong> {currentOrder.itemName} ({currentOrder.itemId})
                    </p>
                    <p>
                      <strong>Metode Bayar:</strong> {currentOrder.paymentMethod?.toUpperCase()} &bull;{' '}
                      <strong>Jaminan:</strong> KTP/KTM Asli di Studio
                    </p>
                    <p>
                      <strong>Jadwal Sewa:</strong> {currentOrder.durationText || `${currentOrder.durationBlock} Jam`} (Selesai: <span className="font-mono">{currentOrder.estimatedReturnTime || '-'}</span>)
                    </p>
                  </div>

                  {/* Bukti Pembayaran Penyewa (Jika QRIS / Transfer Bank) */}
                  {currentOrder.paymentProof && (
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentOrder.paymentProof}
                          alt="Bukti Transfer"
                          className="w-10 h-10 object-cover rounded-lg border border-emerald-300 cursor-pointer hover:opacity-80"
                          onClick={() => setPreviewPhotoModal({ url: currentOrder.paymentProof, title: `Bukti Transfer - ${currentOrder.code}` })}
                        />
                        <div>
                          <span className="font-bold text-emerald-950 text-xs block">Bukti Transfer Terlampir</span>
                          <span className="text-[10px] text-emerald-700">Metode: {currentOrder.paymentMethod?.toUpperCase()}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPreviewPhotoModal({ url: currentOrder.paymentProof, title: `Bukti Transfer - ${currentOrder.code}` })}
                        className="btn-secondary text-[11px] py-1 px-2.5 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                      >
                        Lihat Bukti
                      </button>
                    </div>
                  )}

                  {/* ========================================================
                      KASUS 1: STATUS BOOKED (Wajib Foto Fisik Sebelum Serahkan)
                      ======================================================== */}
                  {currentOrder.status === 'Booked' && (
                    <div className="p-3 bg-white border border-amber-300 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          Digital Condition Checklist (Sebelum Serah-Terima)
                        </span>
                        <span className="text-[10px] text-red-600 font-extrabold">*Wajib Foto</span>
                      </div>

                      {/* Checklist Pemeriksaan Fisik */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={checkBody} onChange={(e) => setCheckBody(e.target.checked)} className="rounded text-emerald-600" />
                          <span>Bodi &amp; Rangka Bebas Retak</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={checkSensor} onChange={(e) => setCheckSensor(e.target.checked)} className="rounded text-emerald-600" />
                          <span>Sensor &amp; Optik Lensa Bersih</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={checkAccessories} onChange={(e) => setCheckAccessories(e.target.checked)} className="rounded text-emerald-600" />
                          <span>Aksesoris &amp; Baterai Lengkap</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={checkFunctions} onChange={(e) => setCheckFunctions(e.target.checked)} className="rounded text-emerald-600" />
                          <span>Layar &amp; Tombol Berfungsi Normal</span>
                        </label>
                      </div>

                      {/* Input Foto Kondisi Fisik Serah-Terima */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-[11px] font-bold text-slate-800">
                          Foto Kondisi Fisik Unit Saat Ini (Handover):
                        </label>
                        {!handoverPhoto ? (
                          <label className="border-2 border-dashed border-amber-400 bg-amber-50/50 hover:bg-amber-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors group">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={handleHandoverPhotoUpload}
                              disabled={isProcessingPhoto}
                              className="sr-only"
                            />
                            <svg className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-bold text-xs text-amber-950">
                              {isProcessingPhoto ? 'Memproses Foto...' : 'Ambil Foto Fisik Alat / Unggah'}
                            </span>
                            <span className="text-[10px] text-slate-500">Membuka Kamera HP atau File Gambar</span>
                          </label>
                        ) : (
                          <div className="flex items-center justify-between p-2 bg-slate-50 border border-emerald-300 rounded-xl">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={handoverPhoto}
                                alt="Foto Handover"
                                className="w-12 h-12 object-cover rounded-lg border border-slate-200 cursor-pointer"
                                onClick={() => setPreviewPhotoModal({ url: handoverPhoto, title: 'Foto Kondisi Fisik Serah-Terima' })}
                              />
                              <div>
                                <span className="font-bold text-emerald-800 text-xs block">✓ Foto Fisik Diambil</span>
                                <span className="text-[10px] text-slate-400">Siap sebagai bukti kondisi awal</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setHandoverPhoto(null)}
                              className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                            >
                              Hapus
                            </button>
                          </div>
                        )}

                        <input
                          type="text"
                          placeholder="Catatan fisik (opsional: misal ada baret halus di bawah bodi)..."
                          value={handoverNotes}
                          onChange={(e) => setHandoverNotes(e.target.value)}
                          className="input py-1 text-xs w-full mt-1.5"
                        />
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      KASUS 2: STATUS ON RENT (Sedang Disewa -> Pengembalian)
                      ======================================================== */}
                  {currentOrder.status === 'On Rent' && (
                    <div className="space-y-3">
                      {/* Referensi Foto Kondisi Awal Handover */}
                      {currentOrder.handoverPhoto && (
                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                          <span className="font-bold text-blue-950 text-xs block">
                            Foto Kondisi Awal Saat Serah-Terima (Referensi):
                          </span>
                          <div className="flex items-center gap-3">
                            <img
                              src={currentOrder.handoverPhoto}
                              alt="Foto Awal"
                              className="w-16 h-16 object-cover rounded-lg border border-blue-300 cursor-pointer hover:opacity-90"
                              onClick={() => setPreviewPhotoModal({ url: currentOrder.handoverPhoto, title: `Foto Kondisi Awal - ${currentOrder.code}` })}
                            />
                            <div className="text-[11px] text-slate-600">
                              <p className="font-semibold text-slate-800">Bandingkan unit dengan foto awal ini.</p>
                              {currentOrder.handoverNotes && (
                                <p className="italic text-slate-500">Catatan awal: &quot;{currentOrder.handoverNotes}&quot;</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Checklist & Foto Pengembalian */}
                      <div className="p-3 bg-white border border-blue-300 rounded-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-blue-950 text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            Digital Condition Checklist (Pengembalian / Return)
                          </span>
                          <span className="text-[10px] text-red-600 font-extrabold">*Wajib Foto</span>
                        </div>

                        {/* Input Foto Pengembalian */}
                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-bold text-slate-800">
                            Foto Kondisi Fisik Alat Saat Dikembalikan:
                          </label>
                          {!returnPhoto ? (
                            <label className="border-2 border-dashed border-blue-400 bg-blue-50/50 hover:bg-blue-50 rounded-xl p-3 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors group">
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleReturnPhotoUpload}
                                disabled={isProcessingPhoto}
                                className="sr-only"
                              />
                              <svg className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="font-bold text-xs text-blue-950">
                                {isProcessingPhoto ? 'Memproses Foto...' : 'Ambil Foto Fisik Saat Kembali'}
                              </span>
                              <span className="text-[10px] text-slate-500">Membuka Kamera HP atau File Gambar</span>
                            </label>
                          ) : (
                            <div className="flex items-center justify-between p-2 bg-slate-50 border border-blue-300 rounded-xl">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={returnPhoto}
                                  alt="Foto Return"
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 cursor-pointer"
                                  onClick={() => setPreviewPhotoModal({ url: returnPhoto, title: 'Foto Kondisi Fisik Pengembalian' })}
                                />
                                <div>
                                  <span className="font-bold text-blue-800 text-xs block">✓ Foto Pengembalian Diambil</span>
                                  <span className="text-[10px] text-slate-400">Siap diverifikasi &amp; diarsipkan</span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setReturnPhoto(null)}
                                className="text-xs text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                              >
                                Hapus
                              </button>
                            </div>
                          )}

                          <input
                            type="text"
                            placeholder="Catatan pengembalian (misal: unit bersih, kelengkapan utuh)..."
                            value={returnNotes}
                            onChange={(e) => setReturnNotes(e.target.value)}
                            className="input py-1 text-xs w-full mt-1.5"
                          />
                        </div>

                        {/* SECTION PENALTY: Denda Keterlambatan Otomatis (Poin 3a) */}
                        {(() => {
                          const currentInventoryItem = inventory?.find((i) => i.id === currentOrder.itemId);
                          const rate24h = currentInventoryItem?.rate24h || currentOrder.totalPrice || 0;
                          const lateFeeInfo = calculateLateFee(currentOrder.estimatedReturnTime, null, rate24h);

                          return (
                            <div className="space-y-3 pt-2 border-t border-blue-200">
                              {/* Box Denda Keterlambatan */}
                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                                    ⏱️ Status Keterlambatan &amp; Denda Otomatis:
                                  </span>
                                  {lateFeeInfo.isLate && !lateFeeInfo.isGracePeriod ? (
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200">
                                      Terlambat {lateFeeInfo.lateHours}j {lateFeeInfo.lateMinutes}m
                                    </span>
                                  ) : lateFeeInfo.isGracePeriod ? (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                                      Masa Toleransi (&lt; 1 Jam)
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                      Tepat Waktu
                                    </span>
                                  )}
                                </div>

                                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Jadwal Estimasi Selesai:</span>
                                    <span className="font-mono font-semibold text-slate-800">
                                      {formatDateTime(currentOrder.estimatedReturnTime)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Status &amp; Tarif Denda:</span>
                                    <span className="font-semibold text-slate-700">{lateFeeInfo.desc}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-slate-100 pt-1">
                                    <span className="text-slate-500 font-semibold">Nominal Denda Waktu:</span>
                                    <span className="font-extrabold text-red-600">
                                      {formatRupiah(lateFeeInfo.fee)}
                                    </span>
                                  </div>
                                </div>

                                <p className="text-[10px] text-slate-400 leading-tight">
                                  * Ketentuan WBS: 1–3 jam = 30% tarif 24 jam, 3–6 jam = 50% tarif harian, &gt;6 jam / berganti hari = 100% (1 hari sewa tambahan per 24 jam).
                                </p>
                              </div>

                              {/* Box Denda Lain-lain / Kerusakan Manual (Poin 3b) */}
                              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                                <span className="font-bold text-slate-900 text-xs block">
                                  🛠️ Denda Lain-lain / Kerusakan (Manual Sesuai Kesepakatan):
                                </span>
                                <div className="space-y-1.5">
                                  <div>
                                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                                      Nominal Denda Kerusakan/Lainnya (Rp):
                                    </label>
                                    <input
                                      type="number"
                                      min="0"
                                      step="5000"
                                      placeholder="0 (jika tidak ada denda tambahan)"
                                      value={otherFee || ''}
                                      onChange={(e) => setOtherFee(Math.max(0, Number(e.target.value) || 0))}
                                      className="input py-1 text-xs w-full font-mono font-bold"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                                      Catatan Kerusakan &amp; Kesepakatan Penggantian:
                                    </label>
                                    <textarea
                                      rows={2}
                                      placeholder="Contoh: Baret lensa optik depan / penggantian elemen optik sesuai kesepakatan tertulis staf dan penyewa..."
                                      value={otherFeeNotes}
                                      onChange={(e) => setOtherFeeNotes(e.target.value)}
                                      className="input py-1 text-xs w-full resize-none"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Ringkasan Total Pelunasan Akhir (Settlement) */}
                              {(() => {
                                const totalFinal = (currentOrder.totalPrice || 0) + (lateFeeInfo.fee || 0) + Number(otherFee || 0);
                                return (
                                  <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 text-xs">
                                    <div className="flex justify-between text-slate-300 text-[11px]">
                                      <span>Biaya Pokok Sewa:</span>
                                      <span>{formatRupiah(currentOrder.totalPrice)}</span>
                                    </div>
                                    {lateFeeInfo.fee > 0 && (
                                      <div className="flex justify-between text-amber-400 text-[11px]">
                                        <span>Denda Keterlambatan:</span>
                                        <span>+{formatRupiah(lateFeeInfo.fee)}</span>
                                      </div>
                                    )}
                                    {otherFee > 0 && (
                                      <div className="flex justify-between text-amber-400 text-[11px]">
                                        <span>Denda Kerusakan / Lain-lain:</span>
                                        <span>+{formatRupiah(otherFee)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between font-extrabold text-sm border-t border-slate-700 pt-1.5 text-emerald-400">
                                      <span>Total Pelunasan Wajib:</span>
                                      <span>{formatRupiah(totalFinal)}</span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* ========================================================
                      KASUS 3: STATUS RETURNED (Arsip Riwayat Foto & Denda)
                      ======================================================== */}
                  {currentOrder.status === 'Returned' && (
                    <div className="space-y-3">
                      {/* Rincian Pelunasan & Denda Tersimpan */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <span className="font-bold text-slate-900 block border-b border-slate-100 pb-1">
                          Rincian Transaksi Selesai &amp; Catatan Denda:
                        </span>
                        <div className="flex justify-between text-slate-600">
                          <span>Biaya Sewa Pokok:</span>
                          <span className="font-semibold">{formatRupiah(currentOrder.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Denda Keterlambatan:</span>
                          <span className="font-semibold text-red-600">
                            {formatRupiah(currentOrder.lateFee || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Denda Lain-lain / Kerusakan:</span>
                          <span className="font-semibold text-red-600">
                            {formatRupiah(currentOrder.otherFee || 0)}
                          </span>
                        </div>
                        {currentOrder.otherFeeNotes && (
                          <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
                            <strong>Catatan Kerusakan:</strong> {currentOrder.otherFeeNotes}
                          </div>
                        )}
                        <div className="flex justify-between font-black text-slate-900 border-t border-slate-100 pt-1.5">
                          <span>Total Akhir Pelunasan:</span>
                          <span className="text-brand-600">
                            {formatRupiah(
                              currentOrder.totalSettlement ||
                                (currentOrder.totalPrice || 0) +
                                  (currentOrder.lateFee || 0) +
                                  (currentOrder.otherFee || 0)
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Arsip Foto */}
                      <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-bold text-slate-900 text-xs block">
                          Arsip Bukti Pemeriksaan Fisik:
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-center">
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Foto Serah-Terima</span>
                            {currentOrder.handoverPhoto ? (
                              <img
                                src={currentOrder.handoverPhoto}
                                alt="Handover"
                                className="w-full h-20 object-cover rounded-lg border border-slate-300 cursor-pointer hover:opacity-90"
                                onClick={() => setPreviewPhotoModal({ url: currentOrder.handoverPhoto, title: `Foto Serah-Terima - ${currentOrder.code}` })}
                              />
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Tidak ada foto</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-semibold block mb-1">Foto Pengembalian</span>
                            {currentOrder.returnPhoto ? (
                              <img
                                src={currentOrder.returnPhoto}
                                alt="Return"
                                className="w-full h-20 object-cover rounded-lg border border-slate-300 cursor-pointer hover:opacity-90"
                                onClick={() => setPreviewPhotoModal({ url: currentOrder.returnPhoto, title: `Foto Pengembalian - ${currentOrder.code}` })}
                              />
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Tidak ada foto</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tombol Aksi Transisi dengan Proteksi Wajib Foto & Simpan Denda */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2 border-t border-slate-200">
                    {/* Tombol Serahkan (On Rent) */}
                    <button
                      type="button"
                      disabled={currentOrder.status !== 'Booked' || !handoverPhoto}
                      onClick={() =>
                        executePickupTransition(currentOrder.code, 'On Rent', {
                          handoverPhoto,
                          handoverNotes
                        })
                      }
                      className={`btn-primary text-xs flex-1 justify-center ${
                        currentOrder.status === 'Booked' && handoverPhoto
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-300 shadow-none'
                      }`}
                      title={
                        currentOrder.status !== 'Booked'
                          ? 'Unit sudah diserahkan'
                          : !handoverPhoto
                          ? 'Wajib unggah foto kondisi fisik sebelum serahkan alat'
                          : 'Serahkan unit ke penyewa'
                      }
                    >
                      {currentOrder.status === 'Booked' && !handoverPhoto ? '📷 Wajib Foto Fisik' : 'Serahkan (On Rent)'}
                    </button>

                    {/* Tombol Kembalikan (Available) dengan Kalkulasi Denda */}
                    {(() => {
                      const currentInventoryItem = inventory?.find((i) => i.id === currentOrder.itemId);
                      const rate24h = currentInventoryItem?.rate24h || currentOrder.totalPrice || 0;
                      const lateFeeInfo = calculateLateFee(currentOrder.estimatedReturnTime, null, rate24h);
                      const totalFinal = (currentOrder.totalPrice || 0) + (lateFeeInfo.fee || 0) + Number(otherFee || 0);

                      return (
                        <button
                          type="button"
                          disabled={currentOrder.status !== 'On Rent' || !returnPhoto}
                          onClick={() =>
                            executePickupTransition(currentOrder.code, 'Returned', {
                              returnPhoto,
                              returnNotes,
                              lateFee: lateFeeInfo.fee,
                              otherFee,
                              otherFeeNotes,
                              totalSettlement: totalFinal
                            })
                          }
                          className={`btn-secondary text-xs flex-1 justify-center ${
                            currentOrder.status === 'On Rent' && returnPhoto
                              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-md'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-100'
                          }`}
                          title={
                            currentOrder.status !== 'On Rent'
                              ? 'Unit belum berstatus On Rent'
                              : !returnPhoto
                              ? 'Wajib unggah foto kondisi fisik pengembalian'
                              : 'Selesaikan transaksi sewa & catat pelunasan'
                          }
                        >
                          {currentOrder.status === 'On Rent' && !returnPhoto
                            ? '📷 Wajib Foto Kembali'
                            : 'Kembalikan (Available)'}
                        </button>
                      );
                    })()}

                    {/* Tombol Batalkan / Hapus */}
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Yakin ingin membatalkan/menghapus pesanan ${currentOrder.code}?\n\nAlat ${currentOrder.itemId} (${currentOrder.itemName}) akan otomatis kembali menjadi 'Available'.`
                          )
                        ) {
                          cancelOrDeleteOrder(currentOrder.code);
                        }
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center justify-center gap-1"
                      title="Batalkan Booking & Hapus Pesanan"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button onClick={closePickupModal} className="btn-secondary text-xs">
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Modal Preview Gambar Layar Penuh */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-4 space-y-3 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-extrabold text-slate-900 text-sm">
                {previewPhotoModal.title || 'Pratinjau Foto'}
              </h4>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-950 rounded-xl p-2">
              <img
                src={previewPhotoModal.url}
                alt="Pratinjau"
                className="max-h-[65vh] w-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewPhotoModal(null)}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
