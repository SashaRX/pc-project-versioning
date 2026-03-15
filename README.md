# PlayCanvas Project Versioning

Tampermonkey userscript — snapshot ассетов, diff и версионирование из окна Builds в PlayCanvas Editor.

## Установка

1. Установите [Tampermonkey](https://www.tampermonkey.net/)
2. Перейдите по ссылке: [Установить скрипт](https://gist.githubusercontent.com/SashaRX/0001d8aa0d715d3f5eca171df9021a21/raw/pc-project-versioning.user.js)
3. Tampermonkey предложит установить — подтвердите

Обновления приходят автоматически через `@updateURL`.

## Возможности

- Кнопка **SNAPSHOT** в окне Builds
- Сканирование всех ассетов проекта (id, name, type, size)
- Diff с предыдущим snapshot: added / modified / removed
- Changelog (до 50 записей) с версией, датой и заметками
- Хранение в `localStorage` (ключ по project ID)

## Разработка

```bash
npm install
npm run dev        # watch mode
npm run build      # однократная сборка
```

CI автоматически при push в main: bump patch version → build → push в Gist.
