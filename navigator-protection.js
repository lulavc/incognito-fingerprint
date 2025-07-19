// Navigator protection for anti-fingerprinting
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('NavigatorProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][NavigatorProtection]', message, data);
    }
  };
  
  log('Starting navigator protection...');

  // Force platform to be Linux x86_64
  try {
    Object.defineProperty(navigator, 'platform', {
      get: () => 'Linux x86_64',
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    log('Platform override failed', e.message);
  }

  // Force language to be en-US
  try {
    Object.defineProperty(navigator, 'language', {
      get: () => 'en-US',
      set: () => {},
      configurable: true,
      enumerable: true
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    log('Language override failed', e.message);
  }

  // Force hardware concurrency to be 4
  try {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      get: () => 4,
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    log('Hardware concurrency override failed', e.message);
  }

  // Force device memory to be 8
  try {
    Object.defineProperty(navigator, 'deviceMemory', {
      get: () => 8,
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    log('Device memory override failed', e.message);
  }

  // Force connection to be ethernet
  try {
    Object.defineProperty(navigator, 'connection', {
      get: () => ({
        effectiveType: '4g',
        rtt: 50,
        downlink: 10,
        saveData: false
      }),
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    log('Connection override failed', e.message);
  }

  // Force permissions to be granted
  if (navigator.permissions) {
    try {
      navigator.permissions.query = function(permissionDesc) {
        return Promise.resolve({ state: 'granted' });
      };
    } catch (e) {
      log('Permissions override failed', e.message);
    }
  }

  // Force media devices to be available
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
      log('Media devices override failed', e.message);
    }
  }

  // Force User-Agent Client Hints
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
    log('User-Agent Client Hints override failed', e.message);
  }

  log('Navigator protection completed');
})();
