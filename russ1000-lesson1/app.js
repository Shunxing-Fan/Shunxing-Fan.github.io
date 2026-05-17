const CACHE_NAME = "russ1000-lesson1-v2";

const state = {
  content: null,
  activeWordGroup: 0,
  activeConversation: 0,
  activeCategory: "all",
  selectedVoiceURI: "",
  audioVariant: "normal",
  audioMap: new Map(),
  currentAudio: null,
  voices: [],
  quiz: null,
  queueToken: 0
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
  alphabetGrid: document.querySelector("#alphabetGrid"),
  wordTabs: document.querySelector("#wordTabs"),
  wordGroupPanel: document.querySelector("#wordGroupPanel"),
  categoryFilter: document.querySelector("#categoryFilter"),
  vocabGrid: document.querySelector("#vocabGrid"),
  conversationTabs: document.querySelector("#conversationTabs"),
  dialoguePanel: document.querySelector("#dialoguePanel"),
  playConversation: document.querySelector("#playConversation"),
  sentenceBlocks: document.querySelector("#sentenceBlocks"),
  newQuiz: document.querySelector("#newQuiz"),
  quizPrompt: document.querySelector("#quizPrompt"),
  quizSpeak: document.querySelector("#quizSpeak"),
  answerList: document.querySelector("#answerList"),
  quizFeedback: document.querySelector("#quizFeedback")
};

const categoryLabels = {
  all: "全部",
  greeting: "寒暄",
  phrase: "短语",
  introduction: "介绍",
  question: "问题",
  answer: "回答",
  identity: "身份",
  origin: "来源地",
  classroom: "课堂"
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

function searchQuery() {
  return normalizeText(els.searchInput.value);
}

function matchesQuery(parts) {
  const query = searchQuery();
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

function getWordAudioId(groupIndex, wordIndex) {
  return `word-${String(groupIndex + 1).padStart(2, "0")}-${String(wordIndex + 1).padStart(2, "0")}`;
}

function getWordDialogueAudioId(groupIndex, dialogueIndex, lineIndex) {
  return `word-dialog-${String(groupIndex + 1).padStart(2, "0")}-${String(dialogueIndex + 1).padStart(2, "0")}-${String(lineIndex + 1).padStart(2, "0")}`;
}

function getConversationAudioId(conversationIndex, lineIndex) {
  return `conv-${String(conversationIndex + 1).padStart(2, "0")}-${String(lineIndex + 1).padStart(2, "0")}`;
}

function getSentenceAudioId(blockIndex, itemIndex) {
  return `sentence-${String(blockIndex + 1).padStart(2, "0")}-${String(itemIndex + 1).padStart(2, "0")}`;
}

function getChecklistAudioId(index) {
  return `check-${String(index + 1).padStart(2, "0")}`;
}

function getSelectedVoice() {
  return state.voices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || null;
}

function stopPlayback(status = "TTS stopped", preserveQueue = false) {
  if (!preserveQueue) state.queueToken = 0;
  if (state.currentAudio) {
    state.currentAudio.pause();
    state.currentAudio.currentTime = 0;
    state.currentAudio = null;
  }
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setVoiceStatus(status);
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

function playLocalAudio(audioId, preserveQueue = false) {
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
      if (!preserveQueue) setVoiceStatus("Audio file failed");
      resolve(false);
    }, { once: true });
    audio.play().catch(() => {
      if (state.currentAudio === audio) state.currentAudio = null;
      resolve(false);
    });
  });
}

function speakBrowserRussian(text, preserveQueue = false) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("This browser does not expose TTS");
    return Promise.resolve();
  }

  const phrase = String(text || "").trim();
  if (!phrase) return Promise.resolve();

  stopPlayback("TTS ready", preserveQueue);
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

async function playRussian(text, audioId = "", preserveQueue = false) {
  if (audioId) {
    const played = await playLocalAudio(audioId, preserveQueue);
    if (played) return;
  }
  await speakBrowserRussian(text, preserveQueue);
}

