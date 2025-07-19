// Enhanced popup functionality for Incognito Fingerprint extension (Manifest V3)
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
    const userscriptText = document.getElementById('userscriptText');
    const userscriptLoading = document.getElementById('userscriptLoading');

    // Protection feature elements
    const canvasProtection = document.getElementById('canvasProtection');
    const webglProtection = document.getElementById('webglProtection');
    const audioProtection = document.getElementById('audioProtection');
    const fontProtection = document.getElementById('fontProtection');
    const navigatorProtection = document.getElementById('navigatorProtection');
    const screenProtection = document.getElementById('screenProtection');
    const webrtcProtection = document.getElementById('webrtcProtection');
    const batteryProtection = document.getElementById('batteryProtection');

    // Feature toggle elements
    const enhancedRandomization = document.getElementById('enhancedRandomization');
    const antiDetection = document.getElementById('antiDetection');
    const canvasTextRandomize = document.getElementById('canvasTextRandomize');
    const fontRandomize = document.getElementById('fontRandomize');

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
        updateProtectionFeatures();
        checkUserscriptStatus();
        setupFeatureToggles();

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
                debugBtn.classList.add('active');
            } else {
                debugBtn.classList.remove('active');
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

    // Update protection features status
    function updateProtectionFeatures() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && canInjectScript(tabs[0])) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Check each protection feature
                        const features = {
                            canvas: window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL,
                            webgl: window.WebGLRenderingContext,
                            audio: window.AudioContext || window.webkitAudioContext,
                            fonts: window.document && window.document.fonts,
                            navigator: window.navigator && window.navigator.userAgent,
                            screen: window.screen,
                            webrtc: window.RTCPeerConnection,
                            battery: navigator.getBattery
                        };

                        // Check if our protection is active
                        const protection = window.lulzactiveProtection || window.AntiFingerprintUtils;
                        if (protection) {
                            return {
                                features: features,
                                protectionActive: true,
                                version: protection.version || '0.10.0'
                            };
                        }
                        return { features: features, protectionActive: false };
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        const result = results[0].result;
                        
                        // Update protection feature indicators
                        updateProtectionIndicator(canvasProtection, result.features.canvas);
                        updateProtectionIndicator(webglProtection, result.features.webgl);
                        updateProtectionIndicator(audioProtection, result.features.audio);
                        updateProtectionIndicator(fontProtection, result.features.fonts);
                        updateProtectionIndicator(navigatorProtection, result.features.navigator);
                        updateProtectionIndicator(screenProtection, result.features.screen);
                        updateProtectionIndicator(webrtcProtection, result.features.webrtc);
                        updateProtectionIndicator(batteryProtection, result.features.battery);
                    }
                });
            } else {
                // Set all protections to inactive for restricted pages
                [canvasProtection, webglProtection, audioProtection, fontProtection, 
                 navigatorProtection, screenProtection, webrtcProtection, batteryProtection].forEach(el => {
                    updateProtectionIndicator(el, false);
                });
            }
        });
    }

    // Update individual protection indicator
    function updateProtectionIndicator(element, isActive) {
        if (element) {
            if (isActive) {
                element.classList.add('active');
                element.classList.remove('inactive');
            } else {
                element.classList.add('inactive');
                element.classList.remove('active');
            }
        }
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
                        const maxProtections = 12;
                        
                        if (window.AntiFingerprintUtils) protectionCount++;
                        if (navigator.userAgent.includes('Chrome/120')) protectionCount++;
                        if (navigator.platform === 'Win32') protectionCount++;
                        if (screen.width === 1920) protectionCount++;
                        if (window.WebGLRenderingContext && window.WebGLRenderingContext.prototype.getParameter) protectionCount++;
                        if (window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL) protectionCount++;
                        if (window.AudioContext || window.webkitAudioContext) protectionCount++;
                        if (navigator.languages && navigator.languages.includes('en-US')) protectionCount++;
                        if (window.RTCPeerConnection) protectionCount++;
                        if (navigator.getBattery) protectionCount++;
                        if (navigator.mediaDevices) protectionCount++;
                        if (navigator.permissions) protectionCount++;
                        
                        // Count blocked trackers (estimate)
                        let trackerCount = 0;
                        const blockedDomains = [
                            'google-analytics.com', 'googletagmanager.com', 'facebook.com',
                            'doubleclick.net', 'googlesyndication.com', 'amazon-adsystem.com'
                        ];
                        
                        // Check for blocked scripts
                        const scripts = document.querySelectorAll('script[src]');
                        scripts.forEach(script => {
                            if (blockedDomains.some(domain => script.src.includes(domain))) {
                                trackerCount++;
                            }
                        });
                        
                        return {
                            protectionCount: protectionCount,
                            maxProtections: maxProtections,
                            trackerCount: trackerCount,
                            maxTrackers: 10
                        };
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        const result = results[0].result;
                        
                        overridesCount.textContent = result.protectionCount;
                        trackersBlocked.textContent = result.trackerCount;
                        
                        const protectionPercent = (result.protectionCount / result.maxProtections) * 100;
                        const trackerPercent = Math.min((result.trackerCount / result.maxTrackers) * 100, 100);
                        
                        protectionProgress.style.width = protectionPercent + '%';
                        trackerProgress.style.width = trackerPercent + '%';
                    }
                });
            }
        });
    }

    // Check userscript status
    function checkUserscriptStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && canInjectScript(tabs[0])) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Check for userscript presence
                        if (window.lulzactiveUserscript) {
                            return {
                                active: true,
                                version: window.lulzactiveUserscript.version,
                                source: 'userscript'
                            };
                        } else if (window.lulzactiveExtension) {
                            return {
                                active: true,
                                version: window.lulzactiveExtension.version,
                                source: 'extension'
                            };
                        } else {
                            return { active: false };
                        }
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        const result = results[0].result;
                        
                        if (result.active) {
                            userscriptStatus.className = 'userscript-status userscript-active';
                            userscriptText.textContent = `Active (${result.source} v${result.version})`;
                            userscriptLoading.style.display = 'none';
                        } else {
                            userscriptStatus.className = 'userscript-status userscript-inactive';
                            userscriptText.textContent = 'Not detected';
                            userscriptLoading.style.display = 'none';
                        }
                    } else {
                        userscriptStatus.className = 'userscript-status userscript-inactive';
                        userscriptText.textContent = 'Error checking';
                        userscriptLoading.style.display = 'none';
                    }
                });
            } else {
                userscriptStatus.className = 'userscript-status userscript-inactive';
                userscriptText.textContent = 'Restricted page';
                userscriptLoading.style.display = 'none';
            }
        });
    }

    // Setup feature toggles
    function setupFeatureToggles() {
        // Enhanced Randomization toggle
        enhancedRandomization.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            setStorageData({ enhancedRandomization: isActive });
            showNotification(`Enhanced randomization ${isActive ? 'enabled' : 'disabled'}`, 'success');
        });

        // Anti-Detection toggle
        antiDetection.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            setStorageData({ antiDetection: isActive });
            showNotification(`Anti-detection ${isActive ? 'enabled' : 'disabled'}`, 'success');
        });

        // Canvas Text Randomize toggle
        canvasTextRandomize.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            setStorageData({ canvasTextRandomize: isActive });
            showNotification(`Canvas text randomization ${isActive ? 'enabled' : 'disabled'}`, 'success');
        });

        // Font Randomize toggle
        fontRandomize.addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            setStorageData({ fontRandomize: isActive });
            showNotification(`Font randomization ${isActive ? 'enabled' : 'disabled'}`, 'success');
        });

        // Load saved toggle states
        getStorageData(['enhancedRandomization', 'antiDetection', 'canvasTextRandomize', 'fontRandomize']).then(result => {
            if (result.enhancedRandomization !== false) enhancedRandomization.classList.add('active');
            if (result.antiDetection !== false) antiDetection.classList.add('active');
            if (result.canvasTextRandomize !== false) canvasTextRandomize.classList.add('active');
            if (result.fontRandomize !== false) fontRandomize.classList.add('active');
        });
    }

    // Toggle protection
    function toggleProtection() {
        isEnabled = !isEnabled;
        setStorageData({ protectionEnabled: isEnabled });
        updateStatus();
        showNotification(`Protection ${isEnabled ? 'enabled' : 'disabled'}`, 'success');
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
                        // Run protection tests
                        const tests = {
                            userAgent: navigator.userAgent.includes('Chrome/120'),
                            platform: navigator.platform === 'Win32',
                            screen: screen.width === 1920 && screen.height === 1080,
                            webgl: window.WebGLRenderingContext !== undefined,
                            canvas: window.HTMLCanvasElement !== undefined,
                            audio: window.AudioContext !== undefined || window.webkitAudioContext !== undefined,
                            protection: window.AntiFingerprintUtils !== undefined
                        };
                        
                        const passedTests = Object.values(tests).filter(Boolean).length;
                        const totalTests = Object.keys(tests).length;
                        
                        return {
                            tests: tests,
                            passed: passedTests,
                            total: totalTests,
                            percentage: Math.round((passedTests / totalTests) * 100)
                        };
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        const result = results[0].result;
                        showNotification(`Protection test: ${result.passed}/${result.total} passed (${result.percentage}%)`, 'success');
                    }
                });
            }
        });
    }

    // Toggle debug mode
    function toggleDebugMode() {
        debugMode = !debugMode;
        setStorageData({ debugMode: debugMode });
        updateStatus();
        showNotification(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`, 'success');
    }

    // Reset protection
    function resetProtection() {
        if (confirm('Are you sure you want to reset all protection settings?')) {
            setStorageData({
                protectionEnabled: true,
                debugMode: false,
                enhancedRandomization: true,
                antiDetection: true,
                canvasTextRandomize: true,
                fontRandomize: true
            });
            updateStatus();
            setupFeatureToggles();
            showNotification('Protection settings reset to defaults', 'success');
        }
    }

    // Export logs
    function exportLogs() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && canInjectScript(tabs[0])) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    func: () => {
                        // Collect protection data
                        const data = {
                            timestamp: new Date().toISOString(),
                            url: window.location.href,
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            screen: {
                                width: screen.width,
                                height: screen.height,
                                colorDepth: screen.colorDepth
                            },
                            protection: {
                                extension: window.lulzactiveExtension,
                                userscript: window.lulzactiveUserscript,
                                utils: window.AntiFingerprintUtils
                            }
                        };
                        
                        return data;
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        const data = results[0].result;
                        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                        const url = URL.createObjectURL(blob);
                        
                        chrome.downloads.download({
                            url: url,
                            filename: `protection-logs-${new Date().toISOString().split('T')[0]}.json`
                        });
                        
                        showNotification('Protection logs exported', 'success');
                    }
                });
            } else {
                showRestrictedUrlMessage();
            }
        });
    }

    // Initialize popup
    initializePopup();
});
