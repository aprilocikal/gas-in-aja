import { useState, useEffect, useRef, useId } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { playSoundCue } from './AccessibilityToolbar'
import './CharacterAvatar.css'

const INTERACTION_TIPS = [
  'Setiap bug adalah petunjuk menuju kode yang lebih baik!',
  'Coba geser visualisasi langkah demi langkah untuk paham logikanya.',
  'Latihan 1 checkpoint setiap hari menjaga ritme belajarmu!',
  'Pointer menyimpan alamat memori RAM fisik, bukan nilainya langsung.',
  'Mantap! Terus eksplorasi berbagai bahasa pemrograman!',
]

function CharacterAvatar({
  size = 180,
  emotion = 'happy',
  animated = true,
  interactive = true,
  showTooltip = false,
  onInteract,
}) {
  const wrapRef = useRef(null)
  const tipTimeoutRef = useRef(null)
  const burstTimeoutRef = useRef(null)
  const rawUid = useId()
  const uid = rawUid.replace(/[^a-zA-Z0-9_-]/g, '')
  const hairGradId = `charHairGrad-${uid}`
  const skinGradId = `charSkinGrad-${uid}`
  const jacketGradId = `charJacketGrad-${uid}`

  const [burstEmotion, setBurstEmotion] = useState(null)
  const [bounceKey, setBounceKey] = useState(0)
  const [tipText, setTipText] = useState('')
  const [tipIndex, setTipIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // Smooth 60fps 3D tilt & parallax motion values (zero React re-render overhead on mousemove)
  const rawTiltX = useMotionValue(0)
  const rawTiltY = useMotionValue(0)
  const rawEyeX = useMotionValue(0)
  const rawEyeY = useMotionValue(0)
  const rawHeadX = useMotionValue(0)
  const rawHeadY = useMotionValue(0)

  const springCfg = { stiffness: 190, damping: 18, mass: 0.7 }
  const tiltX = useSpring(rawTiltX, springCfg)
  const tiltY = useSpring(rawTiltY, springCfg)
  const eyeX = useSpring(rawEyeX, { stiffness: 260, damping: 22 })
  const eyeY = useSpring(rawEyeY, { stiffness: 260, damping: 22 })
  const headX = useSpring(rawHeadX, springCfg)
  const headY = useSpring(rawHeadY, springCfg)

  const activeEmotion = burstEmotion || emotion
  const reduceMotion =
    typeof document !== 'undefined' && document.documentElement.dataset.reduceMotion === 'true'
  const shouldAnimate = animated && !reduceMotion

  // 3D Parallax & cursor eye-tracking when interactive
  useEffect(() => {
    if (!interactive || reduceMotion) return

    const handleMouseMove = (e) => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.42
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const factor = Math.min(1, dist / 260)

      // Eye offset inside face
      rawEyeX.set(Math.max(-3.1, Math.min(3.1, (dx / dist) * 3.1 * factor)))
      rawEyeY.set(Math.max(-2.2, Math.min(2.2, (dy / dist) * 2.2 * factor)))

      // Subtle layered head parallax + 3D card tilt
      const normX = Math.max(-1, Math.min(1, dx / 260))
      const normY = Math.max(-1, Math.min(1, dy / 260))
      rawTiltY.set(normX * 16)
      rawTiltX.set(-normY * 13)
      rawHeadX.set(normX * 2.4)
      rawHeadY.set(normY * 1.6)
    }

    const handleMouseLeaveWindow = () => {
      rawTiltX.set(0)
      rawTiltY.set(0)
      rawEyeX.set(0)
      rawEyeY.set(0)
      rawHeadX.set(0)
      rawHeadY.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('blur', handleMouseLeaveWindow)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('blur', handleMouseLeaveWindow)
    }
  }, [interactive, reduceMotion, rawTiltX, rawTiltY, rawEyeX, rawEyeY, rawHeadX, rawHeadY])

  useEffect(() => {
    return () => {
      if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current)
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current)
    }
  }, [])

  const handleTap = (e) => {
    if (!interactive) return
    e?.stopPropagation?.()
    playSoundCue('avatar')
    setBounceKey((k) => k + 1)
    setBurstEmotion((prev) => (prev === 'celebrating' ? 'excited' : 'celebrating'))

    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current)
    burstTimeoutRef.current = setTimeout(() => setBurstEmotion(null), 1900)

    if (showTooltip) {
      const nextTip = INTERACTION_TIPS[tipIndex % INTERACTION_TIPS.length]
      setTipText(nextTip)
      setTipIndex((i) => i + 1)
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current)
      tipTimeoutRef.current = setTimeout(() => setTipText(''), 2600)
    }

    onInteract?.()
  }

  const isCelebrating = activeEmotion === 'celebrating' || activeEmotion === 'excited'
  const isThinking = activeEmotion === 'thinking'
  const isOops = activeEmotion === 'oops'
  const isSpeaking = activeEmotion === 'speaking'
  const headStateClass = isCelebrating
    ? 'is-celebrating'
    : isThinking
    ? 'is-thinking'
    : isOops
    ? 'is-oops'
    : isSpeaking
    ? 'is-speaking'
    : ''

  return (
    <div
      ref={wrapRef}
      className={`character-avatar-wrap ${interactive ? 'is-interactive' : ''} ${
        isCelebrating ? 'is-celebrating' : ''
      } ${!shouldAnimate ? 'no-motion' : ''}`}
      style={{ width: size, height: size * 1.08 }}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? 'Asisten Kinetix 3D — klik untuk berinteraksi' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleTap}
      onKeyDown={(e) => {
        if (interactive && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          handleTap(e)
        }
      }}
    >
      <AnimatePresence>
        {showTooltip && tipText && (
          <motion.div
            className="char-tooltip-bubble"
            initial={{ opacity: 0, x: '-50%', y: 8, scale: 0.92 }}
            animate={{ opacity: 1, x: '-50%', y: 0, scale: 1 }}
            exit={{ opacity: 0, x: '-50%', y: 6, scale: 0.92 }}
            transition={{ duration: 0.18 }}
          >
            {tipText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle 3D Orbital Stage Ring & Ground Shadow for depth */}
      {size >= 64 && shouldAnimate && <div className="char-orbit-ring" aria-hidden="true" />}
      {size >= 52 && <div className="char-ground-shadow" aria-hidden="true" />}

      {/* Burst sparks on tap */}
      {bounceKey > 0 && shouldAnimate && (
        <div key={`sparks-${bounceKey}`} className="char-burst-sparks" aria-hidden="true">
          <span className="spark-dot sd-1" />
          <span className="spark-dot sd-2" />
          <span className="spark-dot sd-3" />
          <span className="spark-dot sd-4" />
        </div>
      )}

      {/* 3D Parallax Rig */}
      <motion.div
        className="character-3d-rig"
        style={
          interactive && !reduceMotion
            ? {
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: 'preserve-3d',
              }
            : undefined
        }
        animate={isHovered && interactive && !reduceMotion ? { scale: 1.06 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Tap 360° Spin & Idle Float Layer */}
        <motion.div
          key={`spin-${bounceKey}`}
          className="character-spin-layer"
          initial={bounceKey > 0 && shouldAnimate ? { rotateY: 0, y: 0, scale: 0.94 } : false}
          animate={
            bounceKey > 0 && shouldAnimate
              ? { rotateY: [0, 360], y: [0, -14, 0], scale: [0.94, 1.1, 1] }
              : shouldAnimate
              ? { y: [0, -5, 0], rotateZ: [0, 1.2, -1.2, 0] }
              : {}
          }
          transition={
            bounceKey > 0 && shouldAnimate
              ? { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
              : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <svg
            viewBox="0 0 200 220"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="character-svg"
          >
            <defs>
              <linearGradient id={hairGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="55%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#4338ca" />
              </linearGradient>

              <linearGradient id={skinGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff1df" />
                <stop offset="65%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fdba74" />
              </linearGradient>

              <linearGradient id={jacketGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="45%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>
            </defs>

            {/* Ambient Floor Shadow Inside SVG */}
            <ellipse
              cx="100"
              cy="192"
              rx={isCelebrating ? 74 : 68}
              ry="14"
              fill={isCelebrating ? 'rgba(99, 102, 241, 0.25)' : 'rgba(15, 23, 42, 0.35)'}
            />

            {/* ===== BODY / JACKET WITH BREATHING ===== */}
            <g className="char-body-breathe">
              <path
                d="M 45 165 C 45 145, 60 138, 85 136 L 115 136 C 140 138, 155 145, 155 165 L 158 215 C 158 218, 150 220, 100 220 C 50 220, 42 218, 42 215 Z"
                fill={`url(#${jacketGradId})`}
              />
              {/* 3D Rim Highlight on Left Shoulder */}
              <path
                d="M 47 166 C 48 148, 62 140, 84 138"
                stroke="rgba(255, 255, 255, 0.45)"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 85 136 L 100 178 L 115 136 Z" fill="#ffffff" />
              <path d="M 96 148 L 104 148 L 106 182 L 100 190 L 94 182 Z" fill="#475569" />
              <polygon points="95,142 105,142 103,148 97,148" fill="#334155" />
              <polygon points="84,136 96,145 92,136" fill="#f8fafc" />
              <polygon points="116,136 104,145 108,136" fill="#f8fafc" />
              <path d="M 68 140 L 86 172 L 78 185 L 56 160 Z" fill="#eab308" />
              <path d="M 132 140 L 114 172 L 122 185 L 144 160 Z" fill="#ca8a04" />
              <path d="M 100 188 L 100 220" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />

              {/* Articulated Waving Right Hand */}
              <g className={`char-arm-wave ${isCelebrating || isHovered ? 'wave-active' : ''}`}>
                <path
                  d="M 148 164 C 165 154, 174 140, 173 124"
                  stroke="#eab308"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <circle cx="173" cy="121" r="8.5" fill={`url(#${skinGradId})`} />
                <path
                  d="M 167 119 C 170 113, 176 113, 179 119"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
            </g>

            {/* ===== HEAD LAYER WITH 3D PARALLAX SHIFT & EMOTION MOTION ===== */}
            <motion.g
              style={!reduceMotion ? { x: headX, y: headY } : undefined}
              className={`char-head-group ${headStateClass}`}
            >
              {/* Neck & Ears */}
              <rect x="90" y="118" width="20" height="24" rx="4" fill={`url(#${skinGradId})`} />
              <path d="M 90 128 C 96 132, 104 132, 110 128" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="60" cy="88" rx="8" ry="10" fill={`url(#${skinGradId})`} />
              <ellipse cx="140" cy="88" rx="8" ry="10" fill={`url(#${skinGradId})`} />

              {/* Head / Face */}
              <rect x="62" y="52" width="76" height="74" rx="34" fill={`url(#${skinGradId})`} />
              {/* Soft 3D Specular Rim on Forehead */}
              <path
                d="M 70 64 C 78 56, 94 55, 106 57"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />

              {/* Hair */}
              <path
                d="M 54 80 C 48 50, 70 24, 100 24 C 130 24, 152 50, 146 80 C 140 85, 142 98, 140 102 C 136 85, 138 60, 126 50 C 115 42, 85 42, 74 50 C 62 60, 64 85, 60 102 C 58 98, 60 85, 54 80 Z"
                fill={`url(#${hairGradId})`}
              />
              <path
                d="M 62 58 C 72 38, 92 34, 112 36 C 132 38, 142 46, 144 56 C 140 50, 128 44, 110 44 C 88 44, 76 54, 70 66 C 68 70, 64 68, 62 58 Z"
                fill="#818cf8"
              />
              <path
                d="M 68 56 C 78 45, 96 46, 108 52 C 95 56, 85 64, 80 72 C 76 66, 72 60, 68 56 Z"
                fill="#a5b4fc"
              />

              {/* Eyes with 60fps MotionValue Tracking */}
              <motion.g
                className="char-eye-left"
                style={!reduceMotion ? { x: eyeX, y: eyeY } : undefined}
              >
                {isCelebrating ? (
                  <path d="M 75 87 Q 82 79 89 87" stroke="#1e1b4b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                ) : (
                  <>
                    <circle cx="82" cy="86" r="6" fill="#1e1b4b" />
                    <circle cx="80.5" cy="84" r="2.2" fill="#ffffff" />
                    <circle cx="83.5" cy="87.5" r="1" fill="#ffffff" />
                  </>
                )}
              </motion.g>

              <motion.g
                className="char-eye-right"
                style={!reduceMotion ? { x: eyeX, y: eyeY } : undefined}
              >
                {isCelebrating ? (
                  <path d="M 111 87 Q 118 79 125 87" stroke="#1e1b4b" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                ) : (
                  <>
                    <circle cx="118" cy="86" r="6" fill="#1e1b4b" />
                    <circle cx="116.5" cy="84" r="2.2" fill="#ffffff" />
                    <circle cx="119.5" cy="87.5" r="1" fill="#ffffff" />
                  </>
                )}
              </motion.g>

              {/* Eyebrows by Emotion */}
              {isThinking ? (
                <>
                  <path d="M 75 76 C 79 75, 85 75, 89 77" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 111 71 C 115 67, 121 68, 125 71" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : isOops ? (
                <>
                  <path d="M 74 72 C 79 75, 85 76, 89 77" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 126 72 C 121 75, 115 76, 111 77" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M 75 75 C 79 73, 85 73, 89 76" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 111 76 C 115 73, 121 73, 125 75" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Cheeks & Nose */}
              <ellipse
                cx="73"
                cy="95"
                rx="7"
                ry="4"
                fill={isCelebrating ? 'rgba(244, 63, 94, 0.5)' : 'rgba(244, 63, 94, 0.35)'}
              />
              <ellipse
                cx="127"
                cy="95"
                rx="7"
                ry="4"
                fill={isCelebrating ? 'rgba(244, 63, 94, 0.5)' : 'rgba(244, 63, 94, 0.35)'}
              />
              <circle cx="100" cy="90" r="1.8" fill="#fb923c" />

              {/* Mouth by Emotion */}
              {isCelebrating ? (
                <g>
                  <path d="M 89 96 C 94 109, 106 109, 111 96 Z" fill="#9f1239" />
                  <path d="M 94 103 C 97 106, 103 106, 106 103" fill="#fb7185" />
                </g>
              ) : isOops ? (
                <path
                  d="M 91 100 Q 95.5 96 100 100 T 109 100"
                  stroke="#9a3412"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isThinking ? (
                <path
                  d="M 94 99 C 98 98, 102 100, 106 97"
                  stroke="#9a3412"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isSpeaking ? (
                <ellipse cx="100" cy="100" rx="5.5" ry="4.5" fill="#9f1239" className="char-mouth-speaking" />
              ) : (
                <path
                  d="M 92 98 C 96 104, 104 104, 108 98"
                  stroke="#9a3412"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </motion.g>

            {/* ===== EMOTION ACCENTS ===== */}
            {(activeEmotion === 'happy' || isCelebrating) && (
              <g className="char-sparkle">
                <path
                  d="M 152 42 L 155 50 L 163 53 L 155 56 L 152 64 L 149 56 L 141 53 L 149 50 Z"
                  fill={isCelebrating ? '#818cf8' : '#fbbf24'}
                  opacity="0.92"
                />
              </g>
            )}

            {isCelebrating && (
              <>
                <path
                  d="M 44 48 L 46 53 L 51 55 L 46 57 L 44 62 L 42 57 L 37 55 L 42 53 Z"
                  fill="#fbbf24"
                  className="char-sparkle-alt"
                />
                <circle cx="162" cy="78" r="3" fill="#a5b4fc" opacity="0.85" />
              </>
            )}

            {isThinking && (
              <text
                x="148"
                y="52"
                fill="#818cf8"
                fontSize="22"
                fontWeight="900"
                fontFamily="sans-serif"
                className="char-sparkle"
              >
                ?
              </text>
            )}

            {isOops && (
              <path
                d="M 142 64 C 146 70, 146 76, 142 78 C 138 76, 138 70, 142 64 Z"
                fill="#60a5fa"
                opacity="0.9"
              />
            )}

            {isSpeaking && (
              <g stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" fill="none" className="char-sparkle">
                <path d="M 148 84 Q 154 90 148 96" />
                <path d="M 155 80 Q 163 90 155 100" opacity="0.7" />
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CharacterAvatar
