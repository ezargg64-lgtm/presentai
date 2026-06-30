/**
 * PresentAI - Slide Renderer
 * Handles rendering of individual slides, layout selection,
 * navigation, and copy-to-clipboard functionality.
 */

let currentSlideIndex = 0;
let slidesData = [];

/**
 * Initialize and render slides from AI-generated data.
 * @param {Array<Object>} data - Array of 5 slide objects
 */
function renderSlides(data) {
  slidesData = data;
  currentSlideIndex = 0;
  renderSingleSlide(0);
  updateNavigation();
}

/**
 * Render a single slide by index, choosing layout based on parity.
 * Odd slide_number → split layout, Even slide_number → focus layout.
 * @param {number} index - The slide index (0-based)
 */
function renderSingleSlide(index) {
  const container = document.getElementById('slideContainer');
  if (!container || !slidesData[index]) return;

  const slide = slidesData[index];

  // Ganjil = split, genap = focus (berdasarkan slide_number)
  const isOdd = slide.slide_number % 2 !== 0;
  const html = isOdd ? buildLayoutSplit(slide) : buildLayoutFocus(slide);

  container.innerHTML = html;
}

/**
 * Layout A: Split Screen — title on left, bullet points on right.
 * @param {Object} slide - Slide data object
 * @returns {string} HTML string
 */
function buildLayoutSplit(slide) {
  const bulletItems = slide.bullet_points
    .map(bp => `<li>${escapeHtml(bp)}</li>`)
    .join('');

  return `
    <div class="slide-card layout-split">
      <div class="slide-title-col">
        <div class="slide-number">Slide ${slide.slide_number}</div>
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
      </div>
      <div class="slide-content-col">
        <ul>${bulletItems}</ul>
      </div>
      <button class="btn-copy" onclick="copySlideText(${slide.slide_number - 1})" title="Salin teks slide">Salin</button>
    </div>
  `;
}

/**
 * Layout B: Focus Top — header with accent border, quote, then grid.
 * @param {Object} slide - Slide data object
 * @returns {string} HTML string
 */
function buildLayoutFocus(slide) {
  const gridItems = slide.bullet_points
    .slice(1)
    .map(bp => `<div class="grid-item">${escapeHtml(bp)}</div>`)
    .join('');

  return `
    <div class="slide-card layout-focus">
      <div class="slide-header">
        <div class="slide-number">Slide ${slide.slide_number}</div>
        <h2 class="slide-title">${escapeHtml(slide.title)}</h2>
      </div>
      <div class="slide-quote">"${escapeHtml(slide.bullet_points[0])}"</div>
      <div class="slide-grid">
        ${gridItems}
      </div>
      <button class="btn-copy" onclick="copySlideText(${slide.slide_number - 1})" title="Salin teks slide">Salin</button>
    </div>
  `;
}

/**
 * Update navigation buttons and dot indicators.
 */
function updateNavigation() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dotsContainer');
  const slideCounter = document.getElementById('slideCounter');

  if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
  if (nextBtn) nextBtn.disabled = currentSlideIndex === slidesData.length - 1;

  // Update dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < slidesData.length; i++) {
      const dot = document.createElement('button');
      dot.className = `dot${i === currentSlideIndex ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Update counter
  if (slideCounter) {
    slideCounter.textContent = `${currentSlideIndex + 1} / ${slidesData.length}`;
  }
}

/**
 * Navigate to the next slide.
 */
function nextSlide() {
  if (currentSlideIndex < slidesData.length - 1) {
    currentSlideIndex++;
    renderSingleSlide(currentSlideIndex);
    updateNavigation();
  }
}

/**
 * Navigate to the previous slide.
 */
function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderSingleSlide(currentSlideIndex);
    updateNavigation();
  }
}

/**
 * Jump to a specific slide.
 * @param {number} index - The slide index (0-based)
 */
function goToSlide(index) {
  if (index >= 0 && index < slidesData.length) {
    currentSlideIndex = index;
    renderSingleSlide(currentSlideIndex);
    updateNavigation();
  }
}

/**
 * Copy the text of a specific slide to clipboard and show a toast.
 * @param {number} index - The slide index (0-based)
 */
async function copySlideText(index) {
  if (!slidesData[index]) return;

  const slide = slidesData[index];
  const text = `Slide ${slide.slide_number}: ${slide.title}\\n\\n` +
    slide.bullet_points.map((bp, i) => `${i + 1}. ${bp}`).join('\\n');

  try {
    await navigator.clipboard.writeText(text);
    showToast('Teks slide berhasil disalin!');
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Teks slide berhasil disalin!');
  }
}

/**
 * Escape HTML entities to prevent XSS.
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
