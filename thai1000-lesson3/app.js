const vocabulary = [
  { thai: "ที่นี่", roman: "thîi nîi", tone: "降调-高调", zhTone: "四声-二声", english: "here", category: "place" },
  { thai: "ที่นั่น", roman: "thîi nân", tone: "降调-降调", zhTone: "四声-四声", english: "there", category: "place" },
  { thai: "ที่โน่น", roman: "thîi nôon", tone: "降调-降调", zhTone: "四声-四声", english: "there further away", category: "place" },
  { thai: "นี้", roman: "níi", tone: "高调", zhTone: "二声", english: "this", category: "demonstrative" },
  { thai: "นั้น", roman: "nán", tone: "高调", zhTone: "二声", english: "that", category: "demonstrative" },
  { thai: "โน้น", roman: "nóon", tone: "高调", zhTone: "二声", english: "that further away", category: "demonstrative" },
  { thai: "ไหน", roman: "nǎi", tone: "升调", zhTone: "二声", english: "which", category: "question" },
  { thai: "ใช่", roman: "châi", tone: "降调", zhTone: "四声", english: "yes", category: "answer" },
  { thai: "ไหม / มั้ย", speak: "ไหม มั้ย", roman: "mǎi / máy", tone: "升调 / 高调", zhTone: "二声 / 二声", english: "question particle, or not", category: "particle" },
  { thai: "ใช่ไหม / ใช่มั้ย", speak: "ใช่ไหม ใช่มั้ย", roman: "châi mǎi / châi máy", tone: "降调-升调 / 降调-高调", zhTone: "四声-二声 / 四声-二声", english: "...right?", category: "question" },
  { thai: "ไม่ใช่", roman: "mâi châi", tone: "降调-降调", zhTone: "四声-四声", english: "no / not yes", category: "answer" },
  { thai: "ปากกา", roman: "bpàak-gaa", tone: "低调-中调", zhTone: "三声前半段-一声", english: "pen", category: "object" },
  { thai: "ดินสอ", roman: "din-sɔ̌ɔ", tone: "中调-升调", zhTone: "一声-二声", english: "pencil", category: "object" },
  { thai: "สมุด", roman: "sà-mùt", tone: "低调-低调", zhTone: "三声前半段-三声前半段", english: "notebook", category: "object" },
  { thai: "หนังสือ", roman: "nǎng-sǔu", tone: "升调-升调", zhTone: "二声-二声", english: "book", category: "object" },
  { thai: "หนังสือเดินทาง", roman: "nǎng-sǔu dәәn thaang", tone: "升调-升调-中调-中调", zhTone: "二声-二声-一声-一声", english: "passport", category: "object" },
  { thai: "กระเป๋า", roman: "grà-bpǎo", tone: "低调-升调", zhTone: "三声前半段-二声", english: "bag", category: "object" },
  { thai: "ถุง", roman: "thǔng", tone: "升调", zhTone: "二声", english: "bag", category: "object" },
  { thai: "กระดาษ", roman: "grà-dàat", tone: "低调-低调", zhTone: "三声前半段-三声前半段", english: "paper", category: "object" },
  { thai: "พลาสติก", roman: "phláat-sà-dtìk", tone: "高调-低调-低调", zhTone: "二声-三声前半段-三声前半段", english: "plastic", category: "material" },
  { thai: "แผนที่", roman: "phε̌εn-thîi", tone: "升调-降调", zhTone: "二声-四声", english: "map", category: "object" },
  { thai: "โทรศัพท์ (บ้าน/มือถือ)", speak: "โทรศัพท์ บ้าน มือถือ", roman: "thoo-rá-sàp (bâan / muu-thǔu)", tone: "中调-高调-低调", zhTone: "一声-二声-三声前半段", english: "telephone (home/mobile)", category: "object" },
  { thai: "โทรทัศน์ / ทีวี", speak: "โทรทัศน์ ทีวี", roman: "thoo-rá-thát / thii-wii", tone: "中调-高调-高调 / 中调-中调", zhTone: "一声-二声-二声 / 一声-一声", english: "television", category: "object" },
  { thai: "แว่นตา", roman: "wε̂εn dtaa", tone: "降调-中调", zhTone: "四声-一声", english: "eye glasses", category: "object" },
  { thai: "เงิน / ตังค์", speak: "เงิน ตังค์", roman: "ngәn / dtang", tone: "中调 / 中调", zhTone: "一声 / 一声", english: "money", category: "object" },
  { thai: "โต๊ะ", roman: "dtó", tone: "高调", zhTone: "二声", english: "table", category: "object" },
  { thai: "เก้าอี้", roman: "gâo-îi", tone: "降调-降调", zhTone: "四声-四声", english: "chair", category: "object" },
  { thai: "ของ", roman: "khɔ̌ɔng", tone: "升调", zhTone: "二声", english: "thing, belonging to", category: "ownership" },
  { thai: "บน", roman: "bon", tone: "中调", zhTone: "一声", english: "on", category: "position" },
  { thai: "ใต้", roman: "dtâai", tone: "降调", zhTone: "四声", english: "under", category: "position" },
  { thai: "ระหว่าง", roman: "rá-wàang", tone: "高调-低调", zhTone: "二声-三声前半段", english: "between", category: "position" },
  { thai: "กับ", roman: "gàp", tone: "低调", zhTone: "三声前半段", english: "and / with", category: "connector" },
  { thai: "ใน", roman: "nai", tone: "中调", zhTone: "一声", english: "in", category: "position" }
];

