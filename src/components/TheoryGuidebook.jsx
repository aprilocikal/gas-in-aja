import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuBookOpen,
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuBookmark,
  LuCode,
  LuLightbulb,
  LuInfo,
  LuCheck,
  LuCopy,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './TheoryGuidebook.css'

const CHAPTER_TABS = [
  { num: 1, label: '1. Fondasi' },
  { num: 2, label: '2. Sintaks' },
  { num: 3, label: '3. Trace' },
  { num: 4, label: '4. Tips' },
]

export default function TheoryGuidebook({ lang, onClose }) {
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState(false)
  const totalPages = 4
  const touchStartRef = useRef(null)
  const bodyRef = useRef(null)

  const goToPage = (targetPage) => {
    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== page) {
      playSoundCue('click')
      setPage(targetPage)
      if (bodyRef.current) bodyRef.current.scrollTop = 0
    }
  }

  const handleNext = () => goToPage(page + 1)
  const handlePrev = () => goToPage(page - 1)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowRight') goToPage(page + 1)
      if (e.key === 'ArrowLeft') goToPage(page - 1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [page])

  const handleTouchStart = (e) => {
    const t = e.touches?.[0]
    if (!t) return
    const insideHorizontalScroll = Boolean(e.target.closest('.paper-code-block, .paper-table-wrap'))
    touchStartRef.current = { x: t.clientX, y: t.clientY, skip: insideHorizontalScroll }
  }

  const handleTouchEnd = (e) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start || start.skip) return
    const t = e.changedTouches?.[0]
    if (!t) return
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0) handleNext()
      else handlePrev()
    }
  }

  const handleCopyCode = async () => {
    const codeText = lang?.helloWorld || '// Hello World'
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      playSoundCue('success')
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Ignore clipboard permission errors
    }
  }

  return (
    <div className="guidebook-backdrop" onClick={onClose}>
      <motion.div
        className="guidebook-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
      >
        {/* Top Header */}
        <div className="book-top-bar">
          <div className="book-meta">
            <span className="book-badge">
              <LuBookmark size={13} /> BUKU PANDUAN MATERI
            </span>
            <h3 className="book-title">{lang?.name || 'Algoritma & Pemrograman'}</h3>
          </div>
          <button className="book-close-btn" onClick={onClose} aria-label="Tutup Buku">
            <LuX size={19} />
          </button>
        </div>

        {/* Clickable Chapter Tabs */}
        <div className="book-chapter-tabs" role="tablist" aria-label="Bab Panduan">
          {CHAPTER_TABS.map((tab) => (
            <button
              key={tab.num}
              role="tab"
              aria-selected={page === tab.num}
              className={`book-chapter-tab ${page === tab.num ? 'active' : ''}`}
              onClick={() => goToPage(tab.num)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Cyber-Glass Body (Swipe left/right supported) */}
        <div
          ref={bodyRef}
          className="book-paper-sheet"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="sheet-content-wrapper">
            <AnimatePresence mode="wait">
              {page === 1 && (
                <motion.div
                  key="page-1"
                  className="paper-page"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 1 • FONDASI &amp; FILOSOFI</span>
                    <h4>Mengapa Konsep Ini Penting?</h4>
                  </div>
                  <div className="paper-body-text">
                    <p className="lead-paragraph">
                      {lang?.description ||
                        'Bahasa dan algoritma dirancang untuk menerjemahkan logika manusia menjadi instruksi presisi bagi mesin.'}
                    </p>
                    <div className="paper-callout">
                      <div className="callout-icon">
                        <LuLightbulb size={18} />
                      </div>
                      <div>
                        <strong>Tujuan Pembelajaran</strong>
                        <p>
                          {lang?.whyLearn ||
                            'Membentuk intuisi komputasional dan pemahaman alokasi sumber daya memori.'}
                        </p>
                      </div>
                    </div>
                    <div className="paper-keypoints">
                      <h5>Karakteristik Utama</h5>
                      <div className="guide-meta-grid">
                        <div className="guide-meta-chip">
                          <small>Paradigma</small>
                          <strong>{lang?.paradigm || 'Imperatif & Terstruktur'}</strong>
                        </div>
                        <div className="guide-meta-chip">
                          <small>Level Abstraksi</small>
                          <strong>{lang?.tierLabel || 'Standar Industri'}</strong>
                        </div>
                        <div className="guide-meta-chip">
                          <small>Tingkat Kesulitan</small>
                          <strong>{lang?.difficulty || 3}/5</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {page === 2 && (
                <motion.div
                  key="page-2"
                  className="paper-page"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 2 • LEMBAR SINTAKS</span>
                    <h4>Sintaks Khas &amp; Pola Penulisan</h4>
                  </div>
                  <div className="paper-body-text">
                    <p>
                      Contoh pola kode paling mendasar pada bahasa <strong>{lang?.name}</strong>:
                    </p>
                    <div className="paper-code-block">
                      <div className="code-block-header">
                        <span className="code-header-title">
                          <LuCode size={14} /> Contoh Sintaks
                        </span>
                        <button
                          type="button"
                          className="btn-copy-guide-code"
                          onClick={handleCopyCode}
                        >
                          {copied ? (
                            <>
                              <LuCheck size={13} /> Tersalin!
                            </>
                          ) : (
                            <>
                              <LuCopy size={13} /> Salin
                            </>
                          )}
                        </button>
                      </div>
                      <pre>
                        <code>{lang?.helloWorld || '// Hello World'}</code>
                      </pre>
                    </div>
                    <div className="paper-callout info-callout">
                      <LuCheck size={18} className="callout-icon" />
                      <span>
                        Pahami deklarasi variabel, blok indentasi/kurung, dan deklarasi fungsi sebelum masuk ke perulangan bersarang.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {page === 3 && (
                <motion.div
                  key="page-3"
                  className="paper-page"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 3 • ANALISIS EKSEKUSI</span>
                    <h4>Langkah Eksekusi (Trace Table)</h4>
                  </div>
                  <div className="paper-body-text">
                    <p>
                      Tahapan perubahan nilai memori saat menjalankan algoritma sorting maupun pencarian:
                    </p>
                    <div className="paper-table-wrap">
                      <table className="paper-table">
                        <thead>
                          <tr>
                            <th>Langkah</th>
                            <th>Aksi Operasi</th>
                            <th>Status Memori</th>
                            <th>Big-O</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Komparasi Pasangan</td>
                            <td>arr[j] vs arr[j+1]</td>
                            <td>O(1)</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td>Pertukaran (Swap)</td>
                            <td>Penampung sementara</td>
                            <td>O(1)</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Iterasi Luar</td>
                            <td>Kunci elemen terbesar</td>
                            <td>O(n)</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td>Penyelesaian Total</td>
                            <td>Seluruh array terurut</td>
                            <td>O(n²)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {page === 4 && (
                <motion.div
                  key="page-4"
                  className="paper-page"
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 4 • BEST PRACTICES</span>
                    <h4>Hindari Kesalahan Klasik</h4>
                  </div>
                  <div className="paper-body-text">
                    <div className="paper-callout warning-callout">
                      <div className="callout-icon">
                        <LuInfo size={18} />
                      </div>
                      <div>
                        <strong>Kesalahan Off-By-One Index</strong>
                        <p>
                          Saat menulis loop bertingkat <code>j &lt; n - i - 1</code>, pastikan batas indeks aman agar tidak memicu IndexOutOfBounds atau Segmentation Fault.
                        </p>
                      </div>
                    </div>
                    <div className="tips-checklist">
                      <h5>Tips Kunci Kinetix Code</h5>
                      <ul>
                        <li>Gunakan Visualizer 60 FPS untuk memeriksa alur komparasi sebelum menulis kode lengkap.</li>
                        <li>Bedakan alokasi Stack (lokal cepat) dengan Heap (dinamis manual).</li>
                        <li>Uji langsung potongan kode di tab Playground untuk memvalidasi output.</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed Compact Bottom Navigation Bar */}
        <div className="book-bottom-bar">
          <button
            className="book-nav-btn"
            onClick={handlePrev}
            disabled={page === 1}
            aria-label="Halaman Sebelumnya"
          >
            <LuChevronLeft size={17} />
            <span className="btn-nav-label">Sebelumnya</span>
          </button>

          <div className="book-page-indicator">
            <span className="page-num">
              <strong>{page}</strong> / {totalPages}
            </span>
            <div className="page-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Buka halaman ${idx + 1}`}
                  className={`dot ${page === idx + 1 ? 'active' : ''}`}
                  onClick={() => goToPage(idx + 1)}
                />
              ))}
            </div>
          </div>

          {page === totalPages ? (
            <button
              className="book-nav-btn book-nav-next"
              onClick={() => {
                playSoundCue('success')
                onClose?.()
              }}
              aria-label="Selesai Membaca"
            >
              <span className="btn-nav-label">Selesai</span>
              <LuCheck size={17} />
            </button>
          ) : (
            <button
              className="book-nav-btn book-nav-next"
              onClick={handleNext}
              aria-label="Halaman Selanjutnya"
            >
              <span className="btn-nav-label">Selanjutnya</span>
              <LuChevronRight size={17} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
