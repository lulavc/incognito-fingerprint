// Shared utilities for anti-fingerprinting protection
// Used by both extension and userscript for consistent spoofing

(function() {
    'use strict';

    // --- Feature toggles ---
    const PARANOID_CANVAS = false; // true = always blank canvas (paranoid mode)
    const ROUND_SCREEN = false;    // true = round screen size to nearest 100
    const FONT_RANDOMIZE = true;   // true = randomize measureText width
    const CANVAS_TEXT_RANDOMIZE = true; // true = randomize fillText/strokeText/rects

    // --- Chrome/Windows profile (all common values) ---
    const profile = {
        id: 'Chrome 120 - Win10',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        platform: 'Win32',
        language: 'en-US',
        screenWidth: 1920,
        screenHeight: 1080,
        cores: 8,
        memory: 8, // Most common value
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
        plugins: [
            { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
            { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai', description: '' },
            { name: 'Native Client', filename: 'internal-nacl-plugin', description: '' }
        ]
    };

    // --- Utility: safe spoof property ---
    function spoof(obj, prop, valueFn) {
        try {
            Object.defineProperty(obj, prop, {
                get: valueFn,
                configurable: true
            });
        } catch (e) {}
    }

    // --- Core fingerprinting protection ---
    function applyCoreProtection() {
        // Navigator properties with enhanced randomization
        spoof(navigator, 'userAgent', () => profile.userAgent);
        spoof(navigator, 'platform', () => profile.platform);
        spoof(navigator, 'language', () => profile.language);
        spoof(navigator, 'languages', () => [profile.language, 'en']);
        spoof(navigator, 'hardwareConcurrency', () => profile.cores);
        spoof(navigator, 'deviceMemory', () => profile.memory);
        spoof(navigator, 'vendor', () => profile.vendor);
        spoof(navigator, 'productSub', () => profile.productSub);
        spoof(navigator, 'appVersion', () => profile.appVersion);
        spoof(navigator, 'appName', () => profile.appName);
        spoof(navigator, 'doNotTrack', () => profile.doNotTrack);
        spoof(navigator, 'maxTouchPoints', () => profile.maxTouchPoints);
        spoof(navigator, 'plugins', () => profile.plugins);

        // Enhanced navigator properties with randomization
        spoof(navigator, 'cookieEnabled', () => true);
        spoof(navigator, 'onLine', () => true);
        spoof(navigator, 'javaEnabled', () => false);
        
        // Randomize connection properties to make them less unique
        if (navigator.connection) {
            Object.defineProperty(navigator, 'connection', {
                get: () => ({
                    effectiveType: ['4g', '3g'][Math.floor(Math.random() * 2)],
                    rtt: 50 + Math.floor(Math.random() * 100),
                    downlink: 5 + Math.floor(Math.random() * 15),
                    saveData: Math.random() > 0.8
                }),
                configurable: true
            });
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

        // Enhanced timezone spoofing with randomization
        if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
            const orig = Intl.DateTimeFormat.prototype.resolvedOptions;
            Intl.DateTimeFormat.prototype.resolvedOptions = function () {
                const options = orig.call(this);
                options.timeZone = profile.timezone;
                // Add subtle randomization to timezone offset
                if (options.timeZoneName) {
                    options.timeZoneName = 'short';
                }
                return options;
            };
        }

        // Randomize Date methods to make timing less unique
        const origGetTimezoneOffset = Date.prototype.getTimezoneOffset;
        Date.prototype.getTimezoneOffset = function() {
            const offset = origGetTimezoneOffset.call(this);
            // Add ±1 minute randomization to make it less unique
            return offset + (Math.floor(Math.random() * 3) - 1);
        };
    }

    // --- Canvas protection ---
    function applyCanvasProtection() {
        if (!window.HTMLCanvasElement) return;

        if (PARANOID_CANVAS) {
            // Always return a blank image (paranoid mode)
            const blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89PwGHwAFYAJm6ocdgAAAABJRU5ErkJggg==';
            HTMLCanvasElement.prototype.toDataURL = function() { return blank; };
            HTMLCanvasElement.prototype.toBlob = function(cb) {
                const byteString = atob(blank.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
                cb(new Blob([ab], {type: 'image/png'}));
            };
        } else {
            // Enhanced canvas fingerprinting protection with common fingerprints
            const commonCanvasHashes = [
                'a04f2157cf2cbe1aa19bacdc78d6b10a', // Common hash
                'b04f2157cf2cbe1aa19bacdc78d6b10b', // Variant 1
                'c04f2157cf2cbe1aa19bacdc78d6b10c', // Variant 2
                'd04f2157cf2cbe1aa19bacdc78d6b10d', // Variant 3
                'e04f2157cf2cbe1aa19bacdc78d6b10e'  // Variant 4
            ];
            
            const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {
                const ctx = this.getContext('2d');
                if (ctx) {
                    const { width, height } = this;
                    try {
                        const imgData = ctx.getImageData(0, 0, width, height);
                        // Use more subtle randomization to match common fingerprints
                        for (let i = 0; i < imgData.data.length; i += 4) {
                            // Add very subtle noise that matches common patterns
                            const noise = Math.random() > 0.5 ? 1 : -1;
                            imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
                            imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + noise));
                            imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + noise));
                        }
                        ctx.putImageData(imgData, 0, 0);
                    } catch (e) {}
                }
                return origToDataURL.apply(this, arguments);
            };

            // Also randomize getImageData
            const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
                const imgData = origGetImageData.call(this, x, y, w, h);
                // Add subtle randomization to getImageData as well
                for (let i = 0; i < imgData.data.length; i += 4) {
                    imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + (Math.random() > 0.5 ? 1 : -1)));
                    imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + (Math.random() > 0.5 ? 1 : -1)));
                    imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + (Math.random() > 0.5 ? 1 : -1)));
                }
                return imgData;
            };

            // Enhanced canvas text/rect randomization
            if (CANVAS_TEXT_RANDOMIZE) {
                const methods = ['fillText', 'strokeText', 'fillRect', 'strokeRect', 'clearRect'];
                methods.forEach(method => {
                    const orig = CanvasRenderingContext2D.prototype[method];
                    CanvasRenderingContext2D.prototype[method] = function(...args) {
                        if (method.includes('Text')) {
                            // Add more subtle randomization for text positioning
                            args[1] += (Math.random() - 0.5) * 0.3; // X position ±0.15
                            args[2] += (Math.random() - 0.5) * 0.3; // Y position ±0.15
                        } else if (method.includes('Rect')) {
                            // Add more subtle randomization for rectangles
                            args[0] += (Math.random() - 0.5) * 0.3; // X position ±0.15
                            args[1] += (Math.random() - 0.5) * 0.3; // Y position ±0.15
                            if (args.length > 2) args[2] *= 1 + (Math.random() - 0.5) * 0.005; // W ±0.25%
                            if (args.length > 3) args[3] *= 1 + (Math.random() - 0.5) * 0.005; // H ±0.25%
                        }
                        return orig.apply(this, args);
                    };
                });
            }
        }

        // Enhanced font fingerprinting: randomize measureText width
        if (FONT_RANDOMIZE && window.CanvasRenderingContext2D) {
            const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
            CanvasRenderingContext2D.prototype.measureText = function() {
                const result = origMeasureText.apply(this, arguments);
                // Add more subtle randomization to make it less unique
                result.width = result.width * (1 + (Math.random() - 0.5) * 0.005); // ±0.25% noise
                return result;
            };
        }
    }

    // --- WebGL protection ---
    function applyWebGLProtection() {
        if (!window.WebGLRenderingContext) return;

        // Enhanced WebGL protection with common fingerprints
        const origGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(param) {
            // 37445: UNMASKED_VENDOR_WEBGL, 37446: UNMASKED_RENDERER_WEBGL
            if (param === 37445) return profile.webglVendor;
            if (param === 37446) return profile.webglRenderer;
            
            // 0x1F00: VENDOR, 0x1F01: RENDERER - also spoof these for compatibility
            if (param === 0x1F00) return profile.webglVendor;
            if (param === 0x1F01) return profile.webglRenderer;
            
            // Add randomization to other WebGL parameters to make them less unique
            const result = origGetParameter.call(this, param);
            
            // Randomize certain parameters that contribute to uniqueness
            if (typeof result === 'number' && (param === 0x1F00 || param === 0x1F01 || param === 0x1F02)) {
                // ALIASED_LINE_WIDTH_RANGE, ALIASED_POINT_SIZE_RANGE, ALIASED_POINT_SIZE_GRANULARITY
                return result + (Math.random() - 0.5) * 0.1;
            }
            
            // Make WebGL extensions less unique by randomizing order
            if (param === 0x1F03) { // EXTENSIONS
                const extensions = result;
                if (extensions && extensions.length > 0) {
                    return extensions.sort(() => Math.random() - 0.5);
                }
            }
            
            return result;
        };

        // Also protect HTMLCanvasElement.getContext for WebGL
        if (window.HTMLCanvasElement) {
            const origGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                const context = origGetContext.call(this, contextType, contextAttributes);
                
                // If it's a WebGL context, ensure our protection is applied
                if (context && (contextType === 'webgl' || contextType === 'webgl2')) {
                    // The getParameter method should already be overridden, but let's make sure
                    if (DEBUG_MODE) {
                        console.log('lulzactive: WebGL context created, vendor will be spoofed to:', profile.webglVendor);
                    }
                }
                
                return context;
            };
        }

        // Enhanced randomization of shader precision
        const origGetShaderPrecisionFormat = WebGLRenderingContext.prototype.getShaderPrecisionFormat;
        WebGLRenderingContext.prototype.getShaderPrecisionFormat = function() {
            const res = origGetShaderPrecisionFormat.apply(this, arguments);
            if (res && typeof res.precision === 'number') {
                // Add subtle randomization to make it less unique
                res.precision += Math.floor(Math.random() * 3) - 1; // ±1 precision
            }
            return res;
        };

        // Randomize WebGL extensions to make them less unique
        const origGetSupportedExtensions = WebGLRenderingContext.prototype.getSupportedExtensions;
        WebGLRenderingContext.prototype.getSupportedExtensions = function() {
            const extensions = origGetSupportedExtensions.call(this);
            // Add subtle randomization to extension order
            if (extensions && extensions.length > 0) {
                return extensions.sort(() => Math.random() - 0.5);
            }
            return extensions;
        };
    }

    // --- Audio protection ---
    function applyAudioProtection() {
        try {
            if (window.AudioContext) {
                const origSampleRate = Object.getOwnPropertyDescriptor(AudioContext.prototype, 'sampleRate');
                Object.defineProperty(AudioContext.prototype, 'sampleRate', {
                    get: function() { return 48000; },
                    configurable: true
                });
            }
        } catch (e) {}
    }

    // --- Font protection ---
    function applyFontProtection() {
        const winFonts = [
            'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS',
            'Consolas', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
            'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe UI', 'Tahoma', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Symbol', 'Wingdings'
        ];

        if (document.fonts && typeof document.fonts.check === 'function') {
            const origCheck = document.fonts.check.bind(document.fonts);
            document.fonts.check = (fontSpec, text) => {
                // Add randomization to make font detection less unique
                const hasFont = winFonts.some(font => fontSpec.includes(font)) || origCheck(fontSpec, text);
                // Add 5% chance of false positive to make it less unique
                return hasFont || Math.random() < 0.05;
            };
        }

        // Enhanced font enumeration protection
        if (document.fonts && typeof document.fonts.ready === 'object') {
            const origReady = document.fonts.ready;
            Object.defineProperty(document.fonts, 'ready', {
                get: () => Promise.resolve(),
                configurable: true
            });
        }

        // Randomize font loading events
        if (document.fonts && typeof document.fonts.addEventListener === 'function') {
            const origAddEventListener = document.fonts.addEventListener;
            document.fonts.addEventListener = function(type, listener, options) {
                // Add subtle randomization to font loading events
                const wrappedListener = function(event) {
                    // Add small delay to make timing less unique
                    setTimeout(() => listener.call(this, event), Math.random() * 10);
                };
                return origAddEventListener.call(this, type, wrappedListener, options);
            };
        }
    }

    // --- Additional protections ---
    function applyAdditionalProtections() {
        // Permissions API
        if ('permissions' in navigator) {
            const origQuery = navigator.permissions.query;
            navigator.permissions.query = function () {
                return Promise.resolve({ state: 'granted' });
            };
        }

        // MediaDevices
        spoof(navigator, 'mediaDevices', () => ({ enumerateDevices: () => Promise.resolve([]) }));

        // Storage API
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate = () => Promise.resolve({ usage: 5242880, quota: 1073741824 });
        }

        // MatchMedia
        if (window.matchMedia) {
            const origMatchMedia = window.matchMedia;
            window.matchMedia = function(query) {
                if (query.includes('color-scheme')) {
                    return { matches: Math.random() > 0.5, media: query };
                }
                return origMatchMedia.call(this, query);
            };
        }

        // SharedArrayBuffer
        spoof(window, 'SharedArrayBuffer', () => undefined);

        // Document referrer
        Object.defineProperty(document, 'referrer', {
            get: () => "",
            configurable: true
        });

        // Window name
        window.name = "";
    }

    // --- Anti-tracking protection ---
    function applyAntiTrackingProtection() {
        const blockedTrackers = [
            // Google
            "google-analytics.com", "googletagmanager.com", "googleadservices.com", "doubleclick.net", "adservice.google.com",
            "pagead2.googlesyndication.com", "adclick.g.doubleclick.net", "gstatic.com/ads", "googlesyndication.com",
            // Facebook
            "facebook.com/tr", "facebook.net", "connect.facebook.net", "fbcdn.net", "fb.com", "fbsbx.com",
            // Microsoft/Bing
            "bat.bing.com", "bing.com/fd/ls", "clarity.ms",
            // Twitter/X
            "analytics.twitter.com", "t.co/i/adsct", "static.ads-twitter.com",
            // TikTok
            "analytics.tiktok.com", "business.tiktok.com", "ads.tiktok.com",
            // Amazon
            "aax.amazon-adsystem.com", "amazon-adsystem.com",
            // Other ad/trackers
            "scorecardresearch.com", "hotjar.com", "mixpanel.com", "matomo.org", "quantserve.com", "adroll.com",
            "criteo.com", "adnxs.com", "taboola.com", "outbrain.com", "zedo.com", "yandex.ru/metrika", "yandex.net",
            "newrelic.com", "segment.com", "optimizely.com", "bluekai.com", "adform.net", "openx.net", "rubiconproject.com",
            "moatads.com", "smartadserver.com", "pubmatic.com", "casalemedia.com", "advertising.com", "ml314.com",
            "yieldmo.com", "bidswitch.net", "gumgum.com", "eyeota.net", "adition.com", "adscale.de", "adspirit.de",
            "adtech.de", "bidr.io"
        ];

        function isTracker(url) {
            return blockedTrackers.some(domain => url.includes(domain));
        }

        // Block XMLHttpRequest
        const origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (isTracker(url)) {
                console.warn("Blocked tracker (XHR):", url);
                return;
            }
            return origOpen.apply(this, arguments);
        };

        // Block fetch
        const origFetch = window.fetch;
        window.fetch = function(input, init) {
            const url = typeof input === "string" ? input : input.url;
            if (isTracker(url)) {
                console.warn("Blocked tracker (fetch):", url);
                return new Promise(() => {});
            }
            return origFetch.apply(this, arguments);
        };

        // Block image/script tags
        const origCreateElement = document.createElement;
        document.createElement = function(tagName, options) {
            const el = origCreateElement.call(this, tagName, options);
            if (["img", "script", "iframe"].includes(tagName.toLowerCase())) {
                const origSetAttribute = el.setAttribute;
                el.setAttribute = function(name, value) {
                    if ((name === "src" || name === "data-src") && isTracker(value)) {
                        console.warn("Blocked tracker (element):", value);
                        return;
                    }
                    return origSetAttribute.apply(this, arguments);
                };
            }
            return el;
        };

        // Block sendBeacon
        try {
            navigator.sendBeacon = function() { return true; };
            window.sendBeacon = function() { return true; };
        } catch (e) {}

        // Block or spoof Battery API
        if (navigator.getBattery) {
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

        // Block or spoof Network Information API
        if (navigator.connection) {
            Object.defineProperty(navigator, 'connection', {
                get: () => ({
                    effectiveType: '4g',
                    rtt: 50,
                    downlink: 10,
                    saveData: false
                }),
                configurable: true
            });
        }
    }

    // --- Main application function ---
    function applyAllProtections() {
        applyCoreProtection();
        applyCanvasProtection();
        applyWebGLProtection();
        applyAudioProtection();
        applyFontProtection();
        applyAdditionalProtections();
        applyAntiTrackingProtection();
    }

    // --- Export for use in other scripts ---
    window.AntiFingerprintUtils = {
        profile,
        applyAllProtections,
        applyCoreProtection,
        applyCanvasProtection,
        applyWebGLProtection,
        applyAudioProtection,
        applyFontProtection,
        applyAdditionalProtections,
        applyAntiTrackingProtection,
        spoof,
        setDebugMode: function(enabled) {
            DEBUG_MODE = enabled;
            if (enabled) {
                console.log('lulzactive: Debug mode enabled');
            }
        },
        getStats: function() {
            return {
                protections: {
                    core: true,
                    canvas: true,
                    webgl: true,
                    audio: true,
                    font: true,
                    antiTracking: true
                },
                profile: profile,
                debugMode: DEBUG_MODE
            };
        }
    };

    // --- Auto-apply if this script is loaded directly ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllProtections);
    } else {
        applyAllProtections();
    }

})(); 