// WebRTC fingerprint protection
(function() {
  const originalRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection;
  
  if (originalRTCPeerConnection) {
    window.RTCPeerConnection = function(config) {
      const modifiedConfig = {
        ...config,
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
      };
      
      const pc = new originalRTCPeerConnection(modifiedConfig);
      
      // Override getStats to filter real IP addresses
      const originalGetStats = pc.getStats.bind(pc);
      pc.getStats = async selector => {
        const stats = await originalGetStats(selector);
        stats.forEach(report => {
          if (report.type === 'local-candidate' || report.type === 'remote-candidate') {
            report.ip = '0.0.0.0';
            report.address = '0.0.0.0';
          }
        });
        return stats;
      };
      
      return pc;
    };
    
    window.RTCPeerConnection.prototype = originalRTCPeerConnection.prototype;
  }
})();