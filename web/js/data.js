/* Outlast Trials Companion — данные справочника.
   Подробные авторские схемы: реальные названия площадок из открытых гайдов,
   но не точные копии игровых карт. */

const TRIAL_KINDS = {
  investigate: {
    label: 'Расследование',
    tasks: [
      'Прочесать стартовую зону',
      'Найти улики / документы',
      'Обыскать служебные помещения',
      'Сдать находки в терминал',
      'Уйти к выходу'
    ]
  },
  sabotage: {
    label: 'Саботаж',
    tasks: [
      'Разведать все точки саботажа',
      'Отключить первый терминал',
      'Отключить второй терминал',
      'Переждать тревогу',
      'Уйти к выходу'
    ]
  },
  destroy: {
    label: 'Уничтожение',
    tasks: [
      'Найти цель',
      'Расчистить путь к цели',
      'Уничтожить цель',
      'Покинуть зону до подкрепления',
      'Уйти к выходу'
    ]
  },
  rescue: {
    label: 'Спасение',
    tasks: [
      'Найти объект',
      'Освободить / поднять объект',
      'Сопроводить до точки',
      'Отвлечь патруль',
      'Уйти к выходу'
    ]
  },
  escape: {
    label: 'Побег',
    tasks: [
      'Найти ключ-карту',
      'Открыть первый шлюз',
      'Запустить механизм',
      'Переждать облаву',
      'Уйти к выходу'
    ]
  },
  broadcast: {
    label: 'Трансляция',
    tasks: [
      'Найти компоненты',
      'Доставить к аппаратуре',
      'Запустить передачу',
      'Продержаться до конца эфира',
      'Уйти к выходу'
    ]
  },
  hunt: {
    label: 'Охота',
    tasks: [
      'Найти след',
      'Проверить комнаты',
      'Обезвредить цель',
      'Уйти к выходу'
    ]
  },
  steal: {
    label: 'Кража',
    tasks: [
      'Найти товар',
      'Собрать партию',
      'Вынести из зоны',
      'Уйти к выходу'
    ]
  }
};

/*
   Подробные авторские схемы: реальные названия площадок из открытых гайдов,
   но не точные копии игровых карт. Ключи и терминалы отмечены отдельно. */

const zone = (id, label, x, y, w, h, type, note, en) => ({ id, label, x, y, w, h, type, note, en });
const cell = (row, col, id, label, type, note, en) =>
  zone(id, label, 30 + col * 240, 25 + row * 180, 210, 130, type, note, en);
const chain = ids => ids.slice(1).map((id, i) => [ids[i], id]);
const link = (a, b) => [a, b];