const numberItems = [
  { value: "0", thaiDigit: "๐", thai: "ศูนย์", roman: "sǔun" },
  { value: "1", thaiDigit: "๑", thai: "หนึ่ง", roman: "nùng" },
  { value: "2", thaiDigit: "๒", thai: "สอง", roman: "sɔ̌ɔng" },
  { value: "3", thaiDigit: "๓", thai: "สาม", roman: "sǎam" },
  { value: "4", thaiDigit: "๔", thai: "สี่", roman: "sìi" },
  { value: "5", thaiDigit: "๕", thai: "ห้า", roman: "hâa" },
  { value: "6", thaiDigit: "๖", thai: "หก", roman: "hòk" },
  { value: "7", thaiDigit: "๗", thai: "เจ็ด", roman: "jèt" },
  { value: "8", thaiDigit: "๘", thai: "แปด", roman: "bpɛ̀ɛt" },
  { value: "9", thaiDigit: "๙", thai: "เก้า", roman: "gâo" },
  { value: "10", thaiDigit: "๑๐", thai: "สิบ", roman: "sìp" },
  { value: "11", thaiDigit: "๑๑", thai: "สิบเอ็ด", roman: "sìp-èt" },
  { value: "12", thaiDigit: "๑๒", thai: "สิบสอง", roman: "sìp sɔ̌ɔng" },
  { value: "13", thaiDigit: "๑๓", thai: "สิบสาม", roman: "sìp sǎam" },
  { value: "20", thaiDigit: "๒๐", thai: "ยี่สิบ", roman: "yîi sìp" },
  { value: "21", thaiDigit: "๒๑", thai: "ยี่สิบเอ็ด", roman: "yîi sìp-èt" },
  { value: "22", thaiDigit: "๒๒", thai: "ยี่สิบสอง", roman: "yîi sìp sɔ̌ɔng" },
  { value: "30", thaiDigit: "๓๐", thai: "สามสิบ", roman: "sǎam sìp" },
  { value: "31", thaiDigit: "๓๑", thai: "สามสิบเอ็ด", roman: "sǎam sìp-èt" },
  { value: "32", thaiDigit: "๓๒", thai: "สามสิบสอง", roman: "sǎam sìp sɔ̌ɔng" },
  { value: "40", thaiDigit: "๔๐", thai: "สี่สิบ", roman: "sìi sìp" },
  { value: "50", thaiDigit: "๕๐", thai: "ห้าสิบ", roman: "hâa sìp" },
  { value: "60", thaiDigit: "๖๐", thai: "หกสิบ", roman: "hòk sìp" },
  { value: "70", thaiDigit: "๗๐", thai: "เจ็ดสิบ", roman: "jèt sìp" },
  { value: "80", thaiDigit: "๘๐", thai: "แปดสิบ", roman: "bpɛ̀ɛt sìp" },
  { value: "90", thaiDigit: "๙๐", thai: "เก้าสิบ", roman: "gâo sìp" },
  { value: "100", thaiDigit: "๑๐๐", thai: "หนึ่งร้อย", roman: "nùng rɔ́ɔy" },
  { value: "200", thaiDigit: "๒๐๐", thai: "สองร้อย", roman: "sɔ̌ɔng rɔ́ɔy" },
  { value: "300", thaiDigit: "๓๐๐", thai: "สามร้อย", roman: "sǎam rɔ́ɔy" },
  { value: "1000", thaiDigit: "๑๐๐๐", thai: "หนึ่งพัน", roman: "nùng phan" },
  { value: "2000", thaiDigit: "๒๐๐๐", thai: "สองพัน", roman: "sɔ̌ɔng phan" },
  { value: "3000", thaiDigit: "๓๐๐๐", thai: "สามพัน", roman: "sǎam phan" },
  { value: "10,000", thaiDigit: "๑๐๐๐๐", thai: "หนึ่งหมื่น", roman: "nùng mùun" },
  { value: "100,000", thaiDigit: "๑๐๐๐๐๐", thai: "หนึ่งแสน", roman: "nùng sε̌εn" },
  { value: "1,000,000", thaiDigit: "๑๐๐๐๐๐๐", thai: "หนึ่งล้าน", roman: "nùng láan" }
];

