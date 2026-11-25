// Web Audio API Sound Effects Engine for Kinetix Code
// High-fidelity, zero-latency procedural sound effects

let audioCtx = null
let unlockBound = false

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

const bindFirstGestureUnlock = () => {
  if (typeof window === 'undefined' || unlockBound) return
  unlockBound = true
  const unlock = () => {
    getAudioContext()
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock, { passive: true, once: true })
  window.addEventListener('keydown', unlock, { passive: true, once: true })
}
bindFirstGestureUnlock()

// Shared soft output chain: master volume -> gentle low-pass (rounds off harsh highs)
let masterChain = null
let masterCtxRef = null
const getMasterOut = (ctx) => {
  if (masterChain && masterCtxRef === ctx) return masterChain
  const master = ctx.createGain()
  master.gain.value = 0.72
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 4200
  lp.Q.value = 0.6
  master.connect(lp)
  lp.connect(ctx.destination)
  masterChain = master
  masterCtxRef = ctx
  return master
}

const scheduleTone = (ctx, { wave = 'sine', startFreq, endFreq, startTime, duration, peakGain = 0.14 }) => {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = wave
  osc.frequency.setValueAtTime(startFreq, startTime)
  if (endFreq && endFreq !== startFreq) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration)
  }
  // Soft attack (no pop/click) then smooth exponential release
  const attack = Math.min(0.014, duration * 0.3)
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.linearRampToValueAtTime(peakGain, startTime + attack)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.connect(gain)
  gain.connect(getMasterOut(ctx))
  osc.start(startTime)
  osc.stop(startTime + duration + 0.02)
}

