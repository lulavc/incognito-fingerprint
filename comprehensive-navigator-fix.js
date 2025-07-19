// Comprehensive navigator properties protection
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('ComprehensiveNavigatorFix');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][ComprehensiveNavigatorFix]', message, data);
    }
  };
  
  log('Starting comprehensive navigator properties protection...');

  // Comprehensive navigator properties override
  const navigatorProps = {
    // Basic properties
    appName: 'Netscape',
    appVersion: '5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    appCodeName: 'Mozilla',
    cookieEnabled: true,
    doNotTrack: '1',
    geolocation: undefined, // Will be overridden separately
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    platform: 'Linux x86_64',
    product: 'Gecko',
    productSub: '20030107',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    vendor: 'Google Inc.',
    vendorSub: '',
    
    // Modern properties
    hardwareConcurrency: 16,
    deviceMemory: 8,
    maxTouchPoints: 0,
    
    // Connection
    connection: {
      effectiveType: '4g',
      rtt: 50,
      downlink: 10,
      saveData: false
    },
    
    // Permissions
    permissions: {
      query: function(permissionDesc) {
        return Promise.resolve({ state: 'granted' });
      }
    },
    
    // Media devices
    mediaDevices: {
      enumerateDevices: function() {
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
      }
    },
    
    // User-Agent Client Hints
    userAgentData: {
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
    
    // Plugins
    plugins: {
      length: 5,
      item: function(index) {
        const plugins = [
          {name: 'PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Chrome PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Chromium PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Microsoft Edge PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'WebKit built-in PDF', description: 'Portable Document Format', filename: 'internal-pdf-viewer'}
        ];
        return plugins[index] || null;
      },
      namedItem: function(name) {
        const plugins = [
          {name: 'PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Chrome PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Chromium PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'Microsoft Edge PDF Viewer', description: 'Portable Document Format', filename: 'internal-pdf-viewer'},
          {name: 'WebKit built-in PDF', description: 'Portable Document Format', filename: 'internal-pdf-viewer'}
        ];
        return plugins.find(p => p.name === name) || null;
      }
    },
    
    // MIME types
    mimeTypes: {
      length: 5,
      item: function(index) {
        const mimeTypes = [
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Chrome PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Chromium PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Microsoft Edge PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'WebKit built-in PDF'}}
        ];
        return mimeTypes[index] || null;
      },
      namedItem: function(type) {
        const mimeTypes = [
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Chrome PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Chromium PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'Microsoft Edge PDF Viewer'}},
          {type: 'application/pdf', description: 'Portable Document Format', suffixes: 'pdf', enabledPlugin: {name: 'WebKit built-in PDF'}}
        ];
        return mimeTypes.find(m => m.type === type) || null;
      }
    }
  };

  // Apply all navigator properties
  Object.entries(navigatorProps).forEach(([prop, value]) => {
    try {
      if (typeof value === 'function') {
        // For functions, replace the entire property
        navigator[prop] = value;
      } else {
        // For values, use defineProperty
        Object.defineProperty(navigator, prop, {
          get: () => value,
          set: () => {},
          configurable: true,
          enumerable: true
        });
      }
    } catch (e) {
      log(`Navigator property ${prop} override failed`, e.message);
    }
  });

  // Override specific methods that might be called
  try {
    // Override getBattery
    if (navigator.getBattery) {
      navigator.getBattery = function() {
        return Promise.resolve({
          charging: true,
          chargingTime: 0,
          dischargingTime: Infinity,
          level: 1.0,
          addEventListener: () => {},
          removeEventListener: () => {}
        });
      };
    }

    // Override getUserMedia
    if (navigator.getUserMedia) {
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

    // Override requestMediaKeySystemAccess
    if (navigator.requestMediaKeySystemAccess) {
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

  } catch (e) {
    log('Navigator methods override failed', e.message);
  }

  log('Comprehensive navigator properties protection completed');
})(); 