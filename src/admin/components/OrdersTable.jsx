import React, { useState } from 'react';
import { useRental } from '../../context/RentalContext';
import {
  formatRupiah,
  formatDate,
  formatDateTime,
  calculateEstimatedReturn,
  isOverdue,
  getPaymentBadgeInfo,
  getProgressBadgeInfo,
  getStatusBadgeClass
} from '../../shared/utils/formatters';

export default function OrdersTable() {
  const {
    orders,
    exportOrdersToCSV,
    openPickupModal,
    hasExportedCSV,
    clearCompletedOrdersHistory,
    cancelOrDeleteOrder,
    resetAllOrdersToEmpty
  } = useRental();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Delete Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Preview Image Modal State (Bukti TF & Foto Kondisi Fisik)
  const [previewImageModal, setPreviewImageModal] = useState(null);

  // Filter Orders
  const query = searchTerm.toLowerCase().trim();
  const filteredOrders = orders.filter((o) => {
    // Search match
    const matchSearch =
      !query ||
      (o.customerName || '').toLowerCase().includes(query) ||
      (o.phone || '').toLowerCase().includes(query) ||
      (o.institution || '').toLowerCase().includes(query) ||
      (o.code || '').toLowerCase().includes(query) ||
      (o.itemName || '').toLowerCase().includes(query) ||
      (o.itemId || '').toLowerCase().includes(query);

    // Date range match
    const orderDate = o.datePickup ? o.datePickup.slice(0, 10) : '';
    const matchStart = !startDate || (orderDate && orderDate >= startDate);
    const matchEnd = !endDate || (orderDate && orderDate <= endDate);

    return matchSearch && matchStart && matchEnd;
  });

  const completedCount = orders.filter((o) => o.status === 'Returned' || o.status === 'Cancelled').length;

  const handleOpenDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!hasExportedCSV) {
      exportOrdersToCSV();
    }
    clearCompletedOrdersHistory();
    setIsDeleteModalOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="card p-6 space-y-4">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            Daftar Pemesanan &amp; Logika Status Real-Time (WBS Poin 4 &amp; 5)
          </h3>
          <p className="text-xs text-slate-500">
            Terhubung otomatis dengan 25 inventaris: Pencatatan estimasi selesai, timestamp penyerahan, dan pengembalian.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={exportOrdersToCSV}
            className="btn-secondary text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-200 transition-colors"
            title="Download CSV Histori Pemesanan"
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CSV Cadangan
          </button>

          <button
            onClick={handleOpenDelete}
            className="btn-secondary text-xs flex items-center gap-1.5 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            title="Hapus Histori Pesanan Selesai (Wajib CSV)"
          >
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Bersihkan Histori
          </button>

          <button
            onClick={() => {
              if (
                window.confirm(
                  'Kosongkan semua daftar pemesanan sekarang?\n\nSemua riwayat pesanan akan dihapus dan seluruh unit inventaris otomatis kembali menjadi "Available".'
                )
              ) {
                resetAllOrdersToEmpty();
              }
            }}
            className="btn-secondary text-xs flex items-center gap-1.5 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kosongkan Semua Pemesanan (Reset Data Bersih)"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Kosongkan Semua
          </button>

          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full" id="orders-count-badge">
            {filteredOrders.length} dari {orders.length} Pesanan
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari nama penyewa, nomor WhatsApp, alat, kode booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-9 py-1.5 text-xs w-full"
          />
        </div>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Dari:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input py-1 px-2 text-xs w-auto"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Sampai:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input py-1 px-2 text-xs w-auto"
            />
          </div>
          {(searchTerm || startDate || endDate) && (
            <button
              onClick={resetFilters}
              className="btn-secondary py-1 px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Responsive Table with Full Operational Trail */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase text-slate-600 bg-slate-100">
              <th className="p-3 whitespace-nowrap">Tanggal Booking</th>
              <th className="p-3 whitespace-nowrap">Kode Booking</th>
              <th className="p-3 whitespace-nowrap">Penyewa &amp; Kontak</th>
              <th className="p-3 whitespace-nowrap">Asset &amp; Alat</th>
              <th className="p-3 whitespace-nowrap">Durasi</th>
              <th className="p-3 whitespace-nowrap">Estimasi Selesai</th>
              <th className="p-3 whitespace-nowrap">Serah-Terima</th>
              <th className="p-3 whitespace-nowrap">Pengembalian</th>
              <th className="p-3 whitespace-nowrap">Metode</th>
              <th className="p-3 whitespace-nowrap">Total Biaya</th>
              <th className="p-3 whitespace-nowrap">Progres</th>
              <th className="p-3 text-right whitespace-nowrap sticky right-0 bg-slate-100 shadow-sm">Aksi</th>
            </tr>
          </thead>
          <tbody id="admin-orders-tbody" className="divide-y divide-slate-100 text-xs">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center p-8 text-slate-400">
                  {orders.length === 0
                    ? 'Daftar pemesanan kosong (default bersih). Belum ada transaksi pemesanan masuk.'
                    : 'Tidak ada data pemesanan yang cocok dengan pencarian / filter tanggal.'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const badgeClass = getStatusBadgeClass(o.status);
                const paymentBadge = getPaymentBadgeInfo(o.paymentMethod);
                const progressBadge = getProgressBadgeInfo(o.status);
                const formattedDate = formatDate(o.datePickup);
                const durasi = o.durationText || `${o.durationBlock || 24} Jam`;
                const estReturn = o.estimatedReturnTime || calculateEstimatedReturn(o.datePickup, o.durationBlock || 24);
                const overdue = isOverdue(estReturn, o.status);

                return (
                  <tr key={o.code} className="hover:bg-slate-50 transition-colors">
                    {/* Tanggal Booking */}
                    <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap font-mono">
                      {formattedDate}
                    </td>

                    {/* Kode Booking */}
                    <td className="p-3 font-mono font-bold text-brand-700 whitespace-nowrap">
                      {o.code}
                    </td>

                    {/* Penyewa & Kontak */}
                    <td className="p-3">
                      <span className="font-bold text-slate-800 block">{o.customerName}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {o.institution} &bull; <strong className="font-mono">{o.phone}</strong>
                      </span>
                    </td>

                    {/* Kode Asset & Alat */}
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{o.itemName}</span>
                      <span className="text-[10px] font-mono text-brand-600 font-semibold">{o.itemId}</span>
                    </td>

                    {/* Durasi */}
                    <td className="p-3 text-slate-700 font-medium whitespace-nowrap">
                      {durasi}
                    </td>

                    {/* Estimasi Selesai + Overdue Indicator */}
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800 block text-xs">
                        {estReturn}
                      </span>
                      {overdue ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200 animate-pulse">
                          ⚠️ Terlambat
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Jadwal Selesai</span>
                      )}
                    </td>

                    {/* Timestamp Serah-Terima (Penyerahan) */}
                    <td className="p-3 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                      {o.handoverTime ? (
                        <div>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {formatDateTime(o.handoverTime)}
                          </span>
                          {o.handoverPhoto && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewImageModal({
                                  url: o.handoverPhoto,
                                  title: `Foto Kondisi Serah-Terima Unit - ${o.code} (${o.customerName})`,
                                  notes: o.handoverNotes
                                })
                              }
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 font-sans font-semibold transition-colors"
                            >
                              📸 Cek Fisik Awal
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum diserahkan</span>
                      )}
                    </td>

                    {/* Timestamp Pengembalian */}
                    <td className="p-3 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                      {o.returnTime ? (
                        <div>
                          <span className="text-blue-700 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            {formatDateTime(o.returnTime)}
                          </span>
                          {o.returnPhoto && (
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewImageModal({
                                  url: o.returnPhoto,
                                  title: `Foto Kondisi Pengembalian Unit - ${o.code} (${o.customerName})`,
                                  notes: o.returnNotes
                                })
                              }
                              className="mt-1 inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 font-sans font-semibold transition-colors"
                            >
                              📸 Cek Fisik Kembali
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Belum kembali</span>
                      )}
                    </td>

                    {/* Metode Bayar & Bukti Transfer */}
                    <td className="p-3 whitespace-nowrap">
                      <span className={paymentBadge.className}>{paymentBadge.label}</span>
                      {o.paymentProof ? (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewImageModal({
                              url: o.paymentProof,
                              title: `Bukti Pembayaran / Transfer - ${o.code} (${o.customerName})`,
                              badge: paymentBadge.label
                            })
                          }
                          className="mt-1 flex items-center gap-1 text-[10px] text-brand-700 bg-brand-50 hover:bg-brand-100 px-2 py-0.5 rounded border border-brand-200 font-semibold transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat Bukti TF
                        </button>
                      ) : o.paymentMethod === 'cash' ? (
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-sans">Tunai di Tempat</span>
                      ) : (
                        <span className="block text-[10px] text-amber-600 font-medium mt-0.5 font-sans">Tanpa Bukti</span>
                      )}
                    </td>

                    {/* Total Biaya */}
                    <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                      {formatRupiah(o.totalPrice)}
                    </td>

                    {/* Progres Transaksi */}
                    <td className="p-3 whitespace-nowrap">
                      <span className={progressBadge.className}>
                        {progressBadge.label}
                      </span>
                    </td>

                    {/* Aksi Validasi Physical & Pembatalan */}
                    <td className="p-3 text-right whitespace-nowrap sticky right-0 bg-white/95 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openPickupModal(o.code)}
                          className="px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition-colors shadow-sm"
                          title="Buka Modal Serah-Terima / Validasi"
                        >
                          Validasi Physical
                        </button>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Yakin ingin membatalkan & menghapus pesanan ${o.code} (${o.customerName})?\n\nAlat ${o.itemId} (${o.itemName}) akan otomatis kembali 'Available' dan total pendapatan akan berkurang.`
                              )
                            ) {
                              cancelOrDeleteOrder(o.code);
                            }
                          }}
                          className="p-1 rounded text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                          title="Batalkan Booking & Hapus Pesanan"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Clearing Completed History */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Proteksi Cadangan &amp; Hapus Histori
              </h3>
            </div>

            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              {!hasExportedCSV ? (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-semibold space-y-1">
                  <p>⚠️ Anda belum mengunduh cadangan CSV untuk histori transaksi ini!</p>
                  <p className="text-[11px] font-normal text-red-700">
                    Sistem mewajibkan cadangan CSV diunduh sebelum histori dapat dibersihkan guna menjaga integritas pembukuan akuntansi.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
                  ✓ File cadangan CSV sudah berhasil diunduh sebelumnya.
                </div>
              )}

              <p>
                Sesuai <strong>Opsi A (Proteksi Operasional)</strong>: Hanya{' '}
                <strong>{completedCount} data pesanan yang sudah selesai (`Returned` / `Cancelled`)</strong>{' '}
                yang akan dihapus. Pesanan aktif yang sedang disewa (`On Rent`) atau dibooking (`Booked`) akan{' '}
                <strong>tetap aman disimpan</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="btn-secondary text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="btn-primary text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                {!hasExportedCSV ? 'Unduh CSV & Bersihkan Histori' : 'Ya, Bersihkan Histori Selesai'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview Foto / Bukti Pembayaran */}
      {previewImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewImageModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl border border-slate-200 animate-fade-in my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {previewImageModal.title || 'Pratinjau Foto'}
                </h4>
                {previewImageModal.badge && (
                  <span className="text-[11px] text-brand-600 font-medium">
                    Metode: {previewImageModal.badge}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center min-h-[250px] max-h-[60vh]">
              <img
                src={previewImageModal.url}
                alt={previewImageModal.title || 'Pratinjau'}
                className="max-h-[60vh] w-auto object-contain mx-auto"
              />
            </div>

            {previewImageModal.notes && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Catatan Fisik Petugas:</span>
                {previewImageModal.notes}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <a
                href={previewImageModal.url}
                download="inspeksi-layarasa.jpg"
                className="btn-secondary text-xs flex items-center gap-1.5"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Unduh Gambar
              </a>
              <button
                type="button"
                onClick={() => setPreviewImageModal(null)}
                className="btn-primary text-xs"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
