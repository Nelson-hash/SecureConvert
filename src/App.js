import { DropZone } from './components/DropZone.js';
import { FileInfo } from './components/FileInfo.js';
import { ConversionOptions } from './components/ConversionOptions.js';
import { ProgressBar } from './components/ProgressBar.js';
import { PrivacyBadge } from './components/PrivacyBadge.js';
import { ErrorMessage } from './components/ErrorMessage.js';
import { ResultDisplay } from './components/ResultDisplay.js';
import { FeatureGrid } from './components/FeatureGrid.js';

import { ConverterFactory } from './converters/index.js';
import { downloadFile } from './utils/downloadUtils.js';
import { formatFileSize, validateFile } from './utils/fileUtils.js';
import { SUPPORTED_FORMATS } from './config/formats.js';

import './styles/main.css';

export class App {
  constructor() {
    this.currentFile = null;
    this.selectedFormat = null;
    this.convertedData = null;
    this.isConverting = false;
    
    this.initializeComponents();
    this.bindEvents();
    this.checkLibraries();
  }
  
  initializeComponents() {
    // Initialize all UI components
    this.dropZone = new DropZone({
      onFileSelect: this.handleFileSelect.bind(this),
      onDragOver: this.handleDragOver.bind(this),
      onDragLeave: this.handleDragLeave.bind(this),
      onDrop: this.handleDrop.bind(this)
    });
    
    this.fileInfo = new FileInfo();
    this.conversionOptions = new ConversionOptions({
      onFormatSelect: this.handleFormatSelect.bind(this)
    });
    
    this.progressBar = new ProgressBar();
    this.privacyBadge = new PrivacyBadge();
    this.errorMessage = new ErrorMessage();
    this.resultDisplay = new ResultDisplay({
      onDownload: this.handleDownload.bind(this)
    });
    this.featureGrid = new FeatureGrid();
    
    // Render components
    this.render();
    this.initializeAfterRender();
  }
  
  initializeAfterRender() {
    // Initialize components that need DOM elements
    this.dropZone.initialize();
    this.featureGrid.initialize();
    
    // Start privacy badge rotation
    this.privacyBadge.startRotation(8000);
  }
  
  bindEvents() {
    // Bind global events - will be called after render
    setTimeout(() => {
      const convertBtn = document.getElementById('convertBtn');
      if (convertBtn) {
        convertBtn.addEventListener('click', this.handleConvert.bind(this));
      }
    }, 100);
  }
  
  render() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="container">
        <div class="floating-particles"></div>
        
        <div class="header">
          <div class="logo">🔒 SecureConvert</div>
          <div class="tagline">Convert documents safely in your browser</div>
          ${this.privacyBadge.render()}
        </div>
        
        ${this.dropZone.render()}
        ${this.fileInfo.render()}
        ${this.conversionOptions.render()}
        
        <button class="convert-btn" id="convertBtn" style="display: none;">
          Convert File
        </button>
        
