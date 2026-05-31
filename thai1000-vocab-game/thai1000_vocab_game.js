const OPTION_COUNT = 8;
const TARGET_STREAK = 2;
const AUDIO_MANIFEST_URL = "thai1000_vocab_audio/manifest.json";
const AUDIO_CACHE_NAME = "thai1000-cleared-vocab-audio-v1";
const SELECTION_STORAGE_KEY = "thai1000_cleared_vocab_study_selection_v1";

const STUDY_ITEMS = LESSONS.flatMap((lesson) =>
  lesson.vocabulary.map((item, index) => ({
    ...item,
    id: `L${lesson.lesson}-${String(index + 1).padStart(3, "0")}`,
    audioId: `L${lesson.lesson}-${String(index + 1).padStart(3, "0")}`,
    index,
    lesson: lesson.lesson,
    lessonTitle: lesson.title
  }))
);
const ITEM_BY_ID = new Map(STUDY_ITEMS.map((item) => [item.id, item]));

const state = {
  view: "lesson",
  lesson: LESSONS[0]?.lesson || 1,
  query: "",
  studySet: "all",
  studyMode: "audio-en",
  selectedStudyIds: new Set(),
  audioVariant: "normal",
  audioMap: new Map(),
  currentAudio: null,
  audioElement: null,
  playbackToken: 0,
  game: null
};

