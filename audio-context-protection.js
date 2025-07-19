// AudioContext fingerprint protection
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('AudioContextProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][AudioContextProtection]', message, data);
    }
  };
  
  log('Starting audio context protection...');

      // Helper to define properties on an object
      const defineSpoofedProperty = (obj, prop, value) => {
        try {
          Object.defineProperty(obj, prop, {
            get: () => value,
        set: () => {},
            configurable: false,
            enumerable: true
          });
        } catch (e) {
      log('Failed to define spoofed property', { prop, error: e.message });
        }
      };

      const originalGetChannelData = AudioBuffer.prototype.getChannelData;
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser;

  // Enhanced audio data protection
      AudioBuffer.prototype.getChannelData = function(channel) {
        const data = originalGetChannelData.call(this, channel);
        // Add random noise to audio samples
        for (let i = 0; i < data.length; i++) {
      data[i] += (window.getRandomFloat ? window.getRandomFloat(-0.01, 0.01) : Math.random() * 0.02 - 0.01); // ±1% noise
        }
        return data;
      };

  // Enhanced analyser randomization
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
    
        // Randomize FFT size within common values
    const fftSizes = [256, 512, 1024, 2048, 4096];
    const randomFftSize = fftSizes[Math.floor((window.getRandomFloat ? window.getRandomFloat(0, fftSizes.length) : Math.random() * fftSizes.length))];
    analyser.fftSize = randomFftSize;

    // Randomize other analyser properties
    analyser.minDecibels = window.getRandomFloat ? window.getRandomFloat(-100, -80) : Math.random() * 20 - 100;
    analyser.maxDecibels = window.getRandomFloat ? window.getRandomFloat(-30, -10) : Math.random() * 20 - 30;
    analyser.smoothingTimeConstant = window.getRandomFloat ? window.getRandomFloat(0.5, 0.9) : Math.random() * 0.4 + 0.5;
    
    // Override the getter to ensure values are always randomized
    Object.defineProperty(analyser, 'fftSize', {
        get: function() {
        return randomFftSize;
      },
      set: function(value) {
        // Allow setting but maintain randomization
        },
        configurable: true
      });

    return analyser;
  };

  // Enhanced sample rate randomization
  const sampleRates = [44100, 48000, 96000, 88200];
  const spoofedSampleRate = sampleRates[Math.floor((window.getRandomFloat ? window.getRandomFloat(0, sampleRates.length) : Math.random() * sampleRates.length))];

      defineSpoofedProperty(AudioContext.prototype, 'sampleRate', spoofedSampleRate);
      if (typeof BaseAudioContext !== 'undefined') {
        defineSpoofedProperty(BaseAudioContext.prototype, 'sampleRate', spoofedSampleRate);
      }

  // Enhanced latency randomization
  const originalBaseLatency = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'baseLatency');
  Object.defineProperty(AudioContext.prototype, 'baseLatency', {
    get: function() {
      const baseLatency = originalBaseLatency ? originalBaseLatency.get.call(this) : 0.005;
      return baseLatency + (window.getRandomFloat ? window.getRandomFloat(0, 0.01) : Math.random() * 0.01);
    },
    configurable: true
  });

  // Enhanced output latency randomization
  const originalOutputLatency = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'outputLatency');
  Object.defineProperty(AudioContext.prototype, 'outputLatency', {
    get: function() {
      const outputLatency = originalOutputLatency ? originalOutputLatency.get.call(this) : 0.01;
      return outputLatency + (window.getRandomFloat ? window.getRandomFloat(0, 0.02) : Math.random() * 0.02);
    },
    configurable: true
  });

  // Spoof audio format support
  if (typeof HTMLAudioElement !== 'undefined') {
    const originalCanPlayType = HTMLAudioElement.prototype.canPlayType;
    HTMLAudioElement.prototype.canPlayType = function(type) {
      const supportedFormats = [
        'audio/aac',
        'audio/flac', 
        'audio/mpeg',
        'audio/ogg; codecs="flac"',
        'audio/ogg; codecs="vorbis"',
        'audio/ogg; codecs="opus"',
        'audio/wav; codecs="1"',
        'audio/webm; codecs="vorbis"',
        'audio/webm; codecs="opus"',
        'audio/mp4; codecs="mp4a_40_2"'
      ];
      
      if (supportedFormats.some(format => type.includes(format))) {
        return 'probably';
      }
      
      return originalCanPlayType.call(this, type);
    };
  }

  // Spoof video format support
  if (typeof HTMLVideoElement !== 'undefined') {
    const originalVideoCanPlayType = HTMLVideoElement.prototype.canPlayType;
    HTMLVideoElement.prototype.canPlayType = function(type) {
      const supportedVideoFormats = [
        'video/mp4; codecs="flac"',
        'video/ogg; codecs="opus"',
        'video/webm; codecs="vp9, opus"',
        'video/webm; codecs="vp8, vorbis"'
      ];
      
      if (supportedVideoFormats.some(format => type.includes(format))) {
        return 'probably';
      }
      
      return originalVideoCanPlayType.call(this, type);
    };
  }

  log('Audio context spoofing completed');
})();