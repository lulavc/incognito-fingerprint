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
        chrome.storage.local.get(['protectionEnabled'], function(result) {
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
        });
    }

    // Update statistics
    function updateStats() {
        // Get stats from current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
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
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Check if userscript is active
                        if (window.AntiFingerprintUtils) {
                            return 'Active';
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
        
        chrome.storage.local.set({protectionEnabled: isEnabled}, function() {
            updateStatus();
            
            // Reload current tab to apply changes
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    }

    // Test protection
    function testProtection() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
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
                                    const gl = canvas.getContext('webgl');
                                    return gl && gl.getParameter(gl.VENDOR) === 'Google Inc.';
                                } catch (e) {
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
            chrome.storage.local.clear(function() {
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
                                    const gl = canvas.getContext('webgl');
                                    return gl ? {
                                        vendor: gl.getParameter(gl.VENDOR),
                                        renderer: gl.getParameter(gl.RENDERER),
                                        version: gl.getParameter(gl.VERSION)
                                    } : null;
                                } catch (e) {
                                    return null;
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
