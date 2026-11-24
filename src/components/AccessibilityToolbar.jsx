import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuSlidersHorizontal,
  LuType,
  LuContrast,
  LuSparkles,
  LuVolume2,
  LuVolumeX,
  LuX,
  LuCheck,
} from 'react-icons/lu'
import './AccessibilityToolbar.css'

export function playSoundCue(type = 'click') {
  if (sessionStorage.getItem('kinetix_sound') !== 'true') return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    if (type === 'click') {
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start()
      osc.stop(ctx.currentTime + 0.1)
    } else if (type === 'success') {
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    } else if (type === 'log') {
      osc.frequency.setValueAtTime(520, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)
    }
  } catch (e) {
    // AudioContext not allowed before user gesture
  }
}

function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    // Load persisted settings
    const savedFont = localStorage.getItem('kinetix_font_size') || 'normal'
    const savedContrast = localStorage.getItem('kinetix_high_contrast') === 'true'
    const savedMotion = localStorage.getItem('kinetix_reduce_motion') === 'true'
    const savedSound = sessionStorage.getItem('kinetix_sound') === 'true'

    setFontSize(savedFont)
    setHighContrast(savedContrast)
    setReduceMotion(savedMotion)
    setSoundEnabled(savedSound)

    applySettings(savedFont, savedContrast, savedMotion)
  }, [])

  const applySettings = (font, contrast, motion) => {
    const root = document.documentElement
    root.setAttribute('data-font-size', font)
    root.setAttribute('data-high-contrast', contrast ? 'true' : 'false')
    root.setAttribute('data-reduce-motion', motion ? 'true' : 'false')
  }

  const handleFontChange = (size) => {
    setFontSize(size)
    localStorage.setItem('kinetix_font_size', size)
    applySettings(size, highContrast, reduceMotion)
    playSoundCue('click')
  }

  const handleContrastToggle = () => {
    const next = !highContrast
    setHighContrast(next)
    localStorage.setItem('kinetix_high_contrast', String(next))
    applySettings(fontSize, next, reduceMotion)
    playSoundCue('click')
  }

  const handleMotionToggle = () => {
    const next = !reduceMotion
    setReduceMotion(next)
    localStorage.setItem('kinetix_reduce_motion', String(next))
    applySettings(fontSize, highContrast, next)
    playSoundCue('click')
  }

  const handleSoundToggle = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    sessionStorage.setItem('kinetix_sound', String(next))
    if (next) playSoundCue('success')
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="a11y-trigger-btn"
        onClick={() => {
          setIsOpen(!isOpen)
          playSoundCue('click')
        }}
        aria-label="Pengaturan Aksesibilitas Website"
        title="Menu Aksesibilitas"
      >
        <LuSlidersHorizontal size={20} />
        <span className="a11y-trigger-label">Aksesibilitas</span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="a11y-overlay" onClick={() => setIsOpen(false)}>
            <motion.div
              className="a11y-panel glass-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-title"
            >
              <div className="a11y-header">
                <div className="a11y-header-title">
                  <LuSlidersHorizontal size={20} className="icon-orange" />
                  <h3 id="a11y-title">Fitur Aksesibilitas</h3>
                </div>
                <button
                  className="a11y-close-btn"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup panel aksesibilitas"
                >
                  <LuX size={18} />
                </button>
              </div>

              <p className="a11y-desc">
                Sesuaikan tampilan dan interaksi website untuk kenyamanan belajar Anda (Kepatuhan WCAG 2.1).
              </p>

              <div className="a11y-options">
                {/* Ukuran Font */}
                <div className="a11y-row">
                  <div className="a11y-label">
                    <LuType size={18} className="icon-orange" />
                    <div>
                      <strong>Ukuran Teks</strong>
                      <small>Perbesar font agar lebih mudah dibaca</small>
                    </div>
                  </div>
                  <div className="a11y-pill-group">
                    {[
                      { id: 'normal', label: 'Normal' },
                      { id: 'large', label: 'Besar' },
                      { id: 'larger', label: 'Ekstra' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleFontChange(btn.id)}
                        className={`a11y-pill-btn ${fontSize === btn.id ? 'active' : ''}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Kontras Tinggi */}
                <div className="a11y-row">
                  <div className="a11y-label">
                    <LuContrast size={18} className="icon-orange" />
                    <div>
                      <strong>Kontras Tinggi</strong>
                      <small>Pertajam garis tepi dan teks latar</small>
                    </div>
                  </div>
                  <button
                    onClick={handleContrastToggle}
                    className={`a11y-switch ${highContrast ? 'active' : ''}`}
                    aria-pressed={highContrast}
                  >
                    <span className="a11y-switch-thumb">
                      {highContrast && <LuCheck size={12} />}
                    </span>
                  </button>
                </div>

                {/* Kurangi Gerakan */}
                <div className="a11y-row">
                  <div className="a11y-label">
                    <LuSparkles size={18} className="icon-orange" />
                    <div>
                      <strong>Kurangi Animasi</strong>
                      <small>Bagi pengguna yang sensitif gerakan</small>
                    </div>
                  </div>
                  <button
                    onClick={handleMotionToggle}
                    className={`a11y-switch ${reduceMotion ? 'active' : ''}`}
                    aria-pressed={reduceMotion}
                  >
                    <span className="a11y-switch-thumb">
                      {reduceMotion && <LuCheck size={12} />}
                    </span>
                  </button>
                </div>

                {/* Efek Suara Audio */}
                <div className="a11y-row">
                  <div className="a11y-label">
                    {soundEnabled ? (
                      <LuVolume2 size={18} className="icon-orange" />
                    ) : (
                      <LuVolumeX size={18} className="icon-orange" />
                    )}
                    <div>
                      <strong>Umpan Balik Suara</strong>
                      <small>Efek audio saat menekan tombol & quiz</small>
                    </div>
                  </div>
                  <button
                    onClick={handleSoundToggle}
                    className={`a11y-switch ${soundEnabled ? 'active' : ''}`}
                    aria-pressed={soundEnabled}
                  >
                    <span className="a11y-switch-thumb">
                      {soundEnabled && <LuCheck size={12} />}
                    </span>
                  </button>
                </div>
              </div>

              <div className="a11y-footer">
                <span className="a11y-wcag-badge">WCAG 2.1 AA Compliant</span>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    handleFontChange('normal')
                    if (highContrast) handleContrastToggle()
                    if (reduceMotion) handleMotionToggle()
                    if (soundEnabled) handleSoundToggle()
                  }}
                >
                  Reset Default
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AccessibilityToolbar
