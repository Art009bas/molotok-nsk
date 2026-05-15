const fs = require('fs');
const path = require('path');

const root = '/home/node/.openclaw/workspace/molotok-nsk';

const INDEX_FOOTER = `<footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div>
          <div class="logo" style="color:#fff;margin-bottom:12px;">
            <span class="logo__icon"><i class="fas fa-hammer"></i></span>
            Молоток
          </div>
          <p>Аренда компрессоров и отбойных молотков в Новосибирске. Работаем 24/7, доставка за 1 час.</p>
          <div class="footer__socials">
            <a href="https://max.ru/u/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY" target="_blank" rel="noopener" aria-label="Макс"><img src="/images/max-icon.svg" alt="Макс" style="width:24px;height:24px;border-radius:6px;display:block;"></a>
            <a href="https://wa.me/79137588607" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
            <a href="https://t.me/+79137588607" target="_blank" rel="noopener" aria-label="Telegram"><i class="fab fa-telegram-plane"></i></a>
          </div>
        </div>
        <div>
          <h4>Навигация</h4>
          <a href="/">Главная</a><br>
          <a href="/#pricing">Цены</a><br>
          <a href="/#reviews">Отзывы</a><br>
          <a href="/blog/">Блог</a><br>
          <a href="/kontakty/">Контакты</a>
        </div>
        <div>
          <h4>Контакты</h4>
          <a href="tel:+79137588607" class="footer__phone">+7 (913) 758-86-07</a><br>
          <a href="mailto:molotok154@mail.ru">molotok154@mail.ru</a><br>
          <p style="margin-top:8px;">г. Новосибирск</p>
          <p>Доставка по городу и области</p>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© 2026 Молоток — аренда компрессора в Новосибирске</span>
        <span>Сделано в Новосибирске</span>
      </div>
    </div>
  </footer>
  <script src="/js/main.js"></script>
</body>
</html>`;

// Also get header section for pages that need it
const INDEX_HEADER = `<header class="header">
    <div class="container header__inner">
      <a href="/" class="logo">
        <span class="logo__icon"><i class="fas fa-hammer"></i></span>
        Молоток
      </a>
      <nav class="nav" id="mainNav">
        <a href="/">Главная</a>
        <a href="/uslugi/">Услуги</a>
        <a href="/blog/">Блог</a>
        <a href="/kontakty/">Контакты</a>
      </nav>
      <a href="tel:+79137588607" class="header__phone"><i class="fas fa-phone-alt"></i> +7 (913) 758-86-07</a>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Меню"><i class="fas fa-bars"></i></button>
    </div>
  </header>`;

// Collect files
const files = [];
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'css' && e.name !== 'js' && e.name !== 'images' && e.name !== 'node_modules') {
      walk(full);
    } else if (e.isFile() && e.name === 'index.html') {
      files.push(full);
    }
  }
}
walk(root);

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  const rel = path.relative(root, file);
  if (rel === 'index.html') continue; // skip main

  // Replace footer
  c = c.replace(/<footer class="footer">[\s\S]*?<\/footer>/m, INDEX_FOOTER.replace('</footer>', '__TAIL__'));
  // Fix: the multi-line capture works differently
  c = c.replace(/<footer class="footer">[\s\S]*?<\/footer>/m, INDEX_FOOTER.replace(/<\/footer>[\s\S]*$/, ''));

  // Actually, simpler: remove everything from <footer to </html> and replace
  c = c.replace(/<footer class="footer">[\s\S]*$/, INDEX_FOOTER);

  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log(`✅ ${rel}`);
  }
}

console.log('\nDone');
