//  Молоток — main.js
//  Мобильное меню + анимации + форма заявки

function initMolotok() {

  // === Мобильное меню ===
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // === Анимация fade-in при скролле ===
  const fadeElements = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // === Плавный скролл к якорям ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === Активная ссылка в навигации ===
  const currentPath = window.location.pathname;
  if (nav) {
    nav.querySelectorAll('a').forEach(a => {
      const linkPath = a.getAttribute('href');
      if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
        a.style.color = 'var(--accent)';
      }
    });
  }

  // === Форма заявки ===
  const form = document.getElementById('orderForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const nameInput = document.getElementById('formName');
  const phoneInput = document.getElementById('formPhone');
  const commentInput = document.getElementById('formComment');

  // Маска телефона
  phoneInput.addEventListener('input', () => {
    let d = phoneInput.value.replace(/[^\d]/g, '');
    if (!d.length) { phoneInput.value = ''; return; }
    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    let v = '+7';
    if (d.length > 0) v += ' (' + d.slice(0, 3);
    if (d.length > 3) v += ') ' + d.slice(3, 6);
    if (d.length > 6) v += '-' + d.slice(6, 8);
    if (d.length > 8) v += '-' + d.slice(8, 10);
    phoneInput.value = v;
  });

  // Сброс ошибок при фокусе
  [nameInput, phoneInput, commentInput].forEach(inp => {
    inp.addEventListener('focus', () => {
      inp.style.borderColor = '';
      inp.style.backgroundColor = '';
      status.style.display = 'none';
    });
  });

  const showError = (input, msg) => {
    input.style.borderColor = '#ef4444';
    input.style.backgroundColor = '#fef2f2';
    status.textContent = msg;
    status.style.color = '#ef4444';
    status.style.display = 'block';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.style.display = 'none';

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const comment = commentInput.value.trim();
    const phoneDigits = phone.replace(/[^\d]/g, '');

    // Имя
    if (!name || name.length < 2) {
      showError(nameInput, 'Укажите имя (минимум 2 буквы)');
      nameInput.focus();
      return;
    }
    if (name.length > 50) {
      showError(nameInput, 'Слишком длинное имя');
      nameInput.focus();
      return;
    }

    // Телефон
    if (!phone || phoneDigits.length < 10 || phoneDigits.length > 12) {
      showError(phoneInput, 'Введите корректный номер телефона');
      phoneInput.focus();
      return;
    }
    if (!phone.startsWith('+7')) {
      showError(phoneInput, 'Номер должен начинаться с +7');
      phoneInput.focus();
      return;
    }

    // Комментарий
    if (comment.length > 500) {
      showError(commentInput, 'Комментарий слишком длинный (макс. 500 символов)');
      commentInput.focus();
      return;
    }

    // Блокировка кнопки
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем…';
    btn.disabled = true;

    // Экранирование HTML для сообщения
    const esc = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const msg = [
      '🛠 <b>Новая заявка с molotok.nsk.ru</b>',
      '',
      '👤 <b>Имя:</b> ' + esc(name),
      '📞 <b>Телефон:</b> ' + esc(phone),
      '💬 <b>Комментарий:</b> ' + (comment ? esc(comment) : '—'),
      '🌐 <b>Страница:</b> ' + window.location.pathname
    ].join('\n');

    try {
      const res = await fetch('https://api.telegram.org/bot7949630793:AAHmdOmSer6igd93mMuBu4w_w2BjIviTDLs/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '-4937769961', text: msg, parse_mode: 'HTML' })
      });
      const data = await res.json();

      if (data.ok) {
        status.textContent = '✅ Заявка отправлена! Мы перезвоним в течение 15 минут.';
        status.style.color = '#16a34a';
        status.style.display = 'block';
        form.reset();
      } else {
        showError(null, '❌ Ошибка отправки. Позвоните нам: +7 (913) 761-14-19');
      }
    } catch {
      showError(null, '❌ Ошибка сети. Позвоните нам: +7 (913) 761-14-19');
    }

    btn.innerHTML = orig;
    btn.disabled = false;
    setTimeout(() => { status.style.display = 'none'; }, 12000);
  });

}

