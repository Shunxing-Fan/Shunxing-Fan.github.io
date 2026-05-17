const vocabulary = [
  { thai: "ฉัน", roman: "chǎn", tone: "升调", zhTone: "二声", english: "I (for both sex)", category: "pronoun" },
  { thai: "ผม", roman: "phŏm", tone: "升调", zhTone: "二声", english: "I (for male speaker)", category: "pronoun" },
  { thai: "ดิฉัน / ดิชั้น", speak: "ดิฉัน ดิชั้น", roman: "dì-chǎn / dì-chán", tone: "低调-升调 / 低调-高调", zhTone: "三声前半段-二声 / 三声前半段-二声", english: "I (for female speaker)", category: "pronoun" },
  { thai: "คุณ", roman: "khun", tone: "中调", zhTone: "一声", english: "you / addressing people", category: "pronoun" },
  { thai: "เรา", roman: "rao", tone: "中调", zhTone: "一声", english: "both of us, we, I", category: "pronoun" },
  { thai: "เธอ", roman: "thәә", tone: "中调", zhTone: "一声", english: "you (addressing female)", category: "pronoun" },
  { thai: "เขา / เค้า", speak: "เขา เค้า", roman: "khǎo / kháo", tone: "升调 / 高调", zhTone: "二声 / 二声", english: "he/she", category: "pronoun" },
  { thai: "พวกเขา / พวกเค้า", speak: "พวกเขา พวกเค้า", roman: "phûak khǎo / phûak kháo", tone: "降调-升调 / 降调-高调", zhTone: "四声-二声 / 四声-二声", english: "they", category: "pronoun" },
  { thai: "มัน", roman: "man", tone: "中调", zhTone: "一声", english: "it", category: "pronoun" },
  { thai: "ชื่อ", roman: "chûu", tone: "降调", zhTone: "四声", english: "name", category: "noun" },
  { thai: "สวัสดี", roman: "sà-wàt-dii", tone: "低调-低调-中调", zhTone: "三声前半段-三声前半段-一声", english: "hello", category: "greeting" },
  { thai: "ครับ", roman: "khráp", tone: "高调", zhTone: "二声", english: "polite particle (male speaker)", category: "particle" },
  { thai: "ค่ะ", roman: "khâ", tone: "降调", zhTone: "四声", english: "polite particle (female speaker)", category: "particle" },
  { thai: "คะ", roman: "khá", tone: "高调", zhTone: "二声", english: "polite particle (female speaker in question)", category: "particle" },
  { thai: "สบายดี", roman: "sà-baay dii", tone: "低调-中调-中调", zhTone: "三声前半段-一声-一声", english: "fine", category: "phrase" },
  { thai: "ไหม / มั้ย", speak: "ไหม มั้ย", roman: "mǎi / máy", tone: "升调 / 高调", zhTone: "二声 / 二声", english: "question word, or not", category: "question" },
  { thai: "หรือ / รึ", speak: "หรือ รึ", roman: "rǔu / rú", tone: "升调 / 高调", zhTone: "二声 / 二声", english: "or", category: "question" },
  { thai: "อะไร", roman: "à-rai", tone: "低调-中调", zhTone: "三声前半段-一声", english: "what", category: "question" },
  { thai: "ยินดีที่ได้รู้จัก", roman: "yin-dii thîi dâai rúu-jàk", tone: "中调-中调-降调-降调-高调-低调", zhTone: "一声-一声-四声-四声-二声-三声前半段", english: "happy to know you", category: "phrase" },
  { thai: "เช่นกัน", roman: "chên-gan", tone: "降调-中调", zhTone: "四声-一声", english: "same here", category: "phrase" },
  { thai: "ขอบคุณ", roman: "khɔ̀ɔp-khun", tone: "低调-中调", zhTone: "三声前半段-一声", english: "thank you", category: "phrase" },
  { thai: "ขอบใจ", roman: "khɔ̀ɔp-jai", tone: "低调-中调", zhTone: "三声前半段-一声", english: "thank you", category: "phrase" },
  { thai: "ขอโทษ", roman: "khɔ̌ɔ-thôot", tone: "升调-降调", zhTone: "二声-四声", english: "sorry/excuse me", category: "phrase" },
  { thai: "ไม่เป็นไร", roman: "mâi bpen rai", tone: "降调-中调-中调", zhTone: "四声-一声-一声", english: "it's alright / no problem", category: "phrase" },
  { thai: "ลาก่อน", roman: "laa-gɔ̀ɔn", tone: "中调-低调", zhTone: "一声-三声前半段", english: "goodbye / farewell", category: "greeting" },
  { thai: "แล้วเจอกันใหม่", roman: "lέεw jәә-gan mài", tone: "高调-中调-中调-低调", zhTone: "二声-一声-一声-三声前半段", english: "see you again", category: "greeting" },
  { thai: "แล้วพบกันใหม่", roman: "lέεw phóp-gan mài", tone: "高调-高调-中调-低调", zhTone: "二声-二声-一声-三声前半段", english: "see you again (formal)", category: "greeting" },
  { thai: "เข้าใจ", roman: "khâo jai", tone: "降调-中调", zhTone: "四声-一声", english: "to understand", category: "verb" },
  { thai: "ฟัง", roman: "fang", tone: "中调", zhTone: "一声", english: "to listen", category: "verb" },
  { thai: "พูด", roman: "phûut", tone: "降调", zhTone: "四声", english: "to speak", category: "verb" },
  { thai: "อ่าน", roman: "àan", tone: "低调", zhTone: "三声前半段", english: "to read", category: "verb" },
  { thai: "เขียน", roman: "khǐan", tone: "升调", zhTone: "二声", english: "to write", category: "verb" },
  { thai: "พร้อม ๆ กัน", roman: "phrɔ́ɔm phrɔ́ɔm gan", tone: "高调-高调-中调", zhTone: "二声-二声-一声", english: "together", category: "classroom" },
  { thai: "ดัง ๆ", roman: "dang dang", tone: "中调-中调", zhTone: "一声-一声", english: "loudly", category: "classroom" }
];

