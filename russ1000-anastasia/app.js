const CACHE_NAME = "russ1000-anastasia-v1";

const state = {
  content: null,
  wordById: new Map(),
  audioMap: new Map(),
  audioVariant: "normal",
  currentAudio: null,
  selectedVoiceURI: "",
  voices: []
};

const els = {
  audioVariant: document.querySelector("#audioVariant"),
  voiceSelect: document.querySelector("#voiceSelect"),
  rateControl: document.querySelector("#rateControl"),
  pitchControl: document.querySelector("#pitchControl"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  sentenceList: document.querySelector("#sentenceList"),
  wordGrid: document.querySelector("#wordGrid"),
  translationText: document.querySelector("#translationText"),
  searchInput: document.querySelector("#searchInput"),
  stats: document.querySelector("#stats")
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

function normalizeText(value = "") {
  return String(value).toLowerCase().replace(/\s+/g, " ").trim();
}

function matchesQuery(parts) {
  const query = normalizeText(els.searchInput.value);
  if (!query) return true;
  return normalizeText(parts.filter(Boolean).join(" ")).includes(query);
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
}

function setDownloadButton(label, disabled = false) {
  els.downloadAudioPack.textContent = label;
  els.downloadAudioPack.disabled = disabled;
}

async function loadContent() {
  const response = await fetch("assets/content.json", { cache: "no-cache" });
  if (!response.ok) throw new Error(`content ${response.status}`);
  const content = await response.json();
  state.content = content;
  state.wordById = new Map(content.words.map((word) => [word.id, word]));
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

function getSelectedVoice() {
  return state.voices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || null;
}

function stopPlayback(status = "TTS stopped") {
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setVoiceStatus(status);
}

function playLocalAudio(audioId) {
  const item = state.audioMap.get(audioId);
  const src = item?.files?.[state.audioVariant];
  if (!src) return Promise.resolve(false);

  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();

  const audio = new Audio(src);
  state.currentAudio = audio;
  setVoiceStatus(`Playing ${state.audioVariant}: ${item.text}`);

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

function speakBrowserRussian(text) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("This browser does not expose TTS");
    return Promise.resolve();
  }

  const phrase = String(text || "").trim();
  if (!phrase) return Promise.resolve();

  stopPlayback("TTS ready");
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = "ru-RU";
  utterance.rate = Number(els.rateControl.value);
  utterance.pitch = Number(els.pitchControl.value);

  const selectedVoice = getSelectedVoice();
  if (selectedVoice) utterance.voice = selectedVoice;

  setVoiceStatus(`Speaking: ${phrase}`);
  return new Promise((resolve) => {
    utterance.onend = () => {
      setVoiceStatus("TTS ready");
      resolve();
    };
    utterance.onerror = () => {
      setVoiceStatus("TTS stopped");
      resolve();
    };
    window.speechSynthesis.speak(utterance);
  });
}

async function playRussian(text, audioId = "") {
  if (audioId) {
    const played = await playLocalAudio(audioId);
    if (played) return;
  }
  await speakBrowserRussian(text);
}

function populateVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.innerHTML = '<option value="">TTS unavailable</option>';
    els.voiceSelect.disabled = true;
    return;
  }

  const voices = window.speechSynthesis.getVoices();
  const russianVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("ru"));
  const otherVoices = voices.filter((voice) => !voice.lang.toLowerCase().startsWith("ru"));
  state.voices = [...russianVoices, ...otherVoices];

  const previous = state.selectedVoiceURI;
  els.voiceSelect.innerHTML = "";
  els.voiceSelect.append(new Option("System default (ru-RU)", ""));
  state.voices.forEach((voice) => {
    els.voiceSelect.append(new Option(`${voice.name} · ${voice.lang}`, voice.voiceURI));
  });

  state.selectedVoiceURI = previous || russianVoices[0]?.voiceURI || "";
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
      "assets/content.json",
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
      setVoiceStatus(`Caching audio ${index + 1}/${urls.length}`);
    }

    setDownloadButton("语音包已离线", false);
    setVoiceStatus("Offline audio ready");
  } catch {
    setDownloadButton("下载离线语音包", false);
    setVoiceStatus("Offline audio download failed");
  }
}

