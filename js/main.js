/**
 * EDILE 360 - JAVASCRIPT PRINCIPALE
 * Gestione interattiva: Header, Menu Mobile, Calcolatore preventivi e Form contatti.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. HEADER STICKY & TORNA IN CIMA ---
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 350) {
      scrollToTopBtn?.classList.add('visible');
    } else {
      scrollToTopBtn?.classList.remove('visible');
    }
  });

  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // --- 2. MENU MOBILE ---
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // --- 3. CALCOLATORE PREVENTIVI RAPIDO ---
  const calcRadios = document.querySelectorAll('input[name="calc-service"]');
  const calcMqSlider = document.getElementById('calc-mq');
  const mqValueDisplay = document.getElementById('mq-value');
  const calcCheckboxes = document.querySelectorAll('.calc-extra-checkbox');
  const calcPriceDisplay = document.getElementById('calc-price-result');
  const calcApplyBtn = document.getElementById('calc-apply-btn');

  // Tariffe base di mercato realistiche al mq
  const baseRates = {
    'ristrutturazione-totale': 1000, // ~1.000 €/mq per ristrutturazione completa chiavi in mano
    'bagno-cucina': 850,
    'cappotto-termico': 130,
    'nuova-costruzione': 1600,
    'tetto-facciata': 180
  };

  function updateCalculation() {
    let selectedService = 'ristrutturazione-totale';
    calcRadios.forEach(radio => {
      const parentLabel = radio.closest('.calc-pill-label');
      if (radio.checked) {
        selectedService = radio.value;
        parentLabel?.classList.add('selected');
      } else {
        parentLabel?.classList.remove('selected');
      }
    });

    const mq = parseInt(calcMqSlider?.value || '85', 10);
    if (mqValueDisplay) {
      mqValueDisplay.textContent = `${mq} m²`;
    }

    const unitPrice = baseRates[selectedService] || 1000;
    let totalBase = unitPrice * mq;

    let extraCost = 0;
    calcCheckboxes.forEach(cb => {
      if (cb.checked) {
        extraCost += parseInt(cb.dataset.cost || '0', 10);
      }
    });

    const finalMin = Math.round((totalBase + extraCost) * 0.9);
    const finalMax = Math.round((totalBase + extraCost) * 1.15);

    if (calcPriceDisplay) {
      calcPriceDisplay.textContent = `€ ${finalMin.toLocaleString('it-IT')} - € ${finalMax.toLocaleString('it-IT')}`;
    }
  }

  calcRadios.forEach(radio => {
    radio.addEventListener('change', updateCalculation);
    radio.closest('.calc-pill-label')?.addEventListener('click', () => {
      radio.checked = true;
      updateCalculation();
    });
  });

  calcMqSlider?.addEventListener('input', updateCalculation);
  calcCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculation));

  // Inizializza al caricamento
  updateCalculation();

  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      let selectedServiceName = 'Ristrutturazione Completa';
      const checkedRadio = document.querySelector('input[name="calc-service"]:checked');
      if (checkedRadio) {
        selectedServiceName = checkedRadio.closest('.calc-pill-label')?.textContent.trim() || selectedServiceName;
      }

      const mq = calcMqSlider?.value || '85';
      const estimatedPrice = calcPriceDisplay?.textContent || '';

      const serviceSelect = document.getElementById('contact-service');
      const messageField = document.getElementById('contact-message');

      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(selectedServiceName.toLowerCase().slice(0, 5))) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (messageField) {
        messageField.value = `Salve Edile 360, ho calcolato una stima preliminare online per "${selectedServiceName}" di circa ${mq} mq (${estimatedPrice}). Vorrei fissare un sopralluogo gratuito per visionare i lavori e definire il preventivo.`;
      }

      const contactSection = document.getElementById('contatti');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        messageField?.focus();
      }
    });
  }

  // --- 4. FORM CONTATTI & FEEDBACK TOAST ---
  const contactForm = document.getElementById('main-contact-form');
  const toast = document.getElementById('toast-notification');

  function showToast(message, isSuccess = true) {
    if (!toast) return;
    const toastMsg = toast.querySelector('.toast-text');
    const toastIcon = toast.querySelector('.toast-icon');

    if (toastMsg) toastMsg.textContent = message;
    if (toastIcon) {
      if (isSuccess) {
        toastIcon.className = 'fa-solid fa-circle-check toast-icon';
        toast.style.borderLeftColor = '#16a34a';
      } else {
        toastIcon.className = 'fa-solid fa-circle-exclamation toast-icon';
        toast.style.borderLeftColor = '#dc2626';
      }
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const phone = document.getElementById('contact-phone')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const privacy = document.getElementById('contact-privacy')?.checked;

      if (!name || !phone || !email) {
        showToast('Compila tutti i campi obbligatori.', false);
        return;
      }

      if (!privacy) {
        showToast('È necessario accettare l\'informativa sulla privacy per procedere.', false);
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Invio in corso...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        showToast('Richiesta inviata con successo! Un nostro responsabile ti contatterà al più presto.');
        contactForm.reset();
        updateCalculation();
      }, 1000);
    });
  }

  // --- 5. SMOOTH SCROLL ANCHOR ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
