// Aggressive Override - Most forceful fingerprinting prevention
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('AggressiveOverride');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][AggressiveOverride]', message, data);
    }
  };
  
  log('Aggressive override starting...');

  // ===== ULTRA-AGGRESSIVE NAVIGATOR OVERRIDE =====
  // Override navigator properties with maximum force
  const navigatorOverrides = {
    // Language and locale - CRITICAL
    language: 'en-US',
    languages: ['en-US', 'en'],
    browserLanguage: 'en-US',
    userLanguage: 'en-US',
    systemLanguage: 'en-US',
    
    // Platform and OS - CRITICAL
    platform: 'Win32',
    oscpu: 'Windows NT 10.0; Win64; x64',
    
    // User Agent - CRITICAL
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
    appCodeName: 'Mozilla'
  };

  // Force override navigator properties with maximum aggression
  Object.entries(navigatorOverrides).forEach(([prop, value]) => {
    try {
      // Check if property is already overridden
      const descriptor = Object.getOwnPropertyDescriptor(navigator, prop);
      
      // Skip if already overridden by this script
      if (descriptor && descriptor.configurable === false) {
        log(`Navigator ${prop} already overridden, skipping`);
        return;
      }
      
      // Try multiple override methods
      
      // Method 1: Direct property assignment
      try {
        navigator[prop] = value;
      } catch (e) {
        // Ignore errors
      }
      
      // Method 2: Object.defineProperty with configurable true (not false)
      try {
        Object.defineProperty(navigator, prop, {
          value: value,
          writable: false,
          configurable: true, // Keep configurable for other scripts
          enumerable: true
        });
      } catch (e) {
        // Try getter/setter
        try {
          Object.defineProperty(navigator, prop, {
            get: () => value,
            set: () => {},
            configurable: true,
            enumerable: true
          });
        } catch (e2) {
          log(`Navigator ${prop} override failed with all methods`, e2.message);
        }
      }
      
      log(`Navigator ${prop} overridden aggressively`, value);
    } catch (e) {
      log(`Navigator ${prop} override completely failed`, e.message);
    }
  });

  // ===== ULTRA-AGGRESSIVE TIMEZONE OVERRIDE =====
  // Override ALL timezone-related functions with maximum force
  
  // Override Date constructor itself
  const OriginalDate = Date;
  const DateOverride = function(...args) {
    const date = new OriginalDate(...args);
    
    // Override all timezone methods
    date.getTimezoneOffset = () => 300; // UTC-5
    date.toLocaleString = function(locale, options) {
      return OriginalDate.prototype.toLocaleString.call(this, 'en-US', options);
    };
    date.toLocaleDateString = function(locale, options) {
      return OriginalDate.prototype.toLocaleDateString.call(this, 'en-US', options);
    };
    date.toLocaleTimeString = function(locale, options) {
      return OriginalDate.prototype.toLocaleTimeString.call(this, 'en-US', options);
    };
    
    return date;
  };
  
  // Copy all properties from original Date
  Object.setPrototypeOf(DateOverride, OriginalDate);
  DateOverride.prototype = OriginalDate.prototype;
  DateOverride.now = OriginalDate.now;
  DateOverride.parse = OriginalDate.parse;
  DateOverride.UTC = OriginalDate.UTC;
  
  // Replace global Date
  window.Date = DateOverride;
  
  // Override Date prototype methods
  Date.prototype.getTimezoneOffset = function() {
    return 300; // UTC-5
  };
  
  Date.prototype.toLocaleString = function(locale, options) {
    return OriginalDate.prototype.toLocaleString.call(this, 'en-US', options);
  };
  
  Date.prototype.toLocaleDateString = function(locale, options) {
    return OriginalDate.prototype.toLocaleDateString.call(this, 'en-US', options);
  };
  
  Date.prototype.toLocaleTimeString = function(locale, options) {
    return OriginalDate.prototype.toLocaleTimeString.call(this, 'en-US', options);
  };

  // Override Intl APIs with maximum force
  const originalDateTimeFormat = Intl.DateTimeFormat;
  const originalNumberFormat = Intl.NumberFormat;
  const originalCollator = Intl.Collator;
  
  // Override Intl.DateTimeFormat constructor
  Intl.DateTimeFormat = function(locale, options) {
    return new originalDateTimeFormat('en-US', options);
  };
  Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;
  Intl.DateTimeFormat.supportedLocalesOf = originalDateTimeFormat.supportedLocalesOf;
  
  // Override Intl.NumberFormat constructor
  Intl.NumberFormat = function(locale, options) {
    return new originalNumberFormat('en-US', options);
  };
  Intl.NumberFormat.prototype = originalNumberFormat.prototype;
  Intl.NumberFormat.supportedLocalesOf = originalNumberFormat.supportedLocalesOf;
  
  // Override Intl.Collator constructor
  Intl.Collator = function(locale, options) {
    return new originalCollator('en-US', options);
  };
  Intl.Collator.prototype = originalCollator.prototype;
  Intl.Collator.supportedLocalesOf = originalCollator.supportedLocalesOf;

  // ===== ULTRA-AGGRESSIVE WEBGL OVERRIDE =====
  if (typeof WebGLRenderingContext !== 'undefined') {
    try {
      // Override WebGL with maximum force
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
      
      log('WebGL overridden aggressively');
    } catch (e) {
      log('WebGL override failed', e.message);
    }
  }

  // ===== ULTRA-AGGRESSIVE AUDIO CONTEXT OVERRIDE =====
  if (typeof AudioContext !== 'undefined') {
    try {
        // Override sample rate with maximum force
  Object.defineProperty(AudioContext.prototype, 'sampleRate', {
    value: 44100,
    writable: false,
    configurable: true, // Keep configurable for other scripts
    enumerable: true
  });

      // Override createAnalyser with maximum force
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
        
          // Override analyser properties with maximum force
  const analyserProps = {
    fftSize: 2048,
    frequencyBinCount: 1024,
    minDecibels: -100,
    maxDecibels: -30,
    smoothingTimeConstant: 0.8
  };

  Object.entries(analyserProps).forEach(([prop, value]) => {
    try {
      // Check if property is already overridden
      const descriptor = Object.getOwnPropertyDescriptor(analyser, prop);
      
      // Skip if already overridden by this script
      if (descriptor && descriptor.configurable === false) {
        log(`Analyser ${prop} already overridden, skipping`);
        return;
      }
      
      Object.defineProperty(analyser, prop, {
        value: value,
        writable: false,
        configurable: true, // Keep configurable for other scripts
        enumerable: true
      });
    } catch (e) {
      log(`Analyser ${prop} override failed`, e.message);
    }
  });
        
        return analyser;
      };
      
      log('AudioContext overridden aggressively');
    } catch (e) {
      log('AudioContext override failed', e.message);
    }
  }

  // ===== ULTRA-AGGRESSIVE HTTP HEADERS OVERRIDE =====
  // Override fetch with maximum force
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    options = options || {};
    options.headers = options.headers || {};
    
    // Force override headers
    options.headers['Accept-Language'] = 'en-US,en;q=0.9';
    options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
    
    return originalFetch.call(this, url, options);
  };

  // Override XMLHttpRequest with maximum force
  const originalXHROpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 1) { // OPENED
        // Force set headers
        this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
        this.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
        this.setRequestHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36');
      }
    });
    return originalXHROpen.call(this, method, url, async, user, password);
  };

  // ===== ULTRA-AGGRESSIVE SCREEN OVERRIDE =====
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
      // Check if property is already overridden
      const descriptor = Object.getOwnPropertyDescriptor(screen, prop);
      
      // Skip if already overridden by this script
      if (descriptor && descriptor.configurable === false) {
        log(`Screen ${prop} already overridden, skipping`);
        return;
      }
      
      Object.defineProperty(screen, prop, {
        value: value,
        writable: false,
        configurable: true, // Keep configurable for other scripts
        enumerable: true
      });
    } catch (e) {
      log(`Screen ${prop} override failed`, e.message);
    }
  });

  // ===== ULTRA-AGGRESSIVE WINDOW OVERRIDE =====
  const windowProps = {
    innerWidth: 1920,
    innerHeight: 937,
    outerWidth: 1920,
    outerHeight: 1040,
    devicePixelRatio: 1
  };

  Object.entries(windowProps).forEach(([prop, value]) => {
    try {
      // Check if property is already overridden
      const descriptor = Object.getOwnPropertyDescriptor(window, prop);
      
      // Skip if already overridden by this script
      if (descriptor && descriptor.configurable === false) {
        log(`Window ${prop} already overridden, skipping`);
        return;
      }
      
      Object.defineProperty(window, prop, {
        value: value,
        writable: false,
        configurable: true, // Keep configurable for other scripts
        enumerable: true
      });
    } catch (e) {
      log(`Window ${prop} override failed`, e.message);
    }
  });

  // ===== ULTRA-AGGRESSIVE PLUGINS OVERRIDE =====
  try {
    // Check if property is already overridden
    const descriptor = Object.getOwnPropertyDescriptor(navigator, 'plugins');
    
    // Skip if already overridden by this script
    if (descriptor && descriptor.configurable === false) {
      log('Plugins already overridden, skipping');
    } else {
      Object.defineProperty(navigator, 'plugins', {
        value: [
          {
            name: 'PDF Viewer',
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer'
          },
          {
            name: 'Chrome PDF Viewer',
            description: 'Portable Document Format',
            filename: 'internal-pdf-viewer'
          }
        ],
        writable: false,
        configurable: true, // Keep configurable for other scripts
        enumerable: true
      });
    }
  } catch (e) {
    log('Plugins override failed', e.message);
  }

  // ===== ULTRA-AGGRESSIVE MEDIA DEVICES OVERRIDE =====
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

  // ===== ULTRA-AGGRESSIVE BATTERY OVERRIDE =====
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

  // ===== ULTRA-AGGRESSIVE CONNECTION OVERRIDE =====
  if (navigator.connection) {
    try {
      // Check if property is already overridden
      const descriptor = Object.getOwnPropertyDescriptor(navigator, 'connection');
      
      // Skip if already overridden by this script
      if (descriptor && descriptor.configurable === false) {
        log('Connection already overridden, skipping');
      } else {
        Object.defineProperty(navigator, 'connection', {
          value: {
            effectiveType: '4g',
            downlink: 10,
            rtt: 50,
            saveData: false
          },
          writable: false,
          configurable: true, // Keep configurable for other scripts
          enumerable: true
        });
      }
    } catch (e) {
      log('Connection override failed', e.message);
    }
  }

  // ===== ULTRA-AGGRESSIVE PERMISSIONS OVERRIDE =====
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

  // ===== ULTRA-AGGRESSIVE CANVAS OVERRIDE =====
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

  log('Aggressive override completed successfully');
  
  // Auto-test after a short delay
  setTimeout(() => {
    log('Running aggressive protection test...');
    if (window.testLanguageTimezone) {
      window.testLanguageTimezone();
    }
    if (window.testIncognitoProtection) {
      window.testIncognitoProtection();
    }
  }, 1000);
})(); 