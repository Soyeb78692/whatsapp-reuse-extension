# WhatsApp Quick Chat+

Open chats without saving contacts, reuse WhatsApp Web tabs, and prefill messages in seconds.

## Features

- Reuse an existing WhatsApp Web tab or force a new tab.
- Expanded international country code support.
- Optional message prefill (`text=` query parameter).
- Persistent preferences:
  - default country code
  - reuse mode
  - remember last message
- Recent numbers list (deduped, up to 10 entries).
- One-click clear for local memory (recents + last chat + remembered message).
- Context menu action for selected text: **Chat on WhatsApp with selected number**.
- Keyboard shortcut command (`Ctrl+Shift+Y`) to open last chat target (or WhatsApp home if none).

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Soyeb78692/whatsapp-reuse-extension.git
   cd whatsapp-reuse-extension
   ```
2. Open:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable **Developer mode**.
4. Click **Load unpacked** and select this folder.
5. Pin the extension if needed.

## Usage

1. Click the extension icon.
2. Select country code and enter local phone digits.
3. (Optional) Add a message and enable **Remember this message**.
4. Choose open behavior:
   - Reuse existing WhatsApp tab
   - Always open in new tab
5. Click **Open Chat** or press Enter in the phone field.
6. Use **Clear Local Memory** anytime to reset local stored data.

You can also:
- Highlight a phone number on any webpage, right click, and use the WhatsApp context menu item.
- Press `Ctrl+Shift+Y` to open your last used chat target quickly.

## Permissions

- `tabs`: Find/reuse WhatsApp tabs and activate/focus target tabs/windows.
- `storage`: Save preferences, recent numbers, and last chat target.
- `contextMenus`: Add right-click action for selected text.
- `host_permissions` (`https://web.whatsapp.com/*`): Open WhatsApp Web URLs.

## Privacy

- All data is local in browser storage only.
- Stored keys include preferences, recent numbers, and last chat info.
- No remote server or analytics integration.
- You can clear local memory from the popup UI.

## Project Files

- `manifest.json`: MV3 manifest config.
- `wa-core.js`: Shared number parsing, URL generation, and tab prioritization logic.
- `popup.html`: Popup UI.
- `popup.js`: Popup logic, validation, storage, tab handling.
- `background.js`: Context menu + command handlers.

## Browser Compatibility

- Google Chrome
- Microsoft Edge
- Other Chromium browsers supporting Manifest V3

## License

MIT

## QA Checklist

- Reload extension with no manifest/service worker errors.
- Open chat from popup with valid numbers in at least 3 country codes.
- Confirm invalid input shows clear error and no navigation.
- Confirm `reuse` mode updates existing WhatsApp tab.
- Confirm `new_tab` mode always opens a new tab.
- Confirm selected text context menu works for `+` numbers and local numbers.
- Confirm shortcut opens last chat (or WhatsApp home if no history).
- Confirm icons render at toolbar and extension management page.
