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
 * Generate & download a clean, minimalist, professional PNG Certificate using HTML5 Canvas.
 * Modern tech design with clean typography, official Kinetix Code branding,
 * and a real scannable QR Code that leads directly to the online verification portal.
 */
export async function downloadCertificatePng({
  userName = 'Koder Kinetix',
  langName = 'Pemrograman',
  credentialId,
  issueDate,
}) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 760
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const credId = credentialId || generateCredentialId(userName, langName)
  const formattedDate =
    issueDate ||
    new Date().toLocaleDateString('id-ID', {
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

  // 1. Clean off-white paper background
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, 1200, 760)

  // 2. Subtle architectural left accent bar
  ctx.fillStyle = '#7c3aed'
  ctx.fillRect(0, 0, 10, 760)

  // 3. Single crisp hairline border
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 1.5
  ctx.strokeRect(48, 48, 1104, 664)

  // ===== TOP-LEFT: Minimalist Label =====
  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '600 13px Inter, system-ui, sans-serif'
  ctx.fillText('SERTIFIKAT KOMPETENSI', 104, 118)

  // ===== TOP-RIGHT: Kinetix Code Logo + Clean ID Pill =====
  const logoSize = 38
  const logoGap = 12
  ctx.font = '800 22px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  const kinetixW = ctx.measureText('Kinetix ').width
  const codeW = ctx.measureText('Code').width
  const totalLogoW = logoSize + logoGap + kinetixW + codeW
  const logoX = 1096 - totalLogoW
  const logoY = 94

  // Purple logo icon
  ctx.fillStyle = '#7c3aed'
  drawRoundedRect(logoX, logoY, logoSize, logoSize, 9)
  ctx.fill()

  // White "K" mark
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
  ctx.fillText('Kinetix ', logoX + logoSize + logoGap, logoY + 27)
  ctx.fillStyle = '#7c3aed'
  ctx.fillText('Code', logoX + logoSize + logoGap + kinetixW, logoY + 27)

  // ===== MAIN EDITORIAL CONTENT =====
  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '500 18px Inter, system-ui, sans-serif'
  ctx.fillText('Diberikan kepada', 104, 252)

  // Candidate Name (auto-fit font size if long)
  const cleanName = String(userName || 'Koder Kinetix').trim().slice(0, 36)
  let nameSize = 54
  ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  while (ctx.measureText(cleanName).width > 960 && nameSize > 32) {
    nameSize -= 2
    ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  }
  ctx.fillStyle = '#09090b'
  ctx.fillText(cleanName, 104, 322)

  // Clean flat purple accent line (simple, no diamonds, no AI slop)
  ctx.fillStyle = '#7c3aed'
  ctx.fillRect(104, 350, 56, 4)

  // Specialization Track
  ctx.fillStyle = '#71717a'
  ctx.font = '500 16px Inter, system-ui, sans-serif'
  ctx.fillText('Jalur Pembelajaran', 104, 412)

  ctx.fillStyle = '#18181b'
  ctx.font = '700 32px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText(`Pemrograman ${String(langName || 'Dasar')}`, 104, 456)

  ctx.fillStyle = '#52525b'
  ctx.font = '400 16px Inter, system-ui, sans-serif'
  ctx.fillText(
    'Telah menyelesaikan materi kurikulum, latihan interaktif, dan evaluasi logika pada platform Kinetix Code.',
    104,
    498
  )

  // ===== FOOTER SECTION =====
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(104, 584)
  ctx.lineTo(1096, 584)
  ctx.stroke()

  // Left Footer: Date & Official Issuer
  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '500 13px Inter, system-ui, sans-serif'
  ctx.fillText(`Diterbitkan pada: ${formattedDate}`, 104, 622)

  ctx.fillStyle = '#a1a1aa'
  ctx.font = '500 12px Inter, system-ui, sans-serif'
  ctx.fillText('Penerbit: Kinetix code (LinkedIn: 144186335)', 104, 644)

  ctx.fillStyle = '#a1a1aa'
  ctx.font = '500 12px "Fira Code", monospace'
  ctx.fillText(`ID Kredensial: ${credId}`, 104, 666)

  // Right Footer: Real Scannable Barcode / QR Code
  const qrX = 800
  const qrY = 596
  const qrSize = 92

  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      margin: 2,
      width: 280,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
    const qrImg = new Image()
    qrImg.src = qrDataUrl
    await new Promise((resolve) => {
      qrImg.onload = resolve
      qrImg.onerror = resolve
    })
    // Crisp white background padding for guaranteed quiet zone detection
    ctx.fillStyle = '#ffffff'
    drawRoundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 4)
    ctx.fill()

    // Disable image smoothing for razor-sharp QR modules
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
    ctx.imageSmoothingEnabled = true
  } catch {
    ctx.fillStyle = '#ffffff'
    drawRoundedRect(qrX, qrY, qrSize, qrSize, 4)
    ctx.fill()
  }

  // QR Meta Text
  const infoX = qrX + qrSize + 14
  ctx.textAlign = 'left'
  ctx.fillStyle = '#09090b'
  ctx.font = '600 12px Inter, system-ui, sans-serif'
  ctx.fillText('Pindai untuk Verifikasi', infoX, qrY + 22)

  ctx.fillStyle = '#7c3aed'
  ctx.font = '600 11.5px "Fira Code", monospace'
  ctx.fillText(credId, infoX, qrY + 44)

  ctx.fillStyle = '#71717a'
  ctx.font = '500 11px "Fira Code", monospace'
  ctx.fillText('kinetixcode.vercel.app/verify', infoX, qrY + 66)

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
