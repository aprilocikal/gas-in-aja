// Web Audio API Sound Effects Engine for Kinetix Code
// High-fidelity, zero-latency procedural sound effects

let audioCtx = null

const getAudioContext = () => {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
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
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(680, now)
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.05)
        gain.gain.setValueAtTime(0.12, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.06)
        break
      }

      // 2. Duolingo-style snap / pop for word bank & code chips
      case 'chip': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(520, now)
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.08)
        gain.gain.setValueAtTime(0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.09)
        break
      }

      // 3. Tile return / unpop
      case 'unpop': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(880, now)
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08)
        gain.gain.setValueAtTime(0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.09)
        break
      }

      // 4. Correct answer triumphant Duolingo major chord (C5 - E5 - G5 - C6)
      case 'success': {
        const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const noteTime = now + idx * 0.07

          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, noteTime)

          gain.gain.setValueAtTime(0.16, noteTime)
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35)

          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(noteTime)
          osc.stop(noteTime + 0.35)
        })
        break
      }

      // 5. Wrong answer gentle two-tone "uh-oh"
      case 'wrong': {
        const freqs = [330, 246.94] // E4 -> B3
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const noteTime = now + idx * 0.12

          osc.type = 'sawtooth'
          osc.frequency.setValueAtTime(freq, noteTime)

          gain.gain.setValueAtTime(0.12, noteTime)
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18)

          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(noteTime)
          osc.stop(noteTime + 0.18)
        })
        break
      }

      // 6. Algorithm Visualizer Bar Swap frequency sweep
      case 'swap': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400, now)
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08)
        gain.gain.setValueAtTime(0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.1)
        break
      }

      // 7. Flashcard / Book page flip whoosh
      case 'page': {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(300, now)
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.12)
        gain.gain.setValueAtTime(0.08, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.14)
        break
      }

      // 8. Streak flame fire pulse
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
        gain.connect(ctx.destination)
        osc.start(now)
        osc.stop(now + 0.28)
        break
      }

      // 9. Celebration fanfare / level up
      case 'fanfare': {
        const notes = [440, 554.37, 659.25, 880] // A major chord
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          const noteTime = now + idx * 0.09

          osc.type = 'triangle'
          osc.frequency.setValueAtTime(freq, noteTime)
          gain.gain.setValueAtTime(0.18, noteTime)
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.45)

          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start(noteTime)
          osc.stop(noteTime + 0.45)
        })
        break
      }

      default: {
        playSound('click')
      }
    }
  } catch (err) {
    // Graceful fallback if audio context blocked before user gesture
  }
}

// Backward-compatible alias for existing code
export const playSoundCue = playSound
