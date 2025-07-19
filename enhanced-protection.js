// Enhanced protection for remaining fingerprinting vectors
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('EnhancedProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][EnhancedProtection]', message, data);
    }
  };
  
  log('Starting enhanced protection...');

  // Enhanced WebGL protection - Skip if already handled by ultimate fix
  if (typeof WebGLRenderingContext !== 'undefined' && !window.incognitoWebGLHandled) {
    try {
      window.incognitoWebGLHandled = true;
      
      const vendors = [
        {vendor: 'Intel Inc.', renderer: 'Intel(R) UHD Graphics 620'},
        {vendor: 'NVIDIA Corporation', renderer: 'NVIDIA GeForce GTX 1050 Ti/PCIe/SSE2'},
        {vendor: 'AMD', renderer: 'AMD Radeon Pro 560X OpenGL Engine'},
        {vendor: 'Mesa/X.org', renderer: 'Mesa Intel(R) UHD Graphics 620 (KBL GT2)'}
      ];
      const selected = vendors[Math.floor(Math.random() * vendors.length)];

      const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(pname) {
        const params = {
          37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
          37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
          7936: selected.vendor,
          7937: selected.renderer,
          37447: 'ANGLE',
          7938: selected.vendor,
          7939: selected.renderer,
          3379: 16384,
          34024: 16384,
          34930: 4096,
          35660: 16
        };
        
        if (params[pname] !== undefined) return params[pname];
        return originalGetParameter.call(this, pname);
      };
      
      log('WebGL protection applied successfully');
    } catch (e) {
      log('WebGL protection failed', e.message);
      window.incognitoWebGLHandled = false; // Reset flag on failure
    }
  } else if (window.incognitoWebGLHandled) {
    log('WebGL already handled by another script, skipping');
  }

  // Enhanced Audio Context protection - Skip if already handled by ultimate fix
  if (typeof AudioContext !== 'undefined' && !window.incognitoAudioContextHandled) {
    try {
      window.incognitoAudioContextHandled = true;
      
      // Check if we can safely override AudioContext
      const audioContextDescriptor = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'createAnalyser');
      const sampleRateDescriptor = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'sampleRate');
      
      // Only proceed if properties are configurable or not already defined
      if ((!audioContextDescriptor || audioContextDescriptor.configurable) && 
          (!sampleRateDescriptor || sampleRateDescriptor.configurable)) {
        
        const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
        AudioContext.prototype.createAnalyser = function() {
          const analyser = originalCreateAnalyser.call(this);
          
          const fftSizes = [256, 512, 1024, 2048, 4096];
          const randomFftSize = fftSizes[Math.floor((window.getRandomFloat ? window.getRandomFloat(0, fftSizes.length) : Math.random() * fftSizes.length))];
          
          // Only override analyser properties if they're configurable
          try {
            const fftSizeDescriptor = Object.getOwnPropertyDescriptor(analyser, 'fftSize');
            if (!fftSizeDescriptor || fftSizeDescriptor.configurable) {
              Object.defineProperty(analyser, 'fftSize', {
                get: () => randomFftSize,
                set: () => {},
                configurable: true
              });
            }
          } catch (e) {
            log('Analyser fftSize override failed', e.message);
          }
          
          try {
            const minDecibelsDescriptor = Object.getOwnPropertyDescriptor(analyser, 'minDecibels');
            if (!minDecibelsDescriptor || minDecibelsDescriptor.configurable) {
              Object.defineProperty(analyser, 'minDecibels', {
                get: () => window.getRandomFloat ? window.getRandomFloat(-100, -80) : Math.random() * 20 - 100,
                set: () => {},
                configurable: true
              });
            }
          } catch (e) {
            log('Analyser minDecibels override failed', e.message);
          }
          
          try {
            const maxDecibelsDescriptor = Object.getOwnPropertyDescriptor(analyser, 'maxDecibels');
            if (!maxDecibelsDescriptor || maxDecibelsDescriptor.configurable) {
              Object.defineProperty(analyser, 'maxDecibels', {
                get: () => window.getRandomFloat ? window.getRandomFloat(-30, -10) : Math.random() * 20 - 30,
                set: () => {},
                configurable: true
              });
            }
          } catch (e) {
            log('Analyser maxDecibels override failed', e.message);
          }
          
          try {
            const smoothingTimeConstantDescriptor = Object.getOwnPropertyDescriptor(analyser, 'smoothingTimeConstant');
            if (!smoothingTimeConstantDescriptor || smoothingTimeConstantDescriptor.configurable) {
              Object.defineProperty(analyser, 'smoothingTimeConstant', {
                get: () => window.getRandomFloat ? window.getRandomFloat(0.5, 0.9) : Math.random() * 0.4 + 0.5,
                set: () => {},
                configurable: true
              });
            }
          } catch (e) {
            log('Analyser smoothingTimeConstant override failed', e.message);
          }
          
          return analyser;
        };
        
        // Randomize sample rate only if configurable
        try {
          const sampleRates = [44100, 48000, 96000, 88200];
          const spoofedSampleRate = sampleRates[Math.floor((window.getRandomFloat ? window.getRandomFloat(0, sampleRates.length) : Math.random() * sampleRates.length))];
          
          Object.defineProperty(AudioContext.prototype, 'sampleRate', {
            get: () => spoofedSampleRate,
            set: () => {},
            configurable: true
          });
          
          log('AudioContext protection applied successfully');
        } catch (e) {
          log('AudioContext sampleRate override failed', e.message);
        }
      } else {
        log('AudioContext properties not configurable, skipping AudioContext protection');
      }
    } catch (e) {
      log('AudioContext protection failed', e.message);
      window.incognitoAudioContextHandled = false; // Reset flag on failure
    }
  } else if (window.incognitoAudioContextHandled) {
    log('AudioContext already handled by another script, skipping');
  }

  // Enhanced Media Devices protection
  if (navigator.mediaDevices) {
    const originalEnumerateDevices = navigator.mediaDevices.enumerateDevices;
    navigator.mediaDevices.enumerateDevices = function() {
      return Promise.resolve([
        {
          deviceId: 'default',
          kind: 'audioinput',
          label: 'Default - Microphone',
          groupId: 'default-group'
        },
        {
          deviceId: 'default',
          kind: 'audiooutput',
          label: 'Default - Speaker',
          groupId: 'default-group'
        },
        {
          deviceId: 'default',
          kind: 'videoinput',
          label: 'Default - Camera',
          groupId: 'default-group'
        }
      ]);
    };
  }

  // Enhanced Permissions protection
  if (navigator.permissions) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = function(permissionDesc) {
      const grantedPermissions = [
        'accelerometer', 'accessibility', 'ambient-light-sensor', 'camera',
        'clipboard-read', 'clipboard-write', 'geolocation', 'background-sync',
        'magnetometer', 'microphone', 'midi', 'notifications', 'payment-handler',
        'persistent-storage', 'push'
      ];
      
      if (grantedPermissions.includes(permissionDesc.name)) {
        return Promise.resolve({ state: 'granted' });
      }
      
      return originalQuery.call(this, permissionDesc);
    };
  }

  // Enhanced Screen protection
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
      const descriptor = Object.getOwnPropertyDescriptor(screen, prop);
      if (!descriptor || descriptor.configurable) {
        Object.defineProperty(screen, prop, {
          get: () => value,
          set: () => {},
          configurable: true,
          enumerable: true
        });
      } else {
        log(`Screen property ${prop} already defined, skipping`);
      }
    } catch (e) {
      log(`Screen property ${prop} override failed`, e.message);
    }
  });

  // Enhanced Window protection
  const windowProps = {
    innerWidth: 1920,
    innerHeight: 937,
    outerWidth: 1920,
    outerHeight: 1040,
    devicePixelRatio: 1
  };

  Object.entries(windowProps).forEach(([prop, value]) => {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(window, prop);
      if (!descriptor || descriptor.configurable) {
        Object.defineProperty(window, prop, {
          get: () => value,
          set: () => {},
          configurable: true,
          enumerable: true
        });
      } else {
        log(`Window property ${prop} already defined, skipping`);
      }
    } catch (e) {
      log(`Window property ${prop} override failed`, e.message);
    }
  });

  log('Enhanced protection completed');
})(); 