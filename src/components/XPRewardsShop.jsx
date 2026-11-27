import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  LuCopy,
  LuCheckCheck,
  LuExternalLink,
  LuTarget,
  LuCode,
  LuQrCode,
  LuBuilding,
} from 'react-icons/lu'
import { FaLinkedin } from 'react-icons/fa'
import {
  POWERUP_CATALOG,
  TITLE_CATALOG,
  CERTIFICATE_COST_XP,
  LINKEDIN_COMPANY_ID,
  LINKEDIN_COMPANY_URL,
  loadRewardState,
  saveRewardState,
  getAvailableXP,
  getActiveTitleMeta,
  refillHintTokensFull,
  downloadCertificatePng,
  generateCredentialId,
  getLinkedInCertUrl,
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
  const [copiedId, setCopiedId] = useState('')

  const availableXP = getAvailableXP(totalXP, state)
  const level = Math.floor(totalXP / 100) + 1
  const activeTitleMeta = getActiveTitleMeta(state)

  const currentCredId =
    state.certDetails?.[langName]?.credentialId || generateCredentialId(userName, langName)
  const currentIssueDate = state.certDetails?.[langName]?.issueDate
  const currentLinkedInUrl = getLinkedInCertUrl({
    userName,
    langName,
    credentialId: currentCredId,
    issueDate: currentIssueDate,
  })

  const notify = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const handleCopyId = (id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(id).catch(() => {})
    }
    setCopiedId(id)
    playSoundCue('success')
    notify(`ID Kredensial "${id}" berhasil disalin!`)
    setTimeout(() => setCopiedId(''), 2500)
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
        credentialId: currentCredId,
        issueDate: currentIssueDate,
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

    const newIssueDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

    const next = {
      ...state,
      spentXP: state.spentXP + CERTIFICATE_COST_XP,
      unlockedCert: true,
      unlockedCerts: [...state.unlockedCerts, langName],
      certDetails: {
        ...(state.certDetails || {}),
        [langName]: {
          credentialId: currentCredId,
          issueDate: newIssueDate,
        },
      },
    }
    commitState(next)
    playSoundCue('fanfare')
    downloadCertificatePng({
      userName,
      langName,
      credentialId: currentCredId,
      issueDate: newIssueDate,
    })
    notify(`Sertifikat ${langName} terbuka & otomatis terunduh!`)
  }

  const handleDownloadSavedCert = (savedLang) => {
    const cred = state.certDetails?.[savedLang]
    downloadCertificatePng({
      userName,
      langName: savedLang,
      credentialId: cred?.credentialId,
      issueDate: cred?.issueDate,
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

      {/* Section 1: Hadiah Utama - Sertifikat Kompetensi Digital Kredibel */}
      <div className="xp-shop-section xp-cert-grand-section">
        <div className="xp-section-header-row">
          <div className="xp-heading-with-badge">
            <h3 className="xp-shop-heading">Sertifikat Kompetensi Digital</h3>
            <span className="xp-grand-prize-badge">KREDIBILITAS RESMI</span>
          </div>
          <span className="xp-linkedin-tag">
            <FaLinkedin size={13} /> Siap Masuk LinkedIn
          </span>
        </div>
        <div className="xp-cert-card xp-cert-card-grand">
          <div className="xp-cert-info">
            <div className="xp-cert-icon xp-cert-icon-grand">
              <LuAward size={28} />
            </div>
            <div>
              <div className="xp-cert-title-row">
                <h4>Sertifikat {langName} (PNG 1200×820 Kualitas Tinggi)</h4>
                <span className="xp-cert-pill">
                  <LuShieldCheck size={12} /> Verifikasi Otentik
                </span>
              </div>
              <p>
                Bukti kompetensi resmi atas nama <strong>{userName}</strong> untuk pemahaman sintaksis &amp; logika{' '}
                <strong>{langName}</strong>. Dilengkapi stempel emas resmi, nomor seri ID Kredensial unik, dan passing grade kelulusan ≥ 55%.
              </p>
            </div>
          </div>

          {/* Credential ID and 1-Click Verification Row */}
          <div className="xp-cert-cred-row">
            <div className="xp-cert-cred-item">
              <span className="xp-cert-cred-label">ID KREDENSIAL RESMI</span>
              <div className="xp-cert-cred-value">
                <code>{currentCredId}</code>
                <button
                  type="button"
                  className="btn-cert-copy-id"
                  title="Salin ID Kredensial untuk LinkedIn / CV"
                  onClick={() => handleCopyId(currentCredId)}
                >
                  {copiedId === currentCredId ? <LuCheck size={13} /> : <LuCopy size={13} />}
                  <span>{copiedId === currentCredId ? 'Tersalin' : 'Salin ID'}</span>
                </button>
              </div>
            </div>
            <div className="xp-cert-cred-item">
              <span className="xp-cert-cred-label">ORGANISASI RESMI LINKEDIN</span>
              <a
                href={LINKEDIN_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="xp-cert-org-val-link"
                title="Lihat halaman perusahaan resmi Kinetix code di LinkedIn"
              >
                <FaLinkedin size={15} />
                <strong>Kinetix code</strong>
                <span className="xp-org-id-tag">ID: {LINKEDIN_COMPANY_ID}</span>
                <LuExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Action Buttons: Unlock / Download + Add to LinkedIn + Barcode Verify */}
          <div className="xp-cert-actions-row">
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
                  <LuDownload size={16} /> Unduh Sertifikat {langName} (PNG)
                </>
              ) : (
                <>
                  <LuZap size={15} /> Buka Sertifikat {langName} ({CERTIFICATE_COST_XP} XP)
                </>
              )}
            </button>

            {isCurrentCertUnlocked ? (
              <>
                <a
                  href={currentLinkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-xp-linkedin"
                  title="Tambahkan lisensi dan sertifikat ini ke profil LinkedIn Anda secara instan"
                >
                  <FaLinkedin size={16} />
                  <span>Tambah ke Profil LinkedIn</span>
                  <LuExternalLink size={13} />
                </a>

                <Link
                  to={`/verify?id=${currentCredId}&name=${encodeURIComponent(userName)}&lang=${encodeURIComponent(langName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-xp-verify-view"
                  title="Buka halaman verifikasi dan barcode sertifikat resmi ini"
                >
                  <LuQrCode size={15} />
                  <span>Cek Barcode Web</span>
                  <LuExternalLink size={12} />
                </Link>
              </>
            ) : (
              <span className="xp-linkedin-preview-hint">
                <FaLinkedin size={13} /> Buka dengan {CERTIFICATE_COST_XP} XP untuk 1-Klik Tambah ke Profil LinkedIn
              </span>
            )}
          </div>

          {/* 4 Credibility Pillars Explaining Value to Recruiters (NO EMOJIS - PURE ICONS) */}
          <div className="xp-credibility-pillars">
            <div className="xp-pillar-item">
              <div className="xp-pillar-icon">
                <LuTarget size={17} />
              </div>
              <div className="xp-pillar-text">
                <strong>Passing Grade ≥ 55%</strong>
                <small>Bukan sekadar tontonan, wajib lulus evaluasi logika &amp; kuis acak.</small>
              </div>
            </div>
            <div className="xp-pillar-item">
              <div className="xp-pillar-icon">
                <LuCode size={17} />
              </div>
              <div className="xp-pillar-text">
                <strong>Validasi Sintaks Riil</strong>
                <small>Eksekusi kode langsung di browser tanpa simulator statis.</small>
              </div>
            </div>
            <div className="xp-pillar-item">
              <div className="xp-pillar-icon">
                <LuShieldCheck size={17} />
              </div>
              <div className="xp-pillar-text">
                <strong>ID Seri Anti-Duplikasi</strong>
                <small>Kode unik {currentCredId.slice(-6)} untuk verifikasi rekruter &amp; kampus.</small>
              </div>
            </div>
            <div className="xp-pillar-item">
              <div className="xp-pillar-icon">
                <FaLinkedin size={17} />
              </div>
              <div className="xp-pillar-text">
                <strong>Standar LinkedIn Terintegrasi</strong>
                <small>Terkoneksi ke halaman organisasi Kinetix code (ID: {LINKEDIN_COMPANY_ID}).</small>
              </div>
            </div>
          </div>
        </div>

        {state.unlockedCerts.length > 0 && (
          <div className="xp-cert-owned-list">
            <span className="xp-cert-owned-label">Sertifikat Terverifikasi yang Anda Miliki:</span>
            <div className="xp-cert-owned-chips">
              {state.unlockedCerts.map((savedLang) => {
                const cred = state.certDetails?.[savedLang]
                const credId = cred?.credentialId || generateCredentialId(userName, savedLang)
                const linkedInUrl = getLinkedInCertUrl({
                  userName,
                  langName: savedLang,
                  credentialId: credId,
                  issueDate: cred?.issueDate,
                })

                return (
                  <div key={savedLang} className="xp-cert-owned-item">
                    <button
                      type="button"
                      className="xp-cert-owned-chip"
                      onClick={() => handleDownloadSavedCert(savedLang)}
                      title={`Unduh PNG ${savedLang}`}
                    >
                      <LuDownload size={13} />
                      <span>{savedLang}</span>
                    </button>
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="xp-owned-linkedin-btn"
                      title={`Tambah ${savedLang} ke LinkedIn`}
                    >
                      <FaLinkedin size={12} />
                      <span>+ LinkedIn</span>
                    </a>
                  </div>
                )
              })}
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
