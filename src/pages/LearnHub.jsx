import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuHouse,
  LuChartColumn,
  LuTerminal,
  LuShield,
  LuScroll,
  LuStore,
  LuUser,
  LuFlame,
  LuSparkles,
  LuHeart,
  LuBookOpen,
  LuStar,
  LuCheck,
  LuX,
  LuCode,
  LuArrowRight,
  LuArrowLeft,
  LuSearch,
  LuTrophy,
  LuGem,
  LuZap,
  LuLock,
  LuChevronDown,
  LuChevronUp,
  LuPlay,
  LuLogOut,
  LuRefreshCw,
  LuMonitorPlay,
} from 'react-icons/lu'
import { programmingLanguages } from '../data/programmingLanguages'
import { getCurriculumForLang, computeUnitUnlockStatus } from '../data/multiLevelCurriculum'
import CharacterAvatar from '../components/CharacterAvatar'
import AlgorithmVisualizer from '../components/AlgorithmVisualizer'
import CodePlayground from '../components/CodePlayground'
import RealtimeLeaderboard from '../components/RealtimeLeaderboard'
import CheckpointMissions from '../components/CheckpointMissions'
import KinetixLogo from '../components/KinetixLogo'
import TheoryGuidebook from '../components/TheoryGuidebook'
import InteractiveLessonPack from '../components/InteractiveLessonPack'
import CheckpointRoadmap from '../components/CheckpointRoadmap'
import VideoLearningSection from '../components/VideoLearningSection'
import { playSoundCue } from '../components/AccessibilityToolbar'
import { useAuth } from '../contexts/AuthContext'
import { loadRewardState, getActiveTitleMeta } from '../utils/xpRewards'
import {
  getStreakData,
  recordDailyActivity,
  getWeekStreakStatus,
  getTodayDateString,
  getDayDifference,
} from '../utils/streakManager'
import './LearnHub.css'

const LANG_SHORT_CODES = {
  assembly: 'ASM',
  c: 'C',
  cpp: 'C++',
  rust: 'RS',
  python: 'PY',
  javascript: 'JS',
  golang: 'GO',
  java: 'JV',
  haskell: 'HS',
  brainfuck: 'BF',
  prolog: 'PL',
  malbolge: 'MB',
  htmlcss: 'WEB',
  sql: 'SQL',
  php: 'PHP',
  csharp: 'C#',
  kotlin: 'KT',
}

const getLangShortCode = (langId) =>
  LANG_SHORT_CODES[langId] || String(langId || '').toUpperCase().slice(0, 3)

const loadDailyMissions = () => {
  const key = `kinetix_daily_missions_${getTodayDateString()}`
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        visualizerRuns: parsed.visualizerRuns || 0,
        playgroundRuns: parsed.playgroundRuns || 0,
        lessonsCompletedToday: parsed.lessonsCompletedToday || 0,
        claimed: parsed.claimed || {},
      }
    }
  } catch {
    // Fallback to clean state
  }
  return { visualizerRuns: 0, playgroundRuns: 0, lessonsCompletedToday: 0, claimed: {} }
}

const saveDailyMissions = (data) => {
  const key = `kinetix_daily_missions_${getTodayDateString()}`
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {
    // Ignore storage quota issues
  }
}

