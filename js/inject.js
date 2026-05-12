// Подгрузка компонентов и переинициализация
(function() {
  var loaded = 0;

  function allLoaded() {
    loaded++;
    if (loaded < 2) return;

    // Диспатчим кастомное событие — компоненты загружены
    document.dispatchEvent(new CustomEvent('components-loaded'));

    // Активная ссылка в навигации
    var nav = document.getElementById('mainNav');
    if (nav) {
      var currentPath = window.location.pathname;
      nav.querySelectorAll('a').forEach(function(a) {
        var linkPath = a.getAttribute('href');
        if (linkPath && (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath)))) {
          a.style.color = 'var(--accent)';
        }
      });
    }

    // Гамбургер
    var toggle = document.getElementById('mobileToggle');
    if (toggle && nav) {
      toggle.addEventListener('click', function() { nav.classList.toggle('open'); });
      nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() { nav.classList.remove('open'); });
      });
    }

    // Плавный скролл к якорям
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
  }

  var headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('/header.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        headerPlaceholder.innerHTML = html;
        allLoaded();
      });
  } else { allLoaded(); }

  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        footerPlaceholder.innerHTML = html;
        allLoaded();
      });
  } else { allLoaded(); }
})();
