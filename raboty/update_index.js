#!/usr/bin/env node
const fs = require('fs');
const content = fs.readFileSync('/home/node/.openclaw/workspace/molotok-nsk/index.html', 'utf8');

const replacements = [
  ['🏗️ Демонтаж стен и перегородок', 'demontazh-sten'],
  ['🛣️ Вскрытие асфальта и бетона', 'vskrytie-asfalta'],
  ['🏠 Демонтаж фундамента', 'demontazh-fundamenta'],
  ['🚧 Дорожные работы', 'dorozhnye-raboty'],
  ['🏭 Снос строений', 'snos-stroenij'],
  ['🏢 Демонтаж ЖБИ', 'demontazh-zbi'],
  ['🏢 Демонтаж ЖБИ конструкций', 'demontazh-zbi'],
  ['🕳️ Пробивка проёмов', 'probivka-proemov'],
  ['🕳️ Пробивка проёмов и отверстий', 'probivka-proemov'],
  ['🪨 Дробление бетонных блоков', 'droblenie-betonnyh-blokov'],
  ['🧱 Разборка кирпичной кладки', 'razborka-kirpichnoj-kladki'],
  ['🧹 Штробление стен под коммуникации', 'shtroblenie-sten'],
  ['⚡ Подготовка котлованов и траншей', 'kotlovany-transei'],
  ['🔧 Вскрытие дорожного полотна (ямки)', 'vskrytie-dorozhnogo-polotna'],
  ['🔧 Вскрытие дорожного полотна', 'vskrytie-dorozhnogo-polotna'],
  ['💧 Опрессовка газовых и водных магистралей', 'opressovka-gazovyh-vodnyh-magistralej'],
  ['🏖️ Пескоструйная обработка', 'peskostrujnaya-obrabotka'],
  ['💨 Продувка и очистка сжатым воздухом', 'produvka-ochistka'],
  ['🔩 Пневмоинструмент (гайковёрты, дрели)', 'pnevmoinstrument'],
  ['🎨 Покраска краскопультом (высокое давление)', 'pokraska-kraskopultom'],
];

let result = content;
for (const [text, slug] of replacements) {
  const oldSpan = `<span class="tag tag-popular">${text}</span>`;
  const newLink = `<a href="/raboty/${slug}/" class="tag tag-popular">${text}</a>`;
  result = result.split(oldSpan).join(newLink);
}

fs.writeFileSync('/home/node/.openclaw/workspace/molotok-nsk/index.html', result);
console.log('index.html updated with tag links');

// Verify unlifted spans
const remaining = (result.match(/<span class="tag tag-popular">[^<]+<\/span>/g) || []);
if (remaining.length > 0) {
  console.log('⚠️ Still have spans:', remaining);
} else {
  console.log('✅ All tags replaced');
}
