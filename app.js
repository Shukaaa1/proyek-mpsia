/**
 * LAYARASA - DIGITALISASI SYSTEM KATALOG & PENYEWAAN ALAT VIDEO
 * Implementation based on Layarasa SIA Requirements (WBS Point 4 & 5)
 * Strict Antislop (Mode 1: DURING) + SewaScale Color Palette
 */

// -------------------------------------------------------------
// 1. DATA INITIALIZATION: 25 INVENTORY ASSETS (LAYARASA)
// -------------------------------------------------------------
const INITIAL_INVENTORY = [
  // KAMERA (5 items)
  { id: 'CAM-01', name: 'Sony FX3 Cinema Line', category: 'Kamera', rate12h: 350000, rate24h: 550000, status: 'Available', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', desc: 'Full-frame Cinema Line 4K 120fps, Dual Base ISO 800/12800' },
  { id: 'CAM-02', name: 'Sony A7S III Mirrorless', category: 'Kamera', rate12h: 300000, rate24h: 480000, status: 'Available', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80', desc: '12.1 MP BSI Sensor, 10-bit 4:2:2 internal, Active Stabilization' },
  { id: 'CAM-03', name: 'Sony A7 IV Hybrid', category: 'Kamera', rate12h: 250000, rate24h: 400000, status: 'Booked', image: 'https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?auto=format&fit=crop&w=400&q=80', desc: '33MP Full-frame BIONZ XR, 4K 60p 10-bit, S-Cinetone' },
  { id: 'CAM-04', name: 'Canon EOS R6 Mark II', category: 'Kamera', rate12h: 275000, rate24h: 450000, status: 'Available', image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=400&q=80', desc: '24.2 MP Full Frame, 40fps electronic shutter, 4K 60p oversampled' },
  { id: 'CAM-05', name: 'Blackmagic Pocket 6K Pro', category: 'Kamera', rate12h: 320000, rate24h: 500000, status: 'Maintenance', image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80', desc: 'Super 35 HDR sensor, Built-in ND Filters, Gen 5 Color Science' },

  // LENSA (5 items)
  { id: 'LNS-01', name: 'Sony FE 24-70mm f/2.8 GM II', category: 'Lensa', rate12h: 180000, rate24h: 300000, status: 'Available', image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80', desc: 'Lensa Zoom Standard GM II ultra-ringan & tajam' },
  { id: 'LNS-02', name: 'Sony FE 70-200mm f/2.8 GM OSS II', category: 'Lensa', rate12h: 220000, rate24h: 350000, status: 'Available', image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=400&q=80', desc: 'Telephoto Zoom GM II dengan fast AF & optical stabilization' },
  { id: 'LNS-03', name: 'Sony FE 35mm f/1.4 GM Prime', category: 'Lensa', rate12h: 130000, rate24h: 200000, status: 'Available', image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=400&q=80', desc: 'Prime lens cinematic bokeh f/1.4, ringkas untuk stabilizer' },
  { id: 'LNS-04', name: 'Sigma 18-35mm f/1.8 DC HSM Art', category: 'Lensa', rate12h: 100000, rate24h: 160000, status: 'On Rent', image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=400&q=80', desc: 'Zoom aperture konstan f/1.8 legendaris untuk film pendek' },
  { id: 'LNS-05', name: 'Canon RF 50mm f/1.2L USM', category: 'Lensa', rate12h: 170000, rate24h: 270000, status: 'Available', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', desc: 'Ultra fast prime L-series untuk pencahayaan rendah' },

  // LIGHTING (4 items)
  { id: 'LGT-01', name: 'Aputure Amaran 200d S Daylight', category: 'Lighting', rate12h: 120000, rate24h: 200000, status: 'Available', image: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?auto=format&fit=crop&w=400&q=80', desc: '200W Output Daylight 5600K Bowens Mount, Sidus Link App' },
  { id: 'LGT-02', name: 'Aputure Light Storm LS 300x Bi-Color', category: 'Lighting', rate12h: 200000, rate24h: 320000, status: 'Booked', image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=400&q=80', desc: 'Variable Bi-Color 2700K-6500K dengan wireless control' },
  { id: 'LGT-03', name: 'Godox SL60W LED Daylight Kit', category: 'Lighting', rate12h: 60000, rate24h: 100000, status: 'Available', image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=80', desc: 'Paket Studio LED 60W + Softbox 60x90 + Light Stand' },
  { id: 'LGT-04', name: 'Nanlite Pavotube II 30C RGB Tube', category: 'Lighting', rate12h: 90000, rate24h: 150000, status: 'Available', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80', desc: 'Lampu LED Tube RGBWW 4ft dengan efek pencahayaan khusus' },

  // TRIPOD & STABILIZER (4 items)
  { id: 'STB-01', name: 'DJI RS 3 Pro Gimbal Stabilizer', category: 'Tripod', rate12h: 150000, rate24h: 250000, status: 'Available', image: 'https://images.unsplash.com/photo-1589872782415-b68a5c2690b8?auto=format&fit=crop&w=400&q=80', desc: 'Automated Axis Locks, Carbon Fiber Arms, Payload 4.5kg' },
  { id: 'STB-02', name: 'DJI Ronin-S Gimbal 3-Axis', category: 'Tripod', rate12h: 90000, rate24h: 150000, status: 'Available', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80', desc: 'Handheld gimbal 3.6kg payload dengan focus wheel' },
  { id: 'STB-03', name: 'Manfrotto 504HD Fluid Head Tripod', category: 'Tripod', rate12h: 80000, rate24h: 130000, status: 'Available', image: 'https://images.unsplash.com/photo-1495745966610-2a67f229785e?auto=format&fit=crop&w=400&q=80', desc: 'Tripod Video Profesional Head Fluid licin untuk panning' },
  { id: 'STB-04', name: 'Benro KH25N Heavy Duty Video Tripod', category: 'Tripod', rate12h: 50000, rate24h: 80000, status: 'On Rent', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', desc: 'Tripod aluminium kokoh beban hingga 5kg untuk kamera film' },

  // BATERAI & POWER (3 items)
  { id: 'PWR-01', name: 'FXLion NANO TWO 98Wh V-Mount', category: 'Baterai', rate12h: 50000, rate24h: 85000, status: 'Available', image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80', desc: 'Baterai V-Mount ringkas dengan output USB-C & D-Tap' },
  { id: 'PWR-02', name: 'SmallRig V-Mount Battery 99Wh', category: 'Baterai', rate12h: 45000, rate24h: 80000, status: 'Available', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80', desc: 'Baterai kamera cinema dengan layar status OLED mAh' },
  { id: 'PWR-03', name: 'Paket Baterai NP-FZ100 Sony (4x)', category: 'Baterai', rate12h: 30000, rate24h: 50000, status: 'Available', image: 'https://images.unsplash.com/photo-1594549181132-9045fed330ce?auto=format&fit=crop&w=400&q=80', desc: 'Paket 4 unit Baterai original Sony + Dual Rapid Charger' },

  // AUDIO & MIC (4 items)
  { id: 'AUD-01', name: 'Sennheiser MKE 600 Shotgun Mic', category: 'Audio', rate12h: 90000, rate24h: 150000, status: 'Available', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80', desc: 'Shotgun Mic profesional anti-noise dengan XLR & Batterij' },
  { id: 'AUD-02', name: 'Rode Wireless GO II Dual Kit', category: 'Audio', rate12h: 100000, rate24h: 160000, status: 'Booked', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80', desc: 'Wireless Mic 2 pemancar + 1 penerima, jarak hingga 200m' },
  { id: 'AUD-03', name: 'Zoom H6 All-Black Handy Recorder', category: 'Audio', rate12h: 80000, rate24h: 130000, status: 'Available', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', desc: 'Audio Recorder 6-track dengan kapsul kapsul X/Y' },
  { id: 'AUD-04', name: 'DJI Mic 2 Wireless Transmitter', category: 'Audio', rate12h: 110000, rate24h: 180000, status: 'Available', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', desc: '32-bit Float Internal Recording + Active Noise Cancelling' }
];

// Seeded Initial Orders for Admin Demo
const INITIAL_ORDERS = [
  {
    code: 'LAYA-2026-A8K1',
    customerName: 'Veri Galih',
    phone: '081234567890',
    institution: 'PNJ (Politeknik Negeri Jakarta)',
    itemId: 'CAM-03',
    itemName: 'Sony A7 IV Hybrid',
    durationBlock: 24,
    totalPrice: 400000,
    paymentMethod: 'qris',
    status: 'Booked',
    datePickup: '2026-09-18T10:00',
    idFileAttached: 'ktm_veri_galih.png'
  },
  {
    code: 'LAYA-2026-B9L2',
    customerName: 'Atila Rafii',
    phone: '085712345678',
    institution: 'UKM Videografi Kampus',
    itemId: 'LNS-04',
    itemName: 'Sigma 18-35mm f/1.8 DC HSM Art',
    durationBlock: 12,
    totalPrice: 100000,
    paymentMethod: 'bank',
    status: 'On Rent',
    datePickup: '2026-09-17T08:00',
    idFileAttached: 'ktp_atila_rafii.jpg'
  }
];

// -------------------------------------------------------------
// 2. STATE APPLICATION CLASS
// -------------------------------------------------------------
class LayarasaApp {
  constructor() {
    this.inventory = JSON.parse(localStorage.getItem('layarasa_inventory')) || INITIAL_INVENTORY;
    this.orders = JSON.parse(localStorage.getItem('layarasa_orders')) || INITIAL_ORDERS;
    
    this.activeView = 'catalog';
    this.selectedCategory = 'all';
    this.searchQuery = '';
    
    // Booking Draft State
    this.selectedEquipment = null;
    this.selectedBlock = 24; // 12 or 24
    this.uploadedFile = null;
    this.lastOrderResult = null;

    this.init();
  }

  init() {
    this.renderCategoryFilters();
    this.renderCatalog();
    this.renderAdminInventory();
    this.renderAdminOrders();
    this.updateAdminKPIs();
    this.setupDateDefault();
  }

  saveState() {
    localStorage.setItem('layarasa_inventory', JSON.stringify(this.inventory));
    localStorage.setItem('layarasa_orders', JSON.stringify(this.orders));
    this.updateAdminKPIs();
  }

  // Navigation Switcher
  switchView(viewName) {
    this.activeView = viewName;

    // Update tab classes
    ['catalog', 'booking', 'admin'].forEach(v => {
      const btn = document.getElementById(`nav-btn-${v}`);
      const section = document.getElementById(`view-${v}`);
      if (btn && section) {
        if (v === viewName || (viewName === 'success' && v === 'booking')) {
          btn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all nav-tab-active';
        } else {
          btn.className = 'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all nav-tab-inactive';
        }
      }
    });

    // Hide all sections
    document.getElementById('view-catalog').classList.add('hidden');
    document.getElementById('view-booking').classList.add('hidden');
    document.getElementById('view-success').classList.add('hidden');
    document.getElementById('view-admin').classList.add('hidden');

    // Show selected section
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (viewName === 'admin') {
      this.renderAdminInventory();
      this.renderAdminOrders();
    }
  }

  setupDateDefault() {
    const input = document.getElementById('cust-date');
    if (input) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      input.value = now.toISOString().slice(0, 16);
    }
  }

  // -------------------------------------------------------------
  // 3. CATALOG & SEARCH LOGIC
  // -------------------------------------------------------------
  renderCategoryFilters() {
    const categories = ['all', 'Kamera', 'Lensa', 'Lighting', 'Tripod', 'Baterai', 'Audio'];
    const container = document.getElementById('category-filters');
    if (!container) return;

    container.innerHTML = categories.map(cat => {
      const isSelected = this.selectedCategory === cat;
      const label = cat === 'all' ? 'Semua Kategori (25)' : cat;
      const activeClass = isSelected
        ? 'bg-slate-900 text-white font-bold'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold';
      return `<button onclick="app.setCategory('${cat}')" class="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${activeClass}">${label}</button>`;
    }).join('');
  }

  setCategory(category) {
    this.selectedCategory = category;
    this.renderCategoryFilters();
    this.renderCatalog();
  }

  handleSearch(query) {
    this.searchQuery = query.toLowerCase().trim();
    this.renderCatalog();
  }

  resetFilters() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    this.renderCategoryFilters();
    this.renderCatalog();
  }

  renderCatalog() {
    const container = document.getElementById('equipment-grid-container');
    const emptyState = document.getElementById('catalog-empty-state');
    if (!container) return;

    const filtered = this.inventory.filter(item => {
      const matchCat = this.selectedCategory === 'all' || item.category === this.selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(this.searchQuery) ||
                          item.desc.toLowerCase().includes(this.searchQuery) ||
                          item.id.toLowerCase().includes(this.searchQuery);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    container.innerHTML = filtered.map(item => this.createEquipmentCard(item)).join('');
  }

  createEquipmentCard(item) {
    const badgeClass = {
      'Available': 'badge-available',
      'Booked': 'badge-booked',
      'On Rent': 'badge-onrent',
      'Maintenance': 'badge-maintenance'
    }[item.status] || 'badge-available';

    const statusLabel = {
      'Available': 'Ready Available',
      'Booked': 'Terbooking',
      'On Rent': 'Sedang Disewa',
      'Maintenance': 'Perawatan'
    }[item.status] || item.status;

    const isDisableBtn = item.status === 'Maintenance';
    const btnLabel = item.status === 'Available' ? 'Pesan Sekarang' : (item.status === 'Maintenance' ? 'Tidak Tersedia' : 'Pesan Jadwal');

    return `
      <div class="card overflow-hidden hover:shadow-lg transition-all border border-slate-200 flex flex-col justify-between group">
        <div>
          <!-- Thumbnail & Status Badge -->
          <div class="relative h-44 overflow-hidden bg-slate-100">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            <span class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${badgeClass}">
              ${statusLabel}
            </span>
            <span class="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-mono">
              ${item.id}
            </span>
          </div>

          <!-- Description -->
          <div class="p-4 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">${item.category}</span>
            <h3 class="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-brand-600 transition-colors">${item.name}</h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">${item.desc}</p>
          </div>
        </div>

        <!-- Pricing & Action -->
        <div class="p-4 pt-0 space-y-3 border-t border-slate-100 mt-2">
          <div class="flex items-center justify-between pt-3">
            <div>
              <span class="text-[10px] text-slate-400 block font-medium">Tarif 12 Jam</span>
              <span class="text-xs font-bold text-slate-700">Rp ${item.rate12h.toLocaleString('id-ID')}</span>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block font-medium">Tarif 24 Jam</span>
              <span class="text-sm font-black text-brand-600">Rp ${item.rate24h.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button onclick="app.selectEquipmentForBooking('${item.id}')" ${isDisableBtn ? 'disabled' : ''} class="btn-primary w-full justify-center text-xs shadow-sm">
            ${btnLabel}
          </button>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // 4. BOOKING & CHECKOUT FLOW
  // -------------------------------------------------------------
  selectEquipmentForBooking(equipmentId) {
    const item = this.inventory.find(i => i.id === equipmentId);
    if (!item) return;

    this.selectedEquipment = item;
    this.renderBookingItemSummary();
    this.updatePriceCalculation();
    this.switchView('booking');

    // Update cart badge indicator
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = '1';
      badge.classList.remove('hidden');
    }
  }

  renderBookingItemSummary() {
    const container = document.getElementById('booking-item-card');
    if (!container || !this.selectedEquipment) return;

    const item = this.selectedEquipment;
    container.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.image}" alt="${item.name}" class="w-14 h-14 rounded-xl object-cover border border-slate-200" />
        <div class="space-y-0.5">
          <span class="text-[10px] font-bold text-brand-600 block uppercase">${item.category} • ${item.id}</span>
          <h4 class="font-extrabold text-slate-900 text-xs leading-tight">${item.name}</h4>
          <span class="text-[11px] text-slate-500 block">Status: <span class="font-semibold text-emerald-600">${item.status}</span></span>
        </div>
      </div>
    `;
  }

  setBookingBlock(hours) {
    this.selectedBlock = hours;
    const btn12 = document.getElementById('block-12h-btn');
    const btn24 = document.getElementById('block-24h-btn');

    if (hours === 12) {
      btn12.className = 'p-2.5 rounded-xl border text-center transition-all border-brand-500 bg-brand-50 text-brand-800 font-bold text-xs';
      btn24.className = 'p-2.5 rounded-xl border border-slate-200 text-center transition-all hover:border-slate-300 text-slate-700 font-semibold text-xs';
    } else {
      btn24.className = 'p-2.5 rounded-xl border text-center transition-all border-brand-500 bg-brand-50 text-brand-800 font-bold text-xs';
      btn12.className = 'p-2.5 rounded-xl border border-slate-200 text-center transition-all hover:border-slate-300 text-slate-700 font-semibold text-xs';
    }

    this.updatePriceCalculation();
  }

  updatePriceCalculation() {
    if (!this.selectedEquipment) return;

    const basePrice = this.selectedBlock === 12 ? this.selectedEquipment.rate12h : this.selectedEquipment.rate24h;
    
    document.getElementById('price-base-calc').textContent = `Rp ${basePrice.toLocaleString('id-ID')}`;
    document.getElementById('price-total-calc').textContent = `Rp ${basePrice.toLocaleString('id-ID')}`;
  }

  handleFileSelect(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadedFile = file.name;
      const label = document.getElementById('file-upload-label');
      if (label) {
        label.textContent = `File Terpilih: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
        label.className = 'text-xs font-bold text-emerald-700 block';
      }
      this.showToast('Jaminan identitas berhasil diunggah.', 'success');
    }
  }

  handleBookingSubmit(e) {
    e.preventDefault();
    if (!this.selectedEquipment) {
      this.showToast('Silakan pilih alat dari katalog terlebih dahulu.', 'error');
      return;
    }

    const name = document.getElementById('cust-name').value.trim();
    const phone = document.getElementById('cust-phone').value.trim();
    const inst = document.getElementById('cust-inst').value.trim();
    const datePickup = document.getElementById('cust-date').value;
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;

    if (!name || !phone || !inst) {
      this.showToast('Lengkapi seluruh data penyewa.', 'error');
      return;
    }

    // Generate Unique Booking Code (WBS Poin 4)
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderCode = `LAYA-2026-${randomHex}`;

    const totalPrice = this.selectedBlock === 12 ? this.selectedEquipment.rate12h : this.selectedEquipment.rate24h;

    const newOrder = {
      code: orderCode,
      customerName: name,
      phone: phone,
      institution: inst,
      itemId: this.selectedEquipment.id,
      itemName: this.selectedEquipment.name,
      durationBlock: this.selectedBlock,
      totalPrice: totalPrice,
      paymentMethod: paymentMethod,
      status: 'Booked',
      datePickup: datePickup,
      idFileAttached: this.uploadedFile || 'KTP_Identitas.png'
    };

    // Save order
    this.orders.unshift(newOrder);

    // Update item status in inventory
    const itemIndex = this.inventory.findIndex(i => i.id === this.selectedEquipment.id);
    if (itemIndex !== -1) {
      this.inventory[itemIndex].status = 'Booked';
    }

    this.saveState();
    this.lastOrderResult = newOrder;

    // Show Success View
    this.renderSuccessView(newOrder);
    this.switchView('success');

    // Reset Form
    document.getElementById('booking-form').reset();
    this.setupDateDefault();
    this.showToast(`Pemesanan berhasil! Kode Unik: ${orderCode}`, 'success');
  }

  renderSuccessView(order) {
    document.getElementById('success-code-display').textContent = order.code;
    document.getElementById('success-status-tag').textContent = order.status;

    const detailsBox = document.getElementById('success-details-box');
    if (detailsBox) {
      detailsBox.innerHTML = `
        <div class="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 mb-2">
          <div>
            <span class="text-slate-400 block">Penyewa:</span>
            <span class="font-bold text-slate-800">${order.customerName} (${order.institution})</span>
          </div>
          <div>
            <span class="text-slate-400 block">WhatsApp:</span>
            <span class="font-bold text-slate-800">${order.phone}</span>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <span class="text-slate-400 block">Item Alat:</span>
            <span class="font-bold text-emerald-700">${order.itemName}</span>
          </div>
          <div>
            <span class="text-slate-400 block">Durasi & Total:</span>
            <span class="font-bold text-slate-800">Blok ${order.durationBlock} Jam (Rp ${order.totalPrice.toLocaleString('id-ID')})</span>
          </div>
        </div>
      `;
    }
  }

  sendWhatsAppReminder() {
    if (!this.lastOrderResult) return;
    const o = this.lastOrderResult;
    const msg = encodeURIComponent(
      `Halo *Layarasa Video Rental*! Saya ingin konfirmasi serah-terima booking.\n\n` +
      `*Kode Booking:* ${o.code}\n` +
      `*Nama:* ${o.customerName}\n` +
      `*Item:* ${o.itemName}\n` +
      `*Durasi:* Blok ${o.durationBlock} Jam\n` +
      `*Total Biaya:* Rp ${o.totalPrice.toLocaleString('id-ID')}\n\n` +
      `Mohon siapkan peralatan saat saya datang ke lokasi. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${msg}`, '_blank');
  }

  // -------------------------------------------------------------
  // 5. ADMIN DASHBOARD & PHYSICAL VERIFICATION (WBS POIN 4 & 5)
  // -------------------------------------------------------------
  updateAdminKPIs() {
    const total = this.inventory.length;
    const available = this.inventory.filter(i => i.status === 'Available').length;
    const onrent = this.inventory.filter(i => i.status === 'On Rent' || i.status === 'Booked').length;
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.totalPrice, 0);

    const kpiTotal = document.getElementById('admin-kpi-total');
    const kpiAvailable = document.getElementById('admin-kpi-available');
    const kpiOnrent = document.getElementById('admin-kpi-onrent');
    const kpiRevenue = document.getElementById('admin-kpi-revenue');

    if (kpiTotal) kpiTotal.textContent = `${total} Alat`;
    if (kpiAvailable) kpiAvailable.textContent = `${available}`;
    if (kpiOnrent) kpiOnrent.textContent = `${onrent}`;
    if (kpiRevenue) kpiRevenue.textContent = `Rp ${totalRevenue.toLocaleString('id-ID')}`;
  }

  renderAdminOrders() {
    const tbody = document.getElementById('admin-orders-tbody');
    const badge = document.getElementById('orders-count-badge');
    if (!tbody) return;

    if (badge) badge.textContent = `${this.orders.length} Pesanan`;

    if (this.orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4 text-slate-400">Belum ada data pemesanan.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.orders.map(o => {
      const badgeClass = o.status === 'Booked' ? 'badge-booked' : (o.status === 'On Rent' ? 'badge-onrent' : 'badge-available');
      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3 font-mono font-bold text-brand-700">${o.code}</td>
          <td class="p-3 font-semibold text-slate-800">${o.customerName}<span class="block text-[10px] text-slate-400">${o.institution}</span></td>
          <td class="p-3 font-medium text-slate-700">${o.itemName}</td>
          <td class="p-3 text-slate-600">${o.durationBlock} Jam</td>
          <td class="p-3 font-bold text-slate-900">Rp ${o.totalPrice.toLocaleString('id-ID')}</td>
          <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}">${o.status}</span></td>
          <td class="p-3 text-right">
            <button onclick="app.quickVerifyCode('${o.code}')" class="px-2.5 py-1 rounded bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800">
              Validasi Physical
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderAdminInventory(categoryFilter = 'all') {
    const tbody = document.getElementById('admin-inventory-tbody');
    if (!tbody) return;

    const filtered = this.inventory.filter(i => categoryFilter === 'all' || i.category === categoryFilter);

    tbody.innerHTML = filtered.map(i => {
      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="p-3 font-mono text-slate-500 font-bold">${i.id}</td>
          <td class="p-3 font-bold text-slate-900">${i.name}<span class="block text-[10px] text-slate-400 font-normal line-clamp-1">${i.desc}</span></td>
          <td class="p-3 text-slate-600 font-medium">${i.category}</td>
          <td class="p-3 text-slate-700">Rp ${i.rate12h.toLocaleString('id-ID')} / Rp ${i.rate24h.toLocaleString('id-ID')}</td>
          <td class="p-3">
            <select onchange="app.updateItemStatus('${i.id}', this.value)" class="input py-0.5 text-xs font-semibold">
              <option value="Available" ${i.status === 'Available' ? 'selected' : ''}>Available</option>
              <option value="Booked" ${i.status === 'Booked' ? 'selected' : ''}>Booked</option>
              <option value="On Rent" ${i.status === 'On Rent' ? 'selected' : ''}>On Rent</option>
              <option value="Maintenance" ${i.status === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
            </select>
          </td>
          <td class="p-3 text-right">
            <button onclick="app.updateItemStatus('${i.id}', 'Available')" class="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px] hover:bg-emerald-200">
              Set Ready
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  filterAdminInventory(cat) {
    this.renderAdminInventory(cat);
  }

  updateItemStatus(itemId, newStatus) {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return;

    item.status = newStatus;
    this.saveState();
    this.renderCatalog();
    this.renderAdminInventory();
    this.showToast(`Status aset ${itemId} diperbarui ke ${newStatus}`, 'success');
  }

  // Physical Pickup Verification Modal (WBS Poin 4)
  openPickupModal() {
    const modal = document.getElementById('modal-pickup');
    if (modal) modal.classList.remove('hidden');
  }

  closePickupModal() {
    const modal = document.getElementById('modal-pickup');
    if (modal) modal.classList.add('hidden');
    document.getElementById('input-verify-code').value = '';
    document.getElementById('verify-result-box').classList.add('hidden');
  }

  quickVerifyCode(code) {
    this.openPickupModal();
    const input = document.getElementById('input-verify-code');
    if (input) {
      input.value = code;
      this.verifyOrderCode();
    }
  }

  verifyOrderCode() {
    const code = document.getElementById('input-verify-code').value.trim().toUpperCase();
    const resultBox = document.getElementById('verify-result-box');
    if (!resultBox) return;

    const order = this.orders.find(o => o.code === code);
    resultBox.classList.remove('hidden');

    if (!order) {
      resultBox.innerHTML = `
        <div class="text-red-600 font-bold text-center py-2">
          Kode Booking "${code}" tidak ditemukan! Mohon periksa kembali.
        </div>
      `;
      return;
    }

    resultBox.innerHTML = `
      <div class="space-y-2">
        <div class="flex justify-between items-center border-b border-slate-200 pb-2">
          <span class="font-extrabold text-slate-900 text-sm">${order.code}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${order.status}</span>
        </div>
        <div class="text-slate-700 space-y-1">
          <p><strong>Penyewa:</strong> ${order.customerName} (${order.phone})</p>
          <p><strong>Item Disewa:</strong> ${order.itemName}</p>
          <p><strong>Dokumen Jaminan:</strong> ${order.idFileAttached} <span class="text-emerald-600 font-semibold">(Terverifikasi)</span></p>
          <p><strong>Durasi Sewa:</strong> Blok ${order.durationBlock} Jam</p>
        </div>
        <div class="pt-2 flex gap-2 border-t border-slate-200">
          <button onclick="app.executePickupTransition('${order.code}', 'On Rent')" class="btn-primary text-xs flex-1 justify-center">
            Serahkan Alat (On Rent)
          </button>
          <button onclick="app.executePickupTransition('${order.code}', 'Returned')" class="btn-secondary text-xs flex-1 justify-center">
            Selesai / Kembalikan (Available)
          </button>
        </div>
      </div>
    `;
  }

  executePickupTransition(orderCode, newOrderStatus) {
    const order = this.orders.find(o => o.code === orderCode);
    if (!order) return;

    order.status = newOrderStatus;

    // Sync inventory item status
    const item = this.inventory.find(i => i.id === order.itemId);
    if (item) {
      item.status = newOrderStatus === 'On Rent' ? 'On Rent' : 'Available';
    }

    this.saveState();
    this.renderCatalog();
    this.renderAdminOrders();
    this.renderAdminInventory();
    this.closePickupModal();

    this.showToast(`Transaksi ${orderCode} berhasil diproses ke status: ${newOrderStatus}`, 'success');
  }

  // -------------------------------------------------------------
  // 6. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-slate-900 text-white border-emerald-500' : 'bg-red-600 text-white border-red-400';

    toast.className = `p-3.5 rounded-xl border-l-4 shadow-xl text-xs font-semibold flex items-center justify-between pointer-events-auto transition-all animate-slide-up ${bgClass}`;
    toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" class="ml-2 text-slate-400 hover:text-white">&times;</button>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
}

// Global App Instance Initialization
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new LayarasaApp();
});