const conversations = [
  {
    title: "Conversation 1",
    lines: [
      { speaker: "สมชาย", thai: "สวัสดี ครับ", roman: "sà-wàt-dii khráp", english: "Hello!" },
      { speaker: "หมวย", thai: "สวัสดี ค่ะ", roman: "sà-wàt-dii khâ", english: "Hello!" },
      { speaker: "สมชาย", thai: "คุณ ชื่อ อะไร ครับ", roman: "khun chûu à-rai khráp", english: "What is your name?" },
      { speaker: "หมวย", thai: "ชื่อ หมวย ค่ะ", roman: "chûu mŭay khâ", english: "My name is Muay." },
      { speaker: "หมวย", thai: "คุณ ล่ะ คะ", roman: "khun lâ khá", english: "What about you?" },
      { speaker: "หมวย", thai: "ชื่อ อะไร คะ", roman: "chûu à-rai khá", english: "What is your name?" },
      { speaker: "สมชาย", thai: "ผม ชื่อ สมชาย ครับ", roman: "phŏm chûu sŏm-chaay khráp", english: "My name is Somchai." },
      { speaker: "สมชาย", thai: "ยินดี ที่ ได้ รู้จัก ครับ", roman: "yin-dii thîi dâai rúu-jàk khráp", english: "Nice to meet you!" },
      { speaker: "หมวย", thai: "ยินดี ที่ ได้ รู้จัก เช่นกัน ค่ะ", roman: "yin-dii thîi dâai rúu-jàk chên-gan khâ", english: "Nice to meet you too." }
    ]
  },
  {
    title: "Conversation 2",
    lines: [
      { speaker: "สมชาย", thai: "คุณ หมวย สบายดี มั้ย ครับ", roman: "khun mŭay sà-baay dii máy khráp", english: "Muay, how are you?" },
      { speaker: "หมวย", thai: "ดิชั้น สบาย ดี ค่ะ ขอบคุณ ค่ะ", roman: "dì-chán sà-baay dii khâ khɔ̀ɔp-khun khâ", english: "I am fine. Thank you." },
      { speaker: "หมวย", thai: "คุณ ล่ะ คะ", roman: "khun lâ khá", english: "And you?" },
      { speaker: "หมวย", thai: "สบาย ดี มั้ย", roman: "sà-baay dii máy", english: "How are you?" },
      { speaker: "สมชาย", thai: "ผม ก็ สบายดี ขอบคุณ ครับ", roman: "phŏm gɔ̂ɔ sà-baay dii khɔ̀ɔp-khun khráp", english: "I am fine also. Thank you!" }
    ]
  },
  {
    title: "Conversation 3",
    lines: [
      { speaker: "นักเรียน", thai: "สวัสดี ค่ะ ครับ อาจารย์", roman: "sà-wàt-dii khâ / khráp aa-jaan", english: "Hello, Teacher!" },
      { speaker: "อาจารย์", thai: "สวัสดี ค่ะ ครับ นักเรียน", roman: "sà-wàt-dii khâ / khráp nák-rian", english: "Hello, student!" },
      { speaker: "นักเรียน", thai: "สวัสดี ค่ะ ครับ เพื่อน ๆ", roman: "sà-wàt-dii khâ / khráp phûan phûan", english: "Hello, classmates!" },
      { speaker: "เพื่อน ๆ", thai: "สวัสดี ค่ะ ครับ", roman: "sà-wàt-dii khâ / khráp", english: "Hello!" },
      { speaker: "ทุกคน", thai: "แล้ว พบ กัน ใหม่", roman: "lέεw phóp gan mài", english: "See you again." }
    ]
  }
];

