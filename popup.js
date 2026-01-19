(() => {
  const input = document.getElementById('phoneInput');
  const btn = document.getElementById('openBtn');
  const status = document.getElementById('status');

  function cleanNumber(val) {
    if (!val || val === '+') return '+91';
    let n = val.replace(/[^\d+]/g, '');
    // Fix: Check if starts with '91' but not '+91'
    if (n.startsWith('91') && !n.startsWith('+91')) n = '+' + n;
    else if (/^\d{10}$/.test(n)) n = '+91' + n;
    // Ensure it starts with + for international format
    if (!n.startsWith('+') && n.length > 0) {
      // If it's a valid number without +, assume it needs country code
      if (/^\d{10,15}$/.test(n)) n = '+91' + n;
    }
    return n;
  }

  function openInWhatsappTab(phone) {
    // WhatsApp Web expects phone number without + sign (just digits)
    const phoneDigits = phone.replace(/\+/g, '');
    const waUrl = 'https://web.whatsapp.com/send?phone=' + phoneDigits;
    
    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Opening...';
    status.textContent = 'Opening WhatsApp Web...';
    
    // Find any tab with WhatsApp Web open
    chrome.tabs.query({url: 'https://web.whatsapp.com/*'}, (tabs) => {
      if (chrome.runtime.lastError) {
        status.textContent = 'Error: ' + chrome.runtime.lastError.message;
        btn.disabled = false;
        btn.textContent = 'Open Chat';
        return;
      }
      if (tabs && tabs.length > 0) {
        // Reuse the first matching tab
        const tab = tabs[0];
        chrome.tabs.update(tab.id, {url: waUrl, active: true}, (updatedTab) => {
          if (chrome.runtime.lastError) {
            status.textContent = 'Error: ' + chrome.runtime.lastError.message;
            btn.disabled = false;
            btn.textContent = 'Open Chat';
            return;
          }
          // Focus window containing the tab
          chrome.windows.update(tab.windowId, {focused: true}, () => {
            if (chrome.runtime.lastError) {
              // Ignore window focus errors as they're not critical
            }
            // Reset button state
            btn.disabled = false;
            btn.textContent = 'Open Chat';
            status.textContent = 'Chat opened successfully!';
            // Close popup after a short delay
            setTimeout(() => window.close(), 500);
          });
        });
      } else {
        // No existing WhatsApp tab, create a new one
        chrome.tabs.create({url: waUrl}, (newTab) => {
          if (chrome.runtime.lastError) {
            status.textContent = 'Error: ' + chrome.runtime.lastError.message;
            btn.disabled = false;
            btn.textContent = 'Open Chat';
            return;
          }
          // Reset button state
          btn.disabled = false;
          btn.textContent = 'Open Chat';
          status.textContent = 'New tab opened!';
          // Close popup after a short delay
          setTimeout(() => window.close(), 500);
        });
      }
    });
  }

  btn.addEventListener('click', () => {
    const phone = cleanNumber(input.value.trim());
    // Improved validation: phone should start with + and have 10-15 digits after +
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    if (!phone || !phoneRegex.test(phone)) {
      status.textContent = 'Please enter a valid phone number';
      status.style.color = '#d32f2f';
      input.focus();
      input.select();
      // Reset status color after 3 seconds
      setTimeout(() => {
        status.textContent = 'Extension will reuse any open WhatsApp Web tab.';
        status.style.color = '#666';
      }, 3000);
      return;
    }
    openInWhatsappTab(phone);
  });

  input.addEventListener('keypress', (e) => { if (e.key === 'Enter') btn.click(); });
})();