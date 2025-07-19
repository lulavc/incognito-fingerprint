// Ultimate language and timezone protection - most aggressive approach
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('UltimateLanguageFix');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][UltimateLanguageFix]', message, data);
    }
  };
  
  log('Starting ultimate language and timezone protection...');

  // ULTIMATE LANGUAGE OVERRIDE - Force everything to en-US
  try {
    // Method 1: Direct navigator properties with maximum force
    Object.defineProperty(navigator, 'language', {
      get: () => 'en-US',
      set: () => {},
      configurable: false,
      enumerable: true
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
      set: () => {},
      configurable: false,
      enumerable: true
    });

    // Method 2: Override all Intl constructors
    const intlConstructors = [
      'DateTimeFormat',
      'NumberFormat', 
      'Collator',
      'PluralRules',
      'RelativeTimeFormat',
      'ListFormat',
      'DisplayNames'
    ];

    intlConstructors.forEach(constructorName => {
      if (Intl[constructorName]) {
        const originalConstructor = Intl[constructorName];
        Intl[constructorName] = function(locales, options) {
          // Force en-US locale
          return new originalConstructor(['en-US'], options);
        };
        Intl[constructorName].prototype = originalConstructor.prototype;
        Intl[constructorName].supportedLocalesOf = originalConstructor.supportedLocaleOf;
      }
    });

    // Method 3: Override Intl.DateTimeFormat.resolvedOptions
    const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
    Intl.DateTimeFormat.prototype.resolvedOptions = function() {
      const options = originalResolvedOptions.call(this);
      options.locale = 'en-US';
      options.timeZone = 'America/New_York';
      return options;
    };

    // Method 4: Override all Date methods
    const dateMethods = ['toLocaleString', 'toLocaleDateString', 'toLocaleTimeString'];
    dateMethods.forEach(method => {
      const originalMethod = Date.prototype[method];
      Date.prototype[method] = function(locales, options) {
        options = options || {};
        options.timeZone = 'America/New_York';
        return originalMethod.call(this, ['en-US'], options);
      };
    });

    // Method 5: Override Date.prototype.getTimezoneOffset
    Object.defineProperty(Date.prototype, 'getTimezoneOffset', {
      value: () => 300, // UTC-5 (America/New_York)
      configurable: false
    });

    // Method 6: Override Date constructor
    const originalDate = Date;
    Date = function(...args) {
      if (args.length === 0) {
        return new originalDate();
      } else if (args.length === 1 && typeof args[0] === 'string') {
        // Parse as UTC and adjust for timezone
        const date = new originalDate(args[0] + ' UTC');
        return date;
      } else {
        return new originalDate(...args);
      }
    };
    Date.prototype = originalDate.prototype;
    Date.now = originalDate.now;
    Date.parse = originalDate.parse;
    Date.UTC = originalDate.UTC;

    // Method 7: Override document.documentElement.lang
    Object.defineProperty(document.documentElement, 'lang', {
      get: () => 'en',
      set: () => {},
      configurable: false
    });

    // Method 8: Override document.characterSet
    Object.defineProperty(document, 'characterSet', {
      get: () => 'UTF-8',
      set: () => {},
      configurable: false
    });

    // Method 9: Override document.charset
    Object.defineProperty(document, 'charset', {
      get: () => 'UTF-8',
      set: () => {},
      configurable: false
    });

    // Method 10: Override document.inputEncoding
    Object.defineProperty(document, 'inputEncoding', {
      get: () => 'UTF-8',
      set: () => {},
      configurable: false
    });

    // Method 11: Override all HTTP request headers
    const originalFetch = window.fetch;
    window.fetch = function(input, init) {
      init = init || {};
      init.headers = init.headers || {};
      
      // Force Accept-Language header
      if (init.headers instanceof Headers) {
        init.headers.set('Accept-Language', 'en-US,en;q=0.9');
      } else {
        init.headers['Accept-Language'] = 'en-US,en;q=0.9';
      }
      
      return originalFetch.call(this, input, init);
    };

    // Method 12: Override XMLHttpRequest headers
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
      this._incognitoSpoofed = true;
      return originalXHROpen.call(this, method, url, async, user, password);
    };
    
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
      if (header.toLowerCase() === 'accept-language') {
        value = 'en-US,en;q=0.9';
      }
      return originalXHRSetRequestHeader.call(this, header, value);
    };

    // Method 13: Override WebSocket messages
    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      const ws = new originalWebSocket(url, protocols);
      
      const originalSend = ws.send;
      ws.send = function(data) {
        if (typeof data === 'string') {
          data = data.replace(/pt-BR/g, 'en-US');
          data = data.replace(/pt/g, 'en');
          data = data.replace(/UTC-03:00/g, 'UTC-05:00');
          data = data.replace(/America\/Sao_Paulo/g, 'America/New_York');
        }
        return originalSend.call(this, data);
      };
      
      return ws;
    };
    window.WebSocket.prototype = originalWebSocket.prototype;

    // Method 14: Override all response data
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
      const xhr = this;
      const originalOnReadyStateChange = xhr.onreadystatechange;
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const originalResponseText = xhr.responseText;
          
          Object.defineProperty(xhr, 'responseText', {
            get: function() {
              let text = originalResponseText;
              text = text.replace(/pt-BR/g, 'en-US');
              text = text.replace(/pt/g, 'en');
              text = text.replace(/UTC-03:00/g, 'UTC-05:00');
              text = text.replace(/America\/Sao_Paulo/g, 'America/New_York');
              return text;
            },
            configurable: false
          });
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.call(this);
        }
      };
      
      return originalXHRSend.call(this, data);
    };

    // Method 15: Override fetch responses
    const originalFetchResponse = window.fetch;
    window.fetch = function(input, init) {
      return originalFetchResponse.call(this, input, init).then(response => {
        const originalJson = response.json;
        const originalText = response.text;
        
        response.json = function() {
          return originalJson.call(this).then(data => {
            if (data && typeof data === 'object') {
              if (data.language) data.language = 'en-US';
              if (data.locale) data.locale = 'en-US';
              if (data.lang) data.lang = 'en';
              if (data.timezone) data.timezone = 'America/New_York';
              if (data.timeZone) data.timeZone = 'America/New_York';
              if (data.offset) data.offset = -300;
            }
            return data;
          });
        };
        
        response.text = function() {
          return originalText.call(this).then(text => {
            text = text.replace(/pt-BR/g, 'en-US');
            text = text.replace(/pt/g, 'en');
            text = text.replace(/UTC-03:00/g, 'UTC-05:00');
            text = text.replace(/America\/Sao_Paulo/g, 'America/New_York');
            return text;
          });
        };
        
        return response;
      });
    };

    // Method 16: Override all localStorage/sessionStorage
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
      if (typeof value === 'string') {
        value = value.replace(/pt-BR/g, 'en-US');
        value = value.replace(/pt/g, 'en');
        value = value.replace(/UTC-03:00/g, 'UTC-05:00');
        value = value.replace(/America\/Sao_Paulo/g, 'America/New_York');
      }
      return originalSetItem.call(this, key, value);
    };

    // Method 17: Override all getItem calls
    const originalGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = function(key) {
      const value = originalGetItem.call(this, key);
      if (typeof value === 'string') {
        return value.replace(/pt-BR/g, 'en-US')
                   .replace(/pt/g, 'en')
                   .replace(/UTC-03:00/g, 'UTC-05:00')
                   .replace(/America\/Sao_Paulo/g, 'America/New_York');
      }
      return value;
    };

    log('Ultimate language and timezone protection applied successfully');
  } catch (e) {
    log('Ultimate language and timezone protection failed', e.message);
  }
})(); 