// Script loader for anti-fingerprinting protection (Enhanced for incognito mode)
// Uses shared utilities for consistent protection

(function() {
    'use strict';

    let protectionApplied = false;
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait time

    // Wait for shared-utils to be available
    function waitForUtils() {
        if (window.AntiFingerprintUtils) {
            // Apply all protections using shared utilities
            try {
                window.AntiFingerprintUtils.applyAllProtections();
                protectionApplied = true;
                
                // Log success
                console.log('lulzactive: Anti-fingerprinting protection applied successfully');
                
                // Optional: Add a small indicator in the page
                try {
                    const indicator = document.createElement('div');
                    indicator.style.cssText = `
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        background: rgba(0, 255, 0, 0.8);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        z-index: 999999;
                        pointer-events: none;
                        opacity: 0.8;
                    `;
                    indicator.textContent = '🛡️ Protected';
                    document.body.appendChild(indicator);
                    
                    // Remove after 3 seconds
                    setTimeout(() => {
                        if (indicator.parentNode) {
                            indicator.parentNode.removeChild(indicator);
                        }
                    }, 3000);
                } catch (e) {
                    // Ignore indicator errors
                }
            } catch (e) {
                console.error('lulzactive: Failed to apply protections:', e);
                // Fallback to basic protection
                applyBasicProtection();
            }
        } else {
            retryCount++;
            if (retryCount < maxRetries) {
                // Retry after a short delay
                setTimeout(waitForUtils, 100);
            } else {
                console.warn('lulzactive: AntiFingerprintUtils not available after', maxRetries, 'retries, applying basic protection');
                // Fallback to basic protection
                applyBasicProtection();
            }
        }
    }

    // Basic protection fallback (in case shared-utils fails to load)
    function applyBasicProtection() {
        try {
            console.log('lulzactive: Applying basic anti-fingerprinting protection');
            
            // Basic navigator spoofing
            if (navigator.userAgent && !navigator.userAgent.includes('Chrome/120')) {
                Object.defineProperty(navigator, 'userAgent', {
                    get: () => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    configurable: true
                });
            }
            
            if (navigator.platform !== 'Win32') {
                Object.defineProperty(navigator, 'platform', {
                    get: () => 'Win32',
                    configurable: true
                });
            }
            
            // Basic screen spoofing
            if (screen.width !== 1920 || screen.height !== 1080) {
                Object.defineProperty(screen, 'width', { get: () => 1920, configurable: true });
                Object.defineProperty(screen, 'height', { get: () => 1080, configurable: true });
            }
            
            // Basic WebGL protection
            if (window.WebGLRenderingContext) {
                const origGetParameter = WebGLRenderingContext.prototype.getParameter;
                WebGLRenderingContext.prototype.getParameter = function(param) {
                    if (param === 0x1F00) return 'Google Inc.'; // VENDOR
                    if (param === 0x1F01) return 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)'; // RENDERER
                    if (param === 37445) return 'Google Inc.'; // UNMASKED_VENDOR_WEBGL
                    if (param === 37446) return 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)'; // UNMASKED_RENDERER_WEBGL
                    return origGetParameter.call(this, param);
                };
                
                // Also protect getContext method
                if (window.HTMLCanvasElement) {
                    const origGetContext = HTMLCanvasElement.prototype.getContext;
                    HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
                        const context = origGetContext.call(this, contextType, contextAttributes);
                        
                        if (context && (contextType === 'webgl' || contextType === 'webgl2')) {
                            const origContextGetParameter = context.getParameter;
                            context.getParameter = function(param) {
                                if (param === 0x1F00) return 'Google Inc.'; // VENDOR
                                if (param === 0x1F01) return 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)'; // RENDERER
                                if (param === 37445) return 'Google Inc.'; // UNMASKED_VENDOR_WEBGL
                                if (param === 37446) return 'ANGLE (NVIDIA GeForce GTX 1660 Ti Direct3D11 vs_5_0 ps_5_0)'; // UNMASKED_RENDERER_WEBGL
                                return origContextGetParameter.call(this, param);
                            };
                        }
                        
                        return context;
                    };
                }
            }
            
            // Basic canvas protection
            if (window.HTMLCanvasElement) {
                const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
                HTMLCanvasElement.prototype.toDataURL = function() {
                    const ctx = this.getContext('2d');
                    if (ctx) {
                        try {
                            const imgData = ctx.getImageData(0, 0, this.width, this.height);
                            for (let i = 0; i < imgData.data.length; i += 4) {
                                imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + (Math.random() > 0.5 ? 1 : -1)));
                                imgData.data[i+1] = Math.max(0, Math.min(255, imgData.data[i+1] + (Math.random() > 0.5 ? 1 : -1)));
                                imgData.data[i+2] = Math.max(0, Math.min(255, imgData.data[i+2] + (Math.random() > 0.5 ? 1 : -1)));
                            }
                            ctx.putImageData(imgData, 0, 0);
                        } catch (e) {}
                    }
                    return origToDataURL.apply(this, arguments);
                };
            }
            
            protectionApplied = true;
            console.log('lulzactive: Basic protection applied');
            
        } catch (e) {
            console.error('lulzactive: Failed to apply basic protection:', e);
        }
    }

    // Start waiting for utils
    waitForUtils();

    // Also try to apply protection when DOM is ready (fallback)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (!protectionApplied) {
                console.log('lulzactive: DOM ready, checking for protection again');
                waitForUtils();
            }
        });
    }

})(); 