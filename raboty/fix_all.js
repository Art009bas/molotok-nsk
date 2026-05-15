const fs = require('fs');
const path = require('path');

const root = '/home/node/.openclaw/workspace/molotok-nsk';
const files = [];

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
walk(root);

for (const file of files) {
  let c = fs.readFileSync(file, 'utf8');
  const orig = c;

  // Fix double btn btn-primary
  c = c.replace(/btn btn btn-primary/g, 'btn btn-primary');
  
  // Remove duplicate Макс button lines (keep first one in each block)
  // Pattern: a Макс button followed by another Макс button with just whitespace + newline between
  c = c.replace(
    /(<a href="https:\/\/max\.ru\/u\/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY"[^>]*>.*Макс<\/a>)\n\s*(<a href="https:\/\/max\.ru\/u\/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY"[^>]*>.*Макс<\/a>)/g,
    '$1'
  );
  
  // Fix stuck Позвонить + Макс
  c = c.replace(
    /(<i class="fas fa-phone-alt"><\/i> Позвонить<\/a>)\s+(<a href="https:\/\/max\.ru)/g,
    '$1\n          $2'
  );

  // Fix stuck btn-outline + Макс in kontakty  
  c = c.replace(
    /(<i class="fab fa-whatsapp"><\/i> Написать<\/a>)\s+(<a href="https:\/\/max\.ru)/g,
    '$1\n      $2'
  );

  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log('Fixed:', path.relative(root, file));
  }
}

console.log('\nAll done');