const languageTipExamples = [
  {
    thai: "มงก๊ก อยู่ ระหว่าง เยามาเต่ย กับ พรินซ์ เอ็ดเวิร์ด",
    roman: "Mongkok yùu rá-wàang Yau Ma Tei gàp Prince Edward",
    english: "Mongkok is between Yau Ma Tei and Prince Edward.",
    note: "B 是 Mongkok；A 和 C 是左右两个参照点。"
  },
  {
    thai: "พรินซ์ เอ็ดเวิร์ด อยู่ ระหว่าง มงก๊ก กับ ชัม ซุย โป",
    roman: "Prince Edward yùu rá-wàang Mongkok gàp Shum Shui Po",
    english: "Prince Edward is between Mongkok and Shum Shui Po.",
    note: "这句和 Conversation 4 对应，整句重点是位置关系。"
  }
];

const leavePhrases = [
  { thai: "ขอ ตัว สักครู่ (ค่ะ/ครับ)", speak: "ขอ ตัว สักครู่ ค่ะ", roman: "khɔ̌ɔ dtua sàk khrûu (khâ/khráp)", english: "May I be excused for a moment?", usage: "对老师、上级、长辈说，语气最客气；意思是“我可以暂时离开一下吗”。" },
  { thai: "ขอ ตัว ก่อน นะ (คะ/ครับ)", speak: "ขอ ตัว ก่อน นะ คะ", roman: "khɔ̌ɔ dtua gɔ̀ɔn ná (khá/khráp)", english: "May I be excused first?", usage: "比上一句稍口语；ก่อน 表示“先”，นะ 让语气变柔和。" },
  { thai: "ขอ ตัว กลับ ก่อน นะ (คะ/ครับ)", speak: "ขอ ตัว กลับ ก่อน นะ คะ", roman: "khɔ̌ɔ dtua glàp gɔ̀ɔn ná (khá/khráp)", english: "May I take a leave?", usage: "明确说要先回去了；glàp คือ “回去”。" },
  { thai: "กลับ ก่อน นะ (คะ/ครับ)", speak: "กลับ ก่อน นะ คะ", roman: "glàp gɔ̀ɔn ná (khá/khráp)", english: "I go back first.", usage: "对同辈或更熟的人说；少了 ขอ ตัว，所以礼貌程度更轻。" },
  { thai: "ต้อง ไป แล้ว (ค่ะ/ครับ)", speak: "ต้อง ไป แล้ว ค่ะ", roman: "dtɔ̂ɔng bpai lέεw (khâ/khráp)", english: "I have to go.", usage: "ต้อง = 必须；แล้ว 表示状态已经到了“该走了”。" },
  { thai: "ไป ก่อน นะ (คะ/ครับ)", speak: "ไป ก่อน นะ คะ", roman: "bpai gɔ̀ɔn ná (khá/khráp)", english: "I go first.", usage: "自然口语；离开前和朋友、同学说很常见。" },
  { thai: "ไป ละ นะ", speak: "ไป ละ นะ", roman: "bpai lá ná", english: "I'm leaving.", usage: "最随意，适合同辈熟人；正式场合不要用这一句。" }
];

