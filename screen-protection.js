// Screen protection for anti-fingerprinting
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('ScreenProtection');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][ScreenProtection]', message, data);
    }
  };
  
  log('Starting screen protection...');

  // Force screen properties to be consistent
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
      Object.defineProperty(screen, prop, {
        get: () => value,
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log(`Screen property ${prop} override failed`, e.message);
    }
  });

  // Force window properties to be consistent
  const windowProps = {
    innerWidth: 1920,
    innerHeight: 937,
    outerWidth: 1920,
    outerHeight: 1040,
    devicePixelRatio: 1
  };

  Object.entries(windowProps).forEach(([prop, value]) => {
    try {
      Object.defineProperty(window, prop, {
        get: () => value,
        set: () => {},
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      log(`Window property ${prop} override failed`, e.message);
    }
  });

  // Force matchMedia to return consistent results
  try {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(query) {
      const mediaQueryList = originalMatchMedia.call(this, query);
      
      // Override the matches property for common queries
      Object.defineProperty(mediaQueryList, 'matches', {
        get: function() {
          const commonQueries = {
            '(max-width: 768px)': false,
            '(max-width: 1024px)': false,
            '(max-width: 1200px)': false,
            '(min-width: 1200px)': true,
            '(orientation: portrait)': false,
            '(orientation: landscape)': true,
            '(prefers-color-scheme: dark)': false,
            '(prefers-color-scheme: light)': true,
            '(prefers-reduced-motion: reduce)': false,
            '(display-mode: standalone)': false,
            '(display-mode: fullscreen)': false,
            '(display-mode: minimal-ui)': false,
            '(display-mode: browser)': true
          };
          
          if (commonQueries[query] !== undefined) {
            return commonQueries[query];
          }
          
          return mediaQueryList.matches;
        },
        configurable: true
      });
      
      return mediaQueryList;
    };
  } catch (e) {
    log('MatchMedia override failed', e.message);
  }

  // Force visual viewport to be consistent
  if (window.visualViewport) {
    try {
      Object.defineProperty(window.visualViewport, 'width', {
        get: () => 1920,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(window.visualViewport, 'height', {
        get: () => 937,
        set: () => {},
        configurable: true
      });
      
      Object.defineProperty(window.visualViewport, 'scale', {
        get: () => 1,
        set: () => {},
        configurable: true
      });
    } catch (e) {
      log('Visual viewport override failed', e.message);
    }
  }

  log('Screen protection completed');
})(); 