async function speakQueue(lines) {
  const token = Date.now();
  state.queueToken = token;
  for (const line of lines) {
    if (state.queueToken !== token) return;
    await playRussian(line.russian, line.audioId, true);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
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
    const label = `${voice.name} · ${voice.lang}`;
    els.voiceSelect.append(new Option(label, voice.voiceURI));
  });

  const bestRussianVoice = russianVoices[0]?.voiceURI || "";
  state.selectedVoiceURI = previous || bestRussianVoice;
  els.voiceSelect.value = state.selectedVoiceURI;

  if (russianVoices.length > 0) {
    setVoiceStatus(`${russianVoices.length} Russian voice${russianVoices.length > 1 ? "s" : ""} found`);
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
      "assets/images/russian-alphabet-poster.jpg",
      "assets/images/dialogue-of-acquaintance.jpg",
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

function renderAlphabet() {
  const items = state.content.alphabet.filter((item) => (
    matchesQuery([item.upper, item.lower, item.sound, item.letterName, item.example, item.zh, item.note])
  ));

  if (items.length === 0) {
    els.alphabetGrid.innerHTML = '<div class="empty-state">No matching letters.</div>';
    return;
  }

  els.alphabetGrid.innerHTML = items.map((item) => `
    <article class="alphabet-card">
      <div>
        <div class="letter-pair">
          <strong>${escapeHTML(item.upper)}</strong>
          <span>${escapeHTML(item.lower)}</span>
        </div>
        <div class="sound">${escapeHTML(item.sound)}</div>
        <div class="example">${escapeHTML(item.example)}</div>
        <div class="meaning">${escapeHTML(item.zh)}</div>
        ${item.note ? `<div class="note">${escapeHTML(item.note)}</div>` : ""}
      </div>
      <div class="card-actions">
        <button class="icon-button" data-speak="${escapeAttr(item.letterName)}" data-audio-id="${escapeAttr(`${item.id}-name`)}" type="button" aria-label="Play ${escapeAttr(item.upper)}" title="Play ${escapeAttr(item.upper)}">▶</button>
        <button class="icon-button" data-speak="${escapeAttr(item.example)}" data-audio-id="${escapeAttr(`${item.id}-example`)}" type="button" aria-label="Play ${escapeAttr(item.example)}" title="Play ${escapeAttr(item.example)}">▶</button>
      </div>
    </article>
  `).join("");
}

function renderWordTabs() {
  els.wordTabs.innerHTML = state.content.wordGroups.map((group, index) => {
    const active = index === state.activeWordGroup ? " is-active" : "";
    return `<button class="${active}" data-word-group="${index}" type="button" role="tab">${escapeHTML(group.title)}</button>`;
  }).join("");
}

function renderWordGroup() {
  const group = state.content.wordGroups[state.activeWordGroup];
  const words = group.words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => matchesQuery([word, group.title, group.letters.join(" ")]));

  const wordButtons = words.length > 0
    ? words.map(({ word, index }) => `
        <button class="word-chip" data-speak="${escapeAttr(word)}" data-audio-id="${escapeAttr(getWordAudioId(state.activeWordGroup, index))}" type="button">
          <span>${escapeHTML(word)}</span><span aria-hidden="true">▶</span>
        </button>
      `).join("")
    : '<div class="empty-state">No matching words in this group.</div>';

  const dialogues = group.dialogues.map((dialogue, dialogueIndex) => `
    <div class="mini-dialogue">
      <h3>${escapeHTML(dialogue.title)}</h3>
      ${dialogue.lines.map((line, lineIndex) => `
        <div class="mini-dialogue-line">
          <span class="speaker">${escapeHTML(line.speaker)}</span>
          <div>
            <div class="line-russian">${escapeHTML(line.russian)}</div>
            <div class="line-meta"><span>${escapeHTML(line.english)}</span><span>${escapeHTML(line.zh)}</span></div>
          </div>
          <button class="icon-button" data-speak="${escapeAttr(line.russian)}" data-audio-id="${escapeAttr(getWordDialogueAudioId(state.activeWordGroup, dialogueIndex, lineIndex))}" type="button" aria-label="Play line" title="Play line">▶</button>
        </div>
      `).join("")}
    </div>
  `).join("");

  els.wordGroupPanel.innerHTML = `
    <div class="letter-row">
      ${group.letters.map((letter) => `<span class="letter-chip">${escapeHTML(letter)}</span>`).join("")}
    </div>
    <div class="word-list">${wordButtons}</div>
    ${dialogues ? `<div class="word-dialogues">${dialogues}</div>` : ""}
  `;
}

