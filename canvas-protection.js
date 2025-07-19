// Canvas fingerprinting protection content script
(function() {
  const toDataURL = HTMLCanvasElement.prototype.toDataURL;
  const getImageData = CanvasRenderingContext2D.prototype.getImageData;

  // Helper to get cryptographically secure random integer
  const getRandomInt = (min, max) => {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
    return Math.floor(randomNumber * (max - min + 1)) + min;
  };

  // Override toDataURL to add noise
  HTMLCanvasElement.prototype.toDataURL = function() {
    const context = this.getContext('2d');
    if (context) {
      const shift = {
        'r': getRandomInt(-5, 5),
        'g': getRandomInt(-5, 5),
        'b': getRandomInt(-5, 5),
        'a': getRandomInt(-5, 5)
      };
      const width = this.width;
      const height = this.height;
      const imageData = context.getImageData(0, 0, width, height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + shift.r));
        imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + shift.g));
        imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + shift.b));
        imageData.data[i + 3] = Math.min(255, Math.max(0, imageData.data[i + 3] + shift.a));
      }
      context.putImageData(imageData, 0, 0);
    }
    return toDataURL.apply(this, arguments);
  };

  // Override getImageData to add noise
  CanvasRenderingContext2D.prototype.getImageData = function() {
    const imageData = getImageData.apply(this, arguments);
    const shift = {
      'r': getRandomInt(-5, 5),
      'g': getRandomInt(-5, 5),
      'b': getRandomInt(-5, 5),
      'a': getRandomInt(-5, 5)
    };
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + shift.r));
      imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + shift.g));
      imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + shift.b));
      imageData.data[i + 3] = Math.min(255, Math.max(0, imageData.data[i + 3] + shift.a));
    }
    return imageData;
  };
})();
