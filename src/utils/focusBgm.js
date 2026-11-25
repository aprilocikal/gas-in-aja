// Bright, Warm Kalimba & Acoustic Piano Study BGM Engine for Kinetix Code Quizzes
// Cheerful, relaxing C-major pentatonic study loop (no dark drones or spooky pads)

const BGM_STORAGE_KEY = 'kinetix_bgm_enabled'

// Bright uplifting progression in C Major: C -> G -> Am -> F (friendly middle-high register)
// Each bar has 8 eighth-note slots (~92 BPM => 0.325s per eighth note, 2.6s per bar)
const STEP_SEC = 0.325
const STEPS_PER_BAR = 8

const STUDY_BARS = [
  // Bar 1: C major (bright & welcoming)
  {
    bass: 261.63, // C4
    chord: [329.63, 392.0], // E4, G4
    melody: [523.25, 0, 659.25, 783.99, 659.25, 0, 587.33, 523.25], // C5 . E5 G5 E5 . D5 C5
  },
  // Bar 2: G major (open & cheerful)
  {
    bass: 196.0, // G3
    chord: [293.66, 392.0], // D4, G4
    melody: [587.33, 0, 783.99, 659.25, 587.33, 0, 493.88, 587.33], // D5 . G5 E5 D5 . B4 D5
  },
  // Bar 3: A minor (warm & thoughtful, still bright)
  {
    bass: 220.0, // A3
    chord: [329.63, 440.0], // E4, A4
    melody: [523.25, 0, 659.25, 880.0, 783.99, 0, 659.25, 523.25], // C5 . E5 A5 G5 . E5 C5
  },
  // Bar 4: F major -> gentle turnaround back to C
  {
    bass: 174.61, // F3
    chord: [261.63, 349.23], // C4, F4
    melody: [659.25, 0, 587.33, 523.25, 587.33, 659.25, 587.33, 0], // E5 . D5 C5 D5 E5 D5 .
  },
]

const NORMAL_MASTER_GAIN = 0.13
const DUCKED_MASTER_GAIN = 0.03

let bgmCtx = null
let masterGain = null
let warmFilter = null
let loopTimer = null
let stepIndex = 0
let isPlaying = false
let isDucked = false

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

function ensureAudioGraph() {
  if (typeof window === 'undefined') return null
  if (!bgmCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    bgmCtx = new AudioContextClass()

    // Bright, warm lowpass so kalimba/piano sparkles gently without harshness
    warmFilter = bgmCtx.createBiquadFilter()
    warmFilter.type = 'lowpass'
    warmFilter.frequency.value = 3200
    warmFilter.Q.value = 0.5

    masterGain = bgmCtx.createGain()
    masterGain.gain.value = 0.0001

    warmFilter.connect(masterGain)
    masterGain.connect(bgmCtx.destination)
  }
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }
  return bgmCtx
}

// Crisp, friendly kalimba / electric-piano pluck (fast attack, clean acoustic decay)
function playKalimbaNote(ctx, freq, startTime, duration = 0.75, peak = 0.14) {
  // Fundamental sine
  const osc1 = ctx.createOscillator()
  const g1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(freq, startTime)
  g1.gain.setValueAtTime(0.0001, startTime)
  g1.gain.linearRampToValueAtTime(peak, startTime + 0.012)
  g1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc1.connect(g1)
  g1.connect(warmFilter)
  osc1.start(startTime)
  osc1.stop(startTime + duration + 0.03)

  // Gentle octave overtone for bright wooden bell warmth
  const osc2 = ctx.createOscillator()
  const g2 = ctx.createGain()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(freq * 2, startTime)
  g2.gain.setValueAtTime(0.0001, startTime)
  g2.gain.linearRampToValueAtTime(peak * 0.18, startTime + 0.008)
  g2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.45)
  osc2.connect(g2)
  g2.connect(warmFilter)
  osc2.start(startTime)
  osc2.stop(startTime + duration * 0.48 + 0.02)
}

// Soft acoustic guitar/piano bass pluck on downbeats
function playWarmBassPluck(ctx, freq, startTime, duration = 0.9, peak = 0.16) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, startTime)
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + 0.018)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
  osc.connect(gain)
  gain.connect(warmFilter)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.03)
}

function scheduleStep() {
  if (!isPlaying || !bgmCtx || !warmFilter) return
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }

  const now = bgmCtx.currentTime + 0.03
  const barIdx = Math.floor(stepIndex / STEPS_PER_BAR) % STUDY_BARS.length
  const subStep = stepIndex % STEPS_PER_BAR
  const bar = STUDY_BARS[barIdx]
  stepIndex += 1

  // Beat 1 & Beat 3: soft warm bass + light strummed chord
  if (subStep === 0) {
    playWarmBassPluck(bgmCtx, bar.bass, now, 1.05, 0.16)
    bar.chord.forEach((f, idx) => {
      playKalimbaNote(bgmCtx, f, now + idx * 0.03, 0.95, 0.085)
    })
  } else if (subStep === 4) {
    playWarmBassPluck(bgmCtx, bar.bass, now, 0.75, 0.11)
    playKalimbaNote(bgmCtx, bar.chord[1], now + 0.02, 0.7, 0.065)
  }

  // Cheerful kalimba melody notes
  const noteFreq = bar.melody[subStep]
  if (noteFreq) {
    const accent = subStep === 0 || subStep === 4 ? 0.135 : 0.105
    playKalimbaNote(bgmCtx, noteFreq, now, 0.72, accent)
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
    loopTimer = setInterval(scheduleStep, STEP_SEC * 1000)
  }

  const now = ctx.currentTime
  const target = isDucked ? DUCKED_MASTER_GAIN : NORMAL_MASTER_GAIN
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
  masterGain.gain.linearRampToValueAtTime(target, now + 0.65)
}

export function setFocusBgmDucked(duck) {
  isDucked = Boolean(duck)
  if (!isPlaying || !bgmCtx || !masterGain) return
  const now = bgmCtx.currentTime
  const target = isDucked ? DUCKED_MASTER_GAIN : NORMAL_MASTER_GAIN
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
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35)
  }
}
