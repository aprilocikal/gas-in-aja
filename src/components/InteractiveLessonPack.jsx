import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuX,
  LuHeart,
  LuVolume2,
  LuCheck,
  LuZap,
  LuSparkles,
  LuTrophy,
  LuRotateCcw,
  LuFlame,
  LuCode,
} from 'react-icons/lu'
import CharacterAvatar from './CharacterAvatar'
import { playSoundCue } from './AccessibilityToolbar'
import './InteractiveLessonPack.css'

export default function InteractiveLessonPack({
  unitId,
  unitTitle = 'Fondasi Logika & Algoritma',
  langName = 'Python',
  onClose,
  onComplete,
}) {
  // Loading state (Matches media_1795540629675_40dbe236.png)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingTip, setLoadingTip] = useState(
    'Dalam algoritma Bubble Sort, elemen berbobot terbesar akan mengapung ke ujung array pada setiap putaran.'
  )

  // Lesson questions pack
  const [qIndex, setQIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [isFinished, setIsFinished] = useState(false)

  // Interactive Question 1 (Word Bank / Code Construction)
  // User selects chips in order to form: `arr[j], arr[j+1] = arr[j+1], arr[j]`
  const [selectedChips, setSelectedChips] = useState([])
  const [availableChips, setAvailableChips] = useState([
    { id: 'c1', text: 'arr[j]' },
    { id: 'c2', text: ',' },
    { id: 'c3', text: 'arr[j+1]' },
    { id: 'c4', text: '=' },
    { id: 'c5', text: 'arr[j+1]' },
    { id: 'c6', text: ',' },
    { id: 'c7', text: 'arr[j]' },
    { id: 'c8', text: 'temp' },
    { id: 'c9', text: 'len(arr)' },
  ])

  // Interactive Question 2 & 3 (Multiple Choice / Output)
  const [selectedOption, setSelectedOption] = useState(null)

  const questions = [
    {
      type: 'word_bank',
      title: 'Susun Baris Kode Pemrograman',
      prompt: 'Bagaimana sintaks Python untuk menukar posisi dua elemen arr[j] dan arr[j+1] (SWAP)?',
      speechText: 'Susun kode penukaran dua elemen array di Python tanpa variabel sementara.',
      targetSequence: ['arr[j]', ',', 'arr[j+1]', '=', 'arr[j+1]', ',', 'arr[j]'],
      explanation: 'Python mendukung tuple unpacking: arr[j], arr[j+1] = arr[j+1], arr[j] untuk menukar posisi secara instan.',
    },
    {
      type: 'choice',
      title: 'Pilih Jawaban yang Tepat',
      prompt: 'Jika array awal adalah [54, 26, 93, 17], apa hasil setelah satu putaran penuh Bubble Sort?',
      speechText: 'Elemen manakah yang dipastikan sudah berada di posisi paling akhir?',
      code: 'arr = [54, 26, 93, 17]\n# Putaran pertama selesai',
      options: [
        '[26, 54, 17, 93] - Nilai 93 mengapung ke posisi akhir',
        '[17, 26, 54, 93] - Langsung terurut sempurna',
        '[93, 54, 26, 17] - Urutan terbalik descending',
        '[54, 26, 93, 17] - Tidak ada perubahan',
      ],
      correctAnswer: 0,
      explanation: 'Pada putaran ke-1, nilai 93 adalah elemen terbesar dan terus ditukar hingga menempati indeks terakhir [3].',
    },
    {
      type: 'choice',
      title: 'Analisis Kompleksitas Komputasi',
      prompt: 'Berapakah kompleksitas waktu algoritma Bubble Sort pada skenario terburuk (worst-case)?',
      speechText: 'Berapa banyak operasi komparasi yang dibutuhkan untuk n elemen?',
      options: [
        'O(n²) - Kuadratik karena terdapat nested loop bersarang',
        'O(n log n) - Logaritmik efisien',
        'O(1) - Waktu konstan',
        'O(n) - Waktu linear murni',
      ],
      correctAnswer: 0,
      explanation: 'Karena terdapat loop luar (n kali) dan loop dalam (n-i-1 kali), total komparasi mendekati n*(n-1)/2 atau O(n²).',
    },
  ]

  const currentQ = questions[qIndex]

  // Simulate realistic loading screen like Duolingo
  useEffect(() => {
    const tips = [
      'Tips: Dalam Bubble Sort, elemen terbesar mengapung ke ujung kanan seperti gelembung udara.',
      'Tips: Pointer pada C menyimpan alamat fisik heksadesimal RAM dari suatu variabel.',
      'Tips: Menyusun algoritma secara visual meningkatkan pemahaman logika hingga 90% lebih cepat.',
    ]
    setLoadingTip(tips[Math.floor(Math.random() * tips.length)])
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1100)
    return () => clearTimeout(timer)
  }, [unitId])

  // Word Bank Click Handlers
  const handleChipClick = (chip) => {
    playSoundCue('click')
    setAvailableChips((prev) => prev.filter((c) => c.id !== chip.id))
    setSelectedChips((prev) => [...prev, chip])
  }

  const handleReturnChip = (chip) => {
    playSoundCue('click')
    setSelectedChips((prev) => prev.filter((c) => c.id !== chip.id))
    setAvailableChips((prev) => [...prev, chip])
  }

  // Voice Speech
  const speakText = (text) => {
    playSoundCue('click')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 1.05
      window.speechSynthesis.speak(utterance)
    }
  }

  // Check Answer Handler
  const handleCheck = () => {
    if (feedback !== null) return

    let isCorrect = false
    if (currentQ.type === 'word_bank') {
      const currentAnswerStr = selectedChips.map((c) => c.text).join(' ')
      const targetStr = currentQ.targetSequence.join(' ')
      isCorrect = currentAnswerStr === targetStr
    } else {
      isCorrect = selectedOption === currentQ.correctAnswer
    }

    if (isCorrect) {
      setFeedback('correct')
      playSoundCue('success')
    } else {
      setFeedback('wrong')
      playSoundCue('click')
      setHearts((prev) => Math.max(0, prev - 1))
    }
  }

  // Next Question Handler
  const handleNext = () => {
    playSoundCue('click')
    setFeedback(null)
    setSelectedChips([])
    setSelectedOption(null)

    if (qIndex < questions.length - 1) {
      setQIndex((prev) => prev + 1)
    } else {
      setIsFinished(true)
      playSoundCue('success')
      if (onComplete) onComplete()
    }
  }

  // Skip question
  const handleSkip = () => {
    playSoundCue('click')
    handleNext()
  }

  // 1. DUOLINGO STYLE LOADING SCREEN (MATCHES media_1795540629675_40dbe236.png)
  if (isLoading) {
    return (
      <div className="lesson-pack-overlay">
        <div className="lesson-loading-view">
          <motion.div
            className="loading-mascot-wrap"
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <CharacterAvatar size={130} emotion="happy" animated={true} />
            <div className="music-note-icon">
              <LuSparkles size={22} className="icon-cyan" />
            </div>
          </motion.div>

          <h3 className="loading-title">MEMUAT KELAS...</h3>
          <p className="loading-quote">"{loadingTip}"</p>
        </div>
      </div>
    )
  }

  // 2. LESSON FINISHED CELEBRATION
  if (isFinished) {
    return (
      <div className="lesson-pack-overlay">
        <motion.div
          className="lesson-finish-card glass-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="finish-avatar">
            <CharacterAvatar size={130} emotion="happy" animated={true} />
          </div>
          <h2>KELAS SELESAI DENGAN SEMPURNA!</h2>
          <p>Kamu telah menyelesaikan seluruh tantangan di unit ini.</p>

          <div className="finish-stats-row">
            <div className="finish-stat-box">
              <LuZap size={24} className="icon-orange" />
              <strong>+30 XP</strong>
              <span>Poin Didapat</span>
            </div>
            <div className="finish-stat-box">
              <LuFlame size={24} className="icon-orange" />
              <strong>1 Hari</strong>
              <span>Streak Bertambah</span>
            </div>
            <div className="finish-stat-box">
              <LuTrophy size={24} className="icon-cyan" />
              <strong>100%</strong>
              <span>Ketuntasan Unit</span>
            </div>
          </div>

          <button className="btn btn-primary finish-cta-btn" onClick={onClose}>
            KEMBALI KE ROADMAP
          </button>
        </motion.div>
      </div>
    )
  }

  // 3. FULLSCREEN LESSON INTERFACE (MATCHES media_1795540658852_78fe5b39.png)
  const isPeriksaDisabled =
    currentQ.type === 'word_bank'
      ? selectedChips.length === 0
      : selectedOption === null

  return (
    <div className="lesson-pack-overlay">
      {/* Top Header Bar */}
      <header className="lesson-topbar">
        <button className="lesson-exit-btn" onClick={onClose} aria-label="Keluar Sesi">
          <LuX size={24} />
        </button>

        <div className="lesson-progress-track">
          <motion.div
            className="lesson-progress-fill"
            animate={{ width: `${((qIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="lesson-hearts-badge">
          <LuHeart size={22} className="icon-red fill-heart" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lesson-content-area">
        <div className="lesson-container">
          <h2 className="lesson-task-heading">{currentQ.title}</h2>

          {/* Character Speech Bubble Row */}
          <div className="character-speech-row">
            <div className="speech-avatar">
              <CharacterAvatar
                size={82}
                emotion={feedback === 'wrong' ? 'thinking' : 'happy'}
                animated={true}
              />
            </div>

            <div
              className="duo-speech-bubble"
              onClick={() => speakText(currentQ.speechText)}
              title="Klik untuk dengarkan suara soal"
            >
              <button className="speech-audio-btn">
                <LuVolume2 size={20} className="icon-cyan" />
              </button>
              <span className="speech-text">{currentQ.prompt}</span>
            </div>
          </div>

          {/* Optional Code Snippet Display */}
          {currentQ.code && (
            <div className="lesson-code-card">
              <pre>
                <code>{currentQ.code}</code>
              </pre>
            </div>
          )}

          {/* TYPE A: INTERACTIVE WORD BANK / CODE BLOCK CONSTRUCTOR */}
          {currentQ.type === 'word_bank' && (
            <div className="word-bank-workspace">
              {/* Answer Assembly Line (Where chips go) */}
              <div className="answer-line-slot">
                {selectedChips.length === 0 ? (
                  <span className="placeholder-text">Klik blok kode di bawah untuk menyusun jawaban...</span>
                ) : (
                  <div className="placed-chips-row">
                    {selectedChips.map((chip, idx) => (
                      <motion.button
                        key={`${chip.id}-${idx}`}
                        className="word-chip chip-placed"
                        onClick={() => handleReturnChip(chip)}
                        layoutId={`chip-${chip.id}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {chip.text}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Word Bank Pool */}
              <div className="chips-pool-grid">
                {availableChips.map((chip) => (
                  <motion.button
                    key={chip.id}
                    className="word-chip chip-available"
                    onClick={() => handleChipClick(chip)}
                    layoutId={`chip-${chip.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {chip.text}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* TYPE B: MULTIPLE CHOICE OPTIONS */}
          {currentQ.type === 'choice' && (
            <div className="choice-options-grid">
              {currentQ.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  className={`choice-opt-btn ${selectedOption === oIdx ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedOption(oIdx)
                    playSoundCue('click')
                  }}
                >
                  <span className="choice-num-badge">{oIdx + 1}</span>
                  <span className="choice-text">{opt}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer Action Bar */}
      <footer className="lesson-bottom-footer">
        <button className="btn-skip-lesson" onClick={handleSkip}>
          LOMPATI
        </button>

        <button
          className={`btn-check-lesson ${isPeriksaDisabled ? 'disabled' : 'ready'}`}
          onClick={handleCheck}
          disabled={isPeriksaDisabled || feedback !== null}
        >
          PERIKSA
        </button>
      </footer>

      {/* Duolingo Sliding Feedback Drawer */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-drawer ${feedback === 'correct' ? 'drawer-correct' : 'drawer-wrong'}`}
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            exit={{ y: 150 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          >
            <div className="feedback-inner">
              <div className="feedback-message">
                <div className="feedback-status-title">
                  {feedback === 'correct' ? (
                    <>
                      <div className="status-circle green-circle">
                        <LuCheck size={20} strokeWidth={3} />
                      </div>
                      <h3>Luar biasa!</h3>
                    </>
                  ) : (
                    <>
                      <div className="status-circle red-circle">
                        <LuX size={20} strokeWidth={3} />
                      </div>
                      <h3>Kurang tepat</h3>
                    </>
                  )}
                </div>
                <p className="feedback-expl">{currentQ.explanation}</p>
              </div>

              <button
                className={`feedback-continue-btn ${feedback === 'correct' ? 'btn-green' : 'btn-red'}`}
                onClick={handleNext}
              >
                LANJUTKAN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
