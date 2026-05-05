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
  nav.querySelectorAll('a').forEach(a => {
    const linkPath = a.getAttribute('href');
    if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      a.style.color = 'var(--accent)';
    }
  });

});