        ${this.progressBar.render()}
        ${this.errorMessage.render()}
        ${this.resultDisplay.render()}
        ${this.featureGrid.render()}
      </div>
    `;
    
    // Initialize particles
    this.createParticles();
  }
  
  createParticles() {
    const container = document.querySelector('.floating-particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      container.appendChild(particle);
    }
  }
  
  async handleFileSelect(file) {
    try {
      this.reset();
      
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        this.showError(validation.error);
        return;
      }
      
      this.currentFile = file;
      
      // Show file info
      this.fileInfo.show({
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type
      });
      
      // Show conversion options
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const supportedFormats = SUPPORTED_FORMATS[fileExtension];
      
      if (supportedFormats && supportedFormats.length > 0) {
        this.conversionOptions.show(supportedFormats);
      } else {
        this.showError(`File type .${fileExtension} is not supported yet.`);
      }
      
    } catch (error) {
      this.showError(`Failed to process file: ${error.message}`);
    }
  }
  
  handleDragOver(e) {
    e.preventDefault();
    this.dropZone.setDragState(true);
  }
  
  handleDragLeave(e) {
    e.preventDefault();
    this.dropZone.setDragState(false);
  }
  
  handleDrop(e) {
    e.preventDefault();
    this.dropZone.setDragState(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.handleFileSelect(files[0]);
    }
  }
  
  handleFormatSelect(format) {
    this.selectedFormat = format;
    const convertBtn = document.getElementById('convertBtn');
    if (convertBtn) {
      convertBtn.style.display = 'block';
    }
  }
  
  async handleConvert() {
    if (!this.currentFile || !this.selectedFormat || this.isConverting) {
      return;
    }
    
    this.isConverting = true;
    this.setConvertButtonState(true);
    this.reset(false); // Don't reset file info
    
    try {
      // Get appropriate converter
      const converter = ConverterFactory.getConverter(
        this.getFileExtension(this.currentFile.name),
        this.selectedFormat
      );
      
      if (!converter) {
        throw new Error(`No converter available for ${this.getFileExtension(this.currentFile.name)} to ${this.selectedFormat}`);
      }
      
      // Show progress
      this.progressBar.show();
      this.progressBar.setProgress(10);
      
      // Convert file with progress callback
      this.convertedData = await converter.convert(
        this.currentFile,
        this.selectedFormat,
        {
          onProgress: (progress) => {
            this.progressBar.setProgress(progress);
          }
        }
      );
      
      this.progressBar.setProgress(100);
      
      // Show result
      this.resultDisplay.show({
        originalFile: this.currentFile.name,
        convertedFile: this.convertedData.filename,
        fileSize: formatFileSize(this.convertedData.blob.size)
      });
      
    } catch (error) {
      console.error('Conversion error:', error);
      this.showError(`Conversion failed: ${error.message}`);
    } finally {
      this.isConverting = false;
      this.setConvertButtonState(false);
      this.progressBar.hide();
    }
  }
  
  handleDownload() {
    if (this.convertedData) {
      downloadFile(
        this.convertedData.blob,
        this.convertedData.filename,
        this.convertedData.type
      );
    }
  }
  
  showError(message) {
    // Determine error type and show appropriate error
    if (message.includes('library') || message.includes('PDF.js') || message.includes('PDF-lib')) {
      const missing = [];
      if (message.includes('PDF.js')) missing.push('PDF.js');
      if (message.includes('PDF-lib')) missing.push('PDF-lib');
      this.errorMessage.showLibraryError(missing.length > 0 ? missing : ['Required libraries']);
    } else if (message.includes('convert') || message.includes('conversion')) {
      this.errorMessage.showConversionError(message);
    } else if (message.includes('file') || message.includes('size') || message.includes('format')) {
      this.errorMessage.showFileError(message);
    } else {
      this.errorMessage.show(message);
    }
  }
  
  hideError() {
    this.errorMessage.hide();
  }
  
  reset(full = true) {
    this.hideError();
    this.resultDisplay.hide();
    this.progressBar.hide();
    
    if (full) {
      this.currentFile = null;
      this.selectedFormat = null;
      this.convertedData = null;
      this.fileInfo.hide();
      this.conversionOptions.hide();
      const convertBtn = document.getElementById('convertBtn');
      if (convertBtn) {
        convertBtn.style.display = 'none';
      }
    }
  }
  
  setConvertButtonState(disabled) {
    const btn = document.getElementById('convertBtn');
    if (btn) {
      btn.disabled = disabled;
      btn.textContent = disabled ? 'Converting...' : 'Convert File';
    }
  }
  
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }
  
  checkLibraries() {
    // Check if required libraries are loaded
    setTimeout(() => {
      const missing = [];
      
      if (typeof window.pdfjsLib === 'undefined') {
        missing.push('PDF.js');
      }
      
      if (typeof window.PDFLib === 'undefined') {
        missing.push('PDF-lib');
      }
      
      if (missing.length > 0) {
        this.showError(
          `Required libraries failed to load: ${missing.join(', ')}. Please refresh the page.`
        );
      }
    }, 2000);
  }
}
