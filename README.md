# Incognito Fingerprint Extension

A browser extension that enhances incognito mode browsing with robust anti-fingerprinting capabilities.

## Features

This extension provides comprehensive protection against various browser fingerprinting techniques:

- **Canvas Fingerprinting Protection:** Adds subtle, random noise to canvas output, making it difficult for websites to generate a unique fingerprint from your canvas rendering.
- **WebGL Fingerprinting Protection:** Spoofs WebGL parameters and introduces noise to WebGL rendering, similar to canvas protection.
- **AudioContext Fingerprinting Protection:** Adds random noise to audio samples and randomizes AudioContext parameters like FFT size and base latency.
- **Navigator Fingerprinting Protection:** Spoofs various `navigator` properties, including User-Agent Client Hints, platform, hardware concurrency, device memory, and more, to present a less unique browser profile.
- **WebRTC Fingerprinting Protection:** Modifies WebRTC configurations to prevent the leakage of local IP addresses.
- **Font Fingerprinting Protection:** Overrides font enumeration APIs and spoofs font availability to prevent identification based on installed fonts.
- **HTTP Header Modification:** Filters out or modifies common fingerprinting headers like `User-Agent` and `Accept-Language`.

## How it Works

The extension injects content scripts into web pages at `document_start` to override and modify various browser APIs that are commonly used for fingerprinting. By introducing subtle, random variations or spoofing identifiable properties, it aims to make your browser appear less unique to tracking scripts.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lulavc/incognito-fingerprint.git
    ```

2.  **Load the extension in your browser:**

    *   **Chrome/Edge:**
        1.  Open `chrome://extensions` in your browser.
        2.  Enable "Developer mode" in the top right corner.
        3.  Click "Load unpacked" and select the cloned `incognito-fingerprint` directory.

    *   **Firefox:**
        1.  Open `about:debugging` in your browser.
        2.  Click "This Firefox" on the left sidebar.
        3.  Click "Load Temporary Add-on..." and select the `manifest.json` file from the cloned `incognito-fingerprint` directory.

## Verification

To test the effectiveness of the extension, you can visit the following websites (it's recommended to test with the extension enabled and disabled to observe the difference):

*   [AmIUnique](https://amiunique.org/)
*   [Cover Your Tracks (formerly Panopticlick)](https://coveryourtracks.eff.org/)

## Limitations

While this extension provides significant protection, it's important to note:

*   **Not a Silver Bullet:** No single tool can offer 100% anonymity online. This extension is a layer of defense against browser fingerprinting, but it should be used in conjunction with other privacy best practices (e.g., VPNs, ad blockers, privacy-focused browsers).
*   **Potential for Breakage:** Aggressive anti-fingerprinting techniques can sometimes cause minor website compatibility issues. If you encounter problems on a specific site, you can temporarily disable the extension or individual features via the popup.

## Development

### Project Structure

```
incognito-fingerprint/
├── audio-context-protection.js
├── background.js
├── canvas-protection.js
├── font-protection.js
├── manifest.json
├── navigator-protection.js
├── popup.html
├── popup.js
├── README.md
├── webgl-protection.js
└── webrtc-protection.js
```

### Building

Development instructions will be added as the project progresses.

## Privacy & Security

This extension is designed with privacy as its core principle. It helps protect users from browser fingerprinting and enhances the built-in incognito mode functionality.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

If you discover any security vulnerabilities, please report them via GitHub issues.