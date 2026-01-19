# WhatsApp Web Quick Chat (Reuse Existing Tab)

Open WhatsApp Web chats without saving contacts, reuse an existing tab (no duplicates), and jump straight into conversations. Works on Chrome, Edge, and other Chromium browsers.

## Features

- 🔄 **Reuse existing WhatsApp Web tab** — keeps one tab instead of many duplicates
- ⚡ **Open chat instantly** — type a number, hit Enter, you’re in
- 🌍 **International support** — validates `+<country><number>` (10–15 digits)
- ✅ **No contact saving needed** — message without adding to your phone
- 🧭 **Friendly UX** — loading states, status messages, keyboard Enter support
- 🔒 **Permissions minimized** — only `tabs`, `storage`, and `web.whatsapp.com`

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/Soyeb78692/whatsapp-reuse-extension.git
   cd whatsapp-reuse-extension
   ```

2. Open Chrome/Edge and navigate to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`

3. Enable **Developer mode** (toggle in the top-right corner)

4. Click **"Load unpacked"** and select the extension folder

5. The extension icon should now appear in your browser toolbar

## Usage

1. Click the extension icon in your browser toolbar
2. Enter a phone number (with or without country code)
   - Example: `+919876543210` or `9876543210`
   - Default country code is `+91` (India)
3. Click **"Open Chat"** or press Enter
4. The extension will:
   - Reuse an existing WhatsApp Web tab if one is open
   - Create a new tab if no WhatsApp Web tab exists

## Why this is SEO-friendly

- Keywords: “WhatsApp Web”, “open chat without saving contact”, “reuse tab”, “Chrome extension”
- Single-tab reuse avoids clutter and improves user flow
- Clear instructions and validated phone input for fewer errors

## Permissions

This extension requires the following permissions:
- **tabs** - To detect and reuse existing WhatsApp Web tabs
- **storage** - To store extension preferences
- **host_permissions** - Access to `https://web.whatsapp.com/*` to open WhatsApp Web

## Files Structure

```
whatsapp-reuse-extension/
├── manifest.json    # Extension manifest (Manifest V3)
├── popup.html       # Popup UI
├── popup.js         # Extension logic
└── README.md        # This file
```

## Browser Compatibility

- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Other Chromium-based browsers

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by [Soyeb78692](https://github.com/Soyeb78692)

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.
