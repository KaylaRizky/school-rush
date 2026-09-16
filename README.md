# 🏫 School Rush — Game Web Edukasi Pelajar

> **Proyek Tugas Sekolah Kelas XI RPL / Pengembangan Gim**  
> Sebuah game endless-runner berbasis web yang menceritakan perjuangan seorang siswa SMA yang sedang berlari menuju sekolah. Pemain harus mengumpulkan buku pelajaran untuk meraih poin dan menghindari rintangan di perjalanan sebelum bel masuk berbunyi!

---

## 🎮 Demo & Fitur Game

1. **Menu Utama Interaktif**
   - Judul & identitas game bergaya arcade modern.
   - Pilihan target skor (100, 150, atau 200 poin).
   - Tombol **"MULAI GAME"** dan **"CARA BERMAIN"**.
   - Penyimpanan skor tertinggi (*High Score*) otomatis di browser (`localStorage`).
   - Tombol toggle suara (Mute / Unmute).

2. **Gameplay & Fisika Canvas 60 FPS**
   - Karakter siswa berseragam rapi (kemeja putih, celana abu-abu SMA, tas ransel merah bergoyang saat berlari).
   - Animasi langkah kaki, lompatan (*jump physics* dengan gravitasi), dan bayangan dinamis.
   - Latar belakang lingkungan pagi hari: matahari terbit, awan melayang, barisan bukit, pepohonan, lampu jalan, dan gerbang sekolah di kejauhan.
   - Gerbang sekolah membesar seiring persentase perjalanan pemain menuju 100%.
   - Efek *screen shake* dan partikel saat terkena rintangan.
   - Efek bintang gemerlap dan teks melayang `+10` / `+25` saat mengumpulkan buku.

3. **Sistem Item & Rintangan**
   - 📘 **Buku Pelajaran (+10 Skor)**: Buku teks biru atau kamus merah yang tersebar di jalanan.
   - ⭐ **Buku Emas (+25 Skor)**: Buku berkilau khusus yang melayang tinggi di udara (memerlukan lompatan tepat).
   - 🎒 **Tas Sekolah Terjatuh**: Rintangan di tanah.
   - 🗑️ **Tempat Sampah Sekolah**: Rintangan hijau.
   - 🪨 **Batu Trotoar**: Rintangan batu bertekstur.
   - 🚧 **Kerucut Lalu Lintas**: Rintangan marka jalan.
   - *Catatan*: Semua rintangan darat dapat dilompati dengan tombol lompat atau dihindari dengan berpindah lajur!

4. **Sistem Nyawa & Kondisi Game**
   - Pemain memiliki **3 Nyawa** (❤️ ❤️ ❤️).
   - Menabrak rintangan mengurangi 1 nyawa dan memberikan masa kekebalan sementara (*invulnerability blink* selama 1.5 detik).
   - **Game Over**: Muncul saat semua 3 nyawa habis, menampilkan skor akhir dan tombol main ulang.
   - **Selamat (You Win)**: Muncul saat pemain mencapai target skor dengan perolehan bintang rating dan pesta konfeti!
   - **Pause Menu**: Tekan `P` atau tombol jeda untuk menghentikan permainan sementara.

5. **Audio Sintetis (Web Audio API)**
   - Menggunakan synthesizer nada bawaan browser tanpa perlu file audio eksternal (`.mp3`/`.wav`), sehingga 100% cepat, bebas error 404, dan dapat dimainkan offline.
   - Efek suara: lompat (*jump chime*), ambil buku (*crystal chime*), tabrakan (*impact thud*), menang (*victory fanfare*), dan kalah (*game over tone*).

---

## 🕹️ Kontrol Permainan

| Tombol Keyboard | Kontrol Layar Sentuh | Aksi |
|---|---|---|
| **W** / **Panah Atas** / **Spasi** | Tombol **LOMPAT** | Melompat melewati rintangan / mengambil buku melayang |
| **A** / **Panah Kiri** | Tombol **Panah Kiri** | Berpindah ke lajur sebelah kiri |
| **D** / **Panah Kanan** | Tombol **Panah Kanan** | Berpindah ke lajur sebelah kanan |
| **P** / **Escape** | Tombol **Pause** | Menjeda atau melanjutkan game |

