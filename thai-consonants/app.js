const CACHE_NAME = "thai-consonants-v1";

const state = {
  groups: [],
  letters: [],
  audioMap: new Map(),
  currentAudio: null,
  voices: [],
  selectedVoiceURI: "",
  quizLetter: null
};

const els = {
  audioVariant: document.querySelector("#audioVariant"),
  voiceSelect: document.querySelector("#voiceSelect"),
  rateControl: document.querySelector("#rateControl"),
  pitchControl: document.querySelector("#pitchControl"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  searchInput: document.querySelector("#searchInput"),
  stats: document.querySelector("#stats"),
  soundGrid: document.querySelector("#soundGrid"),
  letterGrid: document.querySelector("#letterGrid"),
  quizThai: document.querySelector("#quizThai"),
  quizName: document.querySelector("#quizName"),
  quizPlay: document.querySelector("#quizPlay"),
  answerList: document.querySelector("#answerList"),
  quizFeedback: document.querySelector("#quizFeedback"),
  newQuiz: document.querySelector("#newQuiz")
};

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getGroupAudioId(rank) {
  return `group-${String(rank).padStart(2, "0")}`;
}

function getLetterAudioId(letter) {
  return `letter-${letter.id}`;
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
}

function stopPlayback(status = "Audio stopped") {
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setVoiceStatus(status);
}

async function loadConsonants() {
  const response = await fetch("assets/consonants.json", { cache: "no-cache" });
  if (!response.ok) throw new Error(`consonants ${response.status}`);
  const data = await response.json();
  state.groups = data.groups;
  state.letters = data.groups.flatMap((group) =>
    group.letters.map((letter) => ({
      ...letter,
      rank: group.rank,
      phoneme: group.phoneme,
      note: group.note,
      frequency: group.frequency
    }))
  );
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
    setVoiceStatus("Browser TTS fallback ready");
  }
}

function playLocalAudio(audioId) {
  const item = state.audioMap.get(audioId);
  const src = item?.files?.[els.audioVariant.value];
  if (!src) return Promise.resolve(false);

  stopPlayback("Audio ready");
  const audio = new Audio(src);
  state.currentAudio = audio;
  setVoiceStatus(`Playing ${els.audioVariant.value}: ${item.text}`);

  return new Promise((resolve) => {
    audio.addEventListener("ended", () => {
      if (state.currentAudio === audio) state.currentAudio = null;
      setVoiceStatus("Audio ready");
      resolve(true);
    }, { once: true });
    audio.addEventListener("error", () => {
      if (state.currentAudio === audio) state.currentAudio = null;
      resolve(false);
    }, { once: true });
    audio.play().catch(() => {
      if (state.currentAudio === audio) state.currentAudio = null;
      resolve(false);
    });
  });
}

function getSelectedVoice() {
  return state.voices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || null;
}

