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
 * Generate & download a crisp PNG Certificate of Achievement using HTML5 Canvas
 */
export function downloadCertificatePng({
  userName = 'Koder Kinetix',
  langName = 'Pemrograman',
  xp = 0,
  level = 1,
  titleLabel = '',
}) {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 760
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Deep obsidian background
  ctx.fillStyle = '#0b0e1a'
  ctx.fillRect(0, 0, 1200, 760)

  // Subtle decorative border frame
  ctx.strokeStyle = '#4f46e5'
  ctx.lineWidth = 4
  ctx.strokeRect(36, 36, 1128, 688)

  ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(52, 52, 1096, 656)

  // Top brand badge
  ctx.fillStyle = '#4f46e5'
  ctx.fillRect(510, 88, 180, 36)
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 15px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('KINETIX CODE', 600, 111)

  // Heading
  ctx.fillStyle = '#a5b4fc'
  ctx.font = '700 18px Inter, system-ui, sans-serif'
  ctx.fillText('SERTIFIKAT PENCAPAIAN BELAJAR', 600, 178)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '500 19px Inter, system-ui, sans-serif'
  ctx.fillText('Diberikan dengan bangga kepada:', 600, 232)

  // Recipient name
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 50px Inter, system-ui, sans-serif'
  ctx.fillText(String(userName).slice(0, 30), 600, 306)

  // Optional title pill
  if (titleLabel) {
    ctx.fillStyle = '#fbbf24'
    ctx.font = '700 18px Inter, system-ui, sans-serif'
    ctx.fillText(`★ ${titleLabel} ★`, 600, 348)
  }

  // Divider
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(260, 382)
  ctx.lineTo(940, 382)
  ctx.stroke()

  // Description
  ctx.fillStyle = '#cbd5e1'
  ctx.font = '500 20px Inter, system-ui, sans-serif'
  ctx.fillText(`Atas dedikasi dan capaian belajar pemrograman & algoritma interaktif`, 600, 434)
  ctx.fillStyle = '#818cf8'
  ctx.font = '700 22px Inter, system-ui, sans-serif'
  ctx.fillText(`Fokus Jalur: ${langName}`, 600, 472)

  // Stats boxes
  const stats = [
    { label: 'TOTAL XP', value: `${xp} XP` },
    { label: 'LEVEL DICAPAI', value: `LVL ${level}` },
    {
      label: 'TANGGAL TERBIT',
      value: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  ]

  stats.forEach((s, i) => {
    const x = 210 + i * 280
    ctx.fillStyle = '#13182b'
    ctx.fillRect(x, 520, 220, 96)
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.3)'
    ctx.lineWidth = 1.2
    ctx.strokeRect(x, 520, 220, 96)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '700 13px Inter, system-ui, sans-serif'
    ctx.fillText(s.label, x + 110, 552)

    ctx.fillStyle = '#ffffff'
    ctx.font = '800 24px Inter, system-ui, sans-serif'
    ctx.fillText(s.value, x + 110, 590)
  })

  // Footer verification line
  ctx.fillStyle = '#64748b'
  ctx.font = '600 14px Inter, system-ui, sans-serif'
  ctx.fillText('Terverifikasi secara digital oleh Kinetix Code Learning Platform', 600, 672)

  const link = document.createElement('a')
  link.download = `Sertifikat-Kinetix-Code-${String(userName).replace(/\s+/g, '-')}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