---

## 📂 Struktur File Proyek

```text
school-rush/
├── index.html                   # Entry point HTML utama & font styling
├── package.json                 # Konfigurasi dependensi dan script npm
├── tsconfig.json                # Konfigurasi TypeScript
├── vite.config.ts               # Konfigurasi bundler Vite
├── README.md                    # Dokumentasi lengkap proyek
├── metadata.json                # Metadata aplikasi
├── src/
│   ├── main.tsx                 # Bootstrap aplikasi React
│   ├── index.css                # Styling global dan Tailwind CSS
│   ├── App.tsx                  # Komponen utama yang menghubungkan Engine dan UI
│   ├── types.ts                 # Definisi tipe data TypeScript
│   ├── audio.ts                 # Web Audio API Sound Synthesizer
│   ├── game/
│   │   ├── constants.ts         # Konstanta kecepatan, ukuran layar, gravitasi
│   │   ├── canvasRenderer.ts    # Rendering grafis procedural Canvas (siswa, jalan, rintangan, buku, partikel)
│   │   └── engine.ts            # Logika game loop, collision detection, spawning, nyawa, & skor
│   └── components/
│       ├── MenuScreen.tsx       # Tampilan Menu Utama (Mulai, Pengaturan Target, High Score)
│       ├── GameHud.tsx          # Tampilan HUD (Nyawa ❤️, Skor, Buku, Progress Bar)
│       ├── TouchControls.tsx    # Tombol virtual untuk layar sentuh / mobile
│       ├── HowToPlayModal.tsx   # Modal dialog panduan cara bermain
│       ├── GameOverModal.tsx    # Modal layar Game Over
│       ├── VictoryModal.tsx     # Modal layar Kemenangan (You Win)
│       └── PauseModal.tsx       # Modal dialog jeda permainan
```

---

## 🚀 Panduan Instalasi & Menjalankan di Komputer Lokal

Pastikan komputer Anda sudah terpasang **Node.js** (versi 18 atau lebih baru).

### 1. Clone atau Unduh Proyek
```bash
git clone https://github.com/username/school-rush.git
cd school-rush
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan (Development)
```bash
npm run dev
```
Buka browser Anda dan akses: `http://localhost:3000` (atau port yang tertera pada terminal).

### 4. Build untuk Produksi
```bash
npm run build
```
File hasil kompilasi siap publikasi akan berada di dalam folder `dist/`.

---

## 🌐 Panduan Upload ke GitHub & Deploy ke Vercel

Game ini dirancang murni **Client-Side (SPA)** tanpa server backend maupun database, sehingga sangat mudah dan gratis untuk di-hosting di platform seperti Vercel atau GitHub Pages.

### Langkah 1: Upload ke GitHub
1. Buat repositori baru di GitHub (misal: `school-rush`).
2. Jalankan perintah berikut di terminal folder proyek:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi game School Rush XI RPL"
   git branch -M main
   git remote add origin https://github.com/USERNAME-KAMU/school-rush.git
   git push -u origin main
   ```

### Langkah 2: Deploy ke Vercel
1. Kunjungi [vercel.com](https://vercel.com) dan masuk dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** -> **"Project"**.
3. Pilih repositori `school-rush` yang baru saja di-push.
4. Pada bagian *Build & Development Settings*:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Klik **"Deploy"**. Dalam ~30 detik, game Anda sudah online dan dapat dimainkan oleh teman maupun guru!

---

## 🛠️ Teknologi yang Digunakan

- **HTML5 & Canvas 2D API**: Rendering grafis 60 FPS yang halus tanpa beban aset eksternal.
- **TypeScript & React 19**: Manajemen state permainan terstruktur, aman dari bug runtime.
- **Tailwind CSS v4**: Tata letak dan UI menu modern, responsif untuk desktop dan mobile.
- **Web Audio API**: Efek suara sintetis retro arcade langsung dari browser.
- **Lucide React**: Ikon antarmuka modern.
- **Vite**: Bundler super cepat untuk pengembangan dan kompilasi produksi.

---

*Dibuat untuk Tugas Sekolah Kelas XI RPL / Gim. Selamat bermain dan belajar pemrograman gim! 🎓🚀*
