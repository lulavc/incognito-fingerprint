// Canvas fingerprinting protection content script
(function() {
  const toDataURL = HTMLCanvasElement.prototype.toDataURL;
  const getImageData = CanvasRenderingContext2D.prototype.getImageData;
  const toBlob = HTMLCanvasElement.prototype.toBlob;

  // Helper to get cryptographically secure random values
  const getRandomInt = (min, max) => {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  };

  // Add per-pixel noise for better randomization
  const addPerPixelNoise = (imageData) => {
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + getRandomInt(-2, 2)));
      imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + getRandomInt(-2, 2)));
      imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + getRandomInt(-2, 2)));
      // Don't modify alpha channel to avoid transparency issues
    }
    return imageData;
  };

  // Override toDataURL to add noise
  HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
    const context = this.getContext('2d');
    if (context && this.width > 0 && this.height > 0) {
      const width = this.width;
      const height = this.height;
      const imageData = context.getImageData(0, 0, width, height);
      const noisyData = addPerPixelNoise(new ImageData(new Uint8ClampedArray(imageData.data), width, height));
      context.putImageData(noisyData, 0, 0);
    }
    return toDataURL.call(this, type, quality);
  };

  // Override getImageData to add noise
  CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
    const imageData = getImageData.call(this, sx, sy, sw, sh);
    return addPerPixelNoise(new ImageData(new Uint8ClampedArray(imageData.data), sw, sh));
  };

  // Override toBlob to add noise
  HTMLCanvasElement.prototype.toBlob = function(callback, type, quality) {
    const context = this.getContext('2d');
    if (context && this.width > 0 && this.height > 0) {
      const width = this.width;
      const height = this.height;
      const imageData = context.getImageData(0, 0, width, height);
      const noisyData = addPerPixelNoise(new ImageData(new Uint8ClampedArray(imageData.data), width, height));
      context.putImageData(noisyData, 0, 0);
    }
    return toBlob.call(this, callback, type, quality);
  };

  // Also protect WebGL canvas
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...args) {
    const context = getContext.call(this, type, ...args);
    if (type === '2d' && context) {
      // Ensure 2D context is protected
      const originalGetImageData = context.getImageData;
      context.getImageData = function(sx, sy, sw, sh) {
        const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
        return addPerPixelNoise(new ImageData(new Uint8ClampedArray(imageData.data), sw, sh));
      };
    }
    return context;
  };
})();
