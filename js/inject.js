// Подгрузка компонентов и запуск инициализации
(function() {
  var loaded = 0;

  function onAllLoaded() {
    if (typeof initMolotok === 'function') initMolotok();
  }

  var headerEl = document.getElementById('header-placeholder');
  if (headerEl) {
    fetch('/header.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        headerEl.innerHTML = html;
        loaded++;
        if (loaded === 2) onAllLoaded();
      });
  } else { loaded++; if (loaded === 2) onAllLoaded(); }

  var footerEl = document.getElementById('footer-placeholder');
  if (footerEl) {
    fetch('/footer.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        footerEl.innerHTML = html;
        loaded++;
        if (loaded === 2) onAllLoaded();
      });
  } else { loaded++; if (loaded === 2) onAllLoaded(); }
})();
