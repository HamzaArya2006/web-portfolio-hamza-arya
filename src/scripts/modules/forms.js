export function bindContactForm() {
  const form = document.querySelector('form[data-contact]');
  if (!form) return;
  const statusEl = document.querySelector('[data-contact-status]');
  if (statusEl) {
    statusEl.setAttribute('role', 'status');
    statusEl.setAttribute('aria-live', 'polite');
  }
  let submitting = false;
  // Ensure timestamp field for basic anti-bot timing validation
  let tsField = form.querySelector('input[name="_ts"]');
  if (!tsField) {
    tsField = document.createElement('input');
    tsField.type = 'hidden';
    tsField.name = '_ts';
    form.appendChild(tsField);
  }
  tsField.value = Date.now().toString();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    submitting = true;
    const formData = new FormData(form);
    if (formData.get('website')) {
      form.reset();
      submitting = false;
      return;
    }
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const brief = (formData.get('brief') || '').toString().trim();
    const budget = (formData.get('budget') || '').toString().trim();
    if (!name || !email || !brief) {
      if (statusEl) {
        statusEl.textContent = 'Please fill in your name, email, and project brief.';
        statusEl.classList.remove('hidden');
        statusEl.classList.remove('text-emerald-400');
        statusEl.classList.add('text-red-400');
      }
      submitting = false;
      return;
    }
    const endpoint = import.meta.env.VITE_FORM_ENDPOINT || '/api/contact';
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevBtnText = submitBtn ? submitBtn.textContent : '';
    const setLoading = (loading) => {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Sending…' : prevBtnText;
    };
    const showStatus = (msg, kind = 'info') => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.remove('hidden');
      statusEl.classList.remove('text-red-400', 'text-emerald-400');
      statusEl.classList.add(kind === 'error' ? 'text-red-400' : 'text-emerald-400');
    };
    if (endpoint) {
      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, brief, budget, website: formData.get('website') || '', _ts: Number(tsField.value) || Date.now() }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Request failed');
        }
        showStatus('Thanks! I will get back to you shortly.', 'success');
        form.reset();
        submitting = false;
        return;
      } catch (err) {
        console.warn('Form endpoint failed, falling back to email.', err);
      } finally {
        setLoading(false);
      }
    }
    const subject = encodeURIComponent('New project inquiry');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\nBrief:\n${brief}`);
    try {
      setLoading(true);
      window.location.href = `mailto:contact@hamzaarya.dev?subject=${subject}&body=${body}`;
      showStatus('Opening your email app… If it does not open, email contact@hamzaarya.dev', 'success');
      form.reset();
    } catch (_) {
      showStatus('Could not open email app. Please email contact@hamzaarya.dev', 'error');
    } finally {
      setLoading(false);
      submitting = false;
    }
  });
}

export function enhanceContactForm() {
  const form = document.querySelector('form[data-contact]');
  if (!form) return;
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    clearFieldError(field);
    if (field.required && !value) {
      showFieldError(field, `${name} is required`);
      return false;
    }
    if (type === 'email' && value && !isValidEmail(value)) {
      showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    return true;
  }
  function showFieldError(field, message) {
    field.classList.add('border-red-500');
    let errorEl = field.parentNode.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'field-error text-red-400 text-sm mt-1';
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }
  function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
      errorEl.remove();
    }
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


