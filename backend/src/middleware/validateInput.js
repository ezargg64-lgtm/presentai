/**
 * Middleware untuk memvalidasi dan men-sanitize input topic presentasi.
 * Cek keberadaan, tipe data, panjang karakter, dan membersihkan HTML tags.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateTopic(req, res, next) {
  let { topic } = req.body;

  // Cek keberadaan topic
  if (!topic) {
    return res.status(400).json({
      success: false,
      error: 'Topic harus antara 3-200 karakter',
    });
  }

  // Cek tipe data string
  if (typeof topic !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Topic harus antara 3-200 karakter',
    });
  }

  // Sanitize: hapus HTML tags menggunakan regex
  topic = topic.replace(/<[^>]*>/g, '');

  // Trim whitespace
  topic = topic.trim();

  // Cek panjang karakter (min 3, max 200)
  if (topic.length < 3 || topic.length > 200) {
    return res.status(400).json({
      success: false,
      error: 'Topic harus antara 3-200 karakter',
    });
  }

  // Set topic yang sudah di-sanitize kembali ke req.body
  req.body.topic = topic;

  next();
}

module.exports = { validateTopic };
