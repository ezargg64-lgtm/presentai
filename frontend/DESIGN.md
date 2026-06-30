# Design System & UX Guidelines — PresentAI

> **Versi:** 1.0  
> **Terakhir Update:** 2026-06-29  
> **Status:** Production Ready

---

## 1. Filosofi Desain

PresentAI dibangun dengan prinsip **\"Anti-Template-AI\"** — menghindari estetika generik yang sering ditemui pada aplikasi AI murahan (gradasi neon, ikon sparkles, layout monoton). Sebaliknya, kami mengadopsi pendekatan **editorial magazine layout** yang terasa premium, manusiawi, dan layak dipamerkan di portofolio.

### 1.1 Prinsip Utama

| Prinsip | Deskripsi |
|---------|-----------|
| **Warmth** | Palet warna hangat yang nyaman di mata, bukan putih dingin atau gelap pekat |
| **Asymmetry** | Layout dinamis yang berbeda tiap slide, menghindari kebosanan visual |
| **Typography-First** | Tipografi sebagai elemen desain utama, bukan hanya pembawa informasi |
| **Restraint** | Shadow tipis, border halus, transisi lembut — tidak berlebihan |
| **Focus** | Satu slide per layar (16:9), pengguna fokus pada satu pesan pada satu waktu |

---

## 2. Palet Warna

### 2.1 Warm Minimalist (Tema Default)

```css
:root {
  /* Background */
  --bg-body:        #FAF8F5;   /* Off-white hangat, tidak sakit mata */
  --bg-slide:       #FFFFFF;   /* Putih murni untuk card */

  /* Teks */
  --text-primary:   #1E1E1E;   /* Charcoal gelap, jangan hitam pekat #000 */
  --text-secondary: #4A4A4A;   /* Abu-abu gelap untuk body text */
  --text-muted:     #8A8A8A;   /* Abu-abu medium untuk placeholder/helper */

  /* Aksen */
  --accent:         #C4A484;   /* Muted Terracotta — warm, earthy */
  --accent-hover:   #B08F6E;   /* Versi lebih gelap untuk hover state */

  /* Border & Divider */
  --border:         #E6E4E0;   /* Border tipis */
  --border-light:   #F0EEEA;   /* Border lebih terang untuk hover states */

  /* Status */
  --error:          #DC2626;   /* Merah error */
  --success:        #3D5A45;   /* Sage green untuk success states */

  /* Shadow */
  --shadow:         rgba(0, 0, 0, 0.03);  /* Sangat halus, hampir tidak terlihat */
}
```

---

## 3. Tipografi

Tipografi menggunakan Playfair Display (Serif) dan Inter (Sans-serif) untuk kombinasi editorial premium yang elegan dan modern.
