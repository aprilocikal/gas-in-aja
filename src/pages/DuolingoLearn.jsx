import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuHouse,
  LuHeadphones,
  LuTerminal,
  LuShield,
  LuScroll,
  LuStore,
  LuUser,
  LuEllipsis,
  LuFlame,
  LuSparkles,
  LuHeart,
  LuBookOpen,
  LuStar,
  LuCheck,
  LuX,
  LuCode,
  LuLayers,
  LuArrowRight,
  LuArrowLeft,
  LuSearch,
  LuTrophy,
  LuInfo,
  LuGem,
  LuZap,
  LuVolume2,
  LuLock,
  LuChevronDown,
  LuChevronUp,
  LuPlay,
  LuLogOut,
  LuRefreshCw,
} from 'react-icons/lu'
import { programmingLanguages } from '../data/programmingLanguages'
import { getCurriculumForLang, computeUnitUnlockStatus } from '../data/multiLevelCurriculum'
import CharacterAvatar from '../components/CharacterAvatar'
import AlgorithmVisualizer from '../components/AlgorithmVisualizer'
import KinetixLogo from '../components/KinetixLogo'
import TheoryGuidebook from '../components/TheoryGuidebook'
import InteractiveLessonPack from '../components/InteractiveLessonPack'
import { playSoundCue } from '../components/AccessibilityToolbar'
import { useAuth } from '../contexts/AuthContext'
import {
  getStreakData,
  recordDailyActivity,
  getWeekStreakStatus,
  getTodayDateString,
  getDayDifference,
} from '../utils/streakManager'
import './DuolingoLearn.css'