const els = {
  layout: document.querySelector(".layout"),
  lessonSelect: document.querySelector("#lessonSelect"),
  sideNav: document.querySelector("#sideNav"),
  summary: document.querySelector("#summary"),
  viewTitle: document.querySelector("#viewTitle"),
  viewCount: document.querySelector("#viewCount"),
  content: document.querySelector("#content"),
  searchInput: document.querySelector("#searchInput"),
  topActions: document.querySelector("#topActions"),
  tabs: document.querySelectorAll(".tab"),
  audioVariant: document.querySelector("#audioVariant"),
  preloadAudio: document.querySelector("#preloadAudio"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus")
};

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function normalizeRoman(value) {
  return String(value || "")
    .normalize("NFD")
    .toLowerCase()
    .replace(/[ɛε]/g, "ε")
    .replace(/[əә]/g, "ә")
    .replace(/[.!?,;:]+/g, "")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

function cleanThai(text) {
  return String(text || "")
    .replace(/[/:]/g, " ")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSpeechText(item) {
  return cleanThai(item.speak || item.thai);
}

function lessonByNumber(number) {
  return LESSONS.find((lesson) => lesson.lesson === number) || LESSONS[0];
}

function findItem(id) {
  return ITEM_BY_ID.get(id);
}

function queryMatches(item) {
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  return [item.thai, item.roman, item.english, item.pos, `L${item.lesson}`, item.lessonTitle]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function uniqueItems() {
  const map = new Map();
  STUDY_ITEMS.forEach((item) => {
    const key = normalizeRoman(item.roman);
    if (!map.has(key)) {
      map.set(key, {
        thai: item.thai,
        roman: item.roman,
        english: item.english,
        pos: item.pos,
        lessons: [],
        meanings: []
      });
    }
    const current = map.get(key);
    if (!current.lessons.includes(item.lesson)) current.lessons.push(item.lesson);
    if (!current.meanings.includes(item.english)) current.meanings.push(item.english);
    if (current.pos === "Other" && item.pos !== "Other") current.pos = item.pos;
  });
  return Array.from(map.values()).map((item) => ({
    ...item,
    lessons: item.lessons.sort((a, b) => a - b),
    english: item.meanings.join(" / ")
  }));
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
}

function setPreloadButton(label, disabled = false) {
  els.preloadAudio.textContent = label;
  els.preloadAudio.disabled = disabled;
}

function renderSummary() {
  clear(els.summary);
  const total = STUDY_ITEMS.length;
  const unique = uniqueItems().length;
  const selected = state.selectedStudyIds.size;
  [`${total} lesson items`, `${unique} unique POS items`, `${selected} selected for study`].forEach((label) => {
    els.summary.appendChild(make("span", "pill", label));
  });
}

function renderNav() {
  clear(els.lessonSelect);
  clear(els.sideNav);
  LESSONS.forEach((lesson) => {
    const option = document.createElement("option");
    option.value = String(lesson.lesson);
    option.textContent = `Lesson ${lesson.lesson}`;
    els.lessonSelect.appendChild(option);

    const button = make("button", "nav-button", `Lesson ${lesson.lesson}`);
    button.type = "button";
    button.dataset.lesson = String(lesson.lesson);
    if (lesson.lesson === state.lesson) button.classList.add("is-active");
    els.sideNav.appendChild(button);
  });
}

function renderTable(items, columns) {
  if (!items.length) return make("div", "empty", "No matching vocabulary.");

  const wrap = make("div", "table-wrap");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const head = document.createElement("tr");
  columns.forEach((column) => head.appendChild(make("th", "", column.label)));
  thead.appendChild(head);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  items.forEach((item) => {
    const row = document.createElement("tr");
    columns.forEach((column) => {
      const td = make("td", column.className || "");
      if (column.render) column.render(td, item);
      else td.textContent = item[column.key] || "";
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  return wrap;
}

function renderLessonView() {
  const lesson = lessonByNumber(state.lesson);
  const items = STUDY_ITEMS.filter((item) => item.lesson === lesson.lesson && queryMatches(item));
  els.viewTitle.textContent = `Lesson ${lesson.lesson}: ${lesson.title}`;
  els.viewCount.textContent = `${items.length} shown / ${lesson.vocabulary.length} items`;
  clear(els.content);
  els.content.appendChild(renderTable(items, [
    { label: "Thai", key: "thai", className: "thai" },
    { label: "Romanization", key: "roman", className: "roman" },
    { label: "English", key: "english" },
    { label: "Part of Speech", key: "pos", className: "pos" }
  ]));
}

function renderPosView() {
  const hasQuery = Boolean(state.query.trim());
  const groups = POS_GROUPS.map((pos) => ({
    pos,
    items: uniqueItems().filter((item) => item.pos === pos && queryMatches({
      ...item,
      lessonTitle: item.lessons.map((lesson) => `L${lesson}`).join(" "),
      lesson: item.lessons.join(" ")
    }))
  })).filter((group) => !hasQuery || group.items.length);

  const count = groups.reduce((sum, group) => sum + group.items.length, 0);
  els.viewTitle.textContent = "By Part of Speech";
  els.viewCount.textContent = `${count} unique items`;
  clear(els.content);
  if (!groups.length) {
    els.content.appendChild(make("div", "empty", "No matching vocabulary."));
    return;
  }

  const list = make("div", "group-list");
  groups.forEach((group) => {
    const card = make("section", "pos-group");
    const head = make("div", "pos-group-head");
    head.appendChild(make("h3", "", group.pos));
    head.appendChild(make("span", "pill", `${group.items.length} items`));
    card.appendChild(head);

    const body = make("div", "pos-group-body");
    const table = renderTable(group.items, [
      { label: "Thai", key: "thai", className: "thai" },
      { label: "Romanization", key: "roman", className: "roman" },
      { label: "English", key: "english" },
      {
        label: "Lessons",
        render(td, item) {
          const badges = make("div", "lesson-badges");
          item.lessons.forEach((lesson) => badges.appendChild(make("span", "badge", `L${lesson}`)));
          td.appendChild(badges);
        }
      }
    ]);
    table.classList.add("pos-table-wrap");
    body.appendChild(table);
    card.appendChild(body);
    list.appendChild(card);
  });
  els.content.appendChild(list);
}

function filteredStudyItems() {
  return STUDY_ITEMS.filter((item) => (
    studySetMatches(item) &&
    queryMatches(item)
  ));
}

function studySetMatches(item) {
  if (state.studySet === "all") return true;
  const separator = state.studySet.indexOf(":");
  if (separator === -1) return true;

  const type = state.studySet.slice(0, separator);
  const value = state.studySet.slice(separator + 1);
  if (type === "lesson") return String(item.lesson) === value;
  if (type === "pos") return item.pos === value;
  return true;
}

function appendStudySetOptions(select) {
  select.appendChild(new Option(`All words (${STUDY_ITEMS.length})`, "all"));

  const lessonGroup = document.createElement("optgroup");
  lessonGroup.label = "Lessons";
  LESSONS.forEach((lesson) => {
    lessonGroup.appendChild(new Option(
      `Lesson ${lesson.lesson} (${lesson.vocabulary.length})`,
      `lesson:${lesson.lesson}`
    ));
  });
  select.appendChild(lessonGroup);

  const posGroup = document.createElement("optgroup");
  posGroup.label = "Parts of Speech";
  POS_GROUPS.forEach((pos) => {
    const count = STUDY_ITEMS.filter((item) => item.pos === pos).length;
    if (count) posGroup.appendChild(new Option(`${pos} (${count})`, `pos:${pos}`));
  });
  select.appendChild(posGroup);
}

function selectedStudyItems() {
  return STUDY_ITEMS.filter((item) => state.selectedStudyIds.has(item.id));
}

function saveSelection() {
  try {
    localStorage.setItem(SELECTION_STORAGE_KEY, JSON.stringify(Array.from(state.selectedStudyIds)));
  } catch {
    // Local storage is optional.
  }
}

function loadSelection() {
  try {
    const saved = JSON.parse(localStorage.getItem(SELECTION_STORAGE_KEY) || "[]");
    const valid = saved.filter((id) => ITEM_BY_ID.has(id));
    state.selectedStudyIds = new Set(valid.length ? valid : STUDY_ITEMS.map((item) => item.id));
  } catch {
    state.selectedStudyIds = new Set(STUDY_ITEMS.map((item) => item.id));
  }
}

function renderStudySetup() {
  const visibleItems = filteredStudyItems();
  const selectedCount = state.selectedStudyIds.size;
  els.viewTitle.textContent = "背单词";
  els.viewCount.textContent = `${selectedCount} selected`;
  clear(els.content);

  const shell = make("section", "study-shell");
  const controls = make("div", "study-controls");
  const setField = make("div", "toolbar-field");
  const label = make("label", "", "Study Set");
  label.setAttribute("for", "studySetFilter");
  const select = document.createElement("select");
  select.id = "studySetFilter";
  select.dataset.studySetFilter = "";
  appendStudySetOptions(select);
  select.value = state.studySet;
  setField.append(label, select);

  const actions = make("div", "selection-actions");
  actions.appendChild(make("span", "pill", `${selectedCount} selected`));
  [
    ["select-visible", "选择可见"],
    ["select-all", "全选"],
    ["clear-all", "清空"]
  ].forEach(([action, text]) => {
    const button = make("button", "utility-button", text);
    button.type = "button";
    button.dataset.studyAction = action;
    actions.appendChild(button);
  });
  controls.append(setField, actions);
  shell.appendChild(controls);

  const modeTabs = make("div", "mode-tabs");
  modeTabs.setAttribute("role", "tablist");
  [
    ["audio-en", "听泰语选英文"],
    ["en-th", "看英文选泰语"]
  ].forEach(([mode, text]) => {
    const button = make("button", state.studyMode === mode ? "is-active" : "", text);
    button.type = "button";
    button.dataset.mode = mode;
    modeTabs.appendChild(button);
  });
  shell.appendChild(modeTabs);

  if (!visibleItems.length) {
    shell.appendChild(make("div", "empty", "No matching vocabulary."));
  } else {
    const list = make("div", "word-list");
    visibleItems.forEach((item) => {
      const card = make("label", "word-select-card");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.studyWord = item.id;
      input.checked = state.selectedStudyIds.has(item.id);

      const body = make("span", "");
      body.appendChild(make("strong", "", item.thai));
      body.appendChild(make("small", "", item.roman));
      body.appendChild(make("small", "", item.english));
      body.appendChild(make("em", "", `L${item.lesson} · ${item.pos}`));
      card.append(input, body);
      list.appendChild(card);
    });
    shell.appendChild(list);
  }

  const start = make("button", "start-button", selectedCount < 2 ? "至少选择 2 个" : "开始背词");
  start.type = "button";
  start.dataset.startGame = "";
  start.disabled = selectedCount < 2;
  shell.appendChild(start);
  els.content.appendChild(shell);
}

function masteryCount(game = state.game) {
  if (!game) return 0;
  let count = 0;
  game.mastery.forEach((entry) => {
    if (entry.mastered) count += 1;
  });
  return count;
}

function currentModeLabel(game = state.game) {
  return game?.mode === "audio-en" ? "听泰语，选英文" : "看英文，选泰语";
}

function renderPrompt(prompt, game) {
  if (game.mode === "audio-en") {
    const speaker = make("button", "speaker-button");
    speaker.type = "button";
    speaker.dataset.playCurrent = "";
    speaker.setAttribute("aria-label", "Play Thai word");
    speaker.title = "Play Thai word";
    prompt.appendChild(speaker);
    if (game.answered) {
      prompt.appendChild(make("div", "prompt-meta", `${game.current.thai} · ${game.current.roman}`));
    }
    return;
  }

  prompt.appendChild(make("div", "english-prompt", game.current.english));
  if (game.answered) {
    prompt.appendChild(make("div", "prompt-meta", `${game.current.thai} · ${game.current.roman}`));
  }
}

function renderOptionButton(item, game) {
  const button = make("button", "option-button");
  button.type = "button";
  button.dataset.answerId = item.id;
  button.disabled = Boolean(game.answered);
  if (game.answered) {
    if (item.id === game.current.id) button.classList.add("is-correct");
    if (item.id === game.answered.answerId && !game.answered.correct) button.classList.add("is-wrong");
  }

  if (game.mode === "audio-en") {
    button.textContent = item.english;
  } else {
    button.appendChild(make("span", "", item.thai));
    button.appendChild(make("small", "", item.roman));
  }
  return button;
}

function renderStudyGame() {
  const game = state.game;
  els.viewTitle.textContent = "背单词";
  els.viewCount.textContent = `${masteryCount(game)} / ${game.selectedIds.length} mastered`;
  clear(els.content);

  const shell = make("section", "study-shell");
  const progress = make("div", "progress-line");
  progress.appendChild(make("span", "", currentModeLabel(game)));
  progress.appendChild(make("span", "", `${masteryCount(game)} mastered · ${game.queue.length} queued`));
  shell.appendChild(progress);

  const prompt = make("div", "prompt-card");
  renderPrompt(prompt, game);
  shell.appendChild(prompt);

  const feedbackClass = game.answered ? (game.answered.correct ? "feedback is-correct" : "feedback is-wrong") : "feedback";
  const feedback = make("div", feedbackClass);
  feedback.setAttribute("aria-live", "polite");
  if (!game.answered) {
    feedback.textContent = "Choose an answer";
  } else if (game.answered.correct) {
    feedback.textContent = `Correct: ${game.current.thai} = ${game.current.english}`;
  } else {
    const chosen = findItem(game.answered.answerId);
    feedback.textContent = `Wrong: ${game.current.thai} = ${game.current.english}${chosen ? ` · 选了 ${chosen.thai}` : ""}`;
  }
  shell.appendChild(feedback);

  const options = make("div", "options-grid");
  game.currentOptions.forEach((item) => options.appendChild(renderOptionButton(item, game)));
  shell.appendChild(options);

  const actions = make("div", "game-actions");
  const restart = make("button", "utility-button", "重新选择词表");
  restart.type = "button";
  restart.dataset.showSetup = "";
  actions.appendChild(restart);
  if (game.answered) {
    const next = make("button", "next-button", "下一题");
    next.type = "button";
    next.dataset.nextQuestion = "";
    actions.appendChild(next);
  }
  shell.appendChild(actions);
  els.content.appendChild(shell);
}

function renderStudyResult() {
  const game = state.game;
  els.viewTitle.textContent = "本轮结果";
  els.viewCount.textContent = `${game.selectedIds.length} mastered`;
  clear(els.content);

  const shell = make("section", "study-shell");
  const accuracy = game.stats.total ? Math.round((game.stats.correct / game.stats.total) * 100) : 0;
  const stats = make("div", "result-stats");
  [
    ["掌握", game.selectedIds.length],
    ["答题", game.stats.total],
    ["错题", game.stats.wrong],
    ["正确率", `${accuracy}%`]
  ].forEach(([label, value]) => {
    const cell = make("div", "");
    cell.appendChild(make("span", "", label));
    cell.appendChild(make("strong", "", String(value)));
    stats.appendChild(cell);
  });
  shell.appendChild(stats);

  const mistakes = make("div", "mistake-list");
  if (!game.stats.mistakes.length) {
    mistakes.appendChild(make("p", "empty-result", "本轮没有错题。"));
  } else {
    game.stats.mistakes.forEach((mistake) => {
      const row = make("div", "mistake-item");
      row.appendChild(make("span", "", mistake.prompt));
      row.appendChild(make("strong", "", mistake.correct));
      row.appendChild(make("em", "", `选了 ${mistake.chosen}`));
      mistakes.appendChild(row);
    });
  }
  shell.appendChild(mistakes);

  const actions = make("div", "result-actions");
  const repeat = make("button", "next-button", "按本次词表再来一轮");
  repeat.type = "button";
  repeat.dataset.repeatRound = "";
  const setup = make("button", "utility-button", "回到选择单词");
  setup.type = "button";
  setup.dataset.showSetup = "";
  actions.append(repeat, setup);
  shell.appendChild(actions);
  els.content.appendChild(shell);
}

function renderStudyView() {
  if (!state.game) {
    renderStudySetup();
  } else if (state.game.phase === "result") {
    renderStudyResult();
  } else {
    renderStudyGame();
  }
}

function buildOptions(answer, game) {
  const selected = game.selectedIds.map(findItem).filter(Boolean);
  const optionCount = Math.min(OPTION_COUNT, selected.length);
  const distractors = shuffle(selected.filter((item) => item.id !== answer.id)).slice(0, optionCount - 1);
  return shuffle([answer, ...distractors]);
}

function buildQuestionQueue(selected) {
  return shuffle(selected).map((item) => item.id);
}

function startGame(ids = Array.from(state.selectedStudyIds), mode = state.studyMode) {
  const selected = ids.map(findItem).filter(Boolean);
  if (selected.length < 2) return;

  state.studyMode = mode;
  state.game = {
    phase: "playing",
    mode,
    selectedIds: selected.map((item) => item.id),
    queue: buildQuestionQueue(selected),
    current: null,
    currentOptions: [],
    answered: null,
    mastery: new Map(selected.map((item) => [item.id, { mastered: false, streak: 0, attempts: 0, correct: 0, wrong: 0 }])),
    stats: {
      total: 0,
      correct: 0,
      wrong: 0,
      mistakes: []
    }
  };
  nextQuestion();
}

function finishGame() {
  stopPlayback("Audio ready");
  state.game.phase = "result";
  state.game.current = null;
  state.game.currentOptions = [];
  state.game.answered = null;
  render();
}

function nextQuestion() {
  const game = state.game;
  if (!game) return;
  stopPlayback("Audio ready");
  if (!game.queue.length) {
    finishGame();
    return;
  }

  const currentId = game.queue.shift();
  game.current = findItem(currentId);
  game.currentOptions = buildOptions(game.current, game);
  game.answered = null;
  render();
  if (game.mode === "audio-en") playNormalThenSlow(game.current);
}

function answerQuestion(answerId) {
  const game = state.game;
  if (!game || game.answered || !game.current) return;

  const correct = answerId === game.current.id;
  const mastery = game.mastery.get(game.current.id);
  const chosen = findItem(answerId);
  game.stats.total += 1;
  mastery.attempts += 1;

  if (correct) {
    game.stats.correct += 1;
    mastery.correct += 1;
    mastery.streak += 1;
    if (mastery.wrong === 0 || mastery.streak >= TARGET_STREAK) {
      mastery.mastered = true;
    } else {
      game.queue.push(game.current.id);
    }
  } else {
    game.stats.wrong += 1;
    mastery.wrong += 1;
    mastery.mastered = false;
    mastery.streak = 0;
    game.queue.push(game.current.id);
    game.stats.mistakes.push({
      prompt: game.mode === "audio-en" ? game.current.thai : game.current.english,
      correct: game.mode === "audio-en" ? game.current.english : game.current.thai,
      chosen: chosen ? (game.mode === "audio-en" ? chosen.english : chosen.thai) : ""
    });
  }

  game.answered = { answerId, correct };
  render();
  if (game.mode === "en-th" || !correct) playNormalThenSlow(game.current);
}

function showSetup() {
  stopPlayback("Audio ready");
  state.game = null;
  render();
}

function selectVisibleStudyItems(selected) {
  filteredStudyItems().forEach((item) => {
    if (selected) state.selectedStudyIds.add(item.id);
    else state.selectedStudyIds.delete(item.id);
  });
  saveSelection();
  render();
}

function handleStudyAction(action) {
  if (action === "select-visible") {
    selectVisibleStudyItems(true);
    return;
  }
  if (action === "select-all") {
    state.selectedStudyIds = new Set(STUDY_ITEMS.map((item) => item.id));
    saveSelection();
    render();
    return;
  }
  if (action === "clear-all") {
    state.selectedStudyIds.clear();
    saveSelection();
    render();
  }
}

function getLocalAudioElement() {
  if (!state.audioElement) {
    const audio = new Audio();
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");
    state.audioElement = audio;
  }
  return state.audioElement;
}

function stopPlayback(status = "Audio stopped", cancelSequence = true) {
  if (cancelSequence) state.playbackToken += 1;
  if (state.currentAudio) {
    state.currentAudio.pause();
    try {
      state.currentAudio.currentTime = 0;
    } catch {
      // Some mobile browsers reject seeking before metadata is available.
    }
    state.currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setVoiceStatus(status);
}

function playLocalAudio(item, variant = state.audioVariant) {
  const manifestItem = state.audioMap.get(item.audioId);
  const src = manifestItem?.files?.[variant];
  if (!src) return Promise.resolve(false);

  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  const audio = getLocalAudioElement();
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    // Some mobile browsers reject seeking before metadata is available.
  }
  audio.src = src;
  audio.load();
  state.currentAudio = audio;
  setVoiceStatus(`Playing ${variant}: ${manifestItem.text}`);

  return new Promise((resolve) => {
    let settled = false;
    const cleanup = () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
    };
    const finish = (played) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (state.currentAudio === audio) state.currentAudio = null;
      if (played) setVoiceStatus("Audio ready");
      resolve(played);
    };
    const onEnded = () => finish(true);
    const onError = () => finish(false);
    const onPause = () => {
      if (!audio.ended) finish(false);
    };
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);
    audio.play().catch(() => finish(false));
  });
}

function speakBrowserThai(item, variant = state.audioVariant) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("Audio unavailable");
    return Promise.resolve();
  }
  const text = getSpeechText(item);
  if (!text) return Promise.resolve();

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio = null;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "th-TH";
  utterance.rate = variant === "slow" ? 0.72 : 1;
  setVoiceStatus(`Browser TTS: ${text}`);

  return new Promise((resolve) => {
    utterance.onend = () => {
      setVoiceStatus("Audio ready");
      resolve();
    };
    utterance.onerror = () => {
      setVoiceStatus("Audio stopped");
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

async function playThai(item, variant, token) {
  if (!item || state.playbackToken !== token) return;
  const played = await playLocalAudio(item, variant);
  if (played || state.playbackToken !== token) return;
  await speakBrowserThai(item, variant);
}

async function playNormalThenSlow(item) {
  const token = state.playbackToken + 1;
  state.playbackToken = token;
  stopPlayback("Audio ready", false);
  await playThai(item, "normal", token);
  if (state.playbackToken !== token) return;
  await new Promise((resolve) => setTimeout(resolve, 160));
  if (state.playbackToken !== token) return;
  await playThai(item, "slow", token);
}

async function loadAudioManifest() {
  try {
    const response = await fetch(AUDIO_MANIFEST_URL, { cache: "no-cache" });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    const manifest = await response.json();
    state.audioMap = new Map(manifest.items.map((item) => [item.id, item]));
    setVoiceStatus(`${manifest.voice} audio ready`);
  } catch {
    state.audioMap = new Map();
    setVoiceStatus("Browser TTS fallback ready");
  }
}

async function preloadAudio() {
  setPreloadButton("预加载 0%", true);
  try {
    const manifestResponse = await fetch(AUDIO_MANIFEST_URL, { cache: "no-cache" });
    if (!manifestResponse.ok) throw new Error("manifest");
    const manifest = await manifestResponse.json();
    const urls = [
      AUDIO_MANIFEST_URL,
      ...manifest.items.flatMap((item) => Object.values(item.files))
    ];
    const cache = "caches" in window ? await caches.open(AUDIO_CACHE_NAME) : null;

    for (let index = 0; index < urls.length; index += 1) {
      const response = await fetch(urls[index], { cache: "reload" });
      if (!response.ok) throw new Error(urls[index]);
      if (cache) await cache.put(urls[index], response.clone());
      const percent = Math.round(((index + 1) / urls.length) * 100);
      setPreloadButton(`预加载 ${percent}%`, true);
      setVoiceStatus(`Caching audio ${index + 1}/${urls.length}`);
    }
    setPreloadButton("语音已预加载", false);
    setVoiceStatus("Audio ready");
  } catch {
    setPreloadButton("预加载语音", false);
    setVoiceStatus("Audio preload failed");
  }
}

function render() {
  els.lessonSelect.value = String(state.lesson);
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.lesson) === state.lesson);
  });
  els.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === state.view);
  });

  const lessonMode = state.view === "lesson";
  const activeGame = state.view === "study" && state.game;
  els.lessonSelect.disabled = !lessonMode;
  els.layout.classList.toggle("pos-mode", !lessonMode);
  els.sideNav.classList.toggle("hidden", !lessonMode);
  els.topActions.classList.toggle("hidden", Boolean(activeGame));
  els.searchInput.placeholder = "Search words";

  renderSummary();
  if (state.view === "lesson") renderLessonView();
  else if (state.view === "pos") renderPosView();
  else renderStudyView();
}

