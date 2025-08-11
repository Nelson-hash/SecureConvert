import { App } from './App.js';
import './styles/main.css';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

// Initialize the application when DOM is ready
function initializeApp() {
  const app = new App();
  
  // Global error handling
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    app.showError('An unexpected error occurred. Please refresh the page.');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    app.showError('An unexpected error occurred during processing.');
  });
  
  // Expose app instance for debugging
  if (process.env.NODE_ENV === 'development') {
    window.SecureConvertApp = app;
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
