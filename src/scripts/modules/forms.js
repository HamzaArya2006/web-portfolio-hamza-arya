import { warn, error } from './logger.js';
import { notify } from './notifications.js';

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
  // Set timestamp when form is focused (better anti-bot timing)
  let formFocusTime = null;
  form.addEventListener('focusin', () => {
    if (!formFocusTime) {
      formFocusTime = Date.now();
      tsField.value = formFocusTime.toString();
    }
  }, { once: true });
  // Fallback: set on page load if form never gets focus
  if (!formFocusTime) {
    tsField.value = Date.now().toString();
  }

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
    const submissionData = { name, email, brief, budget, website: formData.get('website') || '', _ts: Number(tsField.value) || Date.now() };
    
    if (endpoint) {
      try {
        setLoading(true);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Request failed');
        }
        showStatus('Thanks! I will get back to you shortly.', 'success');
        notify.success('Message sent!', 'I will get back to you shortly.');
        form.reset();
        submitting = false;
        return;
      } catch (err) {
        warn('Form endpoint failed, trying background sync.', err);
        
        // Try to store in IndexedDB for background sync
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
          try {
            await storeSubmissionForSync(submissionData);
            showStatus('Message queued. Will be sent when connection is restored.', 'info');
            notify.info('Message queued', 'Will be sent when connection is restored.');
            
            // Register background sync
            const registration = await navigator.serviceWorker.ready;
            await registration.sync.register('sync-contact-form');
            
            form.reset();
            submitting = false;
            return;
          } catch (syncErr) {
            error('Background sync setup failed:', syncErr);
            // Handle quota exceeded or other IndexedDB errors
            if (syncErr.name === 'QuotaExceededError') {
              showStatus('Storage limit reached. Please try again later or email directly.', 'error');
              notify.error('Storage limit reached', 'Please try again later or email directly.');
              submitting = false;
              return;
            }
          }
        }
        
        warn('Background sync not available, falling back to email.');
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
      notify.info('Opening email app', 'If it does not open, email contact@hamzaarya.dev');
      form.reset();
    } catch (_) {
      showStatus('Could not open email app. Please email contact@hamzaarya.dev', 'error');
    } finally {
      setLoading(false);
      submitting = false;
    }
  });
}

// Store submission in IndexedDB for background sync
async function storeSubmissionForSync(data) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('contact-forms', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['submissions'], 'readwrite');
      const store = transaction.objectStore('submissions');
      const submission = { data, timestamp: Date.now() };
      const addRequest = store.add(submission);
      
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => reject(addRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('submissions')) {
        db.createObjectStore('submissions', { keyPath: 'id', autoIncrement: true });
      }
    };
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
    field.setAttribute('aria-invalid', 'true');
    
    // Remove existing error if any
    let errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
      errorEl.remove();
    }
    
    // Create error container
    errorEl = document.createElement('div');
    errorEl.className = 'field-error text-red-400 text-sm mt-1';
    errorEl.setAttribute('role', 'alert');
    errorEl.id = `${field.name || field.id || 'field'}-error`;
    field.parentNode.appendChild(errorEl);
    errorEl.textContent = message;
    
    // Link field to error via aria-describedby
    const existingDescribedBy = field.getAttribute('aria-describedby');
    const errorId = errorEl.id;
    if (existingDescribedBy && !existingDescribedBy.includes(errorId)) {
      field.setAttribute('aria-describedby', `${existingDescribedBy} ${errorId}`);
    } else if (!existingDescribedBy) {
      field.setAttribute('aria-describedby', errorId);
    }
  }
  function clearFieldError(field) {
    field.classList.remove('border-red-500');
    field.setAttribute('aria-invalid', 'false');
    const errorEl = field.parentNode.querySelector('.field-error');
    if (errorEl) {
      // Remove the error ID from aria-describedby
      const describedBy = field.getAttribute('aria-describedby');
      if (describedBy) {
        const errorId = errorEl.id;
        const newDescribedBy = describedBy
          .split(' ')
          .filter(id => id !== errorId)
          .join(' ')
          .trim();
        if (newDescribedBy) {
          field.setAttribute('aria-describedby', newDescribedBy);
        } else {
          field.removeAttribute('aria-describedby');
        }
      }
      errorEl.remove();
    }
  }
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


