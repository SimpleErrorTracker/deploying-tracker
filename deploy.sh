#!/bin/bash

# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Деплой на GitHub Pages
npx gh-pages -d dist --nojekyll

echo "Деплой завершен! Сайт доступен по адресу: https://just-between-us.github.io/deploying-tracker/ErrorTracker/"