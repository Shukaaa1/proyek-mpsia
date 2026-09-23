// Cloudflare Pages Function: /api/init
// Menginisialisasi tabel database D1 dan mengisi seed 25 inventaris jika tabel kosong

const INITIAL_INVENTORY_SEED = [
  // KAMERA
  ['CAM-01', 'Sony FX3 Cinema Line', 'Kamera', 350000, 550000, 'Available', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', 'Full-frame Cinema Line 4K 120fps, Dual Base ISO 800/12800'],
  ['CAM-02', 'Sony A7S III Mirrorless', 'Kamera', 300000, 480000, 'Available', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80', '12.1 MP BSI Sensor, 10-bit 4:2:2 internal, Active Stabilization'],
  ['CAM-03', 'Sony A7 IV Hybrid', 'Kamera', 250000, 400000, 'Available', 'https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?auto=format&fit=crop&w=400&q=80', '33MP Full-frame BIONZ XR, 4K 60p 10-bit, S-Cinetone'],
  ['CAM-04', 'Canon EOS R6 Mark II', 'Kamera', 275000, 450000, 'Available', 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=400&q=80', '24.2 MP Full Frame, 40fps electronic shutter, 4K 60p oversampled'],
  ['CAM-05', 'Blackmagic Pocket 6K Pro', 'Kamera', 320000, 500000, 'Maintenance', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80', 'Super 35 HDR sensor, Built-in ND Filters, Gen 5 Color Science'],
  // LENSA
  ['LNS-01', 'Sony FE 24-70mm f/2.8 GM II', 'Lensa', 180000, 300000, 'Available', 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80', 'Lensa Zoom Standard GM II ultra-ringan & tajam'],
  ['LNS-02', 'Sony FE 70-200mm f/2.8 GM OSS II', 'Lensa', 220000, 350000, 'Available', 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=400&q=80', 'Telephoto Zoom GM II dengan fast AF & optical stabilization'],
  ['LNS-03', 'Sony FE 35mm f/1.4 GM Prime', 'Lensa', 130000, 200000, 'Available', 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=400&q=80', 'Prime lens cinematic bokeh f/1.4, ringkas untuk stabilizer'],
  ['LNS-04', 'Sigma 18-35mm f/1.8 DC HSM Art', 'Lensa', 100000, 160000, 'Available', 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=400&q=80', 'Zoom aperture konstan f/1.8 legendaris untuk film pendek'],
  ['LNS-05', 'Canon RF 50mm f/1.2L USM', 'Lensa', 170000, 270000, 'Available', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', 'Ultra fast prime L-series untuk pencahayaan rendah'],
  // LIGHTING
  ['LGT-01', 'Aputure Amaran 200d S Daylight', 'Lighting', 120000, 200000, 'Available', 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?auto=format&fit=crop&w=400&q=80', '200W Output Daylight 5600K Bowens Mount, Sidus Link App'],
  ['LGT-02', 'Aputure Light Storm LS 300x Bi-Color', 'Lighting', 200000, 320000, 'Available', 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=400&q=80', 'Variable Bi-Color 2700K-6500K dengan wireless control'],
  ['LGT-03', 'Godox SL60W LED Daylight Kit', 'Lighting', 60000, 100000, 'Available', 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=80', 'Paket Studio LED 60W + Softbox 60x90 + Light Stand'],
  ['LGT-04', 'Nanlite Pavotube II 30C RGB Tube', 'Lighting', 90000, 150000, 'Available', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80', 'Lampu LED Tube RGBWW 4ft dengan efek pencahayaan khusus'],
  // TRIPOD & STABILIZER
  ['STB-01', 'DJI RS 3 Pro Gimbal Stabilizer', 'Tripod', 150000, 250000, 'Available', 'https://images.unsplash.com/photo-1589872782415-b68a5c2690b8?auto=format&fit=crop&w=400&q=80', 'Automated Axis Locks, Carbon Fiber Arms, Payload 4.5kg'],
  ['STB-02', 'DJI Ronin-S Gimbal 3-Axis', 'Tripod', 90000, 150000, 'Available', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80', 'Handheld gimbal 3.6kg payload dengan focus wheel'],
  ['STB-03', 'Manfrotto 504HD Fluid Head Tripod', 'Tripod', 80000, 130000, 'Available', 'https://images.unsplash.com/photo-1495745966610-2a67f229785e?auto=format&fit=crop&w=400&q=80', 'Tripod Video Profesional Head Fluid licin untuk panning'],
  ['STB-04', 'Benro KH25N Heavy Duty Video Tripod', 'Tripod', 50000, 80000, 'Available', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80', 'Tripod aluminium kokoh beban hingga 5kg untuk kamera film'],
  // BATERAI & POWER
  ['PWR-01', 'FXLion NANO TWO 98Wh V-Mount', 'Baterai', 50000, 85000, 'Available', 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80', 'Baterai V-Mount ringkas dengan output USB-C & D-Tap'],
  ['PWR-02', 'SmallRig V-Mount Battery 99Wh', 'Baterai', 45000, 80000, 'Available', 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80', 'Baterai kamera cinema dengan layar status OLED mAh'],
  ['PWR-03', 'Paket Baterai NP-FZ100 Sony (4x)', 'Baterai', 30000, 50000, 'Available', 'https://images.unsplash.com/photo-1594549181132-9045fed330ce?auto=format&fit=crop&w=400&q=80', 'Paket 4 unit Baterai original Sony + Dual Rapid Charger'],
  // AUDIO & MIC
  ['AUD-01', 'Sennheiser MKE 600 Shotgun Mic', 'Audio', 90000, 150000, 'Available', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80', 'Shotgun Mic profesional anti-noise dengan XLR & Batterij'],
  ['AUD-02', 'Rode Wireless GO II Dual Kit', 'Audio', 100000, 160000, 'Available', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80', 'Wireless Mic 2 pemancar + 1 penerima, jarak hingga 200m'],
  ['AUD-03', 'Zoom H6 All-Black Handy Recorder', 'Audio', 80000, 130000, 'Available', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80', 'Audio Recorder 6-track dengan kapsul kapsul X/Y'],
  ['AUD-04', 'DJI Mic 2 Wireless Transmitter', 'Audio', 110000, 180000, 'Available', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80', '32-bit Float Internal Recording + Active Noise Cancelling']
];

export async function onRequest(context) {
  const { env } = context;

  // Cek apakah binding D1 'DB' tersedia
  if (!env || !env.DB) {
    return new Response(
      JSON.stringify({
        ok: false,
        connected: false,
        error: "D1 database binding 'DB' belum dikonfigurasikan di Cloudflare Pages Dashboard."
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 1. Buat tabel jika belum ada
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS inventory (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        rate12h INTEGER NOT NULL,
        rate24h INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Available',
        image TEXT NOT NULL,
        desc TEXT,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        code TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        phone TEXT NOT NULL,
        institution TEXT NOT NULL,
        itemId TEXT NOT NULL,
        itemName TEXT NOT NULL,
        packageType TEXT NOT NULL,
        durationDays REAL NOT NULL,
        durationBlock INTEGER NOT NULL,
        durationText TEXT NOT NULL,
        totalPrice INTEGER NOT NULL,
        paymentMethod TEXT NOT NULL DEFAULT 'qris',
        status TEXT NOT NULL DEFAULT 'Booked',
        datePickup TEXT NOT NULL,
        estimatedReturnTime TEXT NOT NULL,
        handoverTime TEXT,
        returnTime TEXT,
        guaranteeType TEXT DEFAULT 'KTP/KTM Asli (Fisik di Lokasi)',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_itemId ON orders(itemId);
      CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(createdAt DESC);
      CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
    `);

    // 2. Cek apakah inventory sudah terisi
    const countRes = await env.DB.prepare('SELECT count(*) as total FROM inventory').first();
    let seeded = false;

    if (!countRes || countRes.total === 0) {
      // Masukkan 25 data alat inventaris
      const statements = INITIAL_INVENTORY_SEED.map((item) =>
        env.DB.prepare(
          'INSERT OR IGNORE INTO inventory (id, name, category, rate12h, rate24h, status, image, desc) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(...item)
      );
      await env.DB.batch(statements);
      seeded = true;
    }

    const currentInventory = await env.DB.prepare('SELECT count(*) as total FROM inventory').first();
    const currentOrders = await env.DB.prepare('SELECT count(*) as total FROM orders').first();

    return new Response(
      JSON.stringify({
        ok: true,
        connected: true,
        message: seeded ? 'Database D1 berhasil diinisialisasi & diisi 25 item awal.' : 'Database D1 aktif dan terhubung.',
        inventoryCount: currentInventory?.total || 0,
        ordersCount: currentOrders?.total || 0
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        connected: false,
        error: err.message || 'Gagal menginisialisasi database D1'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
