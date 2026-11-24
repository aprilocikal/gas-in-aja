import React from 'react'

export default function KinetixLogo({ size = 32, showText = false, className = '' }) {
  return (
    <div className={`kinetix-logo-wrapper ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="kntx-grad-1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <linearGradient id="kntx-grad-glow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
          </linearGradient>
          <filter id="kntx-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8b5cf6" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Hexagon / Rounded Shield Container */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill="#131127"
          stroke="url(#kntx-grad-1)"
          strokeWidth="2.5"
          filter="url(#kntx-shadow)"
        />

        {/* Left Chevron Bracket `<` */}
        <path
          d="M19 15L11 24L19 33"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Chevron Bracket `>` */}
        <path
          d="M29 15L37 24L29 33"
          stroke="#f97316"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Kinetic Energy Slash / Core Node in the center */}
        <circle cx="24" cy="24" r="3.5" fill="#a855f7" />
        <path
          d="M21 28L27 20"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <span style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
          Kinetix <span style={{ color: '#a855f7' }}>Code.</span>
        </span>
      )}
    </div>
  )
}
