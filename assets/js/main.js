/* Fundación Construyendo Futuro — main.js
   Menú · animaciones de entrada · formularios (contacto, certificados) · donaciones.
   JavaScript vanilla, sin dependencias. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     1. MENÚ: desplegable "Quiénes somos" y hamburguesa
     ========================================================= */
  var dropdowns = document.querySelectorAll('[data-dropdown]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var panel = document.querySelector('[data-nav-panel]');

  function setDropdown(dd, open) {
    dd.classList.toggle('is-open', open);
    dd.querySelector('[data-dropdown-btn]').setAttribute('aria-expanded', String(open));
  }

  function setMobileMenu(open) {
    if (!toggle || !panel) return;
    panel.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('[data-dropdown-btn]');
    btn.addEventListener('click', function () {
      var willOpen = !dd.classList.contains('is-open');
      dropdowns.forEach(function (o) { if (o !== dd) setDropdown(o, false); });
      setDropdown(dd, willOpen);
    });
    // Si el foco sale del desplegable con Tab, se cierra
    dd.addEventListener('focusout', function (e) {
      if (e.relatedTarget && !dd.contains(e.relatedTarget)) setDropdown(dd, false);
    });
  });

  document.addEventListener('click', function (e) {
    dropdowns.forEach(function (dd) {
      if (!dd.contains(e.target)) setDropdown(dd, false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    dropdowns.forEach(function (dd) {
      if (dd.classList.contains('is-open')) {
        setDropdown(dd, false);
        dd.querySelector('[data-dropdown-btn]').focus();
      }
    });
    setMobileMenu(false);
  });

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMobileMenu(!panel.classList.contains('is-open'));
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
      if (mq.matches) setMobileMenu(false);
    });
  }

  /* =========================================================
     2. ANIMACIÓN DE ENTRADA (una sola vez por elemento)
        Solo transform + opacity. Escalonado 70ms, máximo 5 hermanos.
     ========================================================= */
  var revealEls = document.querySelectorAll('[data-reveal]');
  var orbits = document.querySelectorAll('.orbit, .page-tabs');

  function showAll() {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
    orbits.forEach(function (el) { el.classList.add('is-in'); });
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    // Índice de escalonado según la posición entre hermanos animados
    var counts = new Map();
    revealEls.forEach(function (el) {
      var p = el.parentElement;
      var i = counts.get(p) || 0;
      el.style.setProperty('--i', Math.min(i, 4));
      counts.set(p, i + 1);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
    orbits.forEach(function (el) { io.observe(el); });
  }

  /* =========================================================
     3. FORMULARIOS (contacto, certificados)
        Envío por fetch a un webhook de n8n definido en data-webhook.
        Si data-webhook está vacío, el formulario funciona en MODO DEMO:
        valida y muestra el estado de "gracias", pero no envía nada.
     ========================================================= */
  function fieldOf(el) { return el.closest('.field') || el.closest('.consent'); }

  function setError(el, message) {
    var wrap = fieldOf(el);
    if (!wrap) return;
    var err = wrap.querySelector('.error');
    wrap.classList.add('has-error');
    el.setAttribute('aria-invalid', 'true');
    if (err) {
      err.textContent = message;
      if (!err.id) err.id = 'err-' + (el.id || el.name);
      el.setAttribute('aria-describedby', err.id);
    }
  }

  function clearError(el) {
    var wrap = fieldOf(el);
    if (!wrap) return;
    wrap.classList.remove('has-error');
    el.removeAttribute('aria-invalid');
  }

  function validateField(el) {
    clearError(el);
    if (el.disabled || el.type === 'hidden') return true;
    if (el.type === 'checkbox') {
      if (el.required && !el.checked) { setError(el, el.getAttribute('data-msg') || 'Este campo es obligatorio.'); return false; }
      return true;
    }
    var v = (el.value || '').trim();
    if (el.required && !v) { setError(el, 'Este campo es obligatorio.'); return false; }
    if (v && el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setError(el, 'Escribe un correo válido, por ejemplo nombre@correo.com.'); return false;
    }
    if (v && el.type === 'tel' && v.replace(/\D/g, '').length < 7) {
      setError(el, 'Escribe un número de teléfono válido.'); return false;
    }
    if (v && el.getAttribute('data-digits') !== null && !/^\d{5,12}$/.test(v)) {
      setError(el, 'Escribe solo números, sin puntos ni espacios.'); return false;
    }
    return true;
  }

  /* Grupo de opciones obligatorio (por ejemplo, el motivo del mensaje) */
  function validateGroup(form, fs) {
    var name = fs.getAttribute('data-required-group');
    var ok = !!form.querySelector('input[name="' + name + '"]:checked');
    var err = fs.querySelector('.error');
    fs.classList.toggle('has-error', !ok);
    if (err) err.textContent = ok ? '' : (fs.getAttribute('data-msg') || 'Elige una opción.');
    return ok;
  }

  /* "Con uno de los dos basta": correo o teléfono */
  function validateOneOf(group) {
    var inputs = group.querySelectorAll('input');
    var any = Array.prototype.some.call(inputs, function (i) { return (i.value || '').trim(); });
    if (!any) setError(inputs[0], group.getAttribute('data-msg') || 'Completa al menos uno de estos campos.');
    return any;
  }

  function serialize(form) {
    var data = {};
    new FormData(form).forEach(function (val, key) {
      if (key === 'empresa_web') return; // honeypot
      data[key] = val;
    });
    data._pagina = location.pathname.split('/').pop() || 'index.html';
    data._fecha = new Date().toISOString();
    return data;
  }

  function send(form) {
    var url = form.getAttribute('data-webhook');
    if (!url) {
      console.info('[FCF] Modo demo: formulario validado, no enviado (falta data-webhook).', serialize(form));
      return new Promise(function (res) { setTimeout(res, 500); });
    }
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serialize(form))
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); });
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    var card = form.closest('.form-card');
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('[type="submit"]');
    var fields = form.querySelectorAll('input:not([type="radio"]):not([type="hidden"]), select, textarea');

    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.type !== 'checkbox') validateField(el); });
      el.addEventListener('input', function () { if (fieldOf(el) && fieldOf(el).classList.contains('has-error')) validateField(el); });
      el.addEventListener('change', function () { if (fieldOf(el) && fieldOf(el).classList.contains('has-error')) validateField(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) { status.textContent = ''; status.classList.remove('is-error'); }

      var bad = [];
      fields.forEach(function (el) {
        if (!validateField(el)) bad.push(el);
      });
      form.querySelectorAll('[data-required-group]').forEach(function (fs) {
        if (!validateGroup(form, fs)) bad.push(fs.querySelector('input'));
      });
      form.querySelectorAll('[data-one-of]').forEach(function (g) {
        if (!validateOneOf(g)) bad.push(g.querySelector('input'));
      });
      if (bad.length) {
        // El foco va al primer error según el orden de la página
        bad.sort(function (a, b) { return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
        bad[0].focus();
        return;
      }

      var hp = form.querySelector('[name="empresa_web"]');
      if (hp && hp.value) { card.classList.add('is-sent'); return; } // bot

      var label = submit.textContent;
      submit.disabled = true;
      submit.textContent = 'Enviando…';

      send(form).then(function () {
        card.classList.add('is-sent');
        var h = card.querySelector('.thanks h2');
        if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      }).catch(function () {
        if (status) {
          status.textContent = 'No se pudo enviar el formulario. Revisa tu conexión e inténtalo de nuevo.';
          status.classList.add('is-error');
        }
      }).then(function () {
        submit.disabled = false;
        submit.textContent = label;
      });
    });

    // Al elegir una opción o escribir uno de los dos datos de contacto, el aviso desaparece
    form.querySelectorAll('[data-required-group]').forEach(function (fs) {
      fs.addEventListener('change', function () { validateGroup(form, fs); });
    });
    form.querySelectorAll('[data-one-of]').forEach(function (g) {
      g.addEventListener('input', function () {
        g.querySelectorAll('input').forEach(function (i) { if (!(i.value || '').trim()) clearError(i); });
      });
    });

    var again = card && card.querySelector('[data-again]');
    if (again) {
      again.addEventListener('click', function () {
        form.reset();
        card.classList.remove('is-sent');
        fields.forEach(clearError);
        form.querySelectorAll('fieldset.has-error').forEach(function (fs) { fs.classList.remove('has-error'); });
        var first = form.querySelector('input:not([type="hidden"]), select, textarea');
        if (first) first.focus();
        form.dispatchEvent(new Event('fcf:reset'));
      });
    }
  });

  /* ---- Contacto: el campo cambia a "Entidad" según el motivo ---- */
  var motivos = document.querySelectorAll('input[name="motivo"]');
  var orgInput = document.getElementById('org');
  var orgLabel = document.getElementById('org-label');
  var orgHint = document.getElementById('org-hint');

  var msgHint = document.getElementById('msg-hint');
  var MSG_HINTS = {
    ayudar: 'Cuéntanos cómo te gustaría ayudar.',
    familiar: 'Cuéntanos para quién buscas apoyo y cuál es su situación. Tratamos lo que nos cuentes con reserva.',
    entidad: 'Cuéntanos qué necesita tu entidad.',
    empleo: 'Cuéntanos tu perfil y tu experiencia. Te diremos cómo enviarnos tu hoja de vida.'
  };

  function updateMotivo() {
    if (!orgInput || !orgLabel) return;
    var sel = document.querySelector('input[name="motivo"]:checked');
    if (msgHint) msgHint.textContent = (sel && MSG_HINTS[sel.value]) || '';
    var isEntity = sel && sel.value === 'entidad';
    orgLabel.textContent = isEntity ? 'Entidad' : 'Ciudad o barrio';
    orgInput.required = isEntity;
    orgInput.setAttribute('autocomplete', isEntity ? 'organization' : 'address-level2');
    orgInput.placeholder = isEntity ? 'Nombre de la entidad' : '';
    if (orgHint) orgHint.textContent = isEntity ? '' : 'Opcional';
    clearError(orgInput);
  }
  motivos.forEach(function (m) { m.addEventListener('change', updateMotivo); });
  var q = new URLSearchParams(location.search).get('motivo');
  if (q) {
    var pre = document.querySelector('input[name="motivo"][value="' + q + '"]');
    if (pre) pre.checked = true;
  }
  updateMotivo();
  var contactForm = document.querySelector('form[data-form]');
  if (contactForm) contactForm.addEventListener('fcf:reset', updateMotivo);

  /* ---- Certificados: teclado numérico según el tipo de documento ---- */
  var docType = document.getElementById('tipo-doc');
  var docNum = document.getElementById('num-doc');
  if (docType && docNum) {
    docType.addEventListener('change', function () {
      var isPassport = docType.value === 'pasaporte';
      docNum.setAttribute('inputmode', isPassport ? 'text' : 'numeric');
      if (isPassport) docNum.removeAttribute('data-digits'); else docNum.setAttribute('data-digits', '');
      clearError(docNum);
    });
  }

  /* =========================================================
     4. DONACIONES: frecuencia, montos y botón "Donar $X"
        La pasarela de pagos aún no está definida: el botón informa
        cómo aportar mientras tanto (transferencia o contacto).
     ========================================================= */
  var donation = document.querySelector('[data-donation]');
  if (donation) {
    var btn = donation.querySelector('[data-donate-btn]');
    var other = donation.querySelector('#otro-monto');
    var notice = donation.querySelector('.notice');
    var money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

    function currentAmount() {
      var typed = other && other.value.replace(/\D/g, '');
      if (typed) return parseInt(typed, 10);
      var sel = donation.querySelector('input[name="monto"]:checked');
      return sel ? parseInt(sel.value, 10) : 0;
    }

    var summary = donation.querySelector('[data-donate-summary]');

    function amountText() {
      var freq = donation.querySelector('input[name="frecuencia"]:checked');
      var monthly = freq && freq.value === 'mensual';
      var amount = currentAmount();
      return amount ? money.format(amount).replace(/\s/g, '') + (monthly ? ' cada mes' : '') : '';
    }

    function updateDonation() {
      var txt = amountText();
      btn.textContent = txt ? 'Quiero aportar ' + txt : 'Elige un valor para aportar';
      btn.disabled = !txt;
      if (summary && notice.classList.contains('is-visible')) summary.textContent = 'Gracias por querer aportar ' + txt + '.';
    }

    donation.querySelectorAll('input[name="frecuencia"], input[name="monto"]').forEach(function (i) {
      i.addEventListener('change', function () {
        if (i.name === 'monto' && other) other.value = '';
        updateDonation();
      });
    });
    if (other) {
      other.addEventListener('input', function () {
        other.value = other.value.replace(/\D/g, '').slice(0, 9);
        if (other.value) donation.querySelectorAll('input[name="monto"]').forEach(function (r) { r.checked = false; });
        updateDonation();
      });
    }
    btn.addEventListener('click', function () {
      if (summary) summary.textContent = 'Gracias por querer aportar ' + amountText() + '.';
      notice.classList.add('is-visible');
      notice.focus();
    });
    updateDonation();
  }

  /* Botones de descarga aún sin archivo (aria-disabled): no navegan */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[aria-disabled="true"]');
    if (a) e.preventDefault();
  });
})();
