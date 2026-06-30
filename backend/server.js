require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const apiRoutes = require('./src/routes/api');
const { apiLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(helmet());
app.use(morgan('dev'));

// Rate limiter (diterapkan ke semua routes API)
app.use('/api', apiLimiter);

// ── ROUTES ──────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── GLOBAL ERROR HANDLER ────────────────────────────────────────────────
app.use(errorHandler);

// ── START SERVER ────────────────────────────────────────────────────────
async function startServer() {
  try {
    // Test koneksi ke Gemini API saat startup (health check)
    const { getModel } = require('./src/config/gemini');
    const model = getModel();
    console.log('[Startup] Gemini API configured successfully, model: gemini-2.5-flash');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[Startup Error] Failed to initialize server:', error.message);
    process.exit(1);
  }
}

startServer();
