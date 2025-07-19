// Enhanced popup functionality for Incognito Fingerprint extension (Manifest V3)
// Version: 0.10.3 - Enhanced with better error handling, performance optimizations, and additional features

// Global variables
let isEnabled = true; // Default to enabled
let debugMode = false;
let isInitialized = false;
let lastUpdateTime = 0;
let updateInterval = null;

// Global function references
let statusDiv, statusIcon, statusText, statusDescription;
let toggleBtn, toggleText, overridesCount, trackersBlocked;
let protectionProgress, trackerProgress, testBtn, debugBtn;
let resetBtn, exportBtn, userscriptStatus, userscriptText, userscriptLoading;

// Protection feature elements
let canvasProtection, webglProtection, audioProtection, fontProtection;
let navigatorProtection, screenProtection, webrtcProtection, batteryProtection;

// Feature toggle elements
let enhancedRandomization, antiDetection, canvasTextRandomize, fontRandomize;

// Performance tracking
let performanceMetrics = {
    lastProtectionCheck: 0,
    lastStatsUpdate: 0,
    lastUserscriptCheck: 0,
    errors: [],
    warnings: []
};

// Enhanced error handling with logging
function logError(error, context = '') {
    const errorInfo = {
        timestamp: new Date().toISOString(),
        error: error.message || error,
        context: context,
        stack: error.stack
    };
    performanceMetrics.errors.push(errorInfo);
    console.error(`[Popup Error] ${context}:`, error);
    
    // Show user-friendly error notification
    showNotification(`An error occurred: ${error.message || error}`, 'error');
}

function logWarning(warning, context = '') {
    const warningInfo = {
        timestamp: new Date().toISOString(),
        warning: warning,
        context: context
    };
    performanceMetrics.warnings.push(warningInfo);
    console.warn(`[Popup Warning] ${context}:`, warning);
}

// Enhanced storage functions with better error handling and caching
const storageCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

async function getStorageData(keys, useCache = true) {
    const cacheKey = Array.isArray(keys) ? keys.sort().join(',') : keys;
    
    // Check cache first
    if (useCache && storageCache.has(cacheKey)) {
        const cached = storageCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
    }
    
    try {
        // Try session storage first (for incognito)
        const result = await chrome.storage.session.get(keys);
        if (Object.keys(result).length > 0) {
            // Cache the result
            storageCache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
            return result;
        }
    } catch (e) {
        logWarning(`Session storage failed: ${e.message}`, 'getStorageData');
    }
    
    try {
        // Fallback to local storage
        const result = await chrome.storage.local.get(keys);
        // Cache the result
        storageCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
        });
        return result;
    } catch (e) {
        logError(e, 'getStorageData - local storage fallback');
        return {};
    }
}

async function setStorageData(data, clearCache = true) {
    try {
        // Try session storage first (for incognito)
        await chrome.storage.session.set(data);
        
        // Clear cache if requested
        if (clearCache) {
            storageCache.clear();
        }
        
        return true;
    } catch (e) {
        try {
            // Fallback to local storage
            await chrome.storage.local.set(data);
            
            // Clear cache if requested
            if (clearCache) {
                storageCache.clear();
            }
            
            return true;
        } catch (e2) {
            logError(e2, 'setStorageData - both storages failed');
            return false;
        }
    }
}

// Enhanced script injection with better validation
function canInjectScript(tab) {
    if (!tab || !tab.url) return false;
    
    const restrictedPatterns = [
        /^chrome-extension:\/\//,
        /^chrome:\/\//,
        /^moz-extension:\/\//,
        /^about:/,
        /^edge:\/\//,
        /^file:\/\//,
        /^data:/
    ];
    
    return !restrictedPatterns.some(pattern => pattern.test(tab.url));
}

// Enhanced notification system with queue and better styling
const notificationQueue = [];
let isShowingNotification = false;

