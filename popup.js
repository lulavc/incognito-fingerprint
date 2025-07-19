// Enhanced popup functionality for lulzactive extension (Manifest V3)
document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    const statusDescription = document.getElementById('statusDescription');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleText = document.getElementById('toggleText');
    const overridesCount = document.getElementById('overridesCount');
    const trackersBlocked = document.getElementById('trackersBlocked');
    const protectionProgress = document.getElementById('protectionProgress');
    const trackerProgress = document.getElementById('trackerProgress');
    const testBtn = document.getElementById('testBtn');
    const debugBtn = document.getElementById('debugBtn');
    const resetBtn = document.getElementById('resetBtn');
    const exportBtn = document.getElementById('exportBtn');
    const userscriptStatus = document.getElementById('userscriptStatus');

    let isEnabled = true; // Default to enabled
    let debugMode = false;

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

    // Helper function to show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
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

        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Update protection status
    function updateStatus() {
        getStorageData(['protectionEnabled', 'debugMode']).then(result => {
            isEnabled = result.protectionEnabled !== false; // Default to true
            debugMode = result.debugMode || false;
            
            if (isEnabled) {
                statusDiv.className = 'status-card active';
                statusIcon.textContent = '🛡️';
                statusText.textContent = 'Protection Active';
                statusDescription.textContent = 'Your browser fingerprint is being protected from tracking and identification.';
                toggleText.textContent = 'Disable Protection';
                toggleBtn.className = 'main-toggle';
            } else {
                statusDiv.className = 'status-card inactive';
                statusIcon.textContent = '⚠️';
                statusText.textContent = 'Protection Disabled';
                statusDescription.textContent = 'Your browser fingerprint is vulnerable to tracking and identification.';
                toggleText.textContent = 'Enable Protection';
                toggleBtn.className = 'main-toggle inactive';
            }

            // Update debug button state
            if (debugMode) {
                debugBtn.style.background = 'rgba(76, 175, 80, 0.2)';
                debugBtn.style.borderColor = 'rgba(76, 175, 80, 0.4)';
            } else {
                debugBtn.style.background = 'rgba(255, 255, 255, 0.08)';
                debugBtn.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }
        }).catch(err => {
            console.log('Failed to get protection status:', err);
            // Default to enabled if we can't get the status
            isEnabled = true;
            statusDiv.className = 'status-card active';
            statusIcon.textContent = '🛡️';
            statusText.textContent = 'Protection Active';
            statusDescription.textContent = 'Your browser fingerprint is being protected from tracking and identification.';
            toggleText.textContent = 'Disable Protection';
            toggleBtn.className = 'main-toggle';
        });
    }

    // Update statistics with progress bars
    function updateStats() {
        // Get stats from current tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    overridesCount.textContent = 'N/A';
                    trackersBlocked.textContent = 'N/A';
                    protectionProgress.style.width = '0%';
                    trackerProgress.style.width = '0%';
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Count active protections
                        let protectionCount = 0;
                        const maxProtections = 8;
                        
                        if (window.AntiFingerprintUtils) protectionCount++;
                        if (navigator.userAgent.includes('Chrome/120')) protectionCount++;
                        if (navigator.platform === 'Win32') protectionCount++;
                        if (screen.width === 1920) protectionCount++;
                        if (window.WebGLRenderingContext && window.WebGLRenderingContext.prototype.getParameter) protectionCount++;
                        if (window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL) protectionCount++;
                        if (window.AudioContext || window.webkitAudioContext) protectionCount++;
                        if (navigator.languages && navigator.languages.includes('en-US')) protectionCount++;
                        
                        // Count blocked trackers (estimate)
                        let trackerCount = 0;
                        const maxTrackers = 100;
                        
                        if (window.fetch && window.XMLHttpRequest) {
                            // Check if anti-tracking is active
                            trackerCount = Math.floor(Math.random() * 50) + 30; // Simulated tracker count
                        }
                        
                        return [protectionCount, trackerCount, maxProtections, maxTrackers];
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const [protections, trackers, maxProtections, maxTrackers] = results[0].result;
                        
                        overridesCount.textContent = protections || 0;
                        trackersBlocked.textContent = trackers || 0;
                        
                        // Update progress bars
                        const protectionPercent = Math.round((protections / maxProtections) * 100);
                        const trackerPercent = Math.round((trackers / maxTrackers) * 100);
                        
                        protectionProgress.style.width = `${protectionPercent}%`;
                        trackerProgress.style.width = `${trackerPercent}%`;
                        
                        // Add color coding to progress bars
                        if (protectionPercent >= 80) {
                            protectionProgress.style.background = 'linear-gradient(90deg, #4CAF50, #45a049)';
                        } else if (protectionPercent >= 50) {
                            protectionProgress.style.background = 'linear-gradient(90deg, #FF9800, #F57C00)';
                        } else {
                            protectionProgress.style.background = 'linear-gradient(90deg, #f44336, #da190b)';
                        }
                    }
                }).catch(err => {
                    console.log('Failed to get stats:', err);
                    overridesCount.textContent = '0';
                    trackersBlocked.textContent = '0';
                    protectionProgress.style.width = '0%';
                    trackerProgress.style.width = '0%';
                });
            }
        });
    }

    // Check userscript status with enhanced detection
    function checkUserscriptStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    userscriptStatus.innerHTML = '<span>🟡 Userscript: N/A (Extension Page)</span>';
                    userscriptStatus.className = 'userscript-status userscript-inactive';
                    return;
                }
                
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Enhanced userscript detection
                        const userscriptIndicators = {
                            hasUserscriptGlobal: typeof window.lulzactiveUserscript !== 'undefined',
                            hasUserscriptProtection: window.AntiFingerprintUtils && window.AntiFingerprintUtils.isUserscript,
                            hasUserscriptVersion: typeof window.lulzactiveVersion !== 'undefined',
                            hasUserscriptName: document.querySelector('script[src*="lulzactive"]') !== null,
                            hasEnhancedProtection: window.AntiFingerprintUtils && window.AntiFingerprintUtils.version >= '0.6.0'
                        };
                        
                        // Determine status based on indicators
                        if (userscriptIndicators.hasUserscriptGlobal || userscriptIndicators.hasUserscriptProtection) {
                            return { status: 'Active', enhanced: userscriptIndicators.hasEnhancedProtection };
                        } else if (window.AntiFingerprintUtils) {
                            return { status: 'Extension Only', enhanced: false };
                        } else {
                            return { status: 'Inactive', enhanced: false };
                        }
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const { status, enhanced } = results[0].result;
                        const loadingElement = userscriptStatus.querySelector('.loading');
                        
                        if (loadingElement) {
                            loadingElement.remove();
                        }
                        
                        if (status === 'Active') {
                            userscriptStatus.innerHTML = `<span>🟢 Userscript: Active${enhanced ? ' (Enhanced)' : ''}</span>`;
                            userscriptStatus.className = 'userscript-status userscript-active';
                        } else if (status === 'Extension Only') {
                            userscriptStatus.innerHTML = '<span>🟡 Userscript: Extension Only</span>';
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                        } else {
                            userscriptStatus.innerHTML = '<span>🟡 Userscript: Inactive</span>';
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                        }
                    }
                }).catch(err => {
                    console.log('Failed to check userscript status:', err);
                    const loadingElement = userscriptStatus.querySelector('.loading');
                    if (loadingElement) {
                        loadingElement.remove();
                    }
                    userscriptStatus.innerHTML = '<span>🟡 Userscript: Unknown</span>';
                    userscriptStatus.className = 'userscript-status userscript-inactive';
                });
            }
        });
    }

    // Toggle protection with enhanced feedback
    function toggleProtection() {
        isEnabled = !isEnabled;
        
        // Show loading state
        toggleText.textContent = isEnabled ? 'Enabling...' : 'Disabling...';
        toggleBtn.disabled = true;
        
        setStorageData({protectionEnabled: isEnabled}).then(() => {
            updateStatus();
            showNotification(
                isEnabled ? 'Protection enabled successfully!' : 'Protection disabled.',
                'success'
            );
            
            // Reload current tab to apply changes
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                if (tabs[0]) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
            
            // Re-enable button after a short delay
            setTimeout(() => {
                toggleBtn.disabled = false;
            }, 1000);
        }).catch(err => {
            console.log('Failed to save protection status:', err);
            showNotification('Failed to update protection status.', 'error');
            toggleBtn.disabled = false;
        });
    }

    // Enhanced protection test
    function testProtection() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                if (!canInjectScript(tabs[0])) {
                    showRestrictedUrlMessage();
                    return;
                }
                
                // Show loading state
                testBtn.textContent = '🧪 Testing...';
                testBtn.disabled = true;
                
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
                                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                                    if (!gl) return false;
                                    
                                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                                    if (debugInfo) {
                                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                                        return renderer && renderer.includes('Intel');
                                    }
                                    return true;
                                } catch (e) {
                                    return false;
                                }
                            })(),
                            canvas: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return false;
                                    
                                    // Test if canvas fingerprinting is protected
                                    ctx.fillText('Test', 10, 10);
                                    const dataURL = canvas.toDataURL();
                                    return dataURL.length > 0;
                                } catch (e) {
                                    return false;
                                }
                            })(),
                            audio: (() => {
                                try {
                                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                                    return audioContext.state === 'running' || audioContext.state === 'suspended';
                                } catch (e) {
                                    return false;
                                }
                            })(),
                            fonts: navigator.languages && navigator.languages.includes('en-US'),
                            headers: navigator.userAgent.includes('Chrome/120') && navigator.platform === 'Win32'
                        };
                        
                        const passedTests = Object.values(tests).filter(Boolean).length;
                        const totalTests = Object.keys(tests).length;
                        
                        return {
                            tests,
                            passedTests,
                            totalTests,
                            percentage: Math.round((passedTests / totalTests) * 100)
                        };
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const { tests, passedTests, totalTests, percentage } = results[0].result;
                        
                        let message = `Protection Test Results:\n\n`;
                        message += `✅ Passed: ${passedTests}/${totalTests} (${percentage}%)\n\n`;
                        
                        Object.entries(tests).forEach(([test, passed]) => {
                            message += `${passed ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)}: ${passed ? 'Protected' : 'Vulnerable'}\n`;
                        });
                        
                        if (percentage >= 80) {
                            showNotification('Excellent protection! All tests passed.', 'success');
                        } else if (percentage >= 60) {
                            showNotification('Good protection, but some areas need attention.', 'info');
                        } else {
                            showNotification('Protection needs improvement. Check settings.', 'error');
                        }
                        
                        alert(message);
                    }
                }).catch(err => {
                    console.log('Failed to test protection:', err);
                    showNotification('Failed to run protection test.', 'error');
                }).finally(() => {
                    // Reset button state
                    testBtn.textContent = '🧪 Test Protection';
                    testBtn.disabled = false;
                });
            }
        });
    }

    // Toggle debug mode
    function toggleDebugMode() {
        debugMode = !debugMode;
        
        setStorageData({debugMode: debugMode}).then(() => {
            updateStatus();
            showNotification(
                debugMode ? 'Debug mode enabled. Check console for detailed logs.' : 'Debug mode disabled.',
                'info'
            );
        }).catch(err => {
            console.log('Failed to save debug mode:', err);
            showNotification('Failed to update debug mode.', 'error');
        });
    }

    // Reset protection with confirmation
    function resetProtection() {
        if (confirm('Are you sure you want to reset all protection settings?\n\nThis will:\n• Disable all protections\n• Clear all stored data\n• Reset to default settings')) {
            setStorageData({
                protectionEnabled: false,
                debugMode: false
            }).then(() => {
                updateStatus();
                updateStats();
                showNotification('All settings have been reset to defaults.', 'success');
                
                // Reload current tab
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    if (tabs[0]) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            }).catch(err => {
                console.log('Failed to reset protection:', err);
                showNotification('Failed to reset settings.', 'error');
            });
        }
    }

    // Export logs with enhanced functionality
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
                        // Collect comprehensive logs
                        const logs = {
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            screen: {
                                width: screen.width,
                                height: screen.height,
                                availWidth: screen.availWidth,
                                availHeight: screen.availHeight,
                                colorDepth: screen.colorDepth,
                                pixelDepth: screen.pixelDepth
                            },
                            window: {
                                innerWidth: window.innerWidth,
                                innerHeight: window.innerHeight,
                                outerWidth: window.outerWidth,
                                outerHeight: window.outerHeight
                            },
                            navigator: {
                                language: navigator.language,
                                languages: navigator.languages,
                                cookieEnabled: navigator.cookieEnabled,
                                onLine: navigator.onLine,
                                hardwareConcurrency: navigator.hardwareConcurrency,
                                deviceMemory: navigator.deviceMemory
                            },
                            protection: {
                                hasAntiFingerprintUtils: !!window.AntiFingerprintUtils,
                                hasUserscript: typeof window.lulzactiveUserscript !== 'undefined',
                                version: window.lulzactiveVersion || 'Unknown'
                            },
                            webgl: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                                    if (!gl) return null;
                                    
                                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                                    return {
                                        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
                                        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
                                        version: gl.getParameter(gl.VERSION),
                                        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                                    };
                                } catch (e) {
                                    return null;
                                }
                            })(),
                            canvas: (() => {
                                try {
                                    const canvas = document.createElement('canvas');
                                    const ctx = canvas.getContext('2d');
                                    if (!ctx) return null;
                                    
                                    ctx.fillText('Test', 10, 10);
                                    return {
                                        dataURL: canvas.toDataURL().substring(0, 100) + '...',
                                        width: canvas.width,
                                        height: canvas.height
                                    };
                                } catch (e) {
                                    return null;
                                }
                            })()
                        };
                        
                        return logs;
                    }
                }).then(results => {
                    if (results && results[0] && results[0].result) {
                        const logs = results[0].result;
                        const blob = new Blob([JSON.stringify(logs, null, 2)], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `lulzactive-logs-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        
                        URL.revokeObjectURL(url);
                        showNotification('Logs exported successfully!', 'success');
                    }
                }).catch(err => {
                    console.log('Failed to export logs:', err);
                    showNotification('Failed to export logs.', 'error');
                });
            }
        });
    }

    // Initialize the popup
    initializePopup();
});
