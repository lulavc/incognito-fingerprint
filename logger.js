// Comprehensive logging system for Incognito Fingerprint extension
(function() {
  'use strict';
  
  // Logger configuration
  const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  };
  
  const LOG_LEVEL = LOG_LEVELS.INFO; // Change this to DEBUG for more verbose logging
  
  // Logger class
  class ExtensionLogger {
    constructor() {
      this.logs = [];
      this.maxLogs = 1000;
      this.startTime = Date.now();
      this.scriptName = 'Unknown';
      this.overrides = new Set();
      this.failures = new Set();
    }
    
    setScriptName(name) {
      this.scriptName = name;
    }
    
    log(level, message, data = null) {
      const timestamp = Date.now() - this.startTime;
      const logEntry = {
        timestamp,
        level: Object.keys(LOG_LEVELS)[level],
        script: this.scriptName,
        message,
        data,
        time: new Date().toISOString()
      };
      
      this.logs.push(logEntry);
      
      // Keep only the last maxLogs entries
      if (this.logs.length > this.maxLogs) {
        this.logs = this.logs.slice(-this.maxLogs);
      }
      
      // Console output based on log level
      if (level >= LOG_LEVEL) {
        const prefix = `[Incognito Fingerprint][${this.scriptName}]`;
        switch (level) {
          case LOG_LEVELS.DEBUG:
            console.debug(prefix, message, data);
            break;
          case LOG_LEVELS.INFO:
            console.info(prefix, message, data);
            break;
          case LOG_LEVELS.WARN:
            console.warn(prefix, message, data);
            break;
          case LOG_LEVELS.ERROR:
            console.error(prefix, message, data);
            break;
        }
      }
    }
    
    debug(message, data = null) {
      this.log(LOG_LEVELS.DEBUG, message, data);
    }
    
    info(message, data = null) {
      this.log(LOG_LEVELS.INFO, message, data);
    }
    
    warn(message, data = null) {
      this.log(LOG_LEVELS.WARN, message, data);
    }
    
    error(message, data = null) {
      this.log(LOG_LEVELS.ERROR, message, data);
    }
    
    trackOverride(property, value) {
      this.overrides.add(`${property}: ${value}`);
      this.info(`Override applied: ${property} = ${value}`);
    }
    
    trackFailure(property, error) {
      this.failures.add(`${property}: ${error.message}`);
      this.warn(`Override failed: ${property}`, error);
    }
    
    getStats() {
      return {
        totalLogs: this.logs.length,
        overrides: this.overrides.size,
        failures: this.failures.size,
        runtime: Date.now() - this.startTime,
        script: this.scriptName
      };
    }
    
    getAllLogs() {
      return this.logs;
    }
    
    getOverrides() {
      return Array.from(this.overrides);
    }
    
    getFailures() {
      return Array.from(this.failures);
    }
    
    clear() {
      this.logs = [];
      this.overrides.clear();
      this.failures.clear();
    }
  }
  
  // Global logger instance
  window.incognitoLogger = new ExtensionLogger();
  window.incognitoLogger.setScriptName('Logger');
  window.incognitoLogger.info('Logger initialized');
  
  // Expose logger methods globally for easy access
  window.logDebug = (message, data) => window.incognitoLogger.debug(message, data);
  window.logInfo = (message, data) => window.incognitoLogger.info(message, data);
  window.logWarn = (message, data) => window.incognitoLogger.warn(message, data);
  window.logError = (message, data) => window.incognitoLogger.error(message, data);
  
  // Add logger to window for debugging
  window.getIncognitoStats = () => window.incognitoLogger.getStats();
  window.getIncognitoLogs = () => window.incognitoLogger.getAllLogs();
  window.getIncognitoOverrides = () => window.incognitoLogger.getOverrides();
  window.getIncognitoFailures = () => window.incognitoLogger.getFailures();
  
  // Log initial environment
  window.incognitoLogger.info('Environment detected', {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    timezone: new Date().getTimezoneOffset(),
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight
    },
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    }
  });
  
  console.log('[Incognito Fingerprint] Logger system initialized. Use window.getIncognitoStats() to see protection statistics.');
})(); 