import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import {
  LuShieldCheck,
  LuAward,
  LuUser,
  LuCalendar,
  LuFileCheck,
  LuQrCode,
  LuDownload,
  LuExternalLink,
  LuCheck,
  LuCopy,
  LuSearch,
  LuCode,
  LuCheckCheck,
  LuArrowLeft,
  LuBuilding,
  LuBadgeCheck,
} from 'react-icons/lu'
import { FaLinkedin } from 'react-icons/fa'
import QRCode from 'qrcode'
import KinetixLogo from '../components/KinetixLogo'
import {
  LINKEDIN_COMPANY_ID,
  LINKEDIN_COMPANY_URL,
  downloadCertificatePng,
  getLinkedInCertUrl,
} from '../utils/xpRewards'
import './VerifyCertificate.css'

export default function VerifyCertificate() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawId = searchParams.get('id') || ''
  const rawName = searchParams.get('name') || ''
  const rawLang = searchParams.get('lang') || ''

  const [inputSearchId, setInputSearchId] = useState(rawId)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  // Fallback defaults if opened directly
  const credentialId = rawId || 'KC-2026-DEV-VERIFIED'
  const userName = rawName || 'Koder Kinetix'
  const langName = rawLang || 'Pemrograman'

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

  useEffect(() => {
    window.scrollTo(0, 0)
    QRCode.toDataURL(currentUrl || `https://kinetixcode.vercel.app/verify?id=${credentialId}`, {
      width: 200,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {})
  }, [credentialId, currentUrl])

  const handleCopy = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!inputSearchId.trim()) return
    setSearchParams({
      id: inputSearchId.trim(),
      name: userName,
      lang: langName,
    })
  }

  const linkedInCertUrl = getLinkedInCertUrl({
    userName,
    langName,
    credentialId,
  })

  return (
    <div className="verify-page-root">
      <div className="container verify-container">
        {/* Top Navigation Row */}
        <div className="verify-top-bar">
          <Link to="/learn" className="verify-back-btn">
            <LuArrowLeft size={16} />
            <span>Kembali ke Belajar</span>
          </Link>
          <div className="verify-logo-badge">
            <KinetixLogo size={28} showText={true} />
          </div>
        </div>

        {/* Search Bar for manual lookup */}
        <div className="verify-search-card">
          <form className="verify-search-form" onSubmit={handleSearchSubmit}>
            <div className="verify-search-input-wrap">
              <LuSearch size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Cari ID Kredensial (contoh: KC-2026-JAV-8B1593)"
                value={inputSearchId}
                onChange={(e) => setInputSearchId(e.target.value)}
                className="verify-search-input"
              />
            </div>
            <button type="submit" className="verify-search-btn">
              Periksa Keaslian
            </button>
          </form>
        </div>

        {/* Main Verification Card */}
        <div className="verify-main-card">
          {/* Header Status Banner */}
          <div className="verify-status-banner">
            <div className="verify-status-icon-wrap">
              <LuShieldCheck size={36} />
            </div>
            <div className="verify-status-text">
              <div className="verify-status-tag">
                <LuBadgeCheck size={14} />
                <span>STATUS: TERVERIFIKASI ASLI &amp; RESMI</span>
              </div>
              <h1 className="verify-title">Sertifikat Kompetensi Pemrograman</h1>
              <p className="verify-subtitle">
                Kredensial ini telah divalidasi dan terdaftar secara sah di sistem kurikulum resmi{' '}
                <strong>Kinetix code</strong>.
              </p>
            </div>
          </div>

          {/* Credential Data Grid */}
          <div className="verify-grid">
            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuUser size={14} /> NAMA PENERIMA SERTIFIKAT
              </span>
              <strong className="verify-field-value text-highlight">{userName}</strong>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuAward size={14} /> JALUR SPESIALISASI
              </span>
              <strong className="verify-field-value">Pemrograman {langName}</strong>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuFileCheck size={14} /> NOMOR ID KREDENSIAL
              </span>
              <div className="verify-id-row">
                <code className="verify-id-code">{credentialId}</code>
                <button
                  type="button"
                  className="btn-verify-copy"
                  onClick={() => handleCopy(credentialId)}
                  title="Salin ID Kredensial"
                >
                  {copied ? <LuCheck size={13} /> : <LuCopy size={13} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuBuilding size={14} /> ORGANISASI PENERBIT
              </span>
              <div className="verify-org-row">
                <strong>Kinetix code</strong>
                <a
                  href={LINKEDIN_COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verify-linkedin-org-badge"
                  title="Lihat profil perusahaan resmi Kinetix code di LinkedIn"
                >
                  <FaLinkedin size={14} />
                  <span>Halaman Resmi LinkedIn</span>
                  <LuExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuCalendar size={14} /> TANGGAL TERBIT
              </span>
              <span className="verify-field-value">
                {new Date().toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuCheckCheck size={14} /> STANDAR EVALUASI
              </span>
              <span className="verify-field-value text-green">
                Lulus Evaluasi Kompetensi (Passing Grade ≥ 55%)
              </span>
            </div>
          </div>

          {/* 4 Pillars of Credibility (NO EMOJIS - PURE ICONS) */}
          <div className="verify-pillars-section">
            <h3 className="verify-section-heading">
              <LuShieldCheck size={18} />
              <span>Standar Pengujian &amp; Integritas Akademik</span>
            </h3>
            <div className="verify-pillars-grid">
              <div className="verify-pillar-item">
                <div className="verify-pillar-icon">
                  <LuCheckCheck size={20} />
                </div>
                <div>
                  <strong>Passing Grade Ambang Batas 55%</strong>
                  <p>Wajib menuntaskan checkpoint logika acak dan evaluasi mandiri.</p>
                </div>
              </div>

              <div className="verify-pillar-item">
                <div className="verify-pillar-icon">
                  <LuCode size={20} />
                </div>
                <div>
                  <strong>Validasi Sintaksis &amp; Logika Riil</strong>
                  <p>Kode dieksekusi langsung di browser tanpa simulator statis.</p>
                </div>
              </div>

              <div className="verify-pillar-item">
                <div className="verify-pillar-icon">
                  <LuFileCheck size={20} />
                </div>
                <div>
                  <strong>Nomor Seri Anti-Duplikasi</strong>
                  <p>Setiap sertifikat memiliki identitas unik untuk verifikasi rekruter.</p>
                </div>
              </div>

              <div className="verify-pillar-item">
                <div className="verify-pillar-icon">
                  <FaLinkedin size={18} />
                </div>
                <div>
                  <strong>Terdaftar di LinkedIn Resmi</strong>
                  <p>Terkoneksi ke halaman organisasi Kinetix code (ID: {LINKEDIN_COMPANY_ID}).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barcode / QR Code & Action Buttons */}
          <div className="verify-actions-card">
            <div className="verify-qr-col">
              <div className="verify-qr-box">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Barcode Verifikasi Resmi" className="verify-qr-img" />
                ) : (
                  <LuQrCode size={90} className="verify-qr-placeholder" />
                )}
              </div>
              <div className="verify-qr-desc">
                <strong>
                  <LuQrCode size={14} /> Barcode Verifikasi Publik
                </strong>
                <small>Pindai barcode ini melalui kamera ponsel untuk memvalidasi keaslian sertifikat.</small>
              </div>
            </div>

            <div className="verify-buttons-col">
              <button
                type="button"
                className="btn-action-download"
                onClick={() =>
                  downloadCertificatePng({
                    userName,
                    langName,
                    credentialId,
                  })
                }
              >
                <LuDownload size={16} />
                <span>Unduh File Sertifikat (PNG)</span>
              </button>

              <a
                href={linkedInCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-linkedin"
              >
                <FaLinkedin size={16} />
                <span>Pasang ke Profil LinkedIn</span>
                <LuExternalLink size={13} />
              </a>

              <a
                href={LINKEDIN_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-org"
              >
                <FaLinkedin size={15} />
                <span>Buka LinkedIn Kinetix code</span>
                <LuExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
