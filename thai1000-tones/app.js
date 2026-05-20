const pitchRanges = {
  standard: { label: "Standard", min: 150, max: 300 },
  male: { label: "Male", min: 110, max: 220 },
  female: { label: "Female", min: 180, max: 360 }
};

const toneOrder = ["mid", "low", "falling", "high", "rising"];

const toneDefinitions = {
  mid: {
    name: "Mid tone",
    thai: "เสียงสามัญ",
    roman: "sĭang sǎa-man",
    levels: () => [3, 3],
    color: "#176b52"
  },
  low: {
    name: "Low tone",
    thai: "เสียงเอก",
    roman: "sĭang èek",
    levels: () => [2, 1],
    color: "#9a5a24"
  },
  falling: {
    name: "Falling tone",
    thai: "เสียงโท",
    roman: "sĭang thoo",
    levels: () => [5, 1],
    color: "#bf3c30"
  },
  high: {
    name: "High tone",
    thai: "เสียงตรี",
    roman: "sĭang dtrii",
    levels: () => state.highToneStyle === "bangkok" ? [3, 3, 4] : [4, 5],
    color: "#d68b1f"
  },
  rising: {
    name: "Rising tone",
    thai: "เสียงจัตวา",
    roman: "sĭang jàt-dtà-waa",
    levels: () => [2, 1, 4],
    color: "#2f6f9f"
  }
};

const state = {
  selectedTone: "mid",
  highToneStyle: "standard",
  audioContext: null,
  activeNodes: [],
  activeToken: 0,
  sequenceToken: 0,
  animationFrame: 0,
  playbackStart: 0,
  playbackDuration: 0,
  playbackContour: [3, 3]
};

const els = {
  rangeSelect: document.querySelector("#rangeSelect"),
  soundSelect: document.querySelector("#soundSelect"),
  durationSelect: document.querySelector("#durationSelect"),
  highToneSelect: document.querySelector("#highToneSelect"),
  playAll: document.querySelector("#playAll"),
  stopAudio: document.querySelector("#stopAudio"),
  toneGrid: document.querySelector("#toneGrid"),
  curveSvg: document.querySelector("#curveSvg"),
  activeToneName: document.querySelector("#activeToneName"),
  activeToneLevels: document.querySelector("#activeToneLevels"),
  activeToneHz: document.querySelector("#activeToneHz"),
  statusText: document.querySelector("#statusText"),
  currentHz: document.querySelector("#currentHz"),
  levelGrid: document.querySelector("#levelGrid")
};

function levelToHz(level, fMin = getRange().min, fMax = getRange().max) {
  return fMin * Math.pow(fMax / fMin, (level - 1) / 4);
}

function getRange() {
  return pitchRanges[els.rangeSelect.value] || pitchRanges.standard;
}

function getDurationSeconds() {
  return Number(els.durationSelect.value) / 1000;
}

function getToneLevels(toneId = state.selectedTone) {
  return toneDefinitions[toneId].levels();
}

function formatLevels(levels) {
  return levels.join(" → ");
}

function formatHz(levels) {
  return levels.map((level) => `${Math.round(levelToHz(level))} Hz`).join(" → ");
}

function interpolateLevel(levels, progress) {
  if (levels.length === 1) return levels[0];
  const clamped = Math.min(1, Math.max(0, progress));
  const segmentCount = levels.length - 1;
  const scaled = clamped * segmentCount;
  const index = Math.min(segmentCount - 1, Math.floor(scaled));
  const segmentProgress = scaled - index;
  return levels[index] + (levels[index + 1] - levels[index]) * segmentProgress;
}

function getAudioContext() {
  if (!state.audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new AudioContextClass();
  }
  return state.audioContext;
}

function schedulePitch(param, levels, startTime, duration) {
  const range = getRange();
  param.cancelScheduledValues(startTime);
  param.setValueAtTime(levelToHz(levels[0], range.min, range.max), startTime);
  if (levels.length === 1) return;
  const segmentDuration = duration / (levels.length - 1);
  for (let index = 1; index < levels.length; index += 1) {
    const nextTime = startTime + segmentDuration * index;
    param.linearRampToValueAtTime(levelToHz(levels[index], range.min, range.max), nextTime);
  }
}

