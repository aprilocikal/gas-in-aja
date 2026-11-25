// Groovy Lo-Fi Chillhop Study Beat Engine (Web Audio API)
// Real multi-track beat: soft kick, warm snare, swung hi-hats, jazzy Rhodes chords, bass & catchy lead

const BGM_STORAGE_KEY = 'kinetix_bgm_enabled'
const BGM_VOLUME_KEY = 'kinetix_bgm_volume'
const DEFAULT_BGM_VOLUME = 0.7
const MAX_MASTER_GAIN = 0.45

// 82 BPM => 16th note = 0.183s (with subtle lo-fi swing on off-beat 16ths)
const SIXTEENTH_SEC = 60 / 82 / 4
const STEPS_PER_BAR = 16

// Classic chillhop 4-bar chord loop: Fmaj7 -> Em7 -> Dm7 -> Cmaj9
const LOFI_BARS = [
  {
    bass: [174.61, 174.61, 130.81], // F3, F3, C3
    chord: [261.63, 329.63, 392.0, 440.0], // C4 E4 G4 A4 (Fmaj7 voicing)
    lead: { 0: 659.25, 3: 587.33, 6: 523.25, 10: 659.25, 14: 783.99 },
  },
  {
    bass: [164.81, 164.81, 196.0], // E3, E3, G3
    chord: [246.94, 293.66, 392.0, 493.88], // B3 D4 G4 B4 (Em7 voicing)
    lead: { 0: 783.99, 4: 659.25, 7: 587.33, 11: 523.25, 14: 587.33 },
  },
  {
    bass: [146.83, 146.83, 164.81], // D3, D3, E3
    chord: [261.63, 293.66, 349.23, 440.0], // C4 D4 F4 A4 (Dm7 voicing)
    lead: { 0: 523.25, 3: 587.33, 6: 659.25, 10: 587.33, 13: 523.25 },
  },
  {
    bass: [130.81, 130.81, 146.83], // C3, C3, D3
    chord: [246.94, 293.66, 329.63, 392.0], // B3 D4 E4 G4 (Cmaj9 voicing)
    lead: { 0: 659.25, 4: 523.25, 8: 587.33, 11: 659.25, 14: 523.25 },
  },
]

let currentVolume = DEFAULT_BGM_VOLUME
let bgmCtx = null
let masterGain = null
let musicBus = null
let noiseBuffer = null
let loopTimer = null
let stepIndex = 0
let isPlaying = false
let isDucked = false

function computeTargetGain() {
  const base = Math.max(0.02, Math.min(MAX_MASTER_GAIN, currentVolume * MAX_MASTER_GAIN))
  return isDucked ? base * 0.2 : base
}

export function getFocusBgmVolume() {
  if (typeof window === 'undefined') return DEFAULT_BGM_VOLUME
  const raw = Number(localStorage.getItem(BGM_VOLUME_KEY))
  if (Number.isFinite(raw) && raw >= 0.05 && raw <= 1) {
    currentVolume = raw
    return raw
  }
  currentVolume = DEFAULT_BGM_VOLUME
  return DEFAULT_BGM_VOLUME
}

export function setFocusBgmVolume(vol) {
  const clamped = Math.max(0.05, Math.min(1, Math.round(Number(vol) * 100) / 100))
  currentVolume = clamped
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(BGM_VOLUME_KEY, String(clamped))
    } catch {
      // ignore storage errors
    }
  }
  if (isPlaying && bgmCtx && masterGain) {
    const now = bgmCtx.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
    masterGain.gain.linearRampToValueAtTime(computeTargetGain(), now + 0.12)
  }
  return clamped
}

export function isFocusBgmEnabled() {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(BGM_STORAGE_KEY) !== 'false'
}

export function setFocusBgmEnabled(enabled) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(BGM_STORAGE_KEY, enabled ? 'true' : 'false')
  } catch {
    // ignore storage errors
  }
  if (enabled) {
    startFocusBgm()
  } else {
    stopFocusBgm()
  }
}

function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer
  const len = Math.floor(ctx.sampleRate * 0.25)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  noiseBuffer = buf
  return buf
}

function ensureAudioGraph() {
  if (typeof window === 'undefined') return null
  if (!bgmCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    bgmCtx = new AudioContextClass()

    // Warm lo-fi tone shaping bus
    musicBus = bgmCtx.createBiquadFilter()
    musicBus.type = 'lowpass'
    musicBus.frequency.value = 3400
    musicBus.Q.value = 0.7

    masterGain = bgmCtx.createGain()
    masterGain.gain.value = 0.0001

    musicBus.connect(masterGain)
    masterGain.connect(bgmCtx.destination)
  }
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }
  return bgmCtx
}

// 1. Soft punchy lo-fi kick drum
function playKick(ctx, t, vel = 0.55) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(128, t)
  osc.frequency.exponentialRampToValueAtTime(46, t + 0.085)

  gain.gain.setValueAtTime(0.001, t)
  gain.gain.linearRampToValueAtTime(vel, t + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)

  osc.connect(gain)
  gain.connect(masterGain)
  osc.start(t)
  osc.stop(t + 0.24)
}

// 2. Warm brushed lo-fi snare / rimshot
function playSnare(ctx, t, vel = 0.24) {
  const src = ctx.createBufferSource()
  src.buffer = getNoiseBuffer(ctx)

  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1850
  bp.Q.value = 1.1

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.001, t)
  gain.gain.linearRampToValueAtTime(vel, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14)

  src.connect(bp)
  bp.connect(gain)
  gain.connect(masterGain)
  src.start(t)
  src.stop(t + 0.16)

  // Subtle wooden body tap
  const body = ctx.createOscillator()
  const bg = ctx.createGain()
  body.type = 'triangle'
  body.frequency.setValueAtTime(210, t)
  body.frequency.exponentialRampToValueAtTime(135, t + 0.05)
  bg.gain.setValueAtTime(vel * 0.45, t)
  bg.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
  body.connect(bg)
  bg.connect(masterGain)
  body.start(t)
  body.stop(t + 0.08)
}

