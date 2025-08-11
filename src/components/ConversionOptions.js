export class ConversionOptions {
  constructor(options = {}) {
    this.onFormatSelect = options.onFormatSelect || (() => {});
    this.isVisible = false;
    this.selectedFormat = null;
  }
  
  render() {
    return `
      <div class="conversion-options" id="conversionOptions" style="display: none;">
        <h3 style="margin-bottom: 15px; color: #4a5568;">🔄 Convert to:</h3>
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
        button.setAttribute('data-format', format.value);
        button.onclick = () => this.selectFormat(format.value, button);
        selector.appendChild(button);
      });
    }
  }
  
  selectFormat(format, button) {
    // Remove previous selection
    const allOptions = document.querySelectorAll('.format-option');
    allOptions.forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Select current
    if (button) {
      button.classList.add('selected');
    }
    
    this.selectedFormat = format;
    this.onFormatSelect(format);
  }
  
  hide() {
    this.isVisible = false;
    this.selectedFormat = null;
    
    const element = document.getElementById('conversionOptions');
    if (element) {
      element.style.display = 'none';
    }
  }
  
  getSelectedFormat() {
    return this.selectedFormat;
  }
}