function LearnHub() {
  const navigate = useNavigate()
  const { user, userData, isGuest, logout, updateUserData } = useAuth()

  const [selectedLangId, setSelectedLangId] = useState(userData?.selectedLang || 'python')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [showTheoryGuide, setShowTheoryGuide] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [activeNav, setActiveNav] = useState('belajar')
  const [prevNav, setPrevNav] = useState('belajar')
  const [missionsSubTab, setMissionsSubTab] = useState('misi')
  const [rewardState, setRewardState] = useState(() => loadRewardState())
  const activeTitleMeta = getActiveTitleMeta(rewardState)
  const [activeUnitId, setActiveUnitId] = useState(1)
  const [activeQuizNode, setActiveQuizNode] = useState(null)
  const [activeModuleData, setActiveModuleData] = useState(null)
  const [showLangSpotlight, setShowLangSpotlight] = useState(
    () => localStorage.getItem('kinetix_lang_spotlight_seen') !== '1'
  )
  const [spotlightRect, setSpotlightRect] = useState(null)
  const mobileLangBtnRef = useRef(null)
  const desktopLangBtnRef = useRef(null)
  const bannerLangBtnRef = useRef(null)
  const [avatarVariant, setAvatarVariant] = useState(() => {
    const saved = localStorage.getItem('kinetix_avatar_variant')
    return saved ? parseInt(saved, 10) : Math.floor(Math.random() * 6)
  })

  // Real-tracked daily missions state
  const [dailyStats, setDailyStats] = useState(() => loadDailyMissions())

  // Real Gamification Stats (synced with Firebase / Guest localStorage)
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

  const dismissLangSpotlight = (openPicker = false) => {
    localStorage.setItem('kinetix_lang_spotlight_seen', '1')
    setShowLangSpotlight(false)
    setSpotlightRect(null)
    if (openPicker) {
      setShowLangPicker(true)
      playSoundCue('click')
    }
  }

  useEffect(() => {
    const canShow =
      showLangSpotlight &&
      activeNav === 'belajar' &&
      !activeQuizNode &&
      !showTheoryGuide &&
      !showLangPicker &&
      !showStreakModal

    if (!canShow) {
      setSpotlightRect(null)
      return undefined
    }

    const measure = () => {
      const candidates = [mobileLangBtnRef.current, desktopLangBtnRef.current, bannerLangBtnRef.current]
      for (const el of candidates) {
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0) {
          setSpotlightRect({
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
            bottom: r.bottom,
          })
          return
        }
      }
      setSpotlightRect(null)
    }

    const rafId = requestAnimationFrame(measure)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') dismissLangSpotlight(false)
    }
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [showLangSpotlight, activeNav, activeQuizNode, showTheoryGuide, showLangPicker, showStreakModal])

  const updateDaily = (updater) => {
    setDailyStats((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveDailyMissions(next)
      return next
    })
  }

  const handleVisualizerRun = () => {
    updateDaily((prev) => ({ ...prev, visualizerRuns: prev.visualizerRuns + 1 }))
  }

  const handlePlaygroundRun = () => {
    updateDaily((prev) => ({ ...prev, playgroundRuns: prev.playgroundRuns + 1 }))
  }

  const handleClaimMissionReward = async (missionId, addXP = 0, addGems = 0) => {
    if (dailyStats.claimed?.[missionId]) return
    updateDaily((prev) => ({
      ...prev,
      claimed: { ...(prev.claimed || {}), [missionId]: true },
    }))
    const nextXP = xp + addXP
    const nextGems = gems + addGems
    setXp(nextXP)
    setGems(nextGems)
    if (addXP > 0) {
      const updated = recordDailyActivity()
      setStreakData(updated)
    }
    if (user) {
      await updateUserData({ xp: nextXP, gems: nextGems })
    }
  }

  const currentLang =
    programmingLanguages.find((l) => l.id === selectedLangId) || programmingLanguages[4]

  const unitsWithStatus = computeUnitUnlockStatus(selectedLangId, xp)
  const completedModules = userData?.completedModules || []
  const totalCheckpointsInLang = unitsWithStatus.reduce((sum, u) => sum + u.modules.length, 0)
  const completedCheckpointsInLang = unitsWithStatus.reduce(
    (sum, u) => sum + u.modules.filter((m) => completedModules.includes(m.id)).length,
    0
  )

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
    setActiveQuizNode(`${unit.id}-${module.id}`)
  }

  const handleCompleteModule = async (moduleXP) => {
    const newXP = xp + (moduleXP || 30)
    const newGems = gems + 10
    setXp(newXP)
    setGems(newGems)
    updateDaily((prev) => ({
      ...prev,
      lessonsCompletedToday: prev.lessonsCompletedToday + 1,
    }))
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
    if (nav !== activeNav) {
      setPrevNav(activeNav)
    }
    setActiveNav(nav)
    playSoundCue('nav')
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

  return (
    <div className="duo-layout-root">
      {/* ===== MOBILE TOP BAR ===== */}
      <header className="duo-mobile-topbar">
        <button
          ref={mobileLangBtnRef}
          className="m-top-btn m-lang-badge"
          onClick={() => {
            if (showLangSpotlight) {
              dismissLangSpotlight(true)
              return
            }
            setShowLangPicker(true)
            playSoundCue('click')
          }}
          aria-label="Ganti Bahasa Pemrograman"
          title="Ganti Bahasa Pemrograman"
        >
          <LuCode size={16} />
          <span>{getLangShortCode(selectedLangId)}</span>
          <LuChevronDown size={13} className="lang-chevron" />
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
              onClick={() => goNav('belajar')}
            >
              <div className="nav-icon-wrap"><LuHouse size={22} /></div>
              <span className="nav-label">BELAJAR</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'video' ? 'active' : ''}`}
              onClick={() => goNav('video')}
            >
              <div className="nav-icon-wrap"><LuMonitorPlay size={22} /></div>
              <span className="nav-label">VIDEO BELAJAR</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'visualizer' ? 'active' : ''}`}
              onClick={() => goNav('visualizer')}
            >
              <div className="nav-icon-wrap"><LuChartColumn size={22} /></div>
              <span className="nav-label">VISUALIZER</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'playground' ? 'active' : ''}`}
              onClick={() => goNav('playground')}
            >
              <div className="nav-icon-wrap"><LuTerminal size={22} /></div>
              <span className="nav-label">PLAYGROUND</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'papan-skor' ? 'active' : ''}`}
              onClick={() => goNav('papan-skor')}
            >
              <div className="nav-icon-wrap"><LuShield size={22} /></div>
              <span className="nav-label">PAPAN SKOR</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'misi' ? 'active' : ''}`}
              onClick={() => goNav('misi')}
            >
              <div className="nav-icon-wrap"><LuScroll size={22} /></div>
              <span className="nav-label">MISI</span>
            </button>

            <button
              className={`duo-nav-item ${activeNav === 'bahasa' ? 'active' : ''}`}
              onClick={() => goNav('bahasa')}
            >
              <div className="nav-icon-wrap"><LuStore size={22} /></div>
              <span className="nav-label">SEMUA BAHASA</span>
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
            <CharacterAvatar size={46} emotion="happy" animated={false} interactive={true} />
            <div className="companion-speech-bubble">
              {user ? (
                <>
                  <strong className="companion-name">Halo, {user.displayName || 'Koder'}!</strong>
                  <span className="companion-stat-line">
                    <LuZap size={12} className="icon-orange" /> {xp} XP
                  </span>
                  {activeTitleMeta && (
                    <span
                      className="companion-title-badge"
                      style={{ color: activeTitleMeta.color, borderColor: `${activeTitleMeta.color}44` }}
                    >
                      ★ {activeTitleMeta.label}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <strong className="companion-name">Halo, Koder!</strong>
                  <span className="companion-stat-line">
                    {streakData.streak === 0
                      ? 'Mulai latihan hari ini'
                      : `Streak ${streakData.streak} Hari`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* ===== CENTER MAIN CONTENT ===== */}
      <main className="duo-main-content">

        {/* VIEW A: CYBER-CHECKPOINT LEARNING PATH */}
        {activeNav === 'belajar' && (
          <div className="duo-path-stream">
            {/* Top Language & Guidebook Hero Banner */}
            <div className="duo-unit-banner">
              <div className="unit-banner-left">
                <span className="unit-breadcrumb">
                  <button
                    ref={bannerLangBtnRef}
                    type="button"
                    className="unit-pill-tag unit-pill-clickable"
                    onClick={() => {
                      if (showLangSpotlight) {
                        dismissLangSpotlight(true)
                        return
                      }
                      setShowLangPicker(true)
                      playSoundCue('click')
                    }}
                    title="Ganti Bahasa Pemrograman"
                  >
                    <span>{currentLang.name.toUpperCase()}</span>
                    <LuChevronDown size={12} />
                  </button>
                  <span className="unit-banner-cp-count">
                    {completedCheckpointsInLang}/{totalCheckpointsInLang} Checkpoint
                  </span>
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
              <button
                type="button"
                className="btn-xp-shop-quick"
                onClick={() => {
                  setMissionsSubTab('toko')
                  goNav('misi')
                }}
              >
                Tukar XP →
              </button>
            </div>

            {/* MULTI-UNIT CYBER CHECKPOINT ROADMAP */}
            <div className="multi-unit-container">
              {unitsWithStatus.map((unit, unitIdx) => {
                const isExpanded = activeUnitId === unit.id && unit.isUnlocked
                return (
                  <div key={unit.id} className="unit-block">
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
                            {!unit.isUnlocked ? `UNIT ${unitIdx + 1} • TERKUNCI` : unit.isCompleted ? `UNIT ${unitIdx + 1} • TUNTAS` : `UNIT ${unitIdx + 1}`}
                          </span>
                          <h3 className="unit-section-title">{unit.title}</h3>
                          <p className="unit-section-subtitle">{unit.subtitle}</p>
                          {/* Inline Mini Checkpoint Dots */}
                          <div className="unit-cp-dots" aria-hidden="true">
                            {unit.modules.map((m) => (
                              <span
                                key={m.id}
                                className={`cp-dot-mini ${
                                  completedModules.includes(m.id) ? 'done' : unit.isUnlocked ? 'open' : ''
                                }`}
                              />
                            ))}
                          </div>
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

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}
                        >
                          <CheckpointRoadmap
                            unit={unit}
                            unitIdx={unitIdx}
                            completedModules={completedModules}
                            onOpenModule={handleOpenModule}
                            getModuleIcon={getModuleIcon}
                            moduleTypeLabel={moduleTypeLabel}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* VIEW B0: VIDEO BELAJAR */}
        {activeNav === 'video' && (
          <div className="duo-subview-wrap">
            <VideoLearningSection defaultLangId={selectedLangId} />
          </div>
        )}

        {/* VIEW B: ALGORITHM VISUALIZER */}
        {activeNav === 'visualizer' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2>Visualizer Algoritma Realtime</h2>
              <p>Simulasi 60 FPS untuk {currentLang.name}.</p>
            </div>
            <AlgorithmVisualizer onSimulate={handleVisualizerRun} />
          </div>
        )}

        {/* VIEW C: REAL CODE PLAYGROUND */}
        {activeNav === 'playground' && (
          <CodePlayground selectedLangId={selectedLangId} onCodeRun={handlePlaygroundRun} />
        )}

        {/* VIEW D: ALL LANGUAGES CATALOG */}
        {activeNav === 'bahasa' && (
          <div className="duo-subview-wrap">
            <button
              type="button"
              className="btn-subview-back"
              onClick={() => goNav(prevNav && prevNav !== 'bahasa' ? prevNav : 'belajar')}
            >
              <LuArrowLeft size={16} />
              <span>Kembali</span>
            </button>
            <div className="subview-header">
              <h2>Katalog Bahasa Pemrograman</h2>
              <p>Dari Assembly bare-metal hingga Brainfuck esoterik.</p>
            </div>
            <div className="languages-cards-grid">
              {programmingLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className={`duo-lang-card ${selectedLangId === lang.id ? 'active' : ''}`}
                  style={{ '--lang-accent': lang.color }}
                  onClick={() => handleSwitchLang(lang.id)}
                >
                  <div className="duo-lang-top">
                    <span
                      className="lang-tag-pill"
                      style={{ color: lang.color, borderColor: `${lang.color}55` }}
                      title={lang.tierLabel}
                    >
                      {lang.tierLabel}
                    </span>
                    <span className="lang-diff-badge">
                      <LuStar size={11} className="lang-diff-star" /> {lang.difficulty}/5
                    </span>
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

        {/* VIEW E: REAL-TIME LEADERBOARD */}
        {activeNav === 'papan-skor' && (
          <RealtimeLeaderboard
            currentUser={user}
            currentXP={xp}
            currentLangName={currentLang.name}
            isGuest={isGuest}
          />
        )}

        {/* VIEW F: CHECKPOINT MISSIONS & XP STORE */}
        {activeNav === 'misi' && (
          <CheckpointMissions
            key={missionsSubTab}
            xp={xp}
            visualizerRuns={dailyStats.visualizerRuns}
            playgroundRuns={dailyStats.playgroundRuns}
            lessonsCompletedToday={dailyStats.lessonsCompletedToday}
            completedModulesCount={completedModules.length}
            claimedMap={dailyStats.claimed}
            onClaimReward={handleClaimMissionReward}
            onNavigateTab={goNav}
            initialSubTab={missionsSubTab}
            userName={user?.displayName || (isGuest ? 'Tamu (Guest)' : 'Koder')}
            langName={currentLang.name}
            onRewardsUpdated={setRewardState}
          />
        )}

        {/* VIEW G: AKUN */}
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
              <button className="account-menu-item" onClick={() => goNav('video')}>
                <LuMonitorPlay size={18} /><span>Video Belajar YouTube</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => goNav('bahasa')}>
                <LuStore size={18} /><span>Katalog Semua Bahasa</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => { setShowTheoryGuide(true); playSoundCue('click') }}>
                <LuBookOpen size={18} /><span>Buku Panduan</span><LuArrowRight size={16} />
              </button>
              <button className="account-menu-item" onClick={() => navigate('/')}>
                <span>Kembali ke Beranda</span><LuArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ===== RIGHT PANEL (hidden on visualizer & playground) ===== */}
      {activeNav !== 'visualizer' && activeNav !== 'playground' && activeNav !== 'video' && (
        <aside className="duo-right-panel">
          <div className="right-top-stats">
            <button
              ref={desktopLangBtnRef}
              className="stat-btn lang-badge-btn"
              onClick={() => {
                if (showLangSpotlight) {
                  dismissLangSpotlight(true)
                  return
                }
                setShowLangPicker(true)
                playSoundCue('click')
              }}
              aria-label="Ganti Bahasa Pemrograman"
              title="Ganti Bahasa Pemrograman"
            >
              <span className="flag-icon"><LuCode size={18} /></span>
              <span className="lang-code-short">{getLangShortCode(selectedLangId)}</span>
              <LuChevronDown size={13} className="lang-chevron" />
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
                <CharacterAvatar size={70} emotion="happy" animated={true} interactive={true} />
              </div>
            </div>
            <h3 className="super-title">Lab Logika &amp; Algoritma</h3>
            <p className="super-desc">
              Uji pemahaman komputasi dengan simulasi algoritma tingkat lanjut 60 FPS dan raih lencana eksklusif!
            </p>
            <button className="btn-super-cta" onClick={() => { goNav('visualizer'); playSoundCue('success') }}>
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

          {/* Misi Checkpoint Mini */}
          <div className="right-card quests-card">
            <div className="card-top-row">
              <h4>Misi Checkpoint</h4>
              <button className="link-sub" onClick={() => goNav('misi')}>LIHAT SEMUA</button>
            </div>
            <div className="quest-mini-row">
              <div className="quest-bolt-icon"><LuZap size={18} /></div>
              <div className="quest-mini-progress">
                <div className="quest-mini-title">Raih 30 XP Hari Ini</div>
                <div className="mini-bar"><div className="mini-fill" style={{ width: `${Math.min(100, (xp / 30) * 100)}%` }} /></div>
                <small>{Math.min(xp, 30)} / 30 XP</small>
              </div>
            </div>
          </div>

          {user && renderAccountCard()}
        </aside>
      )}

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="duo-mobile-bottom-nav">
        <button className={`m-nav-item ${activeNav === 'belajar' ? 'active' : ''}`} onClick={() => goNav('belajar')}>
          <LuHouse size={21} /><span>Belajar</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'video' ? 'active' : ''}`} onClick={() => goNav('video')}>
          <LuMonitorPlay size={21} /><span>Video</span>
        </button>
        <button className={`m-nav-item ${activeNav === 'visualizer' ? 'active' : ''}`} onClick={() => goNav('visualizer')}>
          <LuChartColumn size={21} /><span>Visual</span>
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
                  : 'Selesaikan 1 checkpoint hari ini untuk memperpanjang streak!'}
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
                <small>Terakhir aktif: <strong>{streakData.lastActiveDate || '-'}</strong></small>
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
              initial={{ scale: 0.94, opacity: 0, y: -12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: -12 }}
            >
              <div className="picker-header">
                <h3>Pilih Bahasa Pemrograman</h3>
                <button className="modal-close" onClick={() => setShowLangPicker(false)}>
                  <LuX size={20} />
                </button>
              </div>
              <p className="picker-subtitle">Ganti kursus aktif — dari Low-Level hingga Tersulit!</p>
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

      {/* ===== MODAL: CYBER-STUDIO CHECKPOINT CLASSROOM ===== */}
      <AnimatePresence>
        {activeQuizNode && (
          <InteractiveLessonPack
            unitId={activeQuizNode}
            unitTitle={activeModuleData?.unit?.title}
            moduleId={activeModuleData?.module?.id}
            moduleTitle={activeModuleData?.module?.title}
            moduleDesc={activeModuleData?.module?.desc}
            moduleType={activeModuleData?.module?.type}
            langId={selectedLangId}
            langName={currentLang.name}
            onClose={() => setActiveQuizNode(null)}
            onOpenVisualizer={() => {
              setActiveQuizNode(null)
              goNav('visualizer')
            }}
            onComplete={async (xpMult = 1) => {
              const modXP = (activeModuleData?.module?.xpReward || 30) * (Number(xpMult) || 1)
              await handleCompleteModule(modXP)
              if (user && activeModuleData?.module?.id) {
                const newCompleted = Array.from(
                  new Set([...(userData?.completedModules || []), activeModuleData.module.id])
                )
                await updateUserData({ completedModules: newCompleted })
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* ===== SPOTLIGHT COACHMARK: GANTI BAHASA ===== */}
      {showLangSpotlight &&
        spotlightRect &&
        activeNav === 'belajar' &&
        !activeQuizNode &&
        !showTheoryGuide &&
        !showLangPicker &&
        !showStreakModal &&
        (() => {
          const vw = typeof window !== 'undefined' ? window.innerWidth : 1280
          const cardWidth = Math.min(312, vw - 24)
          const centerX = spotlightRect.left + spotlightRect.width / 2
          const cardLeft = Math.max(12, Math.min(vw - cardWidth - 12, centerX - cardWidth / 2))
          const arrowLeft = Math.max(18, Math.min(cardWidth - 18, centerX - cardLeft))
          const cardTop = spotlightRect.bottom + 18

          return (
            <div className="lang-spotlight-layer" role="dialog" aria-modal="true" aria-labelledby="spotlight-lang-title">
              <div className="lang-spotlight-backdrop" onClick={() => dismissLangSpotlight(false)} />

              <button
                type="button"
                className="lang-spotlight-ring"
                style={{
                  left: spotlightRect.left - 6,
                  top: spotlightRect.top - 6,
                  width: spotlightRect.width + 12,
                  height: spotlightRect.height + 12,
                }}
                onClick={() => dismissLangSpotlight(true)}
                aria-label="Ketuk untuk ganti bahasa pemrograman"
              />

              <div
                className="lang-spotlight-card"
                style={{ left: cardLeft, top: cardTop, width: cardWidth }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="lang-spotlight-arrow" style={{ left: arrowLeft }} aria-hidden="true" />
                <div className="lang-spotlight-tag">
                  <LuSparkles size={12} /> GANTI BAHASA
                </div>
                <h4 id="spotlight-lang-title">Pilih Bahasa Belajarmu di Sini!</h4>
                <p>
                  Ketuk tombol ini kapan saja untuk berpindah antara 17 bahasa pemrograman (Python, HTML/CSS, SQL, PHP, C#, Kotlin, C, Rust, dll).
                </p>
                <div className="lang-spotlight-actions">
                  <button
                    type="button"
                    className="btn-spotlight-primary"
                    onClick={() => dismissLangSpotlight(true)}
                  >
                    Pilih Bahasa Sekarang
                  </button>
                  <button
                    type="button"
                    className="btn-spotlight-ghost"
                    onClick={() => dismissLangSpotlight(false)}
                  >
                    Mengerti
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
    </div>
  )
}

function getModuleIcon(type) {
  if (type === 'quiz') return <LuSearch size={18} />
  if (type === 'simulator') return <LuChartColumn size={18} />
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

export default LearnHub
