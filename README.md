# 📝 Notes App - Приложение для учёта заметок

Angular-приложение для управления заметками с красивыми анимациями и сохранением в localStorage.

## 🚀 Демо

Смотрите на [GitHub Pages](https://your-username.github.io/notes-app/)

## ✨ Функционал

- ✅ Создание, редактирование, удаление заметок
- ✅ Закрепление заметок
- ✅ Поиск по заголовку, содержимому и тегам
- ✅ Фильтрация по тегам
- ✅ 7 цветовых тем для заметок
- ✅ Просмотр заметки в режиме чтения
- ✅ Сохранение в localStorage браузера
- ✅ Богатые анимации и спецэффекты

## 🛠️ Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm start

# Сборка production
npm run build
```

## 📤 Деплой на GitHub Pages

### Вариант 1: Автоматически через GitHub Actions

После каждого пуша в ветку `main` сборка автоматически деплоится на GitHub Pages.

1. Создайте новый репозиторий на GitHub
2. Запушьте код:

```bash
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/notes-app.git
git push -u origin main
```

3. Включите GitHub Pages:
   - Settings → Pages
   - Source: GitHub Actions

### Вариант 2: Вручную через npm script

```bash
# Деплой (нужен GitHub token)
npm run deploy
```

Или через angular-cli-ghpages:

```bash
npx angular-cli-ghpages --dir=dist/notes-app/browser --base-href=/notes-app/
```

## 📁 Структура проекта

```
notes-app/
├── src/
│   ├── app/
│   │   ├── animations/        # Анимации
│   │   ├── models/            # Модели данных
│   │   ├── services/          # Сервисы (localStorage)
│   │   ├── note-card/         # Компонент карточки заметки
│   │   ├── note-editor-modal/ # Модалка редактирования
│   │   ├── note-view-modal/   # Модалка просмотра
│   │   └── ...
│   └── ...
├── .github/workflows/         # GitHub Actions
└── ...
```

## 🎨 Анимации

- `fadeInOut` — плавное появление/исчезновение
- `slideInLeft/Right/Up` — выезжающие анимации
- `bounceIn` — эффект прыжка
- `flipIn` — переворот карточек
- `pulse` — пульсация при наведении
- `glow` — свечение фокуса
- `listAnimation` — каскадное появление списка

## 📄 Лицензия

MIT