function bindEvents() {
  els.lessonSelect.addEventListener("change", (event) => {
    state.lesson = Number(event.target.value);
    render();
  });
  els.sideNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lesson]");
    if (!button) return;
    state.lesson = Number(button.dataset.lesson);
    render();
  });
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      stopPlayback("Audio ready");
      state.view = tab.dataset.view;
      state.query = "";
      state.game = state.view === "study" ? state.game : null;
      els.searchInput.value = "";
      render();
    });
  });
  els.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });
  els.audioVariant.addEventListener("change", () => {
    state.audioVariant = els.audioVariant.value;
  });
  els.preloadAudio.addEventListener("click", preloadAudio);
  els.stopSpeech.addEventListener("click", () => stopPlayback());

  els.content.addEventListener("change", (event) => {
    const studyWord = event.target.closest("[data-study-word]");
    if (studyWord) {
      if (studyWord.checked) state.selectedStudyIds.add(studyWord.dataset.studyWord);
      else state.selectedStudyIds.delete(studyWord.dataset.studyWord);
      saveSelection();
      render();
      return;
    }

    const studySetFilter = event.target.closest("[data-study-set-filter]");
    if (studySetFilter) {
      state.studySet = studySetFilter.value;
      render();
    }
  });

  els.content.addEventListener("click", (event) => {
    const studyAction = event.target.closest("[data-study-action]");
    if (studyAction) {
      handleStudyAction(studyAction.dataset.studyAction);
      return;
    }

    const modeButton = event.target.closest("[data-mode]");
    if (modeButton) {
      state.studyMode = modeButton.dataset.mode;
      render();
      return;
    }

    if (event.target.closest("[data-start-game]")) {
      startGame();
      return;
    }

    const answerButton = event.target.closest("[data-answer-id]");
    if (answerButton) {
      answerQuestion(answerButton.dataset.answerId);
      return;
    }

    if (event.target.closest("[data-play-current]") && state.game?.current) {
      playNormalThenSlow(state.game.current);
      return;
    }

    if (event.target.closest("[data-next-question]")) {
      nextQuestion();
      return;
    }

    if (event.target.closest("[data-show-setup]")) {
      showSetup();
      return;
    }

    if (event.target.closest("[data-repeat-round]") && state.game) {
      startGame(state.game.selectedIds, state.game.mode);
    }
  });
}

function init() {
  loadSelection();
  bindEvents();
  renderNav();
  render();
  loadAudioManifest();
}

init();
