// Navigator fingerprint protection
(function() {
  const getRandom = (min, max) => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % (max - min + 1));
  };

  const randomChoice = arr => arr[getRandom(0, arr.length-1)];
  
  // Spoof User-Agent Client Hints
  if (navigator.userAgentData) {
    const brands = [
      {brand: 'Chromium', version: `${getRandom(90,105)}.0.0.0`},
      {brand: 'Google Chrome', version: `${getRandom(90,105)}.0.0.0`},
      {brand: 'Not;A=Brand', version: '99.0.0.0'}
    ];
    
    navigator.userAgentData.getHighEntropyValues = async () => ({
      architecture: randomChoice(['x86', 'arm']),
      bitness: randomChoice(['64', '32']),
      model: '',
      platformVersion: '',
      uaFullVersion: `${getRandom(90,105)}.0.${getRandom(1000,9999)}.${getRandom(10,99)}`
    });

    navigator.userAgentData.brands = brands;
    navigator.userAgentData.mobile = getRandom(0, 1) === 1;
  }

  // Spoof standard navigator properties
  const spoofNavigator = {
    userAgent: `Mozilla/5.0 (${randomChoice([
      'Windows NT 10.0; Win64; x64',
      'X11; Linux x86_64',
      'Macintosh; Intel Mac OS X 10_15_7'
    ])}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${getRandom(90,105)}.0.0.0 Safari/537.36`,
    
    platform: randomChoice(['Win32', 'Linux x86_64', 'MacIntel']),
    hardwareConcurrency: getRandom(2, 8),
    deviceMemory: getRandom(2, 8),
    maxTouchPoints: getRandom(0, 5),
    webdriver: false,
    plugins: [
      {name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer'},
      {name: 'Chromium PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai'}
    ],
    languages: [randomChoice(['en-US', 'en-GB', 'fr-FR', 'de-DE'])],
    cookieEnabled: getRandom(0, 1) === 1
  };

  Object.entries(spoofNavigator).forEach(([prop, value]) => {
    Object.defineProperty(navigator, prop, {
      value: Array.isArray(value) ? [...value] : value,
      writable: false,
      configurable: false,
      enumerable: true
    });
  });

  // Freeze critical objects
  Object.defineProperty(navigator, 'plugins', {
    value: Object.freeze(spoofNavigator.plugins),
    writable: false,
    configurable: false
  });
})();