const toneFilters = [
  { id: "all", label: "全部", needle: "" },
  { id: "mid", label: "中调", needle: "中调", className: "tone-mid" },
  { id: "low", label: "低调", needle: "低调", className: "tone-low" },
  { id: "falling", label: "降调", needle: "降调", className: "tone-falling" },
  { id: "high", label: "高调", needle: "高调", className: "tone-high" },
  { id: "rising", label: "升调", needle: "升调", className: "tone-rising" }
];

const state = {
  activeTone: "all",
  activeConversation: 0,
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
  toneFilter: document.querySelector("#toneFilter"),
  vocabGrid: document.querySelector("#vocabGrid"),
  conversationTabs: document.querySelector("#conversationTabs"),
  dialoguePanel: document.querySelector("#dialoguePanel"),
  playConversation: document.querySelector("#playConversation"),
  newQuiz: document.querySelector("#newQuiz"),
  quizThai: document.querySelector("#quizThai"),
  quizRoman: document.querySelector("#quizRoman"),
  quizSpeak: document.querySelector("#quizSpeak"),
  answerList: document.querySelector("#answerList"),
  quizFeedback: document.querySelector("#quizFeedback"),
  toneBoard: document.querySelector("#toneBoard")
};

function cleanThai(text) {
  return text
    .replace(/[/:]/g, " ")
    .replace(/-/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getSpeechText(item) {
  return cleanThai(item.speak || item.thai);
}

function getVocabAudioId(index) {
  return `vocab-${String(index + 1).padStart(2, "0")}`;
}

function getConversationAudioId(conversationIndex, lineIndex) {
  return `conv-${conversationIndex + 1}-${String(lineIndex + 1).padStart(2, "0")}`;
}

function getSelectedVoice() {
  return state.voices.find((voice) => voice.voiceURI === state.selectedVoiceURI) || null;
}

function setVoiceStatus(message) {
  els.voiceStatus.textContent = message;
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

function speakBrowserThai(text, preserveQueue = false) {
  if (!("speechSynthesis" in window)) {
    setVoiceStatus("This browser does not expose TTS");
    return Promise.resolve();
  }

  const phrase = cleanThai(text);
  if (!phrase) return Promise.resolve();

  stopPlayback("TTS ready", preserveQueue);
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

async function playThai(text, audioId = "", preserveQueue = false) {
  if (audioId) {
    const played = await playLocalAudio(audioId);
    if (played) return;
  }
  await speakBrowserThai(text, preserveQueue);
}

async function speakQueue(lines) {
  const token = Date.now();
  state.queueToken = token;
  for (const line of lines) {
    if (state.queueToken !== token) return;
    await playThai(line.thai, line.audioId, true);
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
  const thaiVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("th"));
  const otherVoices = voices.filter((voice) => !voice.lang.toLowerCase().startsWith("th"));
  state.voices = [...thaiVoices, ...otherVoices];

  const previous = state.selectedVoiceURI;
  els.voiceSelect.innerHTML = "";
  const defaultOption = new Option("System default (th-TH)", "");
  els.voiceSelect.append(defaultOption);

  state.voices.forEach((voice) => {
    const label = `${voice.name} · ${voice.lang}`;
    els.voiceSelect.append(new Option(label, voice.voiceURI));
  });

  const bestThaiVoice = thaiVoices[0]?.voiceURI || "";
  state.selectedVoiceURI = previous || bestThaiVoice;
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
      "assets/thai-consonant-poster.jpg",
      "assets/audio/manifest.json",
      ...audioFiles
    ];
    const cache = await caches.open("thai1000-lesson1-v2");

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

function renderToneFilter() {
  els.toneFilter.innerHTML = toneFilters
    .map((tone) => {
      const active = tone.id === state.activeTone ? " is-active" : "";
      return `<button class="${active}" data-tone="${tone.id}" type="button">${tone.label}</button>`;
    })
    .join("");
}

function toneClasses(toneText) {
  return toneFilters
    .filter((tone) => tone.needle && toneText.includes(tone.needle))
    .map((tone) => ({ label: tone.label, className: tone.className }));
}

function renderVocabulary() {
  const query = els.searchInput.value.trim().toLowerCase();
  const activeTone = toneFilters.find((tone) => tone.id === state.activeTone);
  const items = vocabulary.filter((item) => {
    const toneMatches = !activeTone?.needle || item.tone.includes(activeTone.needle);
    const haystack = `${item.thai} ${item.roman} ${item.english} ${item.category}`.toLowerCase();
    return toneMatches && haystack.includes(query);
  });

  if (items.length === 0) {
    els.vocabGrid.innerHTML = '<div class="empty-state">No matching vocabulary.</div>';
    return;
  }

  els.vocabGrid.innerHTML = items
    .map((item) => {
      const audioId = getVocabAudioId(vocabulary.indexOf(item));
      const chips = toneClasses(item.tone)
        .map((tone) => `<span class="chip ${tone.className}">${tone.label}</span>`)
        .join("");
      return `
        <article class="vocab-card">
          <div>
            <div class="thai-word">${item.thai}</div>
            <div class="roman">${item.roman}</div>
            <div class="meaning">${item.english}</div>
            <div class="tone-line">
              ${chips || `<span class="chip">${item.tone}</span>`}
              <span class="chip">${item.zhTone}</span>
            </div>
          </div>
          <button class="icon-button" data-speak="${getSpeechText(item)}" data-audio-id="${audioId}" aria-label="Play ${item.thai}" title="Play ${item.thai}">▶</button>
        </article>
      `;
    })
    .join("");
}

function renderConversationTabs() {
  els.conversationTabs.innerHTML = conversations
    .map((conversation, index) => {
      const active = index === state.activeConversation ? " is-active" : "";
      return `<button class="${active}" data-conversation="${index}" type="button" role="tab">${conversation.title}</button>`;
    })
    .join("");
}

function renderDialogue() {
  const conversation = conversations[state.activeConversation];
  els.dialoguePanel.innerHTML = conversation.lines
    .map((line, lineIndex) => `
      <article class="dialogue-line">
        <div class="speaker">${line.speaker}</div>
        <div>
          <div class="line-thai">${line.thai}</div>
          <div class="line-meta">
            <span>${line.roman}</span>
            <span>${line.english}</span>
          </div>
        </div>
        <button class="icon-button" data-speak="${line.thai}" data-audio-id="${getConversationAudioId(state.activeConversation, lineIndex)}" aria-label="Play line" title="Play line">▶</button>
      </article>
    `)
    .join("");
}

function renderToneBoard() {
  const rows = [
    ["中调", "无调号 · steady level · 中文一声"],
    ["低调", "`à` · low · 中文三声前半段"],
    ["降调", "`â` · falling · 中文四声"],
    ["高调", "`á` · high · 中文二声"],
    ["升调", "`ǎ` · rising · 中文二声"]
  ];
  els.toneBoard.innerHTML = rows
    .map(([tone, detail]) => `<div class="tone-row"><strong>${tone}</strong><span>${detail.replaceAll("`", "")}</span></div>`)
    .join("");
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeQuiz() {
  const targetIndex = Math.floor(Math.random() * vocabulary.length);
  const target = vocabulary[targetIndex];
  const distractors = shuffle(vocabulary.filter((item) => item.english !== target.english)).slice(0, 3);
  const answers = shuffle([target, ...distractors]);
  state.quiz = { target, targetAudioId: getVocabAudioId(targetIndex), answers };
  renderQuiz();
}

function renderQuiz() {
  const { target, answers } = state.quiz;
  els.quizThai.textContent = target.thai;
  els.quizRoman.textContent = target.roman;
  els.quizFeedback.textContent = "";
  els.answerList.innerHTML = answers
    .map((item) => `<button class="answer-button" type="button" data-answer="${item.thai}">${item.english}</button>`)
    .join("");
}

function handleAnswer(button) {
  const { target } = state.quiz;
  const isCorrect = button.dataset.answer === target.thai;
  [...els.answerList.querySelectorAll(".answer-button")].forEach((answer) => {
    answer.disabled = true;
    if (answer.dataset.answer === target.thai) answer.classList.add("is-correct");
  });
  if (!isCorrect) button.classList.add("is-wrong");
  els.quizFeedback.textContent = isCorrect ? "Correct" : `Answer: ${target.english}`;
}

function bindEvents() {
  document.body.addEventListener("click", (event) => {
    const speakButton = event.target.closest("[data-speak]");
    if (speakButton) {
      state.queueToken = 0;
      playThai(speakButton.dataset.speak, speakButton.dataset.audioId || "");
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

  els.searchInput.addEventListener("input", renderVocabulary);

  els.toneFilter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tone]");
    if (!button) return;
    state.activeTone = button.dataset.tone;
    renderToneFilter();
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
    const lines = conversations[state.activeConversation].lines.map((line, index) => ({
      ...line,
      audioId: getConversationAudioId(state.activeConversation, index)
    }));
    speakQueue(lines);
  });

  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.newQuiz.addEventListener("click", makeQuiz);
  els.quizSpeak.addEventListener("click", () => {
    state.queueToken = 0;
    playThai(getSpeechText(state.quiz.target), state.quiz.targetAudioId);
  });

  els.answerList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-answer]");
    if (button && !button.disabled) handleAnswer(button);
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
}

function init() {
  populateVoices();
  loadAudioManifest();
  registerServiceWorker();
  renderToneFilter();
  renderVocabulary();
  renderConversationTabs();
  renderDialogue();
  renderToneBoard();
  makeQuiz();
  bindEvents();
}

init();
