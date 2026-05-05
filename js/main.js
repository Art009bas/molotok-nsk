// ==============================
// Молоток — Основные скрипты
// ==============================

document.addEventListener('DOMContentLoaded', function() {

  // --- Мобильное меню ---
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      nav.classList.toggle('active');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });

    // Закрываем меню при клике на ссылку
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      });
    });
  }

  // --- Отзывы (слайдер) ---
  const track = document.querySelector('.reviews__track');
  const dots = document.querySelectorAll('.reviews__dot');
  const prevBtn = document.querySelector('.reviews__btn--prev');
  const nextBtn = document.querySelector('.reviews__btn--next');

  if (track && dots.length > 0) {
    let current = 0;
    const total = dots.length;

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        goTo(parseInt(this.dataset.index));
      });
    });

    // Автоматическая смена каждые 5 секунд
    let autoSlide = setInterval(() => goTo(current + 1), 5000);

    // Останавливаем при наведении
    const slider = document.querySelector('.reviews__slider');
    if (slider) {
      slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
      slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => goTo(current + 1), 5000);
      });
    }
  }

  // --- Анимация появления при скролле ---
  const fadeEls = document.querySelectorAll('.fade-in');

  if (fadeEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));
  } else {
    // Fallback — показываем все сразу
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  // --- Плавная прокрутка для якорных ссылок ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const header = document.querySelector('.header');
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
