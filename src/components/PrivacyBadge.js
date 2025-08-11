export class PrivacyBadge {
  constructor() {
    this.messages = [
      '🛡️ Files never leave your device',
      '🔒 100% Private & Secure',
      '🌐 Works completely offline',
      '🚫 No server uploads',
      '🔐 Zero data collection'
    ];
    this.currentMessageIndex = 0;
  }
  
  render() {
    return `
      <div class="privacy-badge" id="privacyBadge">
        <span class="privacy-icon">🛡️</span>
        <span class="privacy-text" id="privacyText">Files never leave your device</span>
      </div>
    `;
  }
  
  rotateMessage() {
    this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
    const textElement = document.getElementById('privacyText');
    const iconElement = document.querySelector('.privacy-icon');
    
    if (textElement) {
      // Add fade out effect
      textElement.style.opacity = '0.5';
      
      setTimeout(() => {
        const message = this.messages[this.currentMessageIndex];
        const parts = message.split(' ');
        const icon = parts[0];
        const text = parts.slice(1).join(' ');
        
        if (iconElement) iconElement.textContent = icon;
        textElement.textContent = text;
        textElement.style.opacity = '1';
      }, 200);
    }
  }
  
  startRotation(interval = 5000) {
    // Rotate messages every 5 seconds
    setInterval(() => {
      this.rotateMessage();
    }, interval);
  }
  
  emphasize() {
    const badge = document.getElementById('privacyBadge');
    if (badge) {
      badge.classList.add('emphasized');
      setTimeout(() => {
        badge.classList.remove('emphasized');
      }, 1000);
    }
  }
  
  showTooltip() {
    // Could be extended to show a detailed privacy tooltip
    console.log('Privacy features:', {
      'Client-side processing': 'All conversions happen in your browser',
      'No uploads': 'Files never sent to any server',
      'No tracking': 'Zero analytics or data collection',
      'Offline capable': 'Works without internet connection',
      'Open source': 'Code is fully auditable'
    });
  }
}
