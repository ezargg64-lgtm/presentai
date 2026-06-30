# Prompt Engineering Guide — PresentAI

> **Versi:** 1.0  
> **Terakhir Update:** 2026-06-29  
> **Status:** Production Ready

---

## 1. Apa itu Prompt Engineering?

Prompt engineering adalah seni dan ilmu merancang instruksi (prompt) untuk AI agar menghasilkan output yang konsisten, akurat, dan sesuai kebutuhan. Dalam konteks PresentAI, prompt engineering adalah **kunci utama** yang membedakan aplikasi ini dari sekadar "wrapper AI biasa".

### 1.1 Mengapa Prompt Engineering Penting?

| Tanpa Prompt Engineering | Dengan Prompt Engineering |
|--------------------------|---------------------------|
| AI return format acak | AI return JSON valid 100% |
| Perlu parsing manual setiap response | Parsing otomatis dengan confidence tinggi |
| User experience tidak konsisten | UX seamless dan predictable |
| Error rate tinggi (>20%) | Error rate <1% |
| Tidak scalable | Production-ready |

### 1.2 Tantangan PresentAI

PresentAI memaksa AI (Google Gemini) untuk:
1. Return **JSON murni** (bukan markdown, bukan teks biasa)
2. Format **terstruktur** (array of objects dengan field spesifik)
3. Konten **konsisten** (5 slide, 2-4 bullet points per slide)
4. Bahasa **formal Indonesia**

Tanpa prompt engineering yang baik, Gemini akan:
- Menambahkan ```json ... ``` markdown
- Menambahkan kata pembuka "Berikut adalah..."
- Tidak mengikuti struktur field yang diminta
- Return bullet points sebagai string bukan array

---

## 2. Anatomy of a Good Prompt

### 2.1 Struktur Prompt Optimal

```
┌─────────────────────────────────────────────────────────────┐
│  STRUKTUR PROMPT YANG BAIK                                │
├─────────────────────────────────────────────────────────────┤
│  1. PERSONA/ROLE      → Siapa AI ini?                     │
│  2. TASK              → Apa tugasnya?                       │
│  3. FORMAT RULES      → Format output seperti apa?        │
│  4. CONTENT RULES     → Aturan konten apa saja?           │
│  5. EXAMPLES          → Contoh output yang benar & salah   │
│  6. CONSTRAINTS       → Batasan dan larangan               │
│  7. INPUT VARIABLE    → Tempat user input                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Contoh Prompt yang BAIK (PresentAI)

```
[1. PERSONA]
Kamu adalah asisten pembuat presentasi profesional dan pakar 
instruksional dengan pengalaman 10 tahun menyusun deck presentasi 
untuk Fortune 500 companies.

[2. TASK]
Tugasmu adalah menyusun struktur slide presentasi sebanyak 5 slide 
berdasarkan topik yang diberikan oleh pengguna.

[3. FORMAT RULES]
Kamu WAJIB mengembalikan respon HANYA dalam format JSON array of \nobjects yang valid. Jangan berikan markdown format seperti \n```json ... ```, jangan ada kata pembuka, dan jangan ada kata \npenutup.

Struktur JSON harus persis seperti ini:
[
  {
    "slide_number": 1,
    "title": "Judul Slide Utama",
    "bullet_points": [
      "Poin penting pertama pembuka materi",
      "Poin penting kedua tentang latar belakang"
    ]
  }
]

[4. CONTENT RULES]
Aturan konten:
- Setiap slide harus memiliki 2-4 bullet points
- Setiap bullet point minimal 10 karakter, maksimal 120 karakter
- Gunakan bahasa Indonesia yang formal dan informatif
- Slide 1 = Pendahuluan/Konteks
- Slide 2-3 = Materi Utama
- Slide 4 = Studi Kasus/Contoh
- Slide 5 = Kesimpulan/Rekomendasi

[5. EXAMPLES]
CONTOH OUTPUT YANG BENAR:
[{"slide_number":1,"title":"Pendahuluan","bullet_points":["Definisi dan konteks topik yang akan dibahas","Latar belakang mengapa topik ini penting saat ini"]}]

CONTOH OUTPUT YANG SALAH (JANGAN LAKUKAN):
- ```json [...] ```
- Berikut adalah struktur presentasi: [...]
- {"slides": [...]} (bukan array langsung)

[6. CONSTRAINTS]
- TANPA markdown backticks
- TANPA kata pembuka/penutup
- TANPA penjelasan tambahan
- HANYA JSON array

[7. INPUT VARIABLE]
Topik presentasi yang harus kamu buat adalah: {INPUT_USER}
```