function getVisibleVocabulary() {
  return state.content.vocabulary.filter((item) => {
    const categoryMatches = state.activeCategory === "all" || item.category === state.activeCategory;
    return categoryMatches && matchesQuery([item.russian, item.english, item.zh, item.category]);
  });
}

function renderCategoryFilter() {
  const categories = ["all", ...new Set(state.content.vocabulary.map((item) => item.category))];
  els.categoryFilter.innerHTML = categories.map((category) => {
    const active = category === state.activeCategory ? " is-active" : "";
    const label = categoryLabels[category] || category;
    return `<button class="${active}" data-category="${escapeAttr(category)}" type="button">${escapeHTML(label)}</button>`;
  }).join("");
}

function renderVocabulary() {
  const items = getVisibleVocabulary();
  if (items.length === 0) {
    els.vocabGrid.innerHTML = '<div class="empty-state">No matching phrases.</div>';
    return;
  }

  els.vocabGrid.innerHTML = items.map((item) => `
    <article class="vocab-card">
      <div>
        <span class="category-chip">${escapeHTML(categoryLabels[item.category] || item.category)}</span>
        <div class="vocab-russian">${escapeHTML(item.russian)}</div>
        <div class="vocab-meta">
          <span>${escapeHTML(item.english)}</span>
          <span>${escapeHTML(item.zh)}</span>
        </div>
      </div>
      <button class="icon-button" data-speak="${escapeAttr(item.russian)}" data-audio-id="${escapeAttr(item.id)}" type="button" aria-label="Play ${escapeAttr(item.russian)}" title="Play ${escapeAttr(item.russian)}">▶</button>
    </article>
  `).join("");
}

function renderConversationTabs() {
  els.conversationTabs.innerHTML = state.content.conversations.map((conversation, index) => {
    const active = index === state.activeConversation ? " is-active" : "";
    return `<button class="${active}" data-conversation="${index}" type="button" role="tab">${escapeHTML(conversation.title)}</button>`;
  }).join("");
}

function renderDialogue() {
  const conversation = state.content.conversations[state.activeConversation];
  els.dialoguePanel.innerHTML = conversation.lines.map((line, lineIndex) => `
    <article class="dialogue-line">
      <div class="speaker">${escapeHTML(line.speaker)}</div>
      <div>
        <div class="line-russian">${escapeHTML(line.russian)}</div>
        <div class="line-meta">
          <span>${escapeHTML(line.english)}</span>
          <span>${escapeHTML(line.zh)}</span>
        </div>
      </div>
      <button class="icon-button" data-speak="${escapeAttr(line.russian)}" data-audio-id="${escapeAttr(getConversationAudioId(state.activeConversation, lineIndex))}" type="button" aria-label="Play line" title="Play line">▶</button>
    </article>
  `).join("");
}

