# PresentAI 🚀

PresentAI adalah asisten pintar berbasis AI yang dirancang untuk menghasilkan struktur outline presentasi profesional dalam hitungan detik menggunakan Google Gemini API.

## Fitur Utama

- 🧠 **AI-Powered Generation**: Menghasilkan 5 slide terstruktur dengan topik yang disesuaikan pengguna.
- ⚡ **Responsive UI**: Tampilan modern, bersih, dan intuitif dengan visualisasi slide dinamis.
- 🔒 **Secure Backend**: Dilengkapi dengan CORS protection, rate limiter, dan integrasi environment variable yang aman.
- ⚙️ **Production Ready**: Konfigurasi deployment siap pakai untuk Render (backend) dan Vercel (frontend).

---

## Struktur Direktori

Berikut adalah struktur file dalam proyek ini:

```text
presentai/
├── README.md                 # Dokumentasi utama proyek
├── CHANGELOG.md              # Riwayat perubahan dan versi
├── LICENSE                   # Lisensi open-source MIT
├── render.yaml               # Konfigurasi deployment Render (Backend)
├── vercel.json               # Konfigurasi deployment Vercel (Frontend)
│
├── backend/                  # Kode sumber backend (Node.js/Express)
│   ├── server.js             # Entry point backend
│   ├── package.json          # Package manifest & scripts
│   ├── .env.example          # Contoh variabel lingkungan
│   ├── src/                  # Folder source code backend
│   │   ├── config/           # Konfigurasi Gemini API
│   │   ├── controllers/      # Logika pemrosesan presentasi
│   │   ├── middleware/       # Rate limiting & validasi input
│   │   ├── routes/           # Routing API
│   │   └── utils/            # JSON cleaning & parsing utilities
│   └── SECURITY.md           # Kebijakan dan pedoman keamanan backend
│
├── frontend/                 # Kode sumber frontend (Static HTML/CSS/JS)
│   ├── index.html            # Halaman utama aplikasi
│   ├── css/                  # Berkas styling (base, components, animations)
│   ├── js/                   # Berkas JavaScript client-side (API, rendering)
│   ├── assets/               # Gambar, logo, dan file statis lainnya
│   └── DESIGN.md             # Dokumentasi desain UI/UX & sistem warna
│
└── docs/                     # Dokumentasi detail bersama
    ├── API.md                # Spesifikasi endpoint API
    ├── PROMPTING.md          # Dokumentasi system prompt Gemini
    └── DEPLOYMENT.md         # Panduan instalasi dan deployment
```

---

## Persiapan Awal

### Prerequisites

Pastikan Anda telah menginstal software berikut di komputer Anda:
- **Node.js** (versi 18 ke atas direkomendasikan)
- **NPM** (biasanya ter-bundel dengan instalasi Node.js)
- **Google Gemini API Key** (dapatkan dari [Google AI Studio](https://aistudio.google.com/))

### Konfigurasi Environment Variables (Backend)

1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. Buka file `.env` dan masukkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   CORS_ORIGIN=*
   ```

---

## Cara Menjalankan Proyek Secara Lokal

### 1. Jalankan Backend Server

Dari direktori root proyek:
```bash
cd backend
npm install
npm run dev
```
Server akan berjalan di port `3000`. Anda bisa mengakses health check di: `http://localhost:3000/api/health`.

### 2. Jalankan Frontend Client

Frontend PresentAI dibuat menggunakan HTML/CSS/JS murni (tanpa build step). Anda bisa menjalankannya menggunakan server statis apa pun.

Menggunakan `npx serve` (direkomendasikan):
```bash
cd frontend
npx serve -l 5000
```
Buka browser Anda dan akses `http://localhost:5000` untuk mulai menggunakan PresentAI.

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat berkas [LICENSE](LICENSE) untuk informasi lebih lanjut.
