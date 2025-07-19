// Advanced Protection - Sophisticated fingerprinting prevention
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('AdvancedProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][AdvancedProtection]', message, data);
    }
  };
  
  log('Advanced protection starting...');

  // ===== ADVANCED FONT FINGERPRINTING PROTECTION =====
  if (document.fonts && document.fonts.check) {
    const originalCheck = document.fonts.check;
    document.fonts.check = function(font, text) {
      // Return consistent results for common font detection
      const commonFonts = [
        'Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier',
        'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Console', 'Tahoma',
        'Lucida Sans Unicode', 'Franklin Gothic Medium', 'Arial Narrow'
      ];
      
      if (commonFonts.some(fontName => font.includes(fontName))) {
        return true; // Always return true for common fonts
      }
      return originalCheck.call(this, font, text);
    };
    log('Font detection protection applied');
  }

  // ===== ADVANCED CANVAS FINGERPRINTING PROTECTION =====
  if (HTMLCanvasElement.prototype.toDataURL) {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(type, quality) {
      // Generate consistent but unique canvas fingerprints
      const canvas = this;
      const context = canvas.getContext('2d');
      
      if (context) {
        // Add subtle randomization to prevent exact fingerprinting
        const randomOffset = Math.random() * 0.001;
        context.translate(randomOffset, randomOffset);
        
        // Override text rendering with slight variations
        const originalFillText = context.fillText;
        context.fillText = function(text, x, y, maxWidth) {
          const randomX = x + (Math.random() - 0.5) * 0.1;
          const randomY = y + (Math.random() - 0.5) * 0.1;
          return originalFillText.call(this, text, randomX, randomY, maxWidth);
        };
      }
      
      return originalToDataURL.call(this, type, quality);
    };
    log('Advanced canvas protection applied');
  }

  // ===== ADVANCED WEBRTC PROTECTION =====
  if (window.RTCPeerConnection) {
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    if (originalGetUserMedia) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // Block or modify media access requests
        if (constraints.audio || constraints.video) {
          log('Media access blocked', constraints);
          return Promise.reject(new Error('Permission denied'));
        }
        return originalGetUserMedia.call(this, constraints);
      };
    }
    
    // Override RTCPeerConnection to prevent IP leakage
    const originalRTCPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(configuration) {
      const pc = new originalRTCPeerConnection(configuration);
      
      // Override createOffer and createAnswer to remove IP addresses
      const originalCreateOffer = pc.createOffer;
      pc.createOffer = function(options) {
        return originalCreateOffer.call(this, options).then(offer => {
          // Remove IP addresses from SDP
          offer.sdp = offer.sdp.replace(/IP4 [0-9.]+/g, 'IP4 0.0.0.0');
          return offer;
        });
      };
      
      const originalCreateAnswer = pc.createAnswer;
      pc.createAnswer = function(options) {
        return originalCreateAnswer.call(this, options).then(answer => {
          // Remove IP addresses from SDP
          answer.sdp = answer.sdp.replace(/IP4 [0-9.]+/g, 'IP4 0.0.0.0');
          return answer;
        });
      };
      
      return pc;
    };
    log('WebRTC protection applied');
  }

  // ===== ADVANCED STORAGE PROTECTION =====
  // Override IndexedDB to prevent fingerprinting
  if (window.indexedDB) {
    const originalOpen = window.indexedDB.open;
    window.indexedDB.open = function(name, version) {
      // Add randomization to database names to prevent tracking
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const modifiedName = name + '_' + randomSuffix;
      return originalOpen.call(this, modifiedName, version);
    };
    log('IndexedDB protection applied');
  }

  // ===== ADVANCED NETWORK FINGERPRINTING PROTECTION =====
  // Override performance timing to prevent network fingerprinting
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const originalGetEntries = window.performance.getEntries;
    
    window.performance.getEntries = function() {
      const entries = originalGetEntries.call(this);
      // Add randomization to timing data
      return entries.map(entry => {
        if (entry.duration) {
          entry.duration += (Math.random() - 0.5) * 10;
        }
        return entry;
      });
    };
    log('Performance timing protection applied');
  }

  // ===== ADVANCED BEHAVIORAL FINGERPRINTING PROTECTION =====
  // Override mouse and keyboard events to prevent behavioral fingerprinting
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    // Add randomization to mouse events
    if (type.startsWith('mouse') || type.startsWith('pointer')) {
      const originalListener = listener;
      listener = function(event) {
        // Add slight randomization to mouse coordinates
        if (event.clientX !== undefined) {
          event.clientX += (Math.random() - 0.5) * 2;
        }
        if (event.clientY !== undefined) {
          event.clientY += (Math.random() - 0.5) * 2;
        }
        return originalListener.call(this, event);
      };
    }
    
    return originalAddEventListener.call(this, type, listener, options);
  };
  log('Behavioral fingerprinting protection applied');

  // ===== ADVANCED SENSOR PROTECTION =====
  // Override device sensors to prevent sensor-based fingerprinting
  if (window.DeviceMotionEvent) {
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'devicemotion') {
        const originalListener = listener;
        listener = function(event) {
          // Add randomization to motion data
          if (event.acceleration) {
            event.acceleration.x += (Math.random() - 0.5) * 0.1;
            event.acceleration.y += (Math.random() - 0.5) * 0.1;
            event.acceleration.z += (Math.random() - 0.5) * 0.1;
          }
          return originalListener.call(this, event);
        };
      }
      return originalAddEventListener.call(this, type, listener, options);
    };
    log('Sensor protection applied');
  }

  // ===== ADVANCED BROWSER API PROTECTION =====
  // Override various browser APIs that can be used for fingerprinting
  
  // Gamepad API
  if (navigator.getGamepads) {
    const originalGetGamepads = navigator.getGamepads;
    navigator.getGamepads = function() {
      return []; // Return empty array to prevent gamepad fingerprinting
    };
  }
  
  // Bluetooth API
  if (navigator.bluetooth) {
    const originalRequestDevice = navigator.bluetooth.requestDevice;
    navigator.bluetooth.requestDevice = function(options) {
      return Promise.reject(new Error('Bluetooth not available'));
    };
  }
  
  // USB API
  if (navigator.usb) {
    const originalRequestDevice = navigator.usb.requestDevice;
    navigator.usb.requestDevice = function(options) {
      return Promise.reject(new Error('USB not available'));
    };
  }
  
  // Serial API
  if (navigator.serial) {
    const originalRequestPort = navigator.serial.requestPort;
    navigator.serial.requestPort = function(options) {
      return Promise.reject(new Error('Serial not available'));
    };
  }
  log('Browser API protection applied');

  // ===== ADVANCED CSS FINGERPRINTING PROTECTION =====
  // Override CSS properties that can be used for fingerprinting
  if (window.getComputedStyle) {
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(element, pseudoElement) {
      const style = originalGetComputedStyle.call(this, element, pseudoElement);
      
      // Override font-related properties
      const fontProperties = ['font-family', 'font-size', 'font-weight', 'font-style'];
      fontProperties.forEach(prop => {
        try {
          Object.defineProperty(style, prop, {
            get: () => 'Arial',
            configurable: true
          });
        } catch (e) {
          // Ignore errors for non-configurable properties
        }
      });
      
      return style;
    };
    log('CSS fingerprinting protection applied');
  }

  // ===== ADVANCED DOM FINGERPRINTING PROTECTION =====
  // Override DOM methods that can reveal system information
  if (document.createElement) {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(this, tagName);
      
      // Override element properties that can be used for fingerprinting
      if (tagName.toLowerCase() === 'canvas') {
        const originalGetContext = element.getContext;
        element.getContext = function(contextType, contextAttributes) {
          const context = originalGetContext.call(this, contextType, contextAttributes);
          
          if (contextType === '2d' && context) {
            // Override canvas context properties
            const originalFillText = context.fillText;
            context.fillText = function(text, x, y, maxWidth) {
              // Add slight randomization to prevent exact fingerprinting
              const randomX = x + (Math.random() - 0.5) * 0.1;
              const randomY = y + (Math.random() - 0.5) * 0.1;
              return originalFillText.call(this, text, randomX, randomY, maxWidth);
            };
          }
          
          return context;
        };
      }
      
      return element;
    };
    log('DOM fingerprinting protection applied');
  }

  // ===== ADVANCED CRYPTOGRAPHIC PROTECTION =====
  // Override crypto API to prevent timing attacks
  if (window.crypto && window.crypto.subtle) {
    const originalSubtle = window.crypto.subtle;
    const originalDigest = originalSubtle.digest;
    
    originalSubtle.digest = function(algorithm, data) {
      // Add slight delay to prevent timing attacks
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          originalDigest.call(this, algorithm, data)
            .then(resolve)
            .catch(reject);
        }, Math.random() * 10);
      });
    };
    log('Cryptographic protection applied');
  }

  // ===== ADVANCED MEMORY PROTECTION =====
  // Override memory-related APIs to prevent memory fingerprinting
  if (performance.memory) {
    try {
      Object.defineProperty(performance, 'memory', {
        get: () => ({
          jsHeapSizeLimit: 2147483648,
          totalJSHeapSize: 1073741824,
          usedJSHeapSize: 536870912
        }),
        configurable: true
      });
    } catch (e) {
      log('Memory protection failed', e.message);
    }
    log('Memory protection applied');
  }

  log('Advanced protection completed successfully');
  
  // Auto-test after a short delay
  setTimeout(() => {
    log('Running advanced protection test...');
    if (window.testIncognitoProtection) {
      window.testIncognitoProtection();
    }
  }, 1000);
})(); 