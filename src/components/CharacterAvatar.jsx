import { motion } from 'framer-motion'
import './CharacterAvatar.css'

function CharacterAvatar({ size = 180, emotion = 'happy', animated = true }) {
  return (
    <motion.div
      className="character-avatar-wrap"
      style={{ width: size, height: size * 1.08 }}
      animate={
        animated
          ? {
              y: [0, -6, 0],
              rotate: [0, 1, -1, 0],
            }
          : {}
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="character-svg"
      >
        <defs>
          {/* Hair Gradient */}
          <linearGradient id="charHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="60%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="charSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Jacket Yellow Gradient */}
          <linearGradient id="charJacketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Shadow filters */}
          <filter id="charGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(249, 115, 22, 0.25)" />
          </filter>
        </defs>

        {/* Ambient Halo Glow */}
        <ellipse cx="100" cy="180" rx="75" ry="18" fill="rgba(249, 115, 22, 0.15)" />

        {/* ===== BODY / JACKET ===== */}
        {/* Yellow Blazer Body */}
        <path
          d="M 45 165 C 45 145, 60 138, 85 136 L 115 136 C 140 138, 155 145, 155 165 L 158 215 C 158 218, 150 220, 100 220 C 50 220, 42 218, 42 215 Z"
          fill="url(#charJacketGrad)"
        />

        {/* Shirt (White V-Neck Insert) */}
        <path
          d="M 85 136 L 100 178 L 115 136 Z"
          fill="#ffffff"
        />

        {/* Tie (Slate/Gray) */}
        <path
          d="M 96 148 L 104 148 L 106 182 L 100 190 L 94 182 Z"
          fill="#475569"
        />
        {/* Tie Knot */}
        <polygon points="95,142 105,142 103,148 97,148" fill="#334155" />

        {/* Shirt Collar Lapels */}
        <polygon points="84,136 96,145 92,136" fill="#f8fafc" />
        <polygon points="116,136 104,145 108,136" fill="#f8fafc" />

        {/* Jacket Lapels (Left & Right) */}
        <path
          d="M 68 140 L 86 172 L 78 185 L 56 160 Z"
          fill="#eab308"
        />
        <path
          d="M 132 140 L 114 172 L 122 185 L 144 160 Z"
          fill="#ca8a04"
        />

        {/* Jacket Seam Shadow */}
        <path
          d="M 100 188 L 100 220"
          stroke="#ca8a04"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* ===== NECK ===== */}
        <rect x="90" y="118" width="20" height="24" rx="4" fill="url(#charSkinGrad)" />
        <path d="M 90 128 C 96 132, 104 132, 110 128" stroke="#fdba74" strokeWidth="2" strokeLinecap="round" />

        {/* ===== EARS ===== */}
        <ellipse cx="60" cy="88" rx="8" ry="10" fill="url(#charSkinGrad)" />
        <ellipse cx="140" cy="88" rx="8" ry="10" fill="url(#charSkinGrad)" />

        {/* ===== HEAD / FACE ===== */}
        <rect x="62" y="52" width="76" height="74" rx="34" fill="url(#charSkinGrad)" />

        {/* Hair - Back volume */}
        <path
          d="M 54 80 C 48 50, 70 24, 100 24 C 130 24, 152 50, 146 80 C 140 85, 142 98, 140 102 C 136 85, 138 60, 126 50 C 115 42, 85 42, 74 50 C 62 60, 64 85, 60 102 C 58 98, 60 85, 54 80 Z"
          fill="url(#charHairGrad)"
        />

        {/* Hair - Front Swept Bangs */}
        <path
          d="M 62 58 C 72 38, 92 34, 112 36 C 132 38, 142 46, 144 56 C 140 50, 128 44, 110 44 C 88 44, 76 54, 70 66 C 68 70, 64 68, 62 58 Z"
          fill="#a855f7"
        />
        <path
          d="M 68 56 C 78 45, 96 46, 108 52 C 95 56, 85 64, 80 72 C 76 66, 72 60, 68 56 Z"
          fill="#c084fc"
        />

        {/* ===== EYES ===== */}
        {/* Left Eye */}
        <g className="char-eye-left">
          <circle cx="82" cy="86" r="6" fill="#1e1b4b" />
          <circle cx="80.5" cy="84" r="2.2" fill="#ffffff" />
          <circle cx="83.5" cy="87.5" r="1" fill="#ffffff" />
        </g>

        {/* Right Eye */}
        <g className="char-eye-right">
          <circle cx="118" cy="86" r="6" fill="#1e1b4b" />
          <circle cx="116.5" cy="84" r="2.2" fill="#ffffff" />
          <circle cx="119.5" cy="87.5" r="1" fill="#ffffff" />
        </g>

        {/* Eyebrows */}
        <path d="M 75 75 C 79 73, 85 73, 89 76" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 111 76 C 115 73, 121 73, 125 75" stroke="#6b21a8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Cute Blushing Cheeks */}
        <ellipse cx="73" cy="95" rx="7" ry="4" fill="rgba(244, 63, 94, 0.35)" />
        <ellipse cx="127" cy="95" rx="7" ry="4" fill="rgba(244, 63, 94, 0.35)" />

        {/* Nose */}
        <circle cx="100" cy="90" r="1.8" fill="#fb923c" />

        {/* Warm Smile */}
        <path
          d="M 92 98 C 96 104, 104 104, 108 98"
          stroke="#9a3412"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sparkle badge when happy/celebrating */}
        {emotion === 'happy' && (
          <g className="char-sparkle">
            <path
              d="M 152 42 L 155 50 L 163 53 L 155 56 L 152 64 L 149 56 L 141 53 L 149 50 Z"
              fill="#fb923c"
              opacity="0.85"
            />
          </g>
        )}
      </svg>
    </motion.div>
  )
}

export default CharacterAvatar