function speakBrowserThai(text) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("This browser does not expose TTS");
    return Promise.resolve();
  }

  const phrase = String(text || "").replace(/\s+/g, " ").trim();
  if (!phrase) return Promise.resolve();

  stopPlayback("TTS ready");
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = "th-TH";
  utterance.rate = Number(els.rateControl.value);
  utterance.pitch = Number(els.pitchControl.value);
  const selectedVoice = getSelectedVoice();
  if (selectedVoice) utterance.voice = selectedVoice;

  setVoiceStatus(`Speaking: ${phrase}`);
  return new Promise((resolve) => {
    utterance.onend = () => {
      setVoiceStatus("Audio ready");
      resolve();
    };
    utterance.onerror = () => {
      setVoiceStatus("TTS failed");
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

async function playThai(text, audioId) {
  const played = await playLocalAudio(audioId);
  if (!played) await speakBrowserThai(text);
}

function populateVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.innerHTML = '<option value="">TTS unavailable</option>';
    els.voiceSelect.disabled = true;
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  const thaiVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("th"));
  const otherVoices = voices.filter((voice) => !voice.lang.toLowerCase().startsWith("th"));
  state.voices = [...thaiVoices, ...otherVoices];
  const previous = state.selectedVoiceURI;
  els.voiceSelect.innerHTML = "";
  els.voiceSelect.append(new Option("System default (th-TH)", ""));

  state.voices.forEach((voice) => {
    els.voiceSelect.append(new Option(`${voice.name} · ${voice.lang}`, voice.voiceURI));
  });

  state.selectedVoiceURI = previous || thaiVoices[0]?.voiceURI || "";
  els.voiceSelect.value = state.selectedVoiceURI;
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
    const audioFiles = manifest.items.flatMap((item) => Object.values(item.files));
    const urls = [
      "./",
      "index.html",
      "styles.css",
      "app.js",
      "sw.js",
      "assets/consonants.json",
      "assets/thai-consonant-poster.jpg",
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

function renderStats() {
  const totalFrequency = state.groups.reduce((sum, group) => sum + group.frequency, 0);
  els.stats.innerHTML = `
    <span><strong>${state.groups.length}</strong> 个音位</span>
    <span><strong>${state.letters.length}</strong> 个常用辅音字母</span>
    <span><strong>${totalFrequency.toFixed(1)}%</strong> LT-CS 覆盖</span>
  `;
}

function getFilteredGroups() {
  const query = els.searchInput.value.trim().toLowerCase();
  if (!query) return state.groups;
  return state.groups.filter((group) => {
    const haystack = [
      group.phoneme,
      group.note,
      String(group.frequency),
      ...group.letters.flatMap((letter) => [letter.char, letter.name, letter.roman])
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderSoundGrid() {
  const groups = getFilteredGroups();
  const maxFrequency = Math.max(...state.groups.map((group) => group.frequency));

  if (groups.length === 0) {
    els.soundGrid.innerHTML = '<div class="empty-state">没有匹配的辅音。</div>';
    return;
  }

  els.soundGrid.innerHTML = groups
    .map((group) => {
      const percent = Math.round((group.frequency / maxFrequency) * 100);
      const letters = group.letters
        .map((letter) => `
          <button class="letter-chip" type="button" data-audio-id="${getLetterAudioId(letter)}" data-speak="${escapeHTML(letter.name)}">
            <span class="thai">${escapeHTML(letter.char)}</span>
            <span>${escapeHTML(letter.roman)}</span>
          </button>
        `)
        .join("");

      return `
        <article class="sound-card" style="--bar: ${percent}%">
          <div class="card-topline">
            <span class="rank">#${group.rank}</span>
            <span class="frequency">${group.frequency.toFixed(1)}%</span>
          </div>
          <div class="sound-main">
            <button class="play-button" type="button" aria-label="Play ${escapeHTML(group.phoneme)}" data-audio-id="${getGroupAudioId(group.rank)}" data-speak="${escapeHTML(group.letters.map((letter) => letter.name).join('. '))}">▶</button>
            <div>
              <h3>${escapeHTML(group.phoneme)}</h3>
              <p>${escapeHTML(group.note)}</p>
            </div>
          </div>
          <div class="bar" aria-hidden="true"><span></span></div>
          <div class="letter-row">${letters}</div>
        </article>
      `;
    })
    .join("");
}

function renderLetterGrid() {
  const query = els.searchInput.value.trim().toLowerCase();
  const letters = state.letters.filter((letter) => {
    if (!query) return true;
    const haystack = `${letter.char} ${letter.name} ${letter.roman} ${letter.phoneme} ${letter.note}`.toLowerCase();
    return haystack.includes(query);
  });

  els.letterGrid.innerHTML = letters
    .map((letter) => `
      <button class="letter-tile" type="button" data-audio-id="${getLetterAudioId(letter)}" data-speak="${escapeHTML(letter.name)}">
        <span class="tile-char">${escapeHTML(letter.char)}</span>
        <span class="tile-name">${escapeHTML(letter.name)}</span>
        <span class="tile-meta">${escapeHTML(letter.phoneme)} · ${escapeHTML(letter.roman)}</span>
      </button>
    `)
    .join("");
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function renderQuiz() {
  const letter = pickRandom(state.letters);
  state.quizLetter = letter;
  const correctGroup = state.groups.find((group) => group.rank === letter.rank);
  const distractors = shuffle(state.groups.filter((group) => group.rank !== letter.rank)).slice(0, 5);
  const options = shuffle([correctGroup, ...distractors]);

  els.quizThai.textContent = letter.char;
  els.quizName.textContent = "选择这个字母对应的音位";
  els.quizFeedback.textContent = "";
  els.answerList.innerHTML = options
    .map((group) => `
      <button type="button" data-rank="${group.rank}">
        <strong>${escapeHTML(group.phoneme)}</strong>
        <span>${escapeHTML(group.note)}</span>
      </button>
    `)
    .join("");
}

function handleAnswer(button) {
  if (!state.quizLetter) return;
  const selectedRank = Number(button.dataset.rank);
  const correct = selectedRank === state.quizLetter.rank;
  const correctGroup = state.groups.find((group) => group.rank === state.quizLetter.rank);

  [...els.answerList.querySelectorAll("button")].forEach((item) => {
    item.disabled = true;
    const rank = Number(item.dataset.rank);
    if (rank === state.quizLetter.rank) item.classList.add("is-correct");
    if (item === button && !correct) item.classList.add("is-wrong");
  });

  els.quizName.textContent = `${state.quizLetter.name} · ${state.quizLetter.roman}`;
  els.quizFeedback.textContent = correct
    ? `正确：${state.quizLetter.char} 属于 ${correctGroup.phoneme}。`
    : `应选 ${correctGroup.phoneme}：${state.quizLetter.char} ${state.quizLetter.name}。`;
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-audio-id]");
    if (!button) return;
    playThai(button.dataset.speak, button.dataset.audioId);
  });

  els.answerList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-rank]");
    if (button) handleAnswer(button);
  });

  els.searchInput.addEventListener("input", () => {
    renderSoundGrid();
    renderLetterGrid();
  });
  els.voiceSelect.addEventListener("change", () => {
    state.selectedVoiceURI = els.voiceSelect.value;
  });
  els.stopSpeech.addEventListener("click", () => stopPlayback());
  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.newQuiz.addEventListener("click", renderQuiz);
  els.quizPlay.addEventListener("click", () => {
    if (!state.quizLetter) return;
    playThai(state.quizLetter.name, getLetterAudioId(state.quizLetter));
  });
}

async function init() {
  bindEvents();
  registerServiceWorker();
  populateVoices();
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = populateVoices;

  try {
    await Promise.all([loadConsonants(), loadAudioManifest()]);
    renderStats();
    renderSoundGrid();
    renderLetterGrid();
    renderQuiz();
  } catch (error) {
    setVoiceStatus("Could not load consonant data");
    els.soundGrid.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
  }
}

init();
