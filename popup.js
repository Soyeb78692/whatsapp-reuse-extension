(() => {
  const core = globalThis.WaCore;
  if (!core) return;

  const phoneInput = document.getElementById('phoneInput');
  const countryCodeSelect = document.getElementById('countryCode');
  const messageInput = document.getElementById('messageInput');
  const rememberMessageCheck = document.getElementById('rememberMessage');
  const reuseModeSelect = document.getElementById('reuseMode');
  const recentNumbersSelect = document.getElementById('recentNumbers');
  const clearDataBtn = document.getElementById('clearDataBtn');
  const openBtn = document.getElementById('openBtn');
  const status = document.getElementById('status');

  if (
    !phoneInput || !countryCodeSelect || !messageInput || !rememberMessageCheck ||
    !reuseModeSelect || !recentNumbersSelect || !clearDataBtn || !openBtn || !status
  ) {
    return;
  }

  const DEFAULT_STATUS = 'Extension will reuse any open WhatsApp Web tab.';
  const DEFAULT_PREFS = {
    defaultCountryCode: '+91',
    reuseMode: 'reuse',
    autoClosePopupMs: 500,
    rememberLastMessage: false,
    lastMessage: ''
  };

  function setStatus(message, isError = false) {
    status.textContent = message;
    status.style.color = isError ? '#d32f2f' : '#666';
  }

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

  async function storageGet(keys) {
    try {
      return await chromeCall(chrome.storage.local.get, keys);
    } catch (_err) {
      return {};
    }
  }

  async function storageSet(obj) {
    try {
      await chromeCall(chrome.storage.local.set, obj);
    } catch (_err) {
      // Best-effort write.
    }
  }

  function normalizeRecentNumbers(values) {
    const unique = [];
    (values || []).forEach((num) => {
      if (typeof num !== 'string') return;
      const candidate = num.trim();
      if (!core.isValidE164(candidate)) return;
      if (!unique.includes(candidate)) unique.push(candidate);
    });
    return unique.slice(0, 10);
  }

  function renderRecentNumbers(recentNumbers) {
    const previousValue = recentNumbersSelect.value;
    recentNumbersSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = recentNumbers.length ? 'Choose a recent number' : 'No recent numbers';
    recentNumbersSelect.appendChild(placeholderOption);

    recentNumbers.forEach((num) => {
      const option = document.createElement('option');
      option.value = num;
      option.textContent = num;
      recentNumbersSelect.appendChild(option);
    });

    if (recentNumbers.includes(previousValue)) {
      recentNumbersSelect.value = previousValue;
    } else {
      recentNumbersSelect.value = '';
    }
  }

  async function getPreferredTab(waTabs) {
    if (!waTabs.length) return null;

    let activeTab = null;
    try {
      const activeTabs = await chromeCall(chrome.tabs.query, { active: true, currentWindow: true });
      activeTab = activeTabs[0] || null;
    } catch (_err) {
      // Continue with fallback sorting.
    }

    return core.pickPreferredWaTab(waTabs, activeTab);
  }

  async function saveRecentNumber(phoneE164) {
    const data = await storageGet(['recent']);
    const current = data.recent && Array.isArray(data.recent.numbers) ? data.recent.numbers : [];
    const next = normalizeRecentNumbers([phoneE164, ...current]);
    await storageSet({ recent: { numbers: next } });
    renderRecentNumbers(next);
  }

  async function savePreferences() {
    const prefs = {
      defaultCountryCode: core.sanitizeCountryCode(countryCodeSelect.value, DEFAULT_PREFS.defaultCountryCode),
      reuseMode: reuseModeSelect.value === 'new_tab' ? 'new_tab' : 'reuse',
      autoClosePopupMs: DEFAULT_PREFS.autoClosePopupMs,
      rememberLastMessage: !!rememberMessageCheck.checked,
      lastMessage: rememberMessageCheck.checked ? messageInput.value.trim() : ''
    };
    await storageSet({ prefs });
  }

  async function openInWhatsappTab(phoneE164, message) {
    const waUrl = core.buildWhatsAppUrl(phoneE164, message);

    openBtn.disabled = true;
    openBtn.textContent = 'Opening...';
    setStatus('Opening WhatsApp Web...');

    try {
      const data = await storageGet(['prefs']);
      const prefs = { ...DEFAULT_PREFS, ...(data.prefs || {}) };
      const reuseMode = prefs.reuseMode === 'new_tab' ? 'new_tab' : 'reuse';

      if (reuseMode === 'new_tab') {
        await chromeCall(chrome.tabs.create, { url: waUrl });
        setStatus('Opened chat in a new tab.');
      } else {
        const allTabs = await chromeCall(chrome.tabs.query, {});
        const waTabs = core.filterWaTabs(allTabs);
        const preferredTab = await getPreferredTab(waTabs);

        if (preferredTab && typeof preferredTab.id === 'number') {
          await chromeCall(chrome.tabs.update, preferredTab.id, { url: waUrl, active: true });
          if (typeof preferredTab.windowId === 'number') {
            try {
              await chromeCall(chrome.windows.update, preferredTab.windowId, { focused: true });
            } catch (_err) {
              // Non-blocking focus error.
            }
          }
          setStatus('Chat opened in existing WhatsApp tab.');
        } else {
          await chromeCall(chrome.tabs.create, { url: waUrl });
          setStatus('Opened chat in a new WhatsApp tab.');
        }
      }

      await saveRecentNumber(phoneE164);
      await savePreferences();
      await storageSet({ lastChat: { phone: phoneE164, message: String(message || '').trim() } });

      const closeDelay = Number(prefs.autoClosePopupMs) > 0 ? Number(prefs.autoClosePopupMs) : 500;
      setTimeout(() => window.close(), closeDelay);
    } catch (err) {
      const msg = err && err.message ? err.message : 'Failed to open WhatsApp chat';
      if (/No tab with id/i.test(msg)) {
        setStatus('Could not reuse the tab. Please try again.', true);
      } else if (/permission|denied|access/i.test(msg)) {
        setStatus('Permission issue. Reload extension and try again.', true);
      } else {
        setStatus(`Error: ${msg}`, true);
      }
    } finally {
      openBtn.disabled = false;
      openBtn.textContent = 'Open Chat';
    }
  }

  async function init() {
    setStatus(DEFAULT_STATUS);

    const data = await storageGet(['prefs', 'recent']);
    const prefs = { ...DEFAULT_PREFS, ...(data.prefs || {}) };

    countryCodeSelect.value = core.sanitizeCountryCode(prefs.defaultCountryCode, DEFAULT_PREFS.defaultCountryCode);
    reuseModeSelect.value = prefs.reuseMode === 'new_tab' ? 'new_tab' : 'reuse';
    rememberMessageCheck.checked = !!prefs.rememberLastMessage;
    messageInput.value = prefs.rememberLastMessage ? (prefs.lastMessage || '') : '';

    const recentNumbers = normalizeRecentNumbers(data.recent && data.recent.numbers);
    renderRecentNumbers(recentNumbers);
  }

  openBtn.addEventListener('click', () => {
    const { e164, local } = core.buildPhoneNumber(countryCodeSelect.value, phoneInput.value, DEFAULT_PREFS.defaultCountryCode);

    if (!local) {
      setStatus('Please enter a phone number.', true);
      phoneInput.focus();
      return;
    }

    if (!core.isValidE164(e164)) {
      setStatus('Invalid number. Use 10-15 digits with a valid country code.', true);
      phoneInput.focus();
      phoneInput.select();
      return;
    }

    openInWhatsappTab(e164, messageInput.value);
  });

  phoneInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openBtn.click();
  });

  messageInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') openBtn.click();
  });

  recentNumbersSelect.addEventListener('change', () => {
    const selected = recentNumbersSelect.value;
    if (!selected) return;
    const knownCodes = Array.from(countryCodeSelect.options).map((opt) => opt.value);
    const parsed = core.parseE164(selected, countryCodeSelect.value, knownCodes);
    countryCodeSelect.value = core.sanitizeCountryCode(parsed.countryCode, DEFAULT_PREFS.defaultCountryCode);
    phoneInput.value = core.normalizeDigits(parsed.localNumber);
    phoneInput.focus();
  });

  rememberMessageCheck.addEventListener('change', () => {
    if (!rememberMessageCheck.checked) {
      storageGet(['prefs']).then((data) => {
        const prefs = { ...DEFAULT_PREFS, ...(data.prefs || {}) };
        storageSet({ prefs: { ...prefs, rememberLastMessage: false, lastMessage: '' } });
      });
    }
  });

  clearDataBtn.addEventListener('click', async () => {
    try {
      await chromeCall(chrome.storage.local.remove, ['recent', 'lastChat']);
      const data = await storageGet(['prefs']);
      const prefs = { ...DEFAULT_PREFS, ...(data.prefs || {}) };
      await storageSet({
        prefs: { ...prefs, rememberLastMessage: false, lastMessage: '' }
      });
      rememberMessageCheck.checked = false;
      messageInput.value = '';
      renderRecentNumbers([]);
      setStatus('Local memory cleared.');
    } catch (_err) {
      setStatus('Could not clear data. Please try again.', true);
    }
  });

  init();
})();