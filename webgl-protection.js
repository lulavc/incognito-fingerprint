// WebGL fingerprint protection
(function() {
  const getParameter = WebGLRenderingContext.prototype.getParameter;
  WebGLRenderingContext.prototype.getParameter = function(pname) {
    // Spoof WebGL parameters with minor random variations
    const rnd = () => Math.random() * 0.02 - 0.01; // ±1% variation
    const params = {
      37445: `WebKit ${Math.floor(601 + rnd()*100)}`, // WEBGL_VERSION
      37446: `WebKit ${Math.floor(601 + rnd()*100)}`, // SHADING_LANGUAGE_VERSION
      7938: `Google Inc. (${Math.random().toString(36).substr(2, 8)})`, // UNMASKED_VENDOR_WEBGL
      7937: `ANGLE (${Math.random().toString(36).substr(2, 8)})` // UNMASKED_RENDERER_WEBGL
    };
    return params[pname] || getParameter.call(this, pname);
  };

  // Add canvas noise similar to 2D canvas protection
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type) {
    const context = getContext.apply(this, arguments);
    if (type === 'webgl' || type === 'experimental-webgl') {
      const gl = context;
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      // Add subtle noise pattern
      const pixels = new Uint8Array(4);
      crypto.getRandomValues(pixels);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    return context;
  };
})();