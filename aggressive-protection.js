// Aggressive protection for persistent fingerprinting issues
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('AggressiveProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][AggressiveProtection]', message, data);
    }
  };
  
  log('Starting aggressive protection...');

  // Global flag to prevent multiple overrides
  if (window._aggressiveProtectionApplied) {
    log('Aggressive protection already applied, skipping...');
    return;
  }
  window._aggressiveProtectionApplied = true;

  // Safe property override function
  function safeOverride(obj, prop, getter, setter = () => {}) {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      if (!descriptor || descriptor.configurable !== false) {
        Object.defineProperty(obj, prop, {
          get: getter,
          set: setter,
          configurable: true,
          enumerable: true
        });
        return true;
      }
      return false;
    } catch (e) {
      log(`Failed to override ${prop}`, e.message);
      return false;
    }
  }

  // Force platform to match User-Agent (Linux x86_64)
  safeOverride(navigator, 'platform', () => 'Linux x86_64');

  // Force language to be en-US
  safeOverride(navigator, 'language', () => 'en-US');
  safeOverride(navigator, 'languages', () => ['en-US', 'en']);

  // Force timezone to be consistent
  safeOverride(Date.prototype, 'getTimezoneOffset', () => 300); // UTC-5 (America/New_York)

  // Override Intl.DateTimeFormat safely
  try {
    const originalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function(locales, options) {
      options = options || {};
      options.timeZone = 'America/New_York';
      return new originalDateTimeFormat(locales, options);
    };
    Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;
  } catch (e) {
    log('Intl.DateTimeFormat override failed', e.message);
  }

  // Aggressive WebGL protection
  if (typeof WebGLRenderingContext !== 'undefined') {
    try {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl' || type === 'experimental-webgl') {
          const context = originalGetContext.call(this, type, attributes);
          
          if (context) {
            // Store original methods to avoid recursion
            const originalGetParameter = context.getParameter;
            const originalGetSupportedExtensions = context.getSupportedExtensions;
            
            // Override getParameter
            context.getParameter = function(pname) {
              const params = {
                // WebGL version constants
                37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                // Vendor/renderer
                7936: 'Intel Inc.',
                7937: 'Intel(R) UHD Graphics 620',
                37447: 'ANGLE',
                7938: 'Intel Inc.',
                7939: 'Intel(R) UHD Graphics 620',
                // Hardware limits
                3379: 16384,
                34024: 16384,
                34930: 4096,
                35660: 16
              };
              
              if (params[pname] !== undefined) return params[pname];
              return originalGetParameter.call(this, pname);
            };

            // Override getSupportedExtensions
            context.getSupportedExtensions = function() {
              return [
                'ANGLE_instanced_arrays',
                'EXT_blend_minmax',
                'EXT_color_buffer_half_float',
                'EXT_disjoint_timer_query',
                'EXT_float_blend',
                'EXT_frag_depth',
                'EXT_shader_texture_lod',
                'EXT_texture_compression_bptc',
                'EXT_texture_compression_rgtc',
                'EXT_texture_filter_anisotropic',
                'OES_element_index_uint',
                'OES_standard_derivatives',
                'OES_texture_float',
                'OES_texture_float_linear',
                'OES_texture_half_float',
                'OES_texture_half_float_linear',
                'OES_vertex_array_object',
                'WEBGL_color_buffer_float',
                'WEBGL_compressed_texture_s3tc',
                'WEBGL_compressed_texture_s3tc_srgb',
                'WEBGL_debug_renderer_info',
                'WEBGL_debug_shaders',
                'WEBGL_depth_texture',
                'WEBGL_draw_buffers',
                'WEBGL_lose_context',
                'WEBGL_multi_draw'
              ];
            };

            // Initialize context
            try {
              context.clearColor(0, 0, 0, 1);
              context.clear(context.COLOR_BUFFER_BIT);
            } catch (e) {
              // Ignore initialization errors
            }
          }
          
          return context;
        }
        
        return originalGetContext.call(this, type, attributes);
      };
    } catch (e) {
      log('WebGL protection failed', e.message);
    }
  }

  // Aggressive Audio Context protection
  if (typeof AudioContext !== 'undefined') {
    try {
      const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
      AudioContext.prototype.createAnalyser = function() {
        const analyser = originalCreateAnalyser.call(this);
        
        // Force specific values that are common
        safeOverride(analyser, 'fftSize', () => 1024);
        safeOverride(analyser, 'frequencyBinCount', () => 512);
        safeOverride(analyser, 'minDecibels', () => -90);
        safeOverride(analyser, 'maxDecibels', () => -20);
        safeOverride(analyser, 'smoothingTimeConstant', () => 0.7);
        
        return analyser;
      };

      // Force sample rate and state
      safeOverride(AudioContext.prototype, 'sampleRate', () => 48000);
      safeOverride(AudioContext.prototype, 'state', () => 'running');
    } catch (e) {
      log('Audio context protection failed', e.message);
    }
  }

  // Aggressive Screen protection
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
    safeOverride(screen, prop, () => value);
  });

  // Aggressive Window protection
  const windowProps = {
    innerWidth: 1920,
    innerHeight: 937,
    outerWidth: 1920,
    outerHeight: 1040,
    devicePixelRatio: 1
  };

  Object.entries(windowProps).forEach(([prop, value]) => {
    safeOverride(window, prop, () => value);
  });

  // Aggressive Media Devices protection
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
    } catch (e) {
      log('Media devices protection failed', e.message);
    }
  }

  // Aggressive Permissions protection
  if (navigator.permissions) {
    try {
      navigator.permissions.query = function(permissionDesc) {
        return Promise.resolve({ state: 'granted' });
      };
    } catch (e) {
      log('Permissions protection failed', e.message);
    }
  }

  // Override User-Agent Client Hints
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
          getHighEntropyValues: (hints) => Promise.resolve({
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
          })
        },
        configurable: true
      });
    } catch (e) {
      log('User-Agent Data protection failed', e.message);
    }
  }

  log('Aggressive protection completed successfully');
})(); 