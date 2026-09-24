# LAYARASA — Digitalisasi Sistem Katalog & Penyewaan Alat Produksi Video

Aplikasi web modern berbasis **React 18 + Vite + Cloudflare D1 + Pages Functions** yang dirancang khusus untuk UMKM persewaan peralatan produksi video, sinematografi, dan multimedia **Layarasa** (berbasis di Tangerang Selatan & Jabodetabek).

Sistem ini mengimplementasikan alur operasional terintegrasi: pemisahan antarmuka pelanggan (**User Portal**) dan staf pengelola (**Admin Portal**), keranjang multi-sewa (**Multi-Item Cart**), pencegahan jadwal bentrok (**Anti-Double Booking**), validasi serah-terima fisik dengan kalkulasi denda otomatis (**WBS Poin 4 & 5**), serta sinkronisasi data *real-time* di *edge* Cloudflare dengan jaminan *zero-crash fallback* ke *LocalStorage*.

---

## 🛡️ Kebijakan Privasi & Sanitasi Data Publik

> [!NOTE]
> Seluruh nomor kontak pribadi, nomor WhatsApp pengembang, dan identitas sensitif telah **dibersihkan dan disanitasi** menggunakan *placeholder* resmi (`+62 812-3456-7890`) agar aman dipublikasikan secara terbuka di repositori GitHub publik tanpa risiko *doxxing*.
> Untuk mengubah nomor WhatsApp hotline resmi studio Anda, cukup edit variabel `WHATSAPP_NUMBER` di file [`src/data/initialOrders.js`](./src/data/initialOrders.js).

---

## 📁 Arsitektur & Struktur Direktori

Sistem telah di-*reengineer* menjadi arsitektur modular yang rapi, *scalable*, dan siap *deployment* produksi:

```
web/
├── dist/                          # Hasil build production bundle siap deploy
├── functions/                     # Cloudflare Pages Functions (Serverless Backend REST API)
│   └── api/
│       ├── init.js                # Auto-seed database D1 & inisialisasi tabel SQL
│       ├── inventory/
│       │   ├── index.js           # GET & POST data inventaris D1
│       │   └── [id].js            # PATCH status unit inventaris per ID
│       └── orders/
│           ├── index.js           # GET, POST, & DELETE histori pesanan D1
│           └── [code].js          # PATCH status, denda, & serah-terima per kode booking
├── public/                        # Aset statis favicon dan logo resmi Layarasa
├── src/
│   ├── admin/                     # MODUL STAF / OPERASIONAL ADMIN
│   │   ├── components/
│   │   │   ├── AdminFooter.jsx       # Footer khusus dashboard admin
│   │   │   ├── AdminHeader.jsx       # Header status sinkronisasi D1 & aksi cepat
│   │   │   ├── AdminKPIs.jsx         # Metrik live: unit total, available, on-rent, & omzet
│   │   │   ├── AdminNavbar.jsx       # Navigasi sticky portal staf dengan branding resmi
│   │   │   ├── InventoryTable.jsx    # Tabel manajemen status 25 aset real-time
│   │   │   ├── OrdersTable.jsx       # Tabel audit transaksi, filter tanggal, & ekspor CSV
│   │   │   └── PickupModal.jsx       # Modal serah-terima, checklist fisik, foto, & denda
│   │   └── pages/
│   │       ├── AdminDashboardPage.jsx# Halaman utama workstation operasional staf
│   │       └── AdminLoginPage.jsx    # Halaman login staf terpisah dengan autentikasi
│   ├── user/                      # MODUL PELANGGAN / PUBLIK
│   │   ├── components/
│   │   │   ├── CartDrawer.jsx        # Slide-over keranjang sewa multi-alat & subtotal
│   │   │   ├── CategoryFilters.jsx   # Filter 6 kategori peralatan & pencarian instan
│   │   │   ├── EquipmentCard.jsx     # Kartu alat, foto HD, tarif, & tombol sewa/detail
│   │   │   ├── EquipmentDetailModal.jsx # Modal spesifikasi & jadwal ketersediaan interaktif
│   │   │   ├── EquipmentGrid.jsx     # Grid katalog responsif dengan layout lega
│   │   │   ├── HeroBanner.jsx        # Banner hero sinematik & statistik operasional live
│   │   │   ├── OnRentNoticeModal.jsx # Informasi edukasi status unit yang sedang disewa
│   │   │   ├── UserFooter.jsx        # Profil UMKM, alamat studio, jam kerja, & kontak
│   │   │   └── UserHeader.jsx        # Navigasi atas publik & badge counter keranjang
│   │   └── pages/
│   │       ├── BookingPage.jsx       # Form pemesanan mandiri & upload bukti transfer
│   │       ├── CatalogPage.jsx       # Halaman utama katalog publik 25 aset
│   │       └── OrderSuccessPage.jsx  # Tampilan tiket resmi & unduh file .txt wajib
│   ├── context/
│   │   └── RentalContext.jsx      # State terpusat, polling auto-sync 8s, & logika bisnis
│   ├── data/
│   │   ├── initialInventory.js    # Data 25 aset kamera, lensa, lighting, audio, dll.
│   │   └── initialOrders.js       # Konfigurasi pesanan awal & hotline WhatsApp
│   ├── shared/
│   │   ├── utils/
│   │   │   ├── formatters.js      # Pemformat mata uang Rupiah, tanggal, & denda WBS
│   │   │   └── imageCompressor.js # Kompresi otomatis gambar/foto berbasis Canvas
│   │   ├── api.js                 # HTTP Client integrasi Cloudflare D1 & fallback logic
│   │   ├── ErrorBoundary.jsx      # Proteksi error component React (anti-blank screen)
│   │   └── Toast.jsx              # Notifikasi feedback dinamis interaktif
│   ├── App.jsx                    # Root view controller & modal portal
│   ├── index.css                  # Desain styling, gradien sinematik, & animasi micro
│   └── main.jsx                   # Entry point React 18 DOM
├── index.html                     # Entry point HTML Vite
├── package.json                   # Konfigurasi dependensi dan skrip eksekusi
├── schema.sql                     # Skema SQL D1 SQLite & 25 data seed awal inventaris
├── server.js                      # Server produksi Node.js (SPA fallback + health check)
├── vite.config.js                 # Konfigurasi build Vite + Plugin React
└── wrangler.toml                  # Konfigurasi deployment Cloudflare Pages & D1 binding
```