// Запускаем после подгрузки компонентов (хедер/футер)
var readyState = document.readyState;
if (readyState === 'complete' || readyState === 'interactive') {
  // Если компоненты уже загружены через inject.js
  document.addEventListener('components-loaded', initMolotok);
  // fallback — через 500 мс на случай если событие уже прошло
  setTimeout(initMolotok, 800);
} else {
  document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('components-loaded', initMolotok);
    setTimeout(initMolotok, 800);
  });
}

// === Модальное окно ===
const overlay = document.getElementById('modalOverlay');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('modalClose');

if (overlay && openBtn && closeBtn) {
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('formNameModal').focus();
  });

  const closeModal = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}

// === Форма в модалке ===
const mForm = document.getElementById('orderFormModal');
if (mForm) {
  const mName = document.getElementById('formNameModal');
  const mPhone = document.getElementById('formPhoneModal');
  const mComment = document.getElementById('formCommentModal');
  const mStatus = document.getElementById('modalStatus');

  // Маска
  mPhone.addEventListener('input', () => {
    let d = mPhone.value.replace(/[^\d]/g, '');
    if (!d.length) { mPhone.value = ''; return; }
    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    let v = '+7';
    if (d.length > 0) v += ' (' + d.slice(0, 3);
    if (d.length > 3) v += ') ' + d.slice(3, 6);
    if (d.length > 6) v += '-' + d.slice(6, 8);
    if (d.length > 8) v += '-' + d.slice(8, 10);
    mPhone.value = v;
  });

  mForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    mStatus.style.display = 'none';

    const name = mName.value.trim();
    const phone = mPhone.value.trim();
    const comment = mComment.value.trim();
    const phoneDigits = phone.replace(/[^\d]/g, '');

    if (!name || name.length < 2) {
      mStatus.textContent = 'Укажите имя (минимум 2 буквы)';
      mStatus.style.color = '#ef4444'; mStatus.style.display = 'block';
      mName.focus(); return;
    }
    if (!phone || phoneDigits.length < 10 || !phone.startsWith('+7')) {
      mStatus.textContent = 'Введите корректный номер телефона';
      mStatus.style.color = '#ef4444'; mStatus.style.display = 'block';
      mPhone.focus(); return;
    }

    const btn = mForm.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем…';
    btn.disabled = true;

    const esc = s => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const msg = [
      '🛠 <b>Новая заявка с molotok.nsk.ru</b>',
      '',
      '👤 <b>Имя:</b> ' + esc(name),
      '📞 <b>Телефон:</b> ' + esc(phone),
      '💬 <b>Комментарий:</b> ' + (comment ? esc(comment) : '—'),
      '🌐 <b>Страница:</b> ' + window.location.pathname + ' (модалка)'
    ].join('\n');

    try {
      const res = await fetch('https://api.telegram.org/bot7949630793:AAHmdOmSer6igd93mMuBu4w_w2BjIviTDLs/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: '-4937769961', text: msg, parse_mode: 'HTML' })
      });
      const data = await res.json();
      if (data.ok) {
        mStatus.textContent = '✅ Заявка отправлена! Мы перезвоним.';
        mStatus.style.color = '#16a34a'; mStatus.style.display = 'block';
        mForm.reset();
        setTimeout(() => { overlay.classList.remove('open'); document.body.style.overflow = ''; }, 1500);
      } else {
        mStatus.textContent = '❌ Ошибка. Позвоните: +7 (913) 761-14-19';
        mStatus.style.color = '#ef4444'; mStatus.style.display = 'block';
      }
    } catch {
      mStatus.textContent = '❌ Ошибка. Позвоните: +7 (913) 761-14-19';
      mStatus.style.color = '#ef4444'; mStatus.style.display = 'block';
    }
    btn.innerHTML = orig;
    btn.disabled = false;
    setTimeout(() => { mStatus.style.display = 'none'; }, 10000);
  });
}

// === Аккордеон преимуществ ===
function toggleAccordion(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');
  // Закрыть все
  document.querySelectorAll('.accordion-item.active').forEach(el => el.classList.remove('active'));
  if (!isActive) item.classList.add('active');
}
