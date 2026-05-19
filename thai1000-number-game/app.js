const NUMBER_TOKENS = [
  { id: "token-suun", roman: "sǔun", thai: "ศูนย์", meaning: "0", aliases: ["s", "su", "suun", "sun"] },
  { id: "token-nung", roman: "nùng", thai: "หนึ่ง", meaning: "1 / leading one", aliases: ["n", "nu", "nung", "neung"] },
  { id: "token-song", roman: "sɔ̌ɔng", thai: "สอง", meaning: "2", aliases: ["s", "so", "song", "sorng"] },
  { id: "token-saam", roman: "sǎam", thai: "สาม", meaning: "3", aliases: ["s", "sa", "saa", "saam", "sam"] },
  { id: "token-sii", roman: "sìi", thai: "สี่", meaning: "4", aliases: ["s", "si", "sii", "see"] },
  { id: "token-haa", roman: "hâa", thai: "ห้า", meaning: "5", aliases: ["h", "ha", "haa"] },
  { id: "token-hok", roman: "hòk", thai: "หก", meaning: "6", aliases: ["h", "ho", "hok"] },
  { id: "token-jet", roman: "jèt", thai: "เจ็ด", meaning: "7", aliases: ["j", "je", "jet", "jed"] },
  { id: "token-bpeet", roman: "bpɛ̀ɛt", thai: "แปด", meaning: "8", aliases: ["b", "bp", "bpe", "bpee", "bpeet", "bpet", "p", "paet", "pet"] },
  { id: "token-gao", roman: "gâo", thai: "เก้า", meaning: "9", aliases: ["g", "ga", "gao", "kao", "kow"] },
  { id: "token-sip", roman: "sìp", thai: "สิบ", meaning: "10 / ten-place", aliases: ["s", "si", "sip", "sib"] },
  { id: "token-sip-et", roman: "sìp-èt", thai: "สิบเอ็ด", meaning: "11 / final 1 after tens", aliases: ["s", "si", "sip", "sipe", "sipet", "sip-et", "sibed", "sib-et"] },
  { id: "token-yii", roman: "yîi", thai: "ยี่", meaning: "2 in 20", aliases: ["y", "yi", "yii", "yee"] },
  { id: "token-rooy", roman: "rɔ́ɔy", thai: "ร้อย", meaning: "hundred", aliases: ["r", "ro", "roo", "rooy", "roy", "roi", "rowy"] },
  { id: "token-phan", roman: "phan", thai: "พัน", meaning: "thousand", aliases: ["p", "ph", "pha", "phan", "pan"] },
  { id: "token-muun", roman: "mùun", thai: "หมื่น", meaning: "ten thousand", aliases: ["m", "mu", "muu", "muun", "mun", "muen"] },
  { id: "token-seen", roman: "sε̌εn", thai: "แสน", meaning: "hundred thousand", aliases: ["s", "se", "see", "seen", "sen", "saen"] },
  { id: "token-et", roman: "èt", thai: "เอ็ด", meaning: "final 1 after a higher place", aliases: ["e", "et", "ed"] }
];

const DIGIT_TOKENS = {
  1: "token-nung",
  2: "token-song",
  3: "token-saam",
  4: "token-sii",
  5: "token-haa",
  6: "token-hok",
  7: "token-jet",
  8: "token-bpeet",
  9: "token-gao"
};

const PLACE_TOKENS = [
  { value: 100000, tokenId: "token-seen" },
  { value: 10000, tokenId: "token-muun" },
  { value: 1000, tokenId: "token-phan" },
  { value: 100, tokenId: "token-rooy" }
];

const TOKEN_BY_ID = new Map(NUMBER_TOKENS.map((token) => [token.id, token]));
const MAX_NUMBER = 100000;

const state = {
  audioMap: new Map(),
  audioElement: null,
  currentAudio: null,
  voices: [],
  selectedVoiceURI: "",
  selectedTokenIds: [],
  query: "",
  questions: [],
  currentIndex: 0,
  correctCount: 0,
  misses: [],
  submitted: false
};

