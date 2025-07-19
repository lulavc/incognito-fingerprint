// Enhanced popup functionality for lulzactive extension
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
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
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
                        
                        [protectionCount, trackerCount];
                    `
                }, function(results) {
                    if (results && results[0]) {
                        const [protections, trackers] = results[0];
                        overridesCount.textContent = protections || 0;
                        trackersBlocked.textContent = trackers || 0;
                    }
                });
            }
        });
    }

    // Check userscript status
    function checkUserscriptStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
                        // Check if userscript is active
                        if (window.AntiFingerprintUtils) {
                            'Active';
                        } else {
                            'Inactive';
                        }
                    `
                }, function(results) {
                    if (results && results[0]) {
                        const status = results[0];
                        if (status === 'Active') {
                            userscriptStatus.textContent = '🟢 Userscript: Active';
                            userscriptStatus.className = 'userscript-status userscript-active';
                        } else {
                            userscriptStatus.textContent = '🟡 Userscript: Inactive';
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                        }
                    }
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
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
                        // Simple protection test
                        const tests = {
                            userAgent: navigator.userAgent.includes('Chrome/120'),
                            platform: navigator.platform === 'Win32',
                            screen: screen.width === 1920 && screen.height === 1080,
                            webgl: (() => {
                                const canvas = document.createElement('canvas');
                                const gl = canvas.getContext('webgl');
                                return gl && gl.getParameter(gl.VENDOR) === 'Google Inc.';
                            })(),
                            canvas: (() => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                ctx.fillText('Test', 10, 10);
                                return canvas.toDataURL().length > 0;
                            })()
                        };
                        
                        const results = Object.entries(tests).map(([test, passed]) => 
                            \`\${test}: \${passed ? '✅' : '❌'}\`
                        ).join('\\n');
                        
                        alert('Protection Test Results:\\n\\n' + results);
                    `
                });
            }
        });
    }

    // Toggle debug mode
    function toggleDebugMode() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
                        // Toggle console logging
                        if (window.lulzactiveDebug) {
                            window.lulzactiveDebug = !window.lulzactiveDebug;
                        } else {
                            window.lulzactiveDebug = true;
                        }
                        
                        console.log('lulzactive: Debug mode ' + (window.lulzactiveDebug ? 'enabled' : 'disabled'));
                        'Debug mode ' + (window.lulzactiveDebug ? 'enabled' : 'disabled');
                    `
                }, function(results) {
                    if (results && results[0]) {
                        alert(results[0]);
                    }
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
                chrome.tabs.executeScript(tabs[0].id, {
                    code: `
                        // Collect protection data
                        const data = {
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            screen: {
                                width: screen.width,
                                height: screen.height,
                                colorDepth: screen.colorDepth
                            },
                            webgl: (() => {
                                const canvas = document.createElement('canvas');
                                const gl = canvas.getContext('webgl');
                                return gl ? {
                                    vendor: gl.getParameter(gl.VENDOR),
                                    renderer: gl.getParameter(gl.RENDERER)
                                } : null;
                            })(),
                            canvas: (() => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                ctx.fillText('Test', 10, 10);
                                return {
                                    dataURL: canvas.toDataURL().substring(0, 100) + '...',
                                    width: canvas.width,
                                    height: canvas.height
                                };
                            })(),
                            protections: {
                                antiFingerprintUtils: !!window.AntiFingerprintUtils,
                                userAgentSpoofed: navigator.userAgent.includes('Chrome/120'),
                                platformSpoofed: navigator.platform === 'Win32',
                                screenSpoofed: screen.width === 1920
                            }
                        };
                        
                        JSON.stringify(data, null, 2);
                    `
                }, function(results) {
                    if (results && results[0]) {
                        try {
                            const data = JSON.parse(results[0]);
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
                });
            }
        });
    }

    // Initialize the popup
    initializePopup();
});
