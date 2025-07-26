// ==UserScript==
// @name         Ultimate Anti-Fingerprint Protection v0.11.0
// @namespace    https://github.com/lulzactive/incognito-fingerprint
// @version      0.11.0
// @description  Advanced, robust anti-fingerprinting userscript with realistic Chrome/Windows spoofing, enhanced privacy, and comprehensive tracking prevention
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

/* eslint-env browser */
/* global GM_getValue, GM_setValue */

(() => {
  'use strict';

  /***************************
   * 0.  GLOBAL IDENTIFIERS  *
   ***************************/
  const VERSION = '0.11.0';
  window.lulzactiveUserscript = {
    version: VERSION,
    name: 'lulzactive',
    timestamp: Date.now(),
    source: 'userscript',
  };
  window.lulzactiveVersion = VERSION;
  window.lulzactiveIsUserscript = true;

  window.AntiFingerprintUtils = {
    version: VERSION,
    isExtension: false,
    isUserscript: true,
    protectionLevel: 'ultimate',
    features: {},
    stats: {
      protectionsApplied: 0,
      trackersBlocked: 0,
      fingerprintsBlocked: 0,
      startTime: Date.now(),
    },
  };

  /***************************
   * 1.  SETTINGS (persist)  *
   ***************************/
  const defaults = {
    paranoidCanvas: false,
    roundScreen: false,
    fontRandomize: true,
    canvasTextRandomize: true,
    enhancedRandomization: true,
    antiDetection: true,
    antiTracking: true,
    fingerprintBlocking: true,
    advancedProtection: true,
    debugMode: false,
  };

  const settings = new Proxy({}, {
    get(_, key) {
      const k = String(key);
      try {
        return GM_getValue(k, defaults[k]);
      } catch (_) {
        return defaults[k];
      }
    },
    set(_, key, value) {
      try {
        GM_setValue(String(key), value);
      } catch (_) {
        /* ignore */
      }
      return true;
    },
  });

  const log = (...args) => settings.debugMode && console.log('[Anti-FP]', ...args);

  /***************************
   * 2.  PROFILE SELECTION   *
   ***************************/
  const PROFILES = [
    {
      id: 'Chrome120-Win10-GTX1660',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Win32',
      language: 'en-US',
      screen: { w: 1920, h: 1080, colorDepth: 24, pixelRatio: 1 },
      hw: { cores: 8, memory: 16 },
      timezone: 'America/New_York',
      webgl: {
        vendor: 'Google Inc.',
        renderer: 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)',
      },
      connection: { effectiveType: '4g', downlink: 10, rtt: 50 },
      maxTouchPoints: 0,
    },
    {
      id: 'Chrome120-Win10-UHD620',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Win32',
      language: 'en-US',
      screen: { w: 1920, h: 1080, colorDepth: 24, pixelRatio: 1 },
      hw: { cores: 8, memory: 8 },
      timezone: 'America/New_York',
      webgl: {
        vendor: 'Google Inc.',
        renderer: 'ANGLE (Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
      },
      connection: { effectiveType: '4g', downlink: 8, rtt: 60 },
      maxTouchPoints: 0,
    },
  ];

  const selectProfile = () => {
    const domain = location.hostname;
    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
      hash = (hash << 5) - hash + domain.charCodeAt(i);
      hash |= 0; // int32
    }
    return PROFILES[Math.abs(hash) % PROFILES.length];
  };

  const profile = selectProfile();

  /***************************
   * 3.  UTILITY HELPERS     *
   ***************************/
  function subtleRandom(min, max) {
    if (!settings.enhancedRandomization) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const crypto = window.crypto || window.msCrypto;
    if (crypto?.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      return min + (arr[0] % (max - min + 1));
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function defineSpoof(obj, prop, getter) {
    try {
      Object.defineProperty(obj, prop, { get: getter, configurable: true, enumerable: true });
    } catch (err) {
      log('defineSpoof failed', prop, err);
    }
  }

  /***************************
   * 4.  CORE SPOOFING       *
   ***************************/
  function applyCoreSpoofs() {
    const { screen: scr } = profile;

    defineSpoof(navigator, 'userAgent', () => profile.userAgent);
    defineSpoof(navigator, 'platform', () => profile.platform);
    defineSpoof(navigator, 'language', () => profile.language);
    defineSpoof(navigator, 'languages', () => [profile.language, 'en']);
    defineSpoof(navigator, 'hardwareConcurrency', () => profile.hw.cores + subtleRandom(-1, 1));
    defineSpoof(navigator, 'deviceMemory', () => profile.hw.memory + subtleRandom(-1, 1));
    defineSpoof(navigator, 'vendor', () => 'Google Inc.');
    defineSpoof(navigator, 'productSub', () => '20030107');
    defineSpoof(navigator, 'maxTouchPoints', () => profile.maxTouchPoints);

    // Screen
    const w = settings.roundScreen ? Math.floor(scr.w / 100) * 100 : scr.w;
    const h = settings.roundScreen ? Math.floor(scr.h / 100) * 100 : scr.h;
    defineSpoof(window.screen, 'width', () => w);
    defineSpoof(window.screen, 'height', () => h);
    defineSpoof(window.screen, 'colorDepth', () => scr.colorDepth);
    defineSpoof(window.screen, 'pixelDepth', () => scr.colorDepth);
    defineSpoof(window.screen, 'availWidth', () => w);
    defineSpoof(window.screen, 'availHeight', () => h - 40);
    defineSpoof(window, 'devicePixelRatio', () => scr.pixelRatio);

    // Timezone
    if (Intl?.DateTimeFormat) {
      const origResolved = Intl.DateTimeFormat.prototype.resolvedOptions;
      Intl.DateTimeFormat.prototype.resolvedOptions = function resolvedOptions() {
        const o = origResolved.call(this);
        o.timeZone = profile.timezone;
        return o;
      };
    }

    // Date offset
    const origTZ = Date.prototype.getTimezoneOffset;
    Date.prototype.getTimezoneOffset = function getTZ() {
      return origTZ.call(this) + subtleRandom(-1, 1);
    };

    window.AntiFingerprintUtils.stats.protectionsApplied += 1;
  }

  /***************************
   * 5.  CANVAS PROTECTION   *
   ***************************/
  function applyCanvas() {
    if (!HTMLCanvasElement) return;

    if (settings.paranoidCanvas) {
      const blank =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP89PwGHwAFYAJm6ocdgAAAABJRU5ErkJggg==';
      HTMLCanvasElement.prototype.toDataURL = () => blank;
      HTMLCanvasElement.prototype.toBlob = (cb) => {
        const bin = atob(blank.split(',')[1]);
        const len = bin.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
        cb(new Blob([arr], { type: 'image/png' }));
      };
      return;
    }

    const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function patched(...args) {
      try {
        const ctx = this.getContext('2d');
        if (ctx) {
          const { width, height } = this;
          const img = ctx.getImageData(0, 0, width, height);
          const seed = `${width}x${height}-${Date.now() >> 12}`;
          const rand = ((seed) => {
            let h = 0;
            for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
            return Math.abs(h);
          })(seed);
          for (let i = 0; i < img.data.length; i += 4 * 50) {
            img.data[i] ^= rand & 0xff;
          }
          ctx.putImageData(img, 0, 0);
        }
      } catch (_) {/* ignore */}
      return origToDataURL.apply(this, args);
    };
  }

  /***************************
   * 6.  WEBGL PROTECTION    *
   ***************************/
  function applyWebGL() {
    if (!window.WebGLRenderingContext) return;

    const { vendor, renderer } = profile.webgl;

    const spoofParam = (proto, name, value) => {
      const orig = proto[name];
      Object.defineProperty(proto, name, {
        value: function (...args) {
          const res = orig.apply(this, args);
          if (res === 37445) return vendor; // UNMASKED_VENDOR_WEBGL
          if (res === 37446) return renderer; // UNMASKED_RENDERER_WEBGL
          return value ?? res;
        },
      });
    };

    spoofParam(WebGLRenderingContext.prototype, 'getParameter');
  }

  /***************************
   * 7.  AUDIO + OTHERS      *
   ***************************/
  function applyAudio() {
    if (!window.OfflineAudioContext) return;
    const orig = OfflineAudioContext.prototype.getChannelData || AudioBuffer.prototype.getChannelData;
    if (!orig) return;
    const noiseFactor = () => (Math.random() - 0.5) * 0.0000001;
    AudioBuffer.prototype.getChannelData = function patched(...args) {
      const data = orig.apply(this, args);
      for (let i = 0; i < data.length; i += 100) data[i] += noiseFactor();
      return data;
    };
  }

  /***************************
   * 8.  PERMISSIONS ETC.    *
   ***************************/
  function applyPermissions() {
    if (!navigator.permissions?.query) return;
    const blocked = new Set(['notifications', 'microphone', 'camera', 'geolocation']);
    const origQuery = navigator.permissions.query.bind(navigator.permissions);
    navigator.permissions.query = (desc) => {
      if (blocked.has(desc.name)) {
        return Promise.resolve({ state: 'denied', onchange: null });
      }
      return origQuery(desc);
    };
  }

  /***************************
   * 9.  ANTI-TRACKING       *
   ***************************/
  function applyAntiTracking() {
    if (!settings.antiTracking) return;
    const patterns = [/googletagmanager/i, /google-analytics/i, /doubleclick\./i];

    // fetch
    const origFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = String(args[0]);
      if (patterns.some((p) => p.test(url))) {
        log('Blocked tracking fetch', url);
        window.AntiFingerprintUtils.stats.trackersBlocked += 1;
        return new Response('', { status: 204 });
      }
      return origFetch.apply(this, args);
    };

    // XHR
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function open(method, url, ...rest) {
      if (patterns.some((p) => p.test(String(url)))) {
        log('Blocked tracking XHR', url);
        this.abort();
        return;
      }
      return origOpen.call(this, method, url, ...rest);
    };
  }

  /***************************
   * 10. APPLY ALL           *
   ***************************/
  function applyAll() {
    log('Applying anti-fingerprinting protections…');
    applyCoreSpoofs();
    applyCanvas();
    applyWebGL();
    applyAudio();
    applyPermissions();
    applyAntiTracking();
    log('Protections active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll, { once: true });
  } else {
    applyAll();
  }
})();