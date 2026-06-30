/**
 * PresentAI - Main Application
 * Entry point that wires up event listeners and orchestrates the UI.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── DOM Elements ────────────────────────────────────────────────────
  const topicInput = document.getElementById('topicInput');
  const generateBtn = document.getElementById('generateBtn');
  const charCounter = document.getElementById('charCounter');
  const styleSelect = document.getElementById('styleSelect');

  // ── Event Listeners ─────────────────────────────────────────────────

  // Generate button click
  generateBtn.addEventListener('click', handleGenerate);

  // Enter key (without Shift) triggers generate
  topicInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  });

  // Character counter
  topicInput.addEventListener('input', () => {
    const len = topicInput.value.trim().length;
    if (charCounter) {
      charCounter.textContent = `${len} / 200`;
      charCounter.classList.toggle('over-limit', len > 200);
    }
  });

  // Navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  document.addEventListener('keydown', (e) => {
    // Don't hijack when typing in textarea
    if (document.activeElement === topicInput) return;

    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Retry button
  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      hideError();
      topicInput.focus();
    });
  }

  // ── Handlers ────────────────────────────────────────────────────────

  async function handleGenerate() {
    const topic = topicInput.value.trim();
    const style = styleSelect ? styleSelect.value : 'general';

    // Client-side validation
    if (!topic || topic.length < 3) {
      showToast('Topik minimal 3 karakter.');
      topicInput.focus();
      return;
    }

    if (topic.length > 200) {
      showToast('Topik maksimal 200 karakter.');
      topicInput.focus();
      return;
    }

    try {
      setButtonLoading(generateBtn, true);
      showLoading();

      const slides = await generatePresentation(topic, style);
      renderSlides(slides);
      hideLoading();

      showToast('Presentasi berhasil dibuat!');
    } catch (error) {
      showError(error.message);
    } finally {
      setButtonLoading(generateBtn, false);
    }
  }

  // ── Init ────────────────────────────────────────────────────────────

  async function init() {
    try {
      await checkHealth();
      console.log('[PresentAI] Backend connected.');
    } catch (e) {
      console.warn('[PresentAI] Backend not reachable:', e.message);
    }

    topicInput.focus();
  }

  init();
});
