#!/bin/bash
# Скрипт деплоя сайта на GitHub Pages
# Использование: ./deploy.sh
#
# Требуется:
#   1. Создать GitHub репозиторий art009ba/molotok-nsk (можно через gh: gh repo create molotok-nsk --public)
#   2. Авторизоваться: gh auth login --scopes repo
#   3. Запустить скрипт

set -e

echo "=== Деплой сайта Молоток на GitHub Pages ==="

# Проверка авторизации
if ! gh auth status 2>/dev/null; then
  echo "❌ Необходима авторизация. Запустите: gh auth login --scopes repo"
  echo "   Или используйте ручной деплой:"
  echo "   git remote set-url origin https://github.com/art009ba/molotok-nsk.git"
  echo "   git push -u origin main"
  exit 1
fi

# Создание репозитория (если не существует)
if ! gh repo view art009ba/molotok-nsk --json name 2>/dev/null; then
  echo "Создаю репозиторий..."
  gh repo create molotok-nsk --public --description "Сайт Молоток - аренда компрессора в Новосибирске"
fi

# Настройка remote
git remote set-url origin git@github.com:art009ba/molotok-nsk.git 2>/dev/null || \
  git remote add origin git@github.com:art009ba/molotok-nsk.git

# Пуш
echo "Отправляю на GitHub..."
git push -u origin main

# Включение GitHub Pages
echo "Настраиваю GitHub Pages..."
gh api repos/art009ba/molotok-nsk/pages -X POST \
  -f source.branch=main \
  -f source.path=/ 2>/dev/null || \
  gh api repos/art009ba/molotok-nsk/pages -X PUT \
  -f source.branch=main \
  -f source.path=/

echo ""
echo "✅ Сайт опубликован!"
echo "   https://art009ba.github.io/molotok-nsk/"
echo ""
echo "Настройка DNS (опционально):"
echo "   Добавьте CNAME-запись для molotok.nsk.ru -> art009ba.github.io"
echo "   Или создайте файл CNAME в корне репозитория с содержимым: molotok.nsk.ru"
