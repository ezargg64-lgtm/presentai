# Panduan Instalasi & Deployment (Render & Vercel)

Dokumen ini menjelaskan langkah-langkah untuk melakukan instalasi lokal serta melakukan deployment aplikasi **PresentAI** ke server produksi menggunakan **Render.com** (untuk Backend) dan **Vercel** (untuk Frontend).

---

## 1. Instalasi & Menjalankan secara Lokal

### Backend (Node.js/Express)
1. Buka terminal dan masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Pasang semua dependensi NPM:
   ```bash
   npm install
   ```
3. Buat file konfigurasi `.env` dan masukkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=isi_dengan_gemini_api_key_anda
   PORT=3000
   CORS_ORIGIN=*
   ```
4. Jalankan server dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   Server akan aktif di `http://localhost:3000`.

### Frontend (Static HTML/CSS/JS)
Karena frontend menggunakan HTML statis, Anda dapat menjalankannya dengan server statis lokal apa saja.
1. Masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Jalankan static server (contoh menggunakan `serve`):
   ```bash
   npx serve -l 5000
   ```
   Aplikasi dapat diakses di `http://localhost:5000`.

---

## 2. Deployment Backend ke Render.com

Render.com mendukung deployment otomatis berbasis konfigurasi Infrastruktur-sebagai-Kode (IaC) menggunakan file `render.yaml` yang sudah disediakan di root proyek ini.

### Langkah-langkah Deployment:
1. Daftarkan diri Anda atau masuk ke akun Anda di [Render.com](https://render.com/).
2. Hubungkan akun GitHub Anda ke Render.
3. Di dashboard Render, klik tombol **New** lalu pilih **Blueprint**.
4. Pilih repositori GitHub `presentai` Anda.
5. Render akan mendeteksi file [`render.yaml`](file:///c:/Users/Lia/antigravity/presentai/render.yaml) secara otomatis.
6. Pada bagian konfigurasi Environment Variable, Render akan meminta nilai untuk **`GEMINI_API_KEY`**. Masukkan API Key Google Gemini Anda di sana.
7. Klik **Apply** atau **Deploy**.
8. Setelah deployment selesai, Render akan memberikan URL publik untuk backend Anda (misalnya: `https://presentai-backend-xxxx.onrender.com`).

---

## 3. Deployment Frontend ke Vercel

Vercel adalah platform ideal untuk menghosting file statis frontend PresentAI secara gratis dan cepat. Proyek ini dilengkapi file [`vercel.json`](file:///c:/Users/Lia/antigravity/presentai/vercel.json) di root untuk melakukan perutean otomatis ke folder `frontend/`.

### Langkah-langkah Deployment:
1. Pastikan Anda sudah mendaftar dan masuk ke akun [Vercel](https://vercel.com/).
2. Klik tombol **Add New** lalu pilih **Project**.
3. Hubungkan ke repositori GitHub `presentai` Anda dan klik **Import**.
4. **PENTING: Hubungkan Frontend ke URL Backend Produksi**
   Sebelum men-deploy, Anda harus mengarahkan frontend ke URL backend Render Anda yang baru. Buka file [`frontend/js/api.js`](file:///c:/Users/Lia/antigravity/presentai/frontend/js/api.js#L6) dan ubah baris `API_BASE_URL` ke domain backend Anda yang dideploy di Render:
   ```javascript
   // Ubah:
   const API_BASE_URL = 'http://localhost:3000/api';

   // Menjadi:
   const API_BASE_URL = 'https://presentai-backend-xxxx.onrender.com/api';
   ```
5. Pada dashboard Vercel, biarkan pengaturan build default (Vercel akan mendeteksi static directory dan menggunakan konfigurasi router dari `vercel.json`).
6. Klik **Deploy**.
7. Vercel akan menghasilkan domain produksi untuk frontend Anda (misalnya: `https://presentai.vercel.app`).
