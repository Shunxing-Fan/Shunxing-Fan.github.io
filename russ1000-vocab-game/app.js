const CACHE_NAME = "russ1000-vocab-game-v2";
const OPTION_COUNT = 8;

const state = {
  items: [],
  selectedIds: new Set(),
  audioMap: new Map(),
  audioVariant: "normal",
  mode: "audio-en",
  queue: [],
  current: null,
  currentOptions: [],
  answered: false,
  lastQueueOrder: [],
  playbackToken: 0,
  stats: {
    correct: 0,
    total: 0,
    mistakes: []
  },
  currentAudio: null
};

const els = {
  audioVariant: document.querySelector("#audioVariant"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  modeTabs: document.querySelector("#modeTabs"),
  wordList: document.querySelector("#wordList"),
  selectAll: document.querySelector("#selectAll"),
  clearAll: document.querySelector("#clearAll"),
  selectedCount: document.querySelector("#selectedCount"),
  startGame: document.querySelector("#startGame"),
  setupPanel: document.querySelector("#setupPanel"),
  gamePanel: document.querySelector("#gamePanel"),
  resultPanel: document.querySelector("#resultPanel"),
  modeLabel: document.querySelector("#modeLabel"),
  progressText: document.querySelector("#progressText"),
  promptArea: document.querySelector("#promptArea"),
  optionsGrid: document.querySelector("#optionsGrid"),
  feedback: document.querySelector("#feedback"),
  nextButton: document.querySelector("#nextButton"),
  restartButton: document.querySelector("#restartButton"),
  repeatRound: document.querySelector("#repeatRound"),
  backToSetup: document.querySelector("#backToSetup"),
  resultStats: document.querySelector("#resultStats"),
  mistakeList: document.querySelector("#mistakeList")
};

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHTML(value).replaceAll("\n", " ");
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

function setDownloadButton(label, disabled = false) {
  els.downloadAudioPack.textContent = label;
  els.downloadAudioPack.disabled = disabled;
}

async function loadVocabulary() {
  const response = await fetch("assets/vocabulary.json", { cache: "no-cache" });
  if (!response.ok) throw new Error(`vocabulary ${response.status}`);
  const data = await response.json();
  state.items = data.items;
  state.selectedIds = new Set(data.items.map((item) => item.id));
}

async function loadAudioManifest() {
  try {
    const response = await fetch("assets/audio/manifest.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    const manifest = await response.json();
    state.audioMap = new Map(manifest.items.map((item) => [item.id, item]));
    setVoiceStatus(`${manifest.voice} audio ready`);
  } catch {
    state.audioMap = new Map();
    setVoiceStatus("Audio manifest unavailable");
  }
}

function stopPlayback(status = "Audio stopped", cancelSequence = true) {
  if (cancelSequence) state.playbackToken += 1;
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  setVoiceStatus(status);
}

function playLocalAudio(audioId, variant = state.audioVariant) {
  const item = state.audioMap.get(audioId);
  const src = item?.files?.[variant];
  if (!src) {
    setVoiceStatus("Audio file missing");
    return Promise.resolve(false);
  }

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }

  const audio = new Audio(src);
  state.currentAudio = audio;
  setVoiceStatus(`Playing ${variant}: ${item.text}`);

  return new Promise((resolve) => {
    audio.addEventListener("ended", () => {
      if (state.currentAudio === audio) state.currentAudio = null;
      setVoiceStatus("Audio ready");
      resolve(true);
    }, { once: true });
    audio.addEventListener("error", () => {
      if (state.currentAudio === audio) state.currentAudio = null;
      setVoiceStatus("Audio failed");
      resolve(false);
    }, { once: true });
    audio.play().catch(() => {
      if (state.currentAudio === audio) state.currentAudio = null;
      setVoiceStatus("Audio blocked");
      resolve(false);
    });
  });
}

async function playNormalThenSlow(audioId) {
  const token = state.playbackToken + 1;
  state.playbackToken = token;
  stopPlayback("Audio ready", false);
  await playLocalAudio(audioId, "normal");
  if (state.playbackToken !== token) return;
  await new Promise((resolve) => setTimeout(resolve, 160));
  if (state.playbackToken !== token) return;
  await playLocalAudio(audioId, "slow");
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("sw.js");
    await navigator.serviceWorker.ready;
  } catch {
    setVoiceStatus("Offline cache unavailable");
  }
}

