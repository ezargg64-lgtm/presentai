# Changelog

Semua perubahan penting pada proyek **PresentAI** akan didokumentasikan di file ini.

Format berkas ini merujuk pada [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) dan rilis ini mematuhi [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-30

### Added
- **Backend Service (Node.js/Express)**:
  - Integrasi dengan Gemini AI SDK (`@google/generative-ai`) menggunakan model `gemini-2.5-flash` untuk performa cepat dan andal.
  - Setup environment variables dengan `dotenv` untuk pengelolaan API Key yang aman.
  - Endpoint `POST /api/generate` untuk menghasilkan data outline presentasi format JSON.
  - Endpoint `GET /api/health` untuk memantau status keaktifan server.
  - Middleware input validation untuk membatasi panjang teks topik input (3 - 200 karakter).
  - Integrasi robust JSON cleaning utility untuk membersihkan respon markdown/noise dari AI sebelum di-parse.
  - Middleware rate limiter menggunakan `express-rate-limit` untuk membatasi permintaan spam.
  - Setup header keamanan menggunakan `helmet` dan middleware `cors`.

- **Frontend Client (HTML/CSS/JS)**:
  - Tampilan UI berbasis web yang responsif dengan tipografi modern (Inter & Playfair Display).
  - Skema warna netral premium dengan aksen hangat.
  - Komponen loading skeleton interaktif saat menunggu respon dari AI.
  - UI slide visualizer dengan navigasi dot indicator dan tombol next/previous.
  - Halaman error state responsif dengan tombol retry/coba lagi jika request gagal.

- **Deployment Configs**:
  - Konfigurasi deployment backend menggunakan `render.yaml` untuk Render.com.
  - Konfigurasi deployment frontend menggunakan `vercel.json` untuk Vercel.

- **Repository Structure**:
  - Re-organisasi struktur folder dengan memisahkan `backend` dan `frontend` ke tingkat atas.
  - Dokumentasi API (`docs/API.md`), Panduan Prompting (`docs/PROMPTING.md`), Panduan Deployment (`docs/DEPLOYMENT.md`), Kebijakan Keamanan (`backend/SECURITY.md`), dan Spesifikasi Desain (`frontend/DESIGN.md`).
