# LAYARASA — Digitalisasi Sistem Katalog & Penyewaan Alat Produksi Video

Aplikasi web modern berbasis **React 18 + Vite + Node.js** untuk UMKM rental alat produksi video Layarasa (berbasis di Kukusan, Beji, Kota Depok).

---

## 📁 Arsitektur & Struktur Direktori

Sistem telah di-*reengineer* menjadi struktur modular yang rapi dan siap dideploy (*production-ready*), memisahkan modul **User** (pelanggan publik) dan modul **Admin** (staf pengelola):

```
web/
├── dist/                      # Hasil build production siap deploy
├── src/
│   ├── admin/                 # MODUL STAF / ADMIN
│   │   ├── components/
│   │   │   ├── AdminHeader.jsx       # Header portal admin & tombol aksi
│   │   │   ├── AdminKPIs.jsx         # Metrik inventaris & pendapatan total
│   │   │   ├── InventoryTable.jsx    # Manajemen status 25 aset inventaris
│   │   │   ├── OrdersTable.jsx       # Riwayat transaksi & unduh CSV
│   │   │   └── PickupModal.jsx       # Validasi fisik & scan kode booking
│   │   └── pages/
│   │       ├── AdminDashboardPage.jsx # Halaman utama dashboard staf
│   │       └── AdminLoginPage.jsx     # Halaman login staf terpisah
│   ├── user/                  # MODUL PELANGGAN / PUBLIK
│   │   ├── components/
│   │   │   ├── CategoryFilters.jsx   # Filter kategori (6) & bar pencarian
│   │   │   ├── EquipmentCard.jsx     # Kartu alat, foto, tarif sewa, & status
│   │   │   ├── EquipmentGrid.jsx     # Grid katalog dengan jarak lega (gap-6)
│   │   │   ├── HeroBanner.jsx        # Banner hero & statistik live
│   │   │   ├── UserFooter.jsx        # Footer profil, alamat Depok, & kontak
│   │   │   └── UserHeader.jsx        # Navigasi katalog & keranjang sewa
│   │   └── pages/
│   │       ├── BookingPage.jsx       # Formulir booking & jaminan fisik
│   │       ├── CatalogPage.jsx       # Katalog publik 25 alat
│   │       └── OrderSuccessPage.jsx  # Tampilan kode unik & reminder WA
│   ├── context/
│   │   └── RentalContext.jsx  # State terpusat & persistence localStorage
│   ├── data/
│   │   ├── initialInventory.js # Data 25 aset kamera, lensa, lighting, dll.
│   │   └── initialOrders.js    # Data awal pemesanan demo & konfigurasi WA
│   ├── shared/
│   │   ├── utils/
│   │   │   └── formatters.js   # Pemformat Rupiah, tanggal, badge status
│   │   └── Toast.jsx           # Notifikasi pop-up dinamis
│   ├── App.jsx                # Komponen root & view router
│   ├── index.css              # Custom styling, gradien, badge, & spacing
│   └── main.jsx               # Entrypoint React
├── index.html                 # Entrypoint Vite HTML
├── server.js                  # Node.js production server (SPA fallback & health check)
├── package.json               # Dependensi & script eksekusi
└── vite.config.js             # Konfigurasi build Vite + React plugin
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Mode Pengembangan (Development)
- **Windows (OneDrive / Local):**
  ```bash
  npm run win:dev
  ```
- **Linux / macOS / Non-Windows:**
  ```bash
  npm run dev
  ```
Akses di browser: `http://localhost:3000`

### 3. Build untuk Produksi
- **Windows (OneDrive / Local):**
  ```bash
  npm run win:build
  ```
- **Linux / macOS / Vercel / Netlify:**
  ```bash
  npm run build
  ```
Hasil bundle akan tersimpan di folder `dist/`.

### 4. Menjalankan Node.js Production Server
```bash
npm start
```
Server Node.js bawaan akan menyajikan hasil build `dist/` di `http://localhost:3000` lengkap dengan endpoint health check di `/api/health`.

---

## ☁️ Panduan Deploy ke Cloudflare Pages + Cloudflare D1

Sistem ini telah dilengkapi **Cloudflare Pages Functions** dan terintegrasi dengan **Cloudflare D1 Database (SQLite Serverless)**. Riwayat peminjaman dan data inventaris akan tersimpan terpusat dan sinkron di *edge* Cloudflare.

