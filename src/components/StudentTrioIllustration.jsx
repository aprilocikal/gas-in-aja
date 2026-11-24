import React from 'react'

export default function StudentTrioIllustration({ size = 380 }) {
  return (
    <div
      className="student-trio-wrapper"
      style={{
        width: size,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        position: 'relative',
        margin: '0 auto',
      }}
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* Main Circular Clip */}
          <clipPath id="circle-clip">
            <circle cx="250" cy="250" r="230" />
          </clipPath>

          {/* Background Gradient */}
          <linearGradient id="sky-gradient" x1="250" y1="20" x2="250" y2="480" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="60%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>

          {/* Campus Building Gradient */}
          <linearGradient id="roof-gradient" x1="250" y1="120" x2="250" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          
          <linearGradient id="building-gradient" x1="250" y1="200" x2="250" y2="350" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Character 1 (Purple Hair) */}
          <linearGradient id="boy-hair" x1="250" y1="180" x2="250" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>

          {/* Girl 2 (Pink Hair) */}
          <linearGradient id="girl-hair" x1="380" y1="200" x2="380" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>

          {/* Girl 1 (Hijab Scarf) */}
          <linearGradient id="hijab-grad" x1="130" y1="200" x2="130" y2="340" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>

        {/* Outer Soft Ring */}
        <circle cx="250" cy="250" r="236" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="6" />

        {/* Content Clipped into Circle */}
        <g clipPath="url(#circle-clip)">
          {/* Sky Backdrop */}
          <rect width="500" height="500" fill="url(#sky-gradient)" />

          {/* Campus Building Background */}
          {/* Main Hall Base */}
          <rect x="180" y="240" width="140" height="150" fill="#f8fafc" />
          {/* Colonnades */}
          <rect x="195" y="270" width="15" height="120" fill="#e2e8f0" />
          <rect x="225" y="270" width="15" height="120" fill="#e2e8f0" />
          <rect x="260" y="270" width="15" height="120" fill="#e2e8f0" />
          <rect x="290" y="270" width="15" height="120" fill="#e2e8f0" />
          {/* Campus Wing Left */}
          <path d="M70,260 L200,260 L200,380 L70,380 Z" fill="#e2e8f0" />
          <path d="M60,250 L200,240 L200,260 L60,260 Z" fill="#fca5a5" />
          {/* Campus Wing Right */}
          <path d="M300,260 L430,260 L430,380 L300,380 Z" fill="#e2e8f0" />
          <path d="M300,240 L440,250 L440,260 L300,260 Z" fill="#fca5a5" />

          {/* Pagoda / Traditional Campus Roof */}
          <path d="M160,240 L250,160 L340,240 Z" fill="url(#roof-gradient)" />
          <path d="M190,170 L250,110 L310,170 Z" fill="#ef4444" />
          <polygon points="250,85 244,110 256,110" fill="#b91c1c" />

          {/* Windows on Roof */}
          <rect x="235" y="180" width="30" height="30" rx="4" fill="#fef08a" />
          <line x1="250" y1="180" x2="250" y2="210" stroke="#ca8a04" strokeWidth="2" />
          <line x1="235" y1="195" x2="265" y2="195" stroke="#ca8a04" strokeWidth="2" />

          {/* Soft stylized white clouds */}
          <path d="M-20,180 Q10,140 50,170 Q90,140 130,170 Q160,180 160,210 L-20,210 Z" fill="#ffffff" opacity="0.95" />
          <path d="M350,170 Q380,130 420,160 Q460,130 490,165 Q520,175 520,210 L350,210 Z" fill="#ffffff" opacity="0.95" />

          {/* ========================================================
              STUDENT 1: LEFT (HIJAB GIRL WITH NOTEBOOK)
          ======================================================== */}
          <g id="student-left">
            {/* Body / Blazer */}
            <path d="M60,490 L60,400 Q80,340 140,340 Q190,340 210,400 L210,490 Z" fill="#4338ca" />
            {/* White Blouse V-neck */}
            <polygon points="120,340 160,340 140,390" fill="#ffffff" />
            
            {/* Hijab Drape */}
            <path d="M75,270 Q60,340 100,380 Q140,400 180,380 Q215,340 200,270 Z" fill="url(#hijab-grad)" />

            {/* Face */}
            <ellipse cx="140" cy="285" rx="38" ry="42" fill="#fed7aa" />
            
            {/* Hijab Inner Frame */}
            <path d="M102,270 Q102,240 140,240 Q178,240 178,270 Q178,320 140,328 Q102,320 102,270 Z" fill="none" stroke="url(#hijab-grad)" strokeWidth="6" />

            {/* Eyes */}
            <ellipse cx="126" cy="280" rx="5" ry="6" fill="#1e1b4b" />
            <circle cx="128" cy="278" r="2" fill="#ffffff" />
            <ellipse cx="154" cy="280" rx="5" ry="6" fill="#1e1b4b" />
            <circle cx="156" cy="278" r="2" fill="#ffffff" />

            {/* Eyebrows */}
            <path d="M120,268 Q126,264 133,268" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M147,268 Q154,264 161,268" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" />

            {/* Blush */}
            <ellipse cx="118" cy="292" rx="6" ry="3" fill="#f87171" opacity="0.6" />
            <ellipse cx="162" cy="292" rx="6" ry="3" fill="#f87171" opacity="0.6" />

            {/* Smile */}
            <path d="M132,298 Q140,308 148,298" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* Hands holding Purple Notebook / Pen */}
            <rect x="110" y="375" width="55" height="70" rx="6" transform="rotate(-15 110 375)" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
            <line x1="120" y1="395" x2="155" y2="385" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="123" y1="410" x2="158" y2="400" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" />
            <line x1="126" y1="425" x2="161" y2="415" stroke="#ddd6fe" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* ========================================================
              STUDENT 3: RIGHT (PINK-HAIRED GIRL WITH TABLET)
          ======================================================== */}
          <g id="student-right">
            {/* Body / Blazer */}
            <path d="M290,490 L290,400 Q310,345 370,345 Q430,345 450,400 L450,490 Z" fill="#047857" />
            <polygon points="350,345 390,345 370,395" fill="#ffffff" />
            
            {/* Long Pink Hair Back */}
            <path d="M315,280 Q305,370 330,420 Q410,420 435,370 Q445,280 430,230 Z" fill="url(#girl-hair)" />

            {/* Face */}
            <ellipse cx="375" cy="285" rx="36" ry="40" fill="#fed7aa" />

            {/* Front Bangs Pink Hair */}
            <path d="M338,260 Q375,230 412,260 Q405,285 395,275 Q375,290 355,275 Q345,285 338,260 Z" fill="url(#girl-hair)" />

            {/* Hairpins */}
            <rect x="336" y="248" width="14" height="4" rx="2" fill="#facc15" transform="rotate(15 336 248)" />
            <rect x="338" y="256" width="14" height="4" rx="2" fill="#38bdf8" transform="rotate(15 338 256)" />

            {/* Round Glasses */}
            <circle cx="358" cy="280" r="14" stroke="#db2777" strokeWidth="3" fill="rgba(255,255,255,0.4)" />
            <circle cx="392" cy="280" r="14" stroke="#db2777" strokeWidth="3" fill="rgba(255,255,255,0.4)" />
            <line x1="372" y1="280" x2="378" y2="280" stroke="#db2777" strokeWidth="3" />

            {/* Eyes behind glasses */}
            <circle cx="358" cy="280" r="5" fill="#1e1b4b" />
            <circle cx="360" cy="278" r="1.5" fill="#ffffff" />
            <circle cx="392" cy="280" r="5" fill="#1e1b4b" />
            <circle cx="394" cy="278" r="1.5" fill="#ffffff" />

            {/* Smile */}
            <path d="M367,300 Q375,308 383,300" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />

            {/* White Digital Tablet */}
            <rect x="330" y="370" width="70" height="90" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" transform="rotate(10 330 370)" />
            <rect x="338" y="380" width="54" height="66" rx="4" fill="#38bdf8" opacity="0.3" transform="rotate(10 330 370)" />
          </g>

          {/* ========================================================
              STUDENT 2: CENTER HERO (BOY WITH PURPLE HAIR & YELLOW BLAZER)
          ======================================================== */}
          <g id="student-center">
            {/* Body: Yellow Blazer */}
            <path d="M170,490 L170,360 Q210,310 250,310 Q290,310 330,360 L330,490 Z" fill="#eab308" />
            
            {/* Lapels */}
            <polygon points="215,320 250,380 230,490 190,490 190,350" fill="#ca8a04" />
            <polygon points="285,320 250,380 270,490 310,490 310,350" fill="#ca8a04" />

            {/* White Shirt Collar */}
            <polygon points="230,315 250,350 240,320" fill="#ffffff" />
            <polygon points="270,315 250,350 260,320" fill="#ffffff" />
            <polygon points="238,320 262,320 250,345" fill="#f8fafc" />

            {/* Grey / Dark Tie */}
            <polygon points="247,330 253,330 256,410 250,425 244,410" fill="#475569" />

            {/* Neck */}
            <rect x="238" y="275" width="24" height="45" fill="#fed7aa" />

            {/* Face */}
            <ellipse cx="250" cy="245" rx="42" ry="46" fill="#fed7aa" />

            {/* Ears */}
            <ellipse cx="206" cy="245" rx="8" ry="12" fill="#fed7aa" />
            <ellipse cx="294" cy="245" rx="8" ry="12" fill="#fed7aa" />

            {/* Signature Purple Wavy Hair */}
            <path
              d="M205,235 Q195,185 240,165 Q285,160 295,200 Q305,235 295,245 Q285,215 270,215 Q245,215 235,225 Q220,235 205,235 Z"
              fill="url(#boy-hair)"
            />
            {/* Cute Front Swoop */}
            <path
              d="M215,200 Q240,185 260,205 Q245,215 225,210 Z"
              fill="#a78bfa"
            />

            {/* Eyes (Round, warm & friendly) */}
            <ellipse cx="232" cy="240" rx="6" ry="7" fill="#1e1b4b" />
            <circle cx="234" cy="238" r="2.5" fill="#ffffff" />

            <ellipse cx="268" cy="240" rx="6" ry="7" fill="#1e1b4b" />
            <circle cx="270" cy="238" r="2.5" fill="#ffffff" />

            {/* Eyebrows */}
            <path d="M224,226 Q232,220 240,226" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" />
            <path d="M260,226 Q268,220 276,226" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" />

            {/* Nose */}
            <path d="M250,244 Q252,250 248,252" stroke="#f97316" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Cheerful Open Smile */}
            <path d="M238,260 Q250,274 262,260 Z" fill="#be123c" />
            <path d="M242,260 Q250,266 258,260 Z" fill="#ffffff" />

            {/* Blazer Buttons */}
            <circle cx="250" cy="445" r="4" fill="#854d0e" />
            <circle cx="250" cy="475" r="4" fill="#854d0e" />
          </g>
        </g>
      </svg>
    </div>
  )
}
