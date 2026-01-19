(() => {
  const input = document.getElementById('phoneInput');
  const btn = document.getElementById('openBtn');
  const status = document.getElementById('status');

  function cleanNumber(val) {
    if (!val || val === '+') return '+91';
    let n = val.replace(/[^\d+]/g, '');
    if (n.startsWith('91') && !n.startsWith('+')) n = '+' + n;
    else if (/^\d{10}$/.test(n)) n = '+91' + n;
    return n;
  }

  function openInWhatsappTab(phone) {
    const waUrl = 'https://web.whatsapp.com/send?phone=' + phone;
    // Find any tab with WhatsApp Web open
    chrome.tabs.query({url: 'https://web.whatsapp.com/*'}, (tabs) => {
      if (chrome.runtime.lastError) {
        status.textContent = 'Error: ' + chrome.runtime.lastError.message;
        return;
      }
      if (tabs && tabs.length > 0) {
        // Reuse the first matching tab
        const tab = tabs[0];
        chrome.tabs.update(tab.id, {url: waUrl, active: true}, () => {
          // Focus window containing the tab
          try { chrome.windows.update(tab.windowId, {focused: true}); } catch (e) {}
        });
      } else {
        // No existing WhatsApp tab, create a new one
        chrome.tabs.create({url: waUrl});
      }
    });
  }

  btn.addEventListener('click', () => {
    const phone = cleanNumber(input.value.trim());
    if (!phone || phone.length < 12) {
      alert('Please enter a valid phone number with country code\nExample: +919876543210 or 9876543210');
      input.focus();
      input.select();
      return;
    }
    openInWhatsappTab(phone);
  });

  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') btn.click(); });
})();