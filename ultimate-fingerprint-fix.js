// Ultimate Fingerprint Fix - Aggressive protection against all fingerprinting methods
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('UltimateFix');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][UltimateFix]', message, data);
    }
  };
  
  log('Ultimate fingerprint fix starting...');

  // ===== AGGRESSIVE NAVIGATOR OVERRIDE =====
  const navigatorOverrides = {
    // Language and locale
    language: 'en-US',
    languages: ['en-US', 'en'],
    browserLanguage: 'en-US',
    userLanguage: 'en-US',
    systemLanguage: 'en-US',
    
    // Platform and OS
    platform: 'Win32',
    oscpu: 'Windows NT 10.0; Win64; x64',
    
    // User Agent (Windows Chrome)
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    
    // Hardware
    hardwareConcurrency: 8,
    deviceMemory: 8,
    
    // Product info
    product: 'Gecko',
    productSub: '20030107',
    vendor: 'Google Inc.',
    vendorSub: '',
    
    // Build ID
    buildID: '20231201000000',
    
    // App info
    appName: 'Netscape',
    appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    appCodeName: 'Mozilla',
    
    // Connection
    connection: {
      effectiveType: '4g',
      downlink: 10,
      rtt: 50,
      saveData: false
    },
    
    // Permissions
    permissions: {
      accelerometer: 'granted',
      accessibility: 'denied',
      'ambient-light-sensor': 'denied',
      camera: 'denied',
      'clipboard-read': 'denied',
      'clipboard-write': 'granted',
      geolocation: 'denied',
      'background-sync': 'granted',
      magnetometer: 'granted',
      microphone: 'denied',
      midi: 'denied',
      notifications: 'denied',
      'payment-handler': 'granted',
      'persistent-storage': 'denied',
      push: 'denied'
    }
  };

  // Override navigator properties aggressively
  Object.entries(navigatorOverrides).forEach(([prop, value]) => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(navigator, prop);
      if (!descriptor || descriptor.configurable) {
        Object.defineProperty(navigator, prop, {
          get: () => value,
          set: () => {},
          configurable: true,
          enumerable: true
        });
        log(`Navigator ${prop} overridden`, value);
      }
    } catch (e) {
      log(`Navigator ${prop} override failed`, e.message);
    }
  });

  // ===== AGGRESSIVE TIMEZONE OVERRIDE =====
  const timezoneOverrides = {
    timezone: 'America/New_York',
    timezoneOffset: 300, // UTC-5
    locale: 'en-US'
  };

  // Override Date methods for timezone
  const originalDate = Date;
  const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
  const originalToLocaleString = Date.prototype.toLocaleString;
  const originalToLocaleDateString = Date.prototype.toLocaleDateString;
  const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;

  Date.prototype.getTimezoneOffset = function() {
    return 300; // UTC-5
  };

  Date.prototype.toLocaleString = function(locale, options) {
    return originalToLocaleString.call(this, 'en-US', options);
  };

  Date.prototype.toLocaleDateString = function(locale, options) {
    return originalToLocaleDateString.call(this, 'en-US', options);
  };

  Date.prototype.toLocaleTimeString = function(locale, options) {
    return originalToLocaleTimeString.call(this, 'en-US', options);
  };

  // Override Intl.DateTimeFormat
  const originalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(locale, options) {
    return new originalDateTimeFormat('en-US', options);
  };
  Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;

  // Override Intl.NumberFormat
  const originalNumberFormat = Intl.NumberFormat;
  Intl.NumberFormat = function(locale, options) {
    return new originalNumberFormat('en-US', options);
  };
  Intl.NumberFormat.prototype = originalNumberFormat.prototype;

  // Override Intl.Collator
  const originalCollator = Intl.Collator;
  Intl.Collator = function(locale, options) {
    return new originalCollator('en-US', options);
  };
  Intl.Collator.prototype = originalCollator.prototype;

  // ===== AGGRESSIVE WEBGL OVERRIDE =====
  if (typeof WebGLRenderingContext !== 'undefined' && !window.incognitoWebGLHandled) {
    try {
      window.incognitoWebGLHandled = true;
      
      const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(pname) {
        const params = {
          37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
          37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
          7936: 'Intel Inc.',
          7937: 'Intel(R) UHD Graphics 620',
          37447: 'ANGLE',
          7938: 'Intel Inc.',
          7939: 'Intel(R) UHD Graphics 620',
          3379: 16384,
          34024: 16384,
          34930: 4096,
          35660: 16
        };
        
        if (params[pname] !== undefined) return params[pname];
        return originalGetParameter.call(this, pname);
      };
      
      log('WebGL protection applied aggressively');
    } catch (e) {
      log('WebGL protection failed', e.message);
      window.incognitoWebGLHandled = false; // Reset flag on failure
    }
  } else if (window.incognitoWebGLHandled) {
    log('WebGL already handled by another script, skipping');
  }

  // ===== AGGRESSIVE AUDIO CONTEXT OVERRIDE =====
  if (typeof AudioContext !== 'undefined') {
    try {
      window.incognitoAudioContextHandled = true;
      
      // Override sample rate
      Object.defineProperty(AudioContext.prototype, 'sampleRate', {
        get: () => 44100,
        set: () => {},
        configurable: true
      });

      // Override createAnalyser
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
        
        // Override analyser properties
        const analyserProps = {
          fftSize: 2048,
          frequencyBinCount: 1024,
          minDecibels: -100,
          maxDecibels: -30,
          smoothingTimeConstant: 0.8
        };

        Object.entries(analyserProps).forEach(([prop, value]) => {
          try {
            Object.defineProperty(analyser, prop, {
              get: () => value,
              set: () => {},
              configurable: true
            });
          } catch (e) {
            log(`Analyser ${prop} override failed`, e.message);
          }
        });
        
        return analyser;
      };
      
      log('AudioContext protection applied aggressively');
    } catch (e) {
      log('AudioContext protection failed', e.message);
      window.incognitoAudioContextHandled = false; // Reset flag on failure
    }
  }

  // ===== AGGRESSIVE SCREEN OVERRIDE =====
  const screenProps = {
    width: 1920,
    height: 1080,
    availWidth: 1920,
    availHeight: 1040,
    colorDepth: 24,
    pixelDepth: 24,
    availLeft: 0,
    availTop: 0
  };

  Object.entries(screenProps).forEach(([prop, value]) => {
    try {
      Object.defineProperty(screen, prop, {
        get: () => value,
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log(`Screen ${prop} override failed`, e.message);
    }
  });

  // ===== AGGRESSIVE WINDOW OVERRIDE =====
  const windowProps = {
    innerWidth: 1920,
    innerHeight: 937,
    outerWidth: 1920,
    outerHeight: 1040,
    devicePixelRatio: 1
  };

  Object.entries(windowProps).forEach(([prop, value]) => {
    try {
      Object.defineProperty(window, prop, {
        get: () => value,
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log(`Window ${prop} override failed`, e.message);
    }
  });

  // ===== AGGRESSIVE HTTP HEADERS OVERRIDE =====
  // Override fetch
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    options.headers = options.headers || {};
    options.headers['Accept-Language'] = 'en-US,en;q=0.9';
    options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
    return originalFetch.call(this, url, options);
  };

  // Override XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 1) { // OPENED
        this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
        this.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
        this.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');
      }
    });
    return originalXHROpen.call(this, method, url, async, user, password);
  };

  // ===== AGGRESSIVE PLUGINS OVERRIDE =====
  if (navigator.plugins) {
    try {
      Object.defineProperty(navigator, 'plugins', {
        get: () => {
          const plugins = [];
          plugins[0] = {
            name: 'PDF Viewer',
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer'
          };
          plugins[1] = {
            name: 'Chrome PDF Viewer',
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer'
          };
          plugins.length = 2;
          return plugins;
        },
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log('Plugins override failed', e.message);
    }
  }

  // ===== AGGRESSIVE MEDIA DEVICES OVERRIDE =====
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = function() {
      return Promise.resolve([
        {
          deviceId: 'default',
          kind: 'audioinput',
          label: 'Default - Microphone',
          groupId: 'default'
        },
        {
          deviceId: 'default',
          kind: 'videoinput',
          label: 'Default - Camera',
          groupId: 'default'
        },
        {
          deviceId: 'default',
          kind: 'audiooutput',
          label: 'Default - Speaker',
          groupId: 'default'
        }
      ]);
    };
  }

  // ===== AGGRESSIVE BATTERY OVERRIDE =====
  if (navigator.getBattery) {
    const originalGetBattery = navigator.getBattery;
    navigator.getBattery = function() {
      return Promise.resolve({
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        level: 1
      });
    };
  }

  // ===== AGGRESSIVE CONNECTION OVERRIDE =====
  if (navigator.connection) {
    try {
      Object.defineProperty(navigator, 'connection', {
        get: () => ({
          effectiveType: '4g',
          downlink: 10,
          rtt: 50,
          saveData: false
        }),
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log('Connection override failed', e.message);
    }
  }

  // ===== AGGRESSIVE PERMISSIONS OVERRIDE =====
  if (navigator.permissions && navigator.permissions.query) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = function(permissionDesc) {
      const permissionMap = {
        accelerometer: 'granted',
        accessibility: 'denied',
        'ambient-light-sensor': 'denied',
        camera: 'denied',
        'clipboard-read': 'denied',
        'clipboard-write': 'granted',
        geolocation: 'denied',
        'background-sync': 'granted',
        magnetometer: 'granted',
        microphone: 'denied',
        midi: 'denied',
        notifications: 'denied',
        'payment-handler': 'granted',
        'persistent-storage': 'denied',
        push: 'denied'
      };
      
      return Promise.resolve({
        state: permissionMap[permissionDesc.name] || 'denied',
        onchange: null
      });
    };
  }

  // ===== AGGRESSIVE STORAGE OVERRIDE =====
  // Override localStorage and sessionStorage to prevent fingerprinting
  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    // Block fingerprinting-related keys
    const blockedKeys = ['fingerprint', 'device_id', 'user_id', 'tracking', 'analytics'];
    if (blockedKeys.some(blocked => key.toLowerCase().includes(blocked))) {
      return;
    }
    return originalSetItem.call(this, key, value);
  };

  // ===== AGGRESSIVE CANVAS OVERRIDE =====
  if (HTMLCanvasElement.prototype.toDataURL) {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
      // Return a consistent hash for canvas fingerprinting
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    };
  }

  if (HTMLCanvasElement.prototype.getContext) {
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
      const context = originalGetContext.call(this, contextType, contextAttributes);
      
      if (contextType === '2d' && context) {
        const originalFillText = context.fillText;
        context.fillText = function(text, x, y, maxWidth) {
          // Add slight randomization to text rendering
          const randomOffset = Math.random() * 0.1;
          return originalFillText.call(this, text, x + randomOffset, y + randomOffset, maxWidth);
        };
      }
      
      return context;
    };
  }

  log('Ultimate fingerprint fix completed successfully');
  
  // Auto-test after a short delay
  setTimeout(() => {
    log('Running ultimate protection test...');
    if (window.testLanguageTimezone) {
      window.testLanguageTimezone();
    }
    if (window.testIncognitoProtection) {
      window.testIncognitoProtection();
    }
  }, 1000);
})(); 