function envelopeGain(gain, startTime, duration, peak = 0.16) {
  const endTime = startTime + duration;
  const attack = Math.min(0.04, duration * 0.12);
  const release = Math.min(0.07, duration * 0.16);
  gain.gain.cancelScheduledValues(startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(peak, startTime + attack);
  gain.gain.setValueAtTime(peak, Math.max(startTime + attack, endTime - release));
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
}

function trackNode(node) {
  state.activeNodes.push(node);
  return node;
}

function stopAudio(status = "Stopped") {
  state.activeToken += 1;
  state.sequenceToken += 1;
  state.activeNodes.forEach((node) => {
    try {
      node.stop(0);
    } catch {
      // Already stopped.
    }
  });
  state.activeNodes = [];
  if (state.animationFrame) cancelAnimationFrame(state.animationFrame);
  state.animationFrame = 0;
  els.statusText.textContent = status;
  els.currentHz.textContent = "F0 -- Hz";
  renderCurve();
}

function buildNoiseBurst(ctx, startTime, duration = 0.045) {
  const sampleCount = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < sampleCount; index += 1) {
    const decay = 1 - index / sampleCount;
    data[index] = (Math.random() * 2 - 1) * decay;
  }

  const noise = trackNode(ctx.createBufferSource());
  const highpass = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  highpass.type = "highpass";
  highpass.frequency.value = 1300;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  noise.buffer = buffer;
  noise.connect(highpass).connect(gain).connect(ctx.destination);
  noise.start(startTime);
  noise.stop(startTime + duration + 0.01);
}

function synthPureTone(ctx, levels, startTime, duration) {
  const oscillator = trackNode(ctx.createOscillator());
  const gain = ctx.createGain();
  oscillator.type = "sine";
  schedulePitch(oscillator.frequency, levels, startTime, duration);
  envelopeGain(gain, startTime, duration, 0.095);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.04);
}

function synthVowel(ctx, levels, startTime, duration, withK = false) {
  const vowelDelay = withK ? 0.045 : 0;
  const vowelStart = startTime + vowelDelay;
  const vowelDuration = Math.max(0.18, duration - vowelDelay);
  const source = trackNode(ctx.createOscillator());
  const master = ctx.createGain();
  const formants = [
    { frequency: 730, q: 8, gain: 0.72 },
    { frequency: 1090, q: 10, gain: 0.38 },
    { frequency: 2440, q: 14, gain: 0.18 }
  ];

  source.type = "sawtooth";
  schedulePitch(source.frequency, levels, vowelStart, vowelDuration);
  envelopeGain(master, vowelStart, vowelDuration, 0.22);

  formants.forEach((formant) => {
    const filter = ctx.createBiquadFilter();
    const formantGain = ctx.createGain();
    filter.type = "bandpass";
    filter.frequency.value = formant.frequency;
    filter.Q.value = formant.q;
    formantGain.gain.value = formant.gain;
    source.connect(filter).connect(formantGain).connect(master);
  });

  master.connect(ctx.destination);
  if (withK) buildNoiseBurst(ctx, startTime);
  source.start(vowelStart);
  source.stop(vowelStart + vowelDuration + 0.04);
}

function animatePlayback(levels, duration, token) {
  const start = performance.now();
  state.playbackStart = start;
  state.playbackDuration = duration;
  state.playbackContour = levels;

  const tick = (now) => {
    if (state.activeToken !== token) return;
    const progress = Math.min(1, (now - start) / (duration * 1000));
    const level = interpolateLevel(levels, progress);
    const hz = levelToHz(level);
    els.currentHz.textContent = `F0 ${Math.round(hz)} Hz`;
    renderCurve({ markerProgress: progress });
    if (progress < 1) {
      state.animationFrame = requestAnimationFrame(tick);
    }
  };

  state.animationFrame = requestAnimationFrame(tick);
}

async function playTone(toneId = state.selectedTone, options = {}) {
  if (!options.keepSequence) stopAudio("Ready");
  state.selectedTone = toneId;
  renderAll();

  const ctx = getAudioContext();
  await ctx.resume();

  const levels = getToneLevels(toneId);
  const duration = getDurationSeconds();
  const startTime = ctx.currentTime + 0.035;
  const token = Date.now();
  state.activeToken = token;
  els.statusText.textContent = `Playing ${toneDefinitions[toneId].name}`;

  if (els.soundSelect.value === "tone") {
    synthPureTone(ctx, levels, startTime, duration);
  } else {
    synthVowel(ctx, levels, startTime, duration, els.soundSelect.value === "kaa");
  }
  animatePlayback(levels, duration, token);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      if (state.activeToken === token) {
        els.statusText.textContent = "Ready";
        els.currentHz.textContent = "F0 -- Hz";
        renderCurve();
      }
      resolve();
    }, duration * 1000 + 110);
  });
}

async function playToneSequence() {
  stopAudio("Ready");
  state.sequenceToken = Date.now();
  const sequenceToken = state.sequenceToken;
  for (const toneId of toneOrder) {
    if (state.sequenceToken !== sequenceToken) return;
    await playTone(toneId, { keepSequence: true });
    if (state.sequenceToken !== sequenceToken) return;
    await new Promise((resolve) => window.setTimeout(resolve, 180));
  }
  if (state.sequenceToken === sequenceToken) {
    els.statusText.textContent = "Ready";
    els.currentHz.textContent = "F0 -- Hz";
  }
}

