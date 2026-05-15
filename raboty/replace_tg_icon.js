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

// Telegram SVG inline (small version for in-buttons/inline)
const TG_SVG_SM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:1em;height:1em;vertical-align:middle;display:inline-block;"><rect width="512" height="512" rx="15%" fill="#37aee2"/><path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"/><path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"/><path fill="#f6fbfe" d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"/></svg>`;

// Telegram SVG smaller for footer (matching other icons)
const TG_SVG_FOOTER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width:24px;height:24px;display:block;"><rect width="512" height="512" rx="15%" fill="#37aee2"/><path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"/><path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"/><path fill="#f6fbfe" d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"/></svg>`;

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;
  const rel = path.relative(root, file);

  // Replace fa-telegram-plane in footer socials (inside <a>) — full size
  c = c.replace(
    /<i class="fab fa-telegram-plane"><\/i>/g,
    TG_SVG_SM
  );

  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log(`✅ ${rel}`);
  }
}

console.log('\nDone');
