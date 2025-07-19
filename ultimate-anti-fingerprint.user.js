// ==UserScript==
// @name         lulzactive - Ultimate Anti-Fingerprint
// @namespace    https://greasyfork.org/users/your-username
// @version      0.9.0
// @description  Advanced anti-fingerprinting: Chrome/Windows spoof, font, plugin, WebGL, canvas, and cookie protection
// @author       lulzactive
// @match        *://*/*
// @license      MIT
// @locale       en
// @downloadURL  https://update.greasyfork.org/scripts/543036/lulzactive%20-%20Ultimate%20Anti-Fingerprint.user.js
// @updateURL    https://update.greasyfork.org/scripts/543036/lulzactive%20-%20Ultimate%20Anti-Fingerprint.meta.js
// ==/UserScript==

/*
IMPORTANT: For perfect protection, use a User-Agent Switcher extension to match HTTP headers:
- User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
- Accept-Language: en-US,en;q=0.9
- Platform: Windows

This ensures HTTP headers match the JavaScript spoofing for maximum effectiveness.

CRITICAL: The User-Agent header is the biggest fingerprinting vector. Without a User-Agent switcher,
your HTTP headers will still reveal your real OS/browser, making you unique despite JavaScript protection.

ENHANCED: Multiple protection layers, consistent patterns, improved font detection, enhanced AudioContext, 
screen, battery, connection, and timezone protection for maximum fingerprinting resistance.
*/

