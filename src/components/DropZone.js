export class DropZone {
  constructor(options = {}) {
    this.onFileSelect = options.onFileSelect || (() => {});
    this.onDragOver = options.onDragOver || (() => {});
    this.onDragLeave = options.onDragLeave || (() => {});
    this.onDrop = options.onDrop || (() => {});
    
    this.isDragOver = false;
    this.element = null;
    this.fileInput = null;
  }
  
  render() {
    return `
      <div class="drop-zone" id="dropZone">
        <div class="drop-zone-content">
          <div class="drop-icon">📄</div>
          <div class="drop-text">Drop your file here</div>
          <div class="drop-subtext">or click to select • PDF, Images, Text files supported</div>
        </div>
        <input type="file" id="fileInput" style="display: none;" 
               accept=".pdf,.png,.jpg,.jpeg,.gif,.bmp,.webp,.txt,.csv,.json,.md">
      </div>
    `;
  }
  
  bindEvents() {
    this.element = document.getElementById('dropZone');
    this.fileInput = document.getElementById('fileInput');
    
    if (!this.element || !this.fileInput) return;
    
    // Click to select file
    this.element.addEventListener('click', () => {
      this.fileInput.click();
    });
    
    // File input change
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.onFileSelect(e.target.files[0]);
      }
    });
    
    // Drag and drop events
    this.element.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.setDragState(true);
      this.onDragOver(e);
    });
    
    this.element.addEventListener('dragleave', (e) => {
      e.preventDefault();
      this.setDragState(false);
      this.onDragLeave(e);
    });
    
    this.element.addEventListener('drop', (e) => {
      e.preventDefault();
      this.setDragState(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.onFileSelect(files[0]);
      }
      
      this.onDrop(e);
    });
    
    // Prevent default drag behaviors on document
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      document.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
  }
  
  setDragState(isDragOver) {
    if (!this.element) return;
    
    this.isDragOver = isDragOver;
    
    if (isDragOver) {
      this.element.classList.add('drag-over');
    } else {
      this.element.classList.remove('drag-over');
    }
  }
  
  reset() {
    if (this.fileInput) {
      this.fileInput.value = '';
    }
    this.setDragState(false);
  }
  
  // Call this after rendering to bind events
  initialize() {
    this.bindEvents();
  }
}