// 3. Soft crisp hi-hat tick
function playHat(ctx, t, vel = 0.08, open = false) {
  const src = ctx.createBufferSource()
  src.buffer = getNoiseBuffer(ctx)

  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 6500

  const dur = open ? 0.11 : 0.04
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.001, t)
  gain.gain.linearRampToValueAtTime(vel, t + 0.003)
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur)

  src.connect(hp)
  hp.connect(gain)
  gain.connect(masterGain)
  src.start(t)
  src.stop(t + dur + 0.01)
}

// 4. Warm Rhodes electric-piano chord stab
function playRhodesChord(ctx, notes, t, dur = 1.35, peak = 0.095) {
  notes.forEach((freq, idx) => {
    const start = t + idx * 0.018
    const osc = ctx.createOscillator()
    const oscBell = ctx.createOscillator()
    const g = ctx.createGain()
    const gb = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, start)
    oscBell.type = 'triangle'
    oscBell.frequency.setValueAtTime(freq * 2, start)
    // Tiny warm chorus detune
    oscBell.detune.setValueAtTime(idx % 2 === 0 ? 4 : -4, start)

    g.gain.setValueAtTime(0.0001, start)
    g.gain.linearRampToValueAtTime(peak, start + 0.018)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)

    gb.gain.setValueAtTime(0.0001, start)
    gb.gain.linearRampToValueAtTime(peak * 0.16, start + 0.01)
    gb.gain.exponentialRampToValueAtTime(0.0001, start + dur * 0.35)

    osc.connect(g)
    g.connect(musicBus)
    oscBell.connect(gb)
    gb.connect(musicBus)

    osc.start(start)
    osc.stop(start + dur + 0.04)
    oscBell.start(start)
    oscBell.stop(start + dur * 0.4 + 0.04)
  })
}

// 5. Groovy rounded chillhop bass note
function playBass(ctx, freq, t, dur = 0.45, peak = 0.24) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, t)

  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(peak, t + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

  osc.connect(gain)
  gain.connect(musicBus)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

// 6. Catchy soft electric-piano / pluck lead melody
function playLead(ctx, freq, t, dur = 0.48, peak = 0.115) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, t)

  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(peak, t + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)

  osc.connect(gain)
  gain.connect(musicBus)
  osc.start(t)
  osc.stop(t + dur + 0.03)
}

function scheduleStep() {
  if (!isPlaying || !bgmCtx || !musicBus) return
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }

  const barIdx = Math.floor(stepIndex / STEPS_PER_BAR) % LOFI_BARS.length
  const step = stepIndex % STEPS_PER_BAR
  const bar = LOFI_BARS[barIdx]
  stepIndex += 1

  // Subtle lo-fi swing on odd 16th notes
  const swingDelay = step % 2 === 1 ? SIXTEENTH_SEC * 0.18 : 0
  const t = bgmCtx.currentTime + 0.03 + swingDelay

  // Drum groove (classic chillhop boom-bap pattern)
  if (step === 0 || step === 7 || step === 10) {
    playKick(bgmCtx, t, step === 0 ? 0.56 : 0.42)
  }
  if (step === 4 || step === 12) {
    playSnare(bgmCtx, t, 0.24)
  }
  if (step % 2 === 0) {
    playHat(bgmCtx, t, step % 4 === 0 ? 0.075 : 0.048, step === 14)
  }

  // Rhodes chords: main hit on beat 1, warm syncopated bounce on step 10
  if (step === 0) {
    playRhodesChord(bgmCtx, bar.chord, t, 1.55, 0.095)
  } else if (step === 10) {
    playRhodesChord(bgmCtx, bar.chord, t, 0.85, 0.068)
  }

  // Bouncy bassline locked to kick
  if (step === 0) playBass(bgmCtx, bar.bass[0], t, 0.65, 0.24)
  else if (step === 7) playBass(bgmCtx, bar.bass[1], t, 0.4, 0.19)
  else if (step === 10) playBass(bgmCtx, bar.bass[2], t, 0.5, 0.2)

  // Catchy melody hook
  const leadFreq = bar.lead[step]
  if (leadFreq) {
    playLead(bgmCtx, leadFreq, t, 0.46, 0.11)
  }
}

export function startFocusBgm() {
  if (!isFocusBgmEnabled()) return
  if (typeof window !== 'undefined' && localStorage.getItem('kinetix_sound_enabled') === 'false') {
    return
  }

  const ctx = ensureAudioGraph()
  if (!ctx || !masterGain) return

  if (!isPlaying) {
    isPlaying = true
    stepIndex = 0
    scheduleStep()
    loopTimer = setInterval(scheduleStep, SIXTEENTH_SEC * 1000)
  }

  getFocusBgmVolume()
  const now = ctx.currentTime
  const target = computeTargetGain()
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
  masterGain.gain.linearRampToValueAtTime(target, now + 0.5)
}

export function setFocusBgmDucked(duck) {
  isDucked = Boolean(duck)
  if (!isPlaying || !bgmCtx || !masterGain) return
  const now = bgmCtx.currentTime
  const target = computeTargetGain()
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
  masterGain.gain.linearRampToValueAtTime(target, now + 0.2)
}

export function stopFocusBgm() {
  isPlaying = false
  isDucked = false
  if (loopTimer) {
    clearInterval(loopTimer)
    loopTimer = null
  }
  if (bgmCtx && masterGain) {
    const now = bgmCtx.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3)
  }
}
