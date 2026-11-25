import React from 'react'

// Logo Kinetix Code — satu warna, flat.
// Simbol: huruf "K" yang tersusun dari garis tegak + kurung kode "<".
export const KINETIX_BRAND_COLOR = '#7c3aed'

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
        aria-hidden="true"
      >
        <rect x="2" y="2" width="44" height="44" rx="12" fill={KINETIX_BRAND_COLOR} />
        <path d="M17 14V34" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
        <path d="M32 14L22 24L32 34" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {showText && (
        <span style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
          Kinetix <span style={{ color: '#a78bfa' }}>Code</span>
        </span>
      )}
    </div>
  )
}
