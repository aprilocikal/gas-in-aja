import QRCode from 'qrcode'

// XP Rewards & Power-ups Manager for Kinetix Code
// Spending XP uses a separate spentXP ledger so Total XP, Unit Unlocks, and Leaderboard Rank NEVER drop!

export const REWARDS_STORAGE_KEY = 'kinetix_xp_rewards'
const HINT_STORAGE_KEY = 'kinetix_hint_state'

export const LINKEDIN_COMPANY_ID = '144186335'
export const LINKEDIN_COMPANY_URL = 'https://www.linkedin.com/company/144186335/'

export const POWERUP_CATALOG = [
  {
    id: 'hint_refill',
    name: 'Isi Penuh 3 Token Hint',
    desc: 'Langsung isi penuh 3/3 Token Hint & hapus cooldown 60 detik.',
    cost: 35,
    accent: '#f59e0b',
    badge: 'INSTAN',
  },
  {
    id: 'extra_heart',
    name: 'Perisai +1 Nyawa Ekstra',
    desc: 'Mulai sesi kuis berikutnya dengan 4 nyawa (bukan 3 nyawa).',
    cost: 60,
    accent: '#f43f5e',
    badge: 'KUIS',
  },
  {
    id: 'xp_boost',
    name: 'Boost 2x XP Sesi Berikutnya',
    desc: 'Gandakan perolehan XP saat lulus checkpoint berikutnya.',
    cost: 80,
    accent: '#6366f1',
    badge: '2X XP',
  },
]

export const TITLE_CATALOG = [
  { id: 'perintis', label: 'Perintis Kode', cost: 40, color: '#34d399' },
  { id: 'arsitek', label: 'Arsitek Algoritma', cost: 120, color: '#818cf8' },
  { id: 'memori', label: 'Pengendali Memori', cost: 220, color: '#fbbf24' },
  { id: 'legenda', label: 'Legenda Kinetix', cost: 350, color: '#fb7185' },
]

export const CERTIFICATE_COST_XP = 150

/**
 * Generate a deterministic Credential ID for each user & language
 * Format: KC-2026-[LANG]-[HEX6]
 */
export function generateCredentialId(userName = '', langName = '') {
  const cleanLang = (langName || 'DEV').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3) || 'COD'
  const seed = `${String(userName || '').toLowerCase().trim()}::${String(langName || '').toLowerCase().trim()}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(-6)
  return `KC-2026-${cleanLang}-${hex}`
}

export const PRODUCTION_DOMAIN = 'https://kinetixcode.vercel.app'

/**
 * Build direct verification URL for a certificate.
 * Always targets the production Vercel domain for LinkedIn and QR Codes,
 * so external recruiters and smartphone scanners always reach the live web!
 */
export function getCertificateVerifyUrl({
  credentialId,
  userName = 'Koder Kinetix',
  langName = 'Pemrograman',
}) {
  const params = new URLSearchParams({
    id: credentialId || '',
    name: userName || '',
    lang: langName || '',
  })
  return `${PRODUCTION_DOMAIN}/verify?${params.toString()}`
}

/**
 * Build 1-click Add to LinkedIn Certification URL with prefilled metadata
 * Opens directly with official company ID and verification link
 */
export function getLinkedInCertUrl({
  userName = 'Koder Kinetix',
  langName = 'Python',
  credentialId,
}) {
  const id = credentialId || generateCredentialId(userName, langName)
  const certTitle = `Sertifikat Kompetensi Pemrograman: ${langName}`
  const orgName = 'Kinetix code'
  const certUrl = getCertificateVerifyUrl({ credentialId: id, userName, langName })
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1 // 1-12

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certTitle,
    organizationName: orgName,
    organizationId: LINKEDIN_COMPANY_ID,
    issueOrganizationId: LINKEDIN_COMPANY_ID,
    issueYear: String(year),
    issueMonth: String(month),
    certId: id,
    certUrl: certUrl,
  })

  return `https://www.linkedin.com/profile/add?${params.toString()}`
}

