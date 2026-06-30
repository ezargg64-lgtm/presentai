/**
 * Global error handler middleware.
 * Menangani berbagai jenis error dan mengembalikan respons yang user-friendly.
 * Di production, stack trace tidak akan di-expose.
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function errorHandler(err, req, res, next) {
  // Log error ke console dengan timestamp
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, err.message);
  console.error(`[${timestamp}] STACK:`, err.stack);

  const isProduction = process.env.NODE_ENV === 'production';

  // Error mapping berdasarkan pesan error
  let statusCode = 500;
  let userMessage = 'Terjadi kesalahan pada server';

  switch (err.message) {
    case 'AI_RESPONSE_INVALID':
      statusCode = 500;
      userMessage = 'Gagal memproses respons AI';
      break;

    case 'AI_RESPONSE_MALFORMED':
      statusCode = 500;
      userMessage = 'Format presentasi tidak valid';
      break;

    default:
      // Cek jika ini validation error (status 400)
      if (err.statusCode === 400 || err.status === 400) {
        statusCode = 400;
        userMessage = err.message || 'Input tidak valid';
      }
      break;
  }

  // Build response object
  const response = {
    success: false,
    error: userMessage,
  };

  // Tambahkan details hanya di development
  if (!isProduction) {
    response.details = err.message;
  }

  res.status(statusCode).json(response);
}

module.exports = { errorHandler };
