# lulzactive - Advanced Anti-Fingerprinting Protection

A comprehensive anti-fingerprinting and anti-tracking solution available as both a Chrome extension and a GreasyFork userscript.

## 🛡️ Features

### Core Protection
- **Chrome/Windows Profile Spoofing**: Consistent Chrome 120 on Windows 10 profile
- **WebGL Fingerprinting Protection**: Spoofed vendor and renderer information
- **Canvas Fingerprinting Protection**: Subtle pixel randomization and text/rect adjustments
- **Audio Context Protection**: Fixed sample rate to prevent audio fingerprinting
- **Font Fingerprinting Protection**: Windows font set spoofing with randomization
- **Screen & Window Properties**: Consistent 1920x1080 resolution spoofing
- **Timezone Protection**: Fixed timezone to prevent location fingerprinting
- **Plugin Spoofing**: Modern Chrome plugin set (no Flash, no rare plugins)

### Anti-Tracking Features
- **Tracker Blocking**: Blocks requests to 50+ known tracking domains
- **XHR/Fetch Interception**: Prevents tracking via AJAX requests
- **Element Creation Blocking**: Blocks tracking scripts and images
- **sendBeacon Blocking**: Prevents beacon-based tracking
- **Battery API Spoofing**: Prevents battery-based fingerprinting
- **Network Information Spoofing**: Consistent network characteristics
- **Document Referrer Clearing**: Removes referrer information
- **Window Name Clearing**: Prevents cross-window tracking

### Advanced Features
- **Subtle Randomization**: Canvas text/rect positioning and font measurement width
- **Paranoid Mode**: Optional blank canvas mode for maximum privacy
- **Screen Rounding**: Optional screen size rounding to nearest 100px
- **HTTP Header Spoofing**: Extension attempts header modification (limited in Manifest V3)
- **User-Agent Switcher Integration**: Recommended for perfect header spoofing

## 📦 Installation

### Chrome Extension (v0.6.0)
1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. The extension will automatically apply protection

### GreasyFork Userscript (v0.3)
1. Install a userscript manager (Tampermonkey, Violentmonkey, etc.)
2. Visit the userscript page on GreasyFork
3. Click "Install" to add the userscript
4. The userscript will automatically apply protection on all sites

## 🔧 Configuration

### Feature Toggles (in code)
```javascript
const PARANOID_CANVAS = false; // true = always blank canvas
const ROUND_SCREEN = false;    // true = round screen size
const FONT_RANDOMIZE = true;   // true = randomize measureText width
const CANVAS_TEXT_RANDOMIZE = true; // true = randomize text/rect positioning
```

### Extension Popup
- **Toggle Protection**: Enable/disable all protections
- **Test Protection**: Run protection verification tests
- **Debug Mode**: Toggle console logging
- **Reset**: Clear all settings and reload
- **Export Logs**: Download protection data

## 🌐 Perfect Blend-In Setup

For maximum effectiveness, ensure HTTP headers match JavaScript spoofing:

### Recommended User-Agent Switcher Settings:
- **User-Agent**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- **Accept-Language**: `en-US,en;q=0.9`
- **Platform**: `Windows`

### Popular User-Agent Switcher Extensions:
- User-Agent Switcher and Manager
- User-Agent Switcher for Chrome
- Header Editor

## 🧪 Testing

### Manual Testing
1. Visit fingerprinting test sites (e.g., browserleaks.com, amiunique.org)
2. Check that values are consistent across sessions
3. Verify that canvas fingerprints change subtly
4. Confirm tracker blocking is working

### Extension Testing
1. Click the extension icon
2. Click "Test Protection" button
3. Review the test results in the popup
4. Check console for detailed logs

## 📊 Protection Coverage

| Vector | Protection Level | Notes |
|--------|------------------|-------|
| User-Agent | ✅ Full | Chrome 120 on Windows |
| Platform | ✅ Full | Win32 spoofing |
| Screen | ✅ Full | 1920x1080 + randomization |
| WebGL | ✅ Full | Vendor/renderer spoofing |
| Canvas | ✅ Full | Pixel + text randomization |
| Fonts | ✅ Full | Windows font set |
| Audio | ✅ Full | Fixed sample rate |
| Timezone | ✅ Full | America/New_York |
| Plugins | ✅ Full | Modern Chrome set |
| Trackers | ✅ Full | 50+ domains blocked |
| Battery | ✅ Full | Spoofed values |
| Network | ✅ Full | Consistent characteristics |

## 🔒 Privacy & Security

- **No Data Collection**: The extension and userscript do not collect or transmit any user data
- **Local Processing**: All protection logic runs locally in the browser
- **Open Source**: Full source code available for review
- **No Dependencies**: Minimal external dependencies for maximum privacy

## 🐛 Troubleshooting

### Common Issues
1. **Headers don't match**: Use a user-agent switcher extension
2. **Canvas still unique**: Enable paranoid mode or check randomization settings
3. **Trackers not blocked**: Check if site uses different tracking methods
4. **Extension not working**: Reload the page after installation

### Debug Mode
Enable debug mode in the extension popup to see detailed console logs about protection application.

## 📝 Changelog

### v0.6.0 (Extension) / v0.3 (Userscript)
- ✅ Fixed syntax errors and code structure
- ✅ Improved Chrome/Windows profile consistency
- ✅ Enhanced anti-tracking with 50+ blocked domains
- ✅ Added subtle canvas and font randomization
- ✅ Improved WebGL and audio protection
- ✅ Better HTTP header guidance
- ✅ Simplified and optimized codebase
- ✅ Updated UI and popup functionality

### Previous Versions
- v0.5.0: Initial extension release
- v0.2: Initial userscript release

## 🤝 Contributing

Contributions are welcome! Please ensure any changes maintain the privacy-first approach and don't introduce data collection.

## 📄 License

MIT License - see LICENSE file for details.

## ⚠️ Disclaimer

This tool is for educational and privacy protection purposes. Users are responsible for complying with applicable laws and website terms of service.