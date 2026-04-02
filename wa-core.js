(() => {
  function normalizeDigits(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function sanitizeCountryCode(code, fallback = '+91') {
    const normalized = String(code || '').trim().replace(/[^\d+]/g, '');
    return /^\+[1-9]\d{0,3}$/.test(normalized) ? normalized : fallback;
  }

  function buildPhoneNumber(countryCode, localNumber, fallback = '+91') {
    const cc = sanitizeCountryCode(countryCode, fallback);
    const local = normalizeDigits(localNumber);
    return { e164: `${cc}${local}`, local };
  }

  function isValidE164(phone) {
    return /^\+[1-9]\d{9,14}$/.test(String(phone || '').trim());
  }

  function buildWhatsAppUrl(phoneE164, message) {
    const params = new URLSearchParams({ phone: normalizeDigits(phoneE164) });
    const text = String(message || '').trim();
    if (text) params.set('text', text);
    return `https://web.whatsapp.com/send?${params.toString()}`;
  }

  function filterWaTabs(tabs) {
    return (tabs || []).filter(
      (tab) => tab && typeof tab.url === 'string' && tab.url.startsWith('https://web.whatsapp.com/')
    );
  }

  function pickPreferredWaTab(waTabs, activeTab) {
    if (!waTabs.length) return null;
    const sorted = [...waTabs].sort((a, b) => {
      const aIsActive = activeTab && a.id === activeTab.id ? 1 : 0;
      const bIsActive = activeTab && b.id === activeTab.id ? 1 : 0;
      if (aIsActive !== bIsActive) return bIsActive - aIsActive;

      const aInCurrent = activeTab && a.windowId === activeTab.windowId ? 1 : 0;
      const bInCurrent = activeTab && b.windowId === activeTab.windowId ? 1 : 0;
      if (aInCurrent !== bInCurrent) return bInCurrent - aInCurrent;

      return (b.lastAccessed || 0) - (a.lastAccessed || 0);
    });
    return sorted[0] || null;
  }

  function parseE164(phone, defaultCountryCode, knownCountryCodes) {
    const digits = normalizeDigits(phone);
    const fallbackCode = sanitizeCountryCode(defaultCountryCode);
    const fallbackDigits = fallbackCode.replace('+', '');
    const codes = (knownCountryCodes || []).map((c) => sanitizeCountryCode(c).replace('+', ''));
    const orderedCodes = [...new Set([fallbackDigits, ...codes])].sort((a, b) => b.length - a.length);

    const matched = orderedCodes.find((code) => digits.startsWith(code));
    if (matched) {
      return { countryCode: `+${matched}`, localNumber: digits.slice(matched.length) };
    }
    return { countryCode: fallbackCode, localNumber: digits };
  }

  function parseSelectedTextToE164(text, defaultCountryCode) {
    const trimmed = String(text || '').trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('+')) {
      const candidate = `+${normalizeDigits(trimmed)}`;
      return isValidE164(candidate) ? candidate : null;
    }

    const local = normalizeDigits(trimmed);
    if (!local) return null;

    const cc = sanitizeCountryCode(defaultCountryCode).replace('+', '');
    const withDefault = `+${cc}${local}`;
    if (isValidE164(withDefault)) return withDefault;

    const direct = `+${local}`;
    return isValidE164(direct) ? direct : null;
  }

  globalThis.WaCore = {
    normalizeDigits,
    sanitizeCountryCode,
    buildPhoneNumber,
    isValidE164,
    buildWhatsAppUrl,
    filterWaTabs,
    pickPreferredWaTab,
    parseE164,
    parseSelectedTextToE164
  };
})();
