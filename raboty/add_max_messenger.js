#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const MAX_URL = 'https://max.ru/u/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY';
const ROOT = '/home/node/.openclaw/workspace/molotok-nsk';

const files = [];

// Collect all html files
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'css' && e.name !== 'js' && e.name !== 'images') {
      walk(full);
    } else if (e.isFile() && e.name === 'index.html') {
      files.push(full);
    }
  }
}
walk(ROOT);

// Breadcrumb pages have simpler hero — detect if it has hero__actions with Telegram
// We'll inject Max links everywhere

console.log(`Found ${files.length} HTML files`);

let maxBtnHTML = `<a href="${MAX_URL}" class="btn btn-primary" style="background:#6c5ce7;" target="_blank" rel="noopener"><i class="fas fa-comment-dots"></i> Макс</a>`;

let maxFooterIcon = `<a href="${MAX_URL}" target="_blank" rel="noopener" aria-label="Макс"><img src="/images/max-icon.svg" alt="Макс" style="width:24px;height:24px;border-radius:8px;" onerror="this.style.display='none'"></a>`;

// alternative: use unicode/i tag
let maxFooterIconFb = `<a href="${MAX_URL}" target="_blank" rel="noopener" aria-label="Макс"><i class="fas fa-comment" style="color:#6c5ce7;"></i></a>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(ROOT, file);
  
  // 1) Hero actions section — add Max button
  // Looking for hero action buttons
  content = content.replace(
    /(<a href="tel:\+79137588607" class="btn btn-outline">.*?<\/a>)/,
    `$1\n          ${maxBtnHTML}`
  );

  // 2) In hero__actions (index.html specific layout with btn-primary Telegram)
  content = content.replace(
    /(<a href="https:\/\/t\.me\/\+79137588607" class="btn btn-primary".*?<\/a>)/,
    `$1\n          ${maxBtnHTML.replace('btn-primary', 'btn btn-primary')}`
  );

  // 3) In CTA section after tel button
  content = content.replace(
    /(<a href="tel:\+79137588607" class="btn" style="background:#fff;color:var\(--accent\);">.*?<\/a>)/,
    `$1\n      <a href="${MAX_URL}" class="btn btn-outline" style="border-color:#6c5ce7;color:#6c5ce7;" target="_blank" rel="noopener"><i class="fas fa-comment-dots"></i> Макс</a>`
  );

  // 4) In CTA section where btn-outline exists after tel (kontakty page)
  content = content.replace(
    /(<a href="tel:\+79137588607" class="btn btn-outline".*?<\/a>)/,
    `$1\n      ${maxBtnHTML}`
  );

  // 5) Footer socials — add Max icon
  content = content.replace(
    /(<div class="footer__socials">)/g,
    `$1\n            ${maxFooterIconFb}`
  );

  // Update in CTAs also the btn-with-max style
  content = content.replace(
    /(<a href="tel:\+79137588607" class="btn btn-primary">)/,
    `$1`
  );

  // 6) Contact-socials on kontakty page
  content = content.replace(
    /(<div class="contact-socials">)/g,
    `$1\n              <a href="${MAX_URL}" target="_blank" rel="noopener" aria-label="Макс"><i class="fas fa-comment" style="color:#6c5ce7;"></i></a>`
  );

  // 7) Contact card for "Напишите нам" section
  // adding a Макс button in the contact card where WhatsApp link is
  content = content.replace(
    /(<a href="https:\/\/wa\.me\/79137588607" class="btn btn-outline" style="margin-left:12px;border-color:#fff;color:#fff;" target="_blank" rel="noopener"><i class="fab fa-whatsapp"><\/i> Написать<\/a>)/,
    `$1\n      ${maxBtnHTML.replace('btn-primary', 'btn btn-outline').replace('style="background:#6c5ce7;"', 'style="border-color:#6c5ce7;color:#6c5ce7;margin-left:12px;"')}`
  );

  fs.writeFileSync(file, content);
  console.log(`✅ Updated ${relPath}`);
}

console.log('\nAll files done.');