const MAPS = [
  {
    id: 'police',
    name: 'Полицейский участок',
    en: 'Police Station',
    prime: 'Leland Coyle',
    threat: 4,
    accent: '#4f8cff',
    about: 'Стандартная программа Коула: патрульный отдел, камеры, допросные и морг. Главный маршрут — центральный коридор, но двор и технические проходы дают петли, чтобы разорвать линию взгляда.',
    hazards: ['Узкие камеры без второго выхода', 'Электрошок Коула', 'Шумные двери и допросные'],
    tips: ['Ключи для Kill the Snitch лежат на телах — каждый ключ подходит своему телевизору', 'Сначала собери отмычки и батареи в столовой и спортзале', 'Двор — альтернативный маршрут, если центральный коридор простреливается'],
    rooms: [
      cell(0, 0, 'entrance', 'Вход в участок', 'spawn', 'Старт. Осмотри стойку и шкафы.', 'Station Entrance'),
      cell(0, 1, 'patrol', 'Отдел патруля', 'objective', 'Основная цель большинства программ.', 'Patrol Department'),
      cell(0, 2, 'security', 'Охрана', 'terminal', 'Мониторы и терминал слежения.', 'Security Room'),
      cell(0, 3, 'gym', 'Спортзал', 'loot', 'Отмычки, батареи, укрытия за снарядами.', 'Gymnasium'),
      cell(1, 0, 'cafeteria', 'Столовая', 'loot', 'Еда и медикаменты. Шумная техника.', 'Cafeteria'),
      cell(1, 1, 'cells', 'Камеры', 'objective', 'Ключи и заключённые — часто именно здесь.', 'Jail Cells'),
      cell(1, 2, 'dispatch', 'Диспетчерская', 'terminal', 'Рации и терминал вызова.', 'Dispatch'),
      cell(1, 3, 'chief', 'Кабинет начальника', 'key', 'Ключи от камер и отдела улик.', "Police Chief's Office"),
      cell(2, 0, 'alley', 'Задний двор', 'exit', 'Альтернативный выход и короткая петля.', 'Back Alley'),
      cell(2, 1, 'showers', 'Душевая', 'danger', 'Скользкий пол, мало укрытий.', 'Showers'),
      cell(2, 2, 'morgue', 'Морг', 'objective', 'Трупы с метками — источник ключей.', 'Morgue'),
      cell(2, 3, 'doors', 'Выход участка', 'exit', 'Финальные ворота, часто охраняются.', 'Station Doors')
    ],
    links: [
      ...chain(['entrance', 'patrol', 'security', 'gym']),
      ...chain(['cafeteria', 'cells', 'dispatch', 'chief']),
      ...chain(['alley', 'showers', 'morgue', 'doors']),
      link('entrance', 'cafeteria'), link('patrol', 'cells'), link('security', 'dispatch'), link('gym', 'chief'),
      link('cafeteria', 'alley'), link('cells', 'showers'), link('dispatch', 'morgue'), link('chief', 'doors')
    ],
    trials: [
      { id: 'kill-snitch', name: 'Kill the Snitch', ru: 'Убить стукача', kind: 'rescue', min: 14 },
      { id: 'teach-cop', name: 'Teach the Police Officer', ru: 'Проучить полицейского', kind: 'hunt', min: 12 },
      { id: 'cancel-autopsy', name: 'Cancel the Autopsy', ru: 'Отменить вскрытие', kind: 'destroy', min: 13 },
      { id: 'sabotage-lockdown', name: 'Sabotage the Lockdown', ru: 'Саботаж блокировки', kind: 'sabotage', min: 15 },
      { id: 'release-prisoners', name: 'Release the Prisoners', ru: 'Освободить заключённых', kind: 'rescue', min: 12 },
      { id: 'eliminate-past', name: 'Eliminate the Past', ru: 'Уничтожить прошлое', kind: 'destroy', min: 13 },
      { id: 'seize-narcotics', name: 'Seize the Narcotics', ru: 'Изъять наркотики', kind: 'steal', min: 14 }
    ]
  },
  {
    id: 'funpark',
    name: 'Парк развлечений',
    en: 'Fun Park',
    prime: 'Mother Gooseberry',
    threat: 4,
    accent: '#ff5f8f',
    about: 'Два ангара — «Корневой канал» и «Замок иллюзий» — плюс открытый парк с аттракционами. Мало укрытий на улице: планируй перебежки между павильонами и кассами.',
    hazards: ['Взрывные утки', 'Открытые площади без укрытий', 'Узкие проходы аттракционов'],
    tips: ['Сердца для Grind the Bad Apples лежат в резервуарах закусочной', 'Билеты и ключи берутся в кассах и офисе Гусберри', 'Клапаны A–D разбросаны по трубным комнатам — проверяй обе стороны ангара'],
    rooms: [
      cell(0, 0, 'gate', 'Вход в Футтерленд', 'spawn', 'Стартовая площадь и кассы.', 'Futterland Entrance'),
      cell(0, 1, 'carousel', 'Карусель', 'objective', 'Открытая зона, легко потерять укрытие.', 'Carousel'),
      cell(0, 2, 'diner', 'Закусочная', 'key', 'Сердца в резервуарах; билеты на аттракционы.', 'Diner'),
      cell(0, 3, 'fair', 'Аттракционы', 'objective', 'Игровые автоматы и лотереи.', 'Fair Games'),
      cell(1, 0, 'castle', 'Замок иллюзий', 'secret', 'Зеркала, ложные стены и тупики.', 'Illusion Castle'),
      cell(1, 1, 'rootcanal', 'Корневой канал', 'objective', 'Тёмный аттракцион, главная петля ангара.', 'The Root Canal'),
      cell(1, 2, 'goose', 'Офис Гусберри', 'key', 'Ключи и билеты, рядом дрель.', "Mother Gooseberry's Office"),
      cell(1, 3, 'maintenance', 'Технические комнаты', 'terminal', 'Клапаны A–D и модули питания.', 'Maintenance Rooms'),
      cell(2, 0, 'barn', 'Амбар', 'loot', 'Припасы и укрытия за сеном.', 'Barn'),
      cell(2, 1, 'pipes', 'Трубная', 'terminal', 'Клапаны и вентили второго ангара.', 'Pipe Room'),
      cell(2, 2, 'space', 'Космическая станция', 'secret', 'Скрытая декорация с тайником.', 'Space Station'),
      cell(2, 3, 'grinder', 'Мясорубка', 'exit', 'Финальный выход через ангар.', 'Grinder')
    ],
    links: [
      ...chain(['gate', 'carousel', 'diner', 'fair']),
      ...chain(['castle', 'rootcanal', 'goose', 'maintenance']),
      ...chain(['barn', 'pipes', 'space', 'grinder']),
      link('gate', 'castle'), link('carousel', 'rootcanal'), link('diner', 'goose'), link('fair', 'maintenance'),
      link('castle', 'barn'), link('rootcanal', 'pipes'), link('goose', 'space'), link('maintenance', 'grinder')
    ],
    trials: [
      { id: 'grind-apples', name: 'Grind the Bad Apples', ru: 'Перемолоть плохишей', kind: 'destroy', min: 15 },
      { id: 'win-truth', name: 'Win the Truth', ru: 'Узнать правду', kind: 'investigate', min: 14 },
      { id: 'drill-futterman', name: 'Drill the Futterman', ru: 'Просверлить Фаттермана', kind: 'hunt', min: 16 },
      { id: 'beguile-children', name: 'Beguile the Children', ru: 'Обмануть детей', kind: 'investigate', min: 13 },
      { id: 'punish-miscreants', name: 'Punish the Miscreants', ru: 'Наказать нечестивцев', kind: 'hunt', min: 14 },
      { id: 'deface-futtermans', name: 'Deface the Futtermans', ru: 'Обезобразить Фаттерманов', kind: 'destroy', min: 13 },
      { id: 'open-gates', name: 'Open the Gates', ru: 'Открыть врата', kind: 'escape', min: 15 },
      { id: 'redeem-freedom', name: 'Redeem your Freedom', ru: 'Выкупить свободу', kind: 'escape', min: 16 }
    ]
  },
  {
    id: 'orphanage',
    name: 'Приют',
    en: 'Orphanage',
    prime: 'Mother Gooseberry',
    threat: 4,
    accent: '#c084fc',
    about: 'Тесные спальни, кухня, часовня и кладбище. Один из лучших уровней для пряток — но у Гусберри здесь много маршрутов, а комнаты часто с одним выходом.',
    hazards: ['Узкие коридоры', 'Кухня с шумной техникой', 'Тёмные часовня и кладбище'],
    tips: ['Отбеливатель для Feed the Children: часовня, подвал, прачечная, бассейн', 'Ключи и канистры для Reunite the Family — подвал часовни, прачечная, кухня', 'Запоминай вторую дверь в каждой комнате — это спасёт от Гусберри'],
    rooms: [
      cell(0, 0, 'entrance', 'Главный вход', 'spawn', 'Старт, парадная дверь.', 'Main Entrance'),
      cell(0, 1, 'lobby', 'Лобби и ресепшен', 'objective', 'Стойка, ключи, первые цели.', 'Lobby & Front Desk'),
      cell(0, 2, 'faith', 'Радио «Вера»', 'terminal', 'Частотные коробки и вещание.', 'Faith Broadcast'),
      cell(0, 3, 'infants', 'Ясли', 'objective', 'Кровати и укрытия.', 'Infants Dorms'),
      cell(1, 0, 'girls', 'Спальни девочек', 'objective', 'Дети и предметы испытаний.', 'Girls Dorms'),
      cell(1, 1, 'boys', 'Спальни мальчиков', 'objective', 'Второй корпус спален.', 'Boys Dorms'),
      cell(1, 2, 'classes', 'Классы и кино', 'objective', 'Улики и звук проектора.', 'Classrooms & Film Room'),
      cell(1, 3, 'chapel', 'Часовня', 'key', 'Отбеливатель, канистры, ключи.', 'Chapel'),
      cell(2, 0, 'kitchen', 'Кухня и столовая', 'key', 'Отбеливатель и ключи, шумная техника.', 'Cafeteria & Kitchen'),
      cell(2, 1, 'basement', 'Подвал часовни', 'secret', 'Тайник с ключами, один выход.', 'Chapel Basement'),
      cell(2, 2, 'laundry', 'Прачечная', 'terminal', 'Ключи и частотные коробки.', 'Laundry'),
      cell(2, 3, 'back', 'Задний вход', 'exit', 'Выход через хозяйственную зону.', 'Back Entrance')
    ],
    links: [
      ...chain(['entrance', 'lobby', 'faith', 'infants']),
      ...chain(['girls', 'boys', 'classes', 'chapel']),
      ...chain(['kitchen', 'basement', 'laundry', 'back']),
      link('entrance', 'girls'), link('lobby', 'boys'), link('faith', 'classes'), link('infants', 'chapel'),
      link('girls', 'kitchen'), link('boys', 'basement'), link('classes', 'laundry'), link('chapel', 'back')
    ],
    trials: [
      { id: 'cleanse-orphans', name: 'Cleanse the Orphans', ru: 'Очистить сирот', kind: 'hunt', min: 15 },
      { id: 'feed-children', name: 'Feed the Children', ru: 'Накормить детей', kind: 'rescue', min: 14 },
      { id: 'reunite-family', name: 'Reunite the Family', ru: 'Воссоединить семью', kind: 'rescue', min: 16 },
      { id: 'gather-children', name: 'Gather the Children of God', ru: 'Собрать детей Божьих', kind: 'rescue', min: 14 },
      { id: 'compel-children', name: 'Compel the Children', ru: 'Принудить детей', kind: 'investigate', min: 13 },
      { id: 'foster-orphans', name: 'Foster the Orphans', ru: 'Приютить сирот', kind: 'rescue', min: 15 }
    ]
  },
  {
    id: 'courthouse',
    name: 'Суд',
    en: 'Courthouse',
    prime: 'Leland Coyle',
    threat: 4,
    accent: '#f59e0b',
    about: 'Холл, залы суда, комната присяжных и хранилище улик. Много закрытых проходов: запоминай открытые двери, иначе финальный побег превратится в блуждание.',
    hazards: ['Позднее усиление патрулей', 'Закрытые служебные проходы', 'Открытый зал без укрытий'],
    tips: ['Ведро с кислотой и улики — библиотека, хранилище A–F или кабинеты, зависит от программы', 'Пазл-бокс в комнате присяжных — ключевой туториал', 'Waiting Room: микроволновый триггер и трекер для Scapegoats'],
    rooms: [
      cell(0, 0, 'entrance', 'Главный вход', 'spawn', 'Старт, мраморный холл.', 'Front Entrance'),
      cell(0, 1, 'lobby', 'Холл', 'objective', 'Блокировщики рига, ведро с кислотой.', 'Lobby'),
      cell(0, 2, 'library', 'Библиотека', 'objective', 'Стеллажи и документы.', 'Library'),
      cell(0, 3, 'courtroom', 'Зал суда', 'objective', 'Открытое пространство, мало укрытий.', 'Main Courtroom'),
      cell(1, 0, 'accused', 'Скамья подсудимых', 'objective', 'Центр зала, много света.', 'Accused Stand'),
      cell(1, 1, 'jury', 'Комната присяжных', 'key', 'Пазл-бокс и ключ.', 'Jury Room'),
      cell(1, 2, 'evidence', 'Хранилище улик', 'key', 'Улики A–F, кислота.', 'Evidence Storage'),
      cell(1, 3, 'offices', 'Кабинеты', 'terminal', 'Служебные терминалы и двери.', 'Office Wing'),
      cell(2, 0, 'waiting', 'Зал ожидания', 'terminal', 'Триггер и трекер.', 'Waiting Room'),
      cell(2, 1, 'backstage', 'За кулисами', 'objective', 'Электрощиты, Scapegoats.', 'Backstage'),
      cell(2, 2, 'jail', 'Тюремный блок', 'danger', 'Камеры с одним выходом.', 'Jail'),
      cell(2, 3, 'back', 'Задний выход', 'exit', 'Финальные ворота.', 'Back Entrance')
    ],
    links: [
      ...chain(['entrance', 'lobby', 'library', 'courtroom']),
      ...chain(['accused', 'jury', 'evidence', 'offices']),
      ...chain(['waiting', 'backstage', 'jail', 'back']),
      link('entrance', 'accused'), link('lobby', 'jury'), link('library', 'evidence'), link('courtroom', 'offices'),
      link('accused', 'waiting'), link('jury', 'backstage'), link('evidence', 'jail'), link('offices', 'back')
    ],
    trials: [
      { id: 'bribe-judges', name: 'Bribe the Judges', ru: 'Подкупить судей', kind: 'steal', min: 13 },
      { id: 'vindicate-guilty', name: 'Vindicate the Guilty', ru: 'Оправдать виновных', kind: 'investigate', min: 14 },
      { id: 'destroy-evidence', name: 'Destroy the Evidence', ru: 'Уничтожить улики', kind: 'destroy', min: 12 },
      { id: 'tilt-scales', name: 'Tilt the Scales of Justice', ru: 'Склонить чаши весов', kind: 'sabotage', min: 13 },
      { id: 'escape-courthouse', name: 'Escape the Courthouse', ru: 'Побег из суда', kind: 'escape', min: 14 },
      { id: 'fuel-release', name: 'Fuel the Release', ru: 'Разжечь освобождение', kind: 'sabotage', min: 15 },
      { id: 'sentence-prosecuted', name: 'Sentence the Prosecuted', ru: 'Вынести приговор', kind: 'hunt', min: 12 }
    ]
  },
  {
    id: 'toyfactory',
    name: 'Фабрика игрушек',
    en: 'Toy Factory',
    prime: 'Mother Gooseberry',
    threat: 4,
    accent: '#f472b6',
    about: 'Три линии производства, пульты управления, подвал и два погрузочных дока. Механизмы глушат шаги, но конвейер выдаёт тебя шумом — планируй путь отхода до рычага.',
    hazards: ['Шумные конвейеры', 'Печь и горячие зоны', 'Тесные проходы между станками'],
    tips: ['Главный ключ — в подвале; ключи B и C рандомны по пультам и офисам', 'Flatten the Foreman: 4 электронных замка и ключ секции C в кабинете бригадира', 'Клапаны для Fumigate — подвал и оба погрузочных дока'],
    rooms: [
      cell(0, 0, 'entrance', 'Главный вход', 'spawn', 'Старт у главной двери.', 'Main Entrance'),
      cell(0, 1, 'basement', 'Подвал', 'key', 'Ключ от главной двери, клапаны.', 'Basement'),
      cell(0, 2, 'linea', 'Линия A', 'objective', 'Первый конвейер.', 'Production Line A'),
      cell(0, 3, 'controla', 'Пульт A', 'terminal', 'Выключатель секции A.', 'Control Room A'),
      cell(1, 0, 'storage', 'Склад', 'loot', 'Ящики и припасы.', 'Storage Room'),
      cell(1, 1, 'lineb', 'Линия B', 'objective', 'Сборка кукол, шумно.', 'Production Line B'),
      cell(1, 2, 'controlb', 'Пульт B', 'terminal', 'Ключ B (рандом), выключатель.', 'Control Room B'),
      cell(1, 3, 'foreman', 'Кабинет бригадира', 'key', 'Ключ секции C.', "Foreman's Office"),
      cell(2, 0, 'linec', 'Линия C', 'objective', 'Третий конвейер.', 'Production Line C'),
      cell(2, 1, 'incinerator', 'Печь', 'danger', 'Жар, огонь и механизмы.', 'Incinerator'),
      cell(2, 2, 'westdock', 'Западный док', 'terminal', 'Клапаны и модули.', 'West Shipping Dock'),
      cell(2, 3, 'eastdock', 'Восточный док', 'exit', 'Выход через доки.', 'East Shipping Dock')
    ],
    links: [
      ...chain(['entrance', 'basement', 'linea', 'controla']),
      ...chain(['storage', 'lineb', 'controlb', 'foreman']),
      ...chain(['linec', 'incinerator', 'westdock', 'eastdock']),
      link('entrance', 'storage'), link('basement', 'lineb'), link('linea', 'controlb'), link('controla', 'foreman'),
      link('storage', 'linec'), link('lineb', 'incinerator'), link('controlb', 'westdock'), link('foreman', 'eastdock')
    ],
    trials: [
      { id: 'flatten-foreman', name: 'Flatten the Foreman', ru: 'Раздавить бригадира', kind: 'hunt', min: 14 },
      { id: 'sanitize-factory', name: 'Sanitize the Factory', ru: 'Санитарная обработка', kind: 'sabotage', min: 15 },
      { id: 'pervert-futterman', name: 'Pervert the Futterman', ru: 'Извратить Фаттермана', kind: 'hunt', min: 14 },
      { id: 'crush-toys', name: 'Crush the Sex Toys', ru: 'Раздавить игрушки', kind: 'destroy', min: 13 },
      { id: 'incinerate-toys', name: 'Incinerate the Sex Toys', ru: 'Сжечь игрушки', kind: 'destroy', min: 13 },
      { id: 'fumigate-factory', name: 'Fumigate the Factory', ru: 'Окурить фабрику', kind: 'sabotage', min: 14 },
      { id: 'shutdown-factory', name: 'Shutdown the Factory', ru: 'Остановить фабрику', kind: 'sabotage', min: 16 }
    ]
  },
  {
    id: 'docks',
    name: 'Доки',
    en: 'The Docks',
    prime: 'Franco Barbi',
    threat: 4,
    accent: '#22d3ee',
    about: 'Гавань, лаборатория Chem-Co, ж/д депо, казино и судно «Анджелина». Франко простреливает длинные прямые — двигайся между контейнерами и не выходи на пирс без плана.',
    hazards: ['Растяжки и мины', 'Простреливаемые прямые', 'Пилы в трюме судна'],
    tips: ['Кнопка крана — в диспетчерской; яд и канистры — в Chem-Co', 'Empty the Vault: три проекции для сейфа казино', 'Бочки и информатор спавнятся рандомно — проверяй склад и депо'],
    rooms: [
      cell(0, 0, 'harbor', 'Вход в гавань', 'spawn', 'Старт у воды.', 'Harbor Entrance'),
      cell(0, 1, 'control', 'Диспетчерская', 'terminal', 'Кнопка крана и терминалы.', 'Control Room'),
      cell(0, 2, 'lab', 'Лаборатория Chem-Co', 'objective', 'Варочный котел и яд.', 'Chem-Co Laboratory'),
      cell(0, 3, 'train', 'Ж/д депо', 'objective', 'Пазл-боксы, символ Eye.', 'Train Depot'),
      cell(1, 0, 'crane', 'Крановый залив', 'loot', 'Укрытия за контейнерами.', 'Crane Bay'),
      cell(1, 1, 'cooker', 'Варочная зона', 'danger', 'Горячие поверхности и газ.', 'Cooker Area'),
      cell(1, 2, 'platform', 'Платформа', 'objective', 'Вагоны и проекции.', 'Train Platform'),
      cell(1, 3, 'hold', 'Трюм «Анджелины»', 'danger', 'Пилы и Myules.', 'Cargo Hold'),
      cell(2, 0, 'casino', 'Казино', 'loot', 'Стоки и припасы.', 'Casino'),
      cell(2, 1, 'vault', 'Хранилище казино', 'key', 'Три проекции для сейфа.', 'Casino Vault'),
      cell(2, 2, 'boat', 'Катер', 'exit', 'Эвакуация по воде.', 'The Angelina'),
      cell(2, 3, 'pier', 'Причал', 'exit', 'Длинный простреливаемый пирс.', 'Pier')
    ],
    links: [
      ...chain(['harbor', 'control', 'lab', 'train']),
      ...chain(['crane', 'cooker', 'platform', 'hold']),
      ...chain(['casino', 'vault', 'boat', 'pier']),
      link('harbor', 'crane'), link('control', 'cooker'), link('lab', 'platform'), link('train', 'hold'),
      link('crane', 'casino'), link('cooker', 'vault'), link('platform', 'boat'), link('hold', 'pier')
    ],
    trials: [
      { id: 'poison-medicine', name: 'Poison the Medicine', ru: 'Отравить лекарства', kind: 'sabotage', min: 14 },
      { id: 'poison-cattle', name: 'Poison the Cattle', ru: 'Отравить скот', kind: 'sabotage', min: 13 },
      { id: 'stash-contraband', name: 'Stash the Contraband', ru: 'Спрятать контрабанду', kind: 'steal', min: 13 },
      { id: 'cook-informant', name: 'Cook the Informant', ru: 'Поджарить информатора', kind: 'hunt', min: 15 },
      { id: 'empty-vault', name: 'Empty the Vault', ru: 'Опустошить хранилище', kind: 'steal', min: 14 }
    ]
  },
  {
    id: 'downtown',
    name: 'Центр города',
    en: 'Downtown',
    prime: 'Franco Barbi',
    threat: 5,
    accent: '#fb7185',
    about: 'Улицы, театры, метро и канализация. Два разных маршрута: открытые перестрелочные улицы и подземные проходы под ними. Держи в голове оба.',
    hazards: ['Снайперские прямые Франко', 'Открытые улицы', 'Проливы в канализации'],
    tips: ['Ключ от кинотеатра с символом Eye добывают Microwave Triggerом', 'Тихий аукцион и секретки — аптека, закусочная, фотоавтомат', 'Канализация: Old Subway, Centrale, Electric Room, Bank Vault'],
    rooms: [
      cell(0, 0, 'subway', 'Метро, 5 линия', 'spawn', 'Старт на станции Theater.', 'Subway'),
      cell(0, 1, 'plaza', 'Площадной театр', 'objective', 'Сцена и настройка шоу.', 'Plaza Theater'),
      cell(0, 2, 'chinese', 'Китайский кинотеатр', 'key', 'Ключ с символом Eye.', 'Chinese Movie Theater'),
      cell(0, 3, 'zahuo', 'Zahuo Dian / Blue Lagoon', 'objective', 'Capture Protocol за билет.', 'Zahuo Dian'),
      cell(1, 0, 'pub', 'Ирландский паб', 'loot', 'Укрытия и припасы.', 'Irish Pub'),
      cell(1, 1, 'herbal', 'Аптека Huay Xue', 'key', 'Секретная комната.', 'Huay Xue Herbal Store'),
      cell(1, 2, 'snack', 'Закусочная', 'loot', 'Секретка и еда.', 'Do-Nut Hole Snack Bar'),
      cell(1, 3, 'fire', 'Пожарная станция', 'terminal', 'Спуск в канализацию.', 'Fire Station'),
      cell(2, 0, 'oldsubway', 'Старое метро', 'objective', 'Нижний уровень, станция Brigade.', 'Old Subway'),
      cell(2, 1, 'centrale', 'Центральная', 'danger', 'Затопления и длинные залы.', 'Centrale'),
      cell(2, 2, 'electric', 'Электрощитовая', 'terminal', 'Щиты и кабели.', 'Electric Room'),
      cell(2, 3, 'bankvault', 'Банковский сейф', 'key', 'Проекции и ключ.', 'Bank Vault')
    ],
    links: [
      ...chain(['subway', 'plaza', 'chinese', 'zahuo']),
      ...chain(['pub', 'herbal', 'snack', 'fire']),
      ...chain(['oldsubway', 'centrale', 'electric', 'bankvault']),
      link('subway', 'pub'), link('plaza', 'herbal'), link('chinese', 'snack'), link('zahuo', 'fire'),
      link('pub', 'oldsubway'), link('herbal', 'centrale'), link('snack', 'electric'), link('fire', 'bankvault')
    ],
    trials: [
      { id: 'pleasure-prosecutor', name: 'Pleasure the Prosecutor', ru: 'Ублажить прокурора', kind: 'investigate', min: 14 },
      { id: 'kidnap-mistress', name: 'Kidnap the Mistress', ru: 'Похитить любовницу', kind: 'rescue', min: 15 },
      { id: 'spread-disease', name: 'Spread the Disease', ru: 'Распространить болезнь', kind: 'sabotage', min: 14 },
      { id: 'traffick-product', name: 'Traffick the Product', ru: 'Провезти товар', kind: 'steal', min: 15 }
    ]
  },
  {
    id: 'suburbs',
    name: 'Пригород',
    en: 'The Suburbs',
    prime: 'Franco Barbi',
    threat: 4,
    accent: '#34d399',
    about: 'Свалка, ратуша, богатый район, трущобы и школа. Много входов в дома — используй их для петель, но помни: Франко слышит даже осторожное открытие двери.',
    hazards: ['Растяжки в домах', 'Открытые газоны', 'Berserker в центре и убежище'],
    tips: ['Генераторы и UV-символы для Disrupt the Neighborhood — в домах и школе', 'Ключи и частотные коробки — ратуша, убежище, ворота №2', 'Секретки: ванные в Rich District и Slum'],
    rooms: [
      cell(0, 0, 'scrapyard', 'Свалка', 'spawn', 'Старт на входе в район.', 'The Scrapyard'),
      cell(0, 1, 'plaza', 'Площадь города', 'objective', 'Центр, часто патрулируется.', 'Town Center Plaza'),
      cell(0, 2, 'hall', 'Ратуша', 'key', 'Переключатель ворот и микрофон.', 'Town Hall'),
      cell(0, 3, 'rich', 'Богатый район', 'objective', 'Генераторы и UV-символы.', 'Rich District'),
      cell(1, 0, 'shelter', 'Бомбоубежище', 'key', 'Частотные коробки.', 'Fallout Shelter'),
      cell(1, 1, 'gate2', 'Ворота №2', 'terminal', 'Частотный замок.', 'Blocked Gate #2'),
      cell(1, 2, 'slum', 'Трущобы', 'danger', 'Узкие дворы, ночные охотники.', 'Slum'),
      cell(1, 3, 'plant', 'Мясокомбинат', 'loot', 'Припасы и укрытия.', 'Rare Horses Meat Plant'),
      cell(2, 0, 'school', 'Школа', 'objective', 'Классы и столовая.', 'Central High School'),
      cell(2, 1, 'auto', 'Авторемонт', 'loot', 'Инструменты и укрытия.', 'Auto Repair Shop'),
      cell(2, 2, 'smoke', 'Коптильня', 'secret', 'Тайник и еда.', "Daller's Famous Smoked Meat"),
      cell(2, 3, 'shuttle', 'Челнок', 'exit', 'Выход через площадку.', 'Shuttle')
    ],
    links: [
      ...chain(['scrapyard', 'plaza', 'hall', 'rich']),
      ...chain(['shelter', 'gate2', 'slum', 'plant']),
      ...chain(['school', 'auto', 'smoke', 'shuttle']),
      link('scrapyard', 'shelter'), link('plaza', 'gate2'), link('hall', 'slum'), link('rich', 'plant'),
      link('shelter', 'school'), link('gate2', 'auto'), link('slum', 'smoke'), link('plant', 'shuttle')
    ],
    trials: [
      { id: 'liquidate-union', name: 'Liquidate the Union', ru: 'Ликвидировать союз', kind: 'hunt', min: 15 },
      { id: 'get-out-vote', name: 'Get Out the Vote', ru: 'Поднять голоса', kind: 'investigate', min: 13 },
      { id: 'disrupt-neighborhood', name: 'Disrupt the Neighborhood', ru: 'Взбудоражить район', kind: 'sabotage', min: 14 },
      { id: 'eliminate-legacy', name: 'Eliminate the Legacy', ru: 'Уничтожить наследие', kind: 'hunt', min: 16 }
    ]
  },
  {
    id: 'mall',
    name: 'Торговый центр',
    en: 'Shopping Mall',
    prime: 'Kress Twins',
    threat: 5,
    accent: '#a3e635',
    about: 'Главная площадь с фонтаном, магазины по буквам, универмаг Spatlin и погрузочные доки. Близнецы Кресс работают парой: если один гонит тебя, второй может ждать на выходе.',
    hazards: ['Две погони одновременно', 'Открытый атриум', 'Тёмные служебные коридоры'],
    tips: ['Предохранители: зоомагазин, салон, ресторан, Cathod TV, Frames and Records, оружейный', 'После взятия предохранителя магазин гаснет и выходит Grunt / Big Grunt', 'Фонтанная зона открывается через кассы Spatlin и универмага'],
    rooms: [
      cell(0, 0, 'entrance', 'Главный вход', 'spawn', 'Старт в атриуме.', 'Main Entrance'),
      cell(0, 1, 'pet', 'Зоомагазин', 'key', 'Предохранитель B.', 'Pet Store'),
      cell(0, 2, 'beauty', 'Салон красоты', 'key', 'Предохранитель C.', 'Beauty Salon'),
      cell(0, 3, 'italian', 'Итальянский ресторан', 'key', 'Предохранитель D.', 'Italian Restaurant'),
      cell(1, 0, 'plaza', 'Главная площадь', 'objective', 'Фонтан и открытый атриум.', 'Main Plaza / Fountain Area'),
      cell(1, 1, 'spatlin', 'Spatlin', 'objective', 'Аптека, кассы, склад.', 'Spatlin'),
      cell(1, 2, 'department', 'Универмаг', 'objective', 'Предохранители и полки.', 'Department Store'),
      cell(1, 3, 'gun', 'Оружейный магазин', 'loot', 'Предохранитель и укрытия.', 'Gun Store'),
      cell(2, 0, 'service', 'Сервисная комната', 'secret', 'Тайник за служебной дверью.', 'Service Room'),
      cell(2, 1, 'loading', 'Погрузочные доки', 'terminal', 'Старт MK, улики.', 'Loading Docks'),
      cell(2, 2, 'surveillance', 'Видеонаблюдение', 'terminal', 'Мониторы и двери.', 'Surveillance Room'),
      cell(2, 3, 'parking', 'Задний вход', 'exit', 'Парковка Spatlin.', 'Back Entrance / Spatlin Parking')
    ],
    links: [
      ...chain(['entrance', 'pet', 'beauty', 'italian']),
      ...chain(['plaza', 'spatlin', 'department', 'gun']),
      ...chain(['service', 'loading', 'surveillance', 'parking']),
      link('entrance', 'plaza'), link('pet', 'spatlin'), link('beauty', 'department'), link('italian', 'gun'),
      link('plaza', 'service'), link('spatlin', 'loading'), link('department', 'surveillance'), link('gun', 'parking')
    ],
    trials: [
      { id: 'kill-politician', name: 'Kill the Politician', ru: 'Убить политика', kind: 'hunt', min: 14 },
      { id: 'investigate-minotaur', name: 'Investigate the Minotaur', ru: 'Расследовать дело Минотавра', kind: 'investigate', min: 15 },
      { id: 'fabricate-scandal', name: 'Fabricate the Scandal', ru: 'Сфабриковать скандал', kind: 'investigate', min: 13 },
      { id: 'fund-campaign', name: 'Fund the Campaign', ru: 'Финансировать кампанию', kind: 'steal', min: 13 }
    ]
  },
  {
    id: 'resort',
    name: 'Курорт',
    en: 'Resort',
    prime: 'Liliya',
    threat: 5,
    accent: '#38bdf8',
    about: 'Ледяная пещера, служебная зона, лобби, живой аукцион, восточный коридор и крипта. Лилиия давит на открытых пространствах — держись номеров и служебных проходов.',
    hazards: ['Открытые пространства и скользкие полы', 'Позднее усиление охраны', 'Холод в номерах 201–204'],
    tips: ['Owl Key — в Fine Arts, под blacklight в тихом аукционе', 'Рычаг PAIN IN PLEASURE в комнате медведя открывает неотмеченную зону', 'Крипта: самоцветы и Bear Key для Incinerate the Relic'],
    rooms: [
      cell(0, 0, 'cavern', 'Ледяная пещера', 'spawn', 'Стартовая зона.', 'Cavern'),
      cell(0, 1, 'staff', 'Служебная зона', 'terminal', 'Печь, кухня, склад, док.', "Employees' Only Area"),
      cell(0, 2, 'lobby', 'Лобби', 'objective', 'Ресепшен, бар, медведь.', 'Lobby'),
      cell(0, 3, 'rooms201', 'Номера 201–204', 'objective', 'Холод, неисправный генератор.', 'Rooms 201–204'),
      cell(1, 0, 'loading', 'Служебный док', 'loot', 'Припасы и короткий проход.', 'Loading Dock'),
      cell(1, 1, 'auction', 'Живой аукцион', 'key', 'Депозитный ящик и лоты.', 'Live Auction'),
      cell(1, 2, 'finearts', 'Fine Arts', 'key', 'Owl Key, тихий аукцион.', 'Fine Arts'),
      cell(1, 3, 'east', 'Восточный коридор', 'terminal', 'Модули питания, столовая, часовня.', 'East Corridor'),
      cell(2, 0, 'rooms205', 'Номера 205–207', 'loot', 'Кухня, прачечная, винный шкаф.', 'Rooms 205–207'),
      cell(2, 1, 'chapel', 'Часовня', 'objective', 'Тихая зона восточного коридора.', 'Chapel'),
      cell(2, 2, 'crypt', 'Крипта', 'secret', 'Самоцветы и Bear Key.', 'Crypt'),
      cell(2, 3, 'unmapped', 'Неотмеченная зона', 'exit', 'Выход через потайной проход.', 'Unmapped Space')
    ],
    links: [
      ...chain(['cavern', 'staff', 'lobby', 'rooms201']),
      ...chain(['loading', 'auction', 'finearts', 'east']),
      ...chain(['rooms205', 'chapel', 'crypt', 'unmapped']),
      link('cavern', 'loading'), link('staff', 'auction'), link('lobby', 'finearts'), link('rooms201', 'east'),
      link('loading', 'rooms205'), link('auction', 'chapel'), link('finearts', 'crypt'), link('east', 'unmapped')
    ],
    trials: [
      { id: 'despoil-auction', name: 'Despoil the Auction', ru: 'Разграбить аукцион', kind: 'steal', min: 15 },
      { id: 'solve-murder', name: 'Solve the Murder', ru: 'Раскрыть убийство', kind: 'investigate', min: 16 },
      { id: 'incinerate-relic', name: 'Incinerate the Relic', ru: 'Сжечь реликвию', kind: 'destroy', min: 14 }
    ]
  },
  {
    id: 'tvstudio',
    name: 'Телестудия',
    en: 'Television Studio',
    prime: 'Kress Twins',
    threat: 4,
    accent: '#e879f9',
    about: 'Улица, ресепшен, шесть павильонов, колосники, служебная зона и крыша. Декорации обманчивы: за фальшивыми стенами часто есть короткий проход.',
    hazards: ['Ложные стены и тупики', 'Яркий свет выдаёт движение', 'Тёмные service и крыша'],
    tips: ['Кнопка на ресепшене включает спринклеры — используй против погони', '4 энергостанции открывают актёрскую: service, offices, audiovisual', 'Change the Program: 4 антенны на крыше и конвертеры кассет'],
    rooms: [
      cell(0, 0, 'street', 'Улица', 'spawn', 'Старт у входа в студию.', 'Street'),
      cell(0, 1, 'reception', 'Ресепшен', 'terminal', 'Кнопка спринклеров.', 'Reception'),
      cell(0, 2, 'lobby', 'Лобби', 'loot', 'Припасы и укрытия.', 'Lobby'),
      cell(0, 3, 'studio1', 'Студия 1 (KVC News)', 'objective', 'Красный павильон новостей.', 'Studio 1'),
      cell(1, 0, 'backstage', 'За кулисами', 'terminal', 'Энергостанции и декорации.', 'Backstage'),
      cell(1, 1, 'studio2', 'Студия 2', 'objective', 'Зелёный павильон «Learn to Cook».', 'Studio 2'),
      cell(1, 2, 'catwalks', 'Колосники', 'secret', 'Верхние проходы над павильонами.', 'Catwalks'),
      cell(1, 3, 'service', 'Служебная зона', 'key', 'Энергостанции и служебный выход.', 'Service Area'),
      cell(2, 0, 'offices', 'Офисы', 'key', 'Энергостанции для актёрской.', 'Offices'),
      cell(2, 1, 'actors', 'Актёрская', 'objective', 'Открывается после 4 станций.', 'Actors Department'),
      cell(2, 2, 'studio4', 'Студия 4 (Kress)', 'key', 'Подмена кассеты и пила.', 'Studio 4'),
      cell(2, 3, 'roof', 'Крыша', 'exit', '4 антенны и финальный выход.', 'Rooftop')
    ],
    links: [
      ...chain(['street', 'reception', 'lobby', 'studio1']),
      ...chain(['backstage', 'studio2', 'catwalks', 'service']),
      ...chain(['offices', 'actors', 'studio4', 'roof']),
      link('street', 'backstage'), link('reception', 'studio2'), link('lobby', 'catwalks'), link('studio1', 'service'),
      link('backstage', 'offices'), link('studio2', 'actors'), link('catwalks', 'studio4'), link('service', 'roof')
    ],
    trials: [
      { id: 'silence-idol', name: 'Silence the Idol', ru: 'Заставить идола замолчать', kind: 'hunt', min: 14 },
      { id: 'cancel-broadcast', name: 'Cancel the Broadcast', ru: 'Отменить трансляцию', kind: 'sabotage', min: 15 },
      { id: 'change-program', name: 'Change the Program', ru: 'Изменить программу', kind: 'broadcast', min: 13 }
    ]
  },
  {
    id: 'prisonfarm',
    name: 'Тюремная ферма',
    en: 'Prison Farm',
    prime: 'The Warden',
    threat: 5,
    accent: '#fbbf24',
    about: 'Душевые, паноптикон, блоки A/B, прачечная, печи и свиноферма. Открытые поля просматриваются — используй постройки как укрытия и следи за собачьими патрулями.',
    hazards: ['Открытые поля и собаки', 'Затопленный подвал', 'Карцер и паноптикон с одним выходом'],
    tips: ['Старт — душевые: водяная система, выход в мастерскую', 'Ключ и документ — в кабинете надзирателя на втором этаже', 'Детонатор крафтится в мастерской; рычаг — в паноптиконе'],
    rooms: [
      cell(0, 0, 'showers', 'Душевые', 'spawn', 'Старт, водяная система.', 'Showers'),
      cell(0, 1, 'sideyard', 'Боковой двор', 'objective', 'Переход между корпусами.', 'Prison Side Yard'),
      cell(0, 2, 'craft', 'Мастерская', 'key', 'Детонатор и ключи.', 'Crafting Room'),
      cell(0, 3, 'blocka', 'Блок A: камеры', 'objective', 'Шкафчики и укрытия.', 'Block A Cells'),
      cell(1, 0, 'panopticon', 'Паноптикон', 'terminal', 'Рычаг и обзор всех блоков.', 'Panopticon'),
      cell(1, 1, 'laundry', 'Прачечная', 'loot', 'Припасы и укрытия.', 'Laundry Room'),
      cell(1, 2, 'furnaces', 'Печи', 'danger', 'Жар и шум механизмы.', 'Furnaces Room'),
      cell(1, 3, 'flooded', 'Затопленный подвал', 'danger', 'Медленное движение, один выход.', 'Basement Flooded Area'),
      cell(2, 0, 'office', 'Кабинет надзирателя', 'key', 'Ключ с тела и документ.', 'Warden Office'),
      cell(2, 1, 'pigclose', 'Свиноферма, ближ.', 'exit', 'Выход через ближние ворота.', 'Pig Farm Close Entrance'),
      cell(2, 2, 'pigfar', 'Свиноферма, дал.', 'exit', 'Альтернативный выход.', 'Pig Farm Far Entrance'),
      cell(2, 3, 'entrance', 'Вход в тюрьму', 'terminal', 'Контроль ворот.', 'Prison Entrance')
    ],
    links: [
      ...chain(['showers', 'sideyard', 'craft', 'blocka']),
      ...chain(['panopticon', 'laundry', 'furnaces', 'flooded']),
      ...chain(['office', 'pigclose', 'pigfar', 'entrance']),
      link('showers', 'panopticon'), link('sideyard', 'laundry'), link('craft', 'furnaces'), link('blocka', 'flooded'),
      link('panopticon', 'office'), link('laundry', 'pigclose'), link('furnaces', 'pigfar'), link('flooded', 'entrance')
    ],
    trials: [
      { id: 'locksock-warden', name: 'Locksock the Warden', ru: 'Упрятать надзирателя', kind: 'rescue', min: 16 }
    ]
  },
  {
    id: 'mansion',
    name: 'Особняк',
    en: 'Mansion',
    prime: 'Нет',
    threat: 2,
    accent: '#94a3b8',
    about: 'Туториал, Rebirth и финальные сцены. Точные внутриигровые названия комнат в открытых источниках отсутствуют, поэтому здесь авторская схема по гайдам: вестибюль, кабинет, ТВ-подсказки, лифты и двор.',
    hazards: ['Мало припасов', 'Скрипящие половицы', 'Закрытые комнаты и большие гранты'],
    tips: ['Ключи берутся по подсказкам телевизоров', 'Prime Assets могут прибывать через лифты — не засиживайся', 'Двор опасен: Night Hunter и Screamer'],
    rooms: [
      cell(0, 0, 'hall', 'Парадный холл', 'spawn', 'Старт, вход в особняк.', 'Entrance Hall'),
      cell(0, 1, 'office', 'Кабинет Истермана', 'objective', 'Документы и первые подсказки.', "Easterman's Office"),
      cell(0, 2, 'library', 'Библиотека', 'loot', 'Книги и тайники.', 'Library'),
      cell(0, 3, 'tv', 'Комната с ТВ', 'key', 'Подсказки к ключам.', 'TV Clue Room'),
      cell(1, 0, 'elevator', 'Лифт', 'terminal', 'Прибытие Prime Assets.', 'Elevator'),
      cell(1, 1, 'cellar', 'Подвал', 'secret', 'Тёмный подвал и тайники.', 'Cellar'),
      cell(1, 2, 'guards', 'Коридор охранников', 'danger', 'Big Grunts и узкие проходы.', 'Guard Corridor'),
      cell(1, 3, 'chapel', 'Часовня', 'objective', 'Финальная сцена.', 'Chapel'),
      cell(2, 0, 'gates', 'Ворота', 'exit', 'Выход с территории.', 'Gates'),
      cell(2, 1, 'courtyard', 'Двор', 'danger', 'Night Hunter и Screamer.', 'Courtyard'),
      cell(2, 2, 'levers', 'Комнаты с рычагами', 'key', 'Механизмы Rebirth.', 'Lever Rooms'),
      cell(2, 3, 'final', 'Финал', 'exit', 'Farewell / Rebirth. Статус уточняется.', 'Farewell')
    ],
    links: [
      ...chain(['hall', 'office', 'library', 'tv']),
      ...chain(['elevator', 'cellar', 'guards', 'chapel']),
      ...chain(['gates', 'courtyard', 'levers', 'final']),
      link('hall', 'elevator'), link('office', 'cellar'), link('library', 'guards'), link('tv', 'chapel'),
      link('elevator', 'gates'), link('cellar', 'courtyard'), link('guards', 'levers'), link('chapel', 'final')
    ],
    trials: [
      { id: 'farewell', name: 'Farewell', ru: 'Прощание', kind: 'escape', min: 20 },
      { id: 'introduction', name: 'Introduction', ru: 'Введение', kind: 'investigate', min: 10 }
    ]
  },
  {
    id: 'wastetunnel',
    name: 'Сточный тоннель',
    en: 'Waste Tunnel',
    prime: 'Все Prime Assets',
    threat: 5,
    accent: '#84cc16',
    about: 'Biohazard Disposal Facility: мусорный челнок, насосная, секции A/B, казни и шахтный тоннель. Мало места для манёвра, зато много слепых зон. Точные названия зон не подтверждены — схема авторская.',
    hazards: ['Затопленные отсеки', 'Один маршрут отхода', 'Казни и несколько Prime Assets'],
    tips: ['Жёлтые настенные лампы уничтожаются Microwave Triggers', 'Собирай лампы для инцинератора в секции A/B', 'Prime Assets рандомизируются: Койл, Гусберри, близнецы Кресс'],
    rooms: [
      cell(0, 0, 'shuttle', 'Мусорный челнок', 'spawn', 'Старт посреди тоннеля.', 'Garbage Shuttle'),
      cell(0, 1, 'repower', 'Питание', 'terminal', 'Восстановление питания.', 'Repower Machine'),
      cell(0, 2, 'sectiona', 'Секция A', 'objective', 'Сжигание лоялистов.', 'Section A'),
      cell(0, 3, 'bulbs', 'Сбор ламп', 'key', 'Лампы для инцинератора.', 'Bulb Collection'),
      cell(1, 0, 'pumps', 'Насосная', 'terminal', 'Механизмы и вода.', 'Pump Room'),
      cell(1, 1, 'flooded', 'Затопленный отсек', 'danger', 'Медленное движение.', 'Flooded Compartment'),
      cell(1, 2, 'blast', 'Взрывная дверь', 'danger', 'Один маршрут отхода.', 'Blast-door Corridor'),
      cell(1, 3, 'mines', 'Шахтный тоннель', 'terminal', 'Финальный маршрут.', 'Mineshaft Tunnel'),
      cell(2, 0, 'lamps', 'Жёлтые лампы', 'key', 'Уничтожь Microwave Triggers.', 'Wall Lamps'),
      cell(2, 1, 'chair', 'Казнь: стул', 'danger', 'Электрический стул.', 'Electric Chair'),
      cell(2, 2, 'water', 'Казнь: утопление', 'danger', 'Камера утопления.', 'Drowning Chamber'),
      cell(2, 3, 'hatch', 'Люк наверх', 'exit', 'Финальный выход.', 'Exit Hatch')
    ],
    links: [
      ...chain(['shuttle', 'repower', 'sectiona', 'bulbs']),
      ...chain(['pumps', 'flooded', 'blast', 'mines']),
      ...chain(['lamps', 'chair', 'water', 'hatch']),
      link('shuttle', 'pumps'), link('repower', 'flooded'), link('sectiona', 'blast'), link('bulbs', 'mines'),
      link('pumps', 'lamps'), link('flooded', 'chair'), link('blast', 'water'), link('mines', 'hatch')
    ],
    trials: [
      { id: 'escape-lies', name: 'Escape the Lies', ru: 'Побег из лжи', kind: 'escape', min: 18 }
    ]
  }
];


