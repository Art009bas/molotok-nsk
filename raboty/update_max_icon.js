const fs = require('fs');
const path = require('path');

const root = '/home/node/.openclaw/workspace/molotok-nsk';
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

const MAX_SVG = '/images/max-icon.svg';

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  const rel = path.relative(root, file);

  // Replace the footer icon (the fa-comment one) with the actual SVG image
  c = c.replace(
    /<a href="https:\/\/max\.ru\/u\/[^"]+" target="_blank" rel="noopener" aria-label="Макс"><i class="fas fa-comment" style="color:#6c5ce7;"><\/i><\/a>/g,
    `<a href="https://max.ru/u/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY" target="_blank" rel="noopener" aria-label="Макс"><img src="${MAX_SVG}" alt="Макс" style="width:24px;height:24px;border-radius:6px;display:block;"></a>`
  );

  // Also replace the contact-socials icon
  c = c.replace(
    /<a href="https:\/\/max\.ru\/u\/[^"]+" target="_blank" rel="noopener" aria-label="Макс"><i class="fas fa-comment" style="color:#6c5ce7;"><\/i><\/a>/g,
    `<a href="https://max.ru/u/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY" target="_blank" rel="noopener" aria-label="Макс"><img src="${MAX_SVG}" alt="Макс" style="width:24px;height:24px;border-radius:6px;display:block;"></a>`
  );

  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log(`✅ ${rel}`);
  }
}

console.log('\nDone');
