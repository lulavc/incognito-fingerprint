// background.js - Enhanced anti-fingerprinting background service worker

// Handles initial setup and default settings when the extension is installed or updated.
function handleInstalled() {
  console.log('lulzactive: Extension installed/updated');
  
  // Set basic privacy preferences for WebRTC IP handling - only in regular context
  try {
    chrome.privacy.network.webRTCIPHandlingPolicy.set({
      value: 'disable_non_proxied_udp'
    }).catch((error) => {
      // Ignore errors in incognito context
      console.log('WebRTC policy setting skipped (incognito context):', error.message);
    });
  } catch (e) {
    // Ignore errors in incognito context
    console.log('WebRTC policy setting skipped (incognito context):', e.message);
  }

  // Initialize storage with default feature settings - use session storage for incognito
  const defaultSettings = {
    enabledFeatures: {
      webRTC: true,
      headers: true,
      canvas: true,
      webgl: true,
      audio: true,
      font: true,
      navigator: true,
      screen: true,
      antiTracking: true
    },
    profile: {
      id: 'Chrome 120 - Win10',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      platform: 'Win32',
      language: 'en-US'
    }
  };

  // Try to use session storage first (for incognito), fallback to local storage
  try {
    chrome.storage.session.set(defaultSettings).catch(() => {
      // Fallback to local storage if session storage fails
      chrome.storage.local.set(defaultSettings);
    });
  } catch (e) {
    // If session storage is not available, use local storage
    chrome.storage.local.set(defaultSettings);
  }
}

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

// Enhanced header spoofing with better synchronization
function handleBeforeSendHeaders(details) {
  const headers = details.requestHeaders || [];
  
  // Force consistent headers for Chrome/Windows profile (matching JS spoofing)
  const forcedHeaders = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    acceptLanguage: 'en-US,en;q=0.9'
  };

  // Remove existing fingerprinting headers
  const filteredHeaders = headers.filter(header => {
    const name = header.name.toLowerCase();
    return !name.includes('user-agent') && 
             !name.includes('accept-language') &&
             !name.includes('accept-encoding') &&
             !name.includes('accept') &&
             !name.includes('sec-ch-ua') &&
             !name.includes('sec-ch-ua-mobile') &&
             !name.includes('sec-ch-ua-platform');
  });

  // Add spoofed headers for Chrome/Windows (matching JS values)
  filteredHeaders.push({ name: 'User-Agent', value: forcedHeaders.userAgent });
  filteredHeaders.push({ name: 'Accept-Language', value: forcedHeaders.acceptLanguage });
  filteredHeaders.push({ name: 'Accept-Encoding', value: 'gzip, deflate, br' });
  filteredHeaders.push({ name: 'Accept', value: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' });
  filteredHeaders.push({ name: 'Sec-CH-UA', value: '"Chromium";v="120", "Google Chrome";v="120", "Not;A=Brand";v="99"' });
  filteredHeaders.push({ name: 'Sec-CH-UA-Mobile', value: '?0' });
  filteredHeaders.push({ name: 'Sec-CH-UA-Platform', value: '"Windows"' });

  // Add DNT header
  const dntHeaderExists = filteredHeaders.some(header => header.name.toLowerCase() === 'dnt');
  if (!dntHeaderExists) {
    filteredHeaders.push({ name: 'DNT', value: '1' });
  }

  return { requestHeaders: filteredHeaders };
}

// --- IMPORTANT: HTTP Header Spoofing Limitations ---
// Manifest V3 does not allow webRequestBlocking for normal extensions. 
// For perfect header spoofing, use one of these options:
// 1. User-Agent Switcher extension (recommended)
// 2. Declarative Net Request API (limited)
// 3. Proxy/VPN with header modification
//
// Recommended User-Agent Switcher settings:
// User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
// Accept-Language: en-US,en;q=0.9
// Platform: Windows

// Listens for messages from content scripts or the popup to update settings.
function handleMessages(message, sender, sendResponse) {
  console.log('lulzactive: Received message:', message.type);
  
  const storageData = message.type === 'updateSettings' 
    ? { enabledFeatures: message.enabledFeatures }
    : { currentProfile: message.profile };

  // Try to use session storage first (for incognito), fallback to local storage
  try {
    chrome.storage.session.set(storageData).catch((error) => {
      console.log('Session storage failed, trying local storage:', error.message);
      // Fallback to local storage if session storage fails
      chrome.storage.local.set(storageData).catch((localError) => {
        console.log('Local storage also failed:', localError.message);
      });
    });
  } catch (e) {
    console.log('Session storage not available, trying local storage:', e.message);
    // If session storage is not available, use local storage
    chrome.storage.local.set(storageData).catch((localError) => {
      console.log('Local storage failed:', localError.message);
    });
  }
  
  // Send response if needed
  if (sendResponse) {
    sendResponse({ success: true });
  }
}

// Register event listeners.
chrome.runtime.onInstalled.addListener(handleInstalled);

// Note: This header modification is limited in Manifest V3
// For full header control, use a user-agent switcher extension
chrome.webRequest.onBeforeSendHeaders.addListener(
  handleBeforeSendHeaders,
  { urls: ['<all_urls>'] },
  ['requestHeaders']
);

chrome.runtime.onMessage.addListener(handleMessages);

// Log that background script is loaded
console.log('lulzactive: Background service worker loaded');


