// Injected Navigator Spoofing Script
console.log('[Incognito Fingerprint] Navigator spoofing active');

// --- Begin navigator spoofing logic ---
const getRandomInt = (min, max) => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomChoice = arr => arr[Math.floor(Math.random() * arr.length)];

// --- Enhanced spoofing configuration ---
// Use consistent Linux profile to match User-Agent
const profile = {
  platform: 'Linux x86_64',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    language: 'en-US',
    languages: ['en-US', 'en'],
    timeZone: 'America/New_York',
  acceptLanguage: 'en-US,en;q=0.9'
};

// Use the consistent Linux profile
const userAgent = profile.userAgent;
const platform = profile.platform;
const language = profile.language;
const languages = profile.languages;
const timeZone = profile.timeZone;
const acceptLanguage = profile.acceptLanguage;

// Store profile for background script synchronization
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
  chrome.runtime.sendMessage({ 
    type: 'updateProfile', 
    profile: {
      ...profile,
      acceptLanguage: acceptLanguage
    }
  });
}

const spoofedValues = {
  userAgent: userAgent,
  platform: platform,
  hardwareConcurrency: getRandomInt(4, 8),
  deviceMemory: getRandomInt(4, 16),
  maxTouchPoints: platform === 'Win32' ? 0 : getRandomInt(0, 5),
  webdriver: false,
  languages: languages,
  language: language,
  cookieEnabled: true,
  product: 'Gecko',
  productSub: '20030107',
  vendor: 'Google Inc.',
  vendorSub: '',
  doNotTrack: '1',
  onLine: true,
  pdfViewerEnabled: true,
  webkitTemporaryStorage: {},
  webkitPersistentStorage: {}
};

const defineProperty = (obj, prop, value) => {
  try {
    Object.defineProperty(obj, prop, {
      get: () => value,
      set: () => {},
      configurable: true,
      enumerable: true
    });
  } catch (e) {}
};

const defineNavigatorProperty = (prop, value) => {
  try {
    Object.defineProperty(navigator, prop, {
      get: () => value,
      configurable: true,
      enumerable: true
    });
  } catch (e) {
    try {
      Object.defineProperty(Navigator.prototype, prop, {
        get: () => value,
        configurable: true,
        enumerable: true
      });
    } catch (e2) {}
  }
};

// Apply navigator spoofing
Object.entries(spoofedValues).forEach(([prop, value]) => {
  defineNavigatorProperty(prop, value);
});

// Enhanced screen spoofing
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
  defineProperty(screen, prop, value);
});

// Spoof plugins and mimeTypes
const plugins = [];
const mimeTypes = [];

const createArrayProperty = (arr, nameProp) => {
  const newArr = { ...arr };
  Object.setPrototypeOf(newArr, {
    length: arr.length,
    item: (index) => arr[index] || null,
    namedItem: (name) => arr.find(p => p[nameProp] === name) || null,
  });
  return newArr;
};

defineNavigatorProperty('plugins', createArrayProperty(plugins, 'name'));
defineNavigatorProperty('mimeTypes', createArrayProperty(mimeTypes, 'type'));

// Spoof permissions
if (navigator.permissions) {
  const originalQuery = navigator.permissions.query;
  navigator.permissions.query = function(permissionDesc) {
    // Return granted for most permissions to avoid fingerprinting
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

// Spoof media devices
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

// Spoof User-Agent Client Hints
if (typeof navigator.userAgentData !== 'undefined') {
  const brands = [
    {brand: 'Chromium', version: '138'},
    {brand: 'Google Chrome', version: '138'},
    {brand: 'Not;A=Brand', version: '99'}
  ];

  const platformName = platform === 'Win32' ? 'Windows' : 
    platform === 'Linux x86_64' ? 'Linux' : 'macOS';

  const userAgentData = {
    brands: brands,
    mobile: false,
    platform: platformName,
    getHighEntropyValues: (hints) => Promise.resolve({
      brands: brands,
      platform: platformName,
      architecture: 'x86',
      model: '',
      uaFullVersion: '138.0.0.0',
      fullVersionList: brands.map(b => ({...b, version: b.version})),
      bitness: '64',
      wow64: false
    })
  };

  defineNavigatorProperty('userAgentData', userAgentData);
}

// Enhanced timezone spoofing
const spoofTimezone = () => {
  const offsets = {
    'America/New_York': 300,
    'Europe/Berlin': -120,
    'America/Los_Angeles': 420
  };
  const spoofedOffset = offsets[timeZone] || 0;
  
  try {
  Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
    value: () => spoofedOffset,
    configurable: true
  });
  } catch (e) {}

  try {
  const originalDateTimeFormat = Intl.DateTimeFormat;
  Intl.DateTimeFormat = function(locales, options) {
    options = options || {};
    options.timeZone = timeZone;
    return new originalDateTimeFormat(locales, options);
  };
  Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;
  } catch (e) {}
};

spoofTimezone();

// Spoof battery API
if (navigator.getBattery) {
  const originalGetBattery = navigator.getBattery;
  navigator.getBattery = function() {
    return Promise.resolve({
      charging: true,
      chargingTime: Infinity,
      dischargingTime: Infinity,
      level: 1.0,
      addEventListener: () => {},
      removeEventListener: () => {}
    });
  };
}

// Spoof connection API
if (navigator.connection) {
  const connectionProps = {
    effectiveType: '4g',
    rtt: 50,
    downlink: 10,
    saveData: false
  };
  
  Object.entries(connectionProps).forEach(([prop, value]) => {
    defineProperty(navigator.connection, prop, value);
  });
}

// Spoof device orientation APIs
if (window.DeviceOrientationEvent) {
  window.DeviceOrientationEvent = function() {
    return {
      alpha: getRandomInt(0, 360),
      beta: getRandomInt(-180, 180),
      gamma: getRandomInt(-90, 90)
    };
  };
}

if (window.DeviceMotionEvent) {
  window.DeviceMotionEvent = function() {
    return {
      acceleration: {
        x: getRandomInt(-10, 10),
        y: getRandomInt(-10, 10),
        z: getRandomInt(-10, 10)
      },
      accelerationIncludingGravity: {
        x: getRandomInt(-10, 10),
        y: getRandomInt(-10, 10),
        z: getRandomInt(-10, 10)
      },
      rotationRate: {
        alpha: getRandomInt(-10, 10),
        beta: getRandomInt(-10, 10),
        gamma: getRandomInt(-10, 10)
      }
    };
  };
}

console.log('[Incognito Fingerprint] Navigator spoofing completed');
// --- End navigator spoofing logic ---
