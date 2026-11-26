import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Star } from 'lucide-react'
import {
  LuSearch,
  LuPlay,
  LuRotateCw,
  LuCheck,
  LuShuffle,
  LuChevronLeft,
  LuChevronRight,
  LuCopy,
  LuLayers,
  LuLayoutGrid,
} from 'react-icons/lu'
import { programmingLanguages, languageCategories } from '../data/programmingLanguages'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './Materi.css'

const MASTERED_STORAGE_KEY = 'kinetix_materi_flashcards_mastered'

const loadMasteredIds = () => {
  try {
    const raw = localStorage.getItem(MASTERED_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function Materi() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'deck'
  const [flippedMap, setFlippedMap] = useState({})
  const [deckOrder, setDeckOrder] = useState(() => programmingLanguages.map((l) => l.id))
  const [deckIndex, setDeckIndex] = useState(0)
  const [deckFlipped, setDeckFlipped] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [masteredIds, setMasteredIds] = useState(loadMasteredIds)

  useEffect(() => {
    try {
      localStorage.setItem(MASTERED_STORAGE_KEY, JSON.stringify(masteredIds))
    } catch {
      // Ignore storage quota errors
    }
  }, [masteredIds])

  const filtered = useMemo(
    () =>
      programmingLanguages.filter((lang) => {
        const q = search.toLowerCase()
        const matchSearch =
          lang.name.toLowerCase().includes(q) ||
          lang.description.toLowerCase().includes(q) ||
          lang.paradigm.toLowerCase().includes(q) ||
          lang.tierLabel.toLowerCase().includes(q)
        const matchCat = activeCategory === 'all' || lang.tier === activeCategory
        return matchSearch && matchCat
      }),
    [search, activeCategory]
  )

  const deckCards = useMemo(() => {
    const filteredMap = new Map(filtered.map((l) => [l.id, l]))
    const ordered = deckOrder.map((id) => filteredMap.get(id)).filter(Boolean)
    return ordered.length > 0 ? ordered : filtered
  }, [filtered, deckOrder])

  const safeDeckIdx = deckCards.length > 0 ? Math.min(deckIndex, deckCards.length - 1) : 0
  const currentDeckCard = deckCards[safeDeckIdx] || null

  const handleSelectLanguage = (e, langId) => {
    e?.stopPropagation?.()
    playSoundCue('click')
    localStorage.setItem('kinetix_selected_lang', langId)
    navigate(`/simulasi?lang=${langId}`)
  }

  const toggleGridFlip = (langId) => {
    playSoundCue('page')
    setFlippedMap((prev) => ({
      ...prev,
      [langId]: !prev[langId],
    }))
  }

  const toggleAllFlipped = () => {
    playSoundCue('page')
    const allFlipped = filtered.length > 0 && filtered.every((l) => flippedMap[l.id])
    if (allFlipped) {
      setFlippedMap({})
    } else {
      const next = {}
      filtered.forEach((l) => {
        next[l.id] = true
      })
      setFlippedMap(next)
    }
  }

  const toggleMastered = (e, langId) => {
    e?.stopPropagation?.()
    setMasteredIds((prev) => {
      const exists = prev.includes(langId)
      playSoundCue(exists ? 'click' : 'success')
      return exists ? prev.filter((id) => id !== langId) : [...prev, langId]
    })
  }

  const handleCopyCode = (e, lang) => {
    e.stopPropagation()
    playSoundCue('click')
    navigator.clipboard?.writeText(lang.helloWorld).catch(() => {})
    setCopiedId(lang.id)
    setTimeout(() => {
      setCopiedId((cur) => (cur === lang.id ? null : cur))
    }, 1500)
  }

  const handleShuffleDeck = () => {
    playSoundCue('click')
    setDeckOrder((prev) => {
      const next = [...prev]
      for (let i = next.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
      return next
    })
    setDeckIndex(0)
    setDeckFlipped(false)
  }

  const stepDeck = useCallback(
    (delta) => {
      if (deckCards.length === 0) return
      playSoundCue('click')
      setDeckFlipped(false)
      setDeckIndex((prev) => {
        const base = Math.min(prev, deckCards.length - 1)
        return (base + delta + deckCards.length) % deckCards.length
      })
    },
    [deckCards.length]
  )

  useEffect(() => {
    if (viewMode !== 'deck' || deckCards.length === 0) return undefined
    const onKeyDown = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault()
        playSoundCue('page')
        setDeckFlipped((f) => !f)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        stepDeck(1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        stepDeck(-1)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [viewMode, deckCards.length, stepDeck])

  const anyOrAllFlipped = filtered.length > 0 && filtered.every((l) => flippedMap[l.id])

  return (
    <div className="materi-page">
      <section className="materi-hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            Katalog &amp; Flashcard Bahasa: <br />
            <span className="gradient-text">Dari Low Level Hingga Tersulit</span>
          </motion.h1>

          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Cari bahasa, paradigma, atau kata kunci (misal: Python, Assembly, pointer, Brainfuck)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setDeckIndex(0)
                setDeckFlipped(false)
              }}
            />
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter Pills */}
          <div className="kategori-filter">
            {languageCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`kategori-btn ${activeCategory === cat.id ? 'kategori-active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setDeckIndex(0)
                  setDeckFlipped(false)
                  playSoundCue('click')
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Flashcard Controls Toolbar */}
          <div className="flashcard-toolbar">
            <div className="fc-mode-switch" role="tablist" aria-label="Tampilan Katalog Flashcard">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'grid'}
                className={`fc-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('grid')
                  playSoundCue('click')
                }}
              >
                <LuLayoutGrid size={14} /> Grid Flip
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'deck'}
                className={`fc-mode-btn ${viewMode === 'deck' ? 'active' : ''}`}
                onClick={() => {
                  setViewMode('deck')
                  setDeckFlipped(false)
                  playSoundCue('click')
                }}
              >
                <LuLayers size={14} /> Mode Flashcard Deck
              </button>
            </div>

            <div className="fc-toolbar-right">
              <span className="fc-mastery-chip">
                <LuCheck size={13} /> {masteredIds.length}/{programmingLanguages.length} Dikuasai
              </span>

              {viewMode === 'grid' && filtered.length > 0 && (
                <button type="button" className="fc-util-btn" onClick={toggleAllFlipped}>
                  <LuRotateCw size={13} /> {anyOrAllFlipped ? 'Reset Depan' : 'Balik Semua'}
                </button>
              )}

              {viewMode === 'deck' && deckCards.length > 1 && (
                <button type="button" className="fc-util-btn" onClick={handleShuffleDeck}>
                  <LuShuffle size={13} /> Acak Deck
                </button>
              )}
            </div>
          </div>

          {/* MODE A: 3D FLIP FLASHCARD GRID */}
          {viewMode === 'grid' && filtered.length > 0 && (
            <div className="lang-cards-grid">
              {filtered.map((lang) => {
                const isFlipped = Boolean(flippedMap[lang.id])
                const isMastered = masteredIds.includes(lang.id)

                return (
                  <div
                    key={lang.id}
                    className={`materi-flip-scene ${isFlipped ? 'is-flipped' : ''}`}
                    onClick={() => toggleGridFlip(lang.id)}
                  >
                    <div className="materi-flip-inner">
                      {/* FRONT FACE */}
                      <div className={`materi-face materi-face-front ${isMastered ? 'is-mastered' : ''}`}>
                        <div className="lang-card-header">
                          <div className="lang-badge-row">
                            <span
                              className="lang-tier-badge"
                              style={{
                                borderColor: lang.color,
                                color: lang.color,
                                background: `${lang.color}18`,
                              }}
                            >
                              {lang.tierLabel}
                            </span>
                            <span className="lang-special-tag">{lang.badge}</span>
                          </div>

                          <div className="fc-header-right-tools">
                            {isMastered && (
                              <span className="fc-mastered-pill" title="Sudah Dikuasai">
                                <LuCheck size={12} strokeWidth={3} /> Paham
                              </span>
                            )}
                            <button
                              type="button"
                              className="fc-flip-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleGridFlip(lang.id)
                              }}
                              title="Balik flashcard"
                            >
                              <LuRotateCw size={13} /> Balik
                            </button>
                          </div>
                        </div>

                        <div className="lang-difficulty">
                          <span className="diff-label">Tingkat Kesulitan:</span>
                          <div className="diff-stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={13}
                                fill={i < lang.difficulty ? lang.color : 'none'}
                                stroke={i < lang.difficulty ? lang.color : '#475569'}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="lang-title-row">
                          <h3>{lang.name}</h3>
                          <small className="lang-paradigm">{lang.paradigm}</small>
                        </div>

                        <div className="lang-topics">
                          {lang.visualTopics.slice(0, 3).map((top, tIdx) => (
                            <span key={tIdx} className="topic-pill">
                              {top}
                            </span>
                          ))}
                        </div>

                        <div className="fc-flip-prompt">
                          <LuRotateCw size={12} /> Ketuk kartu untuk balik &amp; lihat contoh kode
                        </div>

                        <div className="lang-card-footer">
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center' }}
                            onClick={(e) => handleSelectLanguage(e, lang.id)}
                          >
                            <LuPlay size={16} /> Pelajari &amp; Uji Visualizer
                          </button>
                        </div>
                      </div>

                      {/* BACK FACE */}
                      <div className="materi-face materi-face-back">
                        <div className="fc-back-top">
                          <span className="fc-back-label" style={{ color: lang.color }}>
                            Flashcard &bull; {lang.name}
                          </span>
                          <button
                            type="button"
                            className="fc-flip-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleGridFlip(lang.id)
                            }}
                          >
                            <LuRotateCw size={13} /> Depan
                          </button>
                        </div>

                        <p className="fc-back-desc">{lang.description}</p>
                        <p className="fc-back-why">
                          <strong>Kenapa dipelajari:</strong> {lang.whyLearn}
                        </p>

                        <div className="fc-back-code-box" onClick={(e) => e.stopPropagation()}>
                          <div className="fc-back-code-head">
                            <span>Sintaks Dasar</span>
                            <button
                              type="button"
                              className="fc-copy-btn"
                              onClick={(e) => handleCopyCode(e, lang)}
                            >
                              {copiedId === lang.id ? (
                                <>
                                  <LuCheck size={12} /> Tersalin
                                </>
                              ) : (
                                <>
                                  <LuCopy size={12} /> Salin
                                </>
                              )}
                            </button>
                          </div>
                          <pre>
                            <code>{lang.helloWorld}</code>
                          </pre>
                        </div>

                        <div className="fc-back-actions">
                          <button
                            type="button"
                            className={`fc-master-btn ${isMastered ? 'active' : ''}`}
                            onClick={(e) => toggleMastered(e, lang.id)}
                          >
                            <LuCheck size={14} /> {isMastered ? 'Sudah Paham' : 'Tandai Paham'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary fc-go-btn"
                            onClick={(e) => handleSelectLanguage(e, lang.id)}
                          >
                            <LuPlay size={14} /> Visualizer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* MODE B: FOCUSED STUDY FLASHCARD DECK */}
          {viewMode === 'deck' && currentDeckCard && (
            <div className="fc-deck-stage">
              <div className="fc-deck-progress-row">
                <span>
                  Kartu <strong>{safeDeckIdx + 1}</strong> / {deckCards.length}
                </span>
                <div className="fc-deck-progress-track">
                  <div
                    className="fc-deck-progress-fill"
                    style={{ width: `${Math.round(((safeDeckIdx + 1) / deckCards.length) * 100)}%` }}
                  />
                </div>
                <span className="fc-kb-hint">Spasi: balik &bull; Panah: geser</span>
              </div>

              <div
                className={`materi-flip-scene deck-card-scene ${deckFlipped ? 'is-flipped' : ''}`}
                onClick={() => {
                  playSoundCue('page')
                  setDeckFlipped((f) => !f)
                }}
              >
                <div className="materi-flip-inner">
                  {/* DECK FRONT */}
                  <div
                    className={`materi-face materi-face-front ${
                      masteredIds.includes(currentDeckCard.id) ? 'is-mastered' : ''
                    }`}
                  >
                    <div className="lang-card-header">
                      <div className="lang-badge-row">
                        <span
                          className="lang-tier-badge"
                          style={{
                            borderColor: currentDeckCard.color,
                            color: currentDeckCard.color,
                            background: `${currentDeckCard.color}18`,
                          }}
                        >
                          {currentDeckCard.tierLabel}
                        </span>
                        <span className="lang-special-tag">{currentDeckCard.badge}</span>
                      </div>
                      <button
                        type="button"
                        className="fc-flip-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          playSoundCue('page')
                          setDeckFlipped(true)
                        }}
                      >
                        <LuRotateCw size={13} /> Balik Kartu
                      </button>
                    </div>

                    <div className="deck-front-center">
                      <h3>{currentDeckCard.name}</h3>
                      <p className="lang-paradigm">{currentDeckCard.paradigm}</p>
                      <div className="diff-stars deck-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={15}
                            fill={i < currentDeckCard.difficulty ? currentDeckCard.color : 'none'}
                            stroke={i < currentDeckCard.difficulty ? currentDeckCard.color : '#475569'}
                          />
                        ))}
                      </div>
                      <div className="lang-topics deck-topics">
                        {currentDeckCard.visualTopics.map((top, tIdx) => (
                          <span key={tIdx} className="topic-pill">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="fc-flip-prompt">
                      <LuRotateCw size={13} /> Klik kartu atau tekan Spasi untuk melihat jawaban &amp; kode
                    </div>
                  </div>

                  {/* DECK BACK */}
                  <div className="materi-face materi-face-back">
                    <div className="fc-back-top">
                      <span className="fc-back-label" style={{ color: currentDeckCard.color }}>
                        Penjelasan &amp; Contoh Kode &bull; {currentDeckCard.name}
                      </span>
                      <button
                        type="button"
                        className="fc-flip-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          playSoundCue('page')
                          setDeckFlipped(false)
                        }}
                      >
                        <LuRotateCw size={13} /> Sisi Depan
                      </button>
                    </div>

                    <p className="fc-back-desc">{currentDeckCard.description}</p>
                    <p className="fc-back-why">
                      <strong>Kenapa dipelajari:</strong> {currentDeckCard.whyLearn}
                    </p>

                    <div className="fc-back-code-box deck-code-box" onClick={(e) => e.stopPropagation()}>
                      <div className="fc-back-code-head">
                        <span>Sintaks Dasar ({currentDeckCard.sampleAlgorithm})</span>
                        <button
                          type="button"
                          className="fc-copy-btn"
                          onClick={(e) => handleCopyCode(e, currentDeckCard)}
                        >
                          {copiedId === currentDeckCard.id ? (
                            <>
                              <LuCheck size={12} /> Tersalin
                            </>
                          ) : (
                            <>
                              <LuCopy size={12} /> Salin
                            </>
                          )}
                        </button>
                      </div>
                      <pre>
                        <code>{currentDeckCard.helloWorld}</code>
                      </pre>
                    </div>

                    <div className="fc-back-actions">
                      <button
                        type="button"
                        className="btn btn-primary fc-go-btn"
                        style={{ flex: 1 }}
                        onClick={(e) => handleSelectLanguage(e, currentDeckCard.id)}
                      >
                        <LuPlay size={15} /> Pelajari &amp; Uji di Visualizer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="fc-deck-controls">
                <button
                  type="button"
                  className="fc-nav-btn"
                  onClick={() => stepDeck(-1)}
                  disabled={deckCards.length <= 1}
                >
                  <LuChevronLeft size={17} /> Sebelumnya
                </button>

                <button
                  type="button"
                  className={`fc-master-btn ${
                    masteredIds.includes(currentDeckCard.id) ? 'active' : ''
                  }`}
                  onClick={(e) => toggleMastered(e, currentDeckCard.id)}
                >
                  <LuCheck size={15} />
                  {masteredIds.includes(currentDeckCard.id) ? 'Sudah Dikuasai' : 'Tandai Paham'}
                </button>

                <button
                  type="button"
                  className="fc-nav-btn"
                  onClick={() => stepDeck(1)}
                  disabled={deckCards.length <= 1}
                >
                  Berikutnya <LuChevronRight size={17} />
                </button>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <LuSearch size={42} className="icon-indigo" />
              </div>
              <h3>Bahasa pemrograman tidak ditemukan</h3>
              <p>Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua Bahasa.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Materi
