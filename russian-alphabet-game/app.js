const letters = [
  { cyrillic: "А", latin: "a", group: "familiar", groupLabel: "А К М О Т", note: "像英文字母且可信" },
  { cyrillic: "К", latin: "k", group: "familiar", groupLabel: "А К М О Т", note: "像英文字母且可信" },
  { cyrillic: "М", latin: "m", group: "familiar", groupLabel: "А К М О Т", note: "像英文字母且可信" },
  { cyrillic: "О", latin: "o", group: "familiar", groupLabel: "А К М О Т", note: "像英文字母且可信" },
  { cyrillic: "Т", latin: "t", group: "familiar", groupLabel: "А К М О Т", note: "像英文字母且可信" },

  { cyrillic: "В", latin: "v", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },
  { cyrillic: "Н", latin: "n", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },
  { cyrillic: "Р", latin: "r", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },
  { cyrillic: "С", latin: "s", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },
  { cyrillic: "У", latin: "u", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },
  { cyrillic: "Х", latin: "h", group: "danger", groupLabel: "В Н Р С У Х", note: "像英文字母且危险" },

  { cyrillic: "Б", latin: "b", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Г", latin: "g", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Д", latin: "d", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "З", latin: "z", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "И", latin: "i", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Й", latin: "y", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Л", latin: "l", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "П", latin: "p", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Ф", latin: "f", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },
  { cyrillic: "Э", latin: "e", group: "regular", groupLabel: "Б Г Д З И Й Л П Ф Э", note: "陌生但规律" },

  { cyrillic: "Ж", latin: "zh", group: "clusters", groupLabel: "Ж Ц Ч Ш Щ", note: "zh / ts / ch / sh / shch" },
  { cyrillic: "Ц", latin: "ts", group: "clusters", groupLabel: "Ж Ц Ч Ш Щ", note: "zh / ts / ch / sh / shch" },
  { cyrillic: "Ч", latin: "ch", group: "clusters", groupLabel: "Ж Ц Ч Ш Щ", note: "zh / ts / ch / sh / shch" },
  { cyrillic: "Ш", latin: "sh", group: "clusters", groupLabel: "Ж Ц Ч Ш Щ", note: "zh / ts / ch / sh / shch" },
  { cyrillic: "Щ", latin: "shch", group: "clusters", groupLabel: "Ж Ц Ч Ш Щ", note: "zh / ts / ch / sh / shch" },

  { cyrillic: "Е", latin: "ye", group: "softening", groupLabel: "Е Ё Ю Я", note: "ye / yo / yu / ya" },
  { cyrillic: "Ё", latin: "yo", group: "softening", groupLabel: "Е Ё Ю Я", note: "ye / yo / yu / ya" },
  { cyrillic: "Ю", latin: "yu", group: "softening", groupLabel: "Е Ё Ю Я", note: "ye / yo / yu / ya" },
  { cyrillic: "Я", latin: "ya", group: "softening", groupLabel: "Е Ё Ю Я", note: "ye / yo / yu / ya" }
];

const groups = [
  { id: "familiar", title: "А К М О Т", subtitle: "像英文字母且可信" },
  { id: "danger", title: "В Н Р С У Х", subtitle: "像英文字母且危险" },
  { id: "regular", title: "Б Г Д З И Й Л П Ф Э", subtitle: "陌生但规律" },
  { id: "clusters", title: "Ж Ц Ч Ш Щ", subtitle: "zh / ts / ch / sh / shch" },
  { id: "softening", title: "Е Ё Ю Я", subtitle: "ye / yo / yu / ya" }
];

const state = {
  mode: "casual",
  groupId: "familiar",
  deck: [],
  index: 0,
  current: null,
  answered: false,
  correct: 0,
  total: 0,
  mistakes: []
};

const els = {
  correctCount: document.querySelector("#correctCount"),
  totalCount: document.querySelector("#totalCount"),
  accuracyText: document.querySelector("#accuracyText"),
  modeTabs: document.querySelector("#modeTabs"),
  groupList: document.querySelector("#groupList"),
  restartButton: document.querySelector("#restartButton"),
  modeLabel: document.querySelector("#modeLabel"),
  progressText: document.querySelector("#progressText"),
  questionPanel: document.querySelector(".question-panel"),
  questionLetter: document.querySelector("#questionLetter"),
  questionGroup: document.querySelector("#questionGroup"),
  feedback: document.querySelector("#feedback"),
  optionsGrid: document.querySelector("#optionsGrid"),
  nextButton: document.querySelector("#nextButton"),
  resultPanel: document.querySelector("#resultPanel"),
  resultTitle: document.querySelector("#resultTitle"),
  resultStats: document.querySelector("#resultStats"),
  mistakeList: document.querySelector("#mistakeList")
};

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function choice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function formatAccuracy(correct, total) {
  if (total === 0) return "0%";
  return `${Math.round((correct / total) * 100)}%`;
}

function getModeTitle() {
  if (state.mode === "casual") return "Casual · 随机";
  if (state.mode === "loop") return "Loop · 30 字母";
  const group = groups.find((item) => item.id === state.groupId);
  return `按组 · ${group.title}`;
}

function getPool() {
  if (state.mode === "group") {
    return letters.filter((letter) => letter.group === state.groupId);
  }
  return letters;
}

function buildOptions(answer) {
  const distractors = shuffle(letters.filter((letter) => letter.latin !== answer.latin))
    .slice(0, 9)
    .map((letter) => letter.latin);
  return shuffle([answer.latin, ...distractors]);
}

function resetStats() {
  state.correct = 0;
  state.total = 0;
  state.mistakes = [];
}

function resetDeck() {
  state.deck = state.mode === "casual" ? [] : shuffle(getPool());
  state.index = 0;
}

function setMode(mode) {
  state.mode = mode;
  resetStats();
  resetDeck();
  renderModeTabs();
  renderGroupList();
  hideResults();
  nextQuestion();
}

function setGroup(groupId) {
  state.mode = "group";
  state.groupId = groupId;
  resetStats();
  resetDeck();
  renderModeTabs();
  renderGroupList();
  hideResults();
  nextQuestion();
  if (window.matchMedia("(max-width: 760px)").matches) {
    window.requestAnimationFrame(() => {
      els.questionPanel.scrollIntoView({ block: "start", behavior: "smooth" });
    });
  }
}

function restart() {
  resetStats();
  resetDeck();
  hideResults();
  nextQuestion();
}

function nextQuestion() {
  state.answered = false;
  els.nextButton.hidden = true;
  els.feedback.textContent = "Ready";
  els.feedback.className = "feedback";

  if (state.mode === "casual") {
    state.current = choice(letters);
  } else {
    if (state.index >= state.deck.length) {
      showResults();
      return;
    }
    state.current = state.deck[state.index];
  }

  renderQuestion();
  renderStats();
}

function renderQuestion() {
  const current = state.current;
  els.modeLabel.textContent = getModeTitle();
  els.questionLetter.textContent = current.cyrillic;
  els.questionGroup.hidden = state.mode !== "group";
  els.questionGroup.textContent = state.mode === "group" ? current.groupLabel : "";

  if (state.mode === "casual") {
    els.progressText.textContent = "∞";
  } else {
    els.progressText.textContent = `${state.index + 1} / ${state.deck.length}`;
  }

  const options = buildOptions(current);
  els.optionsGrid.innerHTML = options.map((option) => (
    `<button class="option-button" type="button" data-option="${option}">${option}</button>`
  )).join("");
}

function renderStats() {
  els.correctCount.textContent = state.correct;
  els.totalCount.textContent = state.total;
  els.accuracyText.textContent = formatAccuracy(state.correct, state.total);
}

function answer(option, button) {
  if (state.answered) return;
  state.answered = true;
  const correct = option === state.current.latin;

  state.total += 1;
  if (correct) {
    state.correct += 1;
    els.feedback.textContent = "Correct";
    els.feedback.classList.add("is-correct");
  } else {
    state.mistakes.push({
      cyrillic: state.current.cyrillic,
      correct: state.current.latin,
      picked: option,
      group: state.current.groupLabel
    });
    els.feedback.textContent = `${state.current.cyrillic} = ${state.current.latin}`;
    els.feedback.classList.add("is-wrong");
  }

  [...els.optionsGrid.querySelectorAll(".option-button")].forEach((item) => {
    item.disabled = true;
    if (item.dataset.option === state.current.latin) item.classList.add("is-correct");
  });
  if (!correct) button.classList.add("is-wrong");

  if (state.mode !== "casual") state.index += 1;
  renderStats();
  els.nextButton.hidden = false;
}

function showResults() {
  els.questionLetter.textContent = "✓";
  els.questionGroup.hidden = true;
  els.questionGroup.textContent = "";
  els.optionsGrid.innerHTML = "";
  els.feedback.textContent = "Done";
  els.feedback.className = "feedback is-correct";
  els.nextButton.hidden = true;

  els.resultPanel.hidden = false;
  els.resultTitle.textContent = state.mode === "group" ? "分组结果" : "Loop 结果";
  els.resultStats.innerHTML = `
    <div><span>正确</span><strong>${state.correct}</strong></div>
    <div><span>总数</span><strong>${state.total}</strong></div>
    <div><span>正确率</span><strong>${formatAccuracy(state.correct, state.total)}</strong></div>
  `;

  if (state.mistakes.length === 0) {
    els.mistakeList.innerHTML = '<div class="perfect">本轮没有错题</div>';
    return;
  }

  els.mistakeList.innerHTML = state.mistakes.map((item) => `
    <div class="mistake-row">
      <strong>${item.cyrillic}</strong>
      <span>你选了 ${item.picked}</span>
      <span>正确答案 ${item.correct}</span>
    </div>
  `).join("");
}

function hideResults() {
  els.resultPanel.hidden = true;
  els.resultStats.innerHTML = "";
  els.mistakeList.innerHTML = "";
}

function renderModeTabs() {
  [...els.modeTabs.querySelectorAll("[data-mode]")].forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
}

function renderGroupList() {
  if (state.mode !== "group") {
    els.groupList.hidden = true;
    els.groupList.innerHTML = "";
    return;
  }

  els.groupList.hidden = false;
  els.groupList.innerHTML = groups.map((group) => {
    const active = state.mode === "group" && group.id === state.groupId ? " is-active" : "";
    return `
      <button class="group-button${active}" type="button" data-group="${group.id}">
        <strong>${group.title}</strong>
        <span>${group.subtitle}</span>
      </button>
    `;
  }).join("");
}

function bindEvents() {
  els.modeTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button) return;
    setMode(button.dataset.mode);
  });

  els.groupList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-group]");
    if (!button) return;
    setGroup(button.dataset.group);
  });

  els.restartButton.addEventListener("click", restart);
  els.nextButton.addEventListener("click", nextQuestion);

  els.optionsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option]");
    if (!button || button.disabled) return;
    answer(button.dataset.option, button);
  });
}

function init() {
  renderModeTabs();
  renderGroupList();
  bindEvents();
  resetDeck();
  nextQuestion();
}

init();
