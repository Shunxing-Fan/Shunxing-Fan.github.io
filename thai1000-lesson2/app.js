const vocabulary = [
  { thai: "เป็น", roman: "bpen", tone: "中调", zhTone: "一声", english: "verb to be \"is\"", category: "verb to be" },
  { thai: "อยู่", roman: "yùu", tone: "低调", zhTone: "三声前半段", english: "verb to be \"is\", to be at, to live", category: "verb to be" },
  { thai: "คือ", roman: "khuu", tone: "中调", zhTone: "一声", english: "verb to be \"is\"", category: "verb to be" },
  { thai: "พัก", roman: "phák", tone: "高调", zhTone: "二声", english: "to stay/rest", category: "verb" },
  { thai: "คน", roman: "khon", tone: "中调", zhTone: "一声", english: "human", category: "noun" },
  { thai: "ประเทศ", roman: "bprà-thêet", tone: "低调-降调", zhTone: "三声前半段-四声", english: "country", category: "noun" },
  { thai: "ภาษา", roman: "phaa-sǎa", tone: "中调-升调", zhTone: "一声-二声", english: "language", category: "noun" },
  { thai: "ไทย", roman: "thai", tone: "中调", zhTone: "一声", english: "Thai", category: "country/language" },
  { thai: "จีน", roman: "jiin", tone: "中调", zhTone: "一声", english: "China", category: "country/language" },
  { thai: "ฮ่องกง", roman: "hɔ̂ɔng-gong", tone: "降调-中调", zhTone: "四声-一声", english: "Hong Kong", category: "place" },
  { thai: "ไต้หวัน", roman: "dtâi-wǎn", tone: "降调-升调", zhTone: "四声-二声", english: "Taiwan", category: "place" },
  { thai: "มาเก๊า", roman: "maa-gáo", tone: "中调-高调", zhTone: "一声-二声", english: "Macau", category: "place" },
  { thai: "ญี่ปุ่น", roman: "yîi-bpùn", tone: "降调-低调", zhTone: "四声-三声前半段", english: "Japan", category: "country" },
  { thai: "เกาหลี", roman: "gao-lǐi", tone: "中调-升调", zhTone: "一声-二声", english: "Korea", category: "country" },
  { thai: "ลาว", roman: "laao", tone: "中调", zhTone: "一声", english: "Laos", category: "country" },
  { thai: "กัมพูชา (เขมร)", speak: "กัมพูชา เขมร", roman: "gam-phuu-chaa (kà-měen)", tone: "中调-中调-中调 / 低调-升调", zhTone: "一声-一声-一声 / 三声前半段-二声", english: "Cambodia", category: "country" },
  { thai: "พม่า", roman: "phá-mâa", tone: "高调-降调", zhTone: "二声-四声", english: "Burma", category: "country" },
  { thai: "มาเลเซีย", roman: "maa-lee-sia", tone: "中调-中调-中调", zhTone: "一声-一声-一声", english: "Malaysia", category: "country" },
  { thai: "ฝรั่งเศส", roman: "fà-ràng sèet", tone: "低调-低调-低调", zhTone: "三声前半段-三声前半段-三声前半段", english: "France", category: "country" },
  { thai: "อังกฤษ", roman: "ang-grìt", tone: "中调-低调", zhTone: "一声-三声前半段", english: "England/English", category: "country/language" },
  { thai: "อเมริกา", roman: "a-mee-rí-gaa", tone: "中调-中调-高调-中调", zhTone: "一声-一声-二声-一声", english: "America", category: "country" },
  { thai: "เยอรมัน", roman: "yәә-rá-man", tone: "中调-高调-中调", zhTone: "一声-二声-一声", english: "Germany", category: "country" },
  { thai: "ง่าย", roman: "ngâay", tone: "降调", zhTone: "四声", english: "easy", category: "adjective" },
  { thai: "ยาก", roman: "yâak", tone: "降调", zhTone: "四声", english: "difficult", category: "adjective" },
  { thai: "มาก", roman: "mâak", tone: "降调", zhTone: "四声", english: "a lot / very much", category: "adverb" },
  { thai: "สวย", roman: "sǔay", tone: "升调", zhTone: "二声", english: "beautiful", category: "adjective" },
  { thai: "หล่อ", roman: "lɔ̀ɔ", tone: "低调", zhTone: "三声前半段", english: "handsome", category: "adjective" },
  { thai: "น่ารัก", roman: "nâa-rák", tone: "降调-高调", zhTone: "四声-二声", english: "cute or lovely", category: "adjective" },
  { thai: "เก่ง", roman: "gèng", tone: "低调", zhTone: "三声前半段", english: "excellently / proficiently", category: "adjective" },
  { thai: "ดี", roman: "dii", tone: "中调", zhTone: "一声", english: "good", category: "adjective" },
  { thai: "ฉลาด", roman: "chà-làat", tone: "低调-低调", zhTone: "三声前半段-三声前半段", english: "clever", category: "adjective" },
  { thai: "โง่", roman: "ngôo", tone: "降调", zhTone: "四声", english: "foolish / stupid", category: "adjective" },
  { thai: "ขยัน", roman: "khà-yǎn", tone: "低调-升调", zhTone: "三声前半段-二声", english: "hard working", category: "adjective" },
  { thai: "ขี้เกียจ", roman: "khîi gìiat", tone: "降调-低调", zhTone: "四声-三声前半段", english: "lazy", category: "adjective" },
  { thai: "รวย", roman: "ruay", tone: "中调", zhTone: "一声", english: "rich", category: "adjective" },
  { thai: "จน", roman: "jon", tone: "中调", zhTone: "一声", english: "poor", category: "adjective" },
  { thai: "ใคร", roman: "khrai", tone: "中调", zhTone: "一声", english: "who", category: "question" },
  { thai: "ทำไม", roman: "tham-mai", tone: "中调-中调", zhTone: "一声-一声", english: "why", category: "question" },
  { thai: "อย่างไร / ยังไง", speak: "อย่างไร ยังไง", roman: "yàang-rai / yang-ngai", tone: "低调-中调 / 中调-中调", zhTone: "三声前半段-一声 / 一声-一声", english: "how", category: "question" },
  { thai: "ก็", roman: "gɔ̂ɔ", tone: "降调", zhTone: "四声", english: "also", category: "adverb" },
  { thai: "ไม่", roman: "mâi", tone: "降调", zhTone: "四声", english: "no / not", category: "negation" },
  { thai: "จำ", roman: "jam", tone: "中调", zhTone: "一声", english: "to memorize / remember", category: "verb" },
  { thai: "จำได้", roman: "jam dâi", tone: "中调-降调", zhTone: "一声-四声", english: "able to memorize", category: "verb" },
  { thai: "จำไม่ได้", roman: "jam mâi-dâi", tone: "中调-降调-降调", zhTone: "一声-四声-四声", english: "not able to memorize", category: "verb" }
];