export function loadRewardState() {
  const fallback = {
    spentXP: 0,
    unlockedTitles: [],
    activeTitle: '',
    bonusHearts: 0,
    xpBoostCount: 0,
    unlockedCert: false,
    unlockedCerts: [],
    certDetails: {},
  }
  try {
    const raw = localStorage.getItem(REWARDS_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return {
      spentXP: Math.max(0, Number(parsed.spentXP) || 0),
      unlockedTitles: Array.isArray(parsed.unlockedTitles) ? parsed.unlockedTitles : [],
      activeTitle: typeof parsed.activeTitle === 'string' ? parsed.activeTitle : '',
      bonusHearts: Math.max(0, Number(parsed.bonusHearts) || 0),
      xpBoostCount: Math.max(0, Number(parsed.xpBoostCount) || 0),
      unlockedCert: Boolean(parsed.unlockedCert),
      unlockedCerts: Array.isArray(parsed.unlockedCerts) ? parsed.unlockedCerts : [],
      certDetails: typeof parsed.certDetails === 'object' && parsed.certDetails !== null ? parsed.certDetails : {},
    }
  } catch {
    return fallback
  }
}

export function saveRewardState(nextState) {
  try {
    localStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(nextState))
  } catch {
    // ignore storage quota
  }
}

export function getAvailableXP(totalXP, state = loadRewardState()) {
  return Math.max(0, (Number(totalXP) || 0) - (Number(state.spentXP) || 0))
}

export function getActiveTitleMeta(state = loadRewardState()) {
  if (!state.activeTitle) return null
  return TITLE_CATALOG.find((t) => t.id === state.activeTitle) || null
}

export function refillHintTokensFull() {
  try {
    localStorage.setItem(HINT_STORAGE_KEY, JSON.stringify({ tokens: 3, cooldownUntil: 0 }))
  } catch {
    // ignore
  }
}

/**
 * Called once when starting a quiz session in InteractiveLessonPack.
 * Consumes 1 Extra Heart Shield and/or 1 2x XP Boost if the user has them in inventory.
 */
export function consumeSessionPowerups() {
  const state = loadRewardState()
  let extraHeartActive = false
  let xpBoostActive = false
  const next = { ...state }

  if (next.bonusHearts > 0) {
    extraHeartActive = true
    next.bonusHearts -= 1
  }
  if (next.xpBoostCount > 0) {
    xpBoostActive = true
    next.xpBoostCount -= 1
  }

  if (extraHeartActive || xpBoostActive) {
    saveRewardState(next)
  }

  return { extraHeartActive, xpBoostActive }
}

/**
 * Generate & download an official, highly credible PNG Certificate using HTML5 Canvas.
 * Designed with academic credential standards, verifiable ID, official gold seal, and LinkedIn readiness.
 * Features a REAL scannable QR Code that leads directly to the verification page on the web!
 */
