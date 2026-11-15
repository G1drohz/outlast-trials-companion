# Outlast Trials Companion

Неофициальный компаньон для **The Outlast Trials**: справочник по локациям, предметам и врагам, таймер испытания с чеклистом задач и интерактивные схемы уровней с отметками пройденного.

Работает **на ПК (Windows)**, **на Android** и **в браузере** как PWA. Все данные и прогресс хранятся локально на устройстве — интернет после установки не нужен.

> Fan-made проект. Не аффилирован с Red Barrels. Схемы карт — авторские упрощённые планы для навигации, а не копии игровых карт.

## Скачать

| Платформа | Файл | Что делает |
|---|---|---|
| **Windows** | `OutlastTrialsCompanion-Setup-1.0.0.exe` | Установщик: ставит приложение, создаёт ярлыки на рабочем столе и в меню «Пуск», добавляет деинсталлятор. Ничего дополнительно устанавливать не нужно — Electron и все библиотеки уже внутри. |
| **Windows** | `OutlastTrialsCompanion-Portable-1.0.0.exe` | Портативная версия без установки. |
| **Android** | `OutlastTrialsCompanion-1.0.0.apk` | Готовый APK (Android 7+). Всё внутри, никаких зависимостей. |
| **Любая** | [GitHub Pages](https://g1drohz.github.io/outlast-trials-companion/) | Веб-версия. Можно установить как PWA: в Chrome — «Установить приложение». |

Все установщики лежат в [Releases](https://github.com/G1drohz/outlast-trials-companion/releases/latest). Они собираются автоматически в GitHub Actions из этого репозитория.

> Windows SmartScreen может показать предупреждение, потому что установщик не подписан платным сертификатом. Нажми «Подробнее» → «Выполнить в любом случае». APK потребует разрешить установку из неизвестного источника — это стандартное поведение Android для файлов не из Play Store.

## Возможности

### Справочник
- 14 локаций: Prime Asset, уровень угрозы, опасности, советы, список испытаний.
- 24 предмета: эффект, редкость, как использовать, где искать.
- 15 врагов: тип, угроза, атаки, контр-тактики, заметки.
- 4 рига: роль, для чего лучше всего подходят.
- Живой поиск по всем полям.

### Таймер и чеклист
- Выбор локации и испытания (62 программы).
- Точный таймер с десятыми долями секунды.
- Чеклист задач, который сохраняется отдельно для каждого испытания.
- Лучшее время и число забегов на каждое испытание.
- Автоматическая фиксация результата, когда все задачи отмечены.
- `Пробел` — старт/пауза.

### Интерактивные карты
- Схемы всех 14 локаций.
- Цветовая маркировка зон: старт, цель, лут, секрет, опасно, выход.
- Клик по зоне (или по списку справа) отмечает её пройденной.
- Процент исследования и сохранение прогресса.
- Зум схемы.

## Технологии

- Чистый HTML/CSS/JS без фреймворков — быстро и без зависимостей в рантайме.
- `localStorage` для прогресса, чеклистов и рекордов.
- Service Worker + Web App Manifest для офлайн-режима и установки как PWA.
- **Electron + electron-builder** → Windows `.exe` (NSIS installer + portable).
- **Capacitor** → Android `.apk`.
- **GitHub Actions** → автоматическая сборка APK и EXE, публикация в Releases и деплой веб-версии на GitHub Pages.

## Структура

```
web/                  — само приложение (общее для всех платформ)
  index.html
  css/style.css
  js/data.js          — справочник, карты, испытания
  js/app.js           — логика, таймер, прогресс
  icons/icon.svg
  sw.js               — офлайн-кеш
  manifest.webmanifest
main.js               — Electron entrypoint
scripts/              — генерация иконок и dev-сервер
.github/workflows/    — сборка APK/EXE и деплой Pages
```

## Локальный запуск

Нужен Node.js 20+.

```bash
npm install
npm run serve          # http://localhost:4173
```

Или как desktop-приложение:

```bash
npm start
```

## Сборка

### Windows (.exe)

```bash
npm install
npm run build:win
```

Готовые файлы появятся в `release/`:
- `OutlastTrialsCompanion-Setup-1.0.0.exe`
- `OutlastTrialsCompanion-Portable-1.0.0.exe`

Сборка EXE на Linux теоретически возможна через Wine, но надёжнее — Windows-раннер GitHub Actions (так и делается в репозитории).

### Android (.apk)

Нужны JDK 21 и Android SDK 35.

```bash
npm install
npx cap add android
npm run icons
npx cap sync android
npm run build:apk
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`.

### Автоматическая сборка

Workflow `.github/workflows/build-release.yml` запускается на каждый push в `main` и вручную через **Actions → Build installers → Run workflow**:

1. Windows-раннер собирает NSIS-установщик и portable `.exe`.
2. Ubuntu-раннер собирает debug APK.
3. Release-job создаёт релиз `v1.0.0` и прикрепляет к нему оба файла.

Workflow `.github/workflows/pages.yml` деплоит `web/` на GitHub Pages.

## Обновление данных

Все справочные данные лежат в `web/js/data.js`:
- `MAPS` — локации, испытания, схемы зон;
- `ITEMS` — предметы;
- `ENEMIES` — враги;
- `RIGS` — риги;
- `TRIAL_KINDS` — шаблоны чеклистов по типу испытания.

После правок достаточно пересобрать приложение или обновить страницу.

## Лицензия

MIT. См. [LICENSE](LICENSE).
