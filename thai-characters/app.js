const CACHE_NAME = "thai-characters-v2";

const state = {
  groups: [],
  consonants: [],
  vowelGroups: [],
  vowelForms: [],
  charts: [],
  audioMap: new Map(),
  currentAudio: null,
  currentAudioResolve: null,
  playToken: 0,
  selectedChartId: "week-1",
  game: {
    active: false,
    queue: [],
    index: 0,
    answers: [],
    current: null,
    lastResult: null
  }
};

const els = {
  audioVariant: document.querySelector("#audioVariant"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  searchInput: document.querySelector("#searchInput"),
  stats: document.querySelector("#stats"),
  soundGrid: document.querySelector("#soundGrid"),
  consonantGrid: document.querySelector("#consonantGrid"),
  vowelGrid: document.querySelector("#vowelGrid"),
  bankList: document.querySelector("#bankList"),
  gamePanel: document.querySelector("#gamePanel"),
  chartTabs: document.querySelector("#chartTabs"),
  chartImage: document.querySelector("#chartImage"),
  chartCaption: document.querySelector("#chartCaption")
};

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeAnswer(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function getGroupAudioId(rank) {
  return `group-${String(rank).padStart(2, "0")}`;
}

function getConsonantAudioId(letter) {
  return `letter-${letter.id}`;
}

function getVowelGroupAudioId(group) {
  return `vowel-group-${group.id}`;
}

function getVowelAudioId(vowel) {
  return vowel.id;
}

function classLabel(value) {
  return {
    high: "High",
    mid: "Mid",
    low: "Low"
  }[value] || value;
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
}

function stopPlayback(status = "Audio stopped") {
  state.playToken += 1;
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  if (state.currentAudioResolve) {
    state.currentAudioResolve(false);
    state.currentAudioResolve = null;
  }
  setVoiceStatus(status);
}

async function loadCharacters() {
  const response = await fetch("assets/characters.json", { cache: "no-cache" });
  if (!response.ok) throw new Error(`characters ${response.status}`);
  const data = await response.json();
  state.groups = data.consonantGroups;
  state.charts = data.alphabetCharts;
  state.consonants = data.consonantGroups.flatMap((group) =>
    group.letters.map((letter) => ({
      ...letter,
      groupRank: group.rank,
      sound: group.sound,
      groupNote: group.note,
      frequency: group.frequency,
      type: "consonant"
    }))
  );
  state.vowelGroups = data.vowelGroups;
  state.vowelForms = data.vowelGroups.flatMap((group) =>
    group.forms.map((form) => ({
      ...form,
      groupId: group.id,
      groupLabel: group.label,
      type: "vowel"
    }))
  );
}

async function loadAudioManifest() {
  try {
    const response = await fetch("assets/audio/manifest.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`manifest ${response.status}`);
    const manifest = await response.json();
    state.audioMap = new Map(manifest.items.map((item) => [item.id, item]));
    setVoiceStatus(`${manifest.voice} audio ready · ${manifest.fileCount} files`);
    renderStats(manifest);
  } catch {
    state.audioMap = new Map();
    setVoiceStatus("Audio manifest unavailable");
    renderStats();
  }
}

function getAudioSources(item) {
  const variant = els.audioVariant.value;
  if (item?.sequence?.[variant]) return item.sequence[variant];
  if (item?.files?.[variant]) return [item.files[variant]];
  return [];
}

function playAudioSource(src, token) {
  return new Promise((resolve) => {
    const audio = new Audio(src);
    state.currentAudio = audio;
    state.currentAudioResolve = resolve;

    const cleanup = (result) => {
      if (state.currentAudio === audio) state.currentAudio = null;
      if (state.currentAudioResolve === resolve) state.currentAudioResolve = null;
      resolve(result);
    };

    audio.addEventListener("ended", () => cleanup(true), { once: true });
    audio.addEventListener("error", () => cleanup(false), { once: true });
    audio.play().catch(() => cleanup(false));

    if (token !== state.playToken) cleanup(false);
  });
}

async function playThai(_text, audioId) {
  const item = state.audioMap.get(audioId);
  const sources = getAudioSources(item);
  if (!item || !sources.length) {
    setVoiceStatus(`Missing audio asset: ${audioId}`);
    return;
  }

  stopPlayback("Audio ready");
  const token = state.playToken;
  setVoiceStatus(`Playing ${els.audioVariant.value}: ${item.text}`);

  for (let index = 0; index < sources.length; index += 1) {
    if (token !== state.playToken) return;
    const ok = await playAudioSource(sources[index], token);
    if (!ok || token !== state.playToken) {
      setVoiceStatus(`Audio failed: ${item.text}`);
      return;
    }
  }

  if (token === state.playToken) setVoiceStatus("Audio ready");
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

function setDownloadButton(label, disabled = false) {
  els.downloadAudioPack.textContent = label;
  els.downloadAudioPack.disabled = disabled;
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
    const audioFiles = manifest.audioFiles || manifest.items.flatMap((item) => [
      ...Object.values(item.files || {}),
      ...Object.values(item.sequence || {}).flat()
    ]);
    const chartFiles = state.charts.map((chart) => chart.src);
    const urls = Array.from(new Set([
      "./",
      "index.html",
      "styles.css",
      "app.js",
      "sw.js",
      "assets/characters.json",
      "assets/audio/manifest.json",
      ...chartFiles,
      ...audioFiles
    ]));
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

function renderStats(manifest = null) {
  const audioText = manifest ? `${manifest.fileCount} MP3` : "Audio loading";
  els.stats.innerHTML = `
    <span><strong>${state.groups.length}</strong> 个辅音发音组</span>
    <span><strong>${state.consonants.length}</strong> 个辅音</span>
    <span><strong>${state.vowelGroups.length}</strong> 组基础元音</span>
    <span><strong>${audioText}</strong></span>
  `;
}

function getFilteredGroups() {
  const query = els.searchInput.value.trim().toLowerCase();
  if (!query) return state.groups;
  return state.groups.filter((group) => {
    const haystack = [
      group.sound,
      group.note,
      String(group.frequency),
      ...group.letters.flatMap((letter) => [
        letter.char,
        letter.name,
        letter.roman,
        letter.meaningZh,
        classLabel(letter.class)
      ])
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderSoundGrid() {
  const groups = getFilteredGroups();
  els.soundGrid.innerHTML = groups.map((group) => {
    const audioId = getGroupAudioId(group.rank);
    const letterChips = group.letters.map((letter) => `
      <span class="letter-chip" title="${escapeHTML(letter.name)}">${escapeHTML(letter.char)}</span>
    `).join("");
    return `
      <article class="sound-card">
        <div class="sound-card-top">
          <span class="rank">#${group.rank}</span>
          <button class="play-button" type="button" data-audio-id="${audioId}" data-speak="${escapeHTML(group.letters.map((letter) => letter.name).join(". "))}" aria-label="Play ${escapeHTML(group.sound)}">▶</button>
        </div>
        <div class="phoneme">${escapeHTML(group.sound)}</div>
        <div class="sound-note">${escapeHTML(group.note)}</div>
        <div class="letter-row">${letterChips}</div>
      </article>
    `;
  }).join("");
}

function getFilteredConsonants() {
  const query = els.searchInput.value.trim().toLowerCase();
  if (!query) return state.consonants;
  return state.consonants.filter((letter) => {
    const haystack = [
      letter.char,
      letter.name,
      letter.roman,
      letter.sound,
      letter.meaningZh,
      classLabel(letter.class)
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderConsonants() {
  const letters = getFilteredConsonants();
  els.consonantGrid.innerHTML = letters.map((letter) => `
    <article class="letter-card">
      <div class="letter-main">
        <span class="thai-letter">${escapeHTML(letter.char)}</span>
        <button class="play-button" type="button" data-audio-id="${getConsonantAudioId(letter)}" data-speak="${escapeHTML(letter.name)}" aria-label="Play ${escapeHTML(letter.name)}">▶</button>
      </div>
      <div class="letter-name">${escapeHTML(letter.name)}</div>
      <div class="roman">${escapeHTML(letter.roman)}</div>
      <div class="letter-meta">
        <span>${escapeHTML(letter.sound)}</span>
        <span>${escapeHTML(classLabel(letter.class))}</span>
        <span>${escapeHTML(letter.meaningZh)}</span>
      </div>
    </article>
  `).join("");
}

function renderVowels() {
  els.vowelGrid.innerHTML = state.vowelGroups.map((group) => {
    const formCards = group.forms.map((form) => `
      <div class="vowel-form">
        <button class="play-button" type="button" data-audio-id="${getVowelAudioId(form)}" data-speak="${escapeHTML(form.name)}" aria-label="Play ${escapeHTML(form.name)}">▶</button>
        <span class="vowel-thai">${escapeHTML(form.form)}</span>
        <span class="roman">${escapeHTML(form.roman)}</span>
      </div>
    `).join("");
    return `
      <article class="vowel-card">
        <div class="vowel-card-head">
          <div>
            <h3>${escapeHTML(group.label)}</h3>
            <p>${escapeHTML(group.note)}</p>
          </div>
          <button class="play-button" type="button" data-audio-id="${getVowelGroupAudioId(group)}" data-speak="${escapeHTML(group.forms.map((form) => form.name).join(". "))}" aria-label="Play ${escapeHTML(group.label)}">▶</button>
        </div>
        <div class="vowel-forms">${formCards}</div>
      </article>
    `;
  }).join("");
}

function renderBankList() {
  const consonants = state.consonants.map((item) => ({
    key: `consonant:${item.id}`,
    type: "consonant",
    char: item.char,
    label: item.roman
  }));
  const vowels = state.vowelForms.map((item) => ({
    key: `vowel:${item.id}`,
    type: "vowel",
    char: item.form,
    label: item.roman
  }));

  els.bankList.innerHTML = `
    <div class="bank-group">
      <h3>辅音</h3>
      <div class="bank-items">
        ${consonants.map(renderBankCheckbox).join("")}
      </div>
    </div>
    <div class="bank-group">
      <h3>元音</h3>
      <div class="bank-items">
        ${vowels.map(renderBankCheckbox).join("")}
      </div>
    </div>
  `;
}

function renderBankCheckbox(item) {
  return `
    <label class="bank-item">
      <input type="checkbox" value="${escapeHTML(item.key)}" data-bank-type="${escapeHTML(item.type)}" checked>
      <span class="bank-char">${escapeHTML(item.char)}</span>
      <span class="bank-label">${escapeHTML(item.label)}</span>
    </label>
  `;
}

function setBankSelection(mode) {
  els.bankList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    if (mode === "all") input.checked = true;
    if (mode === "clear") input.checked = false;
    if (mode === "consonants") input.checked = input.dataset.bankType === "consonant";
    if (mode === "vowels") input.checked = input.dataset.bankType === "vowel";
  });
}

function getSelectedGameItems() {
  const keys = Array.from(els.bankList.querySelectorAll('input[type="checkbox"]:checked'))
    .map((input) => input.value);
  return keys.map((key) => {
    const [type, id] = key.split(":");
    if (type === "consonant") {
      const letter = state.consonants.find((item) => item.id === id);
      return {
        key,
        type,
        promptText: letter.name,
        promptRoman: letter.roman,
        answer: letter.char,
        accepted: [letter.char],
        audioId: getConsonantAudioId(letter)
      };
    }
    const vowel = state.vowelForms.find((item) => item.id === id);
    return {
      key,
      type,
      promptText: vowel.name,
      promptRoman: vowel.roman,
      answer: vowel.answer,
      accepted: [vowel.answer, ...(vowel.aliases || [])],
      audioId: getVowelAudioId(vowel)
    };
  }).filter(Boolean);
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function startGame() {
  const selected = getSelectedGameItems();
  if (!selected.length) {
    renderGameMessage("请先选择至少一个字母或元音。");
    return;
  }

  state.game = {
    active: true,
    queue: shuffle(selected),
    index: 0,
    answers: [],
    current: null,
    lastResult: null
  };
  setCurrentGameItem();
  renderGame();
  playCurrentGameItem();
}

function setCurrentGameItem() {
  state.game.current = state.game.queue[state.game.index] || null;
}

function renderGameMessage(message) {
  els.gamePanel.innerHTML = `
    <div class="game-empty">
      <p>${escapeHTML(message)}</p>
      <button class="primary-action" type="button" id="startGame">开始循环一遍题库</button>
    </div>
  `;
}

function renderGame() {
  if (!state.game.active) {
    renderGameMessage("选择题库后开始。每题只听声音，然后输入对应的泰文字母或以 อ 为占位符的元音。");
    return;
  }

  const total = state.game.queue.length;
  const number = state.game.index + 1;
  els.gamePanel.innerHTML = `
    <div class="game-running">
      <div class="game-progress">
        <span>第 ${number} / ${total} 题</span>
      </div>
      <button class="icon-button large" type="button" id="gameReplay" aria-label="Replay prompt" title="Replay prompt">▶</button>
      <form class="game-answer" id="gameAnswerForm">
        <input id="gameInput" class="thai-answer" type="text" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="6" aria-label="Type the Thai character or vowel">
        <button class="primary-action" type="submit">提交</button>
      </form>
      <div class="feedback" aria-live="polite">${state.game.lastResult ? "已记录，继续下一题。" : ""}</div>
    </div>
  `;
  const input = document.querySelector("#gameInput");
  if (input) {
    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
  }
}

function playCurrentGameItem() {
  if (!state.game.current) return;
  playThai(state.game.current.promptText, state.game.current.audioId);
}

function submitGameAnswer(event) {
  event.preventDefault();
  if (!state.game.current) return;
  const input = document.querySelector("#gameInput");
  const userAnswer = normalizeAnswer(input?.value);
  if (!userAnswer) {
    input?.focus();
    return;
  }

  const accepted = state.game.current.accepted.map(normalizeAnswer);
  const correct = accepted.includes(userAnswer);
  state.game.answers.push({
    ...state.game.current,
    userAnswer,
    correct
  });
  state.game.lastResult = correct;
  state.game.index += 1;

  if (state.game.index >= state.game.queue.length) {
    finishGame();
    return;
  }

  setCurrentGameItem();
  renderGame();
  playCurrentGameItem();
}

function finishGame() {
  stopPlayback("Game complete");
  const total = state.game.answers.length;
  const correct = state.game.answers.filter((answer) => answer.correct).length;
  const wrong = state.game.answers.filter((answer) => !answer.correct);
  state.game.active = false;

  els.gamePanel.innerHTML = `
    <div class="game-results">
      <div class="score">${correct} / ${total}</div>
      <p>正确率 ${Math.round((correct / total) * 100)}%</p>
      ${wrong.length ? `
        <div class="wrong-list">
          <h3>错题</h3>
          ${wrong.map((item) => `
            <div class="wrong-item">
              <span>${escapeHTML(item.promptRoman)}</span>
              <strong>${escapeHTML(item.answer)}</strong>
              <small>你输入：${escapeHTML(item.userAnswer)}</small>
            </div>
          `).join("")}
        </div>
      ` : "<p>这一轮没有错题。</p>"}
      <button class="primary-action" type="button" id="startGame">再来一轮</button>
    </div>
  `;
}

function renderCharts() {
  els.chartTabs.innerHTML = state.charts.map((chart) => `
    <button class="secondary-action chart-tab ${chart.id === state.selectedChartId ? "active" : ""}" type="button" data-chart-id="${escapeHTML(chart.id)}">
      ${escapeHTML(chart.label)}
    </button>
  `).join("");
  updateChart();
}

function updateChart() {
  const chart = state.charts.find((item) => item.id === state.selectedChartId) || state.charts[0];
  if (!chart) return;
  els.chartImage.src = chart.src;
  els.chartImage.alt = chart.title;
  els.chartCaption.textContent = `${chart.label} · ${chart.title}`;
  els.chartTabs.querySelectorAll(".chart-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.chartId === chart.id);
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const audioButton = event.target.closest("[data-audio-id]");
    if (audioButton) {
      playThai(audioButton.dataset.speak, audioButton.dataset.audioId);
      return;
    }

    const bankButton = event.target.closest("[data-bank-action]");
    if (bankButton) {
      setBankSelection(bankButton.dataset.bankAction);
      return;
    }

    const chartButton = event.target.closest("[data-chart-id]");
    if (chartButton) {
      state.selectedChartId = chartButton.dataset.chartId;
      updateChart();
      return;
    }

    if (event.target.closest("#startGame")) {
      startGame();
      return;
    }

    if (event.target.closest("#gameReplay")) {
      playCurrentGameItem();
    }
  });

  document.addEventListener("submit", (event) => {
    if (event.target.matches("#gameAnswerForm")) submitGameAnswer(event);
  });

  els.searchInput.addEventListener("input", () => {
    renderSoundGrid();
    renderConsonants();
  });
  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.stopSpeech.addEventListener("click", () => stopPlayback());
}

async function init() {
  try {
    await loadCharacters();
    renderStats();
    renderSoundGrid();
    renderConsonants();
    renderVowels();
    renderBankList();
    renderGame();
    renderCharts();
    bindEvents();
    await loadAudioManifest();
    await registerServiceWorker();
  } catch (error) {
    setVoiceStatus(`Load failed: ${error.message}`);
    console.error(error);
  }
}

init();
