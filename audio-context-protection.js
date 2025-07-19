// AudioContext fingerprint protection
(function() {
  const originalGetChannelData = AudioBuffer.prototype.getChannelData;
  const originalCreateAnalyser = AudioContext.prototype.createAnalyser;

  // Helper to get cryptographically secure random float
  const getRandomFloat = (min, max) => {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    let randomNumber = randomBuffer[0] / (0xFFFFFFFF + 1);
    return min + (randomNumber * (max - min));
  };

  AudioBuffer.prototype.getChannelData = function(channel) {
    const data = originalGetChannelData.call(this, channel);
    // Add random noise to audio samples
    for (let i = 0; i < data.length; i++) {
      data[i] += (getRandomFloat(-0.01, 0.01)); // ±1% noise
    }
    return data;
  };

  AudioContext.prototype.createAnalyser = function() {
    const analyser = originalCreateAnalyser.call(this);
    // Randomize FFT size within common values
    const fftSizes = [256, 512, 1024, 2048];
    analyser.fftSize = fftSizes[Math.floor(getRandomFloat(0, fftSizes.length))];
    return analyser;
  };

  // Add subtle random latency
  const originalBaseLatency = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'baseLatency');
  Object.defineProperty(AudioContext.prototype, 'baseLatency', {
    get: function() {
      return originalBaseLatency.get.call(this) + getRandomFloat(0, 0.01);
    },
    configurable: true
  });
})();