function renderSentences() {
  els.sentenceBlocks.innerHTML = state.content.sentences.map((block, blockIndex) => `
    <section class="sentence-block">
      <h3>${escapeHTML(block.title)}</h3>
      <div class="sentence-grid">
        ${block.items.map((item, itemIndex) => `
          <article class="sentence-card">
            <div>
              <div class="sentence-russian">${escapeHTML(item.russian)}</div>
              <div class="sentence-meta">
                <span>${escapeHTML(item.english)}</span>
                <span>${escapeHTML(item.zh)}</span>
              </div>
            </div>
            <button class="icon-button" data-speak="${escapeAttr(item.russian)}" data-audio-id="${escapeAttr(getSentenceAudioId(blockIndex, itemIndex))}" type="button" aria-label="Play sentence" title="Play sentence">▶</button>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeQuiz() {
  const targetIndex = Math.floor(Math.random() * state.content.checklist.length);
  const target = state.content.checklist[targetIndex];
  const distractors = shuffle(state.content.checklist.filter((item) => item.answer !== target.answer)).slice(0, 3);
  state.quiz = {
    target,
    targetAudioId: getChecklistAudioId(targetIndex),
    answers: shuffle([target, ...distractors])
  };
  renderQuiz();
}

function renderQuiz() {
  const { target, answers } = state.quiz;
  els.quizPrompt.textContent = target.prompt;
  els.quizFeedback.textContent = "";
  els.answerList.innerHTML = answers.map((item) => `
    <button class="answer-button" type="button" data-answer="${escapeAttr(item.answer)}">${escapeHTML(item.answer)}</button>
  `).join("");
}

function handleAnswer(button) {
  const { target } = state.quiz;
  const isCorrect = button.dataset.answer === target.answer;
  [...els.answerList.querySelectorAll(".answer-button")].forEach((answer) => {
    answer.disabled = true;
    if (answer.dataset.answer === target.answer) answer.classList.add("is-correct");
  });
  if (!isCorrect) button.classList.add("is-wrong");
  els.quizFeedback.textContent = isCorrect ? "Correct" : `Answer: ${target.answer}`;
}

function renderAll() {
  renderAlphabet();
  renderWordTabs();
  renderWordGroup();
  renderCategoryFilter();
  renderVocabulary();
  renderConversationTabs();
  renderDialogue();
  renderSentences();
  makeQuiz();
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      state.queueToken = 0;
      playRussian(speakButton.dataset.speak, speakButton.dataset.audioId || "");
    }
  });

  els.audioVariant.addEventListener("change", () => {
    state.audioVariant = els.audioVariant.value;
  });

  els.voiceSelect.addEventListener("change", () => {
    state.selectedVoiceURI = els.voiceSelect.value;
  });

  els.stopSpeech.addEventListener("click", () => {
    stopPlayback("TTS stopped");
  });

  els.downloadAudioPack.addEventListener("click", downloadAudioPack);

  els.searchInput.addEventListener("input", () => {
    renderAlphabet();
    renderWordGroup();
    renderVocabulary();
  });

  els.wordTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-word-group]");
    if (!button) return;
    state.activeWordGroup = Number(button.dataset.wordGroup);
    renderWordTabs();
    renderWordGroup();
  });

  els.categoryFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.activeCategory = button.dataset.category;
    renderCategoryFilter();
    renderVocabulary();
  });

  els.conversationTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-conversation]");
    if (!button) return;
    state.activeConversation = Number(button.dataset.conversation);
    renderConversationTabs();
    renderDialogue();
  });

  els.playConversation.addEventListener("click", () => {
    const lines = state.content.conversations[state.activeConversation].lines.map((line, index) => ({
      ...line,
      audioId: getConversationAudioId(state.activeConversation, index)
    }));
    speakQueue(lines);
  });

  els.newQuiz.addEventListener("click", makeQuiz);

  els.quizSpeak.addEventListener("click", () => {
    state.queueToken = 0;
    playRussian(state.quiz.target.answer, state.quiz.targetAudioId);
  });

  els.answerList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (button && !button.disabled) handleAnswer(button);
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
}

async function init() {
  populateVoices();
  bindEvents();

  try {
    const [contentResponse] = await Promise.all([
      fetch("assets/content.json", { cache: "no-cache" }),
      loadAudioManifest(),
      registerServiceWorker()
    ]);
    if (!contentResponse.ok) throw new Error("content");
    state.content = await contentResponse.json();
    renderAll();
  } catch {
    setVoiceStatus("Content load failed");
    els.alphabetGrid.innerHTML = '<div class="empty-state">Content load failed.</div>';
  }
}

init();
