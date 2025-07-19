document.addEventListener('DOMContentLoaded', () => {
  const webRTCCheckbox = document.getElementById('webRTC');
  const headersCheckbox = document.getElementById('headers');
  const canvasCheckbox = document.getElementById('canvas');
  const webglCheckbox = document.getElementById('webgl');
  const audioCheckbox = document.getElementById('audio');
  const fontCheckbox = document.getElementById('font');
  const navigatorCheckbox = document.getElementById('navigator');

  // Load saved settings from storage
  chrome.storage.local.get('enabledFeatures', (data) => {
    if (data.enabledFeatures) {
      webRTCCheckbox.checked = data.enabledFeatures.webRTC;
      headersCheckbox.checked = data.enabledFeatures.headers;
      canvasCheckbox.checked = data.enabledFeatures.canvas;
      webglCheckbox.checked = data.enabledFeatures.webgl;
      audioCheckbox.checked = data.enabledFeatures.audio;
      fontCheckbox.checked = data.enabledFeatures.font;
      navigatorCheckbox.checked = data.enabledFeatures.navigator;
    }
  });

  // Save settings when toggles change
  webRTCCheckbox.addEventListener('change', saveSettings);
  headersCheckbox.addEventListener('change', saveSettings);
  canvasCheckbox.addEventListener('change', saveSettings);
  webglCheckbox.addEventListener('change', saveSettings);
  audioCheckbox.addEventListener('change', saveSettings);
  fontCheckbox.addEventListener('change', saveSettings);
  navigatorCheckbox.addEventListener('change', saveSettings);

  function saveSettings() {
    const enabledFeatures = {
      webRTC: webRTCCheckbox.checked,
      headers: headersCheckbox.checked,
      canvas: canvasCheckbox.checked,
      webgl: webglCheckbox.checked,
      audio: audioCheckbox.checked,
      font: fontCheckbox.checked,
      navigator: navigatorCheckbox.checked,
    };
    chrome.storage.local.set({ enabledFeatures });
    // Notify background script of changes if needed
    chrome.runtime.sendMessage({ type: 'updateSettings', enabledFeatures });
  }
});
