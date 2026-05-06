//  Молоток — main.js
//  Мобильное меню + анимации по скроллу

document.addEventListener('DOMContentLoaded', () => {

  // === Мобильное меню ===
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    // Закрыть при клике на ссылку
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
    // Fallback
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // === Плавный скролл к якорям (если не поддерживается CSS) ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80; // высота хедера
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
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

  // === Отправка формы в Telegram ===
  const form = document.getElementById('orderForm');
  if (form) {
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName').value.trim();
      const phone = document.getElementById('formPhone').value.trim();
      const comment = document.getElementById('formComment').value.trim();

      if (!name || !phone) {
        status.textContent = 'Заполните имя и телефон';
        status.style.color = '#ef4444';
        status.style.display = 'block';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
      btn.disabled = true;

      const message = `🛠 <b>Новая заявка с molotok.nsk.ru</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Телефон:</b> ${phone}\n💬 <b>Комментарий:</b> ${comment || '—'}\n🌐 <b>Страница:</b> ${window.location.pathname}`;

      try {
        const res = await fetch('https://api.telegram.org/bot7949630793:AAHmdOmSer6igd93mMuBu4w_w2BjIviTDLs/sendMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: '476689983',
            text: message,
            parse_mode: 'HTML'
          })
        });

        const data = await res.json();

        if (data.ok) {
          status.textContent = '✅ Заявка отправлена! Мы свяжемся с вами в ближайшее время.';
          status.style.color = '#16a34a';
          status.style.display = 'block';
          form.reset();
        } else {
          status.textContent = '❌ Ошибка отправки. Попробуйте позже или позвоните.';
          status.style.color = '#ef4444';
          status.style.display = 'block';
        }
      } catch (err) {
        status.textContent = '❌ Ошибка сети. Попробуйте ещё раз.';
        status.style.color = '#ef4444';
        status.style.display = 'block';
      }

      btn.innerHTML = originalText;
      btn.disabled = false;

      setTimeout(() => { status.style.display = 'none'; }, 8000);
    });
  }

});
