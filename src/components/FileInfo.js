export class FileInfo {
  constructor() {
    this.isVisible = false;
  }
  
  render() {
    return `
      <div class="file-info" id="fileInfo" style="display: none;">
        <h3>📄 File Selected:</h3>
        <div class="file-details">
          <p><strong>Name:</strong> <span id="fileName"></span></p>
          <p><strong>Size:</strong> <span id="fileSize"></span></p>
          <p><strong>Type:</strong> <span id="fileType"></span></p>
        </div>
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
