// Font fingerprint protection
(function() {
  // Override font enumeration APIs
  const originalEmbolden = FontFace.prototype.load;
  
  FontFace.prototype.load = function() {
    return Promise.resolve(this);
  };

  Object.defineProperty(document, 'fonts', {
    value: {
      add: () => {},
      clear: () => {},
      delete: () => {},
      entries: () => [].entries(),
      forEach: () => {},
      has: () => false,
      keys: () => [].keys(),
      size: 0,
      values: () => [].values()
    },
    configurable: false
  });

  // Spoof font availability using crypto RNG
  const originalCheck = CSS.supports;
  CSS.supports = (property, value) => {
    if (property === 'font-family') {
      const random = new Uint8Array(1);
      crypto.getRandomValues(random);
      return random[0] < 128; // 50% probability
    }
    return originalCheck(property, value);
  };
})();