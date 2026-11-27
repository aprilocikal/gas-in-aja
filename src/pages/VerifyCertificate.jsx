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
  LuCheckCheck,
  LuArrowLeft,
  LuBuilding,
  LuBadgeCheck,
} from 'react-icons/lu'
import { FaLinkedin } from 'react-icons/fa'
import QRCode from 'qrcode'
import {
  LINKEDIN_COMPANY_ID,
  LINKEDIN_COMPANY_URL,
  downloadCertificatePng,
  getLinkedInCertUrl,
  getCertificateVerifyUrl,
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

  const verifyTargetUrl = getCertificateVerifyUrl({
    credentialId,
    userName,
    langName,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    QRCode.toDataURL(verifyTargetUrl, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {})
  }, [verifyTargetUrl])

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
            <span>Kembali ke Lab Belajar</span>
          </Link>
          <div className="verify-header-pill">
            <LuShieldCheck size={15} />
            <span>Sistem Autentikasi Kredensial Resmi</span>
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
              <LuShieldCheck size={28} />
            </div>
            <div className="verify-status-text">
              <div className="verify-status-tag">
                <LuBadgeCheck size={13} />
                <span>Terverifikasi Resmi &amp; Sah</span>
              </div>
              <h1 className="verify-title">Sertifikat Kompetensi: {langName}</h1>
              <p className="verify-subtitle">
                Kredensial digital ini terdaftar secara sah dalam sistem kurikulum publik{' '}
                <strong>Kinetix code</strong>.
              </p>
            </div>
          </div>

          {/* Credential Data Grid */}
          <div className="verify-grid">
            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuUser size={13} /> Penerima Sertifikat
              </span>
              <strong className="verify-field-value text-highlight">{userName}</strong>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuAward size={13} /> Jalur Spesialisasi
              </span>
              <strong className="verify-field-value">Pemrograman {langName}</strong>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuFileCheck size={13} /> Nomor ID Kredensial
              </span>
              <div className="verify-id-row">
                <code className="verify-id-code">{credentialId}</code>
                <button
                  type="button"
                  className="btn-verify-copy"
                  onClick={() => handleCopy(credentialId)}
                  title="Salin ID Kredensial"
                >
                  {copied ? <LuCheck size={12} /> : <LuCopy size={12} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuBuilding size={13} /> Organisasi Penerbit
              </span>
              <div className="verify-org-row">
                <span className="verify-org-name">Kinetix code</span>
                <a
                  href={LINKEDIN_COMPANY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verify-linkedin-org-badge"
                  title="Lihat profil perusahaan resmi Kinetix code di LinkedIn"
                >
                  <FaLinkedin size={13} />
                  <span>LinkedIn</span>
                  <LuExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="verify-field-box">
              <span className="verify-field-label">
                <LuCalendar size={13} /> Tanggal Terbit
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
                <LuCheckCheck size={13} /> Standar Evaluasi
              </span>
              <span className="verify-field-value text-green">
                Passing Grade ≥ 55% (Lulus)
              </span>
            </div>
          </div>

          {/* Barcode / QR Code & Action Buttons */}
          <div className="verify-actions-card">
            <div className="verify-qr-col">
              <div className="verify-qr-box">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Barcode Verifikasi Resmi" className="verify-qr-img" />
                ) : (
                  <LuQrCode size={80} className="verify-qr-placeholder" />
                )}
              </div>
              <div className="verify-qr-desc">
                <strong className="verify-qr-title">
                  <LuQrCode size={14} /> Barcode Verifikasi
                </strong>
                <p>Pindai barcode ini melalui kamera ponsel untuk memvalidasi keaslian sertifikat secara publik.</p>
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
                <LuDownload size={15} />
                <span>Unduh Sertifikat (PNG)</span>
              </button>

              <a
                href={linkedInCertUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-linkedin"
              >
                <FaLinkedin size={15} />
                <span>Tambah ke Profil LinkedIn</span>
                <LuExternalLink size={12} />
              </a>

              <a
                href={LINKEDIN_COMPANY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-org"
              >
                <FaLinkedin size={14} />
                <span>Profil Kinetix Code di LinkedIn</span>
                <LuExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
