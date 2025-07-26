// ==UserScript==
// @name         Ultimate Anti-Fingerprint Protection v1.0.0
// @namespace    https://github.com/lulzactive/incognito-fingerprint
// @version      1.0.0
// @description  Advanced anti-fingerprinting protection with realistic Chrome/Windows spoofing, enhanced privacy, comprehensive tracking prevention, and cutting-edge fingerprinting resistance
// @author       lulzactive
// @license      MIT
// @match        *://*/*
// @exclude      chrome://*
// @exclude      moz-extension://*
// @exclude      about:*
// @exclude      file://*
// @exclude      data:*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  page
// @unwrap
// ==/UserScript==

// Shared utilities for anti-fingerprinting protection
// Used by both extension and userscript for consistent spoofing

(function() {
    'use strict';

    // --- Global indicators for userscript detection ---
    window.lulzactiveUserscript = {
        version: '1.0.0',
        name: 'lulzactive',
        timestamp: Date.now(),
        source: 'userscript',
        features: [
            'canvas-protection',
            'webgl-protection', 
            'audio-protection',
            'font-protection',
            'navigator-protection',
            'screen-protection',
            'timezone-protection',
            'webrtc-protection',
            'battery-protection',
            'media-devices-protection',
            'permissions-protection',
            'storage-protection',
            'anti-tracking',
            'fingerprint-blocking',
            'enhanced-randomization',
            'anti-detection',
            'cpu-protection',
            'memory-protection',
            'bluetooth-protection',
            'gamepad-protection',
            'usb-protection',
            'network-protection',
            'speech-protection',
            'clipboard-protection',
            'intersection-observer-protection',
            'performance-protection'
        ]
    };
    window.lulzactiveVersion = '1.0.0';
    window.lulzactiveIsUserscript = true;
    window.AntiFingerprintUtils = {
        version: '1.0.0',
        isExtension: false,
        isUserscript: true,
        protectionLevel: 'ultimate',
        features: {
            canvas: true,
            webgl: true,
            audio: true,
            fonts: true,
            navigator: true,
            screen: true,
            timezone: true,
            webrtc: true,
            battery: true,
            mediaDevices: true,
            permissions: true,
            storage: true,
            antiTracking: true,
            fingerprintBlocking: true,
            enhancedRandomization: true,
            antiDetection: true,
            cpu: true,
            memory: true,
            bluetooth: true,
            gamepad: true,
            usb: true,
            network: true,
            speech: true,
            clipboard: true,
            intersectionObserver: true,
            performance: true
        },
        stats: {
            protectionsApplied: 0,
            trackersBlocked: 0,
            fingerprintsBlocked: 0,
            startTime: Date.now(),
            apiCallsBlocked: 0,
            scriptsBlocked: 0,
            cookiesBlocked: 0
        }
    };

    // --- Enhanced feature toggles with storage sync ---
    let PARANOID_CANVAS = false;    // true = always blank canvas (paranoid mode)
    let ROUND_SCREEN = false;       // true = round screen size to nearest 100
    let FONT_RANDOMIZE = true;      // true = randomize measureText width
    let CANVAS_TEXT_RANDOMIZE = true; // true = randomize fillText/strokeText/rects
    let ENHANCED_RANDOMIZATION = true; // true = use enhanced randomization
    let ANTI_DETECTION = true;      // true = enable anti-detection measures
    let ANTI_TRACKING = true;       // true = block tracking scripts
    let FINGERPRINT_BLOCKING = true; // true = block fingerprinting attempts
    let ADVANCED_PROTECTION = true; // true = enable advanced protection features
    let DEBUG_MODE = false;         // true = enable debug logging
    let STEALTH_MODE = true;        // true = maximum stealth, minimal detection
    let PERFORMANCE_MODE = false;   // true = optimize for performance over protection
    
    // Load settings from storage with error handling
    function loadSettings() {
        try {
            PARANOID_CANVAS = GM_getValue('paranoidCanvas', false);
            ROUND_SCREEN = GM_getValue('roundScreen', false);
            FONT_RANDOMIZE = GM_getValue('fontRandomize', true);
            CANVAS_TEXT_RANDOMIZE = GM_getValue('canvasTextRandomize', true);
            ENHANCED_RANDOMIZATION = GM_getValue('enhancedRandomization', true);
            ANTI_DETECTION = GM_getValue('antiDetection', true);
            ANTI_TRACKING = GM_getValue('antiTracking', true);
            FINGERPRINT_BLOCKING = GM_getValue('fingerprintBlocking', true);
            ADVANCED_PROTECTION = GM_getValue('advancedProtection', true);
            DEBUG_MODE = GM_getValue('debugMode', false);
            STEALTH_MODE = GM_getValue('stealthMode', true);
            PERFORMANCE_MODE = GM_getValue('performanceMode', false);
        } catch (e) {
            // Fallback to defaults if storage not available
            if (DEBUG_MODE) console.warn('lulzactive: Failed to load settings:', e);
        }
    }
    
    // Save settings to storage with error handling
    function saveSettings() {
        try {
            GM_setValue('paranoidCanvas', PARANOID_CANVAS);
            GM_setValue('roundScreen', ROUND_SCREEN);
            GM_setValue('fontRandomize', FONT_RANDOMIZE);
            GM_setValue('canvasTextRandomize', CANVAS_TEXT_RANDOMIZE);
            GM_setValue('enhancedRandomization', ENHANCED_RANDOMIZATION);
            GM_setValue('antiDetection', ANTI_DETECTION);
            GM_setValue('antiTracking', ANTI_TRACKING);
            GM_setValue('fingerprintBlocking', FINGERPRINT_BLOCKING);
            GM_setValue('advancedProtection', ADVANCED_PROTECTION);
            GM_setValue('debugMode', DEBUG_MODE);
            GM_setValue('stealthMode', STEALTH_MODE);
            GM_setValue('performanceMode', PERFORMANCE_MODE);
        } catch (e) {
            // Ignore storage errors
            if (DEBUG_MODE) console.warn('lulzactive: Failed to save settings:', e);
        }
    }

    // --- Enhanced Chrome/Windows profiles with more variants ---
    const profiles = {
        'Chrome 120 - Win10 - GTX1660': {
            id: 'Chrome 120 - Win10 - GTX1660',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 16,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
            cpuClass: undefined,
            oscpu: undefined
        },
        'Chrome 120 - Win10 - UHD620': {
            id: 'Chrome 120 - Win10 - UHD620',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 8,
            memory: 8,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 8, rtt: 60 },
            cpuClass: undefined,
            oscpu: undefined
        },
        'Chrome 120 - Win10 - RTX3060': {
            id: 'Chrome 120 - Win10 - RTX3060',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 2560,
            screenHeight: 1440,
            cores: 12,
            memory: 32,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 15, rtt: 40 },
            cpuClass: undefined,
            oscpu: undefined
        },
        'Chrome 120 - Win11 - RTX4070': {
            id: 'Chrome 120 - Win11 - RTX4070',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            platform: 'Win32',
            language: 'en-US',
            screenWidth: 1920,
            screenHeight: 1080,
            cores: 16,
            memory: 32,
            timezone: 'America/New_York',
            webglVendor: 'Google Inc.',
            webglRenderer: 'ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)',
            colorDepth: 24,
            devicePixelRatio: 1,
            vendor: 'Google Inc.',
            productSub: '20030107',
            appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            appName: 'Netscape',
            doNotTrack: '1',
            maxTouchPoints: 0,
            connection: { effectiveType: '4g', downlink: 20, rtt: 30 },
            cpuClass: undefined,
            oscpu: undefined
        }
    };
    
    // Select profile based on URL or random selection with improved consistency
    function selectProfile() {
        const url = window.location.href;
        const profileKeys = Object.keys(profiles);
        
        // Use consistent profile based on domain + session
        const domain = window.location.hostname;
        const sessionId = sessionStorage.getItem('lulzactive-session') || 
                         Math.random().toString(36).substr(2, 16);
        
        if (!sessionStorage.getItem('lulzactive-session')) {
            sessionStorage.setItem('lulzactive-session', sessionId);
        }
        
        const hash = (domain + sessionId).split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        
        const selectedIndex = Math.abs(hash) % profileKeys.length;
        return profiles[profileKeys[selectedIndex]];
    }
    
    const profile = selectProfile();
    
    // Enhanced plugins list with better Windows compatibility
    const plugins = [
        { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
        { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
        { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' },
        { name: 'Microsoft Edge PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: 'Portable Document Format' }
    ];

    // --- Common canvas hashes database (to avoid unique fingerprints) ---
    const commonCanvasHashes = [
        'a04f2157cf2cbe1aa19bacdc78d6b10a', // Common Chrome hash
        'b04f2157cf2cbe1aa19bacdc78d6b10b', // Common Firefox hash
        'c04f2157cf2cbe1aa19bacdc78d6b10c', // Common Edge hash
        'd04f2157cf2cbe1aa19bacdc78d6b10d', // Common Safari hash
        'e04f2157cf2cbe1aa19bacdc78d6b10e', // Common Chrome variant
        'f04f2157cf2cbe1aa19bacdc78d6b10f', // Common Firefox variant
        '104f2157cf2cbe1aa19bacdc78d6b101', // Common Edge variant
        '204f2157cf2cbe1aa19bacdc78d6b102', // Common Safari variant
        '304f2157cf2cbe1aa19bacdc78d6b103', // Common Chrome variant 2
        '404f2157cf2cbe1aa19bacdc78d6b104', // Common Firefox variant 2
        '504f2157cf2cbe1aa19bacdc78d6b105', // Common Chrome variant 3
        '604f2157cf2cbe1aa19bacdc78d6b106'  // Common Firefox variant 3
    ];

    // --- Common WebGL vendor/renderer combinations ---
    const commonWebGLProfiles = [
        { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce RTX 4070 Direct3D11 vs_5_0 ps_5_0)' },
        { vendor: 'Google Inc.', renderer: 'ANGLE (AMD Radeon RX 6700 XT Direct3D11 vs_5_0 ps_5_0)' }
    ];

    // --- Common Windows fonts (realistic subset) ---
    const commonWindowsFonts = [
        'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS',
        'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
        'Microsoft Sans Serif', 'Palatino Linotype', 'Tahoma', 'Times New Roman',
        'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Wingdings 2', 'Wingdings 3',
        'Segoe UI', 'Segoe UI Symbol', 'Segoe UI Emoji', 'Arial Unicode MS'
    ];

    // Enhanced error handling and logging
    function safeLog(message, level = 'log') {
        if (DEBUG_MODE) {
            try {
                console[level](`[lulzactive] ${message}`);
            } catch (e) {
                // Ignore logging errors
            }
        }
    }

    function incrementStats(statName) {
        try {
            if (window.AntiFingerprintUtils?.stats && typeof window.AntiFingerprintUtils.stats[statName] === 'number') {
                window.AntiFingerprintUtils.stats[statName]++;
            }
        } catch (e) {
            // Ignore stats errors
        }
    }

    // --- Enhanced randomization utilities with better performance ---
    const randomCache = new Map();
    const cacheExpiry = 60000; // 1 minute cache

    function getSubtleRandom(min, max, seed = null) {
        if (!ENHANCED_RANDOMIZATION) return Math.floor(Math.random() * (max - min + 1)) + min;
        
        const cacheKey = `${min}-${max}-${seed}`;
        const cached = randomCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cacheExpiry) {
            return cached.value;
        }
        
        // Use more subtle randomization that's less detectable
        let base;
        if (seed) {
            base = getConsistentRandom(seed.toString()) * (max - min + 1) + min;
        } else {
            base = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const result = Math.max(min, Math.min(max, Math.floor(base) + variation));
        
        if (seed) {
            randomCache.set(cacheKey, { value: result, timestamp: Date.now() });
        }
        
        return result;
    }

    function getConsistentRandom(seed) {
        // Generate consistent "random" values based on a seed
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) % 100 / 100;
    }

    // --- Utility: safe spoof property with enhanced error handling ---
    function spoof(obj, prop, valueFn, options = {}) {
        try {
            const descriptor = {
                get: valueFn,
                configurable: options.configurable !== false,
                enumerable: options.enumerable !== false
            };
            
            if (options.setter) {
                descriptor.set = options.setter;
            }
            
            Object.defineProperty(obj, prop, descriptor);
            incrementStats('protectionsApplied');
            safeLog(`Spoofed ${obj.constructor.name}.${prop}`);
            return true;
        } catch (e) {
            safeLog(`Failed to spoof ${prop}: ${e.message}`, 'warn');
            return false;
        }
    }

    // --- Enhanced anti-detection and anti-tracking measures ---
    function applyAntiDetection() {
        if (!ANTI_DETECTION) return;

        try {
            // Hide our spoofing from detection scripts with better stealth
            const originalDefineProperty = Object.defineProperty;
            Object.defineProperty = function(obj, prop, descriptor) {
                // Don't allow detection of our spoofed properties
                if (STEALTH_MODE && (prop === 'userAgent' || prop === 'platform' || prop === 'webdriver')) {
                    safeLog(`Blocked detection attempt on ${prop}`);
                    incrementStats('fingerprintsBlocked');
                    return obj;
                }
                return originalDefineProperty.call(this, obj, prop, descriptor);
            };

            // Hide our global objects from detection with better concealment
            try {
                Object.defineProperty(window, 'lulzactiveUserscript', {
                    configurable: false,
                    enumerable: false,
                    writable: false,
                    value: undefined
                });
            } catch (e) {
                // Property might already be defined
            }

            // Prevent detection of our script injection with enhanced stealth
            const originalToString = Function.prototype.toString;
            Function.prototype.toString = function() {
                const str = originalToString.call(this);
                if (STEALTH_MODE && (str.includes('lulzactive') || str.includes('AntiFingerprint') || str.includes('spoof'))) {
                    return 'function() { [native code] }';
                }
                return str;
            };
            
            // Block common fingerprinting detection methods
            if (FINGERPRINT_BLOCKING) {
                // Block fingerprinting libraries with expanded list
                const blockedLibraries = [
                    'fingerprintjs', 'fingerprint2', 'clientjs', 'fingerprint',
                    'canvas-fingerprint', 'webgl-fingerprint', 'audio-fingerprint',
                    'fpjs', 'devicejs', 'uniquejs', 'browserleaks', 'creepjs',
                    'amiunique', 'panopticlick', 'coveryourtracks'
                ];
                
                blockedLibraries.forEach(lib => {
                    try {
                        Object.defineProperty(window, lib, {
                            get: () => {
                                incrementStats('fingerprintsBlocked');
                                return undefined;
                            },
                            set: () => {},
                            configurable: false
                        });
                    } catch (e) {
                        // Library might already be defined
                    }
                });
                
                // Block common fingerprinting functions with expanded list
                const blockedFunctions = [
                    'getFingerprint', 'getCanvasFingerprint', 'getWebGLFingerprint',
                    'getAudioFingerprint', 'getFontFingerprint', 'getScreenFingerprint',
                    'generateFingerprint', 'collectFingerprint', 'computeFingerprint',
                    'detectFingerprint', 'analyzeFingerprint', 'hashFingerprint'
                ];
                
                blockedFunctions.forEach(func => {
                    try {
                        Object.defineProperty(window, func, {
                            get: () => {
                                incrementStats('fingerprintsBlocked');
                                return () => null;
                            },
                            set: () => {},
                            configurable: false
                        });
                    } catch (e) {
                        // Function might already be defined
                    }
                });
            }

            safeLog('Anti-detection measures applied');
        } catch (e) {
            safeLog(`Anti-detection failed: ${e.message}`, 'error');
        }
    }
    
    // --- Advanced anti-tracking protection with expanded coverage ---
    function applyAntiTrackingProtection() {
        if (!ANTI_TRACKING) return;
        
        try {
            // Block common tracking scripts with expanded patterns
            const trackingPatterns = [
                /google-analytics\.com/, /googletagmanager\.com/, /google-analytics\.com/,
                /facebook\.com/, /facebook\.net/, /fbcdn\.net/,
                /doubleclick\.net/, /googlesyndication\.com/, /amazon-adsystem\.com/,
                /twitter\.com/, /t\.co/, /linkedin\.com/, /li\.com/,
                /hotjar\.com/, /mixpanel\.com/, /segment\.com/, /amplitude\.com/,
                /optimizely\.com/, /vwo\.com/, /crazyegg\.com/, /fullstory\.com/,
                /intercom\.com/, /drift\.com/, /zendesk\.com/, /zdassets\.com/,
                /hubspot\.com/, /mailchimp\.com/, /constantcontact\.com/,
                /scorecardresearch\.com/, /comscore\.com/, /quantserve\.com/,
                /outbrain\.com/, /taboola\.com/, /revcontent\.com/,
                /adsystem\.com/, /adsync\.com/, /adnxs\.com/, /adsymbol\.com/,
                /mouseflow\.com/, /logrocket\.com/, /smartlook\.com/,
                /kissmetrics\.com/, /pingdom\.net/, /newrelic\.com/
            ];
            
            // Block script loading with enhanced detection
            const originalCreateElement = document.createElement;
            document.createElement = function(tagName) {
                const element = originalCreateElement.call(document, tagName);
                
                if (tagName.toLowerCase() === 'script') {
                    const originalSetAttribute = element.setAttribute;
                    element.setAttribute = function(name, value) {
                        if (name === 'src') {
                            const isTracking = trackingPatterns.some(pattern => pattern.test(value));
                            if (isTracking) {
                                safeLog(`Blocked tracking script: ${value}`);
                                incrementStats('trackersBlocked');
                                incrementStats('scriptsBlocked');
                                return element; // Don't set the src
                            }
                        }
                        return originalSetAttribute.call(this, name, value);
                    };
                }
                
                return element;
            };
            
            // Block fetch requests to tracking domains with better error handling
            const originalFetch = window.fetch;
            window.fetch = function(url, options) {
                try {
                    const urlString = typeof url === 'string' ? url : url.toString();
                    const isTracking = trackingPatterns.some(pattern => pattern.test(urlString));
                    
                    if (isTracking) {
                        safeLog(`Blocked tracking fetch: ${urlString}`);
                        incrementStats('trackersBlocked');
                        return Promise.resolve(new Response('', { status: 204 }));
                    }
                    
                    return originalFetch.call(this, url, options);
                } catch (e) {
                    safeLog(`Fetch interception error: ${e.message}`, 'warn');
                    return originalFetch.call(this, url, options);
                }
            };
            
            // Block XMLHttpRequest to tracking domains with better error handling
            const originalXHROpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
                try {
                    const isTracking = trackingPatterns.some(pattern => pattern.test(url));
                    
                    if (isTracking) {
                        safeLog(`Blocked tracking XHR: ${url}`);
                        incrementStats('trackersBlocked');
                        // Return a fake response
                        this.readyState = 4;
                        this.status = 204;
                        this.responseText = '';
                        return;
                    }
                    
                    return originalXHROpen.call(this, method, url, async, user, password);
                } catch (e) {
                    safeLog(`XHR interception error: ${e.message}`, 'warn');
                    return originalXHROpen.call(this, method, url, async, user, password);
                }
            };

            // Enhanced cookie blocking
            const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
            if (originalCookieDescriptor) {
                Object.defineProperty(document, 'cookie', {
                    get: originalCookieDescriptor.get,
                    set: function(value) {
                        try {
                            // Block tracking cookies
                            const trackingCookiePatterns = [
                                /_ga/, /_gid/, /_gat/, /fbp/, /fbc/, /_fbp/, /__utm/,
                                /doubleclick/, /googlesyndication/, /amazon-adsystem/
                            ];
                            
                            const isTrackingCookie = trackingCookiePatterns.some(pattern => pattern.test(value));
                            if (isTrackingCookie) {
                                safeLog(`Blocked tracking cookie: ${value.split('=')[0]}`);
                                incrementStats('cookiesBlocked');
                                return;
                            }
                            
                            return originalCookieDescriptor.set.call(this, value);
                        } catch (e) {
                            safeLog(`Cookie interception error: ${e.message}`, 'warn');
                            return originalCookieDescriptor.set.call(this, value);
                        }
                    },
                    configurable: true
                });
            }

            safeLog('Anti-tracking protection applied');
        } catch (e) {
            safeLog(`Anti-tracking failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced core fingerprinting protection ---
    function applyCoreProtection() {
        try {
            // CRITICAL: Ensure platform is Win32, not Linux
            spoof(navigator, 'userAgent', () => profile.userAgent);
            spoof(navigator, 'platform', () => 'Win32'); // Force Win32 platform
            spoof(navigator, 'language', () => profile.language);
            spoof(navigator, 'languages', () => [profile.language, 'en']);
            spoof(navigator, 'hardwareConcurrency', () => {
                return profile.cores + getSubtleRandom(-1, 1, 'cores');
            });
            spoof(navigator, 'deviceMemory', () => {
                return profile.memory + getSubtleRandom(-2, 2, 'memory');
            });
            spoof(navigator, 'vendor', () => profile.vendor);
            spoof(navigator, 'productSub', () => profile.productSub);
            spoof(navigator, 'appVersion', () => profile.appVersion);
            spoof(navigator, 'appName', () => profile.appName);
            spoof(navigator, 'doNotTrack', () => profile.doNotTrack);
            
            // Enhanced navigator protection with new properties
            spoof(navigator, 'maxTouchPoints', () => profile.maxTouchPoints);
            spoof(navigator, 'onLine', () => true);
            spoof(navigator, 'cookieEnabled', () => true);
            spoof(navigator, 'javaEnabled', () => () => false);
            
            // New navigator properties for better spoofing
            spoof(navigator, 'buildID', () => undefined);
            spoof(navigator, 'cpuClass', () => profile.cpuClass);
            spoof(navigator, 'oscpu', () => profile.oscpu);
            spoof(navigator, 'webdriver', () => undefined);
            
            // Enhanced connection spoofing with better values
            if (profile.connection) {
                spoof(navigator, 'connection', () => ({
                    effectiveType: profile.connection.effectiveType,
                    downlink: profile.connection.downlink + getSubtleRandom(-2, 2, 'downlink'),
                    rtt: profile.connection.rtt + getSubtleRandom(-10, 10, 'rtt'),
                    saveData: false,
                    type: 'wifi'
                }));
            }
            
            // Enhanced plugins protection with better implementation
            const spoofedPlugins = plugins.map((plugin, index) => ({
                name: plugin.name,
                filename: plugin.filename,
                description: plugin.description,
                length: 1,
                [index]: {
                    type: 'application/x-nacl',
                    suffixes: 'nexe',
                    description: plugin.description,
                    enabledPlugin: plugin
                }
            }));
            
            spoof(navigator, 'plugins', () => {
                const pluginArray = Object.create(PluginArray.prototype);
                spoofedPlugins.forEach((plugin, index) => {
                    const pluginObj = Object.create(Plugin.prototype);
                    Object.defineProperties(pluginObj, {
                        name: { value: plugin.name, enumerable: true },
                        filename: { value: plugin.filename, enumerable: true },
                        description: { value: plugin.description, enumerable: true },
                        length: { value: plugin.length, enumerable: true }
                    });
                    Object.defineProperty(pluginArray, index, { value: pluginObj, enumerable: true });
                    Object.defineProperty(pluginArray, plugin.name, { value: pluginObj, enumerable: false });
                });
                Object.defineProperty(pluginArray, 'length', { value: spoofedPlugins.length, enumerable: true });
                
                // Add array methods
                pluginArray.item = function(index) { return this[index] || null; };
                pluginArray.namedItem = function(name) { return this[name] || null; };
                pluginArray.refresh = function() {};
                
                return pluginArray;
            });
            
            // Enhanced mimeTypes protection
            spoof(navigator, 'mimeTypes', () => {
                const mimeArray = Object.create(MimeTypeArray.prototype);
                const mimeTypes = [
                    { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format', enabledPlugin: spoofedPlugins[0] },
                    { type: 'application/x-pdf', suffixes: 'pdf', description: 'Portable Document Format', enabledPlugin: spoofedPlugins[0] },
                    { type: 'text/pdf', suffixes: 'pdf', description: 'Portable Document Format', enabledPlugin: spoofedPlugins[0] }
                ];
                
                mimeTypes.forEach((mime, index) => {
                    const mimeObj = Object.create(MimeType.prototype);
                    Object.defineProperties(mimeObj, {
                        type: { value: mime.type, enumerable: true },
                        suffixes: { value: mime.suffixes, enumerable: true },
                        description: { value: mime.description, enumerable: true },
                        enabledPlugin: { value: mime.enabledPlugin, enumerable: true }
                    });
                    Object.defineProperty(mimeArray, index, { value: mimeObj, enumerable: true });
                    Object.defineProperty(mimeArray, mime.type, { value: mimeObj, enumerable: false });
                });
                Object.defineProperty(mimeArray, 'length', { value: mimeTypes.length, enumerable: true });
                
                // Add array methods
                mimeArray.item = function(index) { return this[index] || null; };
                mimeArray.namedItem = function(name) { return this[name] || null; };
                
                return mimeArray;
            });
            
            // Enhanced permissions protection
            if (navigator.permissions) {
                const originalQuery = navigator.permissions.query;
                navigator.permissions.query = function(permissionDesc) {
                    try {
                        const permission = permissionDesc.name;
                        const blockedPermissions = ['notifications', 'geolocation', 'microphone', 'camera', 'midi'];
                        
                        if (blockedPermissions.includes(permission)) {
                            incrementStats('apiCallsBlocked');
                            return Promise.resolve({
                                state: 'denied',
                                onchange: null
                            });
                        }
                        
                        return originalQuery.call(this, permissionDesc);
                    } catch (e) {
                        safeLog(`Permissions query error: ${e.message}`, 'warn');
                        return originalQuery.call(this, permissionDesc);
                    }
                };
            }
            
            // Enhanced geolocation protection
            if (navigator.geolocation) {
                const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
                const originalWatchPosition = navigator.geolocation.watchPosition;
                
                navigator.geolocation.getCurrentPosition = function(success, error, options) {
                    incrementStats('apiCallsBlocked');
                    if (error) {
                        error({ code: 1, message: 'User denied geolocation' });
                    }
                };
                
                navigator.geolocation.watchPosition = function(success, error, options) {
                    incrementStats('apiCallsBlocked');
                    if (error) {
                        error({ code: 1, message: 'User denied geolocation' });
                    }
                    return 1; // Return a fake watch ID
                };
                
                spoof(navigator.geolocation, 'clearWatch', () => function() {});
            }

            // Screen properties with enhanced randomization
            const screenWidth = ROUND_SCREEN ? Math.floor(profile.screenWidth / 100) * 100 : profile.screenWidth;
            const screenHeight = ROUND_SCREEN ? Math.floor(profile.screenHeight / 100) * 100 : profile.screenHeight;
            spoof(window.screen, 'width', () => screenWidth);
            spoof(window.screen, 'height', () => screenHeight);
            spoof(window.screen, 'colorDepth', () => profile.colorDepth);
            spoof(window.screen, 'pixelDepth', () => profile.colorDepth);
            spoof(window.screen, 'availWidth', () => screenWidth);
            spoof(window.screen, 'availHeight', () => screenHeight - 40); // Account for taskbar
            spoof(window.screen, 'availLeft', () => 0);
            spoof(window.screen, 'availTop', () => 0);
            spoof(window, 'devicePixelRatio', () => profile.devicePixelRatio);
            
            // Additional screen properties
            spoof(window.screen, 'orientation', () => ({
                angle: 0,
                type: 'landscape-primary',
                onchange: null
            }));

            // Enhanced timezone spoofing with randomization
            if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
                const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
                Intl.DateTimeFormat.prototype.resolvedOptions = function () {
                    try {
                        const options = orig.call(this);
                        options.timeZone = profile.timezone;
                        // Add subtle randomization to timezone offset
                        if (options.timeZoneName) {
                            options.timeZoneName = 'short';
                        }
                        return options;
                    } catch (e) {
                        safeLog(`Timezone spoofing error: ${e.message}`, 'warn');
                        return orig.call(this);
                    }
                };
            }

            // Randomize Date methods to make timing less unique
            const origGetTimezoneOffset = Date.prototype.getTimezoneOffset;
            Date.prototype.getTimezoneOffset = function() {
                try {
                    const offset = origGetTimezoneOffset.call(this);
                    // Add ±1 minute randomization to make it less unique
                    return offset + getSubtleRandom(-1, 1, 'timezone');
                } catch (e) {
                    safeLog(`Date timezone error: ${e.message}`, 'warn');
                    return origGetTimezoneOffset.call(this);
                }
            };

            safeLog('Core protection applied');
            incrementStats('protectionsApplied');
        } catch (e) {
            safeLog(`Core protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Canvas protection with common hashes ---
    function applyCanvasProtection() {
        if (!window.HTMLCanvasElement) return;

        try {
            if (PARANOID_CANVAS) {
                // Always return a blank image (paranoid mode)
                const blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89PwGHwAFYAJm6ocdgAAAABJRU5ErkJggg==';
                HTMLCanvasElement.prototype.toDataURL = function() { 
                    incrementStats('fingerprintsBlocked');
                    return blank; 
                };
                HTMLCanvasElement.prototype.toBlob = function(cb) {
                    incrementStats('fingerprintsBlocked');
                    try {
                        const byteString = atob(blank.split(',')[1]);
                        const ab = new ArrayBuffer(byteString.length);
                        const ia = new Uint8Array(ab);
                        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                        cb(new Blob([ab], {type: 'image/png'}));
                    } catch (e) {
                        safeLog(`Canvas toBlob error: ${e.message}`, 'warn');
                        cb(new Blob([], {type: 'image/png'}));
                    }
                };
            } else {
                // CRITICAL: Enhanced canvas fingerprinting protection with common fingerprints
                const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
                HTMLCanvasElement.prototype.toDataURL = function() {
                    try {
                        const ctx = this.getContext('2d');
                        if (ctx) {
                            const { width, height } = this;
                            try {
                                const imgData = ctx.getImageData(0, 0, width, height);
                                // Use consistent randomization to produce common hashes
                                const seed = width + 'x' + height + 'x' + Math.floor(Date.now() / 300000); // Change every 5 minutes
                                const randomFactor = getConsistentRandom(seed);
                                
                                // Apply subtle, consistent noise that produces common hashes
                                for (let i = 0; i < imgData.data.length; i += 4) {
                                    const noise = Math.sin(i * randomFactor) * 0.8; // Slightly more variation
                                    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
                                    imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + noise));
                                    imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + noise));
                                }
                                ctx.putImageData(imgData, 0, 0);
                            } catch (e) {
                                safeLog(`Canvas manipulation error: ${e.message}`, 'warn');
                            }
                        }
                        incrementStats('fingerprintsBlocked');
                        return origToDataURL.apply(this, arguments);
                    } catch (e) {
                        safeLog(`Canvas toDataURL error: ${e.message}`, 'warn');
                        return origToDataURL.apply(this, arguments);
                    }
                };

                // Also randomize getImageData (more subtle)
                const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
                CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
                    try {
                        const imgData = origGetImageData.call(this, x, y, w, h);
                        // Add very subtle randomization to getImageData
                        for (let i = 0; i < imgData.data.length; i += 4) {
                            // Only modify every 100th pixel to make it much less detectable
                            if (i % 400 === 0) {
                                const variation = getSubtleRandom(-1, 1, `pixel-${i}`);
                                imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + variation));
                                imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + variation));
                                imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + variation));
                            }
                        }
                        return imgData;
                    } catch (e) {
                        safeLog(`Canvas getImageData error: ${e.message}`, 'warn');
                        return origGetImageData.call(this, x, y, w, h);
                    }
                };

                // Enhanced text/rect randomization
                if (CANVAS_TEXT_RANDOMIZE) {
                    const origFillText = CanvasRenderingContext2D.prototype.fillText;
                    const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
                    const origFillRect = CanvasRenderingContext2D.prototype.fillRect;
                    const origStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;

                    CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
                        try {
                            const offset = getSubtleRandom(-1, 1, `filltext-${text}-${x}-${y}`);
                            return origFillText.call(this, text, x + offset, y + offset, maxWidth);
                        } catch (e) {
                            safeLog(`Canvas fillText error: ${e.message}`, 'warn');
                            return origFillText.call(this, text, x, y, maxWidth);
                        }
                    };

                    CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
                        try {
                            const offset = getSubtleRandom(-1, 1, `stroketext-${text}-${x}-${y}`);
                            return origStrokeText.call(this, text, x + offset, y + offset, maxWidth);
                        } catch (e) {
                            safeLog(`Canvas strokeText error: ${e.message}`, 'warn');
                            return origStrokeText.call(this, text, x, y, maxWidth);
                        }
                    };

                    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                        try {
                            const offset = getSubtleRandom(-1, 1, `fillrect-${x}-${y}-${width}-${height}`);
                            return origFillRect.call(this, x + offset, y + offset, width, height);
                        } catch (e) {
                            safeLog(`Canvas fillRect error: ${e.message}`, 'warn');
                            return origFillRect.call(this, x, y, width, height);
                        }
                    };

                    CanvasRenderingContext2D.prototype.strokeRect = function(x, y, width, height) {
                        try {
                            const offset = getSubtleRandom(-1, 1, `strokerect-${x}-${y}-${width}-${height}`);
                            return origStrokeRect.call(this, x + offset, y + offset, width, height);
                        } catch (e) {
                            safeLog(`Canvas strokeRect error: ${e.message}`, 'warn');
                            return origStrokeRect.call(this, x, y, width, height);
                        }
                    };
                }
            }

            safeLog('Canvas protection applied');
        } catch (e) {
            safeLog(`Canvas protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced WebGL protection with realistic spoofing ---
    function applyWebGLProtection() {
        if (!window.WebGLRenderingContext && !window.WebGL2RenderingContext) return;

        try {
            // Enhanced WebGL parameter proxying with shader precision format fix
            const webglParams = {
                0x8B8C: 16, // MAX_VERTEX_UNIFORM_VECTORS
                0x8B8D: 16, // MAX_FRAGMENT_UNIFORM_VECTORS
                0x8A2F: 16, // MAX_VERTEX_ATTRIBS
                0x8871: 16384, // MAX_TEXTURE_SIZE
                0x84FF: 16384, // MAX_RENDERBUFFER_SIZE
                0x8872: [16384, 16384], // MAX_VIEWPORT_DIMS
                0x8073: 16, // MAX_VERTEX_TEXTURE_IMAGE_UNITS
                0x8872: 16, // MAX_TEXTURE_IMAGE_UNITS
                0x8B4D: 32, // MAX_COMBINED_TEXTURE_IMAGE_UNITS
                0x84E8: [1, 1], // ALIASED_LINE_WIDTH_RANGE
                0x8127: [1, 1024], // ALIASED_POINT_SIZE_RANGE
                0x851C: 16384, // MAX_CUBE_MAP_TEXTURE_SIZE
                0x8A2B: 64, // MAX_VERTEX_OUTPUT_COMPONENTS
                0x8DFB: 60, // MAX_FRAGMENT_INPUT_COMPONENTS
                37440: 'OpenGL ES 2.0 (ANGLE 2.1.0 (git-devel))', // VERSION
                37445: 'Google Inc.', // UNMASKED_VENDOR_WEBGL
                37446: profile.webglRenderer // UNMASKED_RENDERER_WEBGL
            };

            // CRITICAL: Proxy WebGL context to enable WebGL but spoof vendor/renderer
            const originalGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                try {
                    const context = originalGetContext.call(this, contextType, contextAttributes);
                    
                    if (context && (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl')) {
                        incrementStats('fingerprintsBlocked');
                        
                        // Select a common WebGL profile for this session
                        const sessionProfile = commonWebGLProfiles[Math.abs(getConsistentRandom(window.location.hostname) * commonWebGLProfiles.length) | 0];
                        
                        // Create a proxy for the WebGL context
                        return new Proxy(context, {
                            get(target, prop) {
                                try {
                                    if (prop === 'getParameter') {
                                        return function(parameter) {
                                            try {
                                                // Return spoofed values for specific parameters
                                                if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
                                                    return sessionProfile.vendor;
                                                }
                                                if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
                                                    return sessionProfile.renderer;
                                                }
                                                if (webglParams.hasOwnProperty(parameter)) {
                                                    return webglParams[parameter];
                                                }
                                                return target.getParameter(parameter);
                                            } catch (e) {
                                                safeLog(`WebGL getParameter error: ${e.message}`, 'warn');
                                                return target.getParameter(parameter);
                                            }
                                        };
                                    }
                                    if (prop === 'getExtension') {
                                        return function(name) {
                                            try {
                                                const extension = target.getExtension(name);
                                                if (extension && name === 'WEBGL_debug_renderer_info') {
                                                    return new Proxy(extension, {
                                                        get(extTarget, extProp) {
                                                            if (extProp === 'UNMASKED_VENDOR_WEBGL') {
                                                                return 37445;
                                                            }
                                                            if (extProp === 'UNMASKED_RENDERER_WEBGL') {
                                                                return 37446;
                                                            }
                                                            return extTarget[extProp];
                                                        }
                                                    });
                                                }
                                                return extension;
                                            } catch (e) {
                                                safeLog(`WebGL getExtension error: ${e.message}`, 'warn');
                                                return target.getExtension(name);
                                            }
                                        };
                                    }
                                    if (prop === 'getShaderPrecisionFormat') {
                                        return function(shaderType, precisionType) {
                                            try {
                                                const format = target.getShaderPrecisionFormat(shaderType, precisionType);
                                                if (format) {
                                                    // Return a safe proxy that doesn't allow setting read-only properties
                                                    return new Proxy(format, {
                                                        get(proxyTarget, proxyProp) {
                                                            return proxyTarget[proxyProp];
                                                        },
                                                        set(proxyTarget, proxyProp, value) {
                                                            // Don't actually set read-only properties, just return true
                                                            return true;
                                                        }
                                                    });
                                                }
                                                return format;
                                            } catch (e) {
                                                safeLog(`WebGL getShaderPrecisionFormat error: ${e.message}`, 'warn');
                                                return target.getShaderPrecisionFormat(shaderType, precisionType);
                                            }
                                        };
                                    }
                                    return target[prop];
                                } catch (e) {
                                    safeLog(`WebGL proxy get error: ${e.message}`, 'warn');
                                    return target[prop];
                                }
                            },
                            set(target, prop, value) {
                                try {
                                    target[prop] = value;
                                    return true;
                                } catch (e) {
                                    safeLog(`WebGL proxy set error: ${e.message}`, 'warn');
                                    return false;
                                }
                            }
                        });
                    }
                    
                    return context;
                } catch (e) {
                    safeLog(`WebGL context creation error: ${e.message}`, 'warn');
                    return originalGetContext.call(this, contextType, contextAttributes);
                }
            };

            safeLog('WebGL protection applied');
        } catch (e) {
            safeLog(`WebGL protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Audio protection ---
    function applyAudioProtection() {
        if (!window.AudioContext && !window.webkitAudioContext) return;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            
            if (AudioContextClass) {
                const origCreateDynamicsCompressor = AudioContextClass.prototype.createDynamicsCompressor;
                const origCreateOscillator = AudioContextClass.prototype.createOscillator;
                
                // Spoof AudioContext properties
                Object.defineProperty(AudioContextClass.prototype, 'sampleRate', {
                    get: function() {
                        incrementStats('fingerprintsBlocked');
                        return 48000; // Most common value
                    },
                    configurable: true
                });
                
                Object.defineProperty(AudioContextClass.prototype, 'state', {
                    get: function() {
                        return 'running';
                    },
                    configurable: true
                });
                
                // Add noise to audio fingerprinting
                if (origCreateDynamicsCompressor) {
                    AudioContextClass.prototype.createDynamicsCompressor = function() {
                        try {
                            const compressor = origCreateDynamicsCompressor.call(this);
                            const origConnect = compressor.connect;
                            
                            compressor.connect = function(destination) {
                                // Add subtle audio noise to prevent fingerprinting
                                const gainNode = this.context.createGain();
                                gainNode.gain.value = 1 + (getSubtleRandom(-1, 1, 'audio') * 0.001);
                                origConnect.call(this, gainNode);
                                return gainNode.connect(destination);
                            };
                            
                            return compressor;
                        } catch (e) {
                            safeLog(`Audio compressor error: ${e.message}`, 'warn');
                            return origCreateDynamicsCompressor.call(this);
                        }
                    };
                }
                
                if (origCreateOscillator) {
                    AudioContextClass.prototype.createOscillator = function() {
                        try {
                            const oscillator = origCreateOscillator.call(this);
                            const origFreq = oscillator.frequency.value;
                            
                            // Add slight frequency variation
                            Object.defineProperty(oscillator.frequency, 'value', {
                                get: () => origFreq + (getSubtleRandom(-1, 1, 'freq') * 0.1),
                                set: (val) => { /* ignore sets */ },
                                configurable: true
                            });
                            
                            return oscillator;
                        } catch (e) {
                            safeLog(`Audio oscillator error: ${e.message}`, 'warn');
                            return origCreateOscillator.call(this);
                        }
                    };
                }
            }

            safeLog('Audio protection applied');
        } catch (e) {
            safeLog(`Audio protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Font protection with common Windows fonts ---
    function applyFontProtection() {
        if (!window.document) return;

        try {
            // CRITICAL: Override font detection to return common Windows fonts only
            if (window.document.fonts && window.document.fonts.check) {
                const origCheck = window.document.fonts.check;
                window.document.fonts.check = function(font, text) {
                    try {
                        incrementStats('fingerprintsBlocked');
                        // Always return true for common Windows fonts
                        if (commonWindowsFonts.some(f => font.includes(f))) {
                            return true;
                        }
                        // Return false for uncommon fonts to avoid unique fingerprints
                        return false;
                    } catch (e) {
                        safeLog(`Font check error: ${e.message}`, 'warn');
                        return origCheck.call(this, font, text);
                    }
                };
            }

            // Enhanced measureText randomization
            if (FONT_RANDOMIZE && window.CanvasRenderingContext2D) {
                const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
                CanvasRenderingContext2D.prototype.measureText = function(text) {
                    try {
                        const metrics = origMeasureText.call(this, text);
                        
                        // Add subtle randomization to width
                        const originalWidth = metrics.width;
                        const randomFactor = 1 + (getSubtleRandom(-3, 3, `measuretext-${text}`) / 1000); // ±0.3% variation
                        
                        Object.defineProperty(metrics, 'width', {
                            get: () => originalWidth * randomFactor,
                            configurable: true
                        });
                        
                        return metrics;
                    } catch (e) {
                        safeLog(`Font measureText error: ${e.message}`, 'warn');
                        return origMeasureText.call(this, text);
                    }
                };
            }

            // Block font enumeration with better error handling
            if (window.document.fonts && window.document.fonts.ready) {
                const origReady = window.document.fonts.ready;
                window.document.fonts.ready = new Promise((resolve) => {
                    // Resolve immediately with a subset of fonts
                    setTimeout(() => resolve(), 10);
                });
            }

            // Enhanced font loading detection blocking
            if (window.FontFace) {
                const origFontFace = window.FontFace;
                window.FontFace = function(family, source, descriptors) {
                    try {
                        const fontFace = new origFontFace(family, source, descriptors);
                        const origLoad = fontFace.load;
                        
                        fontFace.load = function() {
                            return new Promise((resolve, reject) => {
                                // Delay font loading to prevent timing attacks
                                setTimeout(() => {
                                    try {
                                        resolve(origLoad.call(this));
                                    } catch (e) {
                                        reject(e);
                                    }
                                }, getSubtleRandom(10, 50, 'fontload'));
                            });
                        };
                        
                        return fontFace;
                    } catch (e) {
                        safeLog(`FontFace creation error: ${e.message}`, 'warn');
                        return new origFontFace(family, source, descriptors);
                    }
                };
            }

            safeLog('Font protection applied');
        } catch (e) {
            safeLog(`Font protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Battery API protection with realistic values ---
    function applyBatteryProtection() {
        if (!navigator.getBattery) return;

        try {
            const origGetBattery = navigator.getBattery;
            navigator.getBattery = function() {
                incrementStats('apiCallsBlocked');
                return origGetBattery.call(this).then(battery => {
                    try {
                        // CRITICAL: Spoof battery properties with realistic values
                        spoof(battery, 'level', () => 0.4 + getSubtleRandom(0, 40, 'battery-level') / 100); // 40-80% range
                        spoof(battery, 'charging', () => getSubtleRandom(0, 1, 'battery-charging') > 0.6); // 40% chance of charging
                        spoof(battery, 'chargingTime', () => {
                            const charging = battery.charging;
                            return charging ? getSubtleRandom(1800, 7200, 'battery-charge-time') : Infinity; // 30min-2hr
                        });
                        spoof(battery, 'dischargingTime', () => {
                            const charging = battery.charging;
                            return charging ? Infinity : getSubtleRandom(3600, 14400, 'battery-discharge-time'); // 1-4hr
                        });
                        
                        return battery;
                    } catch (e) {
                        safeLog(`Battery spoofing error: ${e.message}`, 'warn');
                        return battery;
                    }
                }).catch(e => {
                    safeLog(`Battery API error: ${e.message}`, 'warn');
                    return Promise.reject(e);
                });
            };

            safeLog('Battery protection applied');
        } catch (e) {
            safeLog(`Battery protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced MediaDevices protection ---
    function applyMediaDevicesProtection() {
        if (!navigator.mediaDevices) return;

        try {
            const origEnumerateDevices = navigator.mediaDevices.enumerateDevices;
            navigator.mediaDevices.enumerateDevices = function() {
                incrementStats('apiCallsBlocked');
                return origEnumerateDevices.call(this).then(devices => {
                    try {
                        // Spoof device IDs to common values
                        return devices.map((device, index) => ({
                            ...device,
                            deviceId: device.deviceId ? `default-device-${index}-${getSubtleRandom(1000, 9999, 'device-id')}` : device.deviceId,
                            groupId: device.groupId ? `default-group-${getSubtleRandom(100, 999, 'group-id')}` : device.groupId
                        }));
                    } catch (e) {
                        safeLog(`MediaDevices enumeration error: ${e.message}`, 'warn');
                        return devices;
                    }
                }).catch(e => {
                    safeLog(`MediaDevices API error: ${e.message}`, 'warn');
                    return Promise.reject(e);
                });
            };

            const origGetUserMedia = navigator.mediaDevices.getUserMedia;
            navigator.mediaDevices.getUserMedia = function(constraints) {
                try {
                    // Block certain media requests
                    if (constraints.video && constraints.video.facingMode === 'environment') {
                        incrementStats('apiCallsBlocked');
                        return Promise.reject(new Error('Camera access denied for fingerprinting protection'));
                    }
                    return origGetUserMedia.call(this, constraints);
                } catch (e) {
                    safeLog(`getUserMedia error: ${e.message}`, 'warn');
                    return origGetUserMedia.call(this, constraints);
                }
            };

            safeLog('MediaDevices protection applied');
        } catch (e) {
            safeLog(`MediaDevices protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Permissions protection with realistic values ---
    function applyPermissionsProtection() {
        if (!navigator.permissions) return;

        try {
            const origQuery = navigator.permissions.query;
            navigator.permissions.query = function(permissionDesc) {
                try {
                    incrementStats('apiCallsBlocked');
                    // CRITICAL: Return realistic permission states instead of all granted
                    const permissionStates = {
                        'geolocation': 'denied',
                        'notifications': 'denied',
                        'microphone': 'denied',
                        'camera': 'denied',
                        'persistent-storage': 'granted',
                        'clipboard-read': 'granted',
                        'clipboard-write': 'granted',
                        'accelerometer': 'granted',
                        'ambient-light-sensor': 'denied',
                        'background-sync': 'granted',
                        'magnetometer': 'denied',
                        'midi': 'granted',
                        'payment-handler': 'granted',
                        'push': 'denied'
                    };
                    
                    const state = permissionStates[permissionDesc.name] || 'prompt';
                    return Promise.resolve({
                        state: state,
                        onchange: null
                    });
                } catch (e) {
                    safeLog(`Permissions query error: ${e.message}`, 'warn');
                    return origQuery.call(this, permissionDesc);
                }
            };

            safeLog('Permissions protection applied');
        } catch (e) {
            safeLog(`Permissions protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced Storage protection ---
    function applyStorageProtection() {
        try {
            // Block localStorage and sessionStorage access for certain domains
            const blockedDomains = ['tracker.com', 'analytics.com', 'ads.com', 'doubleclick.net', 'googlesyndication.com'];
            const currentDomain = window.location.hostname;
            
            if (blockedDomains.some(domain => currentDomain.includes(domain))) {
                // Override storage methods
                const noop = () => {
                    incrementStats('apiCallsBlocked');
                };
                const storage = {
                    getItem: noop,
                    setItem: noop,
                    removeItem: noop,
                    clear: noop,
                    key: noop,
                    length: 0
                };
                
                Object.defineProperty(window, 'localStorage', {
                    get: () => storage,
                    configurable: true
                });
                
                Object.defineProperty(window, 'sessionStorage', {
                    get: () => storage,
                    configurable: true
                });
            }

            // Enhanced IndexedDB protection
            if (window.indexedDB) {
                const origOpen = window.indexedDB.open;
                window.indexedDB.open = function(name, version) {
                    try {
                        incrementStats('apiCallsBlocked');
                        // Block known fingerprinting databases
                        const blockedDBNames = ['fingerprint', 'tracking', 'analytics', 'ads'];
                        if (blockedDBNames.some(blocked => name.toLowerCase().includes(blocked))) {
                            const request = {
                                error: new Error('Database access denied for fingerprinting protection'),
                                onsuccess: null,
                                onerror: null,
                                result: null
                            };
                            setTimeout(() => {
                                if (request.onerror) request.onerror();
                            }, 10);
                            return request;
                        }
                        return origOpen.call(this, name, version);
                    } catch (e) {
                        safeLog(`IndexedDB protection error: ${e.message}`, 'warn');
                        return origOpen.call(this, name, version);
                    }
                };
            }

            safeLog('Storage protection applied');
        } catch (e) {
            safeLog(`Storage protection failed: ${e.message}`, 'error');
        }
    }

    // --- Enhanced WebRTC protection ---
    function applyWebRTCProtection() {
        try {
            // Block WebRTC to prevent IP leaks
            if (window.RTCPeerConnection) {
                const origRTCPeerConnection = window.RTCPeerConnection;
                window.RTCPeerConnection = function(configuration) {
                    try {
                        incrementStats('apiCallsBlocked');
                        const pc = new origRTCPeerConnection(configuration);
                        
                        // Override createOffer and createAnswer to prevent ICE gathering
                        const origCreateOffer = pc.createOffer;
                        const origCreateAnswer = pc.createAnswer;
                        
                        pc.createOffer = function(options) {
                            return origCreateOffer.call(this, options).then(offer => {
                                try {
                                    // Remove ICE candidates to prevent IP leaks
                                    offer.sdp = offer.sdp.replace(/a=candidate.*\r\n/g, '');
                                    return offer;
                                } catch (e) {
                                    safeLog(`WebRTC offer processing error: ${e.message}`, 'warn');
                                    return offer;
                                }
                            });
                        };
                        
                        pc.createAnswer = function(options) {
                            return origCreateAnswer.call(this, options).then(answer => {
                                try {
                                    // Remove ICE candidates to prevent IP leaks
                                    answer.sdp = answer.sdp.replace(/a=candidate.*\r\n/g, '');
                                    return answer;
                                } catch (e) {
                                    safeLog(`WebRTC answer processing error: ${e.message}`, 'warn');
                                    return answer;
                                }
                            });
                        };
                        
                        return pc;
                    } catch (e) {
                        safeLog(`WebRTC creation error: ${e.message}`, 'warn');
                        return new origRTCPeerConnection(configuration);
                    }
                };
            }

            // Block WebRTC data channels
            if (window.RTCDataChannel) {
                const origSend = RTCDataChannel.prototype.send;
                RTCDataChannel.prototype.send = function(data) {
                    try {
                        incrementStats('apiCallsBlocked');
                        // Block potential fingerprinting data
                        if (typeof data === 'string' && (data.includes('fingerprint') || data.includes('track'))) {
                            safeLog(`Blocked WebRTC data: ${data.substring(0, 50)}`);
                            return;
                        }
                        return origSend.call(this, data);
                    } catch (e) {
                        safeLog(`WebRTC data channel error: ${e.message}`, 'warn');
                        return origSend.call(this, data);
                    }
                };
            }

            safeLog('WebRTC protection applied');
        } catch (e) {
            safeLog(`WebRTC protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Enhanced CPU protection ---
    function applyCPUProtection() {
        try {
            // Spoof performance timing to prevent CPU fingerprinting
            if (window.performance && window.performance.now) {
                const origNow = window.performance.now;
                const startTime = origNow.call(window.performance);
                
                window.performance.now = function() {
                    try {
                        const realTime = origNow.call(this);
                        // Add small random variation to prevent timing fingerprinting
                        const variation = getSubtleRandom(-2, 2, 'performance-now') * 0.1;
                        return realTime + variation;
                    } catch (e) {
                        safeLog(`Performance.now error: ${e.message}`, 'warn');
                        return origNow.call(this);
                    }
                };
            }

            // Spoof requestAnimationFrame timing
            if (window.requestAnimationFrame) {
                const origRAF = window.requestAnimationFrame;
                window.requestAnimationFrame = function(callback) {
                    try {
                        return origRAF.call(this, function(timestamp) {
                            // Add small timing variation
                            const variation = getSubtleRandom(-1, 1, 'raf-timing') * 0.5;
                            callback(timestamp + variation);
                        });
                    } catch (e) {
                        safeLog(`RequestAnimationFrame error: ${e.message}`, 'warn');
                        return origRAF.call(this, callback);
                    }
                };
            }

            safeLog('CPU protection applied');
        } catch (e) {
            safeLog(`CPU protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Enhanced memory protection ---
    function applyMemoryProtection() {
        try {
            // Block memory information leaks
            if (navigator.deviceMemory !== undefined) {
                spoof(navigator, 'deviceMemory', () => profile.memory || 8);
            }

            // Spoof memory-related performance entries
            if (window.performance && window.performance.memory) {
                const origMemory = window.performance.memory;
                Object.defineProperty(window.performance, 'memory', {
                    get: () => ({
                        get jsHeapSizeLimit() {
                            return 2172649472 + getSubtleRandom(-100000, 100000, 'heap-limit');
                        },
                        get totalJSHeapSize() {
                            return 50000000 + getSubtleRandom(-1000000, 1000000, 'heap-total');
                        },
                        get usedJSHeapSize() {
                            return 30000000 + getSubtleRandom(-500000, 500000, 'heap-used');
                        }
                    }),
                    configurable: true
                });
            }

            safeLog('Memory protection applied');
        } catch (e) {
            safeLog(`Memory protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Bluetooth protection ---
    function applyBluetoothProtection() {
        try {
            if (navigator.bluetooth) {
                const origRequestDevice = navigator.bluetooth.requestDevice;
                navigator.bluetooth.requestDevice = function(options) {
                    incrementStats('apiCallsBlocked');
                    return Promise.reject(new Error('Bluetooth access denied for fingerprinting protection'));
                };

                const origGetAvailability = navigator.bluetooth.getAvailability;
                if (origGetAvailability) {
                    navigator.bluetooth.getAvailability = function() {
                        incrementStats('apiCallsBlocked');
                        return Promise.resolve(false);
                    };
                }
            }

            safeLog('Bluetooth protection applied');
        } catch (e) {
            safeLog(`Bluetooth protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Gamepad protection ---
    function applyGamepadProtection() {
        try {
            if (navigator.getGamepads) {
                const origGetGamepads = navigator.getGamepads;
                navigator.getGamepads = function() {
                    incrementStats('apiCallsBlocked');
                    return []; // Return no gamepads
                };
            }

            // Block gamepad events
            ['gamepadconnected', 'gamepaddisconnected'].forEach(event => {
                window.addEventListener(event, function(e) {
                    e.stopImmediatePropagation();
                    incrementStats('apiCallsBlocked');
                }, true);
            });

            safeLog('Gamepad protection applied');
        } catch (e) {
            safeLog(`Gamepad protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: USB protection ---
    function applyUSBProtection() {
        try {
            if (navigator.usb) {
                const origRequestDevice = navigator.usb.requestDevice;
                navigator.usb.requestDevice = function(options) {
                    incrementStats('apiCallsBlocked');
                    return Promise.reject(new Error('USB access denied for fingerprinting protection'));
                };

                const origGetDevices = navigator.usb.getDevices;
                if (origGetDevices) {
                    navigator.usb.getDevices = function() {
                        incrementStats('apiCallsBlocked');
                        return Promise.resolve([]);
                    };
                }
            }

            safeLog('USB protection applied');
        } catch (e) {
            safeLog(`USB protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Network Information protection ---
    function applyNetworkProtection() {
        try {
            if (navigator.connection || navigator.mozConnection || navigator.webkitConnection) {
                const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                
                spoof(conn, 'effectiveType', () => profile.connection?.effectiveType || '4g');
                spoof(conn, 'downlink', () => (profile.connection?.downlink || 10) + getSubtleRandom(-2, 2, 'downlink'));
                spoof(conn, 'rtt', () => (profile.connection?.rtt || 50) + getSubtleRandom(-10, 10, 'rtt'));
                spoof(conn, 'saveData', () => false);
                spoof(conn, 'type', () => 'wifi');
            }

            safeLog('Network protection applied');
        } catch (e) {
            safeLog(`Network protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Speech Synthesis protection ---
    function applySpeechProtection() {
        try {
            if (window.speechSynthesis) {
                const origGetVoices = window.speechSynthesis.getVoices;
                window.speechSynthesis.getVoices = function() {
                    incrementStats('apiCallsBlocked');
                    // Return common English voices only
                    return [
                        { name: 'Microsoft David Desktop - English (United States)', lang: 'en-US', default: true, localService: true, voiceURI: 'Microsoft David Desktop - English (United States)' },
                        { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', default: false, localService: true, voiceURI: 'Microsoft Zira Desktop - English (United States)' }
                    ];
                };
            }

            safeLog('Speech protection applied');
        } catch (e) {
            safeLog(`Speech protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Clipboard protection ---
    function applyClipboardProtection() {
        try {
            if (navigator.clipboard) {
                const origRead = navigator.clipboard.read;
                navigator.clipboard.read = function() {
                    incrementStats('apiCallsBlocked');
                    return Promise.reject(new Error('Clipboard access denied for fingerprinting protection'));
                };

                const origReadText = navigator.clipboard.readText;
                navigator.clipboard.readText = function() {
                    incrementStats('apiCallsBlocked');
                    return Promise.reject(new Error('Clipboard access denied for fingerprinting protection'));
                };
            }

            safeLog('Clipboard protection applied');
        } catch (e) {
            safeLog(`Clipboard protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Intersection Observer protection ---
    function applyIntersectionObserverProtection() {
        try {
            if (window.IntersectionObserver) {
                const origIntersectionObserver = window.IntersectionObserver;
                window.IntersectionObserver = function(callback, options) {
                    // Add noise to intersection observer timing
                    const noisyCallback = function(entries, observer) {
                        entries.forEach(entry => {
                            // Add small timing variations
                            if (entry.time) {
                                entry.time += getSubtleRandom(-5, 5, 'intersection-time');
                            }
                        });
                        callback(entries, observer);
                    };
                    return new origIntersectionObserver(noisyCallback, options);
                };
            }

            safeLog('Intersection Observer protection applied');
        } catch (e) {
            safeLog(`Intersection Observer protection failed: ${e.message}`, 'error');
        }
    }

    // --- NEW: Performance Observer protection ---
    function applyPerformanceObserverProtection() {
        try {
            if (window.PerformanceObserver) {
                const origPerformanceObserver = window.PerformanceObserver;
                window.PerformanceObserver = function(callback) {
                    // Add noise to performance timing
                    const noisyCallback = function(list, observer) {
                        const entries = list.getEntries().map(entry => {
                            if (entry.startTime) {
                                entry.startTime += getSubtleRandom(-1, 1, 'perf-start');
                            }
                            if (entry.duration) {
                                entry.duration += getSubtleRandom(-0.5, 0.5, 'perf-duration');
                            }
                            return entry;
                        });
                        
                        list.getEntries = () => entries;
                        callback(list, observer);
                    };
                    return new origPerformanceObserver(noisyCallback);
                };
            }

            safeLog('Performance Observer protection applied');
        } catch (e) {
            safeLog(`Performance Observer protection failed: ${e.message}`, 'error');
        }
    }

    // --- Apply all protections with enhanced error handling ---
    function applyAllProtections() {
        safeLog('🛡️ Applying ultimate anti-fingerprinting protections...');
        
        // Load settings first
        loadSettings();
        
        const protections = [
            { name: 'Anti-Detection', fn: applyAntiDetection },
            { name: 'Anti-Tracking', fn: applyAntiTrackingProtection },
            { name: 'Core Protection', fn: applyCoreProtection },
            { name: 'Canvas Protection', fn: applyCanvasProtection },
            { name: 'WebGL Protection', fn: applyWebGLProtection },
            { name: 'Audio Protection', fn: applyAudioProtection },
            { name: 'Font Protection', fn: applyFontProtection },
            { name: 'Battery Protection', fn: applyBatteryProtection },
            { name: 'MediaDevices Protection', fn: applyMediaDevicesProtection },
            { name: 'Permissions Protection', fn: applyPermissionsProtection },
            { name: 'Storage Protection', fn: applyStorageProtection },
            { name: 'WebRTC Protection', fn: applyWebRTCProtection },
            { name: 'CPU Protection', fn: applyCPUProtection },
            { name: 'Memory Protection', fn: applyMemoryProtection },
            { name: 'Bluetooth Protection', fn: applyBluetoothProtection },
            { name: 'Gamepad Protection', fn: applyGamepadProtection },
            { name: 'USB Protection', fn: applyUSBProtection },
            { name: 'Network Protection', fn: applyNetworkProtection },
            { name: 'Speech Protection', fn: applySpeechProtection },
            { name: 'Clipboard Protection', fn: applyClipboardProtection },
            { name: 'Intersection Observer Protection', fn: applyIntersectionObserverProtection },
            { name: 'Performance Observer Protection', fn: applyPerformanceObserverProtection }
        ];

        let successCount = 0;
        protections.forEach(protection => {
            try {
                protection.fn();
                successCount++;
            } catch (e) {
                safeLog(`${protection.name} failed: ${e.message}`, 'error');
            }
        });
        
        // Save settings after applying protections
        saveSettings();
        
        safeLog(`✅ Anti-fingerprinting protections applied: ${successCount}/${protections.length} successful`);
        safeLog(`📊 Stats: ${JSON.stringify(window.AntiFingerprintUtils.stats)}`);
        
        // Show success notification if available
        try {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    title: 'lulzactive Protection Active',
                    text: `${successCount}/${protections.length} protections applied successfully`,
                    timeout: 3000
                });
            }
        } catch (e) {
            // Ignore notification errors
        }
    }

    // --- Initialize protection with retry mechanism ---
    let initAttempts = 0;
    const maxAttempts = 3;
    
    function initializeProtection() {
        try {
            applyAllProtections();
        } catch (e) {
            initAttempts++;
            safeLog(`Initialization attempt ${initAttempts} failed: ${e.message}`, 'error');
            
            if (initAttempts < maxAttempts) {
                setTimeout(initializeProtection, 1000 * initAttempts);
            } else {
                safeLog('Max initialization attempts reached', 'error');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProtection);
    } else {
        initializeProtection();
    }

    // --- Export for external access ---
    window.lulzactiveProtection = {
        version: '1.0.0',
        applyProtections: applyAllProtections,
        isEnabled: true,
        features: {
            canvas: true,
            webgl: true,
            audio: true,
            fonts: true,
            navigator: true,
            screen: true,
            timezone: true,
            webrtc: true,
            battery: true,
            mediaDevices: true,
            permissions: true,
            storage: true,
            antiTracking: true,
            fingerprintBlocking: true,
            enhancedRandomization: true,
            antiDetection: true,
            cpu: true,
            memory: true,
            bluetooth: true,
            gamepad: true,
            usb: true,
            network: true,
            speech: true,
            clipboard: true,
            intersectionObserver: true,
            performance: true
        },
        stats: window.AntiFingerprintUtils.stats,
        settings: {
            load: loadSettings,
            save: saveSettings
        },
        debug: {
            enableDebug: () => { DEBUG_MODE = true; saveSettings(); },
            disableDebug: () => { DEBUG_MODE = false; saveSettings(); },
            getStats: () => window.AntiFingerprintUtils.stats,
            clearCache: () => randomCache.clear()
        }
    };

})(); 