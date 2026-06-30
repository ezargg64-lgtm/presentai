/**
 * Membersihkan dan mem-parse respons teks dari AI menjadi JSON yang valid.
 * Menggunakan strategi parsing berlapis untuk menangani berbagai format output AI.
 *
 * @param {string} responseText - Teks mentah dari respons AI
 * @returns {Array<Object>} Array of slide objects yang sudah di-parse
 * @throws {Error} Jika semua strategi parsing gagal
 */
function cleanAndParseJSON(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    throw new Error('Failed to parse AI response: empty or invalid input');
  }

  // ── STRATEGI 1: Clean dasar ──────────────────────────────────────────
  // Hapus markdown backticks, code fences, dan trim whitespace
  let cleaned = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .replace(/`/g, '')
    .trim();

  // ── STRATEGI 2: Extract JSON array ───────────────────────────────────
  // Cari '[' pertama dan ']' terakhir untuk mengekstrak array JSON
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }

  // ── STRATEGI 3: Parse langsung ───────────────────────────────────────
  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (e) {
    // Lanjut ke strategi 4
  }

  // ── STRATEGI 4: Fallback - regex lebih longgar ───────────────────────
  // Coba cari pattern JSON array dengan regex yang lebih toleran
  try {
    // Hapus karakter kontrol yang mungkin menyebabkan parse error
    const sanitized = cleaned
      .replace(/[\x00-\x1F\x7F]/g, ' ')   // hapus kontrol karakter
      .replace(/,\s*]/g, ']')              // hapus trailing comma di array
      .replace(/,\s*}/g, '}')              // hapus trailing comma di object
      .replace(/'/g, '"')                  // ganti single quotes dengan double quotes
      .trim();

    const parsed = JSON.parse(sanitized);
    return parsed;
  } catch (e) {
    // Lanjut ke strategi 5
  }

  // ── STRATEGI 5: Fallback rekonstruksi dari individual objects ─────────
  try {
    const objectMatches = cleaned.match(/\{[\s\S]*?\}/g);
    if (objectMatches && objectMatches.length >= 5) {
      const reconstructed = `[${objectMatches.slice(0, 5).join(',')}]`;
      const parsed = JSON.parse(reconstructed);
      return parsed;
    }
  } catch (e) {
    // Semua strategi gagal
  }

  throw new Error('Failed to parse AI response: no valid JSON found after all strategies');
}

/**
 * Memvalidasi struktur data slide presentasi.
 *
 * @param {*} data - Data yang akan divalidasi
 * @returns {boolean} true jika struktur valid, false jika tidak
 */
function validateSlideStructure(data) {
  // Cek apakah data adalah array
  if (!Array.isArray(data)) {
    return false;
  }

  // Cek setiap item dalam array
  for (const item of data) {
    // Cek property slide_number (harus number)
    if (typeof item.slide_number !== 'number') {
      return false;
    }

    // Cek property title (harus string)
    if (typeof item.title !== 'string' || item.title.trim().length === 0) {
      return false;
    }

    // Cek property bullet_points (harus array)
    if (!Array.isArray(item.bullet_points)) {
      return false;
    }

    // Cek panjang bullet_points (2-4 item per slide)
    if (item.bullet_points.length < 2 || item.bullet_points.length > 4) {
      return false;
    }

    // Cek setiap bullet_point adalah string
    for (const point of item.bullet_points) {
      if (typeof point !== 'string') {
        return false;
      }
    }
  }

  return true;
}

module.exports = { cleanAndParseJSON, validateSlideStructure };