const conversations = [
  {
    title: "Conversation 1",
    lines: [
      { speaker: "หมวย", thai: "คุณ เป็น คน อะไร คะ", roman: "khun bpen khon à-rai khá", english: "What nationality are you?" },
      { speaker: "สมชาย", thai: "ผม เป็น คน ไทย ครับ", roman: "phǒm bpen khon thai khráp", english: "I am Thai." },
      { speaker: "สมชาย", thai: "คุณ หมวย ล่ะ ครับ เป็น คน อะไร", roman: "khun mǔay lâ khráp bpen khon à-rai", english: "What about you, Muay? What is your nationality?" },
      { speaker: "หมวย", thai: "ดิฉัน เป็น คน จีน ค่ะ", roman: "dì-chán bpen khon jiin khâ", english: "I am Chinese." }
    ]
  },
  {
    title: "Conversation 2",
    lines: [
      { speaker: "สมชาย", thai: "คุณ อยู่ ที่ไหน เหรอ ครับ", roman: "khun yùu thîi-nǎi rǒo khráp", english: "Where are you?" },
      { speaker: "หมวย", thai: "ดิฉัน อยู่ ที่ เมกะ บางนา ค่ะ", roman: "dì-chán yùu thîi Mega baang-naa khâ", english: "I am at the Mega Bangna (Department Store)." }
    ]
  },
  {
    title: "Conversation 3",
    lines: [
      { speaker: "สมชาย", thai: "บ้าน คุณ หมวย อยู่ ที่ไหน เหรอ ครับ", roman: "bâan khun mǔay yùu thîi-nǎi rǒo khráp", english: "Khun Muay, where is your house?" },
      { speaker: "หมวย", thai: "บ้าน ดิฉัน อยู่ จิมซาจุ่ย ค่ะ", roman: "bâan dì-chán yùu jim-saa-jùi khâ", english: "My house is in Tsim Sha Tsui." }
    ]
  },
  {
    title: "Conversation 4",
    lines: [
      { speaker: "หมวย", thai: "คุณ สมชาย พูด ภาษาจีน เก่ง จัง ค่ะ", roman: "khun sǒm-chaay phûut phaa-sǎa jiin gèng jang khâ", english: "Somchai, you speak Chinese very well!" },
      { speaker: "สมชาย", thai: "คุณ หมวย ก็ เก่ง มาก เช่น กัน ครับ", roman: "khun mǔay gɔ̂ɔ gèng mâak chên-gan khráp", english: "Khun Muay, you are (speaks well) too!" }
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
  queueToken: 0,
  loopSelected: new Set(),
  loopRunning: false,
  loopToken: 0,
  loopCursor: 0
};

const els = {
  audioVariant: document.querySelector("#audioVariant"),
  voiceSelect: document.querySelector("#voiceSelect"),
  rateControl: document.querySelector("#rateControl"),
  pitchControl: document.querySelector("#pitchControl"),
  downloadAudioPack: document.querySelector("#downloadAudioPack"),
  stopSpeech: document.querySelector("#stopSpeech"),
  voiceStatus: document.querySelector("#voiceStatus"),
  loopCount: document.querySelector("#loopCount"),
  loopGapControl: document.querySelector("#loopGapControl"),
  loopSelectWords: document.querySelector("#loopSelectWords"),
  loopSelectSentences: document.querySelector("#loopSelectSentences"),
  loopClear: document.querySelector("#loopClear"),
  loopStart: document.querySelector("#loopStart"),
  loopStop: document.querySelector("#loopStop"),
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
    let settled = false;
    const finish = (played) => {
      if (settled) return;
      settled = true;
      if (state.currentAudio === audio) state.currentAudio = null;
      if (played) setVoiceStatus("Audio ready");
      resolve(played);
    };

    audio.addEventListener("ended", () => finish(true), { once: true });
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.addEventListener("pause", () => {
      if (!audio.ended) finish(false);
    }, { once: true });
    audio.play().catch(() => {
      finish(false);
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
    await playThai(line.speak || line.thai, line.audioId, true);
    await new Promise((resolve) => setTimeout(resolve, 180));
  }
}

function buildLoopItems() {
  const items = [];
  vocabulary.forEach((item, index) => {
    items.push({
      audioId: getVocabAudioId(index),
      group: "word",
      label: item.thai,
      text: getSpeechText(item)
    });
  });
  conversations.forEach((conversation, conversationIndex) => {
    conversation.lines.forEach((line, lineIndex) => {
      items.push({
        audioId: getConversationAudioId(conversationIndex, lineIndex),
        group: "sentence",
        label: line.thai,
        text: cleanThai(line.speak || line.thai)
      });
    });
  });
  return items;
}

function renderLoopToggle(audioId, label) {
  const checked = state.loopSelected.has(audioId) ? " checked" : "";
  return `
    <label class="loop-check">
      <input type="checkbox" data-loop-id="${audioId}" aria-label="Loop ${label}"${checked}>
      <span>循环</span>
    </label>
  `;
}

function getSelectedLoopItems() {
  return buildLoopItems().filter((item) => state.loopSelected.has(item.audioId));
}

function updateLoopUI() {
  const selectedCount = state.loopSelected.size;
  els.loopCount.textContent = `已选 ${selectedCount} 项`;
  els.loopStart.disabled = state.loopRunning || selectedCount === 0;
  els.loopStop.disabled = !state.loopRunning;
  els.loopStart.querySelector("span:last-child").textContent = state.loopRunning ? "循环中" : "开始循环";
  document.querySelectorAll("[data-loop-id]").forEach((checkbox) => {
    checkbox.checked = state.loopSelected.has(checkbox.dataset.loopId);
  });
}

function setLoopSelected(audioId, selected) {
  if (selected) {
    state.loopSelected.add(audioId);
  } else {
    state.loopSelected.delete(audioId);
  }
  updateLoopUI();
}

function selectLoopGroup(group) {
  buildLoopItems()
    .filter((item) => item.group === group)
    .forEach((item) => state.loopSelected.add(item.audioId));
  updateLoopUI();
}

function clearLoopSelection() {
  state.loopSelected.clear();
  state.loopCursor = 0;
  updateLoopUI();
}

function getLoopGapMs() {
  const rawValue = Number(els.loopGapControl.value);
  const seconds = Math.min(30, Math.max(0, Number.isFinite(rawValue) ? rawValue : 2));
  els.loopGapControl.value = String(seconds);
  return seconds * 1000;
}

function waitForLoopGap(token) {
  const gapMs = getLoopGapMs();
  if (gapMs === 0) return Promise.resolve(true);

  return new Promise((resolve) => {
    const startedAt = Date.now();
    const tick = () => {
      if (!state.loopRunning || state.loopToken !== token) {
        resolve(false);
        return;
      }
      if (Date.now() - startedAt >= gapMs) {
        resolve(true);
        return;
      }
      setTimeout(tick, 100);
    };
    tick();
  });
}

function stopLoop(status = "循环已停止", stopAudio = true) {
  state.loopRunning = false;
  state.loopToken = 0;
  updateLoopUI();
  if (stopAudio) {
    stopPlayback(status);
  } else {
    setVoiceStatus(status);
  }
}

async function startLoop() {
  const initialItems = getSelectedLoopItems();
  if (initialItems.length === 0) {
    setVoiceStatus("请选择循环朗读内容");
    return;
  }

  state.loopRunning = true;
  state.loopToken = Date.now();
  updateLoopUI();
  const token = state.loopToken;

  while (state.loopRunning && state.loopToken === token) {
    const items = getSelectedLoopItems();
    if (items.length === 0) break;
    const item = items[state.loopCursor % items.length];
    state.loopCursor = (state.loopCursor + 1) % items.length;
    setVoiceStatus(`循环 ${state.loopCursor || items.length}/${items.length}: ${item.label}`);
    await playThai(item.text, item.audioId, true);
    if (!state.loopRunning || state.loopToken !== token) break;
    const shouldContinue = await waitForLoopGap(token);
    if (!shouldContinue) break;
  }

  if (state.loopToken === token) stopLoop("循环已停止", false);
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
      "assets/thai-vowels-week2.jpg",
      "assets/audio/manifest.json",
      ...audioFiles
    ];
    const cache = await caches.open("thai1000-lesson2-v2");

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
            ${renderLoopToggle(audioId, item.thai)}
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
        <div class="line-actions">
          ${renderLoopToggle(getConversationAudioId(state.activeConversation, lineIndex), line.thai)}
          <button class="icon-button" data-speak="${line.speak || line.thai}" data-audio-id="${getConversationAudioId(state.activeConversation, lineIndex)}" aria-label="Play line" title="Play line">▶</button>
        </div>
      </article>
    `)
    .join("");
}

function renderToneBoard() {
  const rows = [
    ["เป็น", "identity, nationality, condition"],
    ["อยู่", "location or where someone lives"],
    ["คือ", "introductory “is / namely”"],
    ["ใคร", "who"],
    ["ที่ไหน", "where"]
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
      if (state.loopRunning) stopLoop("循环已停止", false);
      state.queueToken = 0;
      playThai(speakButton.dataset.speak, speakButton.dataset.audioId || "");
    }
  });

  document.body.addEventListener("change", (event) => {
    const loopCheckbox = event.target.closest("[data-loop-id]");
    if (!loopCheckbox) return;
    setLoopSelected(loopCheckbox.dataset.loopId, loopCheckbox.checked);
  });

  els.audioVariant.addEventListener("change", () => {
    state.audioVariant = els.audioVariant.value;
  });

  els.voiceSelect.addEventListener("change", () => {
    state.selectedVoiceURI = els.voiceSelect.value;
  });

  els.stopSpeech.addEventListener("click", () => {
    stopLoop("TTS stopped");
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
    if (state.loopRunning) stopLoop("循环已停止", false);
    const lines = conversations[state.activeConversation].lines.map((line, index) => ({
      ...line,
      audioId: getConversationAudioId(state.activeConversation, index)
    }));
    speakQueue(lines);
  });

  els.downloadAudioPack.addEventListener("click", downloadAudioPack);
  els.loopSelectWords.addEventListener("click", () => selectLoopGroup("word"));
  els.loopSelectSentences.addEventListener("click", () => selectLoopGroup("sentence"));
  els.loopClear.addEventListener("click", clearLoopSelection);
  els.loopStart.addEventListener("click", startLoop);
  els.loopStop.addEventListener("click", () => stopLoop("循环已停止"));
  els.newQuiz.addEventListener("click", makeQuiz);
  els.quizSpeak.addEventListener("click", () => {
    if (state.loopRunning) stopLoop("循环已停止", false);
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
  updateLoopUI();
  bindEvents();
}

init();
