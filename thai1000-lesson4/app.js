const vocabulary = [
  { thai: "ไป", roman: "bpai", tone: "中调", zhTone: "一声", english: "to go", category: "verb" },
  { thai: "มา", roman: "maa", tone: "中调", zhTone: "一声", english: "to come", category: "verb" },
  { thai: "กลับ", roman: "glàp", tone: "低调", zhTone: "三声前半段", english: "to return", category: "verb" },
  { thai: "ทำงาน", roman: "tham-ngaan", tone: "中调-中调", zhTone: "一声-一声", english: "to work", category: "verb" },
  { thai: "เรียน", roman: "rian", tone: "中调", zhTone: "一声", english: "to study", category: "verb" },
  { thai: "สอน", roman: "sɔ̌ɔn", tone: "升调", zhTone: "二声", english: "to teach", category: "verb" },
  { thai: "ดู", roman: "duu", tone: "中调", zhTone: "一声", english: "to see / watch", category: "verb" },
  { thai: "ฟัง", roman: "fang", tone: "中调", zhTone: "一声", english: "to listen", category: "verb" },
  { thai: "พูด", roman: "phûut", tone: "降调", zhTone: "四声", english: "to speak", category: "verb" },
  { thai: "อ่าน", roman: "àan", tone: "低调", zhTone: "三声前半段", english: "to read", category: "verb" },
  { thai: "เขียน", roman: "khǐan", tone: "升调", zhTone: "二声", english: "to write", category: "verb" },
  { thai: "นอน", roman: "nɔɔn", tone: "中调", zhTone: "一声", english: "to sleep", category: "verb" },
  { thai: "ยืน", roman: "yuun", tone: "中调", zhTone: "一声", english: "to stand", category: "verb" },
  { thai: "เดิน", roman: "dәәn", tone: "中调", zhTone: "一声", english: "to walk", category: "verb" },
  { thai: "นั่ง", roman: "nâng", tone: "降调", zhTone: "四声", english: "to sit", category: "verb" },
  { thai: "วิ่ง", roman: "wîng", tone: "降调", zhTone: "四声", english: "to run", category: "verb" },
  { thai: "เต้น", roman: "dtên", tone: "降调", zhTone: "四声", english: "to dance", category: "verb" },
  { thai: "กระโดด", roman: "grà-dòot", tone: "低调-低调", zhTone: "三声前半段-三声前半段", english: "to jump", category: "verb" },
  { thai: "ร้องเพลง", roman: "rɔ́ɔng-phleeng", tone: "高调-中调", zhTone: "二声-一声", english: "to sing a song", category: "verb" },
  { thai: "ร้องไห้", roman: "rɔ́ɔng-hâi", tone: "高调-降调", zhTone: "二声-四声", english: "to cry", category: "verb" },
  { thai: "ได้ / เป็น", speak: "ได้ เป็น", roman: "dâai / bpen", tone: "降调 / 中调", zhTone: "四声 / 一声", english: "to be able to", category: "ability" },
  { thai: "นิดหน่อย", roman: "nít-nɔ̀ɔy", tone: "高调-低调", zhTone: "二声-三声前半段", english: "a little bit", category: "quantity" },
  { thai: "เล็ก", roman: "lék", tone: "高调", zhTone: "二声", english: "small", category: "adjective" },
  { thai: "ใหญ่", roman: "yài", tone: "低调", zhTone: "三声前半段", english: "big", category: "adjective" },
  { thai: "สูง", roman: "sǔung", tone: "升调", zhTone: "二声", english: "tall", category: "adjective" },
  { thai: "เตี้ย", roman: "dtîa", tone: "降调", zhTone: "四声", english: "short", category: "adjective" },
  { thai: "ผอม", roman: "phɔ̌ɔm", tone: "升调", zhTone: "二声", english: "skinny", category: "adjective" },
  { thai: "อ้วน", roman: "ûan", tone: "降调", zhTone: "四声", english: "fat", category: "adjective" },
  { thai: "แต่", roman: "dtɛ̀ε", tone: "低调", zhTone: "三声前半段", english: "but", category: "connector" }
];

