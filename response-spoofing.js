// Comprehensive response spoofing for all browser APIs and network requests
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('ResponseSpoofing');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][ResponseSpoofing]', message, data);
    }
  };
  
  log('Starting comprehensive response spoofing...');

  // Spoof all fetch responses
  const originalFetch = window.fetch;
  window.fetch = function(input, init) {
    // Force headers to be consistent
    init = init || {};
    init.headers = init.headers || {};
    
    // Force Accept-Language header
    if (init.headers instanceof Headers) {
      init.headers.set('Accept-Language', 'en-US,en;q=0.9');
    } else {
      init.headers['Accept-Language'] = 'en-US,en;q=0.9';
    }
    
    return originalFetch.call(this, input, init).then(response => {
      // Clone the response to modify it
      const originalJson = response.json;
      const originalText = response.text;
      const originalArrayBuffer = response.arrayBuffer;
      
      // Override response.json() to spoof language-related data
      response.json = function() {
        return originalJson.call(this).then(data => {
          // Spoof common language/timezone fields in JSON responses
          if (data && typeof data === 'object') {
            // Common language fields
            if (data.language) data.language = 'en-US';
            if (data.locale) data.locale = 'en-US';
            if (data.lang) data.lang = 'en';
            if (data.timezone) data.timezone = 'America/New_York';
            if (data.timeZone) data.timeZone = 'America/New_York';
            if (data.offset) data.offset = -300;
            
            // Common user agent fields
            if (data.userAgent) data.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
            if (data.platform) data.platform = 'Linux x86_64';
            
            // Common screen fields
            if (data.screen) {
              data.screen.width = 1920;
              data.screen.height = 1080;
              data.screen.availWidth = 1920;
              data.screen.availHeight = 1040;
            }
            
            // Common navigator fields
            if (data.navigator) {
              data.navigator.language = 'en-US';
              data.navigator.languages = ['en-US', 'en'];
              data.navigator.platform = 'Linux x86_64';
              data.navigator.hardwareConcurrency = 16;
              data.navigator.deviceMemory = 8;
            }
          }
          return data;
        });
      };
      
      // Override response.text() to spoof text content
      response.text = function() {
        return originalText.call(this).then(text => {
          // Replace common language/timezone patterns in text
          text = text.replace(/pt-BR/g, 'en-US');
          text = text.replace(/pt/g, 'en');
          text = text.replace(/UTC-03:00/g, 'UTC-05:00');
          text = text.replace(/America\/Sao_Paulo/g, 'America/New_York');
          text = text.replace(/MacIntel/g, 'Linux x86_64');
          return text;
        });
      };
      
      return response;
    });
  };

  // Spoof all XMLHttpRequest responses
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    this._incognitoSpoofed = true;
    return originalXHROpen.call(this, method, url, async, user, password);
  };
  
  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    // Force Accept-Language header
    if (header.toLowerCase() === 'accept-language') {
      value = 'en-US,en;q=0.9';
    }
    return originalXHRSetRequestHeader.call(this, header, value);
  };
  
  XMLHttpRequest.prototype.send = function(data) {
    const xhr = this;
    const originalOnReadyStateChange = xhr.onreadystatechange;
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        // Spoof response data
        const originalResponseText = xhr.responseText;
        const originalResponse = xhr.response;
        
        // Override responseText
        Object.defineProperty(xhr, 'responseText', {
          get: function() {
            let text = originalResponseText;
            // Replace language/timezone patterns
            text = text.replace(/pt-BR/g, 'en-US');
            text = text.replace(/pt/g, 'en');
            text = text.replace(/UTC-03:00/g, 'UTC-05:00');
            text = text.replace(/America\/Sao_Paulo/g, 'America/New_York');
            text = text.replace(/MacIntel/g, 'Linux x86_64');
            return text;
          },
          configurable: true
        });
        
        // Override response for JSON
        if (xhr.responseType === '' || xhr.responseType === 'json') {
          Object.defineProperty(xhr, 'response', {
            get: function() {
              try {
                const data = JSON.parse(originalResponseText);
                // Spoof JSON data
                if (data && typeof data === 'object') {
                  if (data.language) data.language = 'en-US';
                  if (data.locale) data.locale = 'en-US';
                  if (data.lang) data.lang = 'en';
                  if (data.timezone) data.timezone = 'America/New_York';
                  if (data.timeZone) data.timeZone = 'America/New_York';
                  if (data.offset) data.offset = -300;
                  if (data.userAgent) data.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';
                  if (data.platform) data.platform = 'Linux x86_64';
                }
                return data;
              } catch (e) {
                return originalResponse;
              }
            },
            configurable: true
          });
        }
      }
      
      if (originalOnReadyStateChange) {
        originalOnReadyStateChange.call(this);
      }
    };
    
    return originalXHRSend.call(this, data);
  };

  // Spoof all WebSocket messages
  const originalWebSocket = window.WebSocket;
  window.WebSocket = function(url, protocols) {
    const ws = new originalWebSocket(url, protocols);
    
    const originalSend = ws.send;
    ws.send = function(data) {
      // Spoof outgoing messages
      if (typeof data === 'string') {
        data = data.replace(/pt-BR/g, 'en-US');
        data = data.replace(/pt/g, 'en');
        data = data.replace(/UTC-03:00/g, 'UTC-05:00');
        data = data.replace(/America\/Sao_Paulo/g, 'America/New_York');
        data = data.replace(/MacIntel/g, 'Linux x86_64');
      }
      return originalSend.call(this, data);
    };
    
    const originalOnMessage = ws.onmessage;
    ws.onmessage = function(event) {
      // Spoof incoming messages
      if (event.data && typeof event.data === 'string') {
        event.data = event.data.replace(/pt-BR/g, 'en-US');
        event.data = event.data.replace(/pt/g, 'en');
        event.data = event.data.replace(/UTC-03:00/g, 'UTC-05:00');
        event.data = event.data.replace(/America\/Sao_Paulo/g, 'America/New_York');
        event.data = event.data.replace(/MacIntel/g, 'Linux x86_64');
      }
      
      if (originalOnMessage) {
        originalOnMessage.call(this, event);
      }
    };
    
    return ws;
  };
  window.WebSocket.prototype = originalWebSocket.prototype;

  // Spoof all EventSource responses
  const originalEventSource = window.EventSource;
  window.EventSource = function(url, eventSourceInitDict) {
    const es = new originalEventSource(url, eventSourceInitDict);
    
    const originalOnMessage = es.onmessage;
    es.onmessage = function(event) {
      // Spoof server-sent events
      if (event.data) {
        event.data = event.data.replace(/pt-BR/g, 'en-US');
        event.data = event.data.replace(/pt/g, 'en');
        event.data = event.data.replace(/UTC-03:00/g, 'UTC-05:00');
        event.data = event.data.replace(/America\/Sao_Paulo/g, 'America/New_York');
        event.data = event.data.replace(/MacIntel/g, 'Linux x86_64');
      }
      
      if (originalOnMessage) {
        originalOnMessage.call(this, event);
      }
    };
    
    return es;
  };
  window.EventSource.prototype = originalEventSource.prototype;

  // Spoof all navigator API responses
  if (navigator.getBattery) {
    const originalGetBattery = navigator.getBattery;
    navigator.getBattery = function() {
      return originalGetBattery.call(this).then(battery => {
        // Spoof battery info
        Object.defineProperty(battery, 'charging', {
          get: () => true,
          configurable: true
        });
        Object.defineProperty(battery, 'chargingTime', {
          get: () => 0,
          configurable: true
        });
        Object.defineProperty(battery, 'dischargingTime', {
          get: () => Infinity,
          configurable: true
        });
        Object.defineProperty(battery, 'level', {
          get: () => 1.0,
          configurable: true
        });
        return battery;
      });
    };
  }

  // Spoof all permissions API responses
  if (navigator.permissions) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = function(permissionDesc) {
      return originalQuery.call(this, permissionDesc).then(result => {
        // Force all permissions to be granted
        Object.defineProperty(result, 'state', {
          get: () => 'granted',
          configurable: true
        });
        return result;
      });
    };
  }

  // Spoof all media devices API responses
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

  // Spoof all getUserMedia responses
  if (navigator.getUserMedia) {
    const originalGetUserMedia = navigator.getUserMedia;
    navigator.getUserMedia = function(constraints, successCallback, errorCallback) {
      // Return a mock stream
      const mockStream = {
        getTracks: () => [],
        getAudioTracks: () => [],
        getVideoTracks: () => [],
        addTrack: () => {},
        removeTrack: () => {},
        clone: () => mockStream,
        active: true,
        id: 'mock-stream-id'
      };
      if (successCallback) successCallback(mockStream);
      return Promise.resolve(mockStream);
    };
  }

  // Spoof all requestMediaKeySystemAccess responses
  if (navigator.requestMediaKeySystemAccess) {
    const originalRequestMediaKeySystemAccess = navigator.requestMediaKeySystemAccess;
    navigator.requestMediaKeySystemAccess = function(keySystem, supportedConfigurations) {
      return Promise.resolve({
        keySystem: keySystem,
        getConfiguration: () => supportedConfigurations[0],
        createMediaKeys: () => Promise.resolve({
          createSession: () => Promise.resolve({
            sessionId: 'mock-session-id',
            expiration: Infinity,
            closed: Promise.resolve(),
            keyStatuses: new Map(),
            addEventListener: () => {},
            removeEventListener: () => {}
          })
        })
      });
    };
  }

  // Spoof all Intl API responses
  const originalDateTimeFormatResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
  Intl.DateTimeFormat.prototype.resolvedOptions = function() {
    const options = originalDateTimeFormatResolvedOptions.call(this);
    options.locale = 'en-US';
    options.timeZone = 'America/New_York';
    return options;
  };

  // Spoof all canvas responses
  const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  CanvasRenderingContext2D.prototype.getImageData = function(sx, sy, sw, sh) {
    const imageData = originalGetImageData.call(this, sx, sy, sw, sh);
    
    // Add noise to canvas fingerprint
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] += Math.floor(Math.random() * 3) - 1;     // Red
      imageData.data[i + 1] += Math.floor(Math.random() * 3) - 1; // Green
      imageData.data[i + 2] += Math.floor(Math.random() * 3) - 1; // Blue
      // Alpha stays the same
    }
    
    return imageData;
  };

  // Spoof all WebGL responses
  if (typeof WebGLRenderingContext !== 'undefined') {
    const originalGetParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(pname) {
      const params = {
        37445: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
        37446: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
        7936: 'Intel Inc.',
        7937: 'Intel(R) UHD Graphics 620',
        37447: 'ANGLE',
        7938: 'Intel Inc.',
        7939: 'Intel(R) UHD Graphics 620'
      };
      
      if (params[pname] !== undefined) return params[pname];
      return originalGetParameter.call(this, pname);
    };
  }

  // Spoof all AudioContext responses
  if (typeof AudioContext !== 'undefined') {
    const originalCreateAnalyser = AudioContext.prototype.createAnalyser;
    AudioContext.prototype.createAnalyser = function() {
      const analyser = originalCreateAnalyser.call(this);
      
      Object.defineProperty(analyser, 'fftSize', {
        get: () => 2048,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(analyser, 'frequencyBinCount', {
        get: () => 1024,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(analyser, 'minDecibels', {
        get: () => -100,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(analyser, 'maxDecibels', {
        get: () => -30,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(analyser, 'smoothingTimeConstant', {
        get: () => 0.8,
        set: () => {},
        configurable: true
      });
      
      return analyser;
    };
  }

  log('Comprehensive response spoofing completed');
})(); 