async function downloadAudioPack() {
  if (!("caches" in window)) {
    setVoiceStatus("Offline cache unavailable");
    return;
  }

  setDownloadButton("下载中 0%", true);
  try {
    const manifestResponse = await fetch("assets/audio/manifest.json", { cache: "no-cache" });
    if (!manifestResponse.ok) throw new Error("manifest");
    const manifest = await manifestResponse.json();
    const audioFiles = manifest.items.flatMap((item) => Object.values(item.files));
    const urls = [
      "./",
      "index.html",
      "styles.css",
      "app.js",
      "sw.js",
      "assets/vocabulary.json",
      "assets/audio/manifest.json",
      ...audioFiles
    ];
    const cache = await caches.open(CACHE_NAME);

    for (let index = 0; index < urls.length; index += 1) {
      const url = urls[index];
      const response = await fetch(url, { cache: "reload" });
      if (!response.ok) throw new Error(url);
      await cache.put(url, response);
      const percent = Math.round(((index + 1) / urls.length) * 100);
      setDownloadButton(`下载中 ${percent}%`, true);
      setVoiceStatus(`Caching ${index + 1}/${urls.length}`);
    }

    setDownloadButton("语音包已离线", false);
    setVoiceStatus("Offline audio ready");
  } catch {
    setDownloadButton("下载离线语音包", false);
    setVoiceStatus("Offline audio download failed");
  }
}

function selectedItems() {
  return state.items.filter((item) => state.selectedIds.has(item.id));
}

function updateSelectionUI() {
  const count = state.selectedIds.size;
  els.selectedCount.textContent = `${count} selected`;
  els.startGame.disabled = count < OPTION_COUNT;
  els.startGame.textContent = count < OPTION_COUNT ? "至少选择 8 个" : "开始游戏";
  document.querySelectorAll("[data-toggle-word]").forEach((input) => {
    input.checked = state.selectedIds.has(input.dataset.toggleWord);
  });
}

function renderWordList() {
  els.wordList.innerHTML = state.items.map((item) => `
    <label class="word-select-card">
      <input type="checkbox" data-toggle-word="${escapeAttr(item.id)}" checked>
      <span>
        <strong>${escapeHTML(item.russian)}</strong>
        <small>${escapeHTML(item.english)}</small>
      </span>
      <em>${escapeHTML(item.category)}</em>
    </label>
  `).join("");
  updateSelectionUI();
}

function renderModeTabs() {
  els.modeTabs.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
}

function buildOptions(answer) {
  const selected = selectedItems();
  const distractors = shuffle(selected.filter((item) => item.id !== answer.id)).slice(0, OPTION_COUNT - 1);
  return shuffle([answer, ...distractors]);
}

function buildQuestionQueue(selected) {
  let queue = shuffle(selected);
  const order = queue.map((item) => item.id);
  if (
    order.length > 1 &&
    state.lastQueueOrder.length === order.length &&
    order.every((id, index) => id === state.lastQueueOrder[index])
  ) {
    queue = [...queue.slice(1), queue[0]];
  }
  state.lastQueueOrder = queue.map((item) => item.id);
  return queue;
}

function startGame() {
  const selected = selectedItems();
  if (selected.length < OPTION_COUNT) return;

  state.queue = buildQuestionQueue(selected);
  state.stats = { correct: 0, total: 0, mistakes: [] };
  els.setupPanel.hidden = true;
  els.resultPanel.hidden = true;
  els.gamePanel.hidden = false;
  nextQuestion();
}

function repeatRound() {
  const selected = selectedItems();
  if (selected.length < OPTION_COUNT) {
    showSetup();
    return;
  }

  state.queue = buildQuestionQueue(selected);
  state.stats = { correct: 0, total: 0, mistakes: [] };
  els.setupPanel.hidden = true;
  els.resultPanel.hidden = true;
  els.gamePanel.hidden = false;
  nextQuestion();
}

function nextQuestion() {
  stopPlayback("Audio ready");
  if (state.queue.length === 0) {
    finishGame();
    return;
  }

  state.current = state.queue.shift();
  state.currentOptions = buildOptions(state.current);
  state.answered = false;
  els.feedback.textContent = "Choose an answer";
  els.nextButton.hidden = true;
  renderQuestion();
  if (state.mode === "audio-en") {
    playNormalThenSlow(state.current.id);
  }
}

function renderQuestion() {
  const answeredCount = state.stats.total + 1;
  const total = state.stats.total + state.queue.length + 1;
  els.modeLabel.textContent = state.mode === "audio-en" ? "听俄语，选英文" : "看英文，选俄语";
  els.progressText.textContent = `${answeredCount} / ${total}`;

  if (state.mode === "audio-en") {
    els.promptArea.innerHTML = `
      <button class="speaker-button" type="button" data-play-current aria-label="Play Russian word" title="Play Russian word"></button>
      <p>只听录音，选择对应英文</p>
    `;
  } else {
    els.promptArea.innerHTML = `
      <div class="english-prompt">${escapeHTML(state.current.english)}</div>
      <p>选择对应俄语；答对后会播放读音</p>
    `;
  }

  els.optionsGrid.innerHTML = state.currentOptions.map((item) => {
    const label = state.mode === "audio-en" ? item.english : item.russian;
    return `
      <button class="option-button" type="button" data-answer-id="${escapeAttr(item.id)}">
        ${escapeHTML(label)}
      </button>
    `;
  }).join("");
}