function renderStats() {
  els.stats.innerHTML = `
    <span><strong>${state.content.sentences.length}</strong> 句子</span>
    <span><strong>${state.content.words.length}</strong> 单词/短语</span>
    <span><strong>${state.audioMap.size}</strong> 音频条目</span>
  `;
}

function renderToken(token) {
  const word = state.wordById.get(token.wordId);
  const speak = word?.russian || token.text;
  const title = word ? `${word.russian}: ${word.chinese}` : token.text;
  return `
    <span class="token-wrap">
      <button class="token-button" type="button" data-speak="${escapeAttr(speak)}" data-audio-id="${escapeAttr(token.wordId)}" title="${escapeAttr(title)}">
        ${escapeHTML(token.text)}
      </button>${token.after ? `<span class="punct">${escapeHTML(token.after)}</span>` : ""}
    </span>
  `;
}

function renderSentences() {
  const sentences = state.content.sentences.filter((sentence) => (
    matchesQuery([
      sentence.russian,
      sentence.chinese,
      ...sentence.tokens.map((token) => state.wordById.get(token.wordId)?.chinese || token.text)
    ])
  ));

  if (sentences.length === 0) {
    els.sentenceList.innerHTML = '<div class="empty-state">No matching sentences.</div>';
    return;
  }

  els.sentenceList.innerHTML = sentences.map((sentence, index) => `
    <article class="sentence-card" data-speak="${escapeAttr(sentence.russian)}" data-audio-id="${escapeAttr(sentence.id)}">
      <div class="sentence-index">${String(index + 1).padStart(2, "0")}</div>
      <div class="sentence-main">
        <div class="token-line">${sentence.tokens.map(renderToken).join("")}</div>
        <p>${escapeHTML(sentence.chinese)}</p>
      </div>
      <button class="icon-button sentence-play" data-speak="${escapeAttr(sentence.russian)}" data-audio-id="${escapeAttr(sentence.id)}" type="button" aria-label="Play sentence" title="Play sentence">▶</button>
    </article>
  `).join("");
}

function renderWords() {
  const words = state.content.words.filter((word) => matchesQuery([word.russian, word.chinese]));

  if (words.length === 0) {
    els.wordGrid.innerHTML = '<div class="empty-state">No matching words.</div>';
    return;
  }

  els.wordGrid.innerHTML = words.map((word) => `
    <button class="word-card" type="button" data-speak="${escapeAttr(word.russian)}" data-audio-id="${escapeAttr(word.id)}">
      <span class="word-russian">${escapeHTML(word.russian)}</span>
      <span class="word-chinese">${escapeHTML(word.chinese)}</span>
      <span class="word-play" aria-hidden="true">▶</span>
    </button>
  `).join("");
}

function renderTranslation() {
  els.translationText.textContent = state.content.translation;
}

function renderAll() {
  renderStats();
  renderSentences();
  renderWords();
  renderTranslation();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const audioTarget = event.target.closest("[data-audio-id]");
    if (!audioTarget) return;

    if (audioTarget.classList.contains("sentence-card") && event.target.closest(".token-button, .sentence-play")) {
      return;
    }

    event.stopPropagation();
    playRussian(audioTarget.dataset.speak, audioTarget.dataset.audioId);
  });

  els.audioVariant.addEventListener("change", () => {
    state.audioVariant = els.audioVariant.value;
  });
  els.voiceSelect.addEventListener("change", () => {
    state.selectedVoiceURI = els.voiceSelect.value;
  });
  els.stopSpeech.addEventListener("click", () => stopPlayback());
  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.searchInput.addEventListener("input", () => {
    renderSentences();
    renderWords();
  });
}

async function init() {
  bindEvents();
  registerServiceWorker();
  populateVoices();
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = populateVoices;

  try {
    await Promise.all([loadContent(), loadAudioManifest()]);
    renderAll();
  } catch (error) {
    setVoiceStatus("Could not load reading data");
    els.sentenceList.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
  }
}

init();
