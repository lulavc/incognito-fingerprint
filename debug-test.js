// Debug test script for Incognito Fingerprint extension
(function() {
  'use strict';
  
  // Set up logger for this script
  if (window.incognitoLogger) {
    window.incognitoLogger.setScriptName('DebugTest');
  }
  
  const log = (message, data) => {
    if (window.incognitoLogger) {
      window.incognitoLogger.info(message, data);
    } else {
      console.log('[Incognito Fingerprint][DebugTest]', message, data);
    }
  };
  
  log('Debug test script loaded');

  // Test function to check all fingerprinting values
  window.testIncognitoProtection = function() {
    const results = {
      navigator: {
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory
      },
      timezone: {
        offset: new Date().getTimezoneOffset(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: Intl.DateTimeFormat().resolvedOptions().locale
      },
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      webgl: null,
      audio: null
    };

    // Test WebGL
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (gl) {
        results.webgl = {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        };
      }
    } catch (e) {
      results.webgl = { error: e.message };
    }

    // Test Audio Context
    try {
      if (typeof AudioContext !== 'undefined') {
        const audioContext = new AudioContext();
        results.audio = {
          sampleRate: audioContext.sampleRate,
          state: audioContext.state
        };
        
        const analyser = audioContext.createAnalyser();
        results.audio.analyser = {
          fftSize: analyser.fftSize,
          frequencyBinCount: analyser.frequencyBinCount,
          minDecibels: analyser.minDecibels,
          maxDecibels: analyser.maxDecibels,
          smoothingTimeConstant: analyser.smoothingTimeConstant
        };
      }
    } catch (e) {
      results.audio = { error: e.message };
    }

    console.log('=== Incognito Fingerprint Protection Test Results ===');
    console.log('Navigator:', results.navigator);
    console.log('Timezone:', results.timezone);
    console.log('Screen:', results.screen);
    console.log('Window:', results.window);
    console.log('WebGL:', results.webgl);
    console.log('Audio:', results.audio);
    console.log('==================================================');

    return results;
  };

  // Test function to check if language/timezone spoofing is working
  window.testLanguageTimezone = function() {
    const tests = {
      navigatorLanguage: navigator.language,
      navigatorLanguages: navigator.languages,
      timezoneOffset: new Date().getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      dateString: new Date().toLocaleString(),
      dateStringEn: new Date().toLocaleString('en-US'),
      dateStringPt: new Date().toLocaleString('pt-BR')
    };

    console.log('=== Language/Timezone Test Results ===');
    console.log('Expected navigator.language: en-US');
    console.log('Actual navigator.language:', tests.navigatorLanguage);
    console.log('Expected navigator.languages: ["en-US", "en"]');
    console.log('Actual navigator.languages:', tests.navigatorLanguages);
    console.log('Expected timezone offset: 300 (UTC-5)');
    console.log('Actual timezone offset:', tests.timezoneOffset);
    console.log('Expected timezone: America/New_York');
    console.log('Actual timezone:', tests.timezone);
    console.log('Expected locale: en-US');
    console.log('Actual locale:', tests.locale);
    console.log('Date string (default):', tests.dateString);
    console.log('Date string (en-US):', tests.dateStringEn);
    console.log('Date string (pt-BR):', tests.dateStringPt);
    console.log('=====================================');

    return tests;
  };

  // Test function to check HTTP headers
  window.testHttpHeaders = function() {
    console.log('=== HTTP Headers Test ===');
    console.log('Testing fetch with Accept-Language header...');
    
    fetch('https://httpbin.org/headers')
      .then(response => response.json())
      .then(data => {
        console.log('Request headers:', data.headers);
        console.log('Accept-Language header:', data.headers['Accept-Language']);
      })
      .catch(error => {
        console.log('Fetch test failed:', error);
      });
  };

  // Test function to check all overrides
  window.testAllOverrides = function() {
    const overrides = [];
    const failures = [];
    
    if (window.incognitoLogger) {
      overrides.push(...window.incognitoLogger.getOverrides());
      failures.push(...window.incognitoLogger.getFailures());
    }
    
    console.log('=== Override Test Results ===');
    console.log('Successful overrides:', overrides.length);
    overrides.forEach(override => console.log('✅', override));
    console.log('Failed overrides:', failures.length);
    failures.forEach(failure => console.log('❌', failure));
    console.log('============================');
    
    return { overrides, failures };
  };

  // Auto-run basic test after a short delay
  setTimeout(() => {
    log('Running automatic protection test...');
    window.testLanguageTimezone();
  }, 2000);

  log('Debug test functions available:');
  log('- window.testIncognitoProtection() - Test all protection features');
  log('- window.testLanguageTimezone() - Test language/timezone spoofing');
  log('- window.testHttpHeaders() - Test HTTP header spoofing');
  log('- window.testAllOverrides() - Test all overrides');
})(); 