export async function downloadCertificatePng({
  userName = 'Koder Kinetix',
  langName = 'Pemrograman',
  credentialId,
  issueDate,
}) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const credId = credentialId || generateCredentialId(userName, langName)
  const formattedDate = issueDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const verifyUrl = getCertificateVerifyUrl({ credentialId: credId, userName, langName })

  const drawRoundedRect = (x, y, w, h, r) => {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  // 1. Premium Parchment Background
  ctx.fillStyle = '#fafaf8'
  ctx.fillRect(0, 0, 1200, 800)

  // 2. Subtle architectural left brand gradient
  const leftGrad = ctx.createLinearGradient(0, 0, 0, 800)
  leftGrad.addColorStop(0, '#4338ca')
  leftGrad.addColorStop(0.5, '#6366f1')
  leftGrad.addColorStop(1, '#7c3aed')
  ctx.fillStyle = leftGrad
  ctx.fillRect(0, 0, 12, 800)

  // 3. Double Perimeter Frame (Gold outer + crisp slate inner)
  // Outer Gold Frame
  ctx.strokeStyle = '#d97706'
  ctx.lineWidth = 2
  ctx.strokeRect(34, 30, 1132, 740)

  // Inner Slate Hairline
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.strokeRect(42, 38, 1116, 724)

  // Corner Ornaments (Corner geometric brackets)
  const drawCorner = (cx, cy, flipX, flipY) => {
    ctx.save()
    ctx.translate(cx, cy)
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1)
    ctx.strokeStyle = '#d97706'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(0, 24)
    ctx.lineTo(0, 0)
    ctx.lineTo(24, 0)
    ctx.stroke()

    ctx.fillStyle = '#b45309'
    ctx.fillRect(3, 3, 4, 4)
    ctx.restore()
  }
  drawCorner(34, 30, false, false)
  drawCorner(1166, 30, true, false)
  drawCorner(34, 770, false, true)
  drawCorner(1166, 770, true, true)

  // 4. HEADER: Left Accreditation Standard & Right Logo + Verified Badge
  // Header Left
  ctx.textAlign = 'left'
  ctx.fillStyle = '#6366f1'
  ctx.font = '700 11px Inter, system-ui, sans-serif'
  ctx.fillText('STANDAR AKREDITASI & KOMPETENSI KINETIX CODE', 78, 76)

  ctx.fillStyle = '#0f172a'
  ctx.font = '800 24px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText('SERTIFIKAT KOMPETENSI PEMROGRAMAN', 78, 106)

  ctx.fillStyle = '#64748b'
  ctx.font = '600 11px Inter, system-ui, sans-serif'
  ctx.fillText('OFFICIAL CERTIFICATE OF COMPLETION & PROFESSIONAL PROFICIENCY', 78, 124)

  // Header Right: Logo + Official Verified Pill
  const logoSize = 38
  const logoGap = 10
  ctx.font = '800 20px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  const kinetixW = ctx.measureText('Kinetix ').width
  const codeW = ctx.measureText('Code').width
  const totalLogoW = logoSize + logoGap + kinetixW + codeW
  const logoX = 1118 - totalLogoW
  const logoY = 64

  // Purple logo icon
  ctx.fillStyle = '#7c3aed'
  drawRoundedRect(logoX, logoY, logoSize, logoSize, 9)
  ctx.fill()

  // Logo "K"
  const s = logoSize / 48
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 5 * s
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(logoX + 17 * s, logoY + 14 * s)
  ctx.lineTo(logoX + 17 * s, logoY + 34 * s)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(logoX + 32 * s, logoY + 14 * s)
  ctx.lineTo(logoX + 22 * s, logoY + 24 * s)
  ctx.lineTo(logoX + 32 * s, logoY + 34 * s)
  ctx.stroke()

  // Wordmark
  ctx.textAlign = 'left'
  ctx.fillStyle = '#09090b'
  ctx.fillText('Kinetix ', logoX + logoSize + logoGap, logoY + 26)
  ctx.fillStyle = '#7c3aed'
  ctx.fillText('Code', logoX + logoSize + logoGap + kinetixW, logoY + 26)

  // Header Verified Pill Badge (Below logo)
  const pillW = 168
  const pillH = 22
  const pillX = 1118 - pillW
  const pillY = 108
  ctx.fillStyle = '#f0fdf4'
  drawRoundedRect(pillX, pillY, pillW, pillH, 11)
  ctx.fill()
  ctx.strokeStyle = '#86efac'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.fillStyle = '#16a34a'
  ctx.beginPath()
  ctx.arc(pillX + 14, pillY + 11, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.textAlign = 'left'
  ctx.font = '700 10px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#15803d'
  ctx.fillText('TERVERIFIKASI RESMI', pillX + 24, pillY + 15)

  // 5. Divider Line Below Header
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(78, 142)
  ctx.lineTo(1118, 142)
  ctx.stroke()

  // 6. Recipient Section
  ctx.textAlign = 'center'
  ctx.fillStyle = '#64748b'
  ctx.font = '600 12px Inter, system-ui, sans-serif'
  ctx.fillText('DIBERIKAN DENGAN BANGGA KEPADA / THIS IS PROUDLY PRESENTED TO:', 600, 182)

  // Recipient Name (auto-fit font size)
  const cleanName = String(userName || 'Koder Kinetix').trim().slice(0, 36)
  let nameSize = 50
  ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  while (ctx.measureText(cleanName).width > 920 && nameSize > 30) {
    nameSize -= 2
    ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  }
  ctx.fillStyle = '#09090b'
  ctx.fillText(cleanName, 600, 240)

  // Center Underline with diamond
  ctx.strokeStyle = '#cbd5e1'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(420, 260)
  ctx.lineTo(585, 260)
  ctx.moveTo(615, 260)
  ctx.lineTo(780, 260)
  ctx.stroke()

  // Gold Diamond in center
  ctx.fillStyle = '#d97706'
  ctx.beginPath()
  ctx.moveTo(600, 254)
  ctx.lineTo(606, 260)
  ctx.lineTo(600, 266)
  ctx.lineTo(594, 260)
  ctx.closePath()
  ctx.fill()

  // 7. Achievement Statement
  ctx.fillStyle = '#475569'
  ctx.font = '500 14px Inter, system-ui, sans-serif'
  ctx.fillText(
    'Telah menyelesaikan kurikulum pembelajaran interaktif, validasi sintaks kompilasi browser,',
    600,
    294
  )
  ctx.fillText(
    'serta evaluasi pemecahan masalah algoritma secara mandiri pada program keahlian:',
    600,
    314
  )

  // Track Name
  ctx.fillStyle = '#1e1b4b'
  ctx.font = '800 28px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText(`Jalur Spesialisasi: Pemrograman ${langName}`, 600, 356)

  // 8. Three Credibility Pillars (Boxed Badges showing why this cert has weight)
  const cardW = 328
  const cardH = 68
  const gap = 28
  const startX = 78
  const cardY = 384

  const pillars = [
    {
      title: '✓ Ambang Kelulusan ≥ 55%',
      desc: 'Evaluasi checkpoint ketat & bank soal logika acak.',
      accent: '#2563eb',
    },
    {
      title: '✓ Praktik Sintaksis Riil',
      desc: 'Eksekusi kode mandiri langsung di browser tanpa simulator statis.',
      accent: '#7c3aed',
    },
    {
      title: '✓ Kredensial LinkedIn',
      desc: 'ID nomor seri unik & diakui untuk portofolio profesional.',
      accent: '#059669',
    },
  ]

  pillars.forEach((p, idx) => {
    const px = startX + idx * (cardW + gap)
    ctx.fillStyle = '#ffffff'
    drawRoundedRect(px, cardY, cardW, cardH, 8)
    ctx.fill()
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    ctx.stroke()

    // Left accent strip
    ctx.fillStyle = p.accent
    ctx.fillRect(px, cardY + 8, 3, cardH - 16)

    ctx.textAlign = 'left'
    ctx.fillStyle = '#0f172a'
    ctx.font = '700 12px Inter, system-ui, sans-serif'
    ctx.fillText(p.title, px + 14, cardY + 26)

    ctx.fillStyle = '#64748b'
    ctx.font = '400 10.5px Inter, system-ui, sans-serif'
    ctx.fillText(p.desc, px + 14, cardY + 46)
  })

  // 9. Divider Before Authority & Verification Section
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(78, 482)
  ctx.lineTo(1118, 482)
  ctx.stroke()

  // 10. AUTHORITY & CREDIBILITY BOTTOM ROW
  // A. Left: Authentic Digital Signature
  const sigX = 78
  const sigY = 512

  // Stylized signature bezier curves
  ctx.strokeStyle = '#312e81'
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.moveTo(sigX + 15, sigY + 42)
  ctx.bezierCurveTo(sigX + 45, sigY + 10, sigX + 75, sigY + 58, sigX + 110, sigY + 28)
  ctx.bezierCurveTo(sigX + 130, sigY + 8, sigX + 155, sigY + 50, sigX + 195, sigY + 32)
  ctx.bezierCurveTo(sigX + 225, sigY + 20, sigX + 250, sigY + 48, sigX + 275, sigY + 36)
  ctx.stroke()

  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(sigX, sigY + 56)
  ctx.lineTo(sigX + 280, sigY + 56)
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = '#0f172a'
  ctx.font = '700 13px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText('Dewan Kurikulum Kinetix Code', sigX, sigY + 74)

  ctx.fillStyle = '#64748b'
  ctx.font = '500 11px Inter, system-ui, sans-serif'
  ctx.fillText('Tim Standar Mutu & Pembelajaran Digital', sigX, sigY + 90)

  // B. Center: Official Gold Seal (Stempel Emas 32-Point Scalloped Edge)
  const sealX = 600
  const sealY = 574
  const sealRadius = 54

  ctx.save()
  // Draw 32-point scalloped star edge
  ctx.beginPath()
  const points = 32
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points
    const r = i % 2 === 0 ? sealRadius : sealRadius - 4
    const x = sealX + r * Math.cos(angle)
    const y = sealY + r * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()

  const sealGrad = ctx.createRadialGradient(sealX - 12, sealY - 12, 10, sealX, sealY, sealRadius)
  sealGrad.addColorStop(0, '#fde68a')
  sealGrad.addColorStop(0.6, '#d97706')
  sealGrad.addColorStop(1, '#92400e')
  ctx.fillStyle = sealGrad
  ctx.fill()

  ctx.strokeStyle = '#78350f'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Inner Seal Rings
  ctx.beginPath()
  ctx.arc(sealX, sealY, sealRadius - 9, 0, Math.PI * 2)
  ctx.strokeStyle = '#fef3c7'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(sealX, sealY, sealRadius - 13, 0, Math.PI * 2)
  ctx.strokeStyle = '#fef3c7'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Seal Center Text & Status (Clean typography, no emojis)
  ctx.textAlign = 'center'
  ctx.fillStyle = '#fef3c7'
  ctx.font = '700 8.5px Inter, system-ui, sans-serif'
  ctx.fillText('KINETIX CODE', sealX, sealY - 20)

  ctx.font = '800 14px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText('VERIFIED', sealX, sealY - 3)

  ctx.font = '700 8.5px Inter, system-ui, sans-serif'
  ctx.fillText('OFFICIAL CREDENTIAL', sealX, sealY + 11)

  ctx.font = '700 9px "Fira Code", monospace'
  ctx.fillText('2026', sealX, sealY + 24)
  ctx.restore()

  // C. Right: Real Scannable Barcode / QR Code & Verification Details
  const qrX = 840
  const qrY = 506
  const qrSize = 74

  // Render Real Scannable QR Code onto Canvas
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 150,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
    const qrImg = new Image()
    qrImg.src = qrDataUrl
    await new Promise((resolve) => {
      qrImg.onload = resolve
      qrImg.onerror = resolve
    })
    // Background card for QR
    ctx.fillStyle = '#ffffff'
    drawRoundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 6)
    ctx.fill()
    ctx.strokeStyle = '#cbd5e1'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
  } catch {
    ctx.fillStyle = '#ffffff'
    drawRoundedRect(qrX, qrY, qrSize, qrSize, 6)
    ctx.fill()
  }

  // Verification Details Text
  const infoX = qrX + qrSize + 16
  ctx.textAlign = 'left'
  ctx.fillStyle = '#0f172a'
  ctx.font = '800 12.5px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText('Kredensial Terverifikasi', infoX, qrY + 12)

  ctx.fillStyle = '#4338ca'
  ctx.font = '700 12px "Fira Code", monospace'
  ctx.fillText(`ID: ${credId}`, infoX, qrY + 28)

  ctx.fillStyle = '#0284c7'
  ctx.font = '600 10.5px Inter, system-ui, sans-serif'
  ctx.fillText('Penerbit: Kinetix code (LinkedIn)', infoX, qrY + 44)

  ctx.fillStyle = '#64748b'
  ctx.font = '500 10px "Fira Code", monospace'
  ctx.fillText('Pindai Barcode untuk Verifikasi', infoX, qrY + 59)

  ctx.fillStyle = '#334155'
  ctx.font = '500 10.5px Inter, system-ui, sans-serif'
  ctx.fillText(`Diterbitkan: ${formattedDate}`, infoX, qrY + 73)

  // 11. Bottom Security & LinkedIn Recognition Bar
  ctx.strokeStyle = '#e2e8f0'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(78, 690)
  ctx.lineTo(1118, 690)
  ctx.stroke()

  ctx.textAlign = 'center'
  ctx.fillStyle = '#64748b'
  ctx.font = '500 11px Inter, system-ui, sans-serif'
  ctx.fillText(
    'Sertifikat digital ini memiliki kredibilitas resmi berbasis kompetensi nyata dan dapat ditautkan langsung ke profil LinkedIn atau CV profesional.',
    600,
    716
  )

  ctx.fillStyle = '#94a3b8'
  ctx.font = '400 10px "Fira Code", monospace'
  ctx.fillText(
    `SECURE HASH: ${credId} • ISSUED BY KINETIX CODE • ALL RIGHTS RESERVED`,
    600,
    734
  )

  // Trigger File Download
  const langSlug = String(langName || 'Pemrograman')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const nameSlug = cleanName.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')

  const link = document.createElement('a')
  link.download = `Sertifikat-Kinetix-${langSlug}-${nameSlug}-${credId}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
