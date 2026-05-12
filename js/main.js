//  Молоток — main.js
//  Всё внутри initMolotok — вызывается inject.js после подгрузки хедера/футера

function initMolotok() {

  // === Мобильное меню ===
  var toggle = document.getElementById('mobileToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function() { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() { nav.classList.remove('open'); });
    });
  }

  // === Анимация fade-in при скролле ===
  var fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(function(el) { observer.observe(el); });
  } else {
    fadeElements.forEach(function(el) { el.classList.add('visible'); });
  }

  // === Плавный скролл к якорям ===
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // === Активная ссылка в навигации ===
  if (nav) {
    var currentPath = window.location.pathname;
    nav.querySelectorAll('a').forEach(function(a) {
      var linkPath = a.getAttribute('href');
      if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
        a.style.color = 'var(--accent)';
      }
    });
  }

  // === Модальное окно ===
  var overlay = document.getElementById('modalOverlay');
  var openBtn = document.getElementById('openModalBtn');
  var closeBtn = document.getElementById('modalClose');

  if (overlay && openBtn && closeBtn) {
    openBtn.addEventListener('click', function(e) {
      e.preventDefault();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      var fn = document.getElementById('formNameModal');
      if (fn) fn.focus();
    });

    var closeModal = function() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });
  }

  // === Форма заявки (основная) ===
  var form = document.getElementById('orderForm');
  if (form) setupForm(form, 'formStatus', 'formName', 'formPhone', 'formComment', false);

  // === Форма заявки (модалка) ===
  var mForm = document.getElementById('orderFormModal');
  if (mForm) setupForm(mForm, 'modalStatus', 'formNameModal', 'formPhoneModal', 'formCommentModal', true);

  // === Аккордеон преимуществ ===
  document.querySelectorAll('.accordion-header').forEach(function(hdr) {
    hdr.addEventListener('click', function() {
      var item = this.parentElement;
      var isActive = item.classList.contains('active');
      document.querySelectorAll('.accordion-item.active').forEach(function(el) { el.classList.remove('active'); });
      if (!isActive) item.classList.add('active');
    });
  });
}

function setupForm(form, statusId, nameId, phoneId, commentId, isModal) {
  var status = document.getElementById(statusId);
  var nameInput = document.getElementById(nameId);
  var phoneInput = document.getElementById(phoneId);
  var commentInput = document.getElementById(commentId);
  if (!status || !nameInput || !phoneInput) return;

  // Маска телефона
  phoneInput.addEventListener('input', function() {
    var d = phoneInput.value.replace(/[^\d]/g, '');
    if (!d.length) { phoneInput.value = ''; return; }
    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    var v = '+7';
    if (d.length > 0) v += ' (' + d.slice(0, 3);
    if (d.length > 3) v += ') ' + d.slice(3, 6);
    if (d.length > 6) v += '-' + d.slice(6, 8);
    if (d.length > 8) v += '-' + d.slice(8, 10);
    phoneInput.value = v;
  });

  // Сброс ошибок
  [nameInput, phoneInput, commentInput].forEach(function(inp) {
    inp.addEventListener('focus', function() {
      inp.style.borderColor = '';
      inp.style.backgroundColor = '';
      status.style.display = 'none';
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    status.style.display = 'none';

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var comment = commentInput.value.trim();
    var phoneDigits = phone.replace(/[^\d]/g, '');

    if (!name || name.length < 2) {
      showFormError(status, nameInput, 'Укажите имя (минимум 2 буквы)');
      nameInput.focus(); return;
    }
    if (name.length > 50) {
      showFormError(status, nameInput, 'Слишком длинное имя');
      nameInput.focus(); return;
    }
    if (!phone || phoneDigits.length < 10 || phoneDigits.length > 12) {
      showFormError(status, phoneInput, 'Введите корректный номер телефона');
      phoneInput.focus(); return;
    }
    if (!phone.startsWith('+7')) {
      showFormError(status, phoneInput, 'Номер должен начинаться с +7');
      phoneInput.focus(); return;
    }
    if (comment.length > 500) {
      showFormError(status, commentInput, 'Комментарий слишком длинный (макс. 500 символов)');
      commentInput.focus(); return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем\u2026';
    btn.disabled = true;

    var esc = function(s) { return s.replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var msg = [
      '\uD83D\uDEE0 <b>Новая заявка с molotok.nsk.ru</b>',
      '',
      '\uD83D\uDC64 <b>Имя:</b> ' + esc(name),
      '\uD83D\uDCDE <b>Телефон:</b> ' + esc(phone),
      '\uD83D\uDCAC <b>Комментарий:</b> ' + (comment ? esc(comment) : '\u2014'),
      '\uD83C\uDF10 <b>Страница:</b> ' + window.location.pathname + (isModal ? ' (модалка)' : '')
    ].join('\n');

    fetch('https://api.telegram.org/bot7949630793:AAHmdOmSer6igd93mMuBu4w_w2BjIviTDLs/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '-4937769961', text: msg, parse_mode: 'HTML' })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.ok) {
        status.textContent = '\u2705 Заявка отправлена! Мы перезвоним в течение 15 минут.';
        status.style.color = '#16a34a';
        status.style.display = 'block';
        form.reset();
        if (isModal) {
          setTimeout(function() {
            var ov = document.getElementById('modalOverlay');
            if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
          }, 1500);
        }
      } else {
        showFormError(status, null, '\u274C Ошибка отправки. Позвоните: +7 (913) 761-14-19');
      }
    }).catch(function() {
      showFormError(status, null, '\u274C Ошибка сети. Позвоните: +7 (913) 761-14-19');
    });

    btn.innerHTML = orig;
    btn.disabled = false;
    setTimeout(function() { status.style.display = 'none'; }, 12000);
  });
}

function showFormError(status, input, msg) {
  if (input) {
    input.style.borderColor = '#ef4444';
    input.style.backgroundColor = '#fef2f2';
  }
  status.textContent = msg;
  status.style.color = '#ef4444';
  status.style.display = 'block';
}
