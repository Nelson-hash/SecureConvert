export class ProgressBar {
  constructor() {
    this.isVisible = false;
    this.progress = 0;
  }
  
  render() {
    return `
      <div class="progress" id="progress" style="display: none;">
        <div class="progress-container">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        <div class="progress-text" id="progressText">Processing...</div>
      </div>
    `;
  }
  
  show() {
    this.isVisible = true;
    const element = document.getElementById('progress');
    if (element) {
      element.style.display = 'block';
    }
    this.setProgress(0);
  }
  
  hide() {
    this.isVisible = false;
    this.progress = 0;
    
    const element = document.getElementById('progress');
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    
    if (element) {
      element.style.display = 'none';
    }
    if (bar) {
      bar.style.width = '0%';
    }
    if (text) {
      text.textContent = 'Processing...';
    }
  }
  
  setProgress(percent, message = null) {
    this.progress = Math.max(0, Math.min(100, percent));
    
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    
    if (bar) {
      bar.style.width = this.progress + '%';
      bar.setAttribute('data-progress', this.progress);
    }
    
    if (text) {
      if (message) {
        text.textContent = message;
      } else {
        text.textContent = `Processing... ${Math.round(this.progress)}%`;
      }
    }
  }
  
  getProgress() {
    return this.progress;
  }
  
  setMessage(message) {
    const text = document.getElementById('progressText');
    if (text) {
      text.textContent = message;
    }
  }
}