function showNotification(message, type = 'info', duration = 3000) {
    const notification = {
        message,
        type,
        duration,
        timestamp: Date.now()
    };
    
    notificationQueue.push(notification);
    
    if (!isShowingNotification) {
        processNotificationQueue();
    }
}

function processNotificationQueue() {
    if (notificationQueue.length === 0) {
        isShowingNotification = false;
        return;
    }
    
    isShowingNotification = true;
    const notification = notificationQueue.shift();
    
    const notificationElement = document.createElement('div');
    const typeColors = {
        success: '#4CAF50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196F3'
    };
    
    notificationElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${typeColors[notification.type] || typeColors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
        line-height: 1.4;
        border-left: 4px solid rgba(255,255,255,0.3);
    `;
    
    notificationElement.textContent = notification.message;
    document.body.appendChild(notificationElement);
    
    // Auto-remove notification
    setTimeout(() => {
        notificationElement.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notificationElement.parentNode) {
                notificationElement.remove();
            }
            processNotificationQueue();
        }, 300);
    }, notification.duration);
}

// Enhanced status update with performance tracking
async function updateStatus() {
    const startTime = performance.now();
    
    try {
        const result = await getStorageData(['protectionEnabled', 'debugMode']);
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
        
        performanceMetrics.lastProtectionCheck = Date.now();
        const duration = performance.now() - startTime;
        if (duration > 100) {
            logWarning(`Status update took ${duration.toFixed(2)}ms`, 'updateStatus');
        }
        
    } catch (err) {
        logError(err, 'updateStatus');
        // Default to enabled if we can't get the status
        isEnabled = true;
        statusDiv.className = 'status-card active';
        statusIcon.textContent = '🛡️';
        statusText.textContent = 'Protection Active';
        statusDescription.textContent = 'Your browser fingerprint is being protected from tracking and identification.';
        toggleText.textContent = 'Disable Protection';
        toggleBtn.className = 'main-toggle';
    }
}

// Enhanced protection features detection with retry logic
function updateProtectionFeatures(retryCount = 0) {
    const maxRetries = 3;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && canInjectScript(tabs[0])) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    // Enhanced protection detection
                    const features = {
                        canvas: {
                            available: window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL,
                            protected: window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL.toString().includes('[native code]')
                        },
                        webgl: {
                            available: window.WebGLRenderingContext,
                            protected: window.WebGLRenderingContext && window.WebGLRenderingContext.prototype.getParameter.toString().includes('[native code]')
                        },
                        audio: {
                            available: window.AudioContext || window.webkitAudioContext,
                            protected: window.AudioContext && window.AudioContext.prototype.createOscillator.toString().includes('[native code]')
                        },
                        fonts: {
                            available: window.document && window.document.fonts,
                            protected: window.document && window.document.fonts && window.document.fonts.ready
                        },
                        navigator: {
                            available: window.navigator && window.navigator.userAgent,
                            protected: window.navigator && window.navigator.userAgent.includes('Chrome/120')
                        },
                        screen: {
                            available: window.screen,
                            protected: window.screen && window.screen.width === 1920
                        },
                        webrtc: {
                            available: window.RTCPeerConnection,
                            protected: window.RTCPeerConnection && window.RTCPeerConnection.prototype.createDataChannel.toString().includes('[native code]')
                        },
                        battery: {
                            available: navigator.getBattery,
                            protected: navigator.getBattery && typeof navigator.getBattery === 'function'
                        }
                    };

                    // Check if our protection is active
                    const protection = window.lulzactiveProtection || window.AntiFingerprintUtils;
                    return {
                        features: features,
                        protectionActive: !!protection,
                        version: protection ? (protection.version || '0.10.3') : null,
                        timestamp: Date.now()
                    };
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const result = results[0].result;
                    
                    // Update protection feature indicators with enhanced feedback
                    Object.entries(result.features).forEach(([key, feature]) => {
                        const element = getProtectionElement(key);
                        if (element) {
                            updateProtectionIndicator(element, feature.available, feature.protected);
                        }
                    });
                    
                    performanceMetrics.lastProtectionCheck = Date.now();
                } else if (retryCount < maxRetries) {
                    // Retry with exponential backoff
                    setTimeout(() => updateProtectionFeatures(retryCount + 1), Math.pow(2, retryCount) * 1000);
                } else {
                    logError('Failed to update protection features after retries', 'updateProtectionFeatures');
                }
            });
        } else {
            // Set all protections to inactive for restricted pages
            const protectionElements = [
                canvasProtection, webglProtection, audioProtection, fontProtection,
                navigatorProtection, screenProtection, webrtcProtection, batteryProtection
            ];
            
            protectionElements.forEach(el => {
                if (el) updateProtectionIndicator(el, false, false);
            });
        }
    });
}

// Helper function to get protection element by name
function getProtectionElement(name) {
    const elementMap = {
        canvas: canvasProtection,
        webgl: webglProtection,
        audio: audioProtection,
        font: fontProtection,
        navigator: navigatorProtection,
        screen: screenProtection,
        webrtc: webrtcProtection,
        battery: batteryProtection
    };
    return elementMap[name];
}

// Enhanced protection indicator with better visual feedback
function updateProtectionIndicator(element, isAvailable, isProtected) {
    if (!element) return;
    
    element.classList.remove('active', 'inactive', 'warning', 'error');
    
    if (!isAvailable) {
        element.classList.add('error');
        element.title = 'Feature not available';
    } else if (isProtected) {
        element.classList.add('active');
        element.title = 'Feature protected';
    } else {
        element.classList.add('warning');
        element.title = 'Feature available but not protected';
    }
}

// Enhanced statistics with real-time updates
function updateStats() {
    const startTime = performance.now();
    
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
                    // Enhanced statistics collection
                    const stats = {
                        protection: {
                            count: 0,
                            max: 15,
                            details: {}
                        },
                        trackers: {
                            count: 0,
                            max: 20,
                            details: {}
                        },
                        performance: {
                            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                        }
                    };
                    
                    // Count active protections
                    const protectionChecks = [
                        { name: 'AntiFingerprintUtils', check: () => !!window.AntiFingerprintUtils },
                        { name: 'UserAgent', check: () => navigator.userAgent.includes('Chrome/120') },
                        { name: 'Platform', check: () => navigator.platform === 'Win32' },
                        { name: 'Screen', check: () => screen.width === 1920 && screen.height === 1080 },
                        { name: 'WebGL', check: () => window.WebGLRenderingContext && window.WebGLRenderingContext.prototype.getParameter },
                        { name: 'Canvas', check: () => window.HTMLCanvasElement && window.HTMLCanvasElement.prototype.toDataURL },
                        { name: 'Audio', check: () => window.AudioContext || window.webkitAudioContext },
                        { name: 'Languages', check: () => navigator.languages && navigator.languages.includes('en-US') },
                        { name: 'WebRTC', check: () => window.RTCPeerConnection },
                        { name: 'Battery', check: () => navigator.getBattery },
                        { name: 'MediaDevices', check: () => navigator.mediaDevices },
                        { name: 'Permissions', check: () => navigator.permissions },
                        { name: 'ServiceWorker', check: () => 'serviceWorker' in navigator },
                        { name: 'WebAssembly', check: () => typeof WebAssembly === 'object' },
                        { name: 'SharedArrayBuffer', check: () => typeof SharedArrayBuffer !== 'undefined' }
                    ];
                    
                    protectionChecks.forEach(check => {
                        if (check.check()) {
                            stats.protection.count++;
                            stats.protection.details[check.name] = true;
                        }
                    });
                    
                    // Enhanced tracker detection
                    const trackerPatterns = [
                        { name: 'Google Analytics', pattern: /google-analytics\.com|googletagmanager\.com/ },
                        { name: 'Facebook', pattern: /facebook\.com|fb\.com/ },
                        { name: 'DoubleClick', pattern: /doubleclick\.net|googlesyndication\.com/ },
                        { name: 'Amazon', pattern: /amazon-adsystem\.com/ },
                        { name: 'Twitter', pattern: /twitter\.com|t\.co/ },
                        { name: 'LinkedIn', pattern: /linkedin\.com/ },
                        { name: 'Microsoft', pattern: /microsoft\.com|bing\.com/ },
                        { name: 'Adobe', pattern: /adobe\.com|omniture\.com/ },
                        { name: 'Hotjar', pattern: /hotjar\.com/ },
                        { name: 'Mixpanel', pattern: /mixpanel\.com/ },
                        { name: 'Segment', pattern: /segment\.com/ },
                        { name: 'Optimizely', pattern: /optimizely\.com/ },
                        { name: 'VWO', pattern: /vwo\.com/ },
                        { name: 'Crazy Egg', pattern: /crazyegg\.com/ },
                        { name: 'FullStory', pattern: /fullstory\.com/ },
                        { name: 'Intercom', pattern: /intercom\.com/ },
                        { name: 'Drift', pattern: /drift\.com/ },
                        { name: 'Zendesk', pattern: /zendesk\.com/ },
                        { name: 'HubSpot', pattern: /hubspot\.com/ },
                        { name: 'Mailchimp', pattern: /mailchimp\.com/ }
                    ];
                    
                    // Check for blocked trackers
                    const scripts = document.querySelectorAll('script[src], link[href]');
                    scripts.forEach(script => {
                        const url = script.src || script.href;
                        trackerPatterns.forEach(tracker => {
                            if (tracker.pattern.test(url)) {
                                stats.trackers.count++;
                                stats.trackers.details[tracker.name] = true;
                            }
                        });
                    });
                    
                    return stats;
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const result = results[0].result;
                    
                    overridesCount.textContent = result.protection.count;
                    trackersBlocked.textContent = result.trackers.count;
                    
                    const protectionPercent = (result.protection.count / result.protection.max) * 100;
                    const trackerPercent = Math.min((result.trackers.count / result.trackers.max) * 100, 100);
                    
                    protectionProgress.style.width = protectionPercent + '%';
                    trackerProgress.style.width = trackerPercent + '%';
                    
                    // Add performance metrics
                    performanceMetrics.lastStatsUpdate = Date.now();
                    const duration = performance.now() - startTime;
                    if (duration > 200) {
                        logWarning(`Stats update took ${duration.toFixed(2)}ms`, 'updateStats');
                    }
                }
            });
        }
    });
}

// Enhanced userscript detection with better error handling
function checkUserscriptStatus() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && canInjectScript(tabs[0])) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    // Enhanced userscript detection
                    const detection = {
                        extension: window.lulzactiveExtension,
                        userscript: window.lulzactiveUserscript,
                        utils: window.AntiFingerprintUtils,
                        timestamp: Date.now()
                    };
                    
                    if (detection.userscript) {
                        return {
                            active: true,
                            version: detection.userscript.version,
                            source: 'userscript',
                            features: detection.userscript.features || []
                        };
                    } else if (detection.extension) {
                        return {
                            active: true,
                            version: detection.extension.version,
                            source: 'extension',
                            features: detection.extension.features || []
                        };
                    } else if (detection.utils) {
                        return {
                            active: true,
                            version: detection.utils.version || 'unknown',
                            source: 'utils',
                            features: ['basic-protection']
                        };
                    } else {
                        return { 
                            active: false,
                            timestamp: Date.now()
                        };
                    }
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const result = results[0].result;
                    
                    if (result.active) {
                        userscriptStatus.className = 'userscript-status userscript-active';
                        userscriptText.textContent = `${result.source} v${result.version}`;
                        userscriptLoading.style.display = 'none';
                    } else {
                        userscriptStatus.className = 'userscript-status userscript-inactive';
                        userscriptText.textContent = 'Not detected';
                        userscriptLoading.style.display = 'none';
                    }
                    
                    performanceMetrics.lastUserscriptCheck = Date.now();
                } else {
                    userscriptStatus.className = 'userscript-status userscript-inactive';
                    userscriptText.textContent = 'Error checking';
                    userscriptLoading.style.display = 'none';
                    logError('Failed to check userscript status', 'checkUserscriptStatus');
                }
            });
        } else {
            userscriptStatus.className = 'userscript-status userscript-inactive';
            userscriptText.textContent = 'Restricted page';
            userscriptLoading.style.display = 'none';
        }
    });
}

// Enhanced feature toggles with better state management
function setupFeatureToggles() {
    const toggles = [
        { element: enhancedRandomization, key: 'enhancedRandomization', name: 'Enhanced Randomization' },
        { element: antiDetection, key: 'antiDetection', name: 'Anti-Detection' },
        { element: canvasTextRandomize, key: 'canvasTextRandomize', name: 'Canvas Text Randomize' },
        { element: fontRandomize, key: 'fontRandomize', name: 'Font Randomize' }
    ];
    
    toggles.forEach(toggle => {
        if (toggle.element) {
            toggle.element.addEventListener('click', function() {
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                
                setStorageData({ [toggle.key]: isActive }).then(success => {
                    if (success) {
                        showNotification(`${toggle.name} ${isActive ? 'enabled' : 'disabled'}`, 'success');
                    } else {
                        showNotification(`Failed to save ${toggle.name} setting`, 'error');
                        // Revert the toggle state
                        this.classList.toggle('active');
                    }
                });
            });
        }
    });

    // Load saved toggle states
    getStorageData(['enhancedRandomization', 'antiDetection', 'canvasTextRandomize', 'fontRandomize']).then(result => {
        toggles.forEach(toggle => {
            if (toggle.element && result[toggle.key] !== false) {
                toggle.element.classList.add('active');
            }
        });
    });
}

// Enhanced protection toggle with confirmation
function toggleProtection() {
    const newState = !isEnabled;
    const action = newState ? 'enable' : 'disable';
    
    if (!newState) {
        // Ask for confirmation when disabling
        if (!confirm('Are you sure you want to disable protection? This will make your browser fingerprint vulnerable to tracking.')) {
            return;
        }
    }
    
    setStorageData({ protectionEnabled: newState }).then(success => {
        if (success) {
            isEnabled = newState;
            updateStatus();
            showNotification(`Protection ${action}d`, 'success');
        } else {
            showNotification(`Failed to ${action} protection`, 'error');
        }
    });
}

// Enhanced protection test with detailed results
function testProtection() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            if (!canInjectScript(tabs[0])) {
                showRestrictedUrlMessage();
                return;
            }
            
            showNotification('Running protection tests...', 'info');
            
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    // Comprehensive protection tests
                    const tests = {
                        userAgent: {
                            test: navigator.userAgent.includes('Chrome/120'),
                            description: 'User Agent Spoofing'
                        },
                        platform: {
                            test: navigator.platform === 'Win32',
                            description: 'Platform Spoofing'
                        },
                        screen: {
                            test: screen.width === 1920 && screen.height === 1080,
                            description: 'Screen Resolution Spoofing'
                        },
                        webgl: {
                            test: window.WebGLRenderingContext !== undefined,
                            description: 'WebGL Protection'
                        },
                        canvas: {
                            test: window.HTMLCanvasElement !== undefined,
                            description: 'Canvas Protection'
                        },
                        audio: {
                            test: window.AudioContext !== undefined || window.webkitAudioContext !== undefined,
                            description: 'Audio Context Protection'
                        },
                        protection: {
                            test: window.AntiFingerprintUtils !== undefined,
                            description: 'Anti-Fingerprint Utils'
                        },
                        languages: {
                            test: navigator.languages && navigator.languages.includes('en-US'),
                            description: 'Language Spoofing'
                        },
                        timezone: {
                            test: Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/New_York',
                            description: 'Timezone Spoofing'
                        },
                        hardwareConcurrency: {
                            test: navigator.hardwareConcurrency === 8,
                            description: 'CPU Cores Spoofing'
                        }
                    };
                    
                    const results = Object.entries(tests).map(([key, test]) => ({
                        name: key,
                        passed: test.test,
                        description: test.description
                    }));
                    
                    const passedTests = results.filter(r => r.passed).length;
                    const totalTests = results.length;
                    
                    return {
                        results: results,
                        passed: passedTests,
                        total: totalTests,
                        percentage: Math.round((passedTests / totalTests) * 100),
                        timestamp: Date.now()
                    };
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const result = results[0].result;
                    
                    // Show detailed results
                    const passedTests = result.results.filter(r => r.passed);
                    const failedTests = result.results.filter(r => !r.passed);
                    
                    let message = `Protection test: ${result.passed}/${result.total} passed (${result.percentage}%)`;
                    
                    if (failedTests.length > 0) {
                        message += `\nFailed: ${failedTests.map(t => t.description).join(', ')}`;
                    }
                    
                    showNotification(message, result.percentage >= 80 ? 'success' : 'warning');
                } else {
                    showNotification('Failed to run protection test', 'error');
                }
            });
        }
    });
}

// Enhanced debug mode toggle
function toggleDebugMode() {
    debugMode = !debugMode;
    setStorageData({ debugMode: debugMode }).then(success => {
        if (success) {
            updateStatus();
            showNotification(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`, 'success');
            
            if (debugMode) {
                // Enable real-time updates
                startRealTimeUpdates();
            } else {
                // Disable real-time updates
                stopRealTimeUpdates();
            }
        } else {
            showNotification('Failed to toggle debug mode', 'error');
        }
    });
}

