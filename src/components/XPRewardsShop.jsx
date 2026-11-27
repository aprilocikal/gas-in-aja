import { useState } from 'react'
import {
  LuZap,
  LuLightbulb,
  LuHeart,
  LuSparkles,
  LuAward,
  LuCheck,
  LuDownload,
  LuLock,
  LuShieldCheck,
} from 'react-icons/lu'
import {
  POWERUP_CATALOG,
  TITLE_CATALOG,
  CERTIFICATE_COST_XP,
  loadRewardState,
  saveRewardState,
  getAvailableXP,
  getActiveTitleMeta,
  refillHintTokensFull,
  downloadCertificatePng,
} from '../utils/xpRewards'
import { playSoundCue } from './AccessibilityToolbar'
import './XPRewardsShop.css'

export default function XPRewardsShop({
  totalXP = 0,
  userName = 'Koder',
  langName = 'Python',
  onRewardsUpdated,
}) {
  const [state, setState] = useState(() => loadRewardState())
  const [toast, setToast] = useState('')

  const availableXP = getAvailableXP(totalXP, state)
  const level = Math.floor(totalXP / 100) + 1
  const activeTitleMeta = getActiveTitleMeta(state)

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const commitState = (next) => {
    setState(next)
    saveRewardState(next)
    onRewardsUpdated?.(next)
  }

  const handleBuyPowerup = (item) => {
    if (availableXP < item.cost) {
      playSoundCue('locked')
      notify(`Saldo XP belum cukup! Butuh ${item.cost - availableXP} XP lagi.`)
      return
    }

    const next = { ...state, spentXP: state.spentXP + item.cost }
    if (item.id === 'hint_refill') {
      refillHintTokensFull()
      notify('Token Hint berhasil diisi penuh (3/3) & cooldown dihapus!')
    } else if (item.id === 'extra_heart') {
      next.bonusHearts += 1
      notify('Perisai +1 Nyawa Ekstra siap dipakai di kuis berikutnya!')
    } else if (item.id === 'xp_boost') {
      next.xpBoostCount += 1
      notify('Boost 2x XP aktif untuk sesi checkpoint berikutnya!')
    }

    commitState(next)
    playSoundCue('success')
  }

  const handleTitleAction = (title) => {
    const owned = state.unlockedTitles.includes(title.id)
    if (owned) {
      const next = {
        ...state,
        activeTitle: state.activeTitle === title.id ? '' : title.id,
      }
      commitState(next)
      playSoundCue('toggle')
      notify(
        next.activeTitle
          ? `Gelar "${title.label}" dipasang di profil kamu!`
          : 'Gelar profil dilepas.'
      )
      return
    }

    if (availableXP < title.cost) {
      playSoundCue('locked')
      notify(`Butuh ${title.cost - availableXP} XP lagi untuk membuka gelar "${title.label}".`)
      return
    }

    const next = {
      ...state,
      spentXP: state.spentXP + title.cost,
      unlockedTitles: [...state.unlockedTitles, title.id],
      activeTitle: title.id,
    }
    commitState(next)
    playSoundCue('fanfare')
    notify(`Selamat! Gelar "${title.label}" terbuka & langsung terpasang!`)
  }

  const isCurrentCertUnlocked = state.unlockedCerts.includes(langName)

  const handleCertificate = () => {
    if (isCurrentCertUnlocked) {
      downloadCertificatePng({
        userName,
        langName,
      })
      playSoundCue('success')
      notify(`Sertifikat ${langName} (PNG) berhasil diunduh!`)
      return
    }

    if (availableXP < CERTIFICATE_COST_XP) {
      playSoundCue('locked')
      notify(`Butuh ${CERTIFICATE_COST_XP - availableXP} XP lagi untuk membuka sertifikat ${langName}.`)
      return
    }

    const next = {
      ...state,
      spentXP: state.spentXP + CERTIFICATE_COST_XP,
      unlockedCert: true,
      unlockedCerts: [...state.unlockedCerts, langName],
    }
    commitState(next)
    playSoundCue('fanfare')
    downloadCertificatePng({
      userName,
      langName,
    })
    notify(`Sertifikat ${langName} terbuka & otomatis terunduh!`)
  }

  const handleDownloadSavedCert = (savedLang) => {
    downloadCertificatePng({
      userName,
      langName: savedLang,
    })
    playSoundCue('success')
    notify(`Sertifikat ${savedLang} (PNG) berhasil diunduh!`)
  }

  const getPowerupIcon = (id) => {
    if (id === 'hint_refill') return <LuLightbulb size={20} />
    if (id === 'extra_heart') return <LuHeart size={20} />
    return <LuSparkles size={20} />
  }

  const getPowerupStock = (id) => {
    if (id === 'extra_heart') return state.bonusHearts
    if (id === 'xp_boost') return state.xpBoostCount
    return 0
  }

  return (
    <div className="xp-shop-root">
      {/* Balance Banner */}
      <div className="xp-balance-card">
        <div className="xp-balance-left">
          <span className="xp-balance-label">SALDO TUKAR XP</span>
          <div className="xp-balance-val">
            <LuZap size={22} className="icon-orange" />
            <strong>{availableXP} XP</strong>
            <span className="xp-total-sub">(Total Rank: {totalXP} XP)</span>
          </div>
          <p className="xp-balance-note">
            <LuShieldCheck size={14} /> Aman! Menukar XP di sini tidak mengurangi peringkat Papan Skor atau membuka ulang Unit.
          </p>
        </div>
        {(state.bonusHearts > 0 || state.xpBoostCount > 0) && (
          <div className="xp-active-buffs">
            {state.bonusHearts > 0 && (
              <span className="xp-buff-chip buff-heart">
                <LuHeart size={13} /> +{state.bonusHearts} Perisai Nyawa
              </span>
            )}
            {state.xpBoostCount > 0 && (
              <span className="xp-buff-chip buff-boost">
                <LuSparkles size={13} /> {state.xpBoostCount}x Boost 2x XP
              </span>
            )}
          </div>
        )}
      </div>

      {toast && <div className="xp-shop-toast">{toast}</div>}

      {/* Section 1: Hadiah Utama - Sertifikat Pencapaian Digital */}
      <div className="xp-shop-section xp-cert-grand-section">
        <div className="xp-section-header-row">
          <div className="xp-heading-with-badge">
            <h3 className="xp-shop-heading">Sertifikat Pencapaian Digital</h3>
            <span className="xp-grand-prize-badge">HADIAH UTAMA</span>
          </div>
          <span className="xp-linkedin-tag">Siap Dipajang di LinkedIn</span>
        </div>
        <div className="xp-cert-card xp-cert-card-grand">
          <div className="xp-cert-info">
            <div className="xp-cert-icon xp-cert-icon-grand">
              <LuAward size={28} />
            </div>
            <div>
              <div className="xp-cert-title-row">
                <h4>Sertifikat {langName} (PNG Kualitas Tinggi)</h4>
                <span className="xp-cert-pill">Verifikasi Otentik</span>
              </div>
              <p>
                Bukti kompetensi resmi atas nama <strong>{userName}</strong> untuk pemahaman sintaksis{' '}
                <strong>{langName}</strong>. Format PNG siap upload langsung ke profil LinkedIn atau CV digital.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={`btn-xp-cert btn-xp-cert-grand ${
              isCurrentCertUnlocked
                ? 'is-unlocked'
                : availableXP >= CERTIFICATE_COST_XP
                ? 'can-afford'
                : 'locked'
            }`}
            onClick={handleCertificate}
          >
            {isCurrentCertUnlocked ? (
              <>
                <LuDownload size={16} /> Unduh {langName} (PNG)
              </>
            ) : (
              <>
                <LuZap size={15} /> Buka {langName} ({CERTIFICATE_COST_XP} XP)
              </>
            )}
          </button>
        </div>

        {state.unlockedCerts.length > 0 && (
          <div className="xp-cert-owned-list">
            <span className="xp-cert-owned-label">Sertifikat yang sudah dimiliki:</span>
            <div className="xp-cert-owned-chips">
              {state.unlockedCerts.map((savedLang) => (
                <button
                  key={savedLang}
                  type="button"
                  className="xp-cert-owned-chip"
                  onClick={() => handleDownloadSavedCert(savedLang)}
                >
                  <LuDownload size={13} />
                  <span>{savedLang}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Quiz Power-Ups */}
      <div className="xp-shop-section">
        <h3 className="xp-shop-heading">Power Up Kuis Interaktif</h3>
        <div className="xp-shop-grid">
          {POWERUP_CATALOG.map((item) => {
            const canAfford = availableXP >= item.cost
            const stock = getPowerupStock(item.id)
            return (
              <div key={item.id} className="xp-item-card">
                <div className="xp-item-top">
                  <div
                    className="xp-item-icon"
                    style={{ color: item.accent, borderColor: `${item.accent}44` }}
                  >
                    {getPowerupIcon(item.id)}
                  </div>
                  <span className="xp-item-badge">{item.badge}</span>
                </div>
                <h4>{item.name}</h4>
                <p>{item.desc}</p>
                {stock > 0 && <span className="xp-stock-note">Stok siap pakai: {stock}</span>}
                <button
                  type="button"
                  className={`btn-xp-redeem ${canAfford ? 'can-afford' : 'locked'}`}
                  onClick={() => handleBuyPowerup(item)}
                >
                  <LuZap size={14} /> Tukar {item.cost} XP
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3: Exclusive Profile Titles */}
      <div className="xp-shop-section">
        <h3 className="xp-shop-heading">Gelar Profil Eksklusif</h3>
        <div className="xp-titles-grid">
          {TITLE_CATALOG.map((title) => {
            const owned = state.unlockedTitles.includes(title.id)
            const equipped = state.activeTitle === title.id
            const canAfford = availableXP >= title.cost
            return (
              <div key={title.id} className={`xp-title-card ${equipped ? 'is-equipped' : ''}`}>
                <span
                  className="xp-title-preview"
                  style={{ color: title.color, borderColor: `${title.color}55` }}
                >
                  <LuAward size={13} /> {title.label}
                </span>
                <button
                  type="button"
                  className={`btn-xp-title ${
                    equipped ? 'is-equipped' : owned ? 'is-owned' : canAfford ? 'can-afford' : 'locked'
                  }`}
                  onClick={() => handleTitleAction(title)}
                >
                  {equipped ? (
                    <>
                      <LuCheck size={13} /> Terpasang
                    </>
                  ) : owned ? (
                    'Pasang Gelar'
                  ) : (
                    <>
                      {canAfford ? <LuZap size={13} /> : <LuLock size={13} />} {title.cost} XP
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