function answerQuestion(answerId) {
  if (state.answered || !state.current) return;
  state.answered = true;
  const correct = answerId === state.current.id;
  state.stats.total += 1;
  if (correct) {
    state.stats.correct += 1;
  } else {
    const chosen = state.items.find((item) => item.id === answerId);
    state.stats.mistakes.push({
      prompt: state.mode === "audio-en" ? state.current.russian : state.current.english,
      correct: state.mode === "audio-en" ? state.current.english : state.current.russian,
      chosen: chosen ? (state.mode === "audio-en" ? chosen.english : chosen.russian) : ""
    });
  }

  els.optionsGrid.querySelectorAll(".option-button").forEach((button) => {
    button.disabled = true;
    if (button.dataset.answerId === state.current.id) button.classList.add("is-correct");
    if (button.dataset.answerId === answerId && !correct) button.classList.add("is-wrong");
  });

  els.feedback.textContent = correct
    ? `Correct: ${state.current.russian} = ${state.current.english}`
    : `Wrong: ${state.current.russian} = ${state.current.english}`;
  els.nextButton.hidden = false;

  if (correct && state.mode === "en-ru") {
    playLocalAudio(state.current.id);
  }
}

function finishGame() {
  els.gamePanel.hidden = true;
  els.resultPanel.hidden = false;
  const accuracy = state.stats.total === 0 ? 0 : Math.round((state.stats.correct / state.stats.total) * 100);
  els.resultStats.innerHTML = `
    <div><span>正确</span><strong>${state.stats.correct}</strong></div>
    <div><span>总数</span><strong>${state.stats.total}</strong></div>
    <div><span>正确率</span><strong>${accuracy}%</strong></div>
  `;
  els.mistakeList.innerHTML = state.stats.mistakes.length === 0
    ? '<p class="empty-result">本轮没有错题。</p>'
    : state.stats.mistakes.map((mistake) => `
        <div class="mistake-item">
          <span>${escapeHTML(mistake.prompt)}</span>
          <strong>${escapeHTML(mistake.correct)}</strong>
          <em>选了 ${escapeHTML(mistake.chosen)}</em>
        </div>
      `).join("");
}

function showSetup() {
  stopPlayback("Audio ready");
  els.gamePanel.hidden = true;
  els.resultPanel.hidden = true;
  els.setupPanel.hidden = false;
}

function bindEvents() {
  els.audioVariant.addEventListener("change", () => {
    state.audioVariant = els.audioVariant.value;
  });
  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.stopSpeech.addEventListener("click", () => stopPlayback());
  els.selectAll.addEventListener("click", () => {
    state.selectedIds = new Set(state.items.map((item) => item.id));
    updateSelectionUI();
  });
  els.clearAll.addEventListener("click", () => {
    state.selectedIds = new Set();
    updateSelectionUI();
  });
  els.wordList.addEventListener("change", (event) => {
    const input = event.target.closest("[data-toggle-word]");
    if (!input) return;
    if (input.checked) state.selectedIds.add(input.dataset.toggleWord);
    else state.selectedIds.delete(input.dataset.toggleWord);
    updateSelectionUI();
  });
  els.modeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-mode]");
    if (!button) return;
    state.mode = button.dataset.mode;
    renderModeTabs();
  });
  els.startGame.addEventListener("click", startGame);
  els.optionsGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".option-button");
    if (button) answerQuestion(button.dataset.answerId);
  });
  els.promptArea.addEventListener("click", (event) => {
    if (event.target.closest("[data-play-current]") && state.current) {
      playNormalThenSlow(state.current.id);
    }
  });
  els.nextButton.addEventListener("click", nextQuestion);
  els.restartButton.addEventListener("click", showSetup);
  els.repeatRound.addEventListener("click", repeatRound);
  els.backToSetup.addEventListener("click", showSetup);
}

async function init() {
  bindEvents();
  registerServiceWorker();
  try {
    await Promise.all([loadVocabulary(), loadAudioManifest()]);
    renderWordList();
    renderModeTabs();
  } catch (error) {
    setVoiceStatus("Could not load game data");
    els.wordList.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
  }
}

init();
