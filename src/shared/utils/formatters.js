export function formatRupiah(num) {
  if (num === undefined || num === null || isNaN(num)) return 'Rp 0';
  return `Rp ${Number(num).toLocaleString('id-ID')}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return dateStr.replace('T', ' ');
}

export function getPaymentLabel(method) {
  const labels = {
    qris: 'QRIS (Instant)',
    bank: 'Transfer Bank (BCA/Mandiri)',
    cash: 'Tunai (Bayar di Studio)'
  };
  return labels[method] || method?.toUpperCase() || 'QRIS';
}

export function getPaymentBadgeInfo(method) {
  switch (method) {
    case 'qris':
      return {
        label: 'QRIS',
        className: 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200'
      };
    case 'bank':
      return {
        label: 'Transfer',
        className: 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200'
      };
    case 'cash':
      return {
        label: 'Tunai',
        className: 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200'
      };
    default:
      return {
        label: (method || 'QRIS').toUpperCase(),
        className: 'px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase'
      };
  }
}

export function getStatusLabel(status) {
  const map = {
    'Available': 'Tersedia',
    'Booked': 'Terbooking',
    'On Rent': 'Sedang Disewa',
    'Maintenance': 'Perawatan',
    'Returned': 'Selesai / Dikembalikan'
  };
  return map[status] || status;
}

export function getStatusBadgeClass(status) {
  const map = {
    'Available': 'badge-available',
    'Booked': 'badge-booked',
    'On Rent': 'badge-onrent',
    'Maintenance': 'badge-maintenance',
    'Returned': 'badge-available'
  };
  return map[status] || 'badge-available';
}

export function calculateEstimatedReturn(datePickupStr, durationHours = 24) {
  if (!datePickupStr) return '-';
  try {
    const pickupDate = new Date(datePickupStr);
    if (isNaN(pickupDate.getTime())) return '-';
    const hours = Number(durationHours) || 24;
    const returnDate = new Date(pickupDate.getTime() + hours * 60 * 60 * 1000);
    
    // Format YYYY-MM-DD HH:mm
    const year = returnDate.getFullYear();
    const month = String(returnDate.getMonth() + 1).padStart(2, '0');
    const day = String(returnDate.getDate()).padStart(2, '0');
    const h = String(returnDate.getHours()).padStart(2, '0');
    const m = String(returnDate.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${h}:${m}`;
  } catch {
    return '-';
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.replace('T', ' ');
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()] || '';
    const year = d.getFullYear();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year}, ${h}:${m} WIB`;
  } catch {
    return dateStr.replace('T', ' ');
  }
}

export function isOverdue(estimatedDateStr, status) {
  if (status !== 'On Rent' || !estimatedDateStr || estimatedDateStr === '-') return false;
  try {
    const estTime = new Date(estimatedDateStr).getTime();
    if (isNaN(estTime)) return false;
    return estTime < Date.now();
  } catch {
    return false;
  }
}

export function getProgressBadgeInfo(status) {
  switch (status) {
    case 'Returned':
      return {
        label: 'Selesai',
        className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300'
      };
    case 'On Rent':
      return {
        label: 'Proses (Disewa)',
        className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300'
      };
    case 'Booked':
      return {
        label: 'Proses (Booking)',
        className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300'
      };
    default:
      return {
        label: status || 'Proses',
        className: 'px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300'
      };
  }
}

/**
 * Validasi apakah dua rentang waktu sewa bertabrakan (Anti-Double Booking)
 */
export function isTimeSlotOverlapping(startA, endA, startB, endB) {
  try {
    const sA = new Date(startA).getTime();
    const eA = new Date(endA).getTime();
    const sB = new Date(startB).getTime();
    const eB = new Date(endB).getTime();

    if (isNaN(sA) || isNaN(eA) || isNaN(sB) || isNaN(eB)) return false;
    return Math.max(sA, sB) < Math.min(eA, eB);
  } catch {
    return false;
  }
}

/**
 * Menghitung denda keterlambatan pengembalian unit berdasarkan aturan:
 * - < 1 jam: Masa toleransi (Rp 0)
 * - 1 s/d 3 jam: 30% dari tarif sewa 24 jam
 * - > 3 s/d 6 jam: 50% dari tarif sewa harian (24 jam)
 * - > 6 jam atau berganti hari: 100% penuh (dihitung 1 hari sewa tambahan per kelipatan 24 jam)
 */
export function calculateLateFee(estimatedReturnStr, actualReturnTime = null, rate24h = 0) {
  if (!estimatedReturnStr || estimatedReturnStr === '-') {
    return { isLate: false, lateHours: 0, lateMinutes: 0, percent: 0, fee: 0, desc: 'Tepat waktu' };
  }

  try {
    const estTime = new Date(estimatedReturnStr.replace(' ', 'T')).getTime();
    const actualTime = actualReturnTime
      ? new Date(actualReturnTime).getTime()
      : Date.now();

    if (isNaN(estTime) || isNaN(actualTime)) {
      return { isLate: false, lateHours: 0, lateMinutes: 0, percent: 0, fee: 0, desc: 'Waktu tidak valid' };
    }

    const diffMs = actualTime - estTime;
    if (diffMs <= 0) {
      return { isLate: false, lateHours: 0, lateMinutes: 0, percent: 0, fee: 0, desc: 'Tepat waktu (Sebelum batas selesai)' };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hoursDecimal = diffMs / (1000 * 60 * 60);
    const lateHours = Math.floor(hoursDecimal);
    const lateMinutes = totalMinutes % 60;
    const baseRate = Number(rate24h) || 0;

    // Aturan 1: Toleransi di bawah 1 jam
    if (hoursDecimal < 1) {
      return {
        isLate: true,
        isGracePeriod: true,
        lateHours,
        lateMinutes,
        percent: 0,
        fee: 0,
        desc: `Masa toleransi keterlambatan (${totalMinutes} menit)`
      };
    }

    // Aturan 2: 1-3 jam -> 30% dari tarif sewa 24 jam
    if (hoursDecimal <= 3) {
      const fee = Math.round(baseRate * 0.3);
      return {
        isLate: true,
        isGracePeriod: false,
        lateHours,
        lateMinutes,
        percent: 30,
        fee,
        desc: `Keterlambatan 1–3 Jam (Denda 30% tarif 24 jam)`
      };
    }

    // Aturan 3: 3-6 jam -> 50% dari tarif sewa harian
    if (hoursDecimal <= 6) {
      const fee = Math.round(baseRate * 0.5);
      return {
        isLate: true,
        isGracePeriod: false,
        lateHours,
        lateMinutes,
        percent: 50,
        fee,
        desc: `Keterlambatan 3–6 Jam (Denda 50% tarif harian)`
      };
    }

    // Aturan 4: > 6 jam atau berganti hari -> 100% penuh (1 hari tambahan per kelipatan 24 jam)
    const daysExtra = Math.max(1, Math.ceil(hoursDecimal / 24));
    const fee = baseRate * daysExtra;
    return {
      isLate: true,
      isGracePeriod: false,
      lateHours,
      lateMinutes,
      percent: 100 * daysExtra,
      fee,
      desc: `Keterlambatan >6 Jam / Berganti Hari (Denda ${daysExtra}x hari sewa penuh)`
    };
  } catch {
    return { isLate: false, lateHours: 0, lateMinutes: 0, percent: 0, fee: 0, desc: 'Perhitungan gagal' };
  }
}


