// Shared utilities for anti-fingerprinting protection
// Used by both extension and userscript for consistent spoofing

(function() {
    'use strict';

    // --- Global indicators for extension detection ---
    window.lulzactiveExtension = {
        version: '0.10.0',
        name: 'lulzactive',
        timestamp: Date.now(),
        source: 'extension'
    };
    window.lulzactiveVersion = '0.10.0';
    window.lulzactiveIsExtension = true;
    window.AntiFingerprintUtils = {
        version: '0.10.0',
        isExtension: true,
        isUserscript: false,
        protectionLevel: 'advanced',
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
            storage: true
        }
    };

    // --- Feature toggles (sync with userscript) ---
    const PARANOID_CANVAS = false;  // true = always blank canvas (paranoid mode)
    const ROUND_SCREEN = false;     // true = round screen size to nearest 100
    const FONT_RANDOMIZE = true;    // true = randomize measureText width
    const CANVAS_TEXT_RANDOMIZE = true; // true = randomize fillText/strokeText/rects
    const ENHANCED_RANDOMIZATION = true; // true = use enhanced randomization
    const ANTI_DETECTION = true;    // true = enable anti-detection measures
    let DEBUG_MODE = false;         // true = enable debug logging

    // --- Chrome/Windows profile (sync with userscript) ---
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

    // --- Enhanced randomization utilities ---
    function getSubtleRandom(min, max) {
        if (!ENHANCED_RANDOMIZATION) return Math.floor(Math.random() * (max - min + 1)) + min;
        // Use more subtle randomization that's less detectable
        const base = Math.floor(Math.random() * (max - min + 1)) + min;
        const variation = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(min, Math.min(max, base + variation));
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

    // --- Utility: safe spoof property ---
    function spoof(obj, prop, valueFn) {
        try {
            Object.defineProperty(obj, prop, {
                get: valueFn,
                configurable: true,
                enumerable: true
            });
        } catch (e) {
            if (DEBUG_MODE) console.log('Failed to spoof', prop, e);
        }
    }

    // --- Enhanced anti-detection measures ---
    function applyAntiDetection() {
        if (!ANTI_DETECTION) return;

        // Hide our spoofing from detection scripts
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            // Don't allow detection of our spoofed properties
            if (prop === 'userAgent' || prop === 'platform' || prop === 'webdriver') {
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };

        // Hide our global objects from detection
        Object.defineProperty(window, 'lulzactiveExtension', {
            configurable: false,
            enumerable: false,
            writable: false
        });

        // Prevent detection of our script injection
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
            const str = originalToString.call(this);
            if (str.includes('lulzactive') || str.includes('AntiFingerprint')) {
                return 'function() { [native code] }';
            }
            return str;
        };
    }

    // --- Core fingerprinting protection ---
    function applyCoreProtection() {
        // Navigator properties with enhanced randomization
        spoof(navigator, 'userAgent', () => profile.userAgent);
        spoof(navigator, 'platform', () => profile.platform);
        spoof(navigator, 'language', () => profile.language);
        spoof(navigator, 'languages', () => [profile.language, 'en']);
        spoof(navigator, 'hardwareConcurrency', () => {
            return profile.cores + getSubtleRandom(-1, 1);
        });
        spoof(navigator, 'deviceMemory', () => {
            return profile.memory + getSubtleRandom(-1, 1);
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
                    rtt: 50 + getSubtleRandom(0, 100),
                    downlink: 5 + getSubtleRandom(0, 15),
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
            return offset + getSubtleRandom(-1, 1);
        };
    }

    // --- Enhanced Canvas protection ---
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

            // Also randomize getImageData (more subtle)
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

            // Enhanced text/rect randomization
            if (CANVAS_TEXT_RANDOMIZE) {
                const origFillText = CanvasRenderingContext2D.prototype.fillText;
                const origStrokeText = CanvasRenderingContext2D.prototype.strokeText;
                const origFillRect = CanvasRenderingContext2D.prototype.fillRect;
                const origStrokeRect = CanvasRenderingContext2D.prototype.strokeRect;

                CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
                    const offset = getSubtleRandom(-1, 1);
                    return origFillText.call(this, text, x + offset, y + offset, maxWidth);
                };

                CanvasRenderingContext2D.prototype.strokeText = function(text, x, y, maxWidth) {
                    const offset = getSubtleRandom(-1, 1);
                    return origStrokeText.call(this, text, x + offset, y + offset, maxWidth);
                };

                CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
                    const offset = getSubtleRandom(-1, 1);
                    return origFillRect.call(this, x + offset, y + offset, width, height);
                };

                CanvasRenderingContext2D.prototype.strokeRect = function(x, y, width, height) {
                    const offset = getSubtleRandom(-1, 1);
                    return origStrokeRect.call(this, x + offset, y + offset, width, height);
                };
            }
        }
    }

    // --- Enhanced WebGL protection ---
    function applyWebGLProtection() {
        if (!window.WebGLRenderingContext) return;

        // Enhanced WebGL parameter proxying with shader precision format fix
        const webglParams = {
            'MAX_TEXTURE_SIZE': 16384,
            'MAX_VIEWPORT_DIMS': [16384, 16384],
            'MAX_RENDERBUFFER_SIZE': 16384,
            'MAX_VERTEX_UNIFORM_VECTORS': 4096,
            'MAX_FRAGMENT_UNIFORM_VECTORS': 1024,
            'MAX_VERTEX_ATTRIBS': 16,
            'MAX_VERTEX_TEXTURE_IMAGE_UNITS': 16,
            'MAX_TEXTURE_IMAGE_UNITS': 16,
            'MAX_COMBINED_TEXTURE_IMAGE_UNITS': 32,
            'MAX_VERTEX_OUTPUT_COMPONENTS': 64,
            'MAX_FRAGMENT_INPUT_COMPONENTS': 60,
            'ALIASED_LINE_WIDTH_RANGE': [1, 1],
            'ALIASED_POINT_SIZE_RANGE': [1, 1024],
            'MAX_VIEWPORT_DIMS': [16384, 16384],
            'MAX_CUBE_MAP_TEXTURE_SIZE': 16384,
            'MAX_VERTEX_UNIFORM_BLOCKS': 14,
            'MAX_FRAGMENT_UNIFORM_BLOCKS': 14,
            'MAX_COMBINED_UNIFORM_BLOCKS': 70,
            'MAX_UNIFORM_BUFFER_BINDINGS': 70,
            'MAX_UNIFORM_BLOCK_SIZE': 16384,
            'MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS': 4096,
            'MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS': 1024,
            'UNIFORM_BUFFER_OFFSET_ALIGNMENT': 256,
            'MAX_VERTEX_OUTPUT_COMPONENTS': 64,
            'MAX_FRAGMENT_INPUT_COMPONENTS': 60,
            'MAX_SERVER_WAIT_TIMEOUT': 0,
            'MAX_ELEMENT_INDEX': 4294967295,
            'MIN_PROGRAM_TEXEL_OFFSET': -8,
            'MAX_PROGRAM_TEXEL_OFFSET': 7
        };

        // Proxy WebGL context to fix shader precision format issues
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
            const context = originalGetContext.call(this, contextType, contextAttributes);
            
            if (contextType === 'webgl' || contextType === 'webgl2') {
                // Create a proxy for the WebGL context
                return new Proxy(context, {
                    get(target, prop) {
                        if (prop === 'getParameter') {
                            return function(parameter) {
                                // Return spoofed values for specific parameters
                                if (webglParams.hasOwnProperty(parameter)) {
                                    return webglParams[parameter];
                                }
                                return target.getParameter(parameter);
                            };
                        }
                        if (prop === 'getExtension') {
                            return function(name) {
                                const extension = target.getExtension(name);
                                if (extension && name === 'WEBGL_debug_renderer_info') {
                                    return new Proxy(extension, {
                                        get(extTarget, extProp) {
                                            if (extProp === 'getParameter') {
                                                return function(param) {
                                                    if (param === 37445) { // UNMASKED_VENDOR_WEBGL
                                                        return profile.webglVendor;
                                                    }
                                                    if (param === 37446) { // UNMASKED_RENDERER_WEBGL
                                                        return profile.webglRenderer;
                                                    }
                                                    return extTarget.getParameter(param);
                                                };
                                            }
                                            return extTarget[extProp];
                                        }
                                    });
                                }
                                return extension;
                            };
                        }
                        if (prop === 'getShaderPrecisionFormat') {
                            return function(shaderType, precisionType) {
                                const format = target.getShaderPrecisionFormat(shaderType, precisionType);
                                if (format) {
                                    // Proxy the format object to make properties writable
                                    return new Proxy(format, {
                                        get(proxyTarget, proxyProp) {
                                            return proxyTarget[proxyProp];
                                        },
                                        set(proxyTarget, proxyProp, value) {
                                            proxyTarget[proxyProp] = value;
                                            return true;
                                        }
                                    });
                                }
                                return format;
                            };
                        }
                        return target[prop];
                    },
                    set(target, prop, value) {
                        target[prop] = value;
                        return true;
                    }
                });
            }
            
            return context;
        };
    }

    // --- Enhanced Audio protection ---
    function applyAudioProtection() {
        if (!window.AudioContext && !window.webkitAudioContext) return;

        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const origAudioContext = AudioContextClass.prototype.constructor;
        
        AudioContextClass.prototype.constructor = function(contextOptions) {
            const context = new origAudioContext(contextOptions);
            
            // Spoof sample rate
            Object.defineProperty(context, 'sampleRate', {
                get: () => 44100 + getSubtleRandom(-100, 100),
                configurable: true
            });
            
            // Spoof state
            Object.defineProperty(context, 'state', {
                get: () => 'running',
                configurable: true
            });
            
            return context;
        };
    }

    // --- Enhanced Font protection ---
    function applyFontProtection() {
        if (!window.document) return;

        // Windows font set
        const windowsFonts = [
            'Arial', 'Arial Black', 'Calibri', 'Cambria', 'Cambria Math', 'Comic Sans MS',
            'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
            'Microsoft Sans Serif', 'Palatino Linotype', 'Tahoma', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Wingdings 2', 'Wingdings 3'
        ];

        // Override font detection
        if (window.document.fonts && window.document.fonts.check) {
            const origCheck = window.document.fonts.check;
            window.document.fonts.check = function(font, text) {
                // Always return true for common fonts
                if (windowsFonts.some(f => font.includes(f))) {
                    return true;
                }
                return origCheck.call(this, font, text);
            };
        }

        // Enhanced measureText randomization
        if (FONT_RANDOMIZE && window.CanvasRenderingContext2D) {
            const origMeasureText = CanvasRenderingContext2D.prototype.measureText;
            CanvasRenderingContext2D.prototype.measureText = function(text) {
                const metrics = origMeasureText.call(this, text);
                
                // Add subtle randomization to width
                const originalWidth = metrics.width;
                const randomFactor = 1 + (getSubtleRandom(-5, 5) / 1000); // ±0.5% variation
                
                Object.defineProperty(metrics, 'width', {
                    get: () => originalWidth * randomFactor,
                    configurable: true
                });
                
                return metrics;
            };
        }

        // Block font enumeration
        if (window.document.fonts && window.document.fonts.ready) {
            const origReady = window.document.fonts.ready;
            window.document.fonts.ready = new Promise((resolve) => {
                // Resolve immediately with a subset of fonts
                resolve();
            });
        }
    }

    // --- Enhanced Battery API protection ---
    function applyBatteryProtection() {
        if (!navigator.getBattery) return;

        const origGetBattery = navigator.getBattery;
        navigator.getBattery = function() {
            return origGetBattery.call(this).then(battery => {
                // Spoof battery properties
                Object.defineProperty(battery, 'level', {
                    get: () => 0.5 + getSubtleRandom(-10, 10) / 100,
                    configurable: true
                });
                Object.defineProperty(battery, 'charging', {
                    get: () => Math.random() > 0.3,
                    configurable: true
                });
                Object.defineProperty(battery, 'chargingTime', {
                    get: () => battery.charging ? getSubtleRandom(1000, 3600) : Infinity,
                    configurable: true
                });
                Object.defineProperty(battery, 'dischargingTime', {
                    get: () => battery.charging ? Infinity : getSubtleRandom(3600, 7200),
                    configurable: true
                });
                return battery;
            });
        };
    }

    // --- Enhanced MediaDevices protection ---
    function applyMediaDevicesProtection() {
        if (!navigator.mediaDevices) return;

        const origEnumerateDevices = navigator.mediaDevices.enumerateDevices;
        navigator.mediaDevices.enumerateDevices = function() {
            return origEnumerateDevices.call(this).then(devices => {
                // Spoof device IDs
                return devices.map(device => ({
                    ...device,
                    deviceId: device.deviceId ? 'spoofed-device-id-' + Math.random().toString(36).substr(2, 9) : device.deviceId
                }));
            });
        };

        const origGetUserMedia = navigator.mediaDevices.getUserMedia;
        navigator.mediaDevices.getUserMedia = function(constraints) {
            // Block certain media requests
            if (constraints.video && constraints.video.facingMode === 'environment') {
                return Promise.reject(new Error('Camera access denied'));
            }
            return origGetUserMedia.call(this, constraints);
        };
    }

    // --- Enhanced Permissions protection ---
    function applyPermissionsProtection() {
        if (!navigator.permissions) return;

        const origQuery = navigator.permissions.query;
        navigator.permissions.query = function(permissionDesc) {
            // Block certain permission queries
            const blockedPermissions = ['geolocation', 'notifications', 'microphone', 'camera'];
            if (blockedPermissions.includes(permissionDesc.name)) {
                return Promise.resolve({
                    state: 'denied',
                    onchange: null
                });
            }
            return origQuery.call(this, permissionDesc);
        };
    }

    // --- Enhanced Storage protection ---
    function applyStorageProtection() {
        // Block localStorage and sessionStorage access for certain domains
        const blockedDomains = ['tracker.com', 'analytics.com', 'ads.com'];
        const currentDomain = window.location.hostname;
        
        if (blockedDomains.some(domain => currentDomain.includes(domain))) {
            // Override storage methods
            const noop = () => {};
            Object.defineProperty(window, 'localStorage', {
                get: () => ({
                    getItem: noop,
                    setItem: noop,
                    removeItem: noop,
                    clear: noop,
                    key: noop,
                    length: 0
                }),
                configurable: true
            });
            
            Object.defineProperty(window, 'sessionStorage', {
                get: () => ({
                    getItem: noop,
                    setItem: noop,
                    removeItem: noop,
                    clear: noop,
                    key: noop,
                    length: 0
                }),
                configurable: true
            });
        }
    }

    // --- Enhanced WebRTC protection ---
    function applyWebRTCProtection() {
        // Block WebRTC to prevent IP leaks
        if (window.RTCPeerConnection) {
            const origRTCPeerConnection = window.RTCPeerConnection;
            window.RTCPeerConnection = function(configuration) {
                const pc = new origRTCPeerConnection(configuration);
                
                // Override createOffer and createAnswer to prevent ICE gathering
                const origCreateOffer = pc.createOffer;
                const origCreateAnswer = pc.createAnswer;
                
                pc.createOffer = function(options) {
                    return origCreateOffer.call(this, options).then(offer => {
                        // Remove ICE candidates
                        offer.sdp = offer.sdp.replace(/a=candidate.*\r\n/g, '');
                        return offer;
                    });
                };
                
                pc.createAnswer = function(options) {
                    return origCreateAnswer.call(this, options).then(answer => {
                        // Remove ICE candidates
                        answer.sdp = answer.sdp.replace(/a=candidate.*\r\n/g, '');
                        return answer;
                    });
                };
                
                return pc;
            };
        }
    }

    // --- Enhanced anti-tracking protection ---
    function applyAntiTrackingProtection() {
        // Block known tracking domains
        const blockedDomains = [
            'google-analytics.com', 'googletagmanager.com', 'facebook.com',
            'doubleclick.net', 'googlesyndication.com', 'amazon-adsystem.com',
            'bing.com', 'yahoo.com', 'twitter.com', 'linkedin.com'
        ];

        // Block third-party cookies
        if (document.cookie) {
            const origCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
            Object.defineProperty(document, 'cookie', {
                get: origCookie.get,
                set: function(value) {
                    // Block third-party cookies
                    if (value.includes('domain=') || value.includes('path=/')) {
                        return;
                    }
                    return origCookie.set.call(this, value);
                },
                configurable: true
            });
        }

        // Block tracking scripts
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT') {
                        const src = node.src || '';
                        if (blockedDomains.some(domain => src.includes(domain))) {
                            node.remove();
                        }
                    }
                });
            });
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // --- Apply all protections ---
    function applyAllProtections() {
        if (DEBUG_MODE) console.log('🛡️ Applying anti-fingerprinting protections...');
        
        applyAntiDetection();
        applyCoreProtection();
        applyCanvasProtection();
        applyWebGLProtection();
        applyAudioProtection();
        applyFontProtection();
        applyBatteryProtection();
        applyMediaDevicesProtection();
        applyPermissionsProtection();
        applyStorageProtection();
        applyWebRTCProtection();
        applyAntiTrackingProtection();
        
        if (DEBUG_MODE) console.log('✅ Anti-fingerprinting protections applied');
    }

    // --- Initialize protection ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAllProtections);
    } else {
        applyAllProtections();
    }

    // --- Export for external access ---
    window.lulzactiveProtection = {
        version: '0.10.0',
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
            storage: true
        }
    };

})(); 