export function playSound(type = 'click') {
  // Sound is ON by default unless user explicitly turned it off in settings
  if (typeof window !== 'undefined' && localStorage.getItem('kinetix_sound_enabled') === 'false') {
    return
  }

  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    switch (type) {
      // 1. Crisp tactile button tap
      case 'click': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 680, endFreq: 340, startTime: now, duration: 0.055, peakGain: 0.12 })
        break
      }

      // 2. Instant zero-delay frame-0 mechanical pop for quiz choices
      case 'select': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 720, endFreq: 460, startTime: now, duration: 0.045, peakGain: 0.14 })
        scheduleTone(ctx, { wave: 'triangle', startFreq: 1400, endFreq: 900, startTime: now, duration: 0.025, peakGain: 0.08 })
        break
      }

      // 3. Crisp snap / pop for word bank & code chips
      case 'chip': {
        scheduleTone(ctx, { wave: 'triangle', startFreq: 540, endFreq: 1080, startTime: now, duration: 0.08, peakGain: 0.17 })
        break
      }

      // 4. Tile return / unpop
      case 'unpop': {
        scheduleTone(ctx, { wave: 'triangle', startFreq: 860, endFreq: 420, startTime: now, duration: 0.08, peakGain: 0.13 })
        break
      }

      // 5. Correct answer bright "CENTRING!" crystal bell chime (C6 - E6 - G6 - C7 + shimmer bell)
      case 'success': {
        const notes = [1046.5, 1318.51, 1567.98, 2093.0] // C6, E6, G6, C7
        notes.forEach((freq, idx) => {
          scheduleTone(ctx, {
            wave: 'sine',
            startFreq: freq,
            startTime: now + idx * 0.055,
            duration: idx === notes.length - 1 ? 0.36 : 0.2,
            peakGain: 0.18,
          })
        })
        // High crystalline bell overtone for unmistakable "centring!" sparkle
        scheduleTone(ctx, {
          wave: 'sine',
          startFreq: 3135.96,
          startTime: now + 0.165,
          duration: 0.42,
          peakGain: 0.11,
        })
        break
      }

      // 6. Wrong answer clear two-tone "tet-tot" buzzer (smooth triangle, never harsh sawtooth)
      case 'wrong': {
        scheduleTone(ctx, { wave: 'triangle', startFreq: 310, endFreq: 270, startTime: now, duration: 0.11, peakGain: 0.18 })
        scheduleTone(ctx, { wave: 'triangle', startFreq: 215, endFreq: 175, startTime: now + 0.11, duration: 0.22, peakGain: 0.18 })
        scheduleTone(ctx, { wave: 'sine', startFreq: 155, endFreq: 108, startTime: now + 0.11, duration: 0.22, peakGain: 0.12 })
        break
      }

      // 7. Magical crystal ping for Hint activation
      case 'hint': {
        ;[880, 1318.51, 1760].forEach((freq, idx) => {
          scheduleTone(ctx, { wave: 'sine', startFreq: freq, startTime: now + idx * 0.06, duration: 0.24, peakGain: 0.14 })
        })
        break
      }

      // 8. Muffled thud when hint is on cooldown or out of tokens
      case 'locked': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 190, endFreq: 115, startTime: now, duration: 0.075, peakGain: 0.15 })
        break
      }

      // 9. Playful rising chirp when tapping the 3D Avatar
      case 'avatar': {
        ;[440, 680, 940].forEach((freq, idx) => {
          scheduleTone(ctx, { wave: 'sine', startFreq: freq, startTime: now + idx * 0.045, duration: 0.12, peakGain: 0.13 })
        })
        break
      }

      // 10. Soft tick for telemetry / pointer log updates
      case 'log': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 540, endFreq: 660, startTime: now, duration: 0.06, peakGain: 0.1 })
        break
      }

      // 11. Algorithm Visualizer Bar Swap frequency sweep
      case 'swap': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 420, endFreq: 640, startTime: now, duration: 0.09, peakGain: 0.07 })
        break
      }

      // 12. Flashcard / Book page flip whoosh
      case 'page': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 300, endFreq: 150, startTime: now, duration: 0.12, peakGain: 0.08 })
        break
      }

      // 13. Streak flame fire pulse
      case 'flame': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.linearRampToValueAtTime(660, now + 0.08)
        osc.frequency.linearRampToValueAtTime(880, now + 0.16)
        gain.gain.setValueAtTime(0.15, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
        osc.connect(gain)
        gain.connect(getMasterOut(ctx))
        osc.start(now)
        osc.stop(now + 0.28)
        break
      }

      // 15. Very soft tick (visualizer comparisons, hover-level feedback)
      case 'tick': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 880, endFreq: 760, startTime: now, duration: 0.05, peakGain: 0.05 })
        break
      }

      // 16. Gentle two-note rising chime when a search target is found
      case 'found': {
        ;[784, 1174.66].forEach((freq, idx) => {
          scheduleTone(ctx, { wave: 'sine', startFreq: freq, startTime: now + idx * 0.09, duration: 0.32, peakGain: 0.1 })
        })
        break
      }

      // 17. Soft tab / page navigation swish
      case 'nav': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 520, endFreq: 640, startTime: now, duration: 0.07, peakGain: 0.07 })
        break
      }

      // 18. Soft toggle (switch view mode, mark as watched)
      case 'toggle': {
        scheduleTone(ctx, { wave: 'sine', startFreq: 600, endFreq: 780, startTime: now, duration: 0.06, peakGain: 0.07 })
        scheduleTone(ctx, { wave: 'sine', startFreq: 900, startTime: now + 0.04, duration: 0.07, peakGain: 0.04 })
        break
      }

      // 14. Celebration fanfare / level up
      case 'fanfare': {
        ;[523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          scheduleTone(ctx, { wave: 'triangle', startFreq: freq, startTime: now + idx * 0.085, duration: 0.42, peakGain: 0.18 })
        })
        break
      }

      default: {
        scheduleTone(ctx, { wave: 'sine', startFreq: 680, endFreq: 340, startTime: now, duration: 0.055, peakGain: 0.12 })
      }
    }
  } catch {
    // Graceful fallback if audio context is unavailable or blocked before gesture
  }
}

// Backward-compatible alias for existing code
export const playSoundCue = playSound
