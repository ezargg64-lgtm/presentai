/**
 * PresentAI - UI Helpers
 * Utility functions for managing UI states (loading, error, toast, etc.)
 */

/**
 * Show a toast notification at the bottom-right corner.
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the toast (ms), default 2000
 */
function showToast(message, duration = 2000) {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, duration);
}

/**
 * Show the skeleton loading state.
 * Hides: empty state, presentation wrapper, error container.
 * Shows: skeleton container.
 */
function showLoading() {
  const emptyState = document.getElementById('emptyState');
  const skeleton = document.getElementById('skeletonContainer');
  const presentation = document.getElementById('presentationWrapper');
  const error = document.getElementById('errorContainer');

  if (emptyState) emptyState.classList.add('hidden');
  if (error) error.classList.add('hidden');
  if (presentation) presentation.classList.add('hidden');
  if (skeleton) skeleton.classList.remove('hidden');
}

/**
 * Hide the skeleton loading state and show the presentation.
 */
function hideLoading() {
  const skeleton = document.getElementById('skeletonContainer');
  const presentation = document.getElementById('presentationWrapper');

  if (skeleton) skeleton.classList.add('hidden');
  if (presentation) presentation.classList.remove('hidden');
}

/**
 * Show an error message to the user.
 * @param {string} message - The error message to display
 */
function showError(message) {
  const skeleton = document.getElementById('skeletonContainer');
  const presentation = document.getElementById('presentationWrapper');
  const error = document.getElementById('errorContainer');
  const errorMsg = document.getElementById('errorMessage');

  if (skeleton) skeleton.classList.add('hidden');
  if (presentation) presentation.classList.add('hidden');
  if (error) error.classList.remove('hidden');
  if (errorMsg) errorMsg.textContent = message;
}

/**
 * Hide the error container.
 */
function hideError() {
  const error = document.getElementById('errorContainer');
  if (error) error.classList.add('hidden');
}

/**
 * Set loading state on a button (disable + change text).
 * @param {HTMLButtonElement} button - The button element
 * @param {boolean} isLoading - Whether to show loading state
 */
function setButtonLoading(button, isLoading) {
  if (!button) return;

  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Memproses...';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Buat Presentasi';
  }
}
