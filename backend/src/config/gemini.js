const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validasi API key saat module di-load
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    'GEMINI_API_KEY tidak ditemukan di environment variables. ' +
    'Pastikan file .env sudah dikonfigurasi dengan benar.'
  );
}

/**
 * Instance Google Generative AI yang sudah dikonfigurasi
 * dengan API key dari environment variable.
 * @type {GoogleGenerativeAI}
 */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Mendapatkan model Gemini 1.5 Flash yang siap digunakan
 * untuk generate konten presentasi.
 * @returns {import('@google/generative-ai').GenerativeModel} Model Gemini 1.5 Flash
 */
function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  });
}

module.exports = { genAI, getModel };
