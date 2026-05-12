(function() {
  // Подгрузка хедера
  var headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('/header.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        headerPlaceholder.innerHTML = html;
      });
  }

  // Подгрузка футера
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html')
      .then(function(r) { return r.text(); })
      .then(function(html) {
        footerPlaceholder.innerHTML = html;
      });
  }
})();
