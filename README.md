# PresentAI 🎯
> AI-Powered Presentation Structure Generator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Site-1E1E1E?style=for-the-badge&logo=vercel&logoColor=white)](https://presentai-kappa.vercel.app)
[![API Health](https://img.shields.io/badge/API%20Health-Check%20Status-3D5A45?style=for-the-badge&logo=google-cloud&logoColor=white)](https://presentai-backend-618424515524.us-central1.run.app/api/health)
[![License](https://img.shields.io/badge/License-MIT-C4A484?style=for-the-badge)](LICENSE)

A web application that automates the generation of presentation slide structures using the Google Gemini API. Designed with a premium editorial design approach that avoids the generic "AI template" aesthetic.

🌐 **Live Demo:** [https://presentai-kappa.vercel.app](https://presentai-kappa.vercel.app)

---

## ✨ Key Features

- 🤖 **AI-Powered Generation** — Generates a 5-slide presentation structure from a short topic input using Google Gemini 1.5 Flash.
- 🎨 **Premium Editorial Design** — Dynamic asymmetric slide layouts with Playfair Display + Inter typography, and a Warm Minimalist color palette.
- 📱 **Responsive Design** — Fully optimized for desktop, tablet, and mobile screens.
- ⌨️ **Interactive Navigation** — Next/Prev navigation buttons and keyboard arrow key support.
- 📋 **Copy-to-Clipboard** — Copy individual slide content with a single click.
- ⚡ **Skeleton Loading** — A polished UX with skeleton loading states that match the actual slide layouts.
- 🛡️ **Security** — Rate limiting, CORS protection, input validation, and environment variable management.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+ Modules) |
| **Backend** | Node.js, Express.js |
| **AI Integration** | Google Gemini 1.5 Flash API |
| **Deployment (Production)** | Vercel (Frontend), Google Cloud Run (Backend) |
| **Deployment (Free Alternative)** | Vercel (Frontend), Render / Railway / Supabase (Backend) |
| **Development Tools** | Postman, Google AI Studio, GitHub Copilot |

---

## 🚀 Live Demo

| Service | URL | Status |
|---------|-----|--------|
| 🌐 **Frontend** | [https://presentai-kappa.vercel.app](https://presentai-kappa.vercel.app) | ✅ Live |
| 🔌 **API Health** | [https://presentai-backend-618424515524.us-central1.run.app/api/health](https://presentai-backend-618424515524.us-central1.run.app/api/health) | ✅ Active |

---

## 📸 Screenshots

### Hero Section
Minimalist warm input interface with a large text area for inputting the presentation topic, featuring hover effects on the "Generate Presentation" button.

### Slide Layout A — Split Screen (Odd-Numbered Slides)
An asymmetric 2-column layout: a large title on the left (40% width) using Playfair Display, and bullet points on the right (60% width) with custom terracotta-colored "—" bullets.

### Slide Layout B — Focus Top (Even-Numbered Slides)
A top-focused layout with a left-accented title, a large block quote highlighted in the center, and a 2-column grid for supporting bullet points.

---

## 🧠 Prompt Engineering

This project demonstrates advanced prompt engineering techniques:

- **Strict System Prompt** — Explicit instructions to return a raw JSON array without markdown formatting.
- **Multi-Layer Parsing** — A 4-stage fallback strategy to handle invalid AI responses gracefully.
- **Content Validation** — Validates structure, length, and data types for each generated slide.
- **Error Recovery** — Graceful degradation with user-friendly error messages.

```javascript
// System prompt example
const prompt = `You MUST return the response ONLY in a valid JSON array format.
DO NOT wrap it in markdown, and DO NOT include any introductory or concluding text.`;
```

---

## 🏗️ System Architecture

```
[User Input] → [Frontend - Vercel] → [Backend - Cloud Run] → [Gemini API]
                                                          ↓
[Slide View] ← [JSON Parser] ← [Backend] ← [AI Response]
```

**Data Flow:**
1. User enters a topic in the frontend (hosted on Vercel).
2. Frontend sends a POST request to `/api/generate` (hosted on Cloud Run).
3. Backend wraps the topic in a strict system prompt.
4. Gemini API processes the prompt and returns raw text.
5. Backend parses, validates, and returns the response as JSON.
6. Frontend renders the slides using dynamic layouts.

---

## 📡 API Documentation

### Generate Presentation
```http
POST /api/generate
Content-Type: application/json

{
  "topic": "Dampak AI dalam Pendidikan"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "slide_number": 1,
      "title": "Introduction",
      "bullet_points": [
        "Definition of AI and its growth in the education sector",
        "Context on why integrating AI has become an urgent need"
      ]
    }
  ]
}
```

**Response Error (400/429/500):**
```json
{
  "success": false,
  "error": "User-friendly error message",
  "details": "Technical details (development mode only)"
}
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-30T10:00:00.000Z"
}
```

> 📄 **Full API Documentation:** see [API.md](docs/API.md)

---

## 🛡️ Security Features

- ✅ **Rate Limiting** — 10 requests per minute per IP address.
- ✅ **CORS Protection** — Whitelisted frontend domains.
- ✅ **Input Validation** — HTML tag sanitization and input length limits.
- ✅ **Helmet.js** — Secure HTTP headers (XSS and clickjacking protection).
- ✅ **Environment Variables** — Keeps the API key out of the code.
- ✅ **Error Handling** — Prevents stack traces from leaking in production.

> 📄 **Full Security Guidelines:** see [SECURITY.md](SECURITY.md)

---

## 🏃 How to Run Locally

### Prerequisites
- Node.js 20+
- Google Gemini API Key ([get it here](https://aistudio.google.com))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/presentai.git
cd presentai
```

### 2. Set Up the Backend
```bash
cd backend
cp .env.example .env
# Edit .env and enter your GEMINI_API_KEY
npm install
npm run dev
```

### 3. Set Up the Frontend
```bash
cd ../frontend
# Open index.html using Live Server (VS Code extension)
# Or serve it via Python: python -m http.server 8080
```

### 4. Access the Application
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- API Health Check: http://localhost:3000/api/health

---

## 🚀 Deployment

### Production Setup
| Layer | Platform | URL |
|-------|----------|-----|
| Frontend | **Vercel** | https://presentai-kappa.vercel.app |
| Backend | **Google Cloud Run** | https://presentai-backend-618424515524.us-central1.run.app |

### Free Tier Alternatives (Limited Budget)
| Layer | Platform | Benefits |
|-------|----------|----------|
| Frontend | **Vercel** | Free, auto-deploy, global CDN |
| Backend | **Render** | Free tier, spins down after 15 minutes of inactivity |
| Backend | **Railway** | Free tier, faster build/startup than Render |
| Backend | **Supabase Edge Functions** | Free tier, serverless architecture |
| Backend | **Fly.io** | Generous free allowance |

> 📄 **Full Deployment Guide:** see [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 📝 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_api_key_here
PORT=8080
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### Frontend
```env
API_URL=http://localhost:3000/api
```

---

## 📁 Project Structure

```
presentai/
├── README.md                 ← Main documentation
├── CHANGELOG.md              ← Version tracking
├── LICENSE                   ← MIT License
│
├── backend/                  ← Node.js + Express API
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile            ← For Cloud Run deployment
│   ├── cloudbuild.yaml       ← GCP CI/CD config
│   ├── SECURITY.md           ← Security guidelines
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       └── utils/
│
├── frontend/                 ← HTML + CSS + JS client
│   ├── index.html
│   ├── DESIGN.md             ← Design system specifications
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── slideRenderer.js
│   │   └── uiHelpers.js
│   └── assets/
│
└── docs/                     ← Shared documentation
    ├── API.md
    ├── PROMPTING.md          ← Prompt engineering guide
    └── DEPLOYMENT.md
```

---

## 🎨 Design System

PresentAI uses a **Warm Minimalist Editorial** design approach:

| Element | Specification |
|--------|--------|
| **Palette** | Off-white `#FAF8F5`, Charcoal `#1E1E1E`, Terracotta `#C4A484` |
| **Typography** | Playfair Display (headings) + Inter (body) |
| **Layouts** | Asymmetric — Split Screen (odd-numbered) & Focus Top (even-numbered) |
| **Shadows** | Ultra-subtle `0 4px 20px rgba(0,0,0,0.03)` |
| **Loading** | Interactive Skeleton layout (no spinner) |

> 📄 **Full Design System Specs:** see [DESIGN.md](frontend/DESIGN.md)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgments

- [Google AI Studio](https://aistudio.google.com) — Gemini API
- [Vercel](https://vercel.com) — Frontend Hosting
- [Google Cloud Run](https://cloud.google.com/run) — Backend Hosting
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) & [Inter](https://fonts.google.com/specimen/Inter) — Typography

---

⭐ Star this repo if you find it helpful!

---

*Built with ❤️ and ☕ by [Your Name]*
