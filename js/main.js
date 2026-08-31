/**
 * EDILE 360 - MAIN INTERACTIVE JAVASCRIPT
 * Gestione interattiva di: Menu mobile, Calcolatore preventivi in tempo reale,
 * Filtri Portfolio, Accordion FAQ, Validazione form contatti e Notifiche.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. STICKY HEADER & SCROLL BEHAVIOR ---
  const header = document.querySelector('.header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
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

  // --- 2. MOBILE MENU TOGGLE ---
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

    // Close menu when clicking on a link
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

  // --- 3. INTERACTIVE QUOTE CALCULATOR ---
  const calcRadios = document.querySelectorAll('input[name="calc-service"]');
  const calcMqSlider = document.getElementById('calc-mq');
  const mqValueDisplay = document.getElementById('mq-value');
  const calcCheckboxes = document.querySelectorAll('.calc-extra-checkbox');
  const calcPriceDisplay = document.getElementById('calc-price-result');
  const calcApplyBtn = document.getElementById('calc-apply-btn');

  // Prezzi base al mq orientativi per tipologia di lavoro
  const baseRates = {
    'ristrutturazione-totale': 480,
    'bagno-cucina': 650,
    'cappotto-termico': 120,
    'nuova-costruzione': 1300,
    'tetto-facciata': 150
  };

  function updateCalculation() {
    // 1. Get selected service
    let selectedService = 'ristrutturazione-totale';
    calcRadios.forEach(radio => {
      const card = radio.closest('.calc-radio-card');
      if (radio.checked) {
        selectedService = radio.value;
        card?.classList.add('selected');
      } else {
        card?.classList.remove('selected');
      }
    });

    // 2. Get square meters
    const mq = parseInt(calcMqSlider?.value || '80', 10);
    if (mqValueDisplay) {
      mqValueDisplay.textContent = `${mq} m²`;
    }

    // 3. Base cost calculation
    const unitPrice = baseRates[selectedService] || 480;
    let totalBase = unitPrice * mq;

    // 4. Extras
    let extraCost = 0;
    calcCheckboxes.forEach(cb => {
      if (cb.checked) {
        const extraValue = parseInt(cb.dataset.cost || '0', 10);
        extraCost += extraValue;
      }
    });

    const finalMin = Math.round((totalBase + extraCost) * 0.9);
    const finalMax = Math.round((totalBase + extraCost) * 1.15);

    // Format in EUR currency
    if (calcPriceDisplay) {
      calcPriceDisplay.textContent = `€ ${finalMin.toLocaleString('it-IT')} - € ${finalMax.toLocaleString('it-IT')}`;
    }
  }

  // Bind calculator events
  calcRadios.forEach(radio => {
    radio.addEventListener('change', updateCalculation);
    radio.closest('.calc-radio-card')?.addEventListener('click', () => {
      radio.checked = true;
      updateCalculation();
    });
  });

  calcMqSlider?.addEventListener('input', updateCalculation);
  calcCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculation));

  // Initialize calculation on load
  updateCalculation();

  // "Usa questa stima per richiedere il preventivo"
  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      let selectedServiceName = 'Ristrutturazione Completa';
      const checkedRadio = document.querySelector('input[name="calc-service"]:checked');
      if (checkedRadio) {
        const titleElem = checkedRadio.closest('.calc-radio-card')?.querySelector('.calc-radio-title');
        if (titleElem) selectedServiceName = titleElem.textContent.trim();
      }

      const mq = calcMqSlider?.value || '80';
      const estimatedPrice = calcPriceDisplay?.textContent || '';

      // Pre-compila il form contatti
      const serviceSelect = document.getElementById('contact-service');
      const messageField = document.getElementById('contact-message');

      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.includes(selectedServiceName) || 
              selectedServiceName.includes(serviceSelect.options[i].text)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (messageField) {
        messageField.value = `Salve Edile 360, ho calcolato una stima online per "${selectedServiceName}" di circa ${mq} mq (fascia stimata: ${estimatedPrice}). Vorrei fissare un sopralluogo gratuito per confermare il preventivo dettagliato.`;
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contatti');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight message area
        messageField?.focus();
      }
    });
  }

  // --- 4. PORTFOLIO FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- 5. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- 6. CONTACT FORM SUBMISSION & TOAST NOTIFICATION ---
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
        toast.style.borderLeftColor = 'var(--accent-green)';
      } else {
        toastIcon.className = 'fa-solid fa-circle-exclamation toast-icon';
        toast.style.borderLeftColor = '#ef4444';
      }
    }

    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const phone = document.getElementById('contact-phone')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const privacy = document.getElementById('contact-privacy')?.checked;

      if (!name || !phone || !email) {
        showToast('Compila tutti i campi obbligatori per inviare la richiesta.', false);
        return;
      }

      if (!privacy) {
        showToast('È necessario accettare il trattamento dei dati personali.', false);
        return;
      }

      // Simulate sending with loading state
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

        showToast('Richiesta inviata con successo! Un nostro responsabile ti contatterà entro 24 ore.');
        contactForm.reset();
        updateCalculation();
      }, 1200);
    });
  }

  // --- 7. SMOOTH ANCHOR NAVIGATION ---
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
