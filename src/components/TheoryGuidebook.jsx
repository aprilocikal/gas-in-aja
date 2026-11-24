import React, { useState } from 'react'
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
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './TheoryGuidebook.css'

export default function TheoryGuidebook({ lang, onClose }) {
  const [page, setPage] = useState(1)
  const totalPages = 4

  const handleNext = () => {
    if (page < totalPages) {
      playSoundCue('click')
      setPage((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (page > 1) {
      playSoundCue('click')
      setPage((prev) => prev - 1)
    }
  }

  return (
    <div className="guidebook-backdrop" onClick={onClose}>
      <motion.div
        className="guidebook-container"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Book Header Ribbon */}
        <div className="book-top-bar">
          <div className="book-meta">
            <span className="book-badge">
              <LuBookmark size={14} /> BUKU PANDUAN MATERI
            </span>
            <h3 className="book-title">{lang?.name || 'Algoritma & Pemrograman'}</h3>
          </div>
          <button className="book-close-btn" onClick={onClose} aria-label="Tutup Buku">
            <LuX size={20} />
          </button>
        </div>

        {/* Paper Sheet Texture Area */}
        <div className="book-paper-sheet">
          <div className="sheet-binder-holes">
            <span className="hole" />
            <span className="hole" />
            <span className="hole" />
          </div>

          <div className="sheet-content-wrapper">
            <AnimatePresence mode="wait">
              {/* PAGE 1: KONSEP & FILOSOFI */}
              {page === 1 && (
                <motion.div
                  key="page-1"
                  className="paper-page"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 1: FONDASI & FILOSOFI</span>
                    <h4>Mengapa Konsep Ini Sangat Penting?</h4>
                  </div>
                  <div className="paper-body-text">
                    <p className="lead-paragraph">
                      {lang?.description ||
                        'Bahasa dan algoritma dirancang untuk menerjemahkan logika manusia menjadi instruksi instruksi presisi bagi mesin.'}
                    </p>
                    <div className="paper-callout">
                      <div className="callout-icon">
                        <LuLightbulb size={20} />
                      </div>
                      <div>
                        <strong>Tujuan Pembelajaran:</strong>
                        <p>{lang?.whyLearn || 'Membentuk intuisi komputasional dan pemahaman alokasi sumber daya memori.'}</p>
                      </div>
                    </div>
                    <div className="paper-keypoints">
                      <h5>Tiga Karakteristik Utama:</h5>
                      <ul>
                        <li><strong>Paradigma:</strong> {lang?.paradigm || 'Imperatif & Terstruktur'}</li>
                        <li><strong>Level Abstraksi:</strong> {lang?.tierLabel || 'Standar Industri'}</li>
                        <li><strong>Tingkat Kesulitan:</strong> {lang?.difficulty || 3}/5</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 2: ATURAN SINTAKS & CHEAT SHEET */}
              {page === 2 && (
                <motion.div
                  key="page-2"
                  className="paper-page"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 2: LEMBAR SINTAKS (CHEAT SHEET)</span>
                    <h4>Sintaks Khas & Pola Penulisan</h4>
                  </div>
                  <div className="paper-body-text">
                    <p>
                      Berikut adalah pola kode paling mendasar yang menjadi ciri khas eksekusi bahasa {lang?.name}:
                    </p>
                    <div className="paper-code-block">
                      <div className="code-block-header">
                        <LuCode size={14} /> Contoh Sintaks Standar
                      </div>
                      <pre>
                        <code>{lang?.helloWorld || '// Hello World'}</code>
                      </pre>
                    </div>
                    <div className="paper-callout info-callout">
                      <LuCheck size={18} />
                      <span>
                        Pahami penataan variabel, pembuka blok kurung/indentasi, dan cara mendeklarasikan fungsi sebelum beralih ke struktur loop kompleks.
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAGE 3: BEDAH ALGORITMA & LANGKAH VISUAL */}
              {page === 3 && (
                <motion.div
                  key="page-3"
                  className="paper-page"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 3: ANALISIS EKSEKUSI ALGORITMA</span>
                    <h4>Langkah Demi Langkah (Trace Table)</h4>
                  </div>
                  <div className="paper-body-text">
                    <p>
                      Saat algoritma Bubble Sort atau pencarian dijalankan, memori komputer mengalami serangkaian mutasi nilai berikut:
                    </p>
                    <div className="paper-table-wrap">
                      <table className="paper-table">
                        <thead>
                          <tr>
                            <th>Langkah</th>
                            <th>Aksi Operasi</th>
                            <th>Status Memori</th>
                            <th>Kompleksitas</th>
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
                            <td>Variabel penampung sementara</td>
                            <td>O(1)</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td>Iterasi Luar</td>
                            <td>Kunci elemen terbesar ke ujung</td>
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

              {/* PAGE 4: TIPS & JEBAKAN PEMULA */}
              {page === 4 && (
                <motion.div
                  key="page-4"
                  className="paper-page"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="page-header">
                    <span className="page-category">BAB 4: BEST PRACTICES & JEBAKAN UMUM</span>
                    <h4>Hindari Kesalahan Klasik</h4>
                  </div>
                  <div className="paper-body-text">
                    <div className="paper-callout warning-callout">
                      <div className="callout-icon">
                        <LuInfo size={20} />
                      </div>
                      <div>
                        <strong>Kesalahan Off-By-One Index:</strong>
                        <p>
                          Saat melakukan perulangan bertingkat <code>j &lt; n - i - 1</code>, perhatikan batas indeks agar tidak mengakses elemen di luar alokasi memori (IndexOutOfBounds / Segmentation Fault).
                        </p>
                      </div>
                    </div>
                    <div className="tips-checklist">
                      <h5>Tips Kunci Kinetix:</h5>
                      <ul>
                        <li>Gunakan visualizer 60 FPS untuk memvalidasi intuisi langkah sebelum menulis kode utuh.</li>
                        <li>Perhatikan perbedaan penyimpanan memori Stack (lokal cepat) dan Heap (dinamis manual).</li>
                        <li>Pertahankan streak belajarmu minimal 1 unit tantangan per hari untuk retensi memori otak maksimal!</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Paper Sheet Bottom Navigation (Previous & Next like a real book) */}
        <div className="book-bottom-bar">
          <button
            className="book-nav-btn"
            onClick={handlePrev}
            disabled={page === 1}
          >
            <LuChevronLeft size={18} /> Halaman Sebelumnya
          </button>

          <div className="book-page-indicator">
            <span className="page-num">Halaman <strong>{page}</strong> dari {totalPages}</span>
            <div className="page-dots">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${page === idx + 1 ? 'active' : ''}`}
                  onClick={() => setPage(idx + 1)}
                />
              ))}
            </div>
          </div>

          <button
            className="book-nav-btn book-nav-next"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Halaman Selanjutnya <LuChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
