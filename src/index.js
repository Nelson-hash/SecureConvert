import { App } from './App.js';
import './styles/main.css';

// Initialize PDF.js worker
if (typeof window !== 'undefined' && window.pdfjsLib) {
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
}

// Initialize the application when DOM is ready
function initializeApp() {
  try {
    const app = new App();
    
    // Global error handling
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      if (app && app.showError) {
        app.showError('An unexpected error occurred. Please refresh the page.');
      }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      if (app && app.showError) {
        app.showError('An unexpected error occurred during processing.');
      }
    });
    
    // Expose app instance for debugging (only in development)
    const isDevelopment = typeof process !== 'undefined' && 
                         process.env && 
                         process.env.NODE_ENV === 'development';
    
    if (isDevelopment || !window.location.protocol.startsWith('https')) {
      window.SecureConvertApp = app;
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback error display
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `
        <div style="
          text-align: center; 
          padding: 40px; 
          background: white; 
          border-radius: 10px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          max-width: 500px;
          margin: 20px auto;
        ">
          <h2 style="color: #e53e3e; margin-bottom: 20px;">⚠️ Initialization Error</h2>
          <p style="margin-bottom: 20px;">Failed to start SecureConvert. This might be due to:</p>
          <ul style="text-align: left; color: #666;">
            <li>Missing dependencies</li>
            <li>Browser compatibility issues</li>
            <li>Network connectivity problems</li>
          </ul>
          <button onclick="window.location.reload()" style="
            background: #4c51bf; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 6px; 
            cursor: pointer;
            margin-top: 20px;
          ">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
