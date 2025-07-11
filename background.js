// Privacy-related settings
chrome.runtime.onInstalled.addListener(() => {
  // Set basic privacy preferences
  chrome.privacy.network.webRTCIPHandlingPolicy.set({
    value: 'disable_non_proxied_udp'
  });

  // Initialize storage with default settings
  chrome.storage.local.set({
    enabledFeatures: {
      webRTC: true,
      headers: true,
      canvas: true
    }
  });
});

// Listen for web requests to modify headers
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const headers = details.requestHeaders || [];
    
    // Modify or remove headers that could be used for fingerprinting
    return {
      requestHeaders: headers.filter(header => {
        const name = header.name.toLowerCase();
        return !name.includes('user-agent') && 
               !name.includes('accept-language');
      })
    };
  },
  { urls: ['<all_urls>'] },
  ['blocking', 'requestHeaders']
);