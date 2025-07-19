# lulzactive - Advanced Anti-Fingerprinting Protection

## 🚨 **CRITICAL SETUP REQUIREMENT**

**For perfect fingerprinting protection, you MUST synchronize your HTTP headers with the JavaScript spoofing:**

- **HTTP User-Agent**: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`
- **Accept-Language**: `en-US,en;q=0.9`

**See [HTTP_HEADER_SETUP.md](HTTP_HEADER_SETUP.md) for detailed setup instructions.**

## 📦 **What's Included**

### 🔧 **Browser Extension (Manifest V3)**
- Anti-fingerprinting protection for incognito mode
- WebRTC IP leak prevention
- Storage management for incognito contexts
- Popup interface with status and controls

### 📜 **GreasyFork Userscript**
- Advanced anti-fingerprinting with realistic Chrome/Windows spoofing
- Canvas, WebGL, and font fingerprinting protection
- Anti-tracking features and cookie blocking
- Configurable paranoid mode and screen rounding

## 🎯 **Key Features**

### **Realistic Profile Spoofing**
- Chrome 120 on Windows 10 profile
- Common screen resolutions (1920x1080, 1366x768, etc.)
- Standard Windows fonts and plugins
- Realistic WebGL renderers (NVIDIA, AMD, Intel)

### **Advanced Protection**
- **Canvas Fingerprinting**: Subtle randomization to match common fingerprints
- **WebGL Fingerprinting**: Vendor/renderer spoofing with parameter randomization
- **Font Fingerprinting**: Windows font set with detection blocking
- **Audio Context**: Sample rate and state spoofing
- **Screen Properties**: Resolution and color depth spoofing
- **Navigator Properties**: User agent, platform, language, and hardware specs

### **Anti-Tracking Features**
- Third-party cookie blocking
- Known tracker domain blocking
- API spoofing (geolocation, notifications, etc.)
- Storage access prevention

## 🚀 **Quick Start**

### **Extension Installation**
1. Download the extension files
2. Open Chrome Extensions (chrome://extensions/)
3. Enable Developer Mode
4. Load unpacked extension
5. Select the extension folder

### **Userscript Installation**
1. Install Tampermonkey or Greasemonkey
2. Install the userscript from [GreasyFork](https://greasyfork.org/)
3. Configure HTTP headers (see setup guide above)

## ⚙️ **Configuration**

### **Extension Settings**
- Toggle individual protection features
- View protection status
- Debug mode for troubleshooting

### **Userscript Settings**
- `PARANOID_CANVAS`: Enable blank canvas (paranoid mode)
- `ROUND_SCREEN`: Round screen dimensions to common values
- `CANVAS_TEXT_RANDOMIZE`: Randomize canvas text/rect positioning
- `FONT_RANDOMIZE`: Randomize font measurements

## 🔍 **Testing Your Protection**

Test on these fingerprinting sites:
- [EFF Cover Your Tracks](https://coveryourtracks.eff.org/)
- [AmIUnique](https://amiunique.org/)
- [BrowserLeaks](https://browserleaks.com/)

## 📊 **Expected Results**

With proper setup, you should see:
- **Consistent User-Agent**: Windows Chrome 120 in both HTTP and JS
- **Common Fingerprints**: Canvas and WebGL hashes matching popular profiles
- **Reduced Uniqueness**: Lower entropy scores on fingerprinting tests
- **Realistic Values**: All spoofed values matching common Windows/Chrome setups

## 🛠️ **Technical Details**

### **Manifest V3 Compatibility**
- Service worker background script
- Limited HTTP header modification (use external tools)
- Session storage for incognito contexts

### **Userscript Features**
- Early script injection for maximum protection
- Profile-based spoofing system
- Anti-detection measures
- Communication with extension (if available)

## 📝 **Version History**

- **v0.7.0**: Enhanced canvas/WebGL protection, HTTP header sync guide
- **v0.6.0**: Advanced anti-tracking features, realistic profiles
- **v0.5.0**: Userscript-extension communication, improved UI
- **v0.4.0**: Manifest V3 migration, incognito support
- **v0.3.0**: Basic anti-fingerprinting protection

## 🤝 **Contributing**

Feel free to submit issues and enhancement requests!

## 📄 **License**

MIT License - see LICENSE file for details.