function pointForLevel(level, progress) {
  const padding = { left: 72, right: 42, top: 38, bottom: 52 };
  const width = 760 - padding.left - padding.right;
  const height = 360 - padding.top - padding.bottom;
  const x = padding.left + width * progress;
  const y = padding.top + ((5 - level) / 4) * height;
  return { x, y };
}

function pathForLevels(levels) {
  return levels
    .map((level, index) => {
      const progress = levels.length === 1 ? 0 : index / (levels.length - 1);
      const point = pointForLevel(level, progress);
      return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");
}

function renderCurve(options = {}) {
  const levels = getToneLevels();
  const markerProgress = options.markerProgress;
  const gridLines = [1, 2, 3, 4, 5].map((level) => {
    const start = pointForLevel(level, 0);
    const end = pointForLevel(level, 1);
    return `
      <line class="graph-grid" x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"></line>
      <text class="graph-label" x="32" y="${start.y + 5}">L${level}</text>
    `;
  }).join("");
  const axisStart = pointForLevel(1, 0);
  const axisEnd = pointForLevel(1, 1);
  const yAxisTop = pointForLevel(5, 0);
  const mutedCurves = toneOrder.map((toneId) => {
    const tone = toneDefinitions[toneId];
    return `<path class="curve-muted" d="${pathForLevels(tone.levels())}" stroke="${tone.color}"></path>`;
  }).join("");
  const markerLevel = typeof markerProgress === "number" ? interpolateLevel(levels, markerProgress) : levels[levels.length - 1];
  const markerPoint = pointForLevel(markerLevel, typeof markerProgress === "number" ? markerProgress : 1);

  els.curveSvg.innerHTML = `
    ${gridLines}
    <line class="graph-axis" x1="${axisStart.x}" y1="${axisStart.y}" x2="${axisEnd.x}" y2="${axisEnd.y}"></line>
    <line class="graph-axis" x1="${axisStart.x}" y1="${axisStart.y}" x2="${yAxisTop.x}" y2="${yAxisTop.y}"></line>
    <text class="graph-label" x="${axisStart.x}" y="333">0 ms</text>
    <text class="graph-label" x="${axisEnd.x - 70}" y="333">${els.durationSelect.value} ms</text>
    ${mutedCurves}
    <path class="curve-active" d="${pathForLevels(levels)}"></path>
    <circle class="curve-marker" cx="${markerPoint.x}" cy="${markerPoint.y}" r="9"></circle>
  `;
}

function renderToneCards() {
  els.toneGrid.innerHTML = toneOrder.map((toneId) => {
    const tone = toneDefinitions[toneId];
    const levels = tone.levels();
    const active = toneId === state.selectedTone ? " is-active" : "";
    return `
      <button class="tone-card${active}" type="button" data-tone="${toneId}" aria-label="Play ${tone.name}">
        <span>
          <span class="tone-name">${tone.name}</span>
          <span class="tone-thai">${tone.thai}</span>
          <span class="tone-meta">
            <span class="chip">${tone.roman}</span>
            <span class="chip">${formatLevels(levels)}</span>
            <span class="chip">${formatHz(levels)}</span>
          </span>
        </span>
        <span class="tone-play" aria-hidden="true">▶</span>
      </button>
    `;
  }).join("");
}

function renderReadout() {
  const tone = toneDefinitions[state.selectedTone];
  const levels = getToneLevels();
  els.activeToneName.textContent = tone.name;
  els.activeToneLevels.textContent = formatLevels(levels);
  els.activeToneHz.textContent = formatHz(levels);
}

function renderLevelGrid() {
  const range = getRange();
  els.levelGrid.innerHTML = [1, 2, 3, 4, 5].map((level) => `
    <article class="level-card">
      <strong>L${level}</strong>
      <span>${Math.round(levelToHz(level, range.min, range.max))} Hz</span>
    </article>
  `).join("");
}

function renderAll() {
  renderToneCards();
  renderReadout();
  renderCurve();
  renderLevelGrid();
}

function bindEvents() {
  els.toneGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tone]");
    if (!button) return;
    playTone(button.dataset.tone);
  });

  els.rangeSelect.addEventListener("change", renderAll);
  els.durationSelect.addEventListener("change", renderAll);
  els.soundSelect.addEventListener("change", () => {
    els.statusText.textContent = "Ready";
  });
  els.highToneSelect.addEventListener("change", () => {
    state.highToneStyle = els.highToneSelect.value;
    renderAll();
  });
  els.playAll.addEventListener("click", playToneSequence);
  els.stopAudio.addEventListener("click", () => stopAudio("Stopped"));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").catch(() => {
    els.statusText.textContent = "Offline cache unavailable";
  });
}

function init() {
  renderAll();
  bindEvents();
  registerServiceWorker();
}

init();
