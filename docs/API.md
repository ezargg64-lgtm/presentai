# API Documentation — PresentAI

> **Versi:** 1.0  
> **Base URL:** `https://presentai-backend.onrender.com/api`  
> **Terakhir Update:** 2026-06-29  
> **Status:** Production Ready

---

## 1. Overview

PresentAI Backend menyediakan REST API sederhana dengan 2 endpoint utama:
1. **POST /generate** — Generate struktur presentasi dari topik
2. **GET /health** — Health check status server

Semua request/response menggunakan format **JSON** dengan `Content-Type: application/json`.

---

## 2. Authentication

PresentAI API tidak menggunakan authentication token. Keamanan dijamin melalui:
- **Rate Limiting** — Maksimal 10 request per menit per IP
- **CORS** — Hanya domain frontend yang di-whitelist
- **Input Validation** — Sanitasi dan validasi input

---

## 3. Endpoints

### 3.1 Generate Presentation

Generate struktur slide presentasi dari input topik.

```http
POST /api/generate
Content-Type: application/json
```

#### Request Body

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `topic` | string | Yes | Topik presentasi yang ingin dibuat | Min 3 chars, Max 200 chars |

#### Request Example

```json
{
  "topic": "Dampak AI dalam Pendidikan Indonesia"
}
```

#### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "slide_number": 1,
      "title": "Pendahuluan: Revolusi AI di Dunia Pendidikan",
      "bullet_points": [
        "Definisi AI dan perkembangannya dalam dunia pendidikan",
        "Latar belakang mengapa integrasi AI menjadi kebutuhan mendesak"
      ]
    },
    {
      "slide_number": 2,
      "title": "Dampak Positif AI dalam Pembelajaran",
      "bullet_points": [
        "Personalized learning berbasis data siswa",
        "Automated grading dan feedback instan",
        "Akses ke tutor virtual 24/7"
      ]
    },
    {
      "slide_number": 3,
      "title": "Tantangan dan Risiko Implementasi AI",
      "bullet_points": [
        "Kesenjangan digital antar daerah di Indonesia",
        "Privasi data siswa dan etika penggunaan AI",
        "Ketergantungan berlebihan pada teknologi"
      ]
    },
    {
      "slide_number": 4,
      "title": "Studi Kasus: AI di Sekolah Indonesia",
      "bullet_points": [
        "Penggunaan Ruangguru dan Zenius sebagai platform AI-powered",
        "Hasil penelitian: peningkatan 30% hasil belajar dengan AI tutor"
      ]
    },
    {
      "slide_number": 5,
      "title": "Kesimpulan dan Rekomendasi",
      "bullet_points": [
        "AI bukan pengganti guru, melainkan alat pendamping",
        "Perlu regulasi dan training untuk guru dalam menggunakan AI",
        "Kolaborasi pemerintah, sekolah, dan teknologi untuk implementasi merata"
      ]
    }
  ]
}
```

#### Error Responses

**400 Bad Request — Input tidak valid**

```json
{
  "success": false,
  "error": "Topik harus antara 3-200 karakter"
}
```

**429 Too Many Requests — Rate limit terlampaui**

```json
{
  "success": false,
  "error": "Terlalu banyak request. Coba lagi dalam 1 menit."
}
```

**500 Internal Server Error — Gemini API error atau parsing gagal**

```json
{
  "success": false,
  "error": "Gagal memproses respons AI"
}
```

**500 Internal Server Error — Format presentasi tidak valid**

```json
{
  "success": false,
  "error": "Format presentasi tidak valid"
}
```

---

### 3.2 Health Check

Cek status kesehatan server dan koneksi ke Gemini API.

```http
GET /api/health
```

#### Success Response (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2026-06-29T10:30:00.000Z"
}
```

#### Error Response (503 Service Unavailable)

```json
{
  "status": "error",
  "timestamp": "2026-06-29T10:30:00.000Z",
  "error": "Gemini API connection failed"
}
```

---

## 4. Error Codes

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| **200** | OK | Request berhasil diproses |
| **400** | Bad Request | Input tidak valid (kosong, terlalu pendek/panjang) |
| **429** | Too Many Requests | Rate limit terlampaui (10 req/menit) |
| **500** | Internal Server Error | Gemini API error, parsing gagal, atau unexpected error |

---

## 5. Rate Limiting

| Limit | Value |
|-------|-------|
| **Window** | 1 menit (60.000 ms) |
| **Max Requests** | 10 per IP |
| **Headers** | `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` |

### 5.1 Rate Limit Headers

```http
RateLimit-Limit: 10
RateLimit-Remaining: 7
RateLimit-Reset: 1719648000
```

---

## 6. CORS Policy

| Setting | Value |
|---------|-------|
| **Allowed Origins** | `https://presentai.vercel.app` (production), `http://localhost:5173` (development) |
| **Allowed Methods** | `GET`, `POST` |
| **Allowed Headers** | `Content-Type` |
| **Credentials** | `false` |

---

## 7. SDK & Integration

### 7.1 JavaScript (Fetch)

```javascript
const API_URL = 'https://presentai-backend.onrender.com/api';

async function generatePresentation(topic) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data.data; // Array of slides

  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
}

// Usage
const slides = await generatePresentation('Dampak AI dalam Pendidikan');
console.log(slides);
```

### 7.2 cURL

```bash
# Generate presentation
curl -X POST https://presentai-backend.onrender.com/api/generate   -H "Content-Type: application/json"   -d '{"topic": "Dampak AI dalam Pendidikan"}'

# Health check
curl https://presentai-backend.onrender.com/api/health
```

### 7.3 Python (Requests)

```python
import requests

API_URL = "https://presentai-backend.onrender.com/api"

def generate_presentation(topic):
    response = requests.post(
        f"{API_URL}/generate",
        json={"topic": topic},
        timeout=30
    )
    response.raise_for_status()
    return response.json()["data"]

# Usage
slides = generate_presentation("Dampak AI dalam Pendidikan")
for slide in slides:
    print(f"Slide {slide['slide_number']}: {slide['title']}")
```

---

## 8. Data Models

### 8.1 Slide Object

```typescript
interface Slide {
  slide_number: number;      // 1-5, sequential
  title: string;             // Judul slide
  bullet_points: string[];   // 2-4 items, 10-120 chars each
}
```

### 8.2 Generate Response

```typescript
interface GenerateResponse {
  success: boolean;
  data?: Slide[];            // Present if success=true
  error?: string;             // Present if success=false
  details?: string;           // Development only
}
```

### 8.3 Health Response

```typescript
interface HealthResponse {
  status: "ok" | "error";
  timestamp: string;         // ISO 8601 format
  error?: string;            // Present if status="error"
}
```

---

## 9. Testing

### 9.1 Postman Collection

```json
{
  "info": {
    "name": "PresentAI API",
    "description": "API collection for PresentAI"
  },
  "item": [
    {
      "name": "Generate Presentation",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "url": "{{base_url}}/generate",
        "body": {
          "mode": "raw",
          "raw": "{\"topic\": \"Dampak AI dalam Pendidikan\"}"
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    }
  ],
  "variable": [
    {"key": "base_url", "value": "https://presentai-backend.onrender.com/api"}
  ]
}
```

---

## 10. Contact & Reporting

Laporkan isu keamanan atau bug ke repositori GitHub.
