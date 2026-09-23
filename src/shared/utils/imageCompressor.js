// Helper utilitas untuk kompresi gambar client-side (Zero Server Drama)
// Mengubah file gambar/kamera resolusi tinggi (3MB-5MB) menjadi data URL terkompresi (~40KB-80KB)
// Sangat optimal untuk penyimpanan di Cloudflare D1/R2 tanpa beban payload besar

export function compressImageFile(file, maxWidth = 900, maxHeight = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('File tidak ditemukan'));
    }

    // Pastikan file bertipe gambar
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File harus berupa format gambar (JPG, PNG, WEBP)'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Hitung proporsi resize
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Gagal menginisialisasi canvas context'));
        }

        // Gambar ulang di canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke format JPEG dengan kualitas teroptimasi
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
}
