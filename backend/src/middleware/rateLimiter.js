const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware untuk membatasi jumlah request per IP.
 * Default: 10 request per menit per IP.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60 * 1000, // 1 menit
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 10,          // 10 request per window
  message: {
    success: false,
    error: 'Terlalu banyak request. Coba lagi dalam 1 menit.',
  },
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
});

module.exports = { apiLimiter };
