import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_INVENTORY } from '../data/initialInventory';
import { INITIAL_ORDERS, WHATSAPP_NUMBER } from '../data/initialOrders';
import { calculateEstimatedReturn } from '../shared/utils/formatters';
import {
  checkAndInitD1,
  fetchRemoteInventory,
  fetchRemoteOrders,
  createRemoteOrder,
  updateRemoteOrderStatus,
  deleteRemoteOrder,
  clearRemoteOrders,
  updateRemoteItemStatus
} from '../shared/api';

const RentalContext = createContext();

export function RentalProvider({ children }) {
  // Cloudflare D1 Connection State ('checking' | 'connected' | 'offline')
  const [d1Status, setD1Status] = useState('checking');

  // Versioning key to cleanly initialize empty orders and reset phantom 'On Rent' states
  const DATA_VERSION = 'layarasa_clean_orders_v2';

  // Inventory state with localStorage persistence
  const [inventory, setInventory] = useState(() => {
    try {
      if (localStorage.getItem('layarasa_data_version') !== DATA_VERSION) {
        localStorage.setItem('layarasa_data_version', DATA_VERSION);
        localStorage.setItem('layarasa_orders', JSON.stringify([]));
        localStorage.setItem('layarasa_inventory', JSON.stringify(INITIAL_INVENTORY));
        return INITIAL_INVENTORY;
      }
      const saved = localStorage.getItem('layarasa_inventory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          return parsed;
        }
      }
      return INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  // Orders state with localStorage persistence (defaults to empty array [])
  const [orders, setOrders] = useState(() => {
    try {
      if (localStorage.getItem('layarasa_data_version') !== DATA_VERSION) {
        return [];
      }
      const saved = localStorage.getItem('layarasa_orders');
      const baseOrders = saved ? JSON.parse(saved) : [];
      if (Array.isArray(baseOrders)) {
        return baseOrders.map((o) => ({
          ...o,
          estimatedReturnTime: o.estimatedReturnTime || calculateEstimatedReturn(o.datePickup, o.durationBlock || 24),
          handoverTime: o.handoverTime || (o.status === 'On Rent' || o.status === 'Returned' ? o.datePickup : null),
          returnTime: o.returnTime || (o.status === 'Returned' ? calculateEstimatedReturn(o.datePickup, o.durationBlock || 24) : null)
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('layarasa_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Navigation & View state (synchronized with URL hash)
  const [activeView, setActiveView] = useState(() => {
    try {
      const hash = (window.location.hash || '').replace('#', '').trim();
      if (['catalog', 'booking', 'success', 'admin-login', 'admin'].includes(hash)) {
        return hash;
      }
    } catch {}
    return 'catalog';
  });

  // Filter & Search state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Draft state
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState('24h'); // '12h', '24h', 'daily'
  const setBookingPackage = setSelectedPackage; // Alias for consumer components
  const [dailyDays, setDailyDays] = useState(1);
  const [lastOrderResult, setLastOrderResult] = useState(null);
  const [hasDownloadedBookingCode, setHasDownloadedBookingCode] = useState(false);

  // Toast Notification state
  const [toasts, setToasts] = useState([]);

  // Physical Pickup Modal state
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [pickupVerifyCode, setPickupVerifyCode] = useState('');
  const [pickupVerifyResult, setPickupVerifyResult] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = (window.location.hash || '').replace('#', '').trim();
        if (hash === 'admin' && !isAdminLoggedIn) {
          setActiveView('admin-login');
        } else if (['catalog', 'booking', 'success', 'admin-login', 'admin'].includes(hash)) {
          setActiveView(hash);
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminLoggedIn]);

  // D1 Database Auto-Initialization & Remote Sync
  const refreshFromD1 = async (showNotification = false) => {
    try {
      const initResult = await checkAndInitD1();
      if (initResult.connected) {
        setD1Status('connected');
        const [remoteInv, remoteOrd] = await Promise.all([
          fetchRemoteInventory(),
          fetchRemoteOrders()
        ]);
        if (remoteInv && Array.isArray(remoteInv) && remoteInv.length > 0) {
          setInventory(remoteInv);
        }
        if (remoteOrd && Array.isArray(remoteOrd)) {
          setOrders(remoteOrd);
        }
        if (showNotification) {
          showToast('Database Cloudflare D1 tersinkronisasi!', 'success');
        }
        return true;
      } else {
        setD1Status('offline');
        if (showNotification) {
          showToast('Cloudflare D1 belum aktif. Menggunakan penyimpanan lokal.', 'info');
        }
        return false;
      }
    } catch {
      setD1Status('offline');
      return false;
    }
  };

  useEffect(() => {
    refreshFromD1(false);

    // Auto-sync polling setiap 8 detik agar HP dan Laptop selalu sinkron otomatis
    const interval = setInterval(() => {
      refreshFromD1(false);
    }, 8000);

    const handleFocus = () => {
      refreshFromD1(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshFromD1(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Sync inventory & orders to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('layarasa_inventory', JSON.stringify(inventory));
    } catch (e) {
      console.warn('Gagal menyimpan inventaris ke localStorage:', e);
    }
  }, [inventory]);

  useEffect(() => {
    try {
      localStorage.setItem('layarasa_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Gagal menyimpan pesanan ke localStorage:', e);
    }
  }, [orders]);

  // Automatic consistency check: Never let an inventory item be 'On Rent' or 'Booked'
  // if there is no active order corresponding to it in orders!
  useEffect(() => {
    setInventory((prevInventory) => {
      let hasChanges = false;
      const reconciled = prevInventory.map((item) => {
        if (item.status === 'On Rent' || item.status === 'Booked') {
          const matchingActiveOrder = orders.find(
            (o) => o.itemId === item.id && (o.status === 'On Rent' || o.status === 'Booked')
          );
          if (!matchingActiveOrder) {
            hasChanges = true;
            return { ...item, status: 'Available' };
          } else if (item.status !== matchingActiveOrder.status) {
            hasChanges = true;
            return { ...item, status: matchingActiveOrder.status };
          }
        }
        return item;
      });
      return hasChanges ? reconciled : prevInventory;
    });
  }, [orders]);

  // Toast functions
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View switcher with protection for admin view & mandatory booking pass download
  const switchView = (viewName) => {
    // Constraint: User must download booking pass before leaving success view
    if (activeView === 'success' && lastOrderResult && !hasDownloadedBookingCode && viewName !== 'success') {
      showToast('Wajib mengunduh Tiket / Kode Booking unik Anda terlebih dahulu sebelum berpindah halaman!', 'error');
      return false;
    }
    if (viewName === 'admin' && !isAdminLoggedIn) {
      viewName = 'admin-login';
    }
    setActiveView(viewName);
    try {
      window.location.hash = viewName;
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  // Admin Auth Handlers
  const loginAdmin = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem('layarasa_admin_auth', 'true');
      } catch {}
      showToast('Login Admin berhasil! Selamat datang di Dashboard.', 'success');
      switchView('admin');
      return true;
    } else {
      showToast('Username atau password admin salah!', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('layarasa_admin_auth');
    } catch {}
    showToast('Anda telah logout dari Portal Admin.', 'info');
    switchView('catalog');
  };

  // Catalog Handlers
  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Booking Flow
  const selectEquipmentForBooking = (equipmentId) => {
    const item = inventory.find((i) => i.id === equipmentId);
    if (!item) return;

    setSelectedEquipment(item);
    setSelectedPackage('24h');
    setDailyDays(1);
    switchView('booking');
  };

  const adjustDailyDays = (delta) => {
    setDailyDays((prev) => Math.max(1, Math.min(30, prev + delta)));
  };

  // On-Rent Notice Modal state (for customers clicking on-rent items)
  const [onRentNoticeItem, setOnRentNoticeItem] = useState(null);
  const openOnRentModal = (item) => setOnRentNoticeItem(item);
  const closeOnRentModal = () => setOnRentNoticeItem(null);

  // CSV Export Tracking for Safe History Deletion
  const [hasExportedCSV, setHasExportedCSV] = useState(false);

  // Create Order with Estimated Completion & Two-way Inventory Sync
  const createOrder = ({ customerName, phone, institution, datePickup, paymentMethod, paymentProof = null }) => {
    if (!selectedEquipment) {
      showToast('Silakan pilih alat dari katalog terlebih dahulu.', 'error');
      return false;
    }

    if (!customerName || !phone || !institution) {
      showToast('Lengkapi seluruh data penyewa.', 'error');
      return false;
    }

    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `LAYA-2026-${randomHex}`;

    let totalPrice = 0;
    let durationText = '';
    let durationHours = 24;

    if (selectedPackage === '12h') {
      totalPrice = selectedEquipment.rate12h;
      durationText = 'Blok 12 Jam';
      durationHours = 12;
    } else if (selectedPackage === '24h') {
      totalPrice = selectedEquipment.rate24h;
      durationText = 'Blok 24 Jam (1 Hari)';
      durationHours = 24;
    } else if (selectedPackage === 'daily') {
      totalPrice = selectedEquipment.rate24h * dailyDays;
      durationText = `${dailyDays} Hari (${dailyDays * 24} Jam)`;
      durationHours = dailyDays * 24;
    }

    const estimatedReturnTime = calculateEstimatedReturn(datePickup, durationHours);

    const newOrder = {
      code: orderCode,
      customerName,
      phone,
      institution,
      itemId: selectedEquipment.id,
      itemName: selectedEquipment.name,
      packageType: selectedPackage,
      durationDays: selectedPackage === 'daily' ? dailyDays : (selectedPackage === '24h' ? 1 : 0.5),
      durationBlock: durationHours,
      durationText,
      totalPrice,
      paymentMethod: paymentMethod || 'qris',
      status: 'Booked',
      datePickup,
      estimatedReturnTime,
      handoverTime: null,
      returnTime: null,
      guaranteeType: 'KTP/KTM Asli (Fisik di Lokasi)',
      paymentProof: paymentProof || null,
      handoverPhoto: null,
      handoverNotes: null,
      returnPhoto: null,
      returnNotes: null
    };

    // Update orders state
    setOrders((prev) => [newOrder, ...prev]);

    // Two-way synchronization: update inventory asset status to Booked
    setInventory((prev) =>
      prev.map((item) =>
        item.id === selectedEquipment.id ? { ...item, status: 'Booked' } : item
      )
    );

    // Sync ke Cloudflare D1 secara background
    createRemoteOrder(newOrder);

    setLastOrderResult(newOrder);
    setHasDownloadedBookingCode(false);
    setActiveView('success');
    try {
      window.location.hash = 'success';
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Pemesanan berhasil dicatat! Kode Unik: ${orderCode}`, 'success');
    return true;
  };

  const sendWhatsAppReminder = () => {
    if (!lastOrderResult) return;
    const o = lastOrderResult;
    const durasi = o.durationText || `${o.durationBlock} Jam`;
    const msg = encodeURIComponent(
      `Halo *Layarasa Video Rental*! Saya ingin konfirmasi serah-terima booking.\n\n` +
      `*Kode Booking:* ${o.code}\n` +
      `*Nama:* ${o.customerName} (${o.institution})\n` +
      `*Item:* ${o.itemName} (${o.itemId})\n` +
      `*Durasi Sewa:* ${durasi}\n` +
      `*Metode Bayar:* ${(o.paymentMethod || 'qris').toUpperCase()}\n` +
      `*Total Biaya:* Rp ${Number(o.totalPrice).toLocaleString('id-ID')}\n` +
      `*Jaminan:* KTP/KTM Asli Fisik\n\n` +
      `Mohon konfirmasi kesiapan alat saat saya datang ke studio. Terima kasih!`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  // Download Unique Booking Ticket as official .txt pass
  const downloadBookingTicket = (customOrder = null) => {
    const o = customOrder || lastOrderResult;
    if (!o) return false;

    const durasi = o.durationText || `${o.durationBlock || 24} Jam`;
    const datePickupStr = o.datePickup ? o.datePickup.replace('T', ' ') : '-';
    const estReturnStr = o.estimatedReturnTime || '-';
    const formattedPrice = `Rp ${Number(o.totalPrice || 0).toLocaleString('id-ID')}`;

    const ticketContent = `================================================================
           LAYARASA RENTAL SINEMATOGRAFI & MULTIMEDIA
                BUKTI RESMI TIKET & KODE BOOKING UNIK
================================================================
KODE BOOKING UNIK   : ${o.code}
STATUS PESANAN      : MENUNGGU SERAH-TERIMA FISIK (BOOKED)
WAKTU BOOKING       : ${new Date().toLocaleString('id-ID')}
----------------------------------------------------------------
INFORMASI PENYEWA:
Nama Lengkap        : ${o.customerName}
Nomor WhatsApp      : ${o.phone}
Instansi / Kampus   : ${o.institution || '-'}
----------------------------------------------------------------
RINCIAN ALAT & OPERASIONAL:
Kode Aset           : ${o.itemId}
Nama Peralatan      : ${o.itemName}
Paket Durasi Sewa   : ${durasi}
Jadwal Pengambilan  : ${datePickupStr} WIB
Estimasi Selesai    : ${estReturnStr}
Metode Pembayaran   : ${(o.paymentMethod || 'QRIS').toUpperCase()}
Total Biaya Sewa    : ${formattedPrice}
----------------------------------------------------------------
SYARAT & KETENTUAN PENGAMBILAN UNIT DI LOKASI:
1. Tunjukkan file Tiket / Kode Booking unik ini kepada staf Layarasa.
2. WAJIB menyerahkan FISIK KTP atau KTM Asli sebagai jaminan legal.
3. Lakukan pengecekan fisik fungsi sensor, optik, baterai, dan bodi 
   bersama staf sebelum serah-terima unit (handover).
4. Keterlambatan pengembalian tanpa konfirmasi dikenakan denda per jam.
----------------------------------------------------------------
KONTAK & LOKASI STUDIO:
WhatsApp Hotline    : +62 831-9910-3034
Alamat Studio       : Jl. Sinema Kreatif No. 12, Jakarta Selatan
Website             : Layarasa System Rental
================================================================
Harap simpan file ini dengan baik sebagai bukti pemesanan yang sah.
`;

    const blob = new Blob([ticketContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tiket_Booking_${o.code}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setHasDownloadedBookingCode(true);
    showToast(`Tiket Booking ${o.code} berhasil diunduh! Silakan simpan sebagai bukti fisik.`, 'success');
    return true;
  };

  // Export Orders to CSV with full operational trail
  const exportOrdersToCSV = () => {
    if (!orders || orders.length === 0) {
      showToast('Tidak ada histori pesanan untuk diekspor.', 'error');
      return false;
    }

    const headers = [
      'Tanggal Booking',
      'Kode Booking',
      'Nama Penyewa',
      'No WhatsApp',
      'Instansi / Kampus',
      'Kode Asset',
      'Nama Alat',
      'Durasi Sewa',
      'Estimasi Selesai',
      'Timestamp Penyerahan (Serah-Terima)',
      'Timestamp Pengembalian',
      'Metode Pembayaran',
      'Total Biaya (Rp)',
      'Status Progres',
      'Jaminan Fisik'
    ];

    const rows = orders.map((o) => {
      const methodLabel = {
        qris: 'QRIS',
        bank: 'Transfer Bank',
        cash: 'Tunai (Cash)'
      }[o.paymentMethod] || o.paymentMethod || 'QRIS';

      const durasi = o.durationText || `${o.durationBlock || 24} Jam`;
      const dateFormatted = o.datePickup ? o.datePickup.replace('T', ' ') : '-';
      const estReturn = o.estimatedReturnTime || calculateEstimatedReturn(o.datePickup, o.durationBlock || 24);
      const handover = o.handoverTime ? o.handoverTime.replace('T', ' ') : '-';
      const returned = o.returnTime ? o.returnTime.replace('T', ' ') : '-';
      const progress = o.status === 'Returned' ? 'Selesai' : (o.status === 'On Rent' ? 'Sedang Disewa (Proses)' : 'Menunggu Serah-Terima');

      return [
        `"${dateFormatted}"`,
        `"${o.code}"`,
        `"${(o.customerName || '').replace(/"/g, '""')}"`,
        `"${(o.phone || '').replace(/"/g, '""')}"`,
        `"${(o.institution || '').replace(/"/g, '""')}"`,
        `"${o.itemId || ''}"`,
        `"${(o.itemName || '').replace(/"/g, '""')}"`,
        `"${durasi}"`,
        `"${estReturn}"`,
        `"${handover}"`,
        `"${returned}"`,
        `"${methodLabel}"`,
        o.totalPrice || 0,
        `"${progress}"`,
        `"${o.guaranteeType || 'KTP/KTM Asli di Lokasi'}"`
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `histori_pemesanan_layarasa_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setHasExportedCSV(true);
    showToast('File CSV histori berhasil diunduh! Cadangan siap.', 'success');
    return true;
  };

  // Safe History Deletion (Opsi A: Hapus pesanan selesai setelah unduh CSV)
  const clearCompletedOrdersHistory = () => {
    if (!hasExportedCSV) {
      showToast('Unduh file CSV cadangan terlebih dahulu sebelum menghapus histori!', 'error');
      return false;
    }

    const completedOrders = orders.filter((o) => o.status === 'Returned' || o.status === 'Cancelled');
    if (completedOrders.length === 0) {
      showToast('Tidak ada histori pesanan yang sudah selesai untuk dihapus.', 'info');
      return false;
    }

    // Preserve active orders (On Rent & Booked)
    setOrders((prev) => prev.filter((o) => o.status === 'On Rent' || o.status === 'Booked'));
    clearRemoteOrders('completed');
    showToast(`${completedOrders.length} data histori pesanan selesai berhasil dibersihkan. Pesanan aktif tetap aman.`, 'success');
    return true;
  };

  // Inventory Management with Two-Way Synchronization to Orders
  const updateItemStatus = (itemId, newStatus) => {
    // 1. Update Inventory item status
    setInventory((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );

    // 2. Synchronize active orders for this item
    const nowISO = new Date().toISOString();
    if (newStatus === 'Available') {
      // If item is set to Available, any On Rent / Booked order for this item is marked Returned
      setOrders((prev) =>
        prev.map((o) => {
          if (o.itemId === itemId && (o.status === 'On Rent' || o.status === 'Booked')) {
            return {
              ...o,
              status: 'Returned',
              returnTime: o.returnTime || nowISO
            };
          }
          return o;
        })
      );
    } else if (newStatus === 'On Rent') {
      // If item is set to On Rent, mark the latest Booked order as On Rent with handover timestamp
      setOrders((prev) => {
        let matched = false;
        return prev.map((o) => {
          if (!matched && o.itemId === itemId && o.status === 'Booked') {
            matched = true;
            return {
              ...o,
              status: 'On Rent',
              handoverTime: o.handoverTime || nowISO
            };
          }
          return o;
        });
      });
    }

    // Sync ke Cloudflare D1
    updateRemoteItemStatus(itemId, newStatus);
    showToast(`Status aset ${itemId} disinkronkan ke ${newStatus}`, 'success');
  };

  // Physical Pickup Verification Modal
  const openPickupModal = (code = '') => {
    setIsPickupModalOpen(true);
    setPickupVerifyCode(code);
    if (code) {
      verifyOrderCode(code);
    } else {
      setPickupVerifyResult(null);
    }
  };

  const closePickupModal = () => {
    setIsPickupModalOpen(false);
    setPickupVerifyCode('');
    setPickupVerifyResult(null);
  };

  const verifyOrderCode = (codeToVerify) => {
    const code = (codeToVerify || pickupVerifyCode).trim().toUpperCase();
    if (!code) return;

    const order = orders.find((o) => o.code === code);
    if (order) {
      setPickupVerifyResult({ found: true, order });
    } else {
      setPickupVerifyResult({ found: false, code });
    }
  };

  // Physical Transition Execution with Timestamps & Inventory Synchronization
  const executePickupTransition = (orderCode, newOrderStatus, transitionData = {}) => {
    const order = orders.find((o) => o.code === orderCode);
    if (!order) return;

    const nowISO = new Date().toISOString();
    let updatedHandover = order.handoverTime;
    let updatedReturn = order.returnTime;
    let updatedHandoverPhoto = order.handoverPhoto || null;
    let updatedHandoverNotes = order.handoverNotes || null;
    let updatedReturnPhoto = order.returnPhoto || null;
    let updatedReturnNotes = order.returnNotes || null;

    if (newOrderStatus === 'On Rent') {
      updatedHandover = updatedHandover || nowISO;
      if (transitionData.handoverPhoto) updatedHandoverPhoto = transitionData.handoverPhoto;
      if (transitionData.handoverNotes) updatedHandoverNotes = transitionData.handoverNotes;
    } else if (newOrderStatus === 'Returned') {
      updatedReturn = updatedReturn || nowISO;
      if (transitionData.returnPhoto) updatedReturnPhoto = transitionData.returnPhoto;
      if (transitionData.returnNotes) updatedReturnNotes = transitionData.returnNotes;
    }

    // Update order status & timestamps & condition photos
    setOrders((prev) =>
      prev.map((o) =>
        o.code === orderCode
          ? {
              ...o,
              status: newOrderStatus,
              handoverTime: updatedHandover,
              returnTime: updatedReturn,
              handoverPhoto: updatedHandoverPhoto,
              handoverNotes: updatedHandoverNotes,
              returnPhoto: updatedReturnPhoto,
              returnNotes: updatedReturnNotes
            }
          : o
      )
    );

    // Two-Way Sync: Update corresponding inventory item status
    const newInventoryStatus = newOrderStatus === 'On Rent' ? 'On Rent' : 'Available';
    setInventory((prev) =>
      prev.map((item) =>
        item.id === order.itemId ? { ...item, status: newInventoryStatus } : item
      )
    );

    // Sync ke Cloudflare D1
    updateRemoteOrderStatus(orderCode, {
      status: newOrderStatus,
      handoverTime: updatedHandover,
      returnTime: updatedReturn,
      handoverPhoto: updatedHandoverPhoto,
      handoverNotes: updatedHandoverNotes,
      returnPhoto: updatedReturnPhoto,
      returnNotes: updatedReturnNotes
    });

    closePickupModal();
    showToast(`Transaksi ${orderCode} berhasil diproses ke status: ${newOrderStatus}`, 'success');
  };

  // Cancel or Delete Order (when customer cancels booking / order is revoked)
  const cancelOrDeleteOrder = (orderCode) => {
    const order = orders.find((o) => o.code === orderCode);
    if (!order) return false;

    // 1. Remove order from orders array -> total revenue decreases immediately
    setOrders((prev) => prev.filter((o) => o.code !== orderCode));

    // 2. Reset associated inventory asset status back to 'Available' (unless under maintenance)
    setInventory((prev) =>
      prev.map((item) =>
        item.id === order.itemId && item.status !== 'Maintenance'
          ? { ...item, status: 'Available' }
          : item
      )
    );

    // Sync pembatalan ke Cloudflare D1
    deleteRemoteOrder(orderCode);

    closePickupModal();
    showToast(
      `Pesanan ${orderCode} dibatalkan & dihapus. Aset ${order.itemId} kembali Available. Pendapatan total disesuaikan.`,
      'info'
    );
    return true;
  };

  // Reset/Empty all orders and restore inventory to Available
  const resetAllOrdersToEmpty = () => {
    setOrders([]);
    setInventory(
      INITIAL_INVENTORY.map((item) =>
        item.status === 'Maintenance' ? item : { ...item, status: 'Available' }
      )
    );
    try {
      localStorage.setItem('layarasa_orders', JSON.stringify([]));
      localStorage.setItem('layarasa_inventory', JSON.stringify(INITIAL_INVENTORY));
    } catch {}
    // Sync reset ke Cloudflare D1
    clearRemoteOrders('all');
    closePickupModal();
    showToast('Daftar pemesanan berhasil dikosongkan. Seluruh inventaris kembali Available.', 'success');
  };

  return (
    <RentalContext.Provider
      value={{
        inventory,
        orders,
        isAdminLoggedIn,
        activeView,
        selectedCategory,
        searchQuery,
        selectedEquipment,
        selectedPackage,
        dailyDays,
        lastOrderResult,
        toasts,
        isPickupModalOpen,
        pickupVerifyCode,
        pickupVerifyResult,
        onRentNoticeItem,
        hasExportedCSV,
        showToast,
        dismissToast,
        switchView,
        loginAdmin,
        logoutAdmin,
        setSelectedCategory,
        setSearchQuery,
        resetFilters,
        selectEquipmentForBooking,
        setBookingPackage,
        adjustDailyDays,
        createOrder,
        sendWhatsAppReminder,
        exportOrdersToCSV,
        clearCompletedOrdersHistory,
        updateItemStatus,
        openPickupModal,
        closePickupModal,
        setPickupVerifyCode,
        verifyOrderCode,
        executePickupTransition,
        cancelOrDeleteOrder,
        resetAllOrdersToEmpty,
        hasDownloadedBookingCode,
        setHasDownloadedBookingCode,
        downloadBookingTicket,
        openOnRentModal,
        closeOnRentModal,
        d1Status,
        refreshFromD1
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  const context = useContext(RentalContext);
  if (!context) {
    throw new Error('useRental must be used within a RentalProvider');
  }
  return context;
}