const ITEMS = [
  { id: 'lockpick', name: 'Отмычка', en: 'Lockpick', cat: 'Инструмент', rarity: 'Обычная', effect: 'Открывает замки на ящиках и дверях. Расходуется.', tip: 'Носи минимум одну: за закрытыми ящиками часто лежит большой медикамент или батарея.' },
  { id: 'masterkey', name: 'Мастер-ключ', en: 'Master Key', cat: 'Инструмент', rarity: 'Секрет', effect: 'Бесконечная отмычка, открывает замки мгновенно.', tip: 'Появляется в «Подарочной» комнате. Сильно упрощает соло-забеги.' },
  { id: 'med-small', name: 'Малый медикамент', en: 'Small Medicine', cat: 'Лечение', rarity: 'Обычная', effect: 'Восстанавливает часть здоровья.', tip: 'Не трать на царапину: прибереги на погоню.' },
  { id: 'med-large', name: 'Большой медикамент', en: 'Large Medicine', cat: 'Лечение', rarity: 'Необычная', effect: 'Восстанавливает больше здоровья.', tip: 'Часто лежит в закрытых аптечках — бери отмычку.' },
  { id: 'bandage', name: 'Бинт', en: 'Bandage', cat: 'Лечение', rarity: 'Обычная', effect: 'Останавливает кровотечение.', tip: 'Критично против Гусберри и вариатора Bleeding.' },
  { id: 'pills', name: 'Таблетки здоровья', en: 'Health Pills', cat: 'Лечение', rarity: 'Особая', effect: 'Лечит постоянный урон в вариаторах Health Sickness / Permanent Damage.', tip: 'Обычные медикаменты не убирают постоянный урон.' },
  { id: 'battery-small', name: 'Малая батарея', en: 'Small Battery', cat: 'Батарея', rarity: 'Обычная', effect: 'Частично заряжает прибор ночного видения.', tip: 'Выключай ПНВ в безопасных зонах, чтобы экономить заряд.' },
  { id: 'battery-large', name: 'Большая батарея', en: 'Large Battery', cat: 'Батарея', rarity: 'Необычная', effect: 'Сильно заряжает ПНВ.', tip: 'Ищи в закрытых инструментальных ящиках.' },
  { id: 'antidote', name: 'Антидот', en: 'Antidote', cat: 'Расходник', rarity: 'Обычная', effect: 'Убирает психоз и возвращает рассудок.', tip: 'Спасает от Skinner Man и газовых атак Pusher.' },
  { id: 'adrenaline', name: 'Адреналин', en: 'Adrenaline', cat: 'Расходник', rarity: 'Обычная', effect: 'Временная бесконечная стамина и ускорение.', tip: 'Держи на финальный побег, а не на исследование.' },
  { id: 'rig-recharger', name: 'Заряд рига', en: 'Rig Recharger', cat: 'Расходник', rarity: 'Необычная', effect: 'Мгновенно восстанавливает заряд рига.', tip: 'Лучший предмет для соло-игры со Stun Rig.' },
  { id: 'syringe', name: 'Шприц', en: 'Syringe', cat: 'Спасение', rarity: 'Необычная', effect: 'Поднимает полностью мёртвого союзника.', tip: 'Только для тиммейтов, которые уже истекли кровью.' },
  { id: 'brick', name: 'Кирпич', en: 'Brick', cat: 'Бросок', rarity: 'Обычная', effect: 'Оглушает врага и сбивает растяжки/ловушки.', tip: 'Универсальный инструмент: отвлечение, стан, обезвреживание.' },
  { id: 'bottle', name: 'Бутылка', en: 'Bottle', cat: 'Бросок', rarity: 'Обычная', effect: 'Разбивается и отвлекает врагов на звук.', tip: 'Идеальна, чтобы увести патруль от цели.' },
  { id: 'heart', name: 'Сердце', en: 'Heart', cat: 'Миссия', rarity: 'Сюжетная', effect: 'Предмет задания в Fun Park.', tip: 'Не выбрасывай: без него не завершить этап.' },
  { id: 'keys', name: 'Ключи', en: 'Keys', cat: 'Миссия', rarity: 'Сюжетная', effect: 'Открывают решётки и двери в Police Station.', tip: 'Ищи на телах с метками.' },
  { id: 'gasoline', name: 'Бензин', en: 'Gasoline', cat: 'Миссия', rarity: 'Сюжетная', effect: 'Заправляет генераторы в Police Station.', tip: 'Тяжёлый: замедляет и жрёт стамину.' },
  { id: 'bleach', name: 'Отбеливатель', en: 'Bleach', cat: 'Миссия', rarity: 'Сюжетная', effect: 'Нужен для кухни в Orphanage.', tip: 'Бери только когда путь до кухни разведан.' },
  { id: 'mannequin', name: 'Манекен-ребёнок', en: 'Mannequin Children', cat: 'Миссия', rarity: 'Сюжетная', effect: 'Объект для испытаний в Fun Park.', tip: 'Крупный предмет, нельзя убрать в инвентарь.' },
  { id: 'posters', name: 'Плакаты', en: 'Posters', cat: 'Миссия', rarity: 'Обычная', effect: 'Дополнительная цель: сбор плакатов.', tip: 'Дают больше опыта и денег за забег.' },
  { id: 'evidence', name: 'Улики', en: 'Evidence', cat: 'Секрет', rarity: 'Редкая', effect: 'Открывают лор и коллекции.', tip: 'Спавнятся в конкретных местах, осматривай полки.' },
  { id: 'energy-enhancer', name: 'Усилитель энергии', en: 'Energy Enhancer', cat: 'Улучшение', rarity: 'Секрет', effect: 'Повышает максимум стамины.', tip: 'Награда из «Подарочной» комнаты.' },
  { id: 'health-enhancer', name: 'Усилитель здоровья', en: 'Health Enhancer', cat: 'Улучшение', rarity: 'Секрет', effect: 'Повышает максимум здоровья.', tip: 'Награда из «Подарочной» комнаты.' },
  { id: 'battery-enhancer', name: 'Усилитель батареи', en: 'Battery Enhancer', cat: 'Улучшение', rarity: 'Секрет', effect: 'Повышает ёмкость ПНВ.', tip: 'Награда из «Подарочной» комнаты.' }
];

