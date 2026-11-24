import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuHouse,
  LuHeadphones,
  LuDumbbell,
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
  LuArrowLeft,
  LuSearch,
  LuTrophy,
  LuInfo,
  LuGem,
  LuZap,
  LuVolume2,
} from 'react-icons/lu'
import { programmingLanguages } from '../data/programmingLanguages'
import CharacterAvatar from '../components/CharacterAvatar'
import AlgorithmVisualizer from '../components/AlgorithmVisualizer'
import KinetixLogo from '../components/KinetixLogo'
import TheoryGuidebook from '../components/TheoryGuidebook'
import InteractiveLessonPack from '../components/InteractiveLessonPack'
import { playSoundCue } from '../components/AccessibilityToolbar'
import {
  getStreakData,
  recordDailyActivity,
  getWeekStreakStatus,
} from '../utils/streakManager'
import './DuolingoLearn.css'

function DuolingoLearn() {
  const navigate = useNavigate()
  const [selectedLangId, setSelectedLangId] = useState('python')
  const [showLangPicker, setShowLangPicker] = useState(false)
  const [showTheoryGuide, setShowTheoryGuide] = useState(false)
  const [showStreakModal, setShowStreakModal] = useState(false)
  const [activeNav, setActiveNav] = useState('belajar')

  // Real Gamification Stats
  const [streakData, setStreakData] = useState(() => getStreakData())
  const [gems, setGems] = useState(1086)
  const [hearts, setHearts] = useState(5)
  const [xp, setXp] = useState(420)

  // Listen to streak updates across windows/components
  useEffect(() => {
    const handleStreakChange = (e) => {
      if (e.detail) setStreakData(e.detail)
    }
    window.addEventListener('streak-updated', handleStreakChange)
    return () => window.removeEventListener('streak-updated', handleStreakChange)
  }, [])

  // Quiz State
  const [activeQuizNode, setActiveQuizNode] = useState(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [quizFinished, setQuizFinished] = useState(false)

  const currentLang = programmingLanguages.find((l) => l.id === selectedLangId) || programmingLanguages[4]

  const languageQuizzes = {
    python: [
      {
        question: 'Pada iterasi Bubble Sort, jika arr[j] = 85 dan arr[j+1] = 20, aksi apa yang dilakukan Python?',
        code: `if arr[j] > arr[j + 1]:\n    # Lengkapi aksi selanjutnya!`,
        options: [
          'Abaikan dan lanjut ke iterasi berikutnya',
          'Tukar posisi (Swap): arr[j], arr[j+1] = arr[j+1], arr[j]',
          'Hapus angka 85 dari daftar array',
          'Ubah nilai arr[j] menjadi nol',
        ],
        answer: 1,
        explanation: 'Karena 85 > 20, Bubble Sort menukar posisinya (Swap) agar elemen berbobot besar mengapung ke sisi kanan array.',
      },
      {
        question: 'Berapakah nilai variabel hasil setelah pemanggilan fungsi berikut?',
        code: `def kali_dua(n):\n    return n * 2 if n > 0 else 0\n\nhasil = kali_dua(5)`,
        options: ['hasil = 5', 'hasil = 10', 'hasil = 0', 'Error sintaks'],
        answer: 1,
        explanation: 'Karena 5 > 0, ekspresi mengembalikan 5 * 2 = 10.',
      },
    ],
    c: [
      {
        question: 'Pada bahasa C, apa yang dicetak oleh kode pointer berikut?',
        code: `int a = 42;\nint *ptr = &a;\nprintf("%d", *ptr);`,
        options: [
          'Mencetak alamat memori (misal: 0x7ffee4a10)',
          'Mencetak nilai asli dari a yaitu 42',
          'Mencetak angka 0',
          'Terjadi Segmentation Fault',
        ],
        answer: 1,
        explanation: 'Operator dereferensi (*ptr) mengakses nilai aktual yang disimpan pada alamat memori yang ditunjuk, yaitu 42.',
      },
    ],
    assembly: [
      {
        question: 'Instruksi x86-64 "mov rax, 60" dan "syscall" pada Linux digunakan untuk apa?',
        code: `mov rax, 60    ; syscall number\nxor rdi, rdi   ; exit code 0\nsyscall`,
        options: [
          'Mengalokasikan memori dinamis di heap',
          'Menghentikan program secara normal (sys_exit)',
          'Membaca input dari keyboard (sys_read)',
          'Mencetak string ke konsol (sys_write)',
        ],
        answer: 1,
        explanation: 'Pada tabel syscall x86-64 Linux, nomor 60 adalah panggilan sistem sys_exit.',
      },
    ],
    brainfuck: [
      {
        question: 'Perintah "+" dan ">" pada bahasa esoterik Brainfuck melakukan operasi apa pada pita memori?',
        code: `+++>++`,
        options: [
          'Menambah nilai sel memori aktif lalu menggeser pointer sel ke kanan',
          'Mencetak karakter ASCII ke layar',
          'Memulai perulangan while',
          'Menghapus seluruh memori RAM',
        ],
        answer: 0,
        explanation: '"+" menambahkan nilai pada sel memori saat ini, sedangkan ">" menggeser pointer memori ke sel berikutnya di sebelah kanan.',
      },
    ],
  }

  const activeQuestions = languageQuizzes[selectedLangId] || languageQuizzes.python

  const handleStartNode = (nodeId) => {
    playSoundCue('click')
    setActiveQuizNode(nodeId)
    setCurrentQIndex(0)
    setSelectedOption(null)
    setFeedback(null)
    setQuizFinished(false)
  }

  const handleCheckAnswer = () => {
    if (selectedOption === null) return
    const currentQ = activeQuestions[currentQIndex] || activeQuestions[0]
    const isCorrect = selectedOption === currentQ.answer
    if (isCorrect) {
      setFeedback('correct')
      playSoundCue('success')
      setXp((prev) => prev + 20)
      setGems((prev) => prev + 5)
      // Record real daily streak activity
      const updated = recordDailyActivity()
      setStreakData(updated)
    } else {
      setFeedback('wrong')
      playSoundCue('click')
      setHearts((prev) => Math.max(0, prev - 1))
    }
  }

  const handleNextQuestion = () => {
    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1)
      setSelectedOption(null)
      setFeedback(null)
    } else {
      setQuizFinished(true)
      playSoundCue('success')
      const updated = recordDailyActivity()
      setStreakData(updated)
    }
  }

  const weekStatus = getWeekStreakStatus()

  return (
    <div className="duo-layout-root">
      {/* ===== MOBILE TOP BAR (Matches Native Duolingo Phone UI) ===== */}
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
          <span className="m-stat-num">{streakData.streak}</span>
        </button>

        <div className="m-top-btn m-gem-badge">
          <LuGem size={16} className="icon-cyan" />
          <span className="m-stat-num">{gems}</span>
        </div>

        <div className="m-top-btn m-heart-badge">
          <LuHeart size={16} className="icon-red" />
          <span className="m-stat-num">{hearts}</span>
        </div>
      </header>

      {/* ===== 1. LEFT SIDEBAR (STICKY NAVIGATION ON DESKTOP) ===== */}
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
              className={`duo-nav-item ${activeNav === 'latihan' ? 'active' : ''}`}
              onClick={() => handleStartNode(1)}
            >
              <div className="nav-icon-wrap"><LuDumbbell size={22} /></div>
              <span className="nav-label">LATIHAN</span>
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
              <div className="nav-icon-wrap"><LuInfo size={22} /></div>
              <span className="nav-label">KEMBALI KE INFORMASI</span>
            </button>
          </nav>
        </div>

        <div className="duo-sidebar-bottom">
          <div className="sidebar-companion-widget">
            <CharacterAvatar size={48} emotion="happy" animated={false} />
            <div className="companion-speech-bubble">
              <span>
                {streakData.streak === 0
                  ? 'Mulai latihan hari ini untuk raih streak pertamamu!'
                  : `Streak aktif: ${streakData.streak} Hari Berturut-turut!`}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== 2. CENTER STREAM (MAIN DUOLINGO LEARNING PATH) ===== */}
      <main className="duo-main-content">
        {/* VIEW A: BELAJAR (PATH ROADMAP) */}
        {activeNav === 'belajar' && (
          <div className="duo-path-stream">
            {/* Top Unit Banner */}
            <div className="duo-unit-banner">
              <div className="unit-banner-left">
                <span className="unit-breadcrumb">
                  <span className="unit-pill-tag">UNIT 1</span> BAGIAN 1 - {currentLang.name.toUpperCase()}
                </span>
                <h2 className="unit-banner-title">
                  {selectedLangId === 'c'
                    ? 'Manajemen Pointer & Alokasi Memori'
                    : selectedLangId === 'assembly'
                    ? 'Manipulasi Register CPU & Syscall'
                    : selectedLangId === 'brainfuck'
                    ? 'Navigasi Pita Sel Memori Turing'
                    : 'Visualisasi Algoritma & Penukaran Elemen'}
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

            <div className="unit-divider">
              <span>Alur Pembelajaran Algoritma Kinetix</span>
            </div>

            {/* KINETIX CIRCUIT QUEST PIPELINE (Replaces identical Duolingo snake path) */}
            <div className="kinetix-quest-pipeline">
              {/* Unit Card 1: Completed */}
              <div className="quest-pipeline-card quest-completed">
                <div className="quest-card-indicator">
                  <div className="quest-node-icon"><LuCheck size={20} strokeWidth={3} /></div>
                  <div className="quest-connector-line" />
                </div>
                <div className="quest-card-content">
                  <div className="quest-card-top">
                    <span className="quest-step-badge">MODUL 1</span>
                    <span className="quest-status-badge badge-green">SELESAI</span>
                  </div>
                  <h4>Fondasi Array & Struktur Data</h4>
                  <p>Inisialisasi memori indeks 0..n-1 dan pemetaan alamat.</p>
                  <button className="btn-quest-action" onClick={() => handleStartNode(1)}>
                    Ulangi Latihan
                  </button>
                </div>
              </div>

              {/* Unit Card 2: Active (Current Challenge) */}
              <div className="quest-pipeline-card quest-active">
                <div className="quest-card-indicator">
                  <div className="quest-node-icon pulse-active"><LuStar size={20} /></div>
                  <div className="quest-connector-line" />
                </div>
                <div className="quest-card-content">
                  <div className="quest-card-top">
                    <span className="quest-step-badge active-badge">MODUL 2 (AKTIF)</span>
                    <span className="quest-status-badge badge-purple">+30 XP</span>
                  </div>
                  <h4>Komparasi Pasangan & Swap Elemen</h4>
                  <p>Logika pertukaran dua variabel bertetangga secara real-time.</p>
                  <button className="btn-quest-action btn-quest-primary" onClick={() => handleStartNode(2)}>
                    <LuSparkles size={16} /> BUKA KELAS INTERAKTIF
                  </button>
                </div>
              </div>

              {/* Unit Card 3: Interactive Visualizer Checkpoint */}
              <div className="quest-pipeline-card quest-ready">
                <div className="quest-card-indicator">
                  <div className="quest-node-icon"><LuHeadphones size={20} /></div>
                  <div className="quest-connector-line" />
                </div>
                <div className="quest-card-content">
                  <div className="quest-card-top">
                    <span className="quest-step-badge">LAB 3</span>
                    <span className="quest-status-badge badge-cyan">SIMULATOR</span>
                  </div>
                  <h4>Simulasi Algoritma 60 FPS</h4>
                  <p>Uji coba visualizer Bubble Sort, Pointer C, dan Mesin Turing.</p>
                  <button className="btn-quest-action btn-quest-cyan" onClick={() => { setActiveNav('visualizer'); playSoundCue('click') }}>
                    Buka Simulator
                  </button>
                </div>
              </div>

              {/* Unit Card 4: Locked */}
              <div className="quest-pipeline-card quest-locked">
                <div className="quest-card-indicator">
                  <div className="quest-node-icon"><LuLayers size={20} /></div>
                  <div className="quest-connector-line" />
                </div>
                <div className="quest-card-content">
                  <div className="quest-card-top">
                    <span className="quest-step-badge">MODUL 4</span>
                    <span className="quest-status-badge badge-gray">TERKUNCI</span>
                  </div>
                  <h4>Manajemen Pointer & Alokasi RAM C</h4>
                  <p>Manipulasi alamat memori fisik dan dereferensi pointer.</p>
                  <button className="btn-quest-action btn-quest-locked" disabled>
                    Terkunci
                  </button>
                </div>
              </div>

              {/* Unit Card 5: Final Trophy */}
              <div className="quest-pipeline-card quest-locked">
                <div className="quest-card-indicator">
                  <div className="quest-node-icon"><LuTrophy size={20} /></div>
                </div>
                <div className="quest-card-content">
                  <div className="quest-card-top">
                    <span className="quest-step-badge">FINAL</span>
                    <span className="quest-status-badge badge-gold">TANTANGAN PRO</span>
                  </div>
                  <h4>Evaluasi Logika Komputasi</h4>
                  <p>Uji pemahaman komprehensif seluruh paradigma bahasa.</p>
                  <button className="btn-quest-action btn-quest-locked" disabled>
                    Terkunci
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW B: DIRECT ALGORITHM VISUALIZER */}
        {activeNav === 'visualizer' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2>Visualizer Algoritma & Memori Real-Time</h2>
              <p>Simulasi eksekusi instruksi {currentLang.name} 60 FPS.</p>
            </div>
            <AlgorithmVisualizer />
          </div>
        )}

        {/* VIEW C: ALL PROGRAMMING LANGUAGES CATALOG */}
        {activeNav === 'bahasa' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2>Katalog Seluruh Bahasa Pemrograman</h2>
              <p>Pilih bahasa apapun: dari level terendah Assembly hingga bahasa tersulit Brainfuck.</p>
            </div>
            <div className="languages-cards-grid">
              {programmingLanguages.map((lang) => (
                <div
                  key={lang.id}
                  className={`duo-lang-card ${selectedLangId === lang.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedLangId(lang.id)
                    setActiveNav('belajar')
                    playSoundCue('success')
                  }}
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

        {/* VIEW D: PAPAN SKOR / LEADERBOARD */}
        {activeNav === 'papan-skor' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2><LuShield size={22} className="icon-inline" /> Liga Berlian (Diamond League)</h2>
              <p>Peringkat koder teraktif minggu ini di Kinetix Code.</p>
            </div>
            <div className="leaderboard-table glass-card">
              {[
                { rank: 1, name: 'Budi Santoso', xp: 2450, lang: 'Python' },
                { rank: 2, name: 'Siti Rahma', xp: 2120, lang: 'C++' },
                { rank: 3, name: 'Devan Putra', xp: 1890, lang: 'Rust' },
                { rank: 4, name: 'Kamu (Aktif)', xp: 1465, lang: currentLang.name, isUser: true },
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

        {/* VIEW E: MISI HARIAN */}
        {activeNav === 'misi' && (
          <div className="duo-subview-wrap">
            <div className="subview-header">
              <h2><LuScroll size={22} className="icon-inline" /> Misi Harian Belajar</h2>
              <p>Selesaikan misi untuk mendapatkan bonus XP dan menjaga streak!</p>
            </div>
            <div className="quests-list">
              <div className="quest-card glass-card">
                <div className="quest-icon"><LuZap size={22} /></div>
                <div className="quest-info">
                  <strong>Dapatkan 20 XP</strong>
                  <div className="quest-bar"><div className="quest-fill" style={{ width: '75%' }} /></div>
                  <small>15 / 20 XP</small>
                </div>
              </div>
              <div className="quest-card glass-card">
                <div className="quest-icon"><LuStar size={22} /></div>
                <div className="quest-info">
                  <strong>Jalankan Visualisasi Bubble Sort 1 Kali</strong>
                  <div className="quest-bar"><div className="quest-fill" style={{ width: '100%' }} /></div>
                  <small>1 / 1 Selesai</small>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== 3. RIGHT SIDEBAR (STATS, SUPER, LEAGUE, QUESTS ON DESKTOP) ===== */}
      <aside className="duo-right-panel">
        {/* Real Stats Bar */}
        <div className="right-top-stats">
          <button
            className="stat-btn lang-badge-btn"
            onClick={() => { setShowLangPicker(true); playSoundCue('click') }}
            title="Ganti Bahasa Pemrograman"
          >
            <span className="flag-icon"><LuCode size={18} /></span>
            <span className="lang-code-short">{selectedLangId.toUpperCase().slice(0, 3)}</span>
          </button>
          
          <button
            className="stat-btn streak-btn"
            onClick={() => { setShowStreakModal(true); playSoundCue('click') }}
            title="Lihat Detail Streak Real"
          >
            <LuFlame size={20} className="icon-orange" />
            <span className="stat-value">{streakData.streak}</span>
            <div className="dot-alert" />
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

        {/* Lab & Mode Tantangan (Bukan langganan / non-subscription) */}
        <div className="right-card super-card lab-challenge-card">
          <div className="super-header">
            <span className="super-badge" style={{ background: '#7c3aed', color: '#ffffff' }}>MODE TANTANGAN</span>
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

        {/* Liga */}
        <div className="right-card league-card">
          <div className="card-top-row">
            <h4>Papan Skor</h4>
            <button className="link-sub" onClick={() => setActiveNav('papan-skor')}>KE PAPAN SKOR</button>
          </div>
          <div className="league-content">
            <div className="shield-icon-badge"><LuShield size={28} className="icon-cyan" /></div>
            <div>
              <strong>Selamat!</strong>
              <p>Kamu meraih peringkat #4 dan masuk 5 besar Liga Berlian!</p>
            </div>
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
              <div className="mini-bar"><div className="mini-fill" style={{ width: '75%' }} /></div>
              <small>15 / 20</small>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE BOTTOM NAVIGATION BAR (Duolingo App Native Style) ===== */}
      <nav className="duo-mobile-bottom-nav">
        <button
          className={`m-nav-item ${activeNav === 'belajar' ? 'active' : ''}`}
          onClick={() => { setActiveNav('belajar'); playSoundCue('click') }}
        >
          <LuHouse size={22} />
          <span>Belajar</span>
        </button>

        <button
          className={`m-nav-item ${activeNav === 'visualizer' ? 'active' : ''}`}
          onClick={() => { setActiveNav('visualizer'); playSoundCue('click') }}
        >
          <LuHeadphones size={22} />
          <span>Visual</span>
        </button>

        <button
          className={`m-nav-item ${activeNav === 'latihan' ? 'active' : ''}`}
          onClick={() => handleStartNode(1)}
        >
          <LuDumbbell size={22} />
          <span>Latihan</span>
        </button>

        <button
          className={`m-nav-item ${activeNav === 'papan-skor' ? 'active' : ''}`}
          onClick={() => { setActiveNav('papan-skor'); playSoundCue('click') }}
        >
          <LuShield size={22} />
          <span>Skor</span>
        </button>

        <button
          className={`m-nav-item ${activeNav === 'misi' ? 'active' : ''}`}
          onClick={() => { setActiveNav('misi'); playSoundCue('click') }}
        >
          <LuScroll size={22} />
          <span>Misi</span>
        </button>

        <button
          className={`m-nav-item ${activeNav === 'bahasa' ? 'active' : ''}`}
          onClick={() => { setShowLangPicker(true); playSoundCue('click') }}
        >
          <LuStore size={22} />
          <span>Bahasa</span>
        </button>
      </nav>

      {/* ===== MODAL 1: REAL STREAK CALENDAR POPUP ===== */}
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
                  <h3>Streak Real: {streakData.streak} Hari!</h3>
                </div>
                <button className="modal-close" onClick={() => setShowStreakModal(false)}>
                  <LuX size={20} />
                </button>
              </div>
              <p className="picker-subtitle">
                {streakData.hasCompletedToday
                  ? 'Keren! Kamu sudah menyelesaikan latihan hari ini. Streak kamu aman!'
                  : 'Selesaikan 1 kuis atau simulasi hari ini untuk memperpanjang streak koding kamu!'}
              </p>

              {/* 7 Days of Current Week */}
              <div className="streak-week-grid">
                {weekStatus.map((day) => (
                  <div
                    key={day.dateStr}
                    className={`streak-day-cell ${day.isCompleted ? 'completed' : ''} ${day.isToday ? 'today' : ''}`}
                  >
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

              <button
                className="btn-super-cta"
                style={{ marginTop: '1.25rem' }}
                onClick={() => {
                  setShowStreakModal(false)
                  handleStartNode(1)
                }}
              >
                LATIHAN SEKARANG UNTUK TAMBAH STREAK
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL 2: LANGUAGE PICKER ===== */}
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
              <p className="picker-subtitle">
                Ganti kursus aktif ke bahasa mana saja -- dari Low-Level hingga Tersulit!
              </p>
              <div className="picker-grid">
                {programmingLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    className={`picker-lang-item ${selectedLangId === lang.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedLangId(lang.id)
                      setShowLangPicker(false)
                      playSoundCue('success')
                    }}
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

      {/* ===== MODAL 3: BUKU PANDUAN ALA KERTAS / SHEET DENGAN HALAMAN ===== */}
      <AnimatePresence>
        {showTheoryGuide && (
          <TheoryGuidebook
            lang={currentLang}
            onClose={() => setShowTheoryGuide(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== MODAL 4: FULLSCREEN INTERACTIVE LESSON PACK (Word Bank & Mascot Loading) ===== */}
      <AnimatePresence>
        {activeQuizNode && (
          <InteractiveLessonPack
            unitId={activeQuizNode}
            langName={currentLang.name}
            onClose={() => setActiveQuizNode(null)}
            onComplete={() => {
              const updated = recordDailyActivity()
              setStreakData(updated)
              setXp((prev) => prev + 30)
              setGems((prev) => prev + 10)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default DuolingoLearn
