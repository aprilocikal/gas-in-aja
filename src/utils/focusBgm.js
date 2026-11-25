// Procedural Ambient Lo-Fi Focus BGM Engine for Kinetix Code Quizzes
// Warm, mellow, non-intrusive study background music (zero external audio files needed)

const BGM_STORAGE_KEY = 'kinetix_bgm_enabled'

// Warm 4-bar chill progression: Fmaj7 -> Em7 -> Dm9 -> Cmaj7
const CHORD_PROGRESSION = [
  { root: 87.31, notes: [174.61, 220.0, 261.63, 329.63], melody: [523.25, 659.25, 587.33] }, // Fmaj7
  { root: 82.41, notes: [164.81, 196.0, 246.94, 293.66], melody: [493.88, 587.33, 659.25] }, // Em7
  { root: 73.42, notes: [146.83, 174.61, 220.0, 261.63, 329.63], melody: [523.25, 440.0, 587.33] }, // Dm9
  { root: 65.41, notes: [130.81, 164.81, 196.0, 246.94, 293.66], melody: [659.25, 523.25, 493.88] }, // Cmaj7
]

const BAR_DURATION_SEC = 3.2 // Calm ~75 BPM
const NORMAL_MASTER_GAIN = 0.14
const DUCKED_MASTER_GAIN = 0.035

let bgmCtx = null
let masterGain = null
let lowpass = null
let loopTimer = null
let barIndex = 0
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
    lowpass = bgmCtx.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 1150
    lowpass.Q.value = 0.5

    masterGain = bgmCtx.createGain()
    masterGain.gain.value = 0.0001

    lowpass.connect(masterGain)
    masterGain.connect(bgmCtx.destination)
  }
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }
  return bgmCtx
}

function playPadNote(ctx, freq, startTime, duration, peak, wave = 'sine') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = wave
  osc.frequency.setValueAtTime(freq, startTime)

  const attack = Math.min(0.55, duration * 0.25)
  const releaseStart = startTime + duration * 0.65

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + attack)
  gain.gain.setValueAtTime(peak * 0.85, releaseStart)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gain)
  gain.connect(lowpass)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}

function playSoftPluck(ctx, freq, startTime, peak = 0.085) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, startTime)

  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peak, startTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.15)

  osc.connect(gain)
  gain.connect(lowpass)
  osc.start(startTime)
  osc.stop(startTime + 1.2)
}

function scheduleBar() {
  if (!isPlaying || !bgmCtx || !lowpass) return
  if (bgmCtx.state === 'suspended') {
    bgmCtx.resume().catch(() => {})
  }

  const now = bgmCtx.currentTime + 0.04
  const chord = CHORD_PROGRESSION[barIndex % CHORD_PROGRESSION.length]
  barIndex += 1

  // 1. Soft warm sub-bass root
  playPadNote(bgmCtx, chord.root, now, BAR_DURATION_SEC + 0.25, 0.22, 'sine')

  // 2. Warm Rhodes-like chord pad (gentle staggered voicing)
  chord.notes.forEach((freq, idx) => {
    const offset = idx * 0.045
    playPadNote(bgmCtx, freq, now + offset, BAR_DURATION_SEC + 0.15, 0.11, 'sine')
    playPadNote(bgmCtx, freq, now + offset, BAR_DURATION_SEC * 0.85, 0.035, 'triangle')
  })

  // 3. Delicate sparse melody plucks (calm study lo-fi feel)
  const pluckOffsets = [0.65, 1.55, 2.35]
  chord.melody.forEach((freq, idx) => {
    if (idx === 1 && barIndex % 2 === 0) return // leave breathing space on alternating bars
    playSoftPluck(bgmCtx, freq, now + pluckOffsets[idx], 0.075)
  })
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
    barIndex = 0
    scheduleBar()
    loopTimer = setInterval(scheduleBar, BAR_DURATION_SEC * 1000)
  }

  const now = ctx.currentTime
  const target = isDucked ? DUCKED_MASTER_GAIN : NORMAL_MASTER_GAIN
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
  masterGain.gain.linearRampToValueAtTime(target, now + 1.1)
}

export function setFocusBgmDucked(duck) {
  isDucked = Boolean(duck)
  if (!isPlaying || !bgmCtx || !masterGain) return
  const now = bgmCtx.currentTime
  const target = isDucked ? DUCKED_MASTER_GAIN : NORMAL_MASTER_GAIN
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now)
  masterGain.gain.linearRampToValueAtTime(target, now + 0.22)
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
    masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.45)
  }
}
