/* Outlast Trials Companion — данные справочника.
   Схемы карт — авторские упрощённые планы для навигации, не копии игровых карт. */

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

const room = (id, label, x, y, w, h, type, note) => ({ id, label, x, y, w, h, type, note });

const CORRIDOR = room('corridor', 'Коридор', 40, 240, 920, 100, 'corridor', 'Связующая зона: держи двери закрытыми.');

const MAPS = [
  {
    id: 'police',
    name: 'Полицейский участок',
    en: 'Police Station',
    prime: 'Leland Coyle',
    threat: 4,
    accent: '#4f8cff',
    about: 'Длинные коридоры, камеры и кабинеты. Отличная карта, чтобы выучить петли вокруг дверей: Коула нельзя перегнать по прямой, но можно разорвать линию взгляда.',
    hazards: ['Электрощиты на полу', 'Узкие камеры без второго выхода', 'Шумные двери и допросные'],
    tips: ['Держи в уме двор как альтернативный маршрут', 'Сначала собери отмычки и батареи', 'Не беги по центральному коридору без причины'],
    rooms: [
      room('reception', 'Приёмная', 40, 40, 260, 150, 'spawn', 'Старт. Осмотри стойку и шкафы.'),
      room('cells', 'Камеры', 370, 40, 260, 150, 'objective', 'Основная цель большинства испытаний.'),
      room('interro', 'Допросная', 700, 40, 260, 150, 'objective', 'Шумные взаимодействия, рядом патруль.'),
      CORRIDOR,
      room('laundry', 'Прачечная', 40, 390, 260, 170, 'secret', 'Секретная комната за двумя кнопками.'),
      room('archive', 'Архив', 370, 390, 260, 170, 'loot', 'Ящики, отмычки, документы.'),
      room('garage', 'Гараж', 700, 390, 260, 170, 'exit', 'Выход. Часто охраняется.')
    ],
    links: [['reception','corridor'],['cells','corridor'],['interro','corridor'],['laundry','corridor'],['archive','corridor'],['garage','corridor']],
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
    about: 'Ярмарочные аттракционы, лабиринт «Корневого канала» и открытые площади. Мало укрытий на улице — планируй перебежки между павильонами.',
    hazards: ['Взрывные утки', 'Открытые площади без укрытий', 'Узкие проходы аттракционов'],
    tips: ['Используй павильоны как ориентиры', 'Не беги через открытую площадь', 'Проверяй тёмные комнаты за аттракционами'],
    rooms: [
      room('gate', 'Вход', 40, 40, 260, 150, 'spawn', 'Стартовая площадь и кассы.'),
      room('carousel', 'Карусель', 370, 40, 260, 150, 'objective', 'Открытая зона, легко потерять укрытие.'),
      room('funhouse', 'Комната смеха', 700, 40, 260, 150, 'loot', 'Зеркала и тупики — осторожно.'),
      CORRIDOR,
      room('rootcanal', 'Корневой канал', 40, 390, 260, 170, 'secret', 'Тёмный аттракцион, тайник.'),
      room('stage', 'Сцена', 370, 390, 260, 170, 'objective', 'Шумная цель, рядом патрули.'),
      room('backexit', 'Служебный выход', 700, 390, 260, 170, 'exit', 'Выход через техническую зону.')
    ],
    links: [['gate','corridor'],['carousel','corridor'],['funhouse','corridor'],['rootcanal','corridor'],['stage','corridor'],['backexit','corridor']],
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
    about: 'Тесные спальни, кухня и коридоры с множеством дверей. Один из лучших уровней для игры в прятки — но у Гусберри здесь особенно много маршрутов.',
    hazards: ['Узкие коридоры', 'Кухня с шумной техникой', 'Комнаты с одним выходом'],
    tips: ['Запоминай вторую дверь в каждой комнате', 'Кухня — хороший источник медикаментов', 'Не прячься в комнате, где только что шумел'],
    rooms: [
      room('lobby', 'Вестибюль', 40, 40, 260, 150, 'spawn', 'Старт, стойка регистрации.'),
      room('dorms', 'Спальни', 370, 40, 260, 150, 'objective', 'Много кроватей и укрытий.'),
      room('kitchen', 'Кухня', 700, 40, 260, 150, 'objective', 'Шумная техника, медикаменты.'),
      CORRIDOR,
      room('office', 'Кабинет', 40, 390, 260, 170, 'loot', 'Документы и ключи.'),
      room('basement', 'Подвал', 370, 390, 260, 170, 'secret', 'Тайник, но один выход.'),
      room('yard', 'Задний двор', 700, 390, 260, 170, 'exit', 'Выход через хозяйственную зону.')
    ],
    links: [['lobby','corridor'],['dorms','corridor'],['kitchen','corridor'],['office','corridor'],['basement','corridor'],['yard','corridor']],
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
    about: 'Залы суда, камеры и архив. Много закрытых проходов: запоминай, какие двери уже открыты, иначе финальный побег превратится в блуждание.',
    hazards: ['Позднее усиление патрулей', 'Закрытые служебные проходы', 'Открытые залы без укрытий'],
    tips: ['Отмечай открытые двери', 'Не задерживайся в зале суда', 'Оставь заряд рига на финальный рывок'],
    rooms: [
      room('hall', 'Холл', 40, 40, 260, 150, 'spawn', 'Старт, мраморный холл.'),
      room('courtroom', 'Зал суда', 370, 40, 260, 150, 'objective', 'Открытое пространство, мало укрытий.'),
      room('records', 'Архив', 700, 40, 260, 150, 'objective', 'Стеллажи и документы.'),
      CORRIDOR,
      room('holding', 'Камеры', 40, 390, 260, 170, 'loot', 'Ключи и улики.'),
      room('service', 'Сервисный коридор', 370, 390, 260, 170, 'danger', 'Узкий проход, плохой для погони.'),
      room('gate', 'Выход', 700, 390, 260, 170, 'exit', 'Финальные ворота.')
    ],
    links: [['hall','corridor'],['courtroom','corridor'],['records','corridor'],['holding','corridor'],['service','corridor'],['gate','corridor']],
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
    about: 'Конвейеры, печи и склад игрушек. Механизмы глушат шаги, но конвейер может выдать тебя шумом. Держи путь отхода до того, как потянешь рычаг.',
    hazards: ['Шумные конвейеры', 'Печи и горячие зоны', 'Тесные проходы между станками'],
    tips: ['Оглушай станки перед взаимодействием', 'Склад — хороший источник припасов', 'Не стой у конвейера после запуска'],
    rooms: [
      room('floor', 'Цех', 40, 40, 260, 150, 'spawn', 'Старт у главного конвейера.'),
      room('line', 'Конвейер', 370, 40, 260, 150, 'objective', 'Шумная цель, много патрулей.'),
      room('storage', 'Склад игрушек', 700, 40, 260, 150, 'loot', 'Ящики и припасы.'),
      CORRIDOR,
      room('furnace', 'Печь', 40, 390, 260, 170, 'objective', 'Жар и опасные механизмы.'),
      room('vents', 'Вентиляция', 370, 390, 260, 170, 'secret', 'Тайный проход между цехами.'),
      room('loading', 'Погрузка', 700, 390, 260, 170, 'exit', 'Выход через доки.')
    ],
    links: [['floor','corridor'],['line','corridor'],['storage','corridor'],['furnace','corridor'],['vents','corridor'],['loading','corridor']],
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
    about: 'Склады, контейнеры и причал. Франко простреливает длинные прямые, поэтому передвигайся между укрытиями и не выходи на открытый пирс без плана.',
    hazards: ['Растяжки и мины', 'Простреливаемые прямые', 'Скользкие края причала'],
    tips: ['Сбивай растяжки кирпичом', 'Не выглядывай из-за контейнера дважды', 'Лодка — финальная точка эвакуации'],
    rooms: [
      room('pier', 'Причал', 40, 40, 260, 150, 'spawn', 'Старт у воды.'),
      room('warehouse', 'Склад', 370, 40, 260, 150, 'objective', 'Контейнеры и ящики.'),
      room('vault', 'Хранилище', 700, 40, 260, 150, 'secret', 'Тайник за кодовым замком.'),
      CORRIDOR,
      room('customs', 'Таможня', 40, 390, 260, 170, 'objective', 'Документы и терминалы.'),
      room('containers', 'Контейнеры', 370, 390, 260, 170, 'loot', 'Лабиринт из контейнеров.'),
      room('boat', 'Катер', 700, 390, 260, 170, 'exit', 'Выход по воде.')
    ],
    links: [['pier','corridor'],['warehouse','corridor'],['vault','corridor'],['customs','corridor'],['containers','corridor'],['boat','corridor']],
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
    about: 'Улицы, аукционный зал и ратуша. Комбинирует открытые перестрелочные улицы с тесными интерьерами — держи в голове два разных маршрута.',
    hazards: ['Снайперские прямые Франко', 'Много открытых улиц', 'Шумные городские объекты'],
    tips: ['Двигайся по переулкам', 'Аукционный зал — самая шумная точка', 'Не используй метро как укрытие без проверки'],
    rooms: [
      room('street', 'Улица', 40, 40, 260, 150, 'spawn', 'Старт на улице.'),
      room('auction', 'Аукционный зал', 370, 40, 260, 150, 'objective', 'Главная цель, много шума.'),
      room('bar', 'Бар', 700, 40, 260, 150, 'loot', 'Припасы и укрытия.'),
      CORRIDOR,
      room('alley', 'Переулок', 40, 390, 260, 170, 'danger', 'Узкий маршрут отхода.'),
      room('cityhall', 'Ратуша', 370, 390, 260, 170, 'objective', 'Второй этап испытания.'),
      room('metro', 'Метро', 700, 390, 260, 170, 'exit', 'Выход через подземку.')
    ],
    links: [['street','corridor'],['auction','corridor'],['bar','corridor'],['alley','corridor'],['cityhall','corridor'],['metro','corridor']],
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
    about: 'Частные дома, школа и пустырь. Много входов в дома — используй их для петель, но помни: Франко слышит даже осторожное открытие двери.',
    hazards: ['Растяжки в домах', 'Открытые газоны', 'Школьные коридоры с одним выходом'],
    tips: ['Прыгай через заборы, чтобы срезать', 'Гараж — хороший тайник', 'Не беги по газону на виду'],
    rooms: [
      room('block', 'Квартал', 40, 40, 260, 150, 'spawn', 'Старт на улице.'),
      room('house', 'Дом', 370, 40, 260, 150, 'objective', 'Двухэтажный дом с укрытиями.'),
      room('garage', 'Гараж', 700, 40, 260, 150, 'loot', 'Инструменты и припасы.'),
      CORRIDOR,
      room('school', 'Школа', 40, 390, 260, 170, 'objective', 'Классы и длинные коридоры.'),
      room('lot', 'Пустырь', 370, 390, 260, 170, 'secret', 'Тайник под открытым небом.'),
      room('highway', 'Шоссе', 700, 390, 260, 170, 'exit', 'Выход через дорогу.')
    ],
    links: [['block','corridor'],['house','corridor'],['garage','corridor'],['school','corridor'],['lot','corridor'],['highway','corridor']],
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
    about: 'Атриум, магазины, кинотеатр и подземная парковка. Близнецы Кресс работают парой: если один гонит тебя, второй может ждать на выходе.',
    hazards: ['Две погони одновременно', 'Эскалаторы и открытый атриум', 'Тёмная парковка'],
    tips: ['Не позволяй загнать себя в магазин с одним выходом', 'Слушай два источника шагов', 'Парковка — хороший круг для разрыва дистанции'],
    rooms: [
      room('atrium', 'Атриум', 40, 40, 260, 150, 'spawn', 'Старт в центре ТЦ.'),
      room('shops', 'Магазины', 370, 40, 260, 150, 'objective', 'Много полок и укрытий.'),
      room('cinema', 'Кинотеатр', 700, 40, 260, 150, 'loot', 'Тёмные залы, припасы.'),
      CORRIDOR,
      room('stock', 'Склад', 40, 390, 260, 170, 'secret', 'Тайник за служебной дверью.'),
      room('foodcourt', 'Фудкорт', 370, 390, 260, 170, 'objective', 'Открытая зона, шумно.'),
      room('parking', 'Парковка', 700, 390, 260, 170, 'exit', 'Выход через подземный уровень.')
    ],
    links: [['atrium','corridor'],['shops','corridor'],['cinema','corridor'],['stock','corridor'],['foodcourt','corridor'],['parking','corridor']],
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
    about: 'Роскошный курорт с бассейном, СПА и банкетным залом. Новый Prime Asset Лилиия давит на открытых пространствах — держись ближе к номерам и служебным проходам.',
    hazards: ['Открытые бассейны и пляж', 'Скользкие полы', 'Позднее усиление охраны'],
    tips: ['Номера — лучшие укрытия', 'СПА даёт тайник, но один выход', 'Пляж не лучшее место для погони'],
    rooms: [
      room('lobby', 'Лобби', 40, 40, 260, 150, 'spawn', 'Старт, ресепшен.'),
      room('pool', 'Бассейн', 370, 40, 260, 150, 'objective', 'Открытая зона, мало укрытий.'),
      room('rooms', 'Номера', 700, 40, 260, 150, 'loot', 'Кровати, шкафы, припасы.'),
      CORRIDOR,
      room('spa', 'СПА', 40, 390, 260, 170, 'secret', 'Тайник с припасами.'),
      room('banquet', 'Банкетный зал', 370, 390, 260, 170, 'objective', 'Шумная цель, много мебели.'),
      room('beach', 'Пляж', 700, 390, 260, 170, 'exit', 'Выход по берегу.')
    ],
    links: [['lobby','corridor'],['pool','corridor'],['rooms','corridor'],['spa','corridor'],['banquet','corridor'],['beach','corridor']],
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
    about: 'Съёмочные павильоны, аппаратная и гримёрки. Декорации обманчивы: за фальшивыми стенами часто есть короткий проход.',
    hazards: ['Ложные стены и тупики', 'Яркий свет выдаёт движение', 'Узкая аппаратная'],
    tips: ['Проверяй декорации на проходимость', 'Аппаратная — ключевая цель', 'Не прячься за прозрачным стеклом'],
    rooms: [
      room('studio', 'Студия', 40, 40, 260, 150, 'spawn', 'Старт в павильоне.'),
      room('onair', 'Эфирная', 370, 40, 260, 150, 'objective', 'Главная аппаратура.'),
      room('makeup', 'Гримёрка', 700, 40, 260, 150, 'loot', 'Шкафы и припасы.'),
      CORRIDOR,
      room('control', 'Аппаратная', 40, 390, 260, 170, 'objective', 'Тесная комната, мало выходов.'),
      room('vents', 'Вентиляция', 370, 390, 260, 170, 'secret', 'Служебный лаз.'),
      room('service', 'Служебный выход', 700, 390, 260, 170, 'exit', 'Выход за кулисами.')
    ],
    links: [['studio','corridor'],['onair','corridor'],['makeup','corridor'],['control','corridor'],['vents','corridor'],['service','corridor']],
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
    about: 'Бараки, поля и карцер под присмотром Надзирателя. Открытые поля просматриваются, поэтому используй постройки как укрытия.',
    hazards: ['Открытые поля', 'Собачьи патрули', 'Карцер с одним выходом'],
    tips: ['Двигайся вдоль заборов', 'Столовая — источник еды и медикаментов', 'Не теряй из виду ворота'],
    rooms: [
      room('yard', 'Двор', 40, 40, 260, 150, 'spawn', 'Старт во дворе.'),
      room('barracks', 'Бараки', 370, 40, 260, 150, 'objective', 'Кровати и шкафчики.'),
      room('fields', 'Поля', 700, 40, 260, 150, 'objective', 'Открытая зона, плохо для погони.'),
      CORRIDOR,
      room('canteen', 'Столовая', 40, 390, 260, 170, 'loot', 'Припасы и укрытия.'),
      room('solitary', 'Карцер', 370, 390, 260, 170, 'secret', 'Тайник, один выход.'),
      room('gates', 'Ворота', 700, 390, 260, 170, 'exit', 'Выход с фермы.')
    ],
    links: [['yard','corridor'],['barracks','corridor'],['fields','corridor'],['canteen','corridor'],['solitary','corridor'],['gates','corridor']],
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
    about: 'Туториал и финальные сцены. Здесь меньше давления, но именно тут закладываются привычки: тишина, двери и маршруты.',
    hazards: ['Мало припасов', 'Скрипящие половицы', 'Закрытые комнаты'],
    tips: ['Изучи планировку без спешки', 'Запомни расположение шкафов', 'Не трать батарею без нужды'],
    rooms: [
      room('hall', 'Холл', 40, 40, 260, 150, 'spawn', 'Старт, парадный вход.'),
      room('office', 'Кабинет', 370, 40, 260, 150, 'objective', 'Документы Истермана.'),
      room('library', 'Библиотека', 700, 40, 260, 150, 'loot', 'Книги и тайники.'),
      CORRIDOR,
      room('cellar', 'Подвал', 40, 390, 260, 170, 'secret', 'Тёмный подвал.'),
      room('chapel', 'Часовня', 370, 390, 260, 170, 'objective', 'Финальная сцена.'),
      room('gate', 'Ворота', 700, 390, 260, 170, 'exit', 'Выход с территории.')
    ],
    links: [['hall','corridor'],['office','corridor'],['library','corridor'],['cellar','corridor'],['chapel','corridor'],['gate','corridor']],
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
    about: 'Узкие затопленные тоннели и насосные. Испытание на выносливость: мало места для манёвра, зато много слепых зон.',
    hazards: ['Затопленные отсеки', 'Один маршрут отхода', 'Возможны несколько Prime Assets'],
    tips: ['Не входи в воду без запаса стамины', 'Щитовая — ключевая точка', 'Слушай эхо шагов'],
    rooms: [
      room('tunnel', 'Тоннель', 40, 40, 260, 150, 'spawn', 'Старт в тоннеле.'),
      room('pumps', 'Насосная', 370, 40, 260, 150, 'objective', 'Механизмы и вода.'),
      room('flooded', 'Затопленный отсек', 700, 40, 260, 150, 'danger', 'Медленное движение.'),
      CORRIDOR,
      room('electrical', 'Щитовая', 40, 390, 260, 170, 'objective', 'Электричество и терминалы.'),
      room('cache', 'Тайник', 370, 390, 260, 170, 'secret', 'Редкие припасы.'),
      room('hatch', 'Люк', 700, 390, 260, 170, 'exit', 'Финальный выход наверх.')
    ],
    links: [['tunnel','corridor'],['pumps','corridor'],['flooded','corridor'],['electrical','corridor'],['cache','corridor'],['hatch','corridor']],
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