const conversations = [
  {
    title: "Conversation 1",
    lines: [
      { speaker: "สมชาย", thai: "ขอโทษ ครับ คุณ หมวย", roman: "khɔ̌ɔ-thôot khráp khun mǔay", english: "Excuse me, Khun Muay." },
      { speaker: "สมชาย", thai: "ผม ต้อง ขอ ตัว ก่อน นะ ครับ", roman: "phǒm dtɔ̂ng khɔ̌ɔ dtua gɔ̀ɔn ná khráp", english: "I need to leave." },
      { speaker: "สมชาย", thai: "ผม ต้อง ไป เรียน ครับ", roman: "phǒm dtɔ̂ɔng bpai rian khráp", english: "I must go to class." },
      { speaker: "หมวย", thai: "ไม่ เป็น ไร ค่ะ", roman: "mâi bpen rai khâ", english: "It is ok." },
      { speaker: "หมวย", thai: "แล้ว เจอ กัน ใหม่ นะ คะ", roman: "lέεw jәә gan mài ná khá", english: "See you again." },
      { speaker: "สมชาย", thai: "แล้ว เจอ กัน ใหม่ ครับ", roman: "lέεw jәә gan mài khráp", english: "See you again." }
    ]
  },
  {
    title: "Conversation 2",
    lines: [
      { speaker: "หมวย", thai: "กลับ ก่อน นะ จ๊ะ", roman: "glàp gɔ̀ɔn ná já", english: "I'm leaving." },
      { speaker: "สมชาย", thai: "โอเค", roman: "oo-kee", english: "Ok." },
      { speaker: "สมชาย", thai: "แล้ว เจอ กัน ใหม่ จ้ะ", roman: "lέεw jәә gan mài jâ", english: "See you again." }
    ]
  },
  {
    title: "Conversation 3",
    lines: [
      { speaker: "สมชาย", thai: "คุณ หมวย เขียน ภาษา จีน ได้ / เป็น มั้ย ครับ", speak: "คุณ หมวย เขียน ภาษา จีน ได้ เป็น มั้ย ครับ", roman: "khun mǔay khǐan phaa-sǎa jiin dâai / bpen máy khráp", english: "Muay, can you write Chinese?" },
      { speaker: "หมวย", thai: "ได้ / เป็น นิดหน่อย ค่ะ แต่ ไม่ เก่ง", speak: "ได้ เป็น นิดหน่อย ค่ะ แต่ ไม่ เก่ง", roman: "dâai / bpen nít-nɔ̀ɔy khâ dtɛ̀ε mâi gèng", english: "I can write a little bit, but not very well." },
      { speaker: "สมชาย", thai: "ผม สอน ให้ ครับ", roman: "phǒm sɔ̌ɔn hâi khráp", english: "I will teach you." },
      { speaker: "หมวย", thai: "ขอบคุณ มาก ค่ะ คุณ สมชาย", roman: "khɔ̀ɔp-khun mâak khâ khun sǒm-chaay", english: "Thank you very much, Somchai." }
    ]
  },
  {
    title: "Conversation 4",
    lines: [
      { speaker: "สมชาย", thai: "คุณ หมวย ผอม จัง ครับ", roman: "khun mǔay phɔ̌ɔm jang khráp", english: "Khun Muay, you are so skinny." },
      { speaker: "สมชาย", thai: "ไม่ สบาย หรือเปล่า ครับ", roman: "mâi sà-baay rǔu-bplào khráp", english: "Are you sick?" },
      { speaker: "หมวย", thai: "ดิฉัน ไม่ ผอม หรอก ค่ะ", roman: "dì-chán mâi phɔ̌ɔm rɔ̀ɔk khâ", english: "I am not skinny." },
      { speaker: "หมวย", thai: "ดิฉัน กำลัง ลด น้ำหนัก ค่ะ", roman: "dì-chán gam-lang lót náam-nàk khâ", english: "I am on a diet." }
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
  audioElement: null,
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

function getLineSpeech(line) {
  return cleanThai(line.speak || line.thai);
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
  const src = item?.files?.[state.audioVariant];
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
  setVoiceStatus(`Playing ${state.audioVariant}: ${item.text}`);

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
        text: getLineSpeech(line)
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
      "assets/audio/manifest.json",
      ...audioFiles
    ];
    const cache = await caches.open("thai1000-lesson4-v1");

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
          <button class="icon-button" data-speak="${getLineSpeech(line)}" data-audio-id="${getConversationAudioId(state.activeConversation, lineIndex)}" aria-label="Play line" title="Play line">▶</button>
        </div>
      </article>
    `)
    .join("");
}

function renderToneBoard() {
  const rows = [
    ["ไป / มา / กลับ", "go / come / return"],
    ["ต้อง + verb", "must / need to do something"],
    ["ได้ / เป็น", "can / be able to"],
    ["แต่", "but, linking a contrast"],
    ["หรือเปล่า", "yes-or-no question, or not"]
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
      thai: getLineSpeech(line),
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
