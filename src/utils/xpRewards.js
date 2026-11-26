// XP Rewards & Power-ups Manager for Kinetix Code
// Spending XP uses a separate spentXP ledger so Total XP, Unit Unlocks, and Leaderboard Rank NEVER drop!

export const REWARDS_STORAGE_KEY = 'kinetix_xp_rewards'
const HINT_STORAGE_KEY = 'kinetix_hint_state'

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

export function loadRewardState() {
  const fallback = {
    spentXP: 0,
    unlockedTitles: [],
    activeTitle: '',
    bonusHearts: 0,
    xpBoostCount: 0,
    unlockedCert: false,
    unlockedCerts: [],
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
 * Generate & download a clean, minimalist PNG Certificate using HTML5 Canvas
 */
export function downloadCertificatePng({
  userName = 'Koder Kinetix',
  langName = 'Pemrograman',
}) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 760
  const ctx = canvas.getContext('2d')
  if (!ctx) return

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

  // Clean off-white paper background
  ctx.fillStyle = '#fafafa'
  ctx.fillRect(0, 0, 1200, 760)

  // Subtle architectural left accent bar
  ctx.fillStyle = '#7c3aed'
  ctx.fillRect(0, 0, 10, 760)

  // Single crisp hairline border
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 1.5
  ctx.strokeRect(48, 48, 1104, 664)

  // ===== TOP-LEFT: Minimal label =====
  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '600 14px Inter, system-ui, sans-serif'
  ctx.fillText('SERTIFIKAT PENYELESAIAN', 104, 122)

  // ===== TOP-RIGHT: Kinetix Code Logo (right-aligned to 1096) =====
  const logoSize = 40
  const logoGap = 12
  ctx.font = '800 22px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  const kinetixW = ctx.measureText('Kinetix ').width
  const codeW = ctx.measureText('Code').width
  const totalLogoW = logoSize + logoGap + kinetixW + codeW
  const logoX = 1096 - totalLogoW
  const logoY = 96

  // Purple rounded square icon matching KinetixLogo.jsx
  ctx.fillStyle = '#7c3aed'
  drawRoundedRect(logoX, logoY, logoSize, logoSize, 10)
  ctx.fill()

  // White "K" (vertical bar + "<" bracket) scaled from 48x48 viewBox
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

  // Wordmark next to icon
  ctx.textAlign = 'left'
  ctx.fillStyle = '#09090b'
  ctx.fillText('Kinetix ', logoX + logoSize + logoGap, logoY + 28)
  ctx.fillStyle = '#7c3aed'
  ctx.fillText('Code', logoX + logoSize + logoGap + kinetixW, logoY + 28)

  // ===== MAIN CONTENT (Left-aligned editorial) =====
  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '500 20px Inter, system-ui, sans-serif'
  ctx.fillText('Diberikan kepada', 104, 268)

  // Recipient Name (auto-fit font size if long)
  const cleanName = String(userName || 'Koder Kinetix').trim().slice(0, 36)
  let nameSize = 58
  ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  while (ctx.measureText(cleanName).width > 980 && nameSize > 34) {
    nameSize -= 2
    ctx.font = `800 ${nameSize}px "Plus Jakarta Sans", Inter, system-ui, sans-serif`
  }
  ctx.fillStyle = '#09090b'
  ctx.fillText(cleanName, 104, 342)

  // Minimal short accent rule
  ctx.fillStyle = '#7c3aed'
  ctx.fillRect(104, 382, 72, 4)

  // Theme / Track
  ctx.fillStyle = '#71717a'
  ctx.font = '500 18px Inter, system-ui, sans-serif'
  ctx.fillText('Tema Pembelajaran', 104, 444)

  ctx.fillStyle = '#18181b'
  ctx.font = '700 32px "Plus Jakarta Sans", Inter, system-ui, sans-serif'
  ctx.fillText(String(langName || 'Pemrograman'), 104, 488)

  ctx.fillStyle = '#52525b'
  ctx.font = '400 18px Inter, system-ui, sans-serif'
  ctx.fillText(
    'Telah menyelesaikan materi dan latihan interaktif pada jalur pembelajaran ini.',
    104,
    532
  )

  // ===== FOOTER =====
  ctx.strokeStyle = '#e4e4e7'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(104, 616)
  ctx.lineTo(1096, 616)
  ctx.stroke()

  const issuedDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  ctx.textAlign = 'left'
  ctx.fillStyle = '#71717a'
  ctx.font = '500 15px Inter, system-ui, sans-serif'
  ctx.fillText(issuedDate, 104, 658)

  ctx.textAlign = 'right'
  ctx.fillStyle = '#a1a1aa'
  ctx.font = '500 14px "Fira Code", monospace'
  ctx.fillText('kinetixcode.vercel.app', 1096, 658)

  const langSlug = String(langName || 'Pemrograman')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const nameSlug = cleanName.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '')

  const link = document.createElement('a')
  link.download = `Sertifikat-Kinetix-${langSlug}-${nameSlug}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
