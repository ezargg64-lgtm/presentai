/**
 * PresentAI - API Module
 * Handles all communication with the backend server.
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Generate a presentation from a given topic.
 * @param {string} topic - The presentation topic (3-200 characters)
 * @returns {Promise<Array>} Array of 5 slide objects
 * @throws {Error} Network, timeout, rate-limit, or server errors
 */
async function generatePresentation(topic, style = 'general') {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout

  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, style }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle specific HTTP status codes
    if (response.status === 429) {
      throw new Error('Terlalu banyak request. Coba lagi dalam 1 menit.');
    }

    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Input tidak valid.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Terjadi kesalahan pada server.');
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error('Format respons server tidak valid.');
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Coba lagi nanti.');
    }

    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.');
    }

    throw error;
  }
}

/**
 * Check if the backend server is healthy and reachable.
 * @returns {Promise<Object>} Health status object with status and timestamp
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('Server tidak merespons.');
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error('Backend tidak dapat dijangkau.');
    }
    throw error;
  }
}
