const { getModel } = require('../config/gemini');
const { cleanAndParseJSON, validateSlideStructure } = require('../utils/jsonCleaner');

/**
 * Controller untuk menghasilkan presentasi menggunakan Gemini AI.
 * Menerima topik dari request body, membangun prompt, memanggil AI,
 * dan mengembalikan 5 slide presentasi terstruktur.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
async function generatePresentation(req, res, next) {
  try {
    // ── LANGKAH 1: VALIDASI INPUT ──────────────────────────────────────
    const { topic, style } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Topic harus berupa string yang valid',
      });
    }

    const trimmedTopic = topic.trim();

    if (trimmedTopic.length < 3 || trimmedTopic.length > 200) {
      return res.status(400).json({
        success: false,
        error: 'Topic harus antara 3-200 karakter',
      });
    }

    const validStyles = ['general', 'academic', 'business', 'kids'];
    const selectedStyle = style || 'general';
    if (!validStyles.includes(selectedStyle)) {
      return res.status(400).json({
        success: false,
        error: 'Style presentasi tidak valid',
      });
    }

    // ── LANGKAH 2: BUILD SYSTEM PROMPT ─────────────────────────────────
    let promptRole = '';
    let promptStructure = '';
    let promptRules = '';

    if (selectedStyle === 'academic') {
      promptRole = 'Kamu adalah dosen senior dengan pengalaman mengajar 15 tahun.';
      promptStructure = `STRUKTUR AKADEMIK:\n- Slide 1: LATAR BELAKANG\n- Slide 2: TINJAUAN PUSTAKA\n- Slide 3: METODOLOGI\n- Slide 4: HASIL & PEMBAHASAN\n- Slide 5: KESIMPULAN & SARAN`;
      promptRules = `- Setiap slide harus memiliki 2-4 bullet points\n- Setiap bullet point minimal 10 karakter, maksimal 120 karakter\n- Gunakan bahasa Indonesia yang formal dan informatif (bahasa Indonesia baku, istilah tepat)`;
    } else if (selectedStyle === 'business') {
      promptRole = 'Kamu adalah konsultan manajemen senior di McKinsey & Company.';
      promptStructure = `STRUKTUR BISNIS:\n- Slide 1: EXECUTIVE SUMMARY\n- Slide 2: CURRENT STATE ANALYSIS\n- Slide 3: STRATEGIC OPTIONS\n- Slide 4: RECOMMENDED APPROACH\n- Slide 5: NEXT STEPS & IMPACT`;
      promptRules = `- Setiap slide harus memiliki 2-4 bullet points\n- Setiap bullet point minimal 10 karakter, maksimal 120 karakter\n- Gunakan bahasa Indonesia yang formal, action-oriented, data-driven, dan executive-friendly`;
    } else if (selectedStyle === 'kids') {
      promptRole = 'Kamu adalah guru SD yang kreatif dan sabar.';
      promptStructure = `STRUKTUR KONTEN:\n- Slide 1: APA ITU? (dengan analogi sederhana)\n- Slide 2: MENGAPA PENTING?\n- Slide 3: BAGAIMANA CARA KERJANYA?\n- Slide 4: CONTOH DI KEHIDUPAN SEHARI-HARI\n- Slide 5: YUK COBA! (aktivitas/tantangan)`;
      promptRules = `- Setiap slide harus memiliki 2-4 bullet points\n- Setiap bullet point minimal 15 karakter, maksimal 80 karakter (sangat ringkas)\n- Gunakan bahasa Indonesia sederhana yang hangat, menyenangkan, mengajak, dan tidak ada istilah sulit. Gunakan analogi familiar (makanan, hewan, game)`;
    } else {
      promptRole = 'Kamu adalah asisten pembuat presentasi profesional dan pakar instruksional.';
      promptStructure = `STRUKTUR OUTLINE:\n- Slide 1 = Pendahuluan/Konteks\n- Slide 2-3 = Materi Utama\n- Slide 4 = Studi Kasus/Contoh\n- Slide 5 = Kesimpulan/Rekomendasi`;
      promptRules = `- Setiap slide harus memiliki 2-4 bullet points\n- Setiap bullet point minimal 10 karakter, maksimal 120 karakter\n- Gunakan bahasa Indonesia yang formal dan informatif`;
    }

    const prompt = `${promptRole}\nTugasmu adalah menyusun struktur slide presentasi sebanyak 5 slide berdasarkan topik yang diberikan oleh pengguna.\n\nKamu WAJIB mengembalikan respon HANYA dalam format JSON array of objects yang valid.\nJangan berikan markdown format seperti \\\`\\\`\\\`json ... \\\`\\\`\\\`, jangan ada kata pembuka, dan jangan ada kata penutup.\n\nStruktur JSON harus persis seperti ini:\n[\n  {\n    \"slide_number\": 1,\n    \"title\": \"Judul Slide Utama\",\n    \"bullet_points\": [\n      \"Poin penting pertama pembuka materi\",\n      \"Poin penting kedua tentang latar belakang\"\n    ]\n  }\n]\n\n${promptStructure}\n\nAturan konten:\n${promptRules}\n\nTopik presentasi yang harus kamu buat adalah: ${trimmedTopic}` mapping;

    // ── LANGKAH 3: CALL GEMINI API & PARSE (WITH RETRY & DYNAMIC PROMPT ADJUSTMENT) ──
    const model = getModel();
    let responseText = '';
    let parsedSlides = null;
    let attemptError = null;

    try {
      console.log('[Gemini] Making first generation attempt...');
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
      console.log('[Gemini] Raw response received, length:', responseText.length);

      parsedSlides = cleanAndParseJSON(responseText);
      if (!Array.isArray(parsedSlides) || parsedSlides.length !== 5) {
        throw new Error('AI_RESPONSE_MALFORMED');
      }
    } catch (firstTryError) {
      console.warn('[Gemini] First attempt failed parsing/validation:', firstTryError.message);
      attemptError = firstTryError;
    }

    // Jika percobaan pertama gagal, lakukan retry dengan dynamic prompt adjustment
    if (!parsedSlides) {
      try {
        console.log('[Gemini] Retrying with dynamic prompt adjustments...');
        let retryPrompt = prompt;

        // Dynamic prompt adjustment based on specific error type
        if (attemptError.message.includes('JSON') || attemptError.message.includes('parse')) {
          retryPrompt += '\\n\\n[PENTING] Respon JSON kamu sebelumnya tidak valid. Pastikan kamu HANYA mengembalikan data JSON array yang valid, TANPA backticks markdown, pembuka, atau penjelasan.';
        } else if (attemptError.message.includes('MALFORMED')) {
          retryPrompt += '\\n\\n[PENTING] Respon JSON kamu sebelumnya tidak memiliki struktur atau jumlah slide yang tepat (harus tepat 5 slide, masing-masing dengan slide_number, title, dan bullet_points). Perbaiki skema tersebut.';
        } else {
          retryPrompt += '\\n\\n[PENTING] Respon kamu sebelumnya gagal diproses. Pastikan format output kamu 100% valid sesuai instruksi.';
        }

        const retryResult = await model.generateContent(retryPrompt);
        responseText = retryResult.response.text();
        console.log('[Gemini] Raw response (retry) received, length:', responseText.length);

        parsedSlides = cleanAndParseJSON(responseText);
        if (!Array.isArray(parsedSlides) || parsedSlides.length !== 5) {
          throw new Error('AI_RESPONSE_MALFORMED');
        }
      } catch (retryError) {
        console.error('[Gemini] Retry failed:', retryError.message);
        if (retryError.message.includes('MALFORMED') || retryError.message === 'AI_RESPONSE_MALFORMED') {
          throw new Error('AI_RESPONSE_MALFORMED');
        } else {
          throw new Error('AI_RESPONSE_INVALID');
        }
      }
    }

    // Validasi setiap slide
    for (const slide of parsedSlides) {
      if (
        typeof slide.slide_number !== 'number' ||
        typeof slide.title !== 'string' ||
        !Array.isArray(slide.bullet_points)
      ) {
        throw new Error('AI_RESPONSE_MALFORMED');
      }

      if (slide.bullet_points.length < 2 || slide.bullet_points.length > 4) {
        throw new Error('AI_RESPONSE_MALFORMED');
      }

      for (const point of slide.bullet_points) {
        if (typeof point !== 'string') {
          throw new Error('AI_RESPONSE_MALFORMED');
        }
      }
    }

    // Validasi tambahan menggunakan utility
    if (!validateSlideStructure(parsedSlides)) {
      throw new Error('AI_RESPONSE_MALFORMED');
    }

    // ── LANGKAH 6: RESPONSE ────────────────────────────────────────────
    console.log('[Success] Presentation generated for topic:', trimmedTopic);

    return res.json({
      success: true,
      data: parsedSlides,
    });
  } catch (error) {
    // Tangkap semua error, pass ke next(error)
    next(error);
  }
}

module.exports = { generatePresentation };