### Langkah 1: Push Perubahan ke GitHub
```bash
git add .
git commit -m "feat: Integrasi Cloudflare D1 Database & Pages Functions"
git push origin main
```

### Langkah 2: Buat D1 Database di Cloudflare
1. Buka dashboard [Cloudflare](https://dash.cloudflare.com/) -> pilih menu **Storage & Databases** -> **D1 SQL Database**.
2. Klik tombol **Create database**.
3. Beri nama: `layarasa-db` -> klik **Create**.

### Langkah 3: Sambungkan ke Cloudflare Pages
1. Di Cloudflare Dashboard, buka menu **Compute (Workers & Pages)** -> pilih proyek Pages Anda (atau klik *Create application* -> *Pages* -> *Connect to Git*).
2. Konfigurasi Build:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: biarkan kosong (jika repo root adalah web) atau `web` (jika repo root di luar folder web).
3. Setelah proyek dibuat, buka:
   - **Settings** -> **Functions** -> gulir ke **D1 database bindings**.
   - Klik **Add binding**:
     - **Variable name**: `DB` *(WAJIB huruf kapital `DB`)*
     - **D1 database**: pilih `layarasa-db` yang telah dibuat.
   - Klik **Save**.

### Langkah 4: Inisialisasi Database (Auto-Seed 25 Unit Alat)
Pilih salah satu cara termudah berikut:
- **Cara A (Melalui Web - Paling Mudah):** Buka website Anda yang sudah live di domain `*.pages.dev`, masuk ke **Portal Staf / Admin**, lalu klik tombol status database (atau buka URL `https://domain-anda.pages.dev/api/init`). Sistem akan otomatis membuat tabel SQL dan mengisi 25 unit inventaris awal!
- **Cara B (Melalui Cloudflare D1 Console):** Di Cloudflare Dashboard -> **D1** -> `layarasa-db` -> tab **Console**, salin & tempel seluruh isi file [`schema.sql`](./schema.sql), lalu klik **Execute**.

> [!TIP]
> **Anti-Crash / Zero Drama Guarantee:** Jika binding D1 belum dikonfigurasi, sistem frontend secara otomatis beralih ke penyimpanan lokal (*LocalStorage*) dan tidak akan menyebabkan layar putih/blank screen.


## 🔑 Kredensial Portal Staf Admin

- **Akses:** Melalui tautan **Portal Staf / Login Admin** di bagian kanan bawah footer.
- **Username:** `admin`
- **Password:** `admin123`

---

## 📦 Fitur-Fitur Utama

1. **Pemisahan Modul User & Admin:**
   - Navigasi atas publik hanya menampilkan tab *Katalog Alat* dan *Pemesanan Saya*.
   - Portal Admin dilindungi form login terpisah dengan validasi kredensial.
2. **Katalog 25 Unit Inventaris:**
   - Meliputi kategori Kamera, Lensa, Lighting, Tripod & Stabilizer, Baterai & Power, Audio & Mic.
   - Layout grid rapi dengan spasi antar kartu yang nyaman (`gap-6`).
3. **Pemesanan Fleksibel (12 Jam, 24 Jam, & Per-Hari):**
   - Opsi durasi sewa *Blok 12 Jam*, *Blok 24 Jam*, serta *Per-Hari* dengan counter hari (1–30 hari) yang mengalikan tarif harian.
4. **Kebijakan Jaminan Fisik di Tempat:**
   - Pelanggan tidak perlu upload KTP/KTM online.
   - Wajib menyerahkan kartu identitas fisik asli saat serah-terima di studio.
5. **Pilihan Metode Pembayaran:**
   - Mendukung QRIS (instan), Transfer Bank, dan Tunai di Studio.
6. **Ekspor CSV Histori Pemesanan:**
   - Admin dapat mengunduh seluruh transaksi dalam format CSV berstandar UTF-8 BOM.
7. **Informasi Lengkap di Footer:**
   - Alamat Studio: *Jl. Prof. Dr. G.A. Siwabessy, Kampus PNJ - UI Depok, Kukusan, Kec. Beji, Kota Depok, Jawa Barat 16425*.
   - Jam operasional: *Setiap Hari 08.00 – 21.00 WIB*.
   - Kontak WhatsApp, Email resmi, dan akun Instagram.
