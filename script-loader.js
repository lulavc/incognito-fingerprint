// Script loader for anti-fingerprinting protection
// Uses shared utilities for consistent protection

(function() {
    'use strict';

    // Wait for shared-utils to be available
    function waitForUtils() {
        if (window.AntiFingerprintUtils) {
            // Apply all protections using shared utilities
            window.AntiFingerprintUtils.applyAllProtections();
            
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
        } else {
            // Retry after a short delay
            setTimeout(waitForUtils, 100);
        }
    }

    // Start waiting for utils
    waitForUtils();

})(); 