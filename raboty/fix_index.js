const fs = require('fs');
let c = fs.readFileSync('/home/node/.openclaw/workspace/molotok-nsk/index.html', 'utf8');

// Fix stuck line
c = c.replace(
  '<i class="fas fa-phone-alt"></i> Позвонить</a>          <a href="https://max.ru/',
  '<i class="fas fa-phone-alt"></i> Позвонить</a>\n          <a href="https://max.ru/'
);

// Remove the extra Макс button that's inside hero__actions but after Заказать incorrect placement
// Actually the 2nd Макс button after Позвонить - check context: 
// it's: Позвонить</a>\n          <a href="...Макс</a>\n          <!-- WhatsApp -->
// That's a SECOND Макс in hero__actions - remove it
c = c.replace(
  /          <a href="https:\/\/max\.ru\/u\/f9LHodD0cOKRjlKY_nmuI1jzGc2epLvmS0djYOiVM8IiD8LrFQxXtFqnUXY" class="btn btn-primary" style="background:#6c5ce7;" target="_blank" rel="noopener"><i class="fas fa-comment-dots"><\/i> Макс<\/a>\n          <!-- <a href="https:\/\/wa\.me\/79137588607"/,
  '          <!-- <a href="https://wa.me/79137588607/'
);

fs.writeFileSync('/home/node/.openclaw/workspace/molotok-nsk/index.html', c);
console.log('Done');

// Verify
const maxBtns = (c.match(/btn-primary.*Макс<\/a>/g) || []).length;
console.log('Макс btn-primary count:', maxBtns);