const conversations = [
  {
    title: "Conversation 1",
    lines: [
      { speaker: "หมวย", thai: "นี่ ปากกา ใช่ มั้ย คะ", roman: "nîi bpàak-gaa châi máy khá", english: "This is a pen, is it?" },
      { speaker: "สมชาย", thai: "ใช่ ครับ นั่น ปากกา ครับ", roman: "châi khráp nân bpàak-gaa khráp", english: "Yes, that is a pen." }
    ]
  },
  {
    title: "Conversation 2",
    lines: [
      { speaker: "หมวย", thai: "นั่น หนังสือ ใช่ มั้ย คะ", roman: "nân nǎng-sǔu châi máy khá", english: "Is that a book?" },
      { speaker: "สมชาย", thai: "ไม่ ใช่ ครับ นั่น สมุด ครับ", roman: "mâi châi khráp nân sà-mùt khráp", english: "No, that is a notebook." }
    ]
  },
  {
    title: "Conversation 3",
    lines: [
      { speaker: "สมชาย", thai: "กระเป๋า ของ คุณ หมวย อยู่ ที่ไหน ครับ", roman: "grà-bpǎo (khɔ̌ɔng) khun mǔay yùu thîi nǎi khráp", english: "Muay, where is your bag?" },
      { speaker: "หมวย", thai: "กระเป๋า ของ ดิฉัน อยู่ ใต้ เก้าอี้ ค่ะ", roman: "grà-bpǎo (khɔ̌ɔng) dì-chán yùu dtâai gâo-îi khâ", english: "My bag is under the chair." }
    ]
  },
  {
    title: "Conversation 4",
    lines: [
      { speaker: "สมชาย", thai: "Prince Edward อยู่ ที่ไหน ครับ", speak: "พรินซ์ เอ็ดเวิร์ด อยู่ ที่ไหน ครับ", roman: "Prince Edward yùu thîi nǎi khráp", english: "Where is Prince Edward?" },
      { speaker: "หมวย", thai: "Prince Edward อยู่ ระหว่าง Mongkok กับ Shum Shui Po ค่ะ", speak: "พรินซ์ เอ็ดเวิร์ด อยู่ ระหว่าง มงก๊ก กับ ชัม ซุย โป ค่ะ", roman: "Prince Edward yùu rá-wàang Mongkok gàp Shum Shui Po khâ", english: "Prince Edward is between Mongkok and Shum Shui Po." },
      { speaker: "สมชาย", thai: "ขอบคุณ ครับ", roman: "khɔ̀ɔp-khun khráp", english: "Thank you." }
    ]
  },
  {
    title: "Conversation 5",
    lines: [
      { speaker: "หมวย", thai: "อาจารย์ คะ ขอ ตัว ไป ห้องน้ำ ค่ะ", roman: "aa-jaan khá khɔ̌ɔ dtua bpai hɔ̂ɔng-náam khâ", english: "Teacher, I would like to go to the toilet." },
      { speaker: "สมชาย", thai: "เชิญ ครับ", roman: "chәәn khráp", english: "Please go." }
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
  numbersGrid: document.querySelector("#numbersGrid"),
  languageTipExamples: document.querySelector("#languageTipExamples"),
  phraseGrid: document.querySelector("#phraseGrid"),
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

function getNumberAudioId(index) {
  return `number-${String(index + 1).padStart(2, "0")}`;
}

function getTipAudioId(index) {
  return `tip-${String(index + 1).padStart(2, "0")}`;
}

function getPhraseAudioId(index) {
  return `phrase-${String(index + 1).padStart(2, "0")}`;
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
  numberItems.forEach((item, index) => {
    items.push({
      audioId: getNumberAudioId(index),
      group: "word",
      label: item.thai,
      text: getSpeechText(item)
    });
  });
  languageTipExamples.forEach((item, index) => {
    items.push({
      audioId: getTipAudioId(index),
      group: "sentence",
      label: item.thai,
      text: getSpeechText(item)
    });
  });
  leavePhrases.forEach((item, index) => {
    items.push({
      audioId: getPhraseAudioId(index),
      group: "sentence",
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
    const cache = await caches.open("thai1000-lesson3-v3");

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

function renderNumbers() {
  els.numbersGrid.innerHTML = numberItems
    .map((item, index) => `
      <article class="number-card">
        <div class="number-value">${item.value}</div>
        <div>
          <div class="thai-word">${item.thai}</div>
          <div class="roman">${item.roman}</div>
          <div class="meaning">Thai digit: ${item.thaiDigit}</div>
          ${renderLoopToggle(getNumberAudioId(index), item.thai)}
        </div>
        <button class="icon-button" data-speak="${item.thai}" data-audio-id="${getNumberAudioId(index)}" aria-label="Play ${item.value}" title="Play ${item.value}">▶</button>
      </article>
    `)
    .join("");
}

function renderLanguageTips() {
  els.languageTipExamples.innerHTML = languageTipExamples
    .map((item, index) => `
      <article class="sentence-card">
        <div>
          <div class="line-thai">${item.thai}</div>
          <div class="line-meta">
            <span>${item.roman}</span>
            <span>${item.english}</span>
          </div>
          <p>${item.note}</p>
          ${renderLoopToggle(getTipAudioId(index), item.thai)}
        </div>
        <button class="icon-button" data-speak="${item.thai}" data-audio-id="${getTipAudioId(index)}" aria-label="Play example" title="Play example">▶</button>
      </article>
    `)
    .join("");
}

function renderLeavePhrases() {
  els.phraseGrid.innerHTML = leavePhrases
    .map((item, index) => `
      <article class="sentence-card">
        <div>
          <div class="line-thai">${item.thai}</div>
          <div class="line-meta">
            <span>${item.roman}</span>
            <span>${item.english}</span>
          </div>
          <p>${item.usage}</p>
          ${renderLoopToggle(getPhraseAudioId(index), item.thai)}
        </div>
        <button class="icon-button" data-speak="${getSpeechText(item)}" data-audio-id="${getPhraseAudioId(index)}" aria-label="Play phrase" title="Play phrase">▶</button>
      </article>
    `)
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
    ["ที่นี่ / ที่นั่น / ที่โน่น", "near speaker / farther / further away"],
    ["นี้ / นั้น / โน้น", "this / that / that over there"],
    ["ใช่ไหม", "turns a statement into “..., right?”"],
    ["อยู่ ระหว่าง A กับ C", "is between A and C"],
    ["ขอ ตัว", "polite opener before excusing yourself"]
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
  renderNumbers();
  renderLanguageTips();
  renderLeavePhrases();
  renderConversationTabs();
  renderDialogue();
  renderToneBoard();
  makeQuiz();
  updateLoopUI();
  bindEvents();
}

init();
