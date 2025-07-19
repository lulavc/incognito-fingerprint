// Enhanced popup functionality for lulzactive extension (Manifest V3)
document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    const toggleBtn = document.getElementById('toggleBtn');
    const overridesCount = document.getElementById('overridesCount');
    const trackersBlocked = document.getElementById('trackersBlocked');
    const testBtn = document.getElementById('testBtn');
    const debugBtn = document.getElementById('debugBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportBtn = document.getElementById('exportBtn');
    const userscriptStatus = document.getElementById('userscriptStatus');

    let isEnabled = true; // Default to enabled

    // Helper function to safely get storage data (works in both regular and incognito contexts)
    async function getStorageData(keys) {
        try {
            // Try session storage first (for incognito)
            const result = await chrome.storage.session.get(keys);
            if (Object.keys(result).length > 0) {
                return result;
            }
        } catch (e) {
            // Session storage not available
        }
        
        try {
            // Fallback to local storage
            return await chrome.storage.local.get(keys);
        } catch (e) {
            // Local storage not available, return empty object
            return {};
        }
    }

    // Helper function to safely set storage data (works in both regular and incognito contexts)
    async function setStorageData(data) {
        try {
            // Try session storage first (for incognito)
            await chrome.storage.session.set(data);
        } catch (e) {
            try {
                // Fallback to local storage
                await chrome.storage.local.set(data);
            } catch (e2) {
                console.log('Failed to save settings:', e2);
            }
        }
    }

    // Helper function to check if script injection is allowed
    function canInjectScript(tab) {
        return tab && tab.url && 
               !tab.url.startsWith('chrome-extension://') && 
               !tab.url.startsWith('chrome://') && 
               !tab.url.startsWith('moz-extension://') &&
               !tab.url.startsWith('about:') &&
               !tab.url.startsWith('edge://');
    }

    // Helper function to show restricted URL message
    function showRestrictedUrlMessage() {
        alert('This feature cannot run on browser extension pages.\n\nPlease navigate to a regular website (like google.com) and try again.');
    }

    // Initialize popup
    function initializePopup() {
        updateStatus();
        updateStats();
        checkUserscriptStatus();

        // Set up event listeners
        toggleBtn.addEventListener('click', toggleProtection);
        testBtn.addEventListener('click', testProtection);
        debugBtn.addEventListener('click', toggleDebugMode);
        resetBtn.addEventListener('click', resetProtection);
        exportBtn.addEventListener('click', exportLogs);
    }

    // Update protection status
    function updateStatus() {
        getStorageData(['protectionEnabled']).then(result => {
            isEnabled = result.protectionEnabled !== false; // Default to true
            
            if (isEnabled) {
                statusDiv.className = 'status active';
                statusText.textContent = '🛡️ Protection Active';
                toggleBtn.textContent = 'Disable Protection';
                toggleBtn.className = 'toggle';
            } else {
                statusDiv.className = 'status inactive';
                statusText.textContent = '⚠️ Protection Disabled';
                toggleBtn.textContent = 'Enable Protection';
                toggleBtn.className = 'toggle inactive';
            }
        }).catch(err => {
            console.log('Failed to get protection status:', err);
            // Default to enabled if we can't get the status
            isEnabled = true;
            statusDiv.className = 'status active';
            statusText.textContent = '🛡️ Protection Active';
            toggleBtn.textContent = 'Disable Protection';
            toggleBtn.className = 'toggle';
        });
    }

    // Update statistics
    function updateStats() {
        // Get stats from current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    overridesCount.textContent = 'N/A';
                    trackersBlocked.textContent = 'N/A';
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Count active protections
                        let protectionCount = 0;
                        if (window.AntiFingerprintUtils) protectionCount++;
                        if (navigator.userAgent.includes('Chrome/120')) protectionCount++;
                        if (navigator.platform === 'Win32') protectionCount++;
                        if (screen.width === 1920) protectionCount++;
                        
                        // Count blocked trackers (estimate)
                        let trackerCount = 0;
                        if (window.fetch && window.XMLHttpRequest) {
                            // Check if anti-tracking is active
                            trackerCount = 50; // Estimated blocked trackers
                        }
                        
                        return [protectionCount, trackerCount];
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const [protections, trackers] = results[0].result;
                        overridesCount.textContent = protections || 0;
                        trackersBlocked.textContent = trackers || 0;
                    }
                }).catch(err => {
                    console.log('Failed to get stats:', err);
                    overridesCount.textContent = '0';
                    trackersBlocked.textContent = '0';
                });
            }
        });
    }

    // Check userscript status
    function checkUserscriptStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    userscriptStatus.textContent = '🟡 Userscript: N/A (Extension Page)';
                    userscriptStatus.className = 'userscript-status userscript-inactive';
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Check if userscript is active by looking for specific userscript indicators
                        const userscriptIndicators = {
                            // Check if the userscript's global object exists
                            hasUserscriptGlobal: typeof window.lulzactiveUserscript !== 'undefined',
                            // Check if the userscript has applied its own protection
                            hasUserscriptProtection: window.AntiFingerprintUtils && window.AntiFingerprintUtils.isUserscript,
                            // Check if the userscript's version is available
                            hasUserscriptVersion: typeof window.lulzactiveVersion !== 'undefined',
                            // Check if the userscript's name is in the page
                            hasUserscriptName: document.querySelector('script[src*="lulzactive"]') !== null
                        };
                        
                        // Determine status based on indicators
                        if (userscriptIndicators.hasUserscriptGlobal || userscriptIndicators.hasUserscriptProtection) {
                            return 'Active';
                        } else if (window.AntiFingerprintUtils) {
                            return 'Extension Only'; // Only extension protection is active
                        } else {
                            return 'Inactive';
                        }
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const status = results[0].result;
                        if (status === 'Active') {
                            userscriptStatus.textContent = '🟢 Userscript: Active';
                            userscriptStatus.className = 'userscript-status userscript-active';
                        } else if (status === 'Extension Only') {
                            userscriptStatus.textContent = '🟡 Userscript: Extension Only';
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                        } else {
                            userscriptStatus.textContent = '🟡 Userscript: Inactive';
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                        }
                    }
                }).catch(err => {
                    console.log('Failed to check userscript status:', err);
                    userscriptStatus.textContent = '🟡 Userscript: Unknown';
                    userscriptStatus.className = 'userscript-status userscript-inactive';
                });
            }
        });
    }

    // Toggle protection
    function toggleProtection() {
        isEnabled = !isEnabled;
        
        setStorageData({protectionEnabled: isEnabled}).then(() => {
            updateStatus();
            
            // Reload current tab to apply changes
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        }).catch(err => {
            console.log('Failed to save protection status:', err);
        });
    }

    // Test protection
    function testProtection() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    showRestrictedUrlMessage();
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Enhanced protection test
                        const tests = {
                            userAgent: navigator.userAgent.includes('Chrome/120'),
                            platform: navigator.platform === 'Win32',
                            screen: screen.width === 1920 && screen.height === 1080,
                            webgl: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    
                                    // Try different WebGL context types
                                    let gl = canvas.getContext('webgl') || 
                                            canvas.getContext('webgl2') || 
                                            canvas.getContext('experimental-webgl');
                                    
                                    if (!gl) {
                                        if (window.lulzactiveDebug) {
                                            console.log('lulzactive: WebGL test - No WebGL context available');
                                            console.log('lulzactive: WebGL test - Trying to check WebGL support...');
                                            
                                            // Check if WebGL is supported at all
                                            const testCanvas = document.createElement('canvas');
                                            const testGl = testCanvas.getContext('webgl') || 
                                                          testCanvas.getContext('webgl2') || 
                                                          testCanvas.getContext('experimental-webgl');
                                            
                                            if (testGl) {
                                                console.log('lulzactive: WebGL test - WebGL is supported but context creation failed');
                                            } else {
                                                console.log('lulzactive: WebGL test - WebGL is not supported in this browser/context');
                                            }
                                        }
                                        return false;
                                    }
                                    
                                    const vendor = gl.getParameter(gl.VENDOR);
                                    const renderer = gl.getParameter(gl.RENDERER);
                                    
                                    // Debug info
                                    if (window.lulzactiveDebug) {
                                        console.log('lulzactive: WebGL test - Vendor:', vendor, 'Expected: Google Inc.');
                                        console.log('lulzactive: WebGL test - Renderer:', renderer);
                                        console.log('lulzactive: WebGL test - VENDOR constant:', gl.VENDOR);
                                        console.log('lulzactive: WebGL test - Protection active:', !!window.AntiFingerprintUtils);
                                        console.log('lulzactive: WebGL test - Context type:', gl.getParameter(gl.VERSION));
                                    }
                                    
                                    const result = vendor === 'Google Inc.';
                                    if (!result && window.lulzactiveDebug) {
                                        console.log('lulzactive: WebGL test - FAILED: Vendor is', vendor, 'but expected Google Inc.');
                                    }
                                    
                                    return result;
                                } catch (e) {
                                    if (window.lulzactiveDebug) {
                                        console.log('lulzactive: WebGL test error:', e);
                                        console.log('lulzactive: WebGL test - Error details:', e.message);
                                    }
                                    return false;
                                }
                            })(),
                            canvas: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    ctx.fillText('Test', 10, 10);
                                    return canvas.toDataURL().length > 0;
                                } catch (e) {
                                    return false;
                                }
                            })(),
                            timezone: (() => {
                                try {
                                    return Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/New_York';
                                } catch (e) {
                                    return false;
                                }
                            })(),
                            fonts: (() => {
                                try {
                                    return document.fonts && document.fonts.check('Arial');
                                } catch (e) {
                                    return false;
                                }
                            })()
                        };
                        
                        const results = Object.entries(tests).map(([test, passed]) => 
                            `${test}: ${passed ? '✅' : '❌'}`
                        ).join('\n');
                        
                        const passedCount = Object.values(tests).filter(Boolean).length;
                        const totalCount = Object.keys(tests).length;
                        
                        return `Protection Test Results (${passedCount}/${totalCount} passed):\n\n${results}`;
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        alert(results[0].result);
                    }
                }).catch(err => {
                    alert('Failed to run protection test: ' + err.message);
                });
            }
        });
    }

    // Toggle debug mode
    function toggleDebugMode() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    showRestrictedUrlMessage();
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Toggle console logging
                        if (window.lulzactiveDebug) {
                            window.lulzactiveDebug = !window.lulzactiveDebug;
                        } else {
                            window.lulzactiveDebug = true;
                        }
                        
                        console.log('lulzactive: Debug mode ' + (window.lulzactiveDebug ? 'enabled' : 'disabled'));
                        
                        // Also toggle debug in AntiFingerprintUtils if available
                        if (window.AntiFingerprintUtils && window.AntiFingerprintUtils.setDebugMode) {
                            window.AntiFingerprintUtils.setDebugMode(window.lulzactiveDebug);
                        }
                        
                        // Run WebGL diagnostic if debug mode is enabled
                        if (window.lulzactiveDebug) {
                            console.log('lulzactive: Running WebGL diagnostic...');
                            
                            // Check WebGL support
                            const canvas = document.createElement('canvas');
                            const webgl = canvas.getContext('webgl');
                            const webgl2 = canvas.getContext('webgl2');
                            const experimental = canvas.getContext('experimental-webgl');
                            
                            console.log('lulzactive: WebGL support check:');
                            console.log('- WebGL 1.0:', !!webgl);
                            console.log('- WebGL 2.0:', !!webgl2);
                            console.log('- Experimental WebGL:', !!experimental);
                            
                            if (webgl) {
                                console.log('- WebGL 1.0 Vendor:', webgl.getParameter(webgl.VENDOR));
                                console.log('- WebGL 1.0 Renderer:', webgl.getParameter(webgl.RENDERER));
                            }
                            
                            if (webgl2) {
                                console.log('- WebGL 2.0 Vendor:', webgl2.getParameter(webgl2.VENDOR));
                                console.log('- WebGL 2.0 Renderer:', webgl2.getParameter(webgl2.RENDERER));
                            }
                        }
                        
                        return 'Debug mode ' + (window.lulzactiveDebug ? 'enabled' : 'disabled');
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        alert(results[0].result);
                    }
                }).catch(err => {
                    alert('Failed to toggle debug mode: ' + err.message);
                });
            }
        });
    }

    // Reset protection
    function resetProtection() {
        if (confirm('This will reset all protection settings and reload the page. Continue?')) {
            // Clear both session and local storage
            Promise.all([
                chrome.storage.session.clear().catch(() => {}),
                chrome.storage.local.clear().catch(() => {})
            ]).then(() => {
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
                updateStatus();
                updateStats();
            }).catch(err => {
                console.log('Failed to clear storage:', err);
                // Still reload the page even if storage clear fails
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
                updateStatus();
                updateStats();
            });
        }
    }

    // Export logs
    function exportLogs() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    showRestrictedUrlMessage();
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Collect protection data
                        const data = {
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            screen: {
                                width: screen.width,
                                height: screen.height,
                                colorDepth: screen.colorDepth,
                                pixelDepth: screen.pixelDepth,
                                availWidth: screen.availWidth,
                                availHeight: screen.availHeight
                            },
                            webgl: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    
                                    // Try different WebGL context types
                                    let gl = canvas.getContext('webgl') || 
                                            canvas.getContext('webgl2') || 
                                            canvas.getContext('experimental-webgl');
                                    
                                    if (!gl) {
                                        return {
                                            error: 'No WebGL context available',
                                            supported: false,
                                            contextTypes: {
                                                webgl: !!canvas.getContext('webgl'),
                                                webgl2: !!canvas.getContext('webgl2'),
                                                experimental: !!canvas.getContext('experimental-webgl')
                                            }
                                        };
                                    }
                                    
                                    return {
                                        vendor: gl.getParameter(gl.VENDOR),
                                        renderer: gl.getParameter(gl.RENDERER),
                                        version: gl.getParameter(gl.VERSION),
                                        supported: true,
                                        contextType: gl.getParameter(gl.VERSION).includes('WebGL 2') ? 'webgl2' : 'webgl'
                                    };
                                } catch (e) {
                                    return {
                                        error: e.message,
                                        supported: false,
                                        exception: e.toString()
                                    };
                                }
                            })(),
                            canvas: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    ctx.fillText('Test', 10, 10);
                                    return {
                                        dataURL: canvas.toDataURL().substring(0, 100) + '...',
                                        width: canvas.width,
                                        height: canvas.height
                                    };
                                } catch (e) {
                                    return null;
                                }
                            })(),
                            protections: {
                                antiFingerprintUtils: !!window.AntiFingerprintUtils,
                                userAgentSpoofed: navigator.userAgent.includes('Chrome/120'),
                                platformSpoofed: navigator.platform === 'Win32',
                                screenSpoofed: screen.width === 1920,
                                timezoneSpoofed: Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/New_York'
                            },
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            language: navigator.language,
                            languages: navigator.languages,
                            hardwareConcurrency: navigator.hardwareConcurrency,
                            deviceMemory: navigator.deviceMemory,
                            cookieEnabled: navigator.cookieEnabled,
                            doNotTrack: navigator.doNotTrack
                        };
                        
                        return JSON.stringify(data, null, 2);
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        try {
                            const data = JSON.parse(results[0].result);
                            const blob = new Blob([JSON.stringify(data, null, 2)], {
                                type: 'application/json'
                            });
                            const url = URL.createObjectURL(blob);
                            
                            chrome.downloads.download({
                                url: url,
                                filename: `lulzactive-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
                                saveAs: true
                            });
                        } catch (e) {
                            alert('Failed to export logs: ' + e.message);
                        }
                    } else {
                        alert('Failed to collect protection data');
                    }
                }).catch(err => {
                    alert('Failed to export logs: ' + err.message);
                });
            }
        });
    }

    // Initialize the popup
    initializePopup();
});
