import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Star, Terminal, Zap, Cpu, Sparkles } from 'lucide-react'
import {
  LuSearch,
  LuTerminal,
  LuCpu,
  LuBinary,
  LuLayers,
  LuSparkles,
  LuFlame,
  LuCode,
  LuPlay,
} from 'react-icons/lu'
import { programmingLanguages, languageCategories } from '../data/programmingLanguages'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './Materi.css'

function Materi() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedLang, setExpandedLang] = useState(null)

  const filtered = programmingLanguages.filter((lang) => {
    const matchSearch =
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.description.toLowerCase().includes(search.toLowerCase()) ||
      lang.paradigm.toLowerCase().includes(search.toLowerCase()) ||
      lang.tierLabel.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'all' || lang.tier === activeCategory
    return matchSearch && matchCat
  })

  const handleSelectLanguage = (langId) => {
    playSoundCue('click')
    localStorage.setItem('kinetix_selected_lang', langId)
    navigate(`/simulasi?lang=${langId}`)
  }

  return (
    <div className="materi-page">
      <section className="materi-hero">
        <div className="container">
          <motion.div
            className="hero-badge-center"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="tag-pill">Koleksi Bahasa Pemrograman Lengkap</span>
          </motion.div>

          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Pilih Bahasa: <br />
            <span className="gradient-text">Dari Low-Level Hingga Tersulit</span>
          </motion.h1>

          <motion.div
            className="search-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Cari bahasa, paradigma, atau kata kunci (misal: Python, Assembly, pointer, Brainfuck)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Category Filter Pills */}
          <div className="kategori-filter">
            {languageCategories.map((cat) => (
              <motion.button
                key={cat.id}
                className={`kategori-btn ${activeCategory === cat.id ? 'kategori-active' : ''}`}
                onClick={() => {
                  setActiveCategory(cat.id)
                  playSoundCue('click')
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Languages Grid */}
          <div className="lang-cards-grid">
            {filtered.map((lang, idx) => (
              <motion.div
                key={lang.id}
                className="lang-card glass-card"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                whileHover={{ y: -6 }}
              >
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
                </div>

                <div className="lang-title-row">
                  <h3>{lang.name}</h3>
                  <small className="lang-paradigm">{lang.paradigm}</small>
                </div>

                {/* Topics Tag */}
                <div className="lang-topics">
                  {lang.visualTopics.slice(0, 3).map((top, tIdx) => (
                    <span key={tIdx} className="topic-pill">
                      {top}
                    </span>
                  ))}
                </div>

                {/* Action CTA */}
                <div className="lang-card-footer">
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => handleSelectLanguage(lang.id)}
                  >
                    <LuPlay size={16} /> Pelajari & Uji Visualizer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon-wrap">
                <LuSearch size={42} className="icon-cyan" />
              </div>
              <h3>Bahasa pemrograman tidak ditemukan</h3>
              <p>Coba gunakan kata kunci pencarian yang lain atau pilih kategori Semua Bahasa.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Materi
