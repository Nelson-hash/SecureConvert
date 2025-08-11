export class FeatureGrid {
  constructor() {
    this.features = [
      {
        icon: '🔐',
        title: '100% Private',
        description: 'Files never leave your device',
        details: 'All processing happens locally in your browser. No uploads, no server storage.'
      },
      {
        icon: '⚡',
        title: 'Instant Processing',
        description: 'Convert files in seconds',
        details: 'Powered by WebAssembly for lightning-fast client-side processing.'
      },
      {
        icon: '🌐',
        title: 'Works Offline',
        description: 'No internet required',
        details: 'Once loaded, the app works completely offline. Perfect for sensitive documents.'
      },
      {
        icon: '🆓',
        title: 'Completely Free',
        description: 'No limits, no ads',
        details: 'Open source and free forever. No hidden costs or premium features.'
      }
    ];
    this.currentFeature = 0;
  }
  
  render() {
    return `
      <div class="features" id="featuresGrid">
        <div class="features-header">
          <h3>Why Choose SecureConvert?</h3>
          <p>The privacy-first document converter</p>
        </div>
        
        <div class="features-grid">
          ${this.features.map((feature, index) => `
            <div class="feature" data-feature="${index}">
              <div class="feature-icon">${feature.icon}</div>
              <div class="feature-content">
                <div class="feature-title">${feature.title}</div>
                <div class="feature-text">${feature.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="feature-detail" id="featureDetail" style="display: none;">
          <div class="feature-detail-content" id="featureDetailContent">
            <!-- Detailed feature info will appear here -->
          </div>
        </div>
      </div>
    `;
  }
  
  bindEvents() {
    // Add click handlers for features
    const featureElements = document.querySelectorAll('.feature');
    featureElements.forEach((element, index) => {
      element.addEventListener('click', () => {
        this.showFeatureDetail(index);
      });
      
      element.addEventListener('mouseenter', () => {
        this.highlightFeature(index);
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeHighlight(index);
      });
    });
  }
  
  showFeatureDetail(index) {
    const feature = this.features[index];
    const detailEl = document.getElementById('featureDetail');
    const contentEl = document.getElementById('featureDetailContent');
    
    if (detailEl && contentEl && feature) {
      contentEl.innerHTML = `
        <div class="feature-detail-header">
          <span class="feature-detail-icon">${feature.icon}</span>
          <h4>${feature.title}</h4>
        </div>
        <p>${feature.details}</p>
        <button class="feature-close" onclick="this.parentElement.parentElement.style.display='none'">
          ✕ Close
        </button>
      `;
      
      detailEl.style.display = 'block';
      this.currentFeature = index;
    }
  }
  
  highlightFeature(index) {
    const featureEl = document.querySelector(`[data-feature="${index}"]`);
    if (featureEl) {
      featureEl.classList.add('feature-highlighted');
    }
  }
  
  removeHighlight(index) {
    const featureEl = document.querySelector(`[data-feature="${index}"]`);
    if (featureEl) {
      featureEl.classList.remove('feature-highlighted');
    }
  }
  
  animateFeatures() {
    const featureElements = document.querySelectorAll('.feature');
    featureElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add('feature-animate-in');
      }, index * 200);
    });
  }
  
  cycleFeatures(interval = 3000) {
    setInterval(() => {
      this.highlightFeature(this.currentFeature);
      
      setTimeout(() => {
        this.removeHighlight(this.currentFeature);
        this.currentFeature = (this.currentFeature + 1) % this.features.length;
      }, 1000);
    }, interval);
  }
  
  // Call this after rendering to set up interactions
  initialize() {
    this.bindEvents();
    
    // Animate features on load
    setTimeout(() => {
      this.animateFeatures();
    }, 500);
    
    // Start feature cycling after a delay
    setTimeout(() => {
      this.cycleFeatures();
    }, 5000);
  }
  
  addCustomFeature(feature) {
    this.features.push(feature);
    // Could re-render the grid here if needed
  }
  
  getFeatureCount() {
    return this.features.length;
  }
}
