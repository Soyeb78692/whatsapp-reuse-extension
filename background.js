importScripts('wa-core.js');
const core = globalThis.WaCore;
const MENU_ID = 'wa-quick-chat-selected-text';

function chromeCall(apiFn, ...args) {
  return new Promise((resolve, reject) => {
    apiFn(...args, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(result);
    });
  });
}

async function getPreferredWaTab() {
  const tabs = await chromeCall(chrome.tabs.query, {});
  const waTabs = core.filterWaTabs(tabs);
  if (!waTabs.length) return null;

  const currentActiveTabs = await chromeCall(chrome.tabs.query, { active: true, currentWindow: true }).catch(() => []);
  const activeTab = currentActiveTabs[0] || null;
  return core.pickPreferredWaTab(waTabs, activeTab);
}

async function openQuickChatUrl(waUrl) {
  try {
    const data = await chromeCall(chrome.storage.local.get, ['prefs']).catch(() => ({}));
    const prefs = data.prefs || {};
    const reuseMode = prefs.reuseMode === 'new_tab' ? 'new_tab' : 'reuse';

    if (reuseMode === 'reuse') {
      const existingTab = await getPreferredWaTab();
      if (existingTab && typeof existingTab.id === 'number') {
        await chromeCall(chrome.tabs.update, existingTab.id, { url: waUrl, active: true });
        if (typeof existingTab.windowId === 'number') {
          await chromeCall(chrome.windows.update, existingTab.windowId, { focused: true }).catch(() => null);
        }
        return;
      }
    }

    await chromeCall(chrome.tabs.create, { url: waUrl });
  } catch (err) {
    console.warn('openQuickChatUrl failed', err && err.message ? err.message : err);
  }
}

async function ensureContextMenu() {
  try {
    await chromeCall(chrome.contextMenus.remove, MENU_ID).catch(() => null);
    await chromeCall(chrome.contextMenus.create, {
      id: MENU_ID,
      title: 'Chat on WhatsApp with selected number',
      contexts: ['selection']
    });
  } catch (err) {
    console.warn('ensureContextMenu failed', err && err.message ? err.message : err);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureContextMenu();
});
chrome.runtime.onStartup.addListener(() => ensureContextMenu());

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== MENU_ID) return;

  let defaultCountryCode = '+91';
  try {
    const data = await chromeCall(chrome.storage.local.get, ['prefs']).catch(() => ({}));
    if (data.prefs && data.prefs.defaultCountryCode) {
      defaultCountryCode = core.sanitizeCountryCode(data.prefs.defaultCountryCode, '+91');
    }
  } catch (_err) {
    // Fallback to +91.
  }

  const phoneE164 = core.parseSelectedTextToE164(info.selectionText, defaultCountryCode);
  if (!phoneE164) return;
  await openQuickChatUrl(core.buildWhatsAppUrl(phoneE164));
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'open-whatsapp-quick-chat') return;

  try {
    const data = await chromeCall(chrome.storage.local.get, ['lastChat']).catch(() => ({}));
    const lastPhone = data.lastChat && data.lastChat.phone;
    if (typeof lastPhone === 'string' && core.isValidE164(lastPhone)) {
      const lastMessage = data.lastChat && typeof data.lastChat.message === 'string'
        ? data.lastChat.message.trim()
        : '';
      await openQuickChatUrl(core.buildWhatsAppUrl(lastPhone, lastMessage));
      return;
    }
  } catch (err) {
    console.warn('command handler failed', err && err.message ? err.message : err);
    // Fall through and open WhatsApp home.
  }

  await openQuickChatUrl('https://web.whatsapp.com/');
});