---

## ✨ Fitur-Fitur Unggulan Sistem

### 👤 Modul Pelanggan (User / Public Experience)
1. **Katalog 25 Unit Aset Lengkap & Transparan:**
   - Meliputi 6 kategori industri: *Kamera, Lensa, Lighting, Tripod & Stabilizer, Baterai & Power, Audio & Mic*.
   - Menyajikan tarif fleksibel untuk paket **Blok 12 Jam**, **Blok 24 Jam**, serta **Harian (1–30 Hari)**.
   - Status ketersediaan *real-time* (*Available*, *Booked*, *On Rent*, *Maintenance*).
2. **Modal Detail & Kalender Ketersediaan (Anti-Double Booking):**
   - Pelanggan dapat melihat rincian spesifikasi teknis dan mengecek slot waktu yang telah terisi agar tidak terjadi tabrakan jadwal pengambilan dan pemakaian unit.
3. **Keranjang Sewa Multi-Alat (Multi-Item Cart Drawer):**
   - Memungkinkan penyewaan beberapa jenis alat sekaligus dalam satu kali proses *checkout*.
   - Jadwal pengambilan dan paket durasi dapat diatur secara spesifik per unit alat di dalam keranjang sewa.
4. **Metode Pembayaran Fleksibel & Kompresi Foto Bukti Transfer:**
   - Mendukung **QRIS (Instan)**, **Transfer Bank** (BCA, Mandiri, BRI, BNI dilengkapi fitur *Salin Nomor Rekening*), dan **Tunai di Studio**.
   - Pelanggan dapat mengunggah bukti pembayaran yang otomatis dikompresi di sisi peramban (*client-side canvas compression*) agar hemat kuota dan cepat.
5. **Tiket Bukti Booking Resmi (.txt):**
   - Sistem mewajibkan pengunduhan tiket kode booking unik (`LAYA-2026-XXXX`) sebelum meninggalkan halaman sukses untuk menjamin pelanggan memiliki bukti pemesanan yang sah saat datang ke studio.