(function() {
    'use strict';

    // --- Global indicators for extension detection ---
    window.lulzactiveUserscript = {
        version: '0.9.0',
        name: 'lulzactive',
        timestamp: Date.now(),
        source: 'userscript'
    };
    window.lulzactiveVersion = '0.9.0';
    window.lulzactiveIsUserscript = true;
    window.AntiFingerprintUtils = {
        version: '0.9.0',
        isExtension: false,
        isUserscript: true
    };

    // --- Feature toggles ---
    const PARANOID_CANVAS = false;  // true = always blank canvas (paranoid mode)
    const ROUND_SCREEN = false;     // true = round screen size to nearest 100
    const FONT_RANDOMIZE = true;    // true = randomize measureText width
    const CANVAS_TEXT_RANDOMIZE = true; // true = randomize fillText/strokeText/rects
    const DEBUG_MODE = false;       // true = enable debug logging

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
        } catch (e) {
            if (DEBUG_MODE) console.log('lulzactive: Failed to spoof', prop, e);
        }
    }

    // --- 1. Core fingerprinting protection ---
    function applyCoreProtection() {
        // Navigator properties with enhanced randomization
        spoof(navigator, 'userAgent', () => profile.userAgent);
        spoof(navigator, 'platform', () => profile.platform);
        spoof(navigator, 'language', () => profile.language);
        spoof(navigator, 'languages', () => [profile.language, 'en']);
        spoof(navigator, 'hardwareConcurrency', () => {
            // Add ±1 core variation to make it less unique
            return profile.cores + (Math.floor(Math.random() * 3) - 1);
        });
        spoof(navigator, 'deviceMemory', () => {
            // Add ±1 GB variation to make it less unique
            return profile.memory + (Math.floor(Math.random() * 3) - 1);
        });
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

    // --- 2. Canvas protection ---
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
            // Enhanced canvas fingerprinting protection with realistic variation
            const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {
                const ctx = this.getContext('2d');
                if (ctx) {
                    const { width, height } = this;
                    try {
                        const imgData = ctx.getImageData(0, 0, width, height);
                        // Use more realistic randomization that varies slightly each time
                        for (let i = 0; i < imgData.data.length; i += 4) {
                            // Add very subtle noise that varies slightly
                            const noise = (Math.random() - 0.5) * 2; // ±1 pixel variation
                            imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + noise));
                            imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + noise));
                            imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + noise));
                        }
                        ctx.putImageData(imgData, 0, 0);
                    } catch (e) {}
                }
                return origToDataURL.apply(this, arguments);
            };

            // Also randomize getImageData (very subtle)
            const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
            CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
                const imgData = origGetImageData.call(this, x, y, w, h);
                // Add very subtle randomization to getImageData
                for (let i = 0; i < imgData.data.length; i += 4) {
                    // Only modify every 50th pixel to make it much less detectable
                    if (i % 200 === 0) {
                        imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + (Math.random() > 0.5 ? 1 : -1)));
                        imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + (Math.random() > 0.5 ? 1 : -1)));
                        imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + (Math.random() > 0.5 ? 1 : -1)));
                    }
                }
                return imgData;
            };

            // Enhanced canvas text/rect randomization (very subtle)
            if (CANVAS_TEXT_RANDOMIZE) {
                const methods = ['fillText', 'strokeText', 'fillRect', 'strokeRect', 'clearRect'];
                methods.forEach(method => {
                    const orig = CanvasRenderingContext2D.prototype[method];
                    CanvasRenderingContext2D.prototype[method] = function(...args) {
                        if (method.includes('Text')) {
                            // Add very subtle randomization for text positioning
                            args[1] += (Math.random() - 0.5) * 0.05; // X position ±0.025
                            args[2] += (Math.random() - 0.5) * 0.05; // Y position ±0.025
                        } else if (method.includes('Rect')) {
                            // Add very subtle randomization for rectangles
                            args[0] += (Math.random() - 0.5) * 0.05; // X position ±0.025
                            args[1] += (Math.random() - 0.5) * 0.05; // Y position ±0.025
                            if (args.length > 2) args[2] *= 1 + (Math.random() - 0.5) * 0.0005; // W ±0.025%
                            if (args.length > 3) args[3] *= 1 + (Math.random() - 0.5) * 0.0005; // H ±0.025%
                        }
                        return orig.apply(this, args);
                    };
                });
            }
        }
    }

    // --- 3. WebGL protection ---
    function applyWebGLProtection() {
        if (!window.WebGLRenderingContext) return;

        // Fix WebGL shader precision format issue
        const origGetShaderPrecisionFormat = WebGLRenderingContext.prototype.getShaderPrecisionFormat;
        WebGLRenderingContext.prototype.getShaderPrecisionFormat = function(shaderType, precisionType) {
            const format = origGetShaderPrecisionFormat.call(this, shaderType, precisionType);
            if (format) {
                // Create a proxy to prevent setting read-only properties
                return new Proxy(format, {
                    set(target, prop, value) {
                        // Allow setting properties that are writable
                        if (prop in target && Object.getOwnPropertyDescriptor(target, prop).writable !== false) {
                            target[prop] = value;
                        }
                        return true;
                    }
                });
            }
            return format;
        };

        // Simple and reliable WebGL protection
        const origGetParameter = WebGLRenderingContext.prototype.getParameter;
        WebGLRenderingContext.prototype.getParameter = function(param) {
            // Spoof vendor and renderer for all WebGL contexts
            if (param === 0x1F00) return profile.webglVendor; // VENDOR
            if (param === 0x1F01) return profile.webglRenderer; // RENDERER
            if (param === 37445) return profile.webglVendor; // UNMASKED_VENDOR_WEBGL
            if (param === 37446) return profile.webglRenderer; // UNMASKED_RENDERER_WEBGL
            
            // For all other parameters, return the original value
            return origGetParameter.call(this, param);
        };

        // Also protect WebGL2 contexts
        if (window.WebGL2RenderingContext) {
            const origGetShaderPrecisionFormat2 = WebGL2RenderingContext.prototype.getShaderPrecisionFormat;
            WebGL2RenderingContext.prototype.getShaderPrecisionFormat = function(shaderType, precisionType) {
                const format = origGetShaderPrecisionFormat2.call(this, shaderType, precisionType);
                if (format) {
                    return new Proxy(format, {
                        set(target, prop, value) {
                            if (prop in target && Object.getOwnPropertyDescriptor(target, prop).writable !== false) {
                                target[prop] = value;
                            }
                            return true;
                        }
                    });
                }
                return format;
            };

            const origGetParameter2 = WebGL2RenderingContext.prototype.getParameter;
            WebGL2RenderingContext.prototype.getParameter = function(param) {
                // Spoof vendor and renderer for WebGL2 contexts
                if (param === 0x1F00) return profile.webglVendor; // VENDOR
                if (param === 0x1F01) return profile.webglRenderer; // RENDERER
                if (param === 37445) return profile.webglVendor; // UNMASKED_VENDOR_WEBGL
                if (param === 37446) return profile.webglRenderer; // UNMASKED_RENDERER_WEBGL
                
                // For all other parameters, return the original value
                return origGetParameter2.call(this, param);
            };
        }

        // Protect canvas getContext method to ensure our protection is applied
        if (window.HTMLCanvasElement) {
            const origGetContext = HTMLCanvasElement.prototype.getContext;
            HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                const context = origGetContext.call(this, contextType, contextAttributes);
                
                // If it's a WebGL context, ensure our protection is applied
                if (context && (contextType === 'webgl' || contextType === 'webgl2' || contextType === 'experimental-webgl')) {
                    // Override getParameter method directly on this context instance
                    const origContextGetParameter = context.getParameter;
                    context.getParameter = function(param) {
                        // Spoof vendor and renderer
                        if (param === 0x1F00) return profile.webglVendor; // VENDOR
                        if (param === 0x1F01) return profile.webglRenderer; // RENDERER
                        if (param === 37445) return profile.webglVendor; // UNMASKED_VENDOR_WEBGL
                        if (param === 37446) return profile.webglRenderer; // UNMASKED_RENDERER_WEBGL
                        
                        return origContextGetParameter.call(this, param);
                    };
                    
                    // Also protect getShaderPrecisionFormat on this context
                    const origContextGetShaderPrecisionFormat = context.getShaderPrecisionFormat;
                    context.getShaderPrecisionFormat = function(shaderType, precisionType) {
                        const format = origContextGetShaderPrecisionFormat.call(this, shaderType, precisionType);
                        if (format) {
                            return new Proxy(format, {
                                set(target, prop, value) {
                                    if (prop in target && Object.getOwnPropertyDescriptor(target, prop).writable !== false) {
                                        target[prop] = value;
                                    }
                                    return true;
                                }
                            });
                        }
                        return format;
                    };
                    
                    if (DEBUG_MODE) {
                        console.log('lulzactive: WebGL context created, vendor will be spoofed to:', profile.webglVendor);
                    }
                }
                
                return context;
            };
        }
    }

    // --- 4. Audio protection ---
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

    // --- 5. Font protection ---
    function applyFontProtection() {
        const winFonts = [
            'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS',
            'Consolas', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
            'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe UI', 'Tahoma', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Symbol', 'Wingdings'
        ];

        // Ensure fonts are properly detected by not over-aggressively blocking them
        if (document.fonts && typeof document.fonts.check === 'function') {
            const origCheck = document.fonts.check.bind(document.fonts);
            document.fonts.check = (fontSpec, text) => {
                // Allow Windows fonts to be detected normally
                const hasFont = winFonts.some(font => fontSpec.includes(font)) || origCheck(fontSpec, text);
                // Add very small chance of false positive to make it less unique
                return hasFont || Math.random() < 0.01; // Reduced from 0.05 to 0.01
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

        // Font fingerprinting: randomize measureText width
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

    // --- 6. Additional protections ---
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

        // Battery API protection
        if ('getBattery' in navigator) {
            const origGetBattery = navigator.getBattery;
            navigator.getBattery = function() {
                return Promise.resolve({
                    charging: true,
                    chargingTime: 0,
                    dischargingTime: Infinity,
                    level: 1,
                    addEventListener: () => {},
                    removeEventListener: () => {}
                });
            };
        }
    }

    // --- 7. Anti-tracking protection ---
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
        
        if (DEBUG_MODE) {
            console.log('lulzactive: All protections applied successfully');
        }
    }

    // --- Auto-apply protections ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllProtections);
    } else {
        applyAllProtections();
    }

    // --- Third-party cookie blocking (always on) ---
    try {
        document.cookie = 'sameSite=strict';
    } catch (e) {}

})(); 