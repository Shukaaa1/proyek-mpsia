export const INITIAL_INVENTORY = [
  // KAMERA (5 items)
  {
    id: 'CAM-01',
    name: 'Sony FX3 Cinema Line',
    category: 'Kamera',
    rate12h: 350000,
    rate24h: 550000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    desc: 'Full-frame Cinema Line 4K 120fps, Dual Base ISO 800/12800'
  },
  {
    id: 'CAM-02',
    name: 'Sony A7S III Mirrorless',
    category: 'Kamera',
    rate12h: 300000,
    rate24h: 480000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80',
    desc: '12.1 MP BSI Sensor, 10-bit 4:2:2 internal, Active Stabilization'
  },
  {
    id: 'CAM-03',
    name: 'Sony A7 IV Hybrid',
    category: 'Kamera',
    rate12h: 250000,
    rate24h: 400000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1512790182412-b19e6d61b39a?auto=format&fit=crop&w=400&q=80',
    desc: '33MP Full-frame BIONZ XR, 4K 60p 10-bit, S-Cinetone'
  },
  {
    id: 'CAM-04',
    name: 'Canon EOS R6 Mark II',
    category: 'Kamera',
    rate12h: 275000,
    rate24h: 450000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=400&q=80',
    desc: '24.2 MP Full Frame, 40fps electronic shutter, 4K 60p oversampled'
  },
  {
    id: 'CAM-05',
    name: 'Blackmagic Pocket 6K Pro',
    category: 'Kamera',
    rate12h: 320000,
    rate24h: 500000,
    status: 'Maintenance',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80',
    desc: 'Super 35 HDR sensor, Built-in ND Filters, Gen 5 Color Science'
  },

  // LENSA (5 items)
  {
    id: 'LNS-01',
    name: 'Sony FE 24-70mm f/2.8 GM II',
    category: 'Lensa',
    rate12h: 180000,
    rate24h: 300000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=400&q=80',
    desc: 'Lensa Zoom Standard GM II ultra-ringan & tajam'
  },
  {
    id: 'LNS-02',
    name: 'Sony FE 70-200mm f/2.8 GM OSS II',
    category: 'Lensa',
    rate12h: 220000,
    rate24h: 350000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=400&q=80',
    desc: 'Telephoto Zoom GM II dengan fast AF & optical stabilization'
  },
  {
    id: 'LNS-03',
    name: 'Sony FE 35mm f/1.4 GM Prime',
    category: 'Lensa',
    rate12h: 130000,
    rate24h: 200000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=400&q=80',
    desc: 'Prime lens cinematic bokeh f/1.4, ringkas untuk stabilizer'
  },
  {
    id: 'LNS-04',
    name: 'Sigma 18-35mm f/1.8 DC HSM Art',
    category: 'Lensa',
    rate12h: 100000,
    rate24h: 160000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=400&q=80',
    desc: 'Zoom aperture konstan f/1.8 legendaris untuk film pendek'
  },
  {
    id: 'LNS-05',
    name: 'Canon RF 50mm f/1.2L USM',
    category: 'Lensa',
    rate12h: 170000,
    rate24h: 270000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    desc: 'Ultra fast prime L-series untuk pencahayaan rendah'
  },

  // LIGHTING (4 items)
  {
    id: 'LGT-01',
    name: 'Aputure Amaran 200d S Daylight',
    category: 'Lighting',
    rate12h: 120000,
    rate24h: 200000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1524338198850-8a2ff63aaceb?auto=format&fit=crop&w=400&q=80',
    desc: '200W Output Daylight 5600K Bowens Mount, Sidus Link App'
  },
  {
    id: 'LGT-02',
    name: 'Aputure Light Storm LS 300x Bi-Color',
    category: 'Lighting',
    rate12h: 200000,
    rate24h: 320000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=400&q=80',
    desc: 'Variable Bi-Color 2700K-6500K dengan wireless control'
  },
  {
    id: 'LGT-03',
    name: 'Godox SL60W LED Daylight Kit',
    category: 'Lighting',
    rate12h: 60000,
    rate24h: 100000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=80',
    desc: 'Paket Studio LED 60W + Softbox 60x90 + Light Stand'
  },
  {
    id: 'LGT-04',
    name: 'Nanlite Pavotube II 30C RGB Tube',
    category: 'Lighting',
    rate12h: 90000,
    rate24h: 150000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    desc: 'Lampu LED Tube RGBWW 4ft dengan efek pencahayaan khusus'
  },

  // TRIPOD & STABILIZER (4 items)
  {
    id: 'STB-01',
    name: 'DJI RS 3 Pro Gimbal Stabilizer',
    category: 'Tripod',
    rate12h: 150000,
    rate24h: 250000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1589872782415-b68a5c2690b8?auto=format&fit=crop&w=400&q=80',
    desc: 'Automated Axis Locks, Carbon Fiber Arms, Payload 4.5kg'
  },
  {
    id: 'STB-02',
    name: 'DJI Ronin-S Gimbal 3-Axis',
    category: 'Tripod',
    rate12h: 90000,
    rate24h: 150000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80',
    desc: 'Handheld gimbal 3.6kg payload dengan focus wheel'
  },
  {
    id: 'STB-03',
    name: 'Manfrotto 504HD Fluid Head Tripod',
    category: 'Tripod',
    rate12h: 80000,
    rate24h: 130000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1495745966610-2a67f229785e?auto=format&fit=crop&w=400&q=80',
    desc: 'Tripod Video Profesional Head Fluid licin untuk panning'
  },
  {
    id: 'STB-04',
    name: 'Benro KH25N Heavy Duty Video Tripod',
    category: 'Tripod',
    rate12h: 50000,
    rate24h: 80000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
    desc: 'Tripod aluminium kokoh beban hingga 5kg untuk kamera film'
  },

  // BATERAI & POWER (3 items)
  {
    id: 'PWR-01',
    name: 'FXLion NANO TWO 98Wh V-Mount',
    category: 'Baterai',
    rate12h: 50000,
    rate24h: 85000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
    desc: 'Baterai V-Mount ringkas dengan output USB-C & D-Tap'
  },
  {
    id: 'PWR-02',
    name: 'SmallRig V-Mount Battery 99Wh',
    category: 'Baterai',
    rate12h: 45000,
    rate24h: 80000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=400&q=80',
    desc: 'Baterai kamera cinema dengan layar status OLED mAh'
  },
  {
    id: 'PWR-03',
    name: 'Paket Baterai NP-FZ100 Sony (4x)',
    category: 'Baterai',
    rate12h: 30000,
    rate24h: 50000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1594549181132-9045fed330ce?auto=format&fit=crop&w=400&q=80',
    desc: 'Paket 4 unit Baterai original Sony + Dual Rapid Charger'
  },

  // AUDIO & MIC (4 items)
  {
    id: 'AUD-01',
    name: 'Sennheiser MKE 600 Shotgun Mic',
    category: 'Audio',
    rate12h: 90000,
    rate24h: 150000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
    desc: 'Shotgun Mic profesional anti-noise dengan XLR & Batterij'
  },
  {
    id: 'AUD-02',
    name: 'Rode Wireless GO II Dual Kit',
    category: 'Audio',
    rate12h: 100000,
    rate24h: 160000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80',
    desc: 'Wireless Mic 2 pemancar + 1 penerima, jarak hingga 200m'
  },
  {
    id: 'AUD-03',
    name: 'Zoom H6 All-Black Handy Recorder',
    category: 'Audio',
    rate12h: 80000,
    rate24h: 130000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    desc: 'Audio Recorder 6-track dengan kapsul kapsul X/Y'
  },
  {
    id: 'AUD-04',
    name: 'DJI Mic 2 Wireless Transmitter',
    category: 'Audio',
    rate12h: 110000,
    rate24h: 180000,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    desc: '32-bit Float Internal Recording + Active Noise Cancelling'
  }
];
