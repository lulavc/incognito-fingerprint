// Aggressive language and timezone protection
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('AggressiveLanguageFix');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][AggressiveLanguageFix]', message, data);
    }
  };
  
  log('Starting aggressive language and timezone protection...');

  // Force language to be en-US - MULTIPLE METHODS
  try {
    // Method 1: Direct navigator properties
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

    // Method 2: Override Intl APIs
    const originalDateTimeFormat = Intl.DateTimeFormat;
    Intl.DateTimeFormat = function(locales, options) {
      options = options || {};
      options.timeZone = 'America/New_York';
      return new originalDateTimeFormat(['en-US'], options);
    };
    Intl.DateTimeFormat.prototype = originalDateTimeFormat.prototype;

    // Method 3: Override NumberFormat
    const originalNumberFormat = Intl.NumberFormat;
    Intl.NumberFormat = function(locales, options) {
      return new originalNumberFormat(['en-US'], options);
    };
    Intl.NumberFormat.prototype = originalNumberFormat.prototype;

    // Method 4: Override Collator
    const originalCollator = Intl.Collator;
    Intl.Collator = function(locales, options) {
      return new originalCollator(['en-US'], options);
    };
    Intl.Collator.prototype = originalCollator.prototype;

    // Method 5: Override PluralRules
    if (Intl.PluralRules) {
      const originalPluralRules = Intl.PluralRules;
      Intl.PluralRules = function(locales, options) {
        return new originalPluralRules(['en-US'], options);
      };
      Intl.PluralRules.prototype = originalPluralRules.prototype;
    }

    // Method 6: Override RelativeTimeFormat
    if (Intl.RelativeTimeFormat) {
      const originalRelativeTimeFormat = Intl.RelativeTimeFormat;
      Intl.RelativeTimeFormat = function(locales, options) {
        return new originalRelativeTimeFormat(['en-US'], options);
      };
      Intl.RelativeTimeFormat.prototype = originalRelativeTimeFormat.prototype;
    }

    // Method 7: Override ListFormat
    if (Intl.ListFormat) {
      const originalListFormat = Intl.ListFormat;
      Intl.ListFormat = function(locales, options) {
        return new originalListFormat(['en-US'], options);
      };
      Intl.ListFormat.prototype = originalListFormat.prototype;
    }

    // Method 8: Override DisplayNames
    if (Intl.DisplayNames) {
      const originalDisplayNames = Intl.DisplayNames;
      Intl.DisplayNames = function(locales, options) {
        return new originalDisplayNames(['en-US'], options);
      };
      Intl.DisplayNames.prototype = originalDisplayNames.prototype;
    }

  } catch (e) {
    log('Language override failed', e.message);
  }

  // Force timezone to be America/New_York - MULTIPLE METHODS
  try {
    // Method 1: Override Date.prototype.getTimezoneOffset
    Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
      value: () => 300, // UTC-5 (America/New_York)
      configurable: true
    });

    // Method 2: Override Date.prototype.toLocaleString
    const originalToLocaleString = Date.prototype.toLocaleString;
    Date.prototype.toLocaleString = function(locales, options) {
      options = options || {};
      options.timeZone = 'America/New_York';
      return originalToLocaleString.call(this, ['en-US'], options);
    };

    // Method 3: Override Date.prototype.toLocaleDateString
    const originalToLocaleDateString = Date.prototype.toLocaleDateString;
    Date.prototype.toLocaleDateString = function(locales, options) {
      options = options || {};
      options.timeZone = 'America/New_York';
      return originalToLocaleDateString.call(this, ['en-US'], options);
    };

    // Method 4: Override Date.prototype.toLocaleTimeString
    const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
    Date.prototype.toLocaleTimeString = function(locales, options) {
      options = options || {};
      options.timeZone = 'America/New_York';
      return originalToLocaleTimeString.call(this, ['en-US'], options);
    };

    // Method 5: Override Date constructor
    const originalDate = Date;
    Date = function(...args) {
      if (args.length === 0) {
        // No arguments - current time
        return new originalDate();
      } else if (args.length === 1 && typeof args[0] === 'string') {
        // String argument - parse as UTC
        const date = new originalDate(args[0] + ' UTC');
        return date;
      } else {
        // Other arguments - pass through
        return new originalDate(...args);
      }
    };
    Date.prototype = originalDate.prototype;
    Date.now = originalDate.now;
    Date.parse = originalDate.parse;
    Date.UTC = originalDate.UTC;

  } catch (e) {
    log('Timezone override failed', e.message);
  }

  // Force HTTP headers to be en-US
  try {
    // Override XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      const xhr = originalOpen.call(this, method, url, async, user, password);
      this.setRequestHeader('Accept-Language', 'en-US,en;q=0.9');
      return xhr;
    };

    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      init = init || {};
      init.headers = init.headers || {};
      init.headers['Accept-Language'] = 'en-US,en;q=0.9';
      return originalFetch.call(this, input, init);
    };

  } catch (e) {
    log('HTTP headers override failed', e.message);
  }

  // Force document.documentElement.lang
  try {
    Object.defineProperty(document.documentElement, 'lang', {
      get: () => 'en',
      set: () => {},
      configurable: true
    });
  } catch (e) {
    log('Document lang override failed', e.message);
  }

  // Force document.characterSet
  try {
    Object.defineProperty(document, 'characterSet', {
      get: () => 'UTF-8',
      set: () => {},
      configurable: true
    });
  } catch (e) {
    log('Character set override failed', e.message);
  }

  log('Aggressive language and timezone protection completed');
})(); 