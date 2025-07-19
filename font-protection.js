// Font fingerprint protection
(function() {
  // Inject external script for font spoofing
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('injected-fonts.js');
  s.type = 'text/javascript';
  s.onload = () => s.remove();
  (document.head || document.documentElement).appendChild(s);
})();