6. **Integrasi WhatsApp Reminder 1-Klik:**
   - Tombol konfirmasi otomatis yang merangkum rincian seluruh alat, biaya sewa, metode bayar, dan kode booking ke nomor WhatsApp resmi Layarasa.
7. **Kebijakan Jaminan Legal di Tempat:**
   - Pelanggan tidak perlu mengunggah identitas secara *online*. Cukup menyerahkan fisik KTP atau KTM asli saat serah-terima unit di studio.

---

### 🛡️ Modul Staf Admin (Operational & Accounting Management — WBS Poin 4 & 5)
1. **Portal Staf Terproteksi:**
   - Terpisah dari antarmuka publik, dilindungi formulir autentikasi kredensial login staf.
2. **Dashboard KPI & Finansial Real-Time:**
   - Menampilkan total aset inventaris, unit siap disewa (*Available*), unit sedang disewa/dipesan (*On Rent / Booked*), serta kalkulasi akumulasi pendapatan total yang otomatis terkoreksi jika pesanan dibatalkan.
3. **Dua Arah Sinkronisasi Status (Two-Way Sync):**
   - Perubahan status inventaris di tabel admin langsung memperbarui status transaksi, dan sebaliknya (serah-terima pesanan otomatis mengubah unit menjadi *On Rent*, pengembalian mengubah menjadi *Available*).
4. **Modal Validasi Serah-Terima (Physical Handover):**
   - Pencarian cepat melalui kode booking tunggal maupun kode paket rombongan (*Group Order*).
   - *Checklist* verifikasi fisik sebelum unit diserahkan: Sensor, Bodi, Aksesoris, dan Fungsi.
   - Fitur unggah foto dokumentasi fisik penyerahan (*Handover Photo*) dan catatan kondisi awal.
5. **Pengembalian & Kalkulasi Denda Otomatis (Late Fees & Damage Penalties):**
   - Menghitung denda keterlambatan secara otomatis berdasarkan durasi selisih waktu pengembalian sesuai regulasi SOP WBS:
     - **1 s/d 3 Jam:** Denda 30% dari tarif sewa 24 jam.
     - **3 s/d 6 Jam:** Denda 50% dari tarif harian.
     - **> 6 Jam / Berganti Hari:** Denda 100% penuh per hari tambahan keterlambatan.
   - Fasilitas pencatatan denda lain-lain (kerusakan fisik / kehilangan aksesoris) dan total pelunasan akhir (*Final Settlement*).
   - Unggah foto dokumentasi fisik saat pengembalian (*Return Photo*) beserta catatan inspeksi.
6. **Ekspor CSV Histori Transaksi & Penghapusan Aman (*Safe Deletion Safeguard*):**
   - Admin dapat mengunduh seluruh histori transaksi ke format CSV berstandar internasional (*UTF-8 BOM*) yang siap dibuka di Microsoft Excel.
   - Fitur hapus pesanan selesai dilengkapi pengaman: admin **diwajibkan** mengunduh file cadangan CSV terlebih dahulu sebelum sistem mengizinkan pembersihan data selesai.
7. **Pembatalan & Koreksi Pesanan:**
   - Pembatalan transaksi seketika mengembalikan status alat ke *Available* dan menyesuaikan pencatatan pendapatan total di dashboard.

---

### ☁️ Sinkronisasi Cloud & Arsitektur Edge
1. **Cloudflare D1 Database (SQLite Edge):**
   - Menggunakan basis data terdistribusi di seluruh dunia dengan latensi sangat rendah via Cloudflare Pages Functions.
2. **Background Auto-Sync Engine:**
   - Melakukan sinkronisasi otomatis setiap 8 detik serta saat jendela peramban kembali aktif (*window focus / visibility change*), menjamin staf di lapangan (menggunakan ponsel) dan admin di meja kasir (menggunakan laptop) selalu melihat data terbaru.
3. **Zero-Crash / Offline-First Fallback:**
   - Jika koneksi Cloudflare D1 belum dikonfigurasi atau sedang luring, aplikasi secara transparan beralih ke penyimpanan lokal (*LocalStorage*), menjamin sistem tidak akan pernah mengalami layar putih (*blank screen*).

---

## 🚀 Panduan Menjalankan Aplikasi Secara Lokal

### 1. Prasyarat Sistem
- **Node.js**: Versi 18.x atau lebih baru
- **NPM**: Versi 9.x atau lebih baru

### 2. Instalasi Dependensi
Buka terminal di dalam direktori `web`:
```bash
cd web
npm install
```

### 3. Menjalankan Mode Pengembangan (Development)
- **Pengguna Windows (OneDrive / Local Directory):**
  ```bash
  npm run win:dev
  ```
  *(Perintah ini memanfaatkan virtual drive `subst` untuk mengatasi batasan path esbuild pada folder OneDrive).*
- **Pengguna Linux / macOS / Non-Windows:**
  ```bash
  npm run dev
  ```
Buka di peramban: `http://localhost:3000`

### 4. Melakukan Build untuk Produksi
- **Pengguna Windows:**
  ```bash
  npm run win:build
  ```
- **Pengguna Linux / macOS / CI-CD:**
  ```bash
  npm run build
  ```
Hasil kompilasi akan tersimpan di direktori `dist/`.

### 5. Menjalankan Server Produksi Lokal (Node.js)
```bash
npm start
```
Server Node.js bawaan menyajikan bundel `dist/` di port `3000` lengkap dengan endpoint health check di `/api/health`.

---

## ☁️ Panduan Deployment ke Cloudflare Pages + Cloudflare D1

### Langkah 1: Push Repositori ke GitHub
```bash
git add .
git commit -m "feat: digitalisasi sistem persewaan layarasa production-ready"
git push origin main
```

### Langkah 2: Buat Database D1 di Dashboard Cloudflare
1. Buka dashboard [Cloudflare](https://dash.cloudflare.com/) -> Masuk ke menu **Storage & Databases** -> **D1 SQL Database**.
2. Klik tombol **Create database**.
3. Masukkan nama: `layarasa-db` -> Klik **Create**.

### Langkah 3: Sambungkan ke Cloudflare Pages
1. Pada dashboard Cloudflare, buka menu **Compute (Workers & Pages)** -> Klik **Create application** -> Tab **Pages** -> **Connect to Git**.
2. Pilih repositori GitHub Anda.
3. Konfigurasi Pengaturan Build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `web` (jika repositori utama berada di folder induk).
4. Setelah pembuatan proyek selesai, buka:
   - **Settings** -> **Functions** -> Gulir ke bagian **D1 database bindings**.
   - Klik **Add binding**:
     - **Variable name**: `DB` *(WAJIB ditulis persis huruf kapital `DB`)*
     - **D1 database**: Pilih `layarasa-db`.
   - Klik **Save**.

### Langkah 4: Inisialisasi Database (Auto-Seed 25 Unit Alat)
Pilih salah satu cara termudah berikut:
- **Cara A (Melalui Antarmuka Web - Praktis):** Buka website Anda yang sudah *live* di domain `*.pages.dev`, klik tombol **Penyimpanan Lokal (Klik Hubungkan D1)** di *header* admin, atau kunjungi langsung URL `https://domain-anda.pages.dev/api/init`. Sistem akan otomatis membuat tabel SQL dan mengisi 25 unit aset inventaris awal!
- **Cara B (Melalui Konsol Cloudflare D1):** Di Cloudflare Dashboard -> **D1** -> `layarasa-db` -> Tab **Console**, salin seluruh konten file [`schema.sql`](./schema.sql), lalu klik **Execute**.

---

## 🔑 Kredensial Akses Portal Staf Admin

- **Tautan Akses:** Buka antarmuka web, klik tautan **Portal Staf / Login Admin** di bagian sudut kanan bawah *footer*, atau akses melalui tautan hash `#admin`.
- **Username Default:** `admin`
- **Password Default:** `admin123`

---

## 📍 Informasi Studio & Kontak Layarasa

- **Nama Usaha:** Layarasa Video Rental UMKM
- **Spesialisasi:** Digitalisasi Sistem Informasi Akuntansi & Operasional Persewaan Alat Produksi Sinematografi
- **Lokasi Studio:** Jl. Kalimongso, Jurang Mangu Timur, Tangerang Selatan, Banten 15220, Indonesia
- **Jam Operasional:** Setiap Hari: 08.00 – 21.00 WIB
- **Hotline WhatsApp:** `+62 812-3456-7890` *(Dapat disesuaikan di `initialOrders.js`)*
- **Surel Resmi:** `layarasa.official@gmail.com`
- **Instagram:** `@layarasa.creative`
