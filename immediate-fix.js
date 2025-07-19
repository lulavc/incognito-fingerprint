// Immediate fix - runs as early as possible to override platform and language
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('ImmediateFix');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][ImmediateFix]', message, data);
    }
  };
  
  const logOverride = (property, value) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.trackOverride(property, value);
    } else {
      console.log('[Incognito Fingerprint][ImmediateFix] Override applied:', property, '=', value);
    }
  };
  
  const logFailure = (property, error) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.trackFailure(property, error);
    } else {
      console.warn('[Incognito Fingerprint][ImmediateFix] Override failed:', property, error);
    }
  };
  
  log('Applying immediate fixes...');
  
  // IMMEDIATE platform override - before anything else
  try {
    // Override navigator.platform immediately
    Object.defineProperty(navigator, 'platform', {
      get: function() {
        return 'Linux x86_64';
      },
      set: function() {},
      configurable: true,
      enumerable: true
    });
    logOverride('navigator.platform', 'Linux x86_64');
  } catch (e) {
    logFailure('navigator.platform', e);
  }
  
  // IMMEDIATE language override
  try {
    Object.defineProperty(navigator, 'language', {
      get: function() {
        return 'en-US';
      },
      set: function() {},
      configurable: true,
      enumerable: true
    });
    
    Object.defineProperty(navigator, 'languages', {
      get: function() {
        return ['en-US', 'en'];
      },
      set: function() {},
      configurable: true,
      enumerable: true
    });
    logOverride('navigator.language', 'en-US');
    logOverride('navigator.languages', ['en-US', 'en']);
  } catch (e) {
    logFailure('navigator.language', e);
  }
  
  // IMMEDIATE userAgentData override
  if (typeof navigator.userAgentData !== 'undefined') {
    try {
      Object.defineProperty(navigator, 'userAgentData', {
        value: {
          brands: [
            {brand: 'Chromium', version: '138'},
            {brand: 'Google Chrome', version: '138'},
            {brand: 'Not;A=Brand', version: '99'}
          ],
          mobile: false,
          platform: 'Linux',
          getHighEntropyValues: function(hints) {
            return Promise.resolve({
              brands: [
                {brand: 'Chromium', version: '138'},
                {brand: 'Google Chrome', version: '138'},
                {brand: 'Not;A=Brand', version: '99'}
              ],
              platform: 'Linux',
              architecture: 'x86',
              model: '',
              uaFullVersion: '138.0.0.0',
              fullVersionList: [
                {brand: 'Chromium', version: '138'},
                {brand: 'Google Chrome', version: '138'},
                {brand: 'Not;A=Brand', version: '99'}
              ],
              bitness: '64',
              wow64: false
            });
          }
        },
        configurable: true
      });
      console.log('[Incognito Fingerprint] userAgentData immediately overridden');
    } catch (e) {
      console.warn('[Incognito Fingerprint] userAgentData override failed:', e);
    }
  }
  
  // IMMEDIATE timezone override
  try {
    Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
      value: function() {
        return 300; // UTC-5 (America/New_York)
      },
      configurable: true
    });
    console.log('[Incognito Fingerprint] Timezone immediately overridden');
  } catch (e) {
    console.warn('[Incognito Fingerprint] Timezone override failed:', e);
  }
  
  // IMMEDIATE screen properties override
  try {
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
      Object.defineProperty(screen, prop, {
        get: function() {
          return value;
        },
        set: function() {},
        configurable: true,
        enumerable: true
      });
    });
    console.log('[Incognito Fingerprint] Screen properties immediately overridden');
  } catch (e) {
    console.warn('[Incognito Fingerprint] Screen properties override failed:', e);
  }
  
  // IMMEDIATE window properties override
  try {
    const windowProps = {
      innerWidth: 1920,
      innerHeight: 937,
      outerWidth: 1920,
      outerHeight: 1040,
      devicePixelRatio: 1
    };
    
    Object.entries(windowProps).forEach(([prop, value]) => {
      Object.defineProperty(window, prop, {
        get: function() {
          return value;
        },
        set: function() {},
        configurable: true,
        enumerable: true
      });
    });
    console.log('[Incognito Fingerprint] Window properties immediately overridden');
  } catch (e) {
    console.warn('[Incognito Fingerprint] Window properties override failed:', e);
  }
  
  // IMMEDIATE permissions override
  if (navigator.permissions) {
    try {
      navigator.permissions.query = function(permissionDesc) {
        return Promise.resolve({ state: 'granted' });
      };
      console.log('[Incognito Fingerprint] Permissions immediately overridden');
    } catch (e) {
      console.warn('[Incognito Fingerprint] Permissions override failed:', e);
    }
  }
  
  // IMMEDIATE media devices override
  if (navigator.mediaDevices) {
    try {
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
      console.log('[Incognito Fingerprint] Media devices immediately overridden');
    } catch (e) {
      console.warn('[Incognito Fingerprint] Media devices override failed:', e);
    }
  }
  
  // IMMEDIATE WebGL override
  if (typeof WebGLRenderingContext !== 'undefined') {
    try {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl' || type === 'experimental-webgl') {
          const context = originalGetContext.call(this, type, attributes);
          
          if (context) {
            const getParameter = context.getParameter;
            context.getParameter = function(pname) {
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
              return getParameter.call(this, pname);
            };
          }
          
          return context;
        }
        
        return originalGetContext.call(this, type, attributes);
      };
      console.log('[Incognito Fingerprint] WebGL immediately overridden');
    } catch (e) {
      console.warn('[Incognito Fingerprint] WebGL override failed:', e);
    }
  }
  
  // IMMEDIATE Audio Context override
  if (typeof AudioContext !== 'undefined') {
    try {
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
        
        Object.defineProperty(analyser, 'fftSize', {
          get: () => 1024,
          set: () => {},
          configurable: true
        });
        
        Object.defineProperty(analyser, 'frequencyBinCount', {
          get: () => 512,
          set: () => {},
          configurable: true
        });
        
        Object.defineProperty(analyser, 'minDecibels', {
          get: () => -90,
          set: () => {},
          configurable: true
        });
        
        Object.defineProperty(analyser, 'maxDecibels', {
          get: () => -20,
          set: () => {},
          configurable: true
        });
        
        Object.defineProperty(analyser, 'smoothingTimeConstant', {
          get: () => 0.7,
          set: () => {},
          configurable: true
        });
        
        return analyser;
      };
      
      Object.defineProperty(AudioContext.prototype, 'sampleRate', {
        get: () => 48000,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(AudioContext.prototype, 'state', {
        get: () => 'running',
        set: () => {},
        configurable: true
      });
      console.log('[Incognito Fingerprint] Audio Context immediately overridden');
    } catch (e) {
      console.warn('[Incognito Fingerprint] Audio Context override failed:', e);
    }
  }
  
  console.log('[Incognito Fingerprint] All immediate fixes applied');
})(); 