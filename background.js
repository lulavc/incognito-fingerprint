// background.js

// Handles initial setup and default settings when the extension is installed or updated.
function handleInstalled() {
  // Set basic privacy preferences for WebRTC IP handling.
  chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: 'disable_non_proxied_udp'
  });

  // Initialize storage with default feature settings.
  chrome.storage.local.set({
    enabledFeatures: {
      webRTC: true,
      headers: true,
      canvas: true,
      webgl: true,
      audio: true,
      font: true,
      navigator: true
    }
  });
}

// Modifies outgoing web request headers to prevent fingerprinting.
function handleBeforeSendHeaders(details) {
  const headers = details.requestHeaders || [];
  
  // Filter out or modify headers commonly used for fingerprinting.
  const filteredHeaders = headers.filter(header => {
    const name = header.name.toLowerCase();
    // Remove User-Agent and Accept-Language headers.
    return !name.includes('user-agent') && 
           !name.includes('accept-language');
  });

  // Add or modify other headers as needed for anti-fingerprinting.
  // Example: Add a generic DNT (Do Not Track) header if not present.
  const dntHeaderExists = filteredHeaders.some(header => header.name.toLowerCase() === 'dnt');
  if (!dntHeaderExists) {
    filteredHeaders.push({ name: 'DNT', value: '1' });
  }

  return { requestHeaders: filteredHeaders };
}

// Listens for messages from content scripts or the popup to update settings.
function handleMessages(message, sender, sendResponse) {
  if (message.type === 'updateSettings') {
    chrome.storage.local.set({ enabledFeatures: message.enabledFeatures });
  }
}

// Register event listeners.
chrome.runtime.onInstalled.addListener(handleInstalled);
chrome.webRequest.onBeforeSendHeaders.addListener(
  handleBeforeSendHeaders,
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
);
chrome.runtime.onMessage.addListener(handleMessages);