const ENEMIES = [
  { id: 'grunt', name: 'Грант', en: 'Grunt', type: 'Обычный Ex-Pop', threat: 2, maps: 'Все карты', attack: 'Ближний бой, преследование', counter: 'Тишина, двери, укрытия. Ломай линию взгляда и не беги по прямой.', note: 'Базовая угроза. Опасен не сам по себе, а шумом, который привлекает остальных.' },
  { id: 'big-grunt', name: 'Большой грант', en: 'Big Grunt', type: 'Тяжёлый Ex-Pop', threat: 3, maps: 'Все карты', attack: 'Мощный удар, блокирует проходы', counter: 'Широкие петли, держи двери между собой и им.', note: 'Не пытайся проскочить в узком коридоре — обходи.' },
  { id: 'biter', name: 'Кусака', en: 'Biter', type: 'Особый Ex-Pop', threat: 3, maps: 'Police Station, Orphanage и др.', attack: 'Рывок и захват на короткой дистанции', counter: 'Держи дистанцию, двери и препятствия. Не давай зажать себя в углу.', note: 'Особенно опасен в узких комнатах и на низкой стамине.' },
  { id: 'pouncer', name: 'Прыгун', en: 'Pouncer', type: 'Особый Ex-Pop', threat: 3, maps: 'Все карты', attack: 'Прыжок через комнату', counter: 'Ломай линию взгляда заранее, не стой на открытом месте.', note: 'Слышен по характерному визгу перед прыжком.' },
  { id: 'screamer', name: 'Крикун', en: 'Screamer', type: 'Особый Ex-Pop', threat: 3, maps: 'Все карты', attack: 'Крик, привлекающий других врагов', counter: 'Оглуши или обойди. Не пытайся спрятаться рядом.', note: 'Сам по себе слаб, но его крик может собрать полкарты.' },
  { id: 'pusher', name: 'Пущер', en: 'Pusher', type: 'Особый Ex-Pop', threat: 3, maps: 'Все карты', attack: 'Газовое облако, ухудшает контроль', counter: 'Сразу выходи из газа, держи антидот и стамину на рывок.', note: 'Выкуривает из укрытий и создаёт окно для других врагов.' },
  { id: 'berserker', name: 'Берсерк', en: 'Berserker', type: 'Особый Ex-Pop', threat: 4, maps: 'Все карты', attack: 'Быстрая агрессивная погоня', counter: 'Прячься заранее, не трать стамину. Двери и углы — твои друзья.', note: 'Наказывает за панику и пустую стамину.' },
  { id: 'jaeger', name: 'Егерь', en: 'Jaeger', type: 'Вариатор / охотник', threat: 5, maps: 'Rebirth, вариаторы', attack: 'Постоянно выслеживает игрока', counter: 'Постоянно меняй укрытия, не сиди в одном месте.', note: 'Появляется в режиме Rebirth и некоторых вариаторах.' },
  { id: 'skinner', name: 'Скиннер', en: 'Skinner Man', type: 'Психоз', threat: 4, maps: 'При пустом рассудке', attack: 'Галлюцинации и давление', counter: 'Прими антидот, восстанови рассудок, не трать предметы на видения.', note: 'Не настоящий враг, но может привести к ошибке в реальной погоне.' },
  { id: 'coyle', name: 'Лиланд Койл', en: 'Leland Coyle', type: 'Prime Asset', threat: 5, maps: 'Police Station, Courthouse, Waste Tunnel', attack: 'Электрошоковая дубинка, отключает риг', counter: 'Ломай линию взгляда, петляй через двери, не беги по прямой.', note: 'Его искры и сигаретный дым выдают позицию.' },
  { id: 'gooseberry', name: 'Матушка Гусберри', en: 'Mother Gooseberry', type: 'Prime Asset', threat: 5, maps: 'Orphanage, Fun Park, Toy Factory', attack: 'Дрель, вызывает кровотечение', counter: 'Мульти-выходные комнаты, бинты, Stun Rig.', note: 'Звук дрели слышно издалека — используй это.' },
  { id: 'franco', name: 'Франко Барби', en: 'Franco Barbi', type: 'Prime Asset', threat: 5, maps: 'The Docks, Downtown, The Suburbs', attack: 'Дробовик, стреляет по звуку и силуэту', counter: 'Укрытия, короткие перебежки, не выглядывай дважды.', note: 'Перезаряжается после двух выстрелов — это окно.' },
  { id: 'kress', name: 'Близнецы Кресс', en: 'Kress Twins', type: 'Prime Asset (пара)', threat: 5, maps: 'Shopping Mall, Television Studio', attack: 'Слаженная охота с двух сторон', counter: 'Не позволяй окружить, держи открытый маршрут.', note: 'Слушай два источника шагов одновременно.' },
  { id: 'liliya', name: 'Лилиия', en: 'Liliya', type: 'Prime Asset', threat: 5, maps: 'Resort', attack: 'Давление на открытых пространствах', counter: 'Служебные проходы, номера, минимум открытых зон.', note: 'Новый Prime Asset курорта.' },
  { id: 'warden', name: 'Надзиратель', en: 'The Warden', type: 'Prime Asset', threat: 5, maps: 'Prison Farm', attack: 'Тяжёлый ближний бой', counter: 'Постройки и заборы, не беги через поле.', note: 'Хозяин тюремной фермы.' }
];

const RIGS = [
  { id: 'stun', name: 'Stun Rig', ru: 'Оглушение', role: 'Контроль', best: 'Соло, спасение союзников, аварийный выход', text: 'Оглушает врага на несколько секунд. Лучший выбор для соло и для спасения тиммейтов. Держи заряд на захват или тупик.' },
  { id: 'heal', name: 'Heal Rig', ru: 'Лечение', role: 'Поддержка', best: 'Кооп 2–4, длинные испытания', text: 'Лечит без расходников. В соло слабее, в группе экономит медикаменты и держит команду на ногах.' },
  { id: 'xray', name: 'X-Ray Rig', ru: 'Рентген', role: 'Информация', best: 'Соло, изучение карт, поиск целей', text: 'Показывает врагов и цели через стены. Идеален, пока учишь планировку, и для поиска терминалов.' },
  { id: 'barricade', name: 'Barricade Rig', ru: 'Баррикада', role: 'Зона контроля', best: 'Кооп, оборона комнаты с целью', text: 'Забаррикадировать дверь и выиграть время. Хорош на шумных этапах, но не спасает от Prime Asset навсегда.' }
];