const els = {
  voiceSelect: document.querySelector("#voiceSelect"),
  rateControl: document.querySelector("#rateControl"),
  pitchControl: document.querySelector("#pitchControl"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  minInput: document.querySelector("#minInput"),
  maxInput: document.querySelector("#maxInput"),
  countInput: document.querySelector("#countInput"),
  startGame: document.querySelector("#startGame"),
  setupMessage: document.querySelector("#setupMessage"),
  playPanel: document.querySelector("#playPanel"),
  progressText: document.querySelector("#progressText"),
  scoreText: document.querySelector("#scoreText"),
  targetNumber: document.querySelector("#targetNumber"),
  answerDisplay: document.querySelector("#answerDisplay"),
  answerInput: document.querySelector("#answerInput"),
  suggestions: document.querySelector("#suggestions"),
  undoToken: document.querySelector("#undoToken"),
  clearAnswer: document.querySelector("#clearAnswer"),
  submitAnswer: document.querySelector("#submitAnswer"),
  nextQuestion: document.querySelector("#nextQuestion"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  tokenGrid: document.querySelector("#tokenGrid"),
  resultsPanel: document.querySelector("#resultsPanel")
};

function cleanThai(text) {
  return text
    .replace(/[/:]/g, " ")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripMarks(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ɔ/g, "o")
    .replace(/[ɛε]/g, "e")
    .replace(/ә/g, "e")
    .replace(/[^a-z0-9-]+/gi, "")
    .toLowerCase();
}

function getSelectedVoice() {
  return state.voices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || null;
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
}

function stopPlayback(status = "TTS stopped") {
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
  const src = item?.files?.normal;
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
  setVoiceStatus(`Playing: ${item.label}`);

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

function speakBrowserThai(text) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("This browser does not expose TTS");
    return Promise.resolve();
  }

  const phrase = cleanThai(text);
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

async function playThai(text, audioId = "") {
  if (audioId) {
    const played = await playLocalAudio(audioId);
    if (played) return;
  }
  await speakBrowserThai(text);
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

  if (thaiVoices.length > 0) {
    setVoiceStatus(`${thaiVoices.length} Thai voice${thaiVoices.length > 1 ? "s" : ""} found`);
  } else {
    setVoiceStatus("Using browser default voice");
  }
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
      "assets/audio/manifest.json",
      ...audioFiles
    ];
    const cache = await caches.open("thai1000-number-game-v1");

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

function underHundredToTokenIds(number, hasHigherPlace = false) {
  if (number <= 0) return [];
  if (number < 10) {
    if (number === 1 && hasHigherPlace) return ["token-et"];
    return [DIGIT_TOKENS[number]];
  }
  if (number === 10) return ["token-sip"];
  if (number === 11) return ["token-sip-et"];
  if (number < 20) return ["token-sip", DIGIT_TOKENS[number % 10]];

  const tens = Math.floor(number / 10);
  const unit = number % 10;
  const tokens = [tens === 2 ? "token-yii" : DIGIT_TOKENS[tens]];
  if (unit === 1) {
    tokens.push("token-sip-et");
  } else {
    tokens.push("token-sip");
    if (unit > 1) tokens.push(DIGIT_TOKENS[unit]);
  }
  return tokens;
}

function numberToTokenIds(number) {
  if (!Number.isInteger(number) || number < 1 || number > MAX_NUMBER) {
    throw new Error(`Number out of range: ${number}`);
  }
  if (number < 100) return underHundredToTokenIds(number, false);

  let remainder = number;
  const tokens = [];
  let hasHigherPlace = false;

  PLACE_TOKENS.forEach((place) => {
    const digit = Math.floor(remainder / place.value);
    if (digit === 0) return;
    tokens.push(DIGIT_TOKENS[digit], place.tokenId);
    remainder %= place.value;
    hasHigherPlace = true;
  });

  if (remainder > 0) {
    tokens.push(...underHundredToTokenIds(remainder, hasHigherPlace));
  }

  return tokens;
}

function getAnswerModel(number) {
  const tokenIds = numberToTokenIds(number);
  const tokens = tokenIds.map((id) => TOKEN_BY_ID.get(id));
  return {
    number,
    tokenIds,
    roman: tokens.map((token) => token.roman).join(" "),
    thai: tokens.map((token) => token.thai).join(" ")
  };
}

function getSelectedRoman() {
  return state.selectedTokenIds.map((id) => TOKEN_BY_ID.get(id).roman).join(" ");
}

function refreshAnswerInput() {
  const selected = getSelectedRoman();
  els.answerInput.value = selected ? `${selected}${state.query ? ` ${state.query}` : " "}` : state.query;
}

function renderSelectedTokens() {
  if (state.selectedTokenIds.length === 0) {
    els.answerDisplay.innerHTML = '<span class="placeholder">点击候选词块后，答案会出现在这里。</span>';
    return;
  }
  els.answerDisplay.innerHTML = state.selectedTokenIds
    .map((id) => {
      const token = TOKEN_BY_ID.get(id);
      return `<button class="token-pill" data-token-id="${id}" type="button" title="Play ${token.roman}">${token.roman}<span>${token.thai}</span></button>`;
    })
    .join("");
}

function getSuggestionMatches(query) {
  const normalizedQuery = stripMarks(query);
  if (!normalizedQuery) return [];

  return NUMBER_TOKENS
    .map((token) => {
      const roman = stripMarks(token.roman);
      const aliases = [roman, ...token.aliases.map(stripMarks)];
      const exact = aliases.some((alias) => alias === normalizedQuery);
      const starts = aliases.some((alias) => alias.startsWith(normalizedQuery));
      const includes = aliases.some((alias) => alias.includes(normalizedQuery));
      if (!starts && !includes) return null;
      return {
        token,
        score: exact ? 0 : starts ? 1 : 2,
        romanLength: roman.length
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.romanLength - b.romanLength || a.token.roman.localeCompare(b.token.roman))
    .slice(0, 10)
    .map((match) => match.token);
}

function renderSuggestions() {
  if (!stripMarks(state.query)) {
    els.suggestions.innerHTML = "";
    return;
  }
  const matches = getSuggestionMatches(state.query);
  if (matches.length === 0) {
    els.suggestions.innerHTML = '<div class="empty-state">No matching number token.</div>';
    return;
  }
  els.suggestions.innerHTML = matches
    .map((token) => `
      <button class="suggestion-button" data-token-id="${token.id}" type="button">
        <strong>${token.roman}</strong>
        <span>${token.thai}</span>
      </button>
    `)
    .join("");
}

function renderTokenGrid() {
  els.tokenGrid.innerHTML = NUMBER_TOKENS
    .map((token) => `
      <article class="token-card">
        <div>
          <div class="roman-large">${token.roman}</div>
          <div class="thai-small">${token.thai}</div>
          <div class="meaning">${token.meaning}</div>
        </div>
        <button class="icon-button" data-token-id="${token.id}" data-token-play type="button" aria-label="Play ${token.roman}" title="Play ${token.roman}">▶</button>
      </article>
    `)
    .join("");
}

function renderCurrentQuestion() {
  const question = state.questions[state.currentIndex];
  state.selectedTokenIds = [];
  state.query = "";
  state.submitted = false;
  els.playPanel.hidden = false;
  els.progressText.textContent = `Question ${state.currentIndex + 1}/${state.questions.length}`;
  els.scoreText.textContent = `${state.correctCount} correct`;
  els.targetNumber.textContent = question;
  els.feedbackPanel.innerHTML = "";
  els.submitAnswer.disabled = false;
  els.nextQuestion.hidden = true;
  refreshAnswerInput();
  renderSelectedTokens();
  renderSuggestions();
  els.answerInput.focus();
}

function validateSettings() {
  const min = Number(els.minInput.value);
  const max = Number(els.maxInput.value);
  const count = Number(els.countInput.value);
  if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count)) {
    return { ok: false, message: "Min、Max、题数都必须是整数。" };
  }
  if (min < 1 || max > MAX_NUMBER || min > max) {
    return { ok: false, message: "范围必须在 1-100000 内，并且 Min 不能大于 Max。" };
  }
  if (count < 1 || count > 100) {
    return { ok: false, message: "题数必须在 1-100 之间。" };
  }
  const rangeSize = max - min + 1;
  if (count > rangeSize) {
    return { ok: false, message: `这个范围只有 ${rangeSize} 个数字，题数不能超过范围大小。` };
  }
  return { ok: true, min, max, count };
}

function sampleQuestions(min, max, count) {
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values.slice(0, count);
}

function startGame() {
  const settings = validateSettings();
  if (!settings.ok) {
    els.setupMessage.textContent = settings.message;
    return;
  }

  state.questions = sampleQuestions(settings.min, settings.max, settings.count);
  state.currentIndex = 0;
  state.correctCount = 0;
  state.misses = [];
  els.setupMessage.textContent = "";
  els.resultsPanel.innerHTML = '<p class="muted">游戏进行中，完成后这里会显示正确率和错题。</p>';
  renderCurrentQuestion();
}

function handleAnswerInput() {
  const selected = getSelectedRoman();
  const raw = els.answerInput.value;
  const prefix = selected ? `${selected} ` : "";
  state.query = raw.startsWith(prefix) ? raw.slice(prefix.length) : raw.split(/\s+/).at(-1) || "";
  state.query = state.query.trim();
  refreshAnswerInput();
  renderSuggestions();
}

async function addToken(tokenId) {
  const token = TOKEN_BY_ID.get(tokenId);
  if (!token || state.submitted) return;
  state.selectedTokenIds.push(tokenId);
  state.query = "";
  refreshAnswerInput();
  renderSelectedTokens();
  renderSuggestions();
  await playThai(token.thai, token.id);
  els.answerInput.focus();
}

function undoToken() {
  if (state.submitted) return;
  state.selectedTokenIds.pop();
  state.query = "";
  refreshAnswerInput();
  renderSelectedTokens();
  renderSuggestions();
  els.answerInput.focus();
}

function clearAnswer() {
  if (state.submitted) return;
  state.selectedTokenIds = [];
  state.query = "";
  refreshAnswerInput();
  renderSelectedTokens();
  renderSuggestions();
  els.answerInput.focus();
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function submitAnswer() {
  if (state.submitted || state.questions.length === 0) return;
  const number = state.questions[state.currentIndex];
  const expected = getAnswerModel(number);
  const selectedRoman = getSelectedRoman() || "(empty)";
  const isCorrect = arraysEqual(state.selectedTokenIds, expected.tokenIds);
  state.submitted = true;
  els.submitAnswer.disabled = true;
  els.nextQuestion.hidden = false;

  if (isCorrect) {
    state.correctCount += 1;
    els.feedbackPanel.innerHTML = `
      <div class="feedback-good">Correct</div>
      <div class="answer-line">${expected.roman}</div>
    `;
  } else {
    state.misses.push({
      number,
      expected: expected.roman,
      selected: selectedRoman
    });
    els.feedbackPanel.innerHTML = `
      <div class="feedback-bad">Wrong</div>
      <div class="answer-line">Your answer: ${selectedRoman}</div>
      <div class="answer-line">Correct: ${expected.roman}</div>
    `;
  }
  els.scoreText.textContent = `${state.correctCount} correct`;
}

function nextQuestion() {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex += 1;
    renderCurrentQuestion();
    return;
  }
  finishGame();
}

function finishGame() {
  const total = state.questions.length;
  const percent = total ? Math.round((state.correctCount / total) * 100) : 0;
  els.playPanel.hidden = true;
  els.resultsPanel.innerHTML = `
    <div class="score-summary">
      <strong>${state.correctCount}/${total}</strong>
      <span>${percent}% correct</span>
    </div>
    ${
      state.misses.length === 0
        ? '<p class="feedback-good">No mistakes in this round.</p>'
        : `<div class="miss-list">
            ${state.misses.map((miss) => `
              <article class="miss-item">
                <strong>${miss.number}</strong>
                <span>Your answer: ${miss.selected}</span>
                <span>Correct: ${miss.expected}</span>
              </article>
            `).join("")}
          </div>`
    }
  `;
  document.querySelector("#results").scrollIntoView({ behavior: "smooth", block: "start" });
}

function runRuleSelfCheck() {
  const cases = new Map([
    [1, "nùng"],
    [9, "gâo"],
    [10, "sìp"],
    [11, "sìp-èt"],
    [12, "sìp sɔ̌ɔng"],
    [20, "yîi sìp"],
    [21, "yîi sìp-èt"],
    [32, "sǎam sìp sɔ̌ɔng"],
    [99, "gâo sìp gâo"],
    [100, "nùng rɔ́ɔy"],
    [101, "nùng rɔ́ɔy èt"],
    [110, "nùng rɔ́ɔy sìp"],
    [111, "nùng rɔ́ɔy sìp-èt"],
    [121, "nùng rɔ́ɔy yîi sìp-èt"],
    [1000, "nùng phan"],
    [1001, "nùng phan èt"],
    [1011, "nùng phan sìp-èt"],
    [10000, "nùng mùun"],
    [10001, "nùng mùun èt"],
    [99999, "gâo mùun gâo phan gâo rɔ́ɔy gâo sìp gâo"],
    [100000, "nùng sε̌εn"]
  ]);
  for (const [number, expected] of cases) {
    const actual = getAnswerModel(number).roman;
    if (actual !== expected) {
      throw new Error(`${number}: expected ${expected}, got ${actual}`);
    }
  }
}

function bindEvents() {
  els.voiceSelect.addEventListener("change", () => {
    state.selectedVoiceURI = els.voiceSelect.value;
  });
  els.stopSpeech.addEventListener("click", () => stopPlayback("TTS stopped"));
  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.startGame.addEventListener("click", startGame);
  els.answerInput.addEventListener("input", handleAnswerInput);
  els.undoToken.addEventListener("click", undoToken);
  els.clearAnswer.addEventListener("click", clearAnswer);
  els.submitAnswer.addEventListener("click", submitAnswer);
  els.nextQuestion.addEventListener("click", nextQuestion);

  els.suggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-token-id]");
    if (button) addToken(button.dataset.tokenId);
  });

  els.answerDisplay.addEventListener("click", (event) => {
    const button = event.target.closest("[data-token-id]");
    if (!button) return;
    const token = TOKEN_BY_ID.get(button.dataset.tokenId);
    playThai(token.thai, token.id);
  });

  els.tokenGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-token-play]");
    if (!button) return;
    const token = TOKEN_BY_ID.get(button.dataset.tokenId);
    playThai(token.thai, token.id);
  });

  els.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitAnswer();
    }
    if (event.key === "Backspace" && state.query === "" && state.selectedTokenIds.length > 0) {
      event.preventDefault();
      undoToken();
    }
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
}

function init() {
  runRuleSelfCheck();
  populateVoices();
  loadAudioManifest();
  registerServiceWorker();
  renderTokenGrid();
  renderSuggestions();
  renderSelectedTokens();
  bindEvents();
}

init();