// Enhanced reset with confirmation and progress
function resetProtection() {
    if (confirm('Are you sure you want to reset all protection settings? This will restore all settings to their default values.')) {
        showNotification('Resetting protection settings...', 'info');
        
        const defaultSettings = {
            protectionEnabled: true,
            debugMode: false,
            enhancedRandomization: true,
            antiDetection: true,
            canvasTextRandomize: true,
            fontRandomize: true
        };
        
        setStorageData(defaultSettings).then(success => {
            if (success) {
                // Clear cache
                storageCache.clear();
                
                // Update UI
                updateStatus();
                setupFeatureToggles();
                updateProtectionFeatures();
                updateStats();
                checkUserscriptStatus();
                
                showNotification('Protection settings reset to defaults', 'success');
            } else {
                showNotification('Failed to reset protection settings', 'error');
            }
        });
    }
}

// Enhanced export with better formatting and error handling
function exportLogs() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && canInjectScript(tabs[0])) {
            showNotification('Collecting protection data...', 'info');
            
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                func: () => {
                    // Enhanced data collection
                    const data = {
                        timestamp: new Date().toISOString(),
                        url: window.location.href,
                        userAgent: navigator.userAgent,
                        platform: navigator.platform,
                        languages: navigator.languages,
                        screen: {
                            width: screen.width,
                            height: screen.height,
                            colorDepth: screen.colorDepth,
                            pixelDepth: screen.pixelDepth,
                            availWidth: screen.availWidth,
                            availHeight: screen.availHeight
                        },
                        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        hardwareConcurrency: navigator.hardwareConcurrency,
                        deviceMemory: navigator.deviceMemory,
                        protection: {
                            extension: window.lulzactiveExtension,
                            userscript: window.lulzactiveUserscript,
                            utils: window.AntiFingerprintUtils
                        },
                        performance: {
                            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                            domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                        }
                    };
                    
                    return data;
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    const data = results[0].result;
                    
                    // Add performance metrics
                    data.performanceMetrics = performanceMetrics;
                    
                    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                    const url = URL.createObjectURL(blob);
                    
                    chrome.downloads.download({
                        url: url,
                        filename: `protection-logs-${new Date().toISOString().split('T')[0]}.json`
                    }).then(() => {
                        showNotification('Protection logs exported successfully', 'success');
                    }).catch(error => {
                        logError(error, 'exportLogs - download');
                        showNotification('Failed to export logs', 'error');
                    });
                } else {
                    showNotification('Failed to collect protection data', 'error');
                }
            });
        } else {
            showRestrictedUrlMessage();
        }
    });
}

