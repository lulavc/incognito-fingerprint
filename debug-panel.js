// Debug panel for Incognito Fingerprint extension
(function() {
  'use strict';
  
  // Create debug panel
  function createDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'incognito-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 400px;
      max-height: 600px;
      background: #1a1a1a;
      color: #fff;
      border: 2px solid #333;
      border-radius: 8px;
      font-family: monospace;
      font-size: 12px;
      z-index: 999999;
      overflow: auto;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    `;
    
    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h3 style="margin: 0; color: #4CAF50;">🔒 Incognito Fingerprint Debug</h3>
        <button id="debug-close-btn" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">✕</button>
      </div>
      <div id="debug-content">
        <div style="margin-bottom: 10px;">
          <button id="debug-refresh-btn" style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">🔄 Refresh</button>
          <button id="debug-clear-btn" style="background: #FF9800; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">🗑️ Clear Logs</button>
        </div>
        <div id="debug-stats"></div>
        <div id="debug-overrides"></div>
        <div id="debug-failures"></div>
        <div id="debug-recent-logs"></div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Add event listeners
    document.getElementById('debug-close-btn').addEventListener('click', () => {
      document.getElementById('incognito-debug-panel').remove();
    });
    
    document.getElementById('debug-refresh-btn').addEventListener('click', updateDebugPanel);
    document.getElementById('debug-clear-btn').addEventListener('click', clearDebugLogs);
    
    updateDebugPanel();
  }
  
  // Update debug panel content
  function updateDebugPanel() {
    if (!window.incognitoLogger) {
      document.getElementById('debug-stats').innerHTML = '<p style="color: #f44336;">Logger not available</p>';
      return;
    }
    
    const stats = window.incognitoLogger.getStats();
    const overrides = window.incognitoLogger.getOverrides();
    const failures = window.incognitoLogger.getFailures();
    const logs = window.incognitoLogger.getAllLogs();
    
    // Stats section
    document.getElementById('debug-stats').innerHTML = `
      <div style="background: #333; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #4CAF50;">📊 Statistics</h4>
        <div>Total Logs: ${stats.totalLogs}</div>
        <div>Overrides: ${stats.overrides}</div>
        <div>Failures: ${stats.failures}</div>
        <div>Runtime: ${stats.runtime}ms</div>
      </div>
    `;
    
    // Overrides section
    document.getElementById('debug-overrides').innerHTML = `
      <div style="background: #333; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #4CAF50;">✅ Successful Overrides (${overrides.length})</h4>
        <div style="max-height: 150px; overflow-y: auto;">
          ${overrides.map(override => `<div style="margin: 2px 0; padding: 2px 5px; background: #444; border-radius: 2px;">${override}</div>`).join('')}
        </div>
      </div>
    `;
    
    // Failures section
    document.getElementById('debug-failures').innerHTML = `
      <div style="background: #333; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <h4 style="margin: 0 0 10px 0; color: #f44336;">❌ Failed Overrides (${failures.length})</h4>
        <div style="max-height: 100px; overflow-y: auto;">
          ${failures.map(failure => `<div style="margin: 2px 0; padding: 2px 5px; background: #444; border-radius: 2px; color: #ff6b6b;">${failure}</div>`).join('')}
        </div>
      </div>
    `;
    
    // Recent logs section
    const recentLogs = logs.slice(-10);
    document.getElementById('debug-recent-logs').innerHTML = `
      <div style="background: #333; padding: 10px; border-radius: 4px;">
        <h4 style="margin: 0 0 10px 0; color: #2196F3;">📝 Recent Logs (${recentLogs.length})</h4>
        <div style="max-height: 200px; overflow-y: auto;">
          ${recentLogs.map(log => `
            <div style="margin: 2px 0; padding: 2px 5px; background: #444; border-radius: 2px; font-size: 11px;">
              <span style="color: #888;">[${log.timestamp}ms]</span>
              <span style="color: ${log.level === 'ERROR' ? '#f44336' : log.level === 'WARN' ? '#FF9800' : '#4CAF50'};">[${log.level}]</span>
              <span style="color: #2196F3;">[${log.script}]</span>
              <span>${log.message}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Clear debug logs
  function clearDebugLogs() {
    if (window.incognitoLogger) {
      window.incognitoLogger.clear();
      updateDebugPanel();
    }
  }
  
  // Expose functions globally
  window.showIncognitoDebugPanel = createDebugPanel;
  window.updateDebugPanel = updateDebugPanel;
  window.clearDebugLogs = clearDebugLogs;
  
  // Auto-show debug panel if URL contains debug parameter
  if (window.location.search.includes('debug=incognito')) {
    setTimeout(createDebugPanel, 1000);
  }
  
  console.log('[Incognito Fingerprint] Debug panel loaded. Use window.showIncognitoDebugPanel() to open the debug panel.');
})(); 