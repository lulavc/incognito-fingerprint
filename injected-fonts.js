// Injected Font Spoofing Script
console.log('[Incognito Fingerprint] Font spoofing active');

// --- Begin font spoofing logic ---
// Using shared utility function from window.getRandomFloat

// --- Font spoofing: Always report a common set of fonts ---
const commonFonts = [
  'Arial', 'Times New Roman', 'Courier New', 'Verdana', 'Georgia', 'Tahoma',
  'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Lucida Console', 'Palatino Linotype', 'Segoe UI'
];

// Override CSS.supports to always report these fonts as available
const originalCheck = CSS.supports;
CSS.supports = (property, value) => {
  if (property === 'font-family' && typeof value === 'string') {
    // If any of the common fonts are requested, always return true
    return commonFonts.some(font => value.includes(font));
  }
  return originalCheck(property, value);
};

// Override document.fonts.check to always return true for common fonts
if (document.fonts && typeof document.fonts.check === 'function') {
  const originalFontsCheck = document.fonts.check.bind(document.fonts);
  document.fonts.check = (fontSpec, text) => {
    return commonFonts.some(font => fontSpec.includes(font)) || originalFontsCheck(fontSpec, text);
  };
}

// Spoof FontFaceSet for font enumeration
Object.defineProperty(document, 'fonts', {
  value: {
    add: () => {},
    clear: () => {},
    delete: () => {},
    entries: () => commonFonts.map(f => [f, true]).entries(),
    forEach: (cb) => commonFonts.forEach(f => cb(f, true)),
    has: (font) => commonFonts.includes(font),
    keys: () => commonFonts.keys(),
    size: commonFonts.length,
    values: () => commonFonts.values(),
    check: (fontSpec) => commonFonts.some(font => fontSpec.includes(font)),
  },
  configurable: false
});

// Spoof CanvasRenderingContext2D.prototype.measureText
const originalMeasureText = CanvasRenderingContext2D.prototype.measureText;
CanvasRenderingContext2D.prototype.measureText = function(text) {
  const metrics = originalMeasureText.call(this, text);
  // Add a small random variation to the width
  metrics.width += getRandomFloat(-0.5, 0.5); // ±0.5 pixel variation
  return metrics;
};
// --- End font spoofing logic ---
