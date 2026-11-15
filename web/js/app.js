/* Outlast Trials Companion — логика приложения */

(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const STORE_PREFIX = 'otc.';

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(STORE_PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value)); } catch (e) { /* storage full/disabled */ }
    },
    del(key) {
      try { localStorage.removeItem(STORE_PREFIX + key); } catch (e) { /* noop */ }
    }
  };

  const state = {
    view: 'reference',
    refTab: 'maps',
    search: '',
    mapId: store.get('lastMap', MAPS[0].id),
    trialId: store.get('lastTrial', MAPS[0].trials[0].id),
    checks: new Set(),
    tasks: [],
    visited: new Set(),
    zoom: 1,
    timer: { running: false, elapsed: 0, startTs: 0, recorded: false },
    finished: false
  };

  const TYPE_LABEL = {
    spawn: 'старт',
    objective: 'цель',
    loot: 'лут',
    secret: 'секрет',
    danger: 'опасно',
    exit: 'выход',
    corridor: 'проход'
  };

  const RARITY_CLASS = {
    'Обычная': 'gray',
    'Необычная': 'blue',
    'Редкая': 'purple',
    'Секрет': 'amber',
    'Особая': 'green',
    'Сюжетная': 'red'
  };

  const allTrials = () => MAPS.flatMap(m => m.trials.map(t => Object.assign({ mapId: m.id, mapName: m.name }, t)));

  function getMap(id) {
    return MAPS.find(m => m.id === id) || MAPS[0];
  }

  function getTrial(mapId, trialId) {
    const map = getMap(mapId);
    return map.trials.find(t => t.id === trialId) || map.trials[0];
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function threatBar(level) {
    let html = '<span class="threat" aria-label="Угроза ' + level + ' из 5">';
    for (let i = 1; i <= 5; i++) html += '<i class="' + (i <= level ? 'on' : '') + '"></i>';
    return html + '</span>';
  }

  function formatTime(totalSeconds) {
    if (!isFinite(totalSeconds) || totalSeconds < 0) totalSeconds = 0;
    const totalTenths = Math.floor(totalSeconds * 10);
    const m = Math.floor(totalTenths / 600);
    const s = Math.floor((totalTenths % 600) / 10);
    const d = totalTenths % 10;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + d;
  }

  function formatShort(totalSeconds) {
    const totalTenths = Math.floor(totalSeconds * 10);
    const m = Math.floor(totalTenths / 600);
    const s = Math.floor((totalTenths % 600) / 10);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  let toastTimer = null;
  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- views ---------------- */

  function setView(view, opts) {
    if (!['reference', 'timer', 'map'].includes(view)) view = 'reference';
    state.view = view;
    $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + view));
    $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
    if (!opts || !opts.silentHash) {
      const hash = '#' + view;
      if (location.hash !== hash) history.replaceState(null, '', hash);
    }
    if (view === 'map') renderMap();
    if (view === 'timer') updateTimerUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- reference ---------------- */

  function miniMap(map) {
    let html = '<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" aria-hidden="true">';
    const palette = {
      spawn: ['#10251a', '#2c6b45'],
      objective: ['#241313', '#6b3a3a'],
      loot: ['#201a0d', '#5c4a1c'],
      secret: ['#1a1124', '#4c2f66'],
      danger: ['#241710', '#71351f'],
      exit: ['#0e1e29', '#28506b'],
      corridor: ['#111117', '#2c2c36']
    };
    map.rooms.forEach(r => {
      const c = palette[r.type] || palette.corridor;
      html += '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="3" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2"/>';
    });
    map.rooms.forEach(r => {
      const fs = r.id === 'corridor' ? 12 : 20;
      if (r.id === 'corridor') return;
      html += '<text x="' + (r.x + 14) + '" y="' + (r.y + 30) + '" fill="#a9a49a" font-size="' + fs + '" font-family="Arial, sans-serif">' + escapeHtml(r.label) + '</text>';
    });
    html += '</svg>';
    return html;
  }

  function renderMaps() {
    return MAPS.map(map => {
      const trialTags = map.trials.map(t => '<span>' + escapeHtml(t.name) + '</span>').join('');
      return '' +
        '<article class="card">' +
          '<div class="thumb">' + miniMap(map) + '</div>' +
          '<div class="card-head">' +
            '<div class="card-title"><h3>' + escapeHtml(map.name) + '</h3><span>' + escapeHtml(map.en) + '</span></div>' +
            '<span class="badge red">' + escapeHtml(map.prime) + '</span>' +
          '</div>' +
          '<div class="tags">' +
            '<span class="badge">' + map.trials.length + ' испытаний</span>' +
            '<span class="badge amber">Угроза ' + map.threat + '/5</span>' +
            threatBar(map.threat) +
          '</div>' +
          '<p>' + escapeHtml(map.about) + '</p>' +
          '<details>' +
            '<summary>Испытания, опасности и советы</summary>' +
            '<div class="details-body">' +
              '<div class="trial-list">' + trialTags + '</div>' +
              '<ul class="card-list">' + map.hazards.map(h => '<li>' + escapeHtml(h) + '</li>').join('') + '</ul>' +
              '<ul class="card-list">' + map.tips.map(t => '<li>' + escapeHtml(t) + '</li>').join('') + '</ul>' +
              '<button class="ghost small" type="button" data-open-map="' + map.id + '">Открыть карту →</button>' +
            '</div>' +
          '</details>' +
        '</article>';
    }).join('');
  }

  function renderItems() {
    return ITEMS.map(item => {
      const badge = RARITY_CLASS[item.rarity] || 'gray';
      return '' +
        '<article class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><h3>' + escapeHtml(item.name) + '</h3><span>' + escapeHtml(item.en) + '</span></div>' +
            '<span class="badge ' + badge + '">' + escapeHtml(item.rarity) + '</span>' +
          '</div>' +
          '<div class="tags"><span class="badge">' + escapeHtml(item.cat) + '</span></div>' +
          '<p>' + escapeHtml(item.effect) + '</p>' +
          '<details><summary>Как использовать</summary><div class="details-body"><p>' + escapeHtml(item.tip) + '</p></div></details>' +
        '</article>';
    }).join('');
  }

  function renderEnemies() {
    return ENEMIES.map(enemy => {
      const badge = enemy.threat >= 5 ? 'red' : enemy.threat >= 4 ? 'amber' : 'gray';
      return '' +
        '<article class="card">' +
          '<div class="card-head">' +
            '<div class="card-title"><h3>' + escapeHtml(enemy.name) + '</h3><span>' + escapeHtml(enemy.en) + '</span></div>' +
            '<span class="badge ' + badge + '">' + escapeHtml(enemy.type) + '</span>' +
          '</div>' +
          '<div class="tags"><span class="badge gray">Угроза ' + enemy.threat + '/5</span>' + threatBar(enemy.threat) + '</div>' +
          '<dl>' +
            '<div class="stat-row"><dt>Карты</dt><dd>' + escapeHtml(enemy.maps) + '</dd></div>' +
            '<div class="stat-row"><dt>Атака</dt><dd>' + escapeHtml(enemy.attack) + '</dd></div>' +
            '<div class="stat-row"><dt>Контр</dt><dd>' + escapeHtml(enemy.counter) + '</dd></div>' +
          '</dl>' +
          '<details><summary>Заметка</summary><div class="details-body"><p>' + escapeHtml(enemy.note) + '</p></div></details>' +
        '</article>';
    }).join('');
  }

  function renderRigs() {
    return RIGS.map(rig => '' +
      '<article class="card">' +
        '<div class="card-head">' +
          '<div class="card-title"><h3>' + escapeHtml(rig.name) + '</h3><span>' + escapeHtml(rig.ru) + '</span></div>' +
          '<span class="badge blue">' + escapeHtml(rig.role) + '</span>' +
        '</div>' +
        '<p>' + escapeHtml(rig.text) + '</p>' +
        '<dl><div class="stat-row"><dt>Лучше для</dt><dd>' + escapeHtml(rig.best) + '</dd></div></dl>' +
      '</article>'
    ).join('');
  }

  function filterHits() {
    const q = state.search.trim().toLowerCase();
    if (!q) return null;
    const hit = obj => JSON.stringify(obj).toLowerCase().includes(q);
    if (state.refTab === 'maps') return MAPS.filter(hit);
    if (state.refTab === 'items') return ITEMS.filter(hit);
    if (state.refTab === 'enemies') return ENEMIES.filter(hit);
    return RIGS.filter(hit);
  }

  function renderReference() {
    const q = state.search.trim().toLowerCase();
    let html = '';
    let visible = 0;
    let total = 0;

    if (state.refTab === 'maps') {
      const list = q ? filterHits() : MAPS;
      total = MAPS.length;
      visible = list.length;
      html = list.length ? (q ? list.map(map => {
        const trialTags = map.trials.map(t => '<span>' + escapeHtml(t.name) + '</span>').join('');
        return '<article class="card">' +
          '<div class="thumb">' + miniMap(map) + '</div>' +
          '<div class="card-head"><div class="card-title"><h3>' + escapeHtml(map.name) + '</h3><span>' + escapeHtml(map.en) + '</span></div><span class="badge red">' + escapeHtml(map.prime) + '</span></div>' +
          '<p>' + escapeHtml(map.about) + '</p>' +
          '<div class="trial-list">' + trialTags + '</div>' +
          '<button class="ghost small" type="button" data-open-map="' + map.id + '">Открыть карту →</button>' +
          '</article>';
      }).join('') : renderMaps()) : '';
    } else if (state.refTab === 'items') {
      const list = q ? filterHits() : ITEMS;
      total = ITEMS.length;
      visible = list.length;
      html = list.length ? list.map(item => {
        const badge = RARITY_CLASS[item.rarity] || 'gray';
        return '<article class="card">' +
          '<div class="card-head"><div class="card-title"><h3>' + escapeHtml(item.name) + '</h3><span>' + escapeHtml(item.en) + '</span></div><span class="badge ' + badge + '">' + escapeHtml(item.rarity) + '</span></div>' +
          '<div class="tags"><span class="badge">' + escapeHtml(item.cat) + '</span></div>' +
          '<p>' + escapeHtml(item.effect) + '</p>' +
          '<details><summary>Как использовать</summary><div class="details-body"><p>' + escapeHtml(item.tip) + '</p></div></details>' +
          '</article>';
      }).join('') : '';
    } else if (state.refTab === 'enemies') {
      const list = q ? filterHits() : ENEMIES;
      total = ENEMIES.length;
      visible = list.length;
      html = list.length ? list.map(enemy => {
        const badge = enemy.threat >= 5 ? 'red' : enemy.threat >= 4 ? 'amber' : 'gray';
        return '<article class="card">' +
          '<div class="card-head"><div class="card-title"><h3>' + escapeHtml(enemy.name) + '</h3><span>' + escapeHtml(enemy.en) + '</span></div><span class="badge ' + badge + '">' + escapeHtml(enemy.type) + '</span></div>' +
          '<div class="tags"><span class="badge gray">Угроза ' + enemy.threat + '/5</span>' + threatBar(enemy.threat) + '</div>' +
          '<dl>' +
            '<div class="stat-row"><dt>Карты</dt><dd>' + escapeHtml(enemy.maps) + '</dd></div>' +
            '<div class="stat-row"><dt>Атака</dt><dd>' + escapeHtml(enemy.attack) + '</dd></div>' +
            '<div class="stat-row"><dt>Контр</dt><dd>' + escapeHtml(enemy.counter) + '</dd></div>' +
          '</dl>' +
          '<details><summary>Заметка</summary><div class="details-body"><p>' + escapeHtml(enemy.note) + '</p></div></details>' +
          '</article>';
      }).join('') : '';
    } else {
      const list = q ? filterHits() : RIGS;
      total = RIGS.length;
      visible = list.length;
      html = list.length ? list.map(rig => '<article class="card">' +
        '<div class="card-head"><div class="card-title"><h3>' + escapeHtml(rig.name) + '</h3><span>' + escapeHtml(rig.ru) + '</span></div><span class="badge blue">' + escapeHtml(rig.role) + '</span></div>' +
        '<p>' + escapeHtml(rig.text) + '</p>' +
        '<dl><div class="stat-row"><dt>Лучше для</dt><dd>' + escapeHtml(rig.best) + '</dd></div></dl>' +
        '</article>').join('') : '';
    }

    $('#refContent').innerHTML = html;
    $('#emptyState').hidden = visible !== 0;
    $('#resultCount').textContent = q ? (visible + ' из ' + total) : (total + ' записей');
  }

  function setRefTab(tab) {
    state.refTab = tab;
    $$('#refTabs button').forEach(b => b.classList.toggle('is-active', b.dataset.ref === tab));
    renderReference();
  }

  /* ---------------- timer ---------------- */

  function currentMap() { return getMap(state.mapId); }
  function currentTrial() { return getTrial(state.mapId, state.trialId); }

  function tasksFor(trial) {
    if (trial.tasks && trial.tasks.length) return trial.tasks;
    const kind = TRIAL_KINDS[trial.kind] || TRIAL_KINDS.investigate;
    return kind.tasks;
  }

  function timerKey() { return 'timer.' + state.trialId; }
  function checkKey() { return 'checks.' + state.trialId; }
  function bestKey() { return 'best.' + state.trialId; }
  function attemptsKey() { return 'attempts.' + state.trialId; }

  function loadTimer() {
    const saved = store.get(timerKey(), null);
    if (saved && typeof saved.elapsed === 'number') {
      state.timer = {
        running: !!saved.running,
        elapsed: saved.elapsed,
        startTs: saved.running ? Date.now() : 0,
        recorded: !!saved.recorded
      };
      if (saved.running && saved.savedAt) {
        state.timer.elapsed += Math.max(0, (Date.now() - saved.savedAt) / 1000);
      }
      if (state.timer.running) {
        state.timer.startTs = Date.now() - state.timer.elapsed * 1000;
      }
    } else {
      state.timer = { running: false, elapsed: 0, startTs: 0, recorded: false };
    }
    state.finished = state.timer.recorded;
  }

  function saveTimer() {
    if (state.timer.running) refreshElapsed();
    store.set(timerKey(), {
      running: state.timer.running,
      elapsed: state.timer.elapsed,
      recorded: state.timer.recorded,
      savedAt: Date.now()
    });
  }

  function refreshElapsed() {
    if (state.timer.running && state.timer.startTs) {
      state.timer.elapsed = (Date.now() - state.timer.startTs) / 1000;
    }
    return state.timer.elapsed;
  }

  function populateSelectors() {
    const mapSel = $('#mapSelect');
    mapSel.innerHTML = MAPS.map(m => '<option value="' + m.id + '">' + escapeHtml(m.name) + ' — ' + escapeHtml(m.en) + '</option>').join('');
    mapSel.value = state.mapId;

    const map = currentMap();
    if (!map.trials.some(t => t.id === state.trialId)) state.trialId = map.trials[0].id;
    const trialSel = $('#trialSelect');
    trialSel.innerHTML = map.trials.map(t => '<option value="' + t.id + '">' + escapeHtml(t.name) + ' — ' + escapeHtml(t.ru) + '</option>').join('');
    trialSel.value = state.trialId;
  }

  function updateTimerUI() {
    const trial = currentTrial();
    const kind = TRIAL_KINDS[trial.kind] || TRIAL_KINDS.investigate;
    $('#trialKind').textContent = kind.label;
    $('#trialTarget').textContent = 'Цель: ' + trial.min + ' мин';

    const elapsed = refreshElapsed();
    const parts = formatTime(elapsed).split('.');
    $('#timerMain').textContent = parts[0];
    $('#timerMs').textContent = '.' + parts[1];

    const display = $('#timerDisplay');
    display.classList.toggle('is-running', state.timer.running);
    display.classList.toggle('is-done', state.finished);

    const startBtn = $('#startBtn');
    startBtn.textContent = state.timer.running ? 'Пауза' : (elapsed > 0 ? 'Продолжить' : 'Старт');

    const statePill = $('#timerState');
    statePill.classList.remove('running', 'done');
    if (state.finished || (state.tasks.length && state.checks.size === state.tasks.length)) {
      statePill.textContent = 'ВЫХОД ОТКРЫТ';
      statePill.classList.add('done');
    } else if (state.timer.running) {
      statePill.textContent = 'В РАБЕГЕ';
      statePill.classList.add('running');
    } else if (elapsed > 0) {
      statePill.textContent = 'ПАУЗА';
    } else {
      statePill.textContent = 'ГОТОВ';
    }

    $('#doneCount').textContent = state.checks.size + '/' + state.tasks.length;
    const best = store.get(bestKey(), null);
    $('#bestTime').textContent = best ? formatTime(best) : '—';
    $('#attempts').textContent = store.get(attemptsKey(), 0);

    const pct = state.tasks.length ? Math.round(state.checks.size / state.tasks.length * 100) : 0;
    $('#checkProgress').style.width = pct + '%';
    $('#timerWarning').classList.toggle('show', state.tasks.length > 0 && state.checks.size === state.tasks.length);
  }

  function renderChecklist() {
    const list = $('#checklist');
    list.innerHTML = state.tasks.map((task, i) =>
      '<li>' +
        '<button class="check-item' + (state.checks.has(i) ? ' is-done' : '') + '" type="button" data-check="' + i + '" aria-pressed="' + state.checks.has(i) + '">' +
          '<span class="checkbox"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round"><path d="M4 12.5 9 17l11-11"/></svg></span>' +
          '<span class="check-label">' + escapeHtml(task) + '</span>' +
          '<span class="check-index">' + String(i + 1).padStart(2, '0') + '</span>' +
        '</button>' +
      '</li>'
    ).join('');
    updateTimerUI();
  }

  function loadTrial() {
    const trial = currentTrial();
    state.tasks = tasksFor(trial);
    const saved = store.get(checkKey(), []);
    state.checks = new Set(Array.isArray(saved) ? saved.filter(n => Number.isInteger(n) && n >= 0 && n < state.tasks.length) : []);
    store.set('lastMap', state.mapId);
    store.set('lastTrial', state.trialId);
    loadTimer();
    renderChecklist();
  }

  function toggleCheck(index) {
    if (state.checks.has(index)) state.checks.delete(index);
    else state.checks.add(index);
    store.set(checkKey(), Array.from(state.checks).sort((a, b) => a - b));
    const btn = $('.check-item[data-check="' + index + '"]');
    if (btn) {
      const done = state.checks.has(index);
      btn.classList.toggle('is-done', done);
      btn.setAttribute('aria-pressed', String(done));
    }
    updateTimerUI();
    maybeFinish();
  }

  function maybeFinish() {
    if (!state.tasks.length || state.checks.size !== state.tasks.length) return;
    if (state.finished || state.timer.recorded) return;
    if (state.timer.elapsed < 1) return;
    pauseTimer();
    state.finished = true;
    state.timer.recorded = true;
    const elapsed = state.timer.elapsed;
    const best = store.get(bestKey(), null);
    if (!best || elapsed < best) {
      store.set(bestKey(), elapsed);
      toast('Новый рекорд: ' + formatTime(elapsed));
    } else {
      toast('Забег завершён: ' + formatTime(elapsed));
    }
    store.set(attemptsKey(), (store.get(attemptsKey(), 0) || 0) + 1);
    saveTimer();
    updateTimerUI();
  }

  function startTimer() {
    if (state.timer.running) return;
    if (state.finished) {
      state.finished = false;
      state.timer.recorded = false;
      state.timer.elapsed = 0;
    }
    state.timer.running = true;
    state.timer.startTs = Date.now() - state.timer.elapsed * 1000;
    saveTimer();
    updateTimerUI();
  }

  function pauseTimer() {
    if (!state.timer.running) return;
    state.timer.elapsed = (Date.now() - state.timer.startTs) / 1000;
    state.timer.running = false;
    state.timer.startTs = 0;
    saveTimer();
    updateTimerUI();
  }

  function toggleTimer() {
    if (state.timer.running) pauseTimer();
    else startTimer();
  }

  function resetTimer() {
    state.timer = { running: false, elapsed: 0, startTs: 0, recorded: false };
    state.finished = false;
    store.set(timerKey(), { running: false, elapsed: 0, recorded: false, savedAt: Date.now() });
    updateTimerUI();
  }

  function resetChecks() {
    state.checks.clear();
    store.del(checkKey());
    renderChecklist();
    toast('Чеклист очищен');
  }

  function toggleAllChecks() {
    if (state.checks.size === state.tasks.length) {
      state.checks.clear();
    } else {
      state.tasks.forEach((_, i) => state.checks.add(i));
    }
    store.set(checkKey(), Array.from(state.checks).sort((a, b) => a - b));
    renderChecklist();
    maybeFinish();
  }

  /* ---------------- map ---------------- */

  function visitedKey() { return 'map.' + state.mapId; }

  function loadVisited() {
    const saved = store.get(visitedKey(), []);
    state.visited = new Set(Array.isArray(saved) ? saved : []);
  }

  function saveVisited() {
    store.set(visitedKey(), Array.from(state.visited));
  }

  function wrapNote(text, max) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
      if ((line + ' ' + word).trim().length > max && line) {
        lines.push(line);
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    });
    if (line) lines.push(line);
    return lines.slice(0, 2);
  }

  function renderMapChips() {
    $('#mapChips').innerHTML = MAPS.map(m =>
      '<button type="button" class="chip' + (m.id === state.mapId ? ' is-active' : '') + '" data-map="' + m.id + '">' +
        escapeHtml(m.name) + '<span class="chip-threat">' + m.threat + '/5</span>' +
      '</button>'
    ).join('');
  }

  function renderSvgMap(map) {
    const center = r => [r.x + r.w / 2, r.y + r.h / 2];
    let html = '';
    (map.links || []).forEach(link => {
      const a = map.rooms.find(r => r.id === link[0]);
      const b = map.rooms.find(r => r.id === link[1]);
      if (!a || !b) return;
      const ca = center(a);
      const cb = center(b);
      const active = state.visited.has(a.id) && state.visited.has(b.id);
      html += '<line class="map-link' + (active ? ' is-visited' : '') + '" x1="' + ca[0] + '" y1="' + ca[1] + '" x2="' + cb[0] + '" y2="' + cb[1] + '"/>';
    });
    map.rooms.forEach(r => {
      const visited = state.visited.has(r.id);
      const noteLines = r.note && r.id !== 'corridor' ? wrapNote(r.note, 30) : [];
      html += '<g class="map-room' + (visited ? ' is-visited' : '') + '" data-room="' + r.id + '" data-type="' + r.type + '" tabindex="0" role="button" aria-label="' + escapeHtml(r.label + ' — ' + r.note) + '" aria-pressed="' + visited + '">' +
        '<title>' + escapeHtml(r.label + ' — ' + (TYPE_LABEL[r.type] || r.type) + '. ' + (r.note || '')) + '</title>' +
        '<rect x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="2"/>' +
        '<text x="' + (r.x + 14) + '" y="' + (r.y + 28) + '">' + escapeHtml(r.label) + '</text>';
      noteLines.forEach((line, i) => {
        html += '<text class="room-note" x="' + (r.x + 14) + '" y="' + (r.y + 48 + i * 14) + '">' + escapeHtml(line) + '</text>';
      });
      html += '<text class="room-type-label" x="' + (r.x + 14) + '" y="' + (r.y + r.h - 12) + '">' + (TYPE_LABEL[r.type] || r.type) + '</text>';
      if (visited) {
        html += '<text class="room-check" x="' + (r.x + r.w - 26) + '" y="' + (r.y + 28) + '">✓</text>';
      }
      html += '</g>';
    });
    return html;
  }

  function renderMapSidebar(map) {
    const total = map.rooms.filter(r => r.id !== 'corridor').length;
    const done = map.rooms.filter(r => r.id !== 'corridor' && state.visited.has(r.id)).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    $('#mapPercent').textContent = pct + '%';
    $('#mapCount').textContent = done + ' / ' + total + ' зон';
    $('#mapProgress').style.width = pct + '%';
    $('#mapAbout').textContent = map.about;
    $('#mapTips').innerHTML = map.tips.map(t => '<li>' + escapeHtml(t) + '</li>').join('');
    $('#mapRooms').innerHTML = map.rooms.map(r =>
      '<button type="button" class="room-item' + (state.visited.has(r.id) ? ' is-visited' : '') + '" data-room="' + r.id + '" data-type="' + r.type + '" title="' + escapeHtml(r.note || '') + '">' +
        '<span class="dot"></span>' +
        '<span class="room-name">' + escapeHtml(r.label) + '</span>' +
        '<span class="room-type">' + (TYPE_LABEL[r.type] || r.type) + '</span>' +
      '</button>'
    ).join('');
  }

  function renderMap() {
    const map = currentMap();
    renderMapChips();
    $('#mapTitle').textContent = map.name;
    $('#mapSubtitle').textContent = map.en + ' · ' + map.trials.length + ' испытаний · Prime Asset: ' + map.prime;
    const svg = $('#mapSvg');
    svg.innerHTML = renderSvgMap(map);
    svg.style.width = (state.zoom * 100) + '%';
    $('#zoomReset').textContent = Math.round(state.zoom * 100) + '%';
    renderMapSidebar(map);
    $('#mapLegend').innerHTML = ['spawn', 'objective', 'loot', 'secret', 'danger', 'exit', 'corridor']
      .map(type => '<span><i class="' + type + '"></i>' + (TYPE_LABEL[type] || type) + '</span>').join('') +
      '<span><i class="visited"></i>пройдено</span>';
  }

  function toggleRoom(id) {
    if (state.visited.has(id)) state.visited.delete(id);
    else state.visited.add(id);
    saveVisited();
    const map = currentMap();
    const roomEl = $('#mapSvg .map-room[data-room="' + id + '"]');
    if (roomEl) {
      const done = state.visited.has(id);
      roomEl.classList.toggle('is-visited', done);
      roomEl.setAttribute('aria-pressed', String(done));
      const check = roomEl.querySelector('.room-check');
      if (done && !check) {
        const rect = roomEl.querySelector('rect');
        const x = Number(rect.getAttribute('x')) + Number(rect.getAttribute('width')) - 26;
        const y = Number(rect.getAttribute('y')) + 28;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('class', 'room-check');
        text.setAttribute('x', x);
        text.setAttribute('y', y);
        text.textContent = '✓';
        roomEl.appendChild(text);
      } else if (!done && check) {
        check.remove();
      }
    }
    renderMapSidebar(map);
  }

  function switchMap(id) {
    if (state.mapId === id) return;
    state.mapId = id;
    store.set('lastMap', id);
    const map = getMap(id);
    state.trialId = map.trials[0].id;
    store.set('lastTrial', state.trialId);
    loadVisited();
    populateSelectors();
    loadTrial();
    renderMap();
  }

  /* ---------------- events ---------------- */

  function bind() {
    $$('.tab').forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));

    window.addEventListener('hashchange', () => setView(location.hash.replace('#', ''), { silentHash: true }));

    $$('#refTabs button').forEach(btn => btn.addEventListener('click', () => setRefTab(btn.dataset.ref)));

    $('#searchInput').addEventListener('input', e => {
      state.search = e.target.value;
      renderReference();
    });

    $('#refContent').addEventListener('click', e => {
      const btn = e.target.closest('[data-open-map]');
      if (!btn) return;
      const id = btn.dataset.openMap;
      state.mapId = id;
      state.trialId = getMap(id).trials[0].id;
      store.set('lastMap', state.mapId);
      store.set('lastTrial', state.trialId);
      loadVisited();
      populateSelectors();
      loadTrial();
      setView('map');
    });

    $('#mapSelect').addEventListener('change', e => {
      saveTimer();
      state.mapId = e.target.value;
      store.set('lastMap', state.mapId);
      const map = currentMap();
      state.trialId = map.trials[0].id;
      store.set('lastTrial', state.trialId);
      populateSelectors();
      loadTrial();
      loadVisited();
    });

    $('#trialSelect').addEventListener('change', e => {
      saveTimer();
      state.trialId = e.target.value;
      store.set('lastTrial', state.trialId);
      loadTrial();
    });

    $('#startBtn').addEventListener('click', toggleTimer);
    $('#resetTimer').addEventListener('click', resetTimer);
    $('#checkAll').addEventListener('click', toggleAllChecks);

    $('#checklist').addEventListener('click', e => {
      const btn = e.target.closest('[data-check]');
      if (btn) toggleCheck(Number(btn.dataset.check));
    });

    $('#mapChips').addEventListener('click', e => {
      const chip = e.target.closest('[data-map]');
      if (chip) switchMap(chip.dataset.map);
    });

    $('#mapSvg').addEventListener('click', e => {
      const room = e.target.closest('.map-room');
      if (room) toggleRoom(room.dataset.room);
    });
    $('#mapSvg').addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const room = e.target.closest('.map-room');
      if (room) { e.preventDefault(); toggleRoom(room.dataset.room); }
    });

    $('#mapRooms').addEventListener('click', e => {
      const item = e.target.closest('[data-room]');
      if (item) toggleRoom(item.dataset.room);
    });

    $('#mapReset').addEventListener('click', () => {
      state.visited.clear();
      store.del(visitedKey());
      renderMap();
      toast('Отметки карты сброшены');
    });

    $('#zoomIn').addEventListener('click', () => {
      state.zoom = Math.min(2, state.zoom + 0.25);
      renderMap();
    });
    $('#zoomOut').addEventListener('click', () => {
      state.zoom = Math.max(0.75, state.zoom - 0.25);
      renderMap();
    });
    $('#zoomReset').addEventListener('click', () => {
      state.zoom = 1;
      renderMap();
    });

    document.addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
      if (e.code === 'Space' && state.view === 'timer') {
        e.preventDefault();
        toggleTimer();
      }
    });

    let installPrompt = null;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      installPrompt = e;
      $('#installBtn').hidden = false;
    });
    $('#installBtn').addEventListener('click', async () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      $('#installBtn').hidden = true;
    });
  }

  function boot() {
    if (window.__OTC_BOOTED__) return;
    window.__OTC_BOOTED__ = true;
    $('#countMaps').textContent = MAPS.length;
    $('#countItems').textContent = ITEMS.length;
    $('#countEnemies').textContent = ENEMIES.length;
    $('#countRigs').textContent = RIGS.length;
    $('#year').textContent = new Date().getFullYear();

    const trialCount = MAPS.reduce((sum, m) => sum + m.trials.length, 0);
    $('#heroStats').innerHTML =
      '<div><b>' + MAPS.length + '</b><span>локаций</span></div>' +
      '<div><b>' + trialCount + '</b><span>испытаний</span></div>' +
      '<div><b>' + ITEMS.length + '</b><span>предметов</span></div>' +
      '<div><b>' + ENEMIES.length + '</b><span>врагов</span></div>';

    if (!MAPS.some(m => m.id === state.mapId)) state.mapId = MAPS[0].id;
    if (!getMap(state.mapId).trials.some(t => t.id === state.trialId)) state.trialId = getMap(state.mapId).trials[0].id;

    bind();
    renderReference();
    populateSelectors();
    loadVisited();
    loadTrial();
    renderMap();

    const hash = location.hash.replace('#', '');
    setView(['reference', 'timer', 'map'].includes(hash) ? hash : 'reference', { silentHash: true });

    setInterval(() => {
      if (state.view !== 'timer') return;
      if (state.timer.running) {
        updateTimerUI();
        if (state.checks.size === state.tasks.length && state.tasks.length) maybeFinish();
      }
    }, 100);

    setInterval(() => {
      if (state.view === 'timer' && state.timer.running) saveTimer();
    }, 1000);

    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => { /* offline mode unavailable */ });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
