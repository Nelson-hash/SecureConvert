// src/components/FileInfo.js
export class FileInfo {
  constructor() {
    this.isVisible = false;
  }
  
  render() {
    return `
      <div class="file-info" id="fileInfo" style="display: none;">
        <h3>File Selected:</h3>
        <p id="fileName"></p>
        <p id="fileSize"></p>
        <p id="fileType"></p>
      </div>
    `;
  }
  
  show(fileData) {
    this.isVisible = true;
    const element = document.getElementById('fileInfo');
    if (element) {
      element.style.display = 'block';
      document.getElementById('fileName').textContent = fileData.name;
      document.getElementById('fileSize').textContent = fileData.size;
      if (fileData.type) {
        document.getElementById('fileType').textContent = fileData.type;
      }
    }
  }
  
  hide() {
    this.isVisible = false;
    const element = document.getElementById('fileInfo');
    if (element) {
      element.style.display = 'none';
    }
  }
}

// src/components/ConversionOptions.js
export class ConversionOptions {
  constructor(options = {}) {
    this.onFormatSelect = options.onFormatSelect || (() => {});
    this.isVisible = false;
  }
  
  render() {
    return `
      <div class="conversion-options" id="conversionOptions" style="display: none;">
        <h3 style="margin-bottom: 15px; color: #4a5568;">Convert to:</h3>
        <div class="format-selector" id="formatSelector">
          <!-- Options will be populated by JavaScript -->
        </div>
      </div>
    `;
  }
  
  show(formats) {
    this.isVisible = true;
    const element = document.getElementById('conversionOptions');
    const selector = document.getElementById('formatSelector');
    
    if (element && selector) {
      element.style.display = 'block';
      selector.innerHTML = '';
      
      formats.forEach(format => {
        const button = document.createElement('button');
        button.className = 'format-option';
        button.innerHTML = `${format.icon} ${format.label}`;
        button.onclick = () => this.selectFormat(format.value, button);
        selector.appendChild(button);
      });
    }
  }
  
  selectFormat(format, button) {
    // Remove previous selection
    document.querySelectorAll('.format-option').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Select current
    button.classList.add('selected');
    this.onFormatSelect(format);
  }
  
  hide() {
    this.isVisible = false;
    const element = document.getElementById('conversionOptions');
    if (element) {
      element.style.display = 'none';
    }
  }
}

// src/components/ProgressBar.js
export class ProgressBar {
  constructor() {
    this.isVisible = false;
    this.progress = 0;
  }
  
  render() {
    return `
      <div class="progress" id="progress" style="display: none;">
        <div class="progress-bar" id="progressBar" style="width: 0%;"></div>
      </div>
    `;
  }
  
  show() {
    this.isVisible = true;
    const element = document.getElementById('progress');
    if (element) {
      element.style.display = 'block';
    }
  }
  
  hide() {
    this.isVisible = false;
    this.progress = 0;
    const element = document.getElementById('progress');
    const bar = document.getElementById('progressBar');
    if (element) {
      element.style.display = 'none';
    }
    if (bar) {
      bar.style.width = '0%';
    }
  }
  
  setProgress(percent) {
    this.progress = percent;
    const bar = document.getElementById('progressBar');
    if (bar) {
      bar.style.width = percent + '%';
    }
  }
}

// src/components/PrivacyBadge.js
export class PrivacyBadge {
  render() {
    return `
      <div class="privacy-badge">
        <span>🛡️</span>
        <span>Files never leave your device</span>
      </div>
    `;
  }
}

// src/components/ErrorMessage.js
export class ErrorMessage {
  constructor() {
    this.isVisible = false;
  }
  
  render() {
    return `
      <div class="error" id="error" style="display: none;"></div>
    `;
  }
  
  show(message) {
    this.isVisible = true;
    const element = document.getElementById('error');
    if (element) {
      element.textContent = message;
      element.style.display = 'block';
    }
  }
  
  hide() {
    this.isVisible = false;
    const element = document.getElementById('error');
    if (element) {
      element.style.display = 'none';
    }
  }
}

// src/components/ResultDisplay.js
export class ResultDisplay {
  constructor(options = {}) {
    this.onDownload = options.onDownload || (() => {});
    this.isVisible = false;
  }
  
  render() {
    return `
      <div class="result" id="result" style="display: none;">
        <h3>✅ Conversion Complete!</h3>
        <p id="resultMessage">Your file has been converted successfully.</p>
        <p id="resultDetails"></p>
        <button class="download-btn" id="downloadBtn">Download Converted File</button>
      </div>
    `;
  }
  
  show(data) {
    this.isVisible = true;
    const element = document.getElementById('result');
    const details = document.getElementById('resultDetails');
    const button = document.getElementById('downloadBtn');
    
    if (element) {
      element.style.display = 'block';
      
      if (details && data) {
        details.innerHTML = `
          <strong>Original:</strong> ${data.originalFile}<br>
          <strong>Converted:</strong> ${data.convertedFile}<br>
          <strong>Size:</strong> ${data.fileSize}
        `;
      }
      
      if (button) {
        button.onclick = this.onDownload;
      }
    }
  }
  
  hide() {
    this.isVisible = false;
    const element = document.getElementById('result');
    if (element) {
      element.style.display = 'none';
    }
  }
}

// src/components/FeatureGrid.js
export class FeatureGrid {
  render() {
    return `
      <div class="features">
        <div class="feature">
          <div class="feature-icon">🔐</div>
          <div class="feature-text">100% Private</div>
        </div>
        <div class="feature">
          <div class="feature-icon">⚡</div>
          <div class="feature-text">Instant Processing</div>
        </div>
        <div class="feature">
          <div class="feature-icon">🌐</div>
          <div class="feature-text">Works Offline</div>
        </div>
        <div class="feature">
          <div class="feature-icon">🆓</div>
          <div class="feature-text">Completely Free</div>
        </div>
      </div>
    `;
  }
}
