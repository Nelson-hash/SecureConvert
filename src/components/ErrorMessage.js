export class ErrorMessage {
  constructor() {
    this.isVisible = false;
    this.currentError = null;
    this.autoHideTimeout = null;
  }
  
  render() {
    return `
      <div class="error" id="error" style="display: none;">
        <div class="error-header">
          <span class="error-icon">⚠️</span>
          <span class="error-title">Error</span>
          <button class="error-close" id="errorClose" aria-label="Close error">✕</button>
        </div>
        <div class="error-message" id="errorMessage"></div>
        <div class="error-suggestions" id="errorSuggestions" style="display: none;"></div>
      </div>
    `;
  }
  
  show(message, options = {}) {
    this.isVisible = true;
    this.currentError = message;
    
    const element = document.getElementById('error');
    const messageEl = document.getElementById('errorMessage');
    const suggestionsEl = document.getElementById('errorSuggestions');
    const closeBtn = document.getElementById('errorClose');
    
    if (element && messageEl) {
      element.style.display = 'block';
      messageEl.textContent = message;
      
      // Add suggestions if provided
      if (options.suggestions && suggestionsEl) {
        suggestionsEl.style.display = 'block';
        suggestionsEl.innerHTML = `
          <p><strong>Try these solutions:</strong></p>
          <ul>
            ${options.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
          </ul>
        `;
      } else if (suggestionsEl) {
        suggestionsEl.style.display = 'none';
      }
      
      // Set up close button
      if (closeBtn) {
        closeBtn.onclick = () => this.hide();
      }
      
      // Auto-hide after delay if specified
      if (options.autoHide) {
        this.autoHideTimeout = setTimeout(() => {
          this.hide();
        }, options.autoHide);
      }
      
      // Add error type class for styling
      element.className = `error ${options.type || 'general'}`;
      
      // Scroll to error if it's not visible
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
  
  hide() {
    this.isVisible = false;
    this.currentError = null;
    
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
      this.autoHideTimeout = null;
    }
    
    const element = document.getElementById('error');
    if (element) {
      element.style.display = 'none';
    }
  }
  
  showFileError(message) {
    this.show(message, {
      type: 'file-error',
      suggestions: [
        'Check that your file is not corrupted',
        'Try a different file format',
        'Ensure the file size is under 100MB',
        'Refresh the page and try again'
      ],
      autoHide: 8000
    });
  }
  
  showConversionError(message) {
    this.show(message, {
      type: 'conversion-error',
      suggestions: [
        'Try refreshing the page',
        'Check your internet connection for library loading',
        'Try a different output format',
        'Contact support if the problem persists'
      ]
    });
  }
  
  showLibraryError(missingLibraries) {
    this.show(`Required libraries failed to load: ${missingLibraries.join(', ')}`, {
      type: 'library-error',
      suggestions: [
        'Refresh the page to retry loading',
        'Check your internet connection',
        'Disable ad blockers that might block CDN resources',
        'Try using a different browser'
      ]
    });
  }
  
  isShowing() {
    return this.isVisible;
  }
  
  getCurrentError() {
    return this.currentError;
  }
}
