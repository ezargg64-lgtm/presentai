const express = require('express');
const router = express.Router();

const { validateTopic } = require('../middleware/validateInput');
const { generatePresentation } = require('../controllers/presentationController');

/**
 * POST /api/generate
 * Menghasilkan presentasi berdasarkan topik yang diberikan.
 * Melewati middleware validateTopic sebelum masuk ke controller.
 */
router.post('/generate', validateTopic, generatePresentation);

/**
 * GET /api/health
 * Health check endpoint untuk memastikan server berjalan.
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