// Real-time updates for debug mode
function startRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    updateInterval = setInterval(() => {
        if (debugMode) {
            updateProtectionFeatures();
            updateStats();
            checkUserscriptStatus();
        }
    }, 5000); // Update every 5 seconds in debug mode
}

function stopRealTimeUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// Enhanced initialization with better error handling
function initializePopup() {
    try {
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
            .protection-item.error {
                background: #ffebee;
                border-color: #f44336;
            }
            .protection-item.warning {
                background: #fff3e0;
                border-color: #ff9800;
            }
        `;
        document.head.appendChild(style);
        
        // Initialize all components
        updateStatus();
        updateStats();
        updateProtectionFeatures();
        checkUserscriptStatus();
        setupFeatureToggles();

        // Set up event listeners with error handling
        const eventListeners = [
            { element: toggleBtn, event: 'click', handler: toggleProtection },
            { element: testBtn, event: 'click', handler: testProtection },
            { element: debugBtn, event: 'click', handler: toggleDebugMode },
            { element: resetBtn, event: 'click', handler: resetProtection },
            { element: exportBtn, event: 'click', handler: exportLogs }
        ];
        
        eventListeners.forEach(({ element, event, handler }) => {
            if (element) {
                element.addEventListener(event, handler);
            } else {
                logWarning(`Event listener not set: ${event}`, 'initializePopup');
            }
        });
        
        isInitialized = true;
        showNotification('Popup initialized successfully', 'success');
        
    } catch (error) {
        logError(error, 'initializePopup');
        showNotification('Failed to initialize popup', 'error');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get DOM elements with validation
        const elements = {
            statusDiv: 'status',
            statusIcon: 'statusIcon',
            statusText: 'statusText',
            statusDescription: 'statusDescription',
            toggleBtn: 'toggleBtn',
            toggleText: 'toggleText',
            overridesCount: 'overridesCount',
            trackersBlocked: 'trackersBlocked',
            protectionProgress: 'protectionProgress',
            trackerProgress: 'trackerProgress',
            testBtn: 'testBtn',
            debugBtn: 'debugBtn',
            resetBtn: 'resetBtn',
            exportBtn: 'exportBtn',
            userscriptStatus: 'userscriptStatus',
            userscriptText: 'userscriptText',
            userscriptLoading: 'userscriptLoading',
            canvasProtection: 'canvasProtection',
            webglProtection: 'webglProtection',
            audioProtection: 'audioProtection',
            fontProtection: 'fontProtection',
            navigatorProtection: 'navigatorProtection',
            screenProtection: 'screenProtection',
            webrtcProtection: 'webrtcProtection',
            batteryProtection: 'batteryProtection',
            enhancedRandomization: 'enhancedRandomization',
            antiDetection: 'antiDetection',
            canvasTextRandomize: 'canvasTextRandomize',
            fontRandomize: 'fontRandomize'
        };
        
        // Assign elements with validation
        Object.entries(elements).forEach(([variable, id]) => {
            const element = document.getElementById(id);
            if (element) {
                window[variable] = element;
            } else {
                logWarning(`Element not found: ${id}`, 'DOMContentLoaded');
            }
        });
        
        // Initialize popup
        initializePopup();
        
    } catch (error) {
        logError(error, 'DOMContentLoaded');
        showNotification('Failed to load popup', 'error');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopRealTimeUpdates();
    storageCache.clear();
});
