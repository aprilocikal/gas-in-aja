import { useEffect, useState } from 'react'
import './SplashIntro.css'

const WORD = 'Kinetix'
const ACCENT = 'Code'
const SESSION_KEY = 'kinetix_intro_seen'
const ALWAYS_SHOW = false

const GLITTERS = [
  { x: -135, y: -42, size: 14, delay: 0.35, color: '#c4b5fd' },
  { x: -75, y: 38, size: 10, delay: 0.6, color: '#ffffff' },
  { x: -35, y: -48, size: 12, delay: 0.85, color: '#a78bfa' },
  { x: 42, y: 40, size: 11, delay: 1.05, color: '#ffffff' },
  { x: 110, y: -38, size: 15, delay: 1.2, color: '#ddd6fe' },
  { x: 145, y: 26, size: 10, delay: 1.38, color: '#a78bfa' },
  { x: -110, y: 12, size: 8, delay: 0.95, color: '#ffffff' },
  { x: 75, y: -26, size: 9, delay: 1.3, color: '#c4b5fd' },
]

// Intro singkat saat web pertama kali dibuka (sekali per sesi tab).
// Urutan: kotak logo muncul -> huruf K tergambar -> nama mengetik -> layar naik membuka halaman.
export default function SplashIntro() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'done'
    if (!ALWAYS_SHOW && sessionStorage.getItem(SESSION_KEY)) return 'done'
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'done'
    return 'play'
  })

  // Jalankan timeline sekali saat mount
  useEffect(() => {
    if (phase === 'done') return
    sessionStorage.setItem(SESSION_KEY, '1')
    document.documentElement.style.overflow = 'hidden'

    const tExit = setTimeout(() => setPhase((p) => (p === 'play' ? 'exit' : p)), 2000)
    const tDone = setTimeout(() => setPhase('done'), 2700)
    return () => {
      clearTimeout(tExit)
      clearTimeout(tDone)
      document.documentElement.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase === 'done') document.documentElement.style.overflow = ''
  }, [phase])

  if (phase === 'done') return null

  const skip = () => {
    if (phase !== 'play') return
    setPhase('exit')
    setTimeout(() => setPhase('done'), 650)
  }

  const letters = [...WORD].map((c, i) => ({ c, i, accent: false }))
  const accentLetters = [...ACCENT].map((c, i) => ({ c, i: i + WORD.length + 1, accent: true }))

  return (
    <div className={`splash ${phase === 'exit' ? 'splash-exit' : ''}`} onClick={skip} role="presentation">
      <div className="splash-center">
        <div className="splash-glitters" aria-hidden="true">
          {GLITTERS.map((g, idx) => (
            <svg
              key={idx}
              className="splash-glitter"
              width={g.size}
              height={g.size}
              viewBox="0 0 24 24"
              fill={g.color}
              style={{
                '--gx': `${g.x}px`,
                '--gy': `${g.y}px`,
                animationDelay: `${g.delay}s`,
              }}
            >
              <path d="M12 0C12 7.5 16.5 12 24 12C16.5 12 12 16.5 12 24C12 16.5 7.5 12 0 12C7.5 12 12 7.5 12 0Z" />
            </svg>
          ))}
        </div>

        <svg className="splash-mark" width="72" height="72" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <rect className="splash-box" x="2" y="2" width="44" height="44" rx="12" />
          <path className="splash-stroke splash-bar" d="M17 14V34" pathLength="1" />
          <path className="splash-stroke splash-chev" d="M32 14L22 24L32 34" pathLength="1" />
        </svg>

        <div className="splash-word" aria-label="Kinetix Code">
          {letters.map(({ c, i }) => (
            <span key={i} className="splash-letter" style={{ animationDelay: `${0.95 + i * 0.045}s` }}>{c}</span>
          ))}
          <span className="splash-letter splash-space" style={{ animationDelay: `${0.95 + WORD.length * 0.045}s` }}>&nbsp;</span>
          {accentLetters.map(({ c, i }) => (
            <span key={i} className="splash-letter splash-accent" style={{ animationDelay: `${0.95 + i * 0.045}s` }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