function DuolingoLearn() {
  const navigate = useNavigate()
  const { user, userData, isGuest, logout, updateUserData } = useAuth()

  const [selectedLangId, setSelectedLangId] = useState(userData?.selectedLang || 'python')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [showTheoryGuide, setShowTheoryGuide] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [activeNav, setActiveNav] = useState('belajar')
  const [activeUnitId, setActiveUnitId] = useState(1) // which unit is expanded
  const [activeQuizNode, setActiveQuizNode] = useState(null)
  const [activeModuleData, setActiveModuleData] = useState(null)
  const [avatarVariant, setAvatarVariant] = useState(() => {
    const saved = localStorage.getItem('kinetix_avatar_variant')
    return saved ? parseInt(saved, 10) : Math.floor(Math.random() * 6)
  })

  // Playground state
  const [playgroundCode, setPlaygroundCode] = useState('# Tulis kode kamu di sini\nprint("Hello, Kinetix!")')
  const [playgroundOutput, setPlaygroundOutput] = useState('')
  const [playgroundRunning, setPlaygroundRunning] = useState(false)

  // Real Gamification Stats (synced with Firebase when user logged in - starts at 0 for new accounts)
  const [streakData, setStreakData] = useState(() => getStreakData())
  const [gems, setGems] = useState(userData?.gems ?? 0)
  const [hearts, setHearts] = useState(userData?.hearts ?? 5)
  const [xp, setXp] = useState(userData?.xp ?? 0)
  const currentStreak = user ? (userData?.streak ?? streakData.streak) : streakData.streak

  useEffect(() => {
    if (userData) {
      setGems(userData.gems ?? 0)
      setHearts(userData.hearts ?? 5)
      setXp(userData.xp ?? 0)
      if (userData.selectedLang) setSelectedLangId(userData.selectedLang)
    }
  }, [userData])

  useEffect(() => {
    const handleStreakChange = (e) => {
      if (e.detail) setStreakData(e.detail)
    }
    window.addEventListener('streak-updated', handleStreakChange)
    return () => window.removeEventListener('streak-updated', handleStreakChange)
  }, [])

  const currentLang = programmingLanguages.find((l) => l.id === selectedLangId) || programmingLanguages[4]

  // Compute multi-level unit status based on current XP
  const unitsWithStatus = computeUnitUnlockStatus(selectedLangId, xp)

  const handleSwitchLang = (langId) => {
    setSelectedLangId(langId)
    setActiveUnitId(1)
    setShowLangPicker(false)
    playSoundCue('success')
    if (user) updateUserData({ selectedLang: langId })
  }

  const handleOpenModule = (unit, module) => {
    if (!unit.isUnlocked) return
    playSoundCue('click')
    setActiveModuleData({ unit, module })
    if (module.type === 'simulator') {
      setActiveNav('visualizer')
      setActiveModuleData(null)
    } else {
      setActiveQuizNode(`${unit.id}-${module.id}`)
    }
  }

  const handleCompleteModule = async (moduleXP) => {
    const newXP = xp + (moduleXP || 30)
    const newGems = gems + 10
    setXp(newXP)
    setGems(newGems)
    const updated = recordDailyActivity()
    setStreakData(updated)
    playSoundCue('success')
    if (user) {
      const today = getTodayDateString()
      const lastDate = userData?.lastActiveDate || null
      let nextStreak = userData?.streak ?? 0
      if (lastDate !== today) {
        const diff = getDayDifference(lastDate, today)
        nextStreak = diff === 1 ? nextStreak + 1 : 1
      }
      await updateUserData({
        xp: newXP,
        gems: newGems,
        streak: nextStreak,
        lastActiveDate: today,
      })
    }
    // Unlock check: auto-advance to next unit if threshold met
    const newUnits = computeUnitUnlockStatus(selectedLangId, newXP)
    const nextUnlocked = newUnits.find((u) => u.id === activeUnitId + 1 && u.isUnlocked)
    if (nextUnlocked) {
      setTimeout(() => setActiveUnitId(activeUnitId + 1), 800)
    }
  }

  const handleRandomizeAvatar = () => {
    const next = (avatarVariant + 1 + Math.floor(Math.random() * 4)) % 6
    setAvatarVariant(next)
    localStorage.setItem('kinetix_avatar_variant', String(next))
    playSoundCue('click')
  }

  const handleLogout = async () => {
    playSoundCue('click')
    await logout()
    navigate('/auth', { replace: true })
  }

  const goNav = (nav) => {
    setActiveNav(nav)
    playSoundCue('click')
    // Scroll ke atas saat pindah tab (mobile memakai scroll dokumen, desktop memakai main)
    window.scrollTo({ top: 0, behavior: 'auto' })
    const main = document.querySelector('.duo-main-content')
    if (main) main.scrollTop = 0
  }

  const renderAccountCard = (extraClass = '') => (
    <div className={`right-card user-profile-card ${extraClass}`}>
      <div className="card-top-row">
        <h4>{isGuest ? 'Mode Tamu' : 'Akun'}</h4>
        <button
          className="btn-avatar-shuffle"
          onClick={handleRandomizeAvatar}
          title="Ganti Avatar Random"
        >
          <LuRefreshCw size={13} />
          <span>Ganti Avatar</span>
        </button>
      </div>
      <div className="user-profile-row">
        <div className="user-avatar-circle" onClick={handleRandomizeAvatar} title="Klik untuk ganti avatar">
          <RandomCyberAvatar variant={avatarVariant} />
        </div>
        <div className="user-profile-info">
          <strong>{user?.displayName || (isGuest ? 'Mode Tamu' : 'Koder')}</strong>
          <small>{isGuest ? 'Progres disimpan lokal' : user?.email}</small>
        </div>
      </div>
      {isGuest ? (
        <>
          <button className="btn-logout-account btn-login-switch" onClick={() => navigate('/auth')}>
            <LuUser size={15} />
            <span>Daftar / Masuk Akun</span>
          </button>
          <button className="btn-logout-account" onClick={handleLogout}>
            <LuLogOut size={15} />
            <span>Keluar Mode Tamu</span>
          </button>
        </>
      ) : (
        <button className="btn-logout-account" onClick={handleLogout}>
          <LuLogOut size={15} />
          <span>Keluar (Log Out)</span>
        </button>
      )}
    </div>
  )

  const handleRunPlayground = () => {
    setPlaygroundRunning(true)
    setPlaygroundOutput('')
    // Simulate execution (real execution needs backend)
    setTimeout(() => {
      const lines = playgroundCode.split('\n')
      const outputs = []
      lines.forEach((line) => {
        if (line.trim().startsWith('print(')) {
          const inner = line.match(/print\(["']?(.+?)["']?\)/)?.[1] || ''
          outputs.push(inner)
        } else if (line.trim().startsWith('console.log(')) {
          const inner = line.match(/console\.log\(["']?(.+?)["']?\)/)?.[1] || ''
          outputs.push(inner)
        }
      })
      setPlaygroundOutput(
        outputs.length > 0
          ? outputs.join('\n')
          : '// Eksekusi selesai. (Output print/console.log akan muncul di sini)'
      )
      setPlaygroundRunning(false)
    }, 1200)
  }

  const weekStatus = getWeekStreakStatus()
  const totalUnitXP = (unitId) => {
    const curriculum = getCurriculumForLang(selectedLangId)
    const unit = curriculum.units.find((u) => u.id === unitId)
    if (!unit) return 0
    return unit.modules.reduce((s, m) => s + m.xpReward, 0)
  }

  const moduleTypeLabel = (type) => {
    if (type === 'quiz') return 'KUIS'
    if (type === 'simulator') return 'SIMULATOR'
    return 'MATERI'
  }
  const moduleTypeColor = (type) => {
    if (type === 'quiz') return '#f97316'
    if (type === 'simulator') return '#06b6d4'
    return '#a78bfa'
  }

  return (
    <div className="duo-layout-root">
      {/* ===== MOBILE TOP BAR ===== */}
      <header className="duo-mobile-topbar">
        <button
          className="m-top-btn m-lang-badge"
          onClick={() => { setShowLangPicker(true); playSoundCue('click') }}
        >
          <LuCode size={16} />
          <span>{selectedLangId.toUpperCase().slice(0, 3)}</span>
        </button>

        <button
          className="m-top-btn m-streak-badge"
          onClick={() => { setShowStreakModal(true); playSoundCue('click') }}
        >
          <LuFlame size={18} className="icon-orange" />
          <span className="m-stat-num">{currentStreak}</span>
        </button>

        <div className="m-top-btn m-gem-badge">
          <LuGem size={16} className="icon-cyan" />
          <span className="m-stat-num">{gems}</span>
        </div>

        <div className="m-top-btn m-heart-badge">
          <LuHeart size={16} className="icon-red" />
          <span className="m-stat-num">{hearts}</span>
        </div>

        <button
          className={`m-top-btn m-avatar-btn ${activeNav === 'akun' ? 'active' : ''}`}
          onClick={() => goNav('akun')}
          aria-label="Akun & Logout"
        >
          <RandomCyberAvatar variant={avatarVariant} size={26} />
        </button>
      </header>

      {/* ===== LEFT SIDEBAR ===== */}
      <aside className="duo-sidebar">
        <div className="duo-sidebar-top">
          <div className="duo-brand">
            <KinetixLogo size={32} showText={true} />
          </div>

          <nav className="duo-nav-list">
            <button
              className={`duo-nav-item ${activeNav === 'belajar' ? 'active' : ''}`}
              onClick={() => { setActiveNav('belajar'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuHouse size={22} /></div>
              <span className="nav-label">BELAJAR</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'visualizer' ? 'active' : ''}`}
              onClick={() => { setActiveNav('visualizer'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuHeadphones size={22} /></div>
              <span className="nav-label">VISUALIZER</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'playground' ? 'active' : ''}`}
              onClick={() => { setActiveNav('playground'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuTerminal size={22} /></div>
              <span className="nav-label">PLAYGROUND</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'papan-skor' ? 'active' : ''}`}
              onClick={() => { setActiveNav('papan-skor'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuShield size={22} /></div>
              <span className="nav-label">PAPAN SKOR</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'misi' ? 'active' : ''}`}
              onClick={() => { setActiveNav('misi'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuScroll size={22} /></div>
              <span className="nav-label">MISI</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'bahasa' ? 'active' : ''}`}
              onClick={() => { setActiveNav('bahasa'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuStore size={22} /></div>
              <span className="nav-label">SEMUA BAHASA</span>
            </button>

            <button
              className="duo-nav-item"
              onClick={() => { setShowLangPicker(true); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuEllipsis size={22} /></div>
              <span className="nav-label">PILIH BAHASA</span>
            </button>

            <button
              className="duo-nav-item"
              onClick={() => { navigate('/'); playSoundCue('click') }}
            >
              <div className="nav-icon-wrap"><LuArrowLeft size={22} /></div>
              <span className="nav-label">KEMBALI</span>
            </button>
          </nav>
        </div>

        <div className="duo-sidebar-bottom">
          <div className="sidebar-companion-widget">
            <CharacterAvatar size={48} emotion="happy" animated={false} />
            <div className="companion-speech-bubble">
              <span>
                {user
                  ? `Halo ${user.displayName || 'Koder'}! XP: ${xp}`
                  : streakData.streak === 0
                  ? 'Mulai latihan hari ini!'
                  : `Streak: ${streakData.streak} Hari!`}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== CENTER MAIN CONTENT ===== */}
      <main className="duo-main-content">

        {/* VIEW A: MULTI-LEVEL BELAJAR PATH */}
        {activeNav === 'belajar' && (
          <div className="duo-path-stream">
            {/* Top Language & Guidebook Hero Banner */}
            <div className="duo-unit-banner">
              <div className="unit-banner-left">
                <span className="unit-breadcrumb">
                  <span className="unit-pill-tag">{currentLang.name.toUpperCase()}</span>
                  JALUR PEMBELAJARAN INTERAKTIF
                </span>
                <h2 className="unit-banner-title">
                  {getCurriculumForLang(selectedLangId).units.find((u) => u.id === activeUnitId)?.title ||
                    getCurriculumForLang(selectedLangId).units[0]?.title ||
                    'Kurikulum Interaktif'}
                </h2>
              </div>
              <button
                className="btn-buku-panduan"
                onClick={() => { setShowTheoryGuide(true); playSoundCue('click') }}
              >
                <LuBookOpen size={18} />
                <span>BUKU PANDUAN</span>
              </button>
            </div>

            {/* Full-Width XP & Level Progress Bar */}
            <div className="xp-progress-section">
              <div className="xp-progress-label">
                <span className="xp-level-pill">LVL {Math.floor(xp / 100) + 1}</span>
                <LuZap size={16} className="icon-orange" />
                <span><strong>{xp}</strong> XP</span>
              </div>
              <div className="xp-bar-track">
                <div
                  className="xp-bar-fill"
                  style={{ width: `${Math.min(100, Math.max(4, (xp % 100)))}%` }}
                />
              </div>
              <span className="xp-next-target">{100 - (xp % 100)} XP ke Level {Math.floor(xp / 100) + 2}</span>
            </div>

            {/* MULTI UNIT PIPELINE */}
            <div className="multi-unit-container">
              {unitsWithStatus.map((unit, unitIdx) => {
                const isExpanded = activeUnitId === unit.id && unit.isUnlocked
                return (
                  <div key={unit.id} className="unit-block">
                    {/* Sleek Unit Divider / Accordion Header */}
                    <button
                      className={`unit-banner-toggle ${unit.isUnlocked ? 'unlocked' : 'locked'} ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => {
                        if (!unit.isUnlocked) return
                        playSoundCue('click')
                        setActiveUnitId(isExpanded ? null : unit.id)
                      }}
                      style={{ '--unit-color': unit.theme }}
                    >
                      <div className="unit-header-left">
                        <div
                          className="unit-num-badge"
                          style={{ background: unit.isUnlocked ? unit.theme : '#2d3247' }}
                        >
                          {unit.isCompleted ? (
                            <LuCheck size={18} strokeWidth={3} />
                          ) : unit.isUnlocked ? (
                            <span>{unitIdx + 1}</span>
                          ) : (
                            <LuLock size={16} />
                          )}
                        </div>
                        <div className="unit-header-info">
                          <span className="unit-section-label" style={{ color: unit.isUnlocked ? unit.theme : '#64748b' }}>
                            {!unit.isUnlocked ? `UNIT ${unitIdx + 1} - TERKUNCI` : unit.isCompleted ? `UNIT ${unitIdx + 1} - SELESAI` : `UNIT ${unitIdx + 1}`}
                          </span>
                          <h3 className="unit-section-title">{unit.title}</h3>
                          <p className="unit-section-subtitle">{unit.subtitle}</p>
                        </div>
                      </div>
                      <div className="unit-header-right">
                        {!unit.isUnlocked ? (
                          <span className="unit-xp-required">
                            <LuLock size={13} /> {unit.requiredXP} XP
                          </span>
                        ) : (
                          <>
                            <span className="unit-xp-total">
                              <LuStar size={13} /> {totalUnitXP(unit.id)} XP
                            </span>
                            {isExpanded ? <LuChevronUp size={18} /> : <LuChevronDown size={18} />}
                          </>
                        )}
                      </div>
                    </button>

                    {/* Spacious Kinetix Circuit Quest Pipeline */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="kinetix-quest-pipeline"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                        >
                          {unit.modules.map((mod, modIdx) => {
                            const isModCompleted = userData?.completedModules?.includes(mod.id) || false
                            const isModActive =
                              !isModCompleted &&
                              (modIdx === 0 || userData?.completedModules?.includes(unit.modules[modIdx - 1]?.id))
                            const isLast = modIdx === unit.modules.length - 1
                            const cardClass = isModCompleted
                              ? 'quest-completed'
                              : isModActive
                              ? 'quest-active'
                              : mod.type === 'simulator' && isModActive
                              ? 'quest-ready'
                              : 'quest-locked'

                            return (
                              <div key={mod.id} className={`quest-pipeline-card ${cardClass}`}>
                                <div className="quest-card-indicator">
                                  <div className="quest-node-icon">
                                    {isModCompleted ? (
                                      <LuCheck size={20} strokeWidth={3} />
                                    ) : isModActive ? (
                                      <LuStar size={20} />
                                    ) : (
                                      getModuleIcon(mod.type)
                                    )}
                                  </div>
                                  {!isLast && <div className="quest-connector-line" />}
                                </div>

                                <div className="quest-card-content">
                                  <div className="quest-card-top">
                                    <span className={`quest-step-badge ${isModActive ? 'active-badge' : ''}`}>
                                      MODUL {modIdx + 1} - {moduleTypeLabel(mod.type)}
                                    </span>
                                    <span
                                      className={`quest-status-badge ${
                                        isModCompleted ? 'badge-green' : isModActive ? 'badge-purple' : 'badge-gray'
                                      }`}
                                    >
                                      {isModCompleted ? 'SELESAI' : `+${mod.xpReward} XP`}
                                    </span>
                                  </div>
                                  <h4>{mod.title}</h4>
                                  <p>{mod.desc}</p>
                                  <button
                                    className={`btn-quest-action ${
                                      isModCompleted
                                        ? ''
                                        : isModActive
                                        ? 'btn-quest-primary'
                                        : 'btn-quest-locked'
                                    }`}
                                    onClick={() => handleOpenModule(unit, mod)}
                                    disabled={!isModCompleted && !isModActive}
                                  >
                                    {isModCompleted ? (
                                      <><LuPlay size={14} /> Ulangi Latihan</>
                                    ) : isModActive ? (
                                      <><LuSparkles size={15} /> BUKA KELAS INTERAKTIF</>
                                    ) : (
                                      <><LuLock size={14} /> Selesaikan Modul Sebelumnya</>
                                    )}
                                  </button>
                                </div>
                              </div>
                            )
                          })}

                          {unit.isCompleted && (
                            <div className="unit-complete-badge">
                              <LuTrophy size={22} className="trophy-icon" />
                              <div>
                                <strong>Unit {unitIdx + 1} Selesai!</strong>
                                <p>Lanjut ke unit berikutnya untuk tantangan lebih lanjut.</p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW B: ALGORITHM VISUALIZER */}
        {activeNav === 'visualizer' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2>Visualizer Algoritma Real-Time</h2>
              <p>Simulasi 60 FPS untuk {currentLang.name}.</p>
            </div>
            <AlgorithmVisualizer />
          </div>
        )}

        {/* VIEW C: CODE PLAYGROUND */}
        {activeNav === 'playground' && (
          <div className="duo-subview-wrap playground-view">
            <div className="subview-header">
              <h2><LuTerminal size={22} className="icon-inline" /> Code Playground</h2>
              <p>Tulis dan jalankan kode {currentLang.name} langsung di browser.</p>
            </div>
            <div className="playground-container">
              <div className="playground-toolbar">
                <div className="playground-lang-badge" style={{ color: currentLang.color }}>
                  <LuCode size={15} />
                  <span>{currentLang.name}</span>
                </div>
                <button
                  className="btn-run-code"
                  onClick={handleRunPlayground}
                  disabled={playgroundRunning}
                >
                  {playgroundRunning ? (
                    <span className="run-spinner" />
                  ) : (
                    <><LuPlay size={16} /> Jalankan Kode</>
                  )}
                </button>
              </div>
              <div className="playground-editor-wrap">
                <div className="editor-line-numbers">
                  {playgroundCode.split('\n').map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className="playground-editor"
                  value={playgroundCode}
                  onChange={(e) => setPlaygroundCode(e.target.value)}
                  spellCheck={false}
                  placeholder="// Tulis kode kamu di sini..."
                />
              </div>
              <div className="playground-console">
                <div className="console-header">
                  <span className="console-dot red" /><span className="console-dot yellow" /><span className="console-dot green" />
                  <span className="console-title">Output Console</span>
                </div>
                <pre className="console-output">
                  {playgroundRunning
                    ? '// Menjalankan kode...'
                    : playgroundOutput || '// Tekan "Jalankan Kode" untuk melihat output'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* VIEW D: ALL LANGUAGES CATALOG */}
        {activeNav === 'bahasa' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2>Katalog Bahasa Pemrograman</h2>
              <p>Dari Assembly bare-metal hingga Brainfuck esoterik.</p>
            </div>
            <div className="languages-cards-grid">
              {programmingLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className={`duo-lang-card ${selectedLangId === lang.id ? 'active' : ''}`}
                  onClick={() => handleSwitchLang(lang.id)}
                >
                  <div className="duo-lang-top">
                    <span className="lang-tag-pill" style={{ color: lang.color, borderColor: lang.color }}>
                      {lang.tierLabel}
                    </span>
                    <span className="lang-diff-badge">{lang.difficulty}/5</span>
                  </div>
                  <h3>{lang.name}</h3>
                  <p>{lang.description}</p>
                  <button className="btn-select-lang">
                    {selectedLangId === lang.id ? (
                      <><LuCheck size={14} /> Bahasa Aktif</>
                    ) : (
                      'Pilih Bahasa Ini'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW E: PAPAN SKOR */}
        {activeNav === 'papan-skor' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2><LuShield size={22} className="icon-inline" /> Liga Berlian</h2>
              <p>Peringkat koder teraktif minggu ini.</p>
            </div>
            <div className="leaderboard-table glass-card">
              {[
                { rank: 1, name: 'Budi Santoso', xp: 2450, lang: 'Python' },
                { rank: 2, name: 'Siti Rahma', xp: 2120, lang: 'C++' },
                { rank: 3, name: 'Devan Putra', xp: 1890, lang: 'Rust' },
                { rank: 4, name: user?.displayName || 'Kamu (Aktif)', xp: xp || 420, lang: currentLang.name, isUser: true },
                { rank: 5, name: 'Farhan Code', xp: 1220, lang: 'Assembly' },
              ].map((entry) => (
                <div key={entry.rank} className={`lb-row ${entry.isUser ? 'lb-user-row' : ''}`}>
                  <span className="lb-rank">#{entry.rank}</span>
                  <span className="lb-avatar"><LuUser size={18} /></span>
                  <div className="lb-name-col">
                    <strong>{entry.name}</strong>
                    <small>{entry.lang}</small>
                  </div>
                  <span className="lb-xp">{entry.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW F: MISI HARIAN */}
        {activeNav === 'misi' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2><LuScroll size={22} className="icon-inline" /> Misi Harian</h2>
              <p>Selesaikan misi untuk XP dan streak bonus!</p>
            </div>
            <div className="quests-list">
              <div className="quest-card glass-card">
                <div className="quest-icon"><LuZap size={22} /></div>
                <div className="quest-info">
                  <strong>Dapatkan 20 XP</strong>
                  <div className="quest-bar"><div className="quest-fill" style={{ width: `${Math.min(100, (xp / 20) * 100)}%` }} /></div>
                  <small>{Math.min(xp, 20)} / 20 XP</small>
                </div>
              </div>
              <div className="quest-card glass-card">
                <div className="quest-icon"><LuStar size={22} /></div>
                <div className="quest-info">
                  <strong>Jalankan 1 Simulasi Visualizer</strong>
                  <div className="quest-bar"><div className="quest-fill" style={{ width: '100%' }} /></div>
                  <small>1 / 1 Selesai</small>
                </div>
              </div>
              <div className="quest-card glass-card">
                <div className="quest-icon"><LuCode size={22} /></div>
                <div className="quest-info">
                  <strong>Buka 1 Kelas Interaktif</strong>
                  <div className="quest-bar"><div className="quest-fill" style={{ width: userData?.completedModules?.length > 0 ? '100%' : '0%' }} /></div>
                  <small>{userData?.completedModules?.length > 0 ? '1 / 1' : '0 / 1'} Selesai</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW G: AKUN (terutama untuk mobile: profil, logout, menu lain) */}
        {activeNav === 'akun' && (
          <div className="duo-subview-wrap account-view">
            <div className="subview-header">
              <h2><LuUser size={22} className="icon-inline" /> Akun Saya</h2>
              <p>Kelola profil, bahasa, dan keluar dari akun.</p>
            </div>

            {user && renderAccountCard('account-view-card')}

            <div className="account-stats-grid">
              <div className="account-stat"><LuZap size={18} className="icon-orange" /><strong>{xp}</strong><small>XP</small></div>
              <div className="account-stat"><LuFlame size={18} className="icon-orange" /><strong>{currentStreak}</strong><small>Streak</small></div>
              <div className="account-stat"><LuGem size={18} className="icon-cyan" /><strong>{gems}</strong><small>Gems</small></div>
              <div className="account-stat"><LuHeart size={18} className="icon-red" /><strong>{hearts}</strong><small>Nyawa</small></div>
            </div>

            <div className="account-menu-list">
              <button className="account-menu-item" onClick={() => { setShowLangPicker(true); playSoundCue('click') }}>
                <LuCode size={18} /><span>Ganti Bahasa ({currentLang.name})</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => goNav('bahasa')}>
                <LuStore size={18} /><span>Katalog Semua Bahasa</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => { setShowTheoryGuide(true); playSoundCue('click') }}>
                <LuBookOpen size={18} /><span>Buku Panduan</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => navigate('/')}>
                <LuArrowLeft size={18} /><span>Kembali ke Beranda</span><LuArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===== RIGHT PANEL (hidden on visualizer & playground) ===== */}
      {activeNav !== 'visualizer' && activeNav !== 'playground' && (
        <aside className="duo-right-panel">
          <div className="right-top-stats">
            <button
              className="stat-btn lang-badge-btn"
              onClick={() => { setShowLangPicker(true); playSoundCue('click') }}
              title="Ganti Bahasa"
            >
              <span className="flag-icon"><LuCode size={18} /></span>
              <span className="lang-code-short">{selectedLangId.toUpperCase().slice(0, 3)}</span>
            </button>

            <button
              className="stat-btn streak-btn"
              onClick={() => { setShowStreakModal(true); playSoundCue('click') }}
            >
              <LuFlame size={20} className="icon-orange" />
              <span className="stat-value">{currentStreak}</span>
              {currentStreak === 0 && <div className="dot-alert" />}
            </button>

            <div className="stat-btn gem-btn">
              <LuGem size={20} className="icon-cyan" />
              <span className="stat-value">{gems}</span>
            </div>

            <div className="stat-btn heart-btn">
              <LuHeart size={20} className="icon-red" />
              <span className="stat-value">{hearts}</span>
            </div>
          </div>

          {/* Lab Challenge Card */}
          <div className="right-card super-card lab-challenge-card">
            <div className="super-header">
              <span className="lab-challenge-badge">MODE TANTANGAN</span>
              <div className="super-char-badge">
                <CharacterAvatar size={70} emotion="happy" animated={true} />
              </div>
            </div>
            <h3 className="super-title">Lab Logika & Algoritma</h3>
            <p className="super-desc">
              Uji pemahaman komputasi dengan simulasi algoritma tingkat lanjut 60 FPS dan raih lencana eksklusif!
            </p>
            <button className="btn-super-cta" onClick={() => { setActiveNav('visualizer'); playSoundCue('success') }}>
              JELAJAHI LAB VISUALIZER
            </button>
          </div>

          {/* XP Progress Right Panel */}
          <div className="right-card league-card">
            <div className="card-top-row">
              <h4>Progres Belajar</h4>
              <span className="xp-right-total">{xp} XP</span>
            </div>
            <div className="right-unit-progress">
              {unitsWithStatus.map((unit, i) => (
                <div key={unit.id} className="right-unit-row">
                  <div
                    className="right-unit-dot"
                    style={{ background: unit.isUnlocked ? unit.theme : '#374151' }}
                  >
                    {unit.isCompleted ? <LuCheck size={10} /> : unit.isUnlocked ? <span>{i + 1}</span> : <LuLock size={10} />}
                  </div>
                  <div className="right-unit-info">
                    <span className="right-unit-name">{unit.title}</span>
                    <div className="right-unit-bar">
                      <div
                        className="right-unit-fill"
                        style={{
                          width: unit.isUnlocked
                            ? `${Math.min(100, Math.max(0, ((xp - unit.requiredXP) / totalUnitXP(unit.id)) * 100))}%`
                            : '0%',
                          background: unit.theme,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misi Harian */}
          <div className="right-card quests-card">
            <div className="card-top-row">
              <h4>Misi Harian</h4>
              <button className="link-sub" onClick={() => setActiveNav('misi')}>LIHAT SEMUA</button>
            </div>
            <div className="quest-mini-row">
              <div className="quest-bolt-icon"><LuZap size={18} /></div>
              <div className="quest-mini-progress">
                <div className="quest-mini-title">Dapatkan 20 XP</div>
                <div className="mini-bar"><div className="mini-fill" style={{ width: `${Math.min(100, (xp / 20) * 100)}%` }} /></div>
                <small>{Math.min(xp, 20)} / 20</small>
              </div>
            </div>
          </div>

          {/* User profile card if logged in or guest */}
          {user && renderAccountCard()}
        </aside>
      )}

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="duo-mobile-bottom-nav">
        <button className={`m-nav-item ${activeNav === 'belajar' ? 'active' : ''}`} onClick={() => goNav('belajar')}>
          <LuHouse size={21} /><span>Belajar</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'visualizer' ? 'active' : ''}`} onClick={() => goNav('visualizer')}>
          <LuHeadphones size={21} /><span>Visual</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'playground' ? 'active' : ''}`} onClick={() => goNav('playground')}>
          <LuTerminal size={21} /><span>Kode</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'papan-skor' ? 'active' : ''}`} onClick={() => goNav('papan-skor')}>
          <LuShield size={21} /><span>Skor</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'misi' ? 'active' : ''}`} onClick={() => goNav('misi')}>
          <LuScroll size={21} /><span>Misi</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'akun' ? 'active' : ''}`} onClick={() => goNav('akun')}>
          <LuUser size={21} /><span>Akun</span>
        </button>
      </nav>

      {/* ===== MODAL: STREAK ===== */}
      <AnimatePresence>
        {showStreakModal && (
          <div className="duo-modal-backdrop" onClick={() => setShowStreakModal(false)}>
            <motion.div
              className="duo-picker-dialog glass-card streak-modal-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="picker-header">
                <div className="streak-header-title">
                  <LuFlame size={28} className="icon-orange" />
                  <h3>Streak: {currentStreak} Hari!</h3>
                </div>
                <button className="modal-close" onClick={() => setShowStreakModal(false)}>
                  <LuX size={20} />
                </button>
              </div>
              <p className="picker-subtitle">
                {streakData.hasCompletedToday
                  ? 'Keren! Latihan hari ini sudah selesai.'
                  : 'Selesaikan 1 kuis hari ini untuk memperpanjang streak!'}
              </p>
              <div className="streak-week-grid">
                {weekStatus.map((day) => (
                  <div key={day.dateStr} className={`streak-day-cell ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}>
                    <span className="streak-day-name">{day.dayName}</span>
                    <div className="streak-day-circle">
                      {day.isCompleted ? (
                        <LuFlame size={20} className="icon-orange fill-fire" />
                      ) : (
                        <span className="day-number">{day.dateNum}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="streak-summary-note">
                <small>Terakhir aktif: <strong>{streakData.lastActiveDate}</strong></small>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: LANGUAGE PICKER ===== */}
      <AnimatePresence>
        {showLangPicker && (
          <div className="duo-modal-backdrop" onClick={() => setShowLangPicker(false)}>
            <motion.div
              className="duo-picker-dialog glass-card"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="picker-header">
                <h3>Pilih Bahasa Pemrograman</h3>
                <button className="modal-close" onClick={() => setShowLangPicker(false)}>
                  <LuX size={20} />
                </button>
              </div>
              <p className="picker-subtitle">Ganti kursus aktif -- dari Low-Level hingga Tersulit!</p>
              <div className="picker-grid">
                {programmingLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    className={`picker-lang-item ${selectedLangId === lang.id ? 'active' : ''}`}
                    onClick={() => handleSwitchLang(lang.id)}
                  >
                    <span className="picker-dot" style={{ background: lang.color }} />
                    <div className="picker-lang-info">
                      <strong>{lang.name}</strong>
                      <small>{lang.tierLabel}</small>
                    </div>
                    {selectedLangId === lang.id && <LuCheck size={18} className="text-accent" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: BUKU PANDUAN ===== */}
      <AnimatePresence>
        {showTheoryGuide && (
          <TheoryGuidebook lang={currentLang} onClose={() => setShowTheoryGuide(false)} />
        )}
      </AnimatePresence>

      {/* ===== MODAL: INTERACTIVE LESSON PACK ===== */}
      <AnimatePresence>
        {activeQuizNode && (
          <InteractiveLessonPack
            unitId={activeQuizNode}
            langName={currentLang.name}
            onClose={() => setActiveQuizNode(null)}
            onComplete={async () => {
              const modXP = activeModuleData?.module?.xpReward || 30
              await handleCompleteModule(modXP)
              // Mark module as completed in Firestore
              if (user && activeModuleData?.module?.id) {
                const newCompleted = Array.from(new Set([...(userData?.completedModules || []), activeModuleData.module.id]))
                await updateUserData({ completedModules: newCompleted })
              }
              setActiveQuizNode(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function getModuleIcon(type) {
  if (type === 'quiz') return <LuSearch size={18} />
  if (type === 'simulator') return <LuHeadphones size={18} />
  return <LuBookOpen size={18} />
}

const AVATAR_PALETTES = [
  { bg: '#312e81', accent: '#8b5cf6', visor: '#38bdf8' },
  { bg: '#064e3b', accent: '#10b981', visor: '#a7f3d0' },
  { bg: '#7c2d12', accent: '#f97316', visor: '#fde047' },
  { bg: '#831843', accent: '#ec4899', visor: '#f9a8d4' },
  { bg: '#1e3a8a', accent: '#3b82f6', visor: '#67e8f9' },
  { bg: '#4c1d95', accent: '#a855f7', visor: '#fbbf24' },
]

function RandomCyberAvatar({ variant = 0, size = 40 }) {
  const p = AVATAR_PALETTES[variant % AVATAR_PALETTES.length]
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill={p.bg} />
      <circle cx="20" cy="17" r="7" fill={p.accent} />
      <rect x="14" y="14" width="12" height="4.5" rx="2.2" fill={p.visor} />
      <path d="M9 35C9 28.9249 13.9249 24 20 24C26.0751 24 31 28.9249 31 35" fill={p.accent} opacity="0.9" />
    </svg>
  )
}

export default DuolingoLearn
