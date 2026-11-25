import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
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
  LuDelete,
  LuRefreshCw,
  LuTerminal,
  LuArrowRight,
  LuFlag,
  LuLightbulb,
  LuClock,
  LuChartColumn,
  LuMusic,
  LuVolumeX,
} from 'react-icons/lu'
import CharacterAvatar from './CharacterAvatar'
import { playSoundCue } from './AccessibilityToolbar'
import { generateRandomLessonPack } from '../data/questionBank'
import {
  isFocusBgmEnabled,
  setFocusBgmEnabled,
  startFocusBgm,
  stopFocusBgm,
  setFocusBgmDucked,
  getFocusBgmVolume,
  setFocusBgmVolume,
} from '../utils/focusBgm'
import { consumeSessionPowerups } from '../utils/xpRewards'
import './InteractiveLessonPack.css'

const HINT_STORAGE_KEY = 'kinetix_hint_state'
const MAX_HINT_TOKENS = 3
const HINT_RECHARGE_COOLDOWN_MS = 60_000
const PASSING_GRADE = 55
const MAX_HEARTS = 3
const QUESTIONS_PER_PACK = 6

const loadHintState = () => {
  const fallback = { tokens: MAX_HINT_TOKENS, cooldownUntil: 0 }
  try {
    const raw = localStorage.getItem(HINT_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    const tokens = Math.max(0, Math.min(MAX_HINT_TOKENS, Number(parsed.tokens ?? MAX_HINT_TOKENS)))
    const cooldownUntil = Number(parsed.cooldownUntil || 0)

    // Cooldown only applies after all 3 tokens are exhausted; once finished, refill all 3
    if (tokens <= 0) {
      if (!cooldownUntil || Date.now() >= cooldownUntil) {
        return { tokens: MAX_HINT_TOKENS, cooldownUntil: 0 }
      }
      return { tokens: 0, cooldownUntil }
    }

    return { tokens, cooldownUntil: 0 }
  } catch {
    return fallback
  }
}

const formatTimer = (sec) => {
  const s = Math.max(0, Math.ceil(sec))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${String(rem).padStart(2, '0')}`
}

export default function InteractiveLessonPack({
  unitId,
  unitTitle = 'Fondasi Logika & Algoritma',
  moduleId,
  moduleTitle,
  moduleDesc,
  moduleType,
  langId = 'python',
  langName = 'Python',
  onClose,
  onComplete,
  onOpenVisualizer,
}) {
  const [sessionId, setSessionId] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingTip, setLoadingTip] = useState(
    'Menyiapkan checkpoint acak dan modul kode interaktif...'
  )

  const questions = useMemo(
    () =>
      generateRandomLessonPack(langId, QUESTIONS_PER_PACK, {
        moduleId,
        moduleTitle,
        moduleDesc,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [langId, unitId, moduleId, sessionId]
  )

  const [sessionPowerups] = useState(() => consumeSessionPowerups())
  const startingHearts = MAX_HEARTS + (sessionPowerups.extraHeartActive ? 1 : 0)
  const xpMultiplier = sessionPowerups.xpBoostActive ? 2 : 1

  const [qIndex, setQIndex] = useState(0)
  const [hearts, setHearts] = useState(startingHearts)
  const [failedReason, setFailedReason] = useState(null) // null | 'hearts'
  const isAdvancingRef = useRef(false)
  const [combo, setCombo] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [earnedXP, setEarnedXP] = useState(0)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [isFinished, setIsFinished] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [bgmEnabled, setBgmEnabled] = useState(() => isFocusBgmEnabled())
  const [bgmVolume, setBgmVolume] = useState(() => getFocusBgmVolume())

  // Word bank & choice state
  const [selectedChips, setSelectedChips] = useState([])
  const [availableChips, setAvailableChips] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  // Hint token & cooldown state
  const [hintState, setHintState] = useState(() => loadHintState())
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [activeHintText, setActiveHintText] = useState(null)
  const [eliminatedOptions, setEliminatedOptions] = useState([])
  const [hintedChipId, setHintedChipId] = useState(null)
  const [hintLockNotice, setHintLockNotice] = useState('')
  const [bonusTokenAwarded, setBonusTokenAwarded] = useState(false)

  // Pointer timestamp guards for frame-0 response without double audio on click
  const lastOptionPointerTs = useRef(0)
  const lastChipPointerTs = useRef(0)

  const currentQ = questions[qIndex] || questions[0]

  // Ambient focus BGM lifecycle during quiz session
  useEffect(() => {
    if (bgmEnabled) {
      startFocusBgm()
    } else {
      stopFocusBgm()
    }
    return () => {
      stopFocusBgm()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [bgmEnabled])

  const handleToggleBgm = () => {
    const next = !bgmEnabled
    setBgmEnabled(next)
    setFocusBgmEnabled(next)
    playSoundCue('toggle')
  }

  const handleChangeBgmVolume = (nextVol) => {
    const applied = setFocusBgmVolume(nextVol)
    setBgmVolume(applied)
    if (!bgmEnabled) {
      setBgmEnabled(true)
      setFocusBgmEnabled(true)
    }
  }

  // Persist hint state
  useEffect(() => {
    try {
      localStorage.setItem(HINT_STORAGE_KEY, JSON.stringify(hintState))
    } catch {
      // Ignore storage quota errors
    }
  }, [hintState])

  // Live countdown ticker only when all 3 tokens are spent and recharge cooldown is running
  useEffect(() => {
    if (hintState.tokens > 0 || hintState.cooldownUntil <= 0) return undefined

    const id = setInterval(() => {
      const t = Date.now()
      setNowMs(t)
      if (t >= hintState.cooldownUntil) {
        setHintState({ tokens: MAX_HINT_TOKENS, cooldownUntil: 0 })
      }
    }, 400)

    return () => clearInterval(id)
  }, [hintState.cooldownUntil, hintState.tokens])

  const cooldownLeftSec =
    hintState.tokens <= 0 && hintState.cooldownUntil > nowMs
      ? Math.max(0, Math.ceil((hintState.cooldownUntil - nowMs) / 1000))
      : 0

  // Snappy loading transition (160ms)
  useEffect(() => {
    const tips = [
      'Menyusun checkpoint acak dari bank soal Kinetix Code...',
      'Tips: Dalam Bubble Sort, elemen terbesar mengapung ke kanan tiap putaran.',
      'Tips: Pointer pada C menyimpan alamat memori RAM fisik, bukan nilainya.',
      'Tips: Jawab beruntun dengan benar untuk bonus Combo XP & Token Hint!',
    ]
    setLoadingTip(tips[Math.floor(Math.random() * tips.length)])
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 160)
    return () => clearTimeout(timer)
  }, [unitId, langId, sessionId])

  // Reset pools & question-level hints whenever question changes
  useEffect(() => {
    if (currentQ?.type === 'word_bank') {
      setAvailableChips(currentQ.shuffledChips || [])
    } else {
      setAvailableChips([])
    }
    setSelectedChips([])
    setSelectedOption(null)
    setFeedback(null)
    setActiveHintText(null)
    setEliminatedOptions([])
    setHintedChipId(null)
    setHintLockNotice('')
    isAdvancingRef.current = false
    setFocusBgmDucked(false)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [qIndex, sessionId, currentQ])

  const selectChoiceInstant = useCallback(
    (oIdx) => {
      if (feedback !== null || eliminatedOptions.includes(oIdx)) return
      setSelectedOption(oIdx)
      playSoundCue('select')
    },
    [feedback, eliminatedOptions]
  )

  const handleChipPlace = useCallback(
    (chip) => {
      if (feedback !== null) return
      playSoundCue('chip')
      setAvailableChips((prev) => prev.filter((c) => c.id !== chip.id))
      setSelectedChips((prev) => [...prev, chip])
      if (hintedChipId === chip.id) setHintedChipId(null)
    },
    [feedback, hintedChipId]
  )

  const handleReturnChip = useCallback(
    (chip) => {
      if (feedback !== null) return
      playSoundCue('unpop')
      setSelectedChips((prev) => prev.filter((c) => c.id !== chip.id))
      setAvailableChips((prev) => [...prev, chip])
    },
    [feedback]
  )

  const handleUndoChip = () => {
    if (feedback !== null || selectedChips.length === 0) return
    handleReturnChip(selectedChips[selectedChips.length - 1])
  }

  const handleResetChips = () => {
    if (feedback !== null || !currentQ?.shuffledChips) return
    playSoundCue('click')
    setSelectedChips([])
    setAvailableChips(currentQ.shuffledChips)
  }

  const handleUseHint = () => {
    if (feedback !== null || !currentQ || activeHintText !== null) return

    if (hintState.tokens <= 0) {
      playSoundCue('locked')
      setHintLockNotice(
        `Semua 3 Token Hint sudah terpakai! Cooldown isi ulang penuh ${cooldownLeftSec} detik lagi.`
      )
      return
    }

    setHintLockNotice('')
    const t = Date.now()
    setNowMs(t)
    setHintState((prev) => {
      const nextTokens = Math.max(0, prev.tokens - 1)
      // Cooldown triggers ONLY when all 3 tokens are exhausted (0 left)
      return {
        tokens: nextTokens,
        cooldownUntil: nextTokens === 0 ? t + HINT_RECHARGE_COOLDOWN_MS : 0,
      }
    })
    playSoundCue('hint')

    if (currentQ.type === 'word_bank') {
      const targetSeq = currentQ.targetSequence || []
      let targetIdx = selectedChips.length
      for (let i = 0; i < selectedChips.length; i += 1) {
        if (selectedChips[i]?.text !== targetSeq[i]) {
          targetIdx = i
          break
        }
      }
      const nextExpected = targetSeq[Math.min(targetIdx, Math.max(0, targetSeq.length - 1))] || targetSeq[0]
      const matchingAvail = availableChips.find((c) => c.text === nextExpected)
      setHintedChipId(matchingAvail ? matchingAvail.id : null)
      setActiveHintText(
        matchingAvail
          ? `Petunjuk: Pilih potongan "${nextExpected}" untuk posisi #${targetIdx + 1} (total ${targetSeq.length} potongan).`
          : `Petunjuk: Susunan butuh ${targetSeq.length} potongan. Periksa urutan di posisi #${targetIdx + 1} ("${nextExpected}").`
      )
    } else {
      const wrongIndices = (currentQ.options || [])
        .map((_, idx) => idx)
        .filter((idx) => idx !== currentQ.correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)

      setEliminatedOptions(wrongIndices)
      if (wrongIndices.includes(selectedOption)) {
        setSelectedOption(null)
      }
      const clue = currentQ.speechText || currentQ.explanation || 'Analisis kembali pola logika soal.'
      setActiveHintText(`50/50 Aktif (2 opsi salah dieliminasi): ${clue}`)
    }
  }

  const speakText = (e, text) => {
    e.stopPropagation()
    playSoundCue('click')
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 1.05
      utterance.onstart = () => {
        setIsSpeaking(true)
        setFocusBgmDucked(true)
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setFocusBgmDucked(false)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setFocusBgmDucked(false)
      }
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCheck = useCallback(() => {
    if (feedback !== null || !currentQ) return

    let isCorrect = false
    if (currentQ.type === 'word_bank') {
      const normalize = (tokens) =>
        tokens
          .join(' ')
          .replace(/\s+/g, ' ')
          .replace(/\s*([(),;:])\s*/g, '$1')
          .trim()
      const userAnswer = normalize(selectedChips.map((c) => c.text))
      const validSequences = [currentQ.targetSequence, ...(currentQ.altSequences || [])]
      isCorrect = validSequences.some((seq) => Array.isArray(seq) && normalize(seq) === userAnswer)
    } else {
      isCorrect = selectedOption === currentQ.correctAnswer
    }

    if (isCorrect) {
      const nextCombo = combo + 1
      const gain = 10 + Math.min(nextCombo - 1, 4) * 3
      setCombo(nextCombo)
      setCorrectCount((c) => c + 1)
      setEarnedXP((x) => x + gain)
      setFeedback('correct')
      playSoundCue('success')
    } else {
      setCombo(0)
      setHearts((prev) => Math.max(0, prev - 1))
      setFeedback('wrong')
      playSoundCue('wrong')
    }
  }, [feedback, currentQ, selectedChips, selectedOption, combo])

  const handleNext = useCallback(() => {
    if (isAdvancingRef.current) return
    isAdvancingRef.current = true

    // Game over: all hearts are gone
    if (hearts <= 0) {
      setFailedReason('hearts')
      setIsFinished(true)
      playSoundCue('wrong')
      return
    }

    if (qIndex < questions.length - 1) {
      playSoundCue('click')
      setQIndex((prev) => Math.min(prev + 1, questions.length - 1))
    } else {
      const finalAccuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100)
      const isPassed = finalAccuracy >= PASSING_GRADE

      if (isPassed) {
        if (finalAccuracy >= 80 && hintState.tokens < MAX_HINT_TOKENS) {
          setBonusTokenAwarded(true)
          setHintState((prev) => ({
            tokens: Math.min(MAX_HINT_TOKENS, prev.tokens + 1),
            cooldownUntil: 0,
          }))
        }
        setIsFinished(true)
        playSoundCue('fanfare')
        onComplete?.(xpMultiplier)
      } else {
        setIsFinished(true)
        playSoundCue('wrong')
      }
    }
  }, [qIndex, questions.length, correctCount, hearts, hintState.tokens, onComplete, xpMultiplier])

  const handleSkip = () => {
    playSoundCue('click')
    setCombo(0)
    handleNext()
  }

  const handleRestartRandomPack = () => {
    playSoundCue('click')
    isAdvancingRef.current = false
    setFailedReason(null)
    setQIndex(0)
    setHearts(MAX_HEARTS)
    setCombo(0)
    setCorrectCount(0)
    setEarnedXP(0)
    setFeedback(null)
    setIsFinished(false)
    setBonusTokenAwarded(false)
    setSessionId((s) => s + 1)
  }

  // Keyboard shortcuts (1-4 instant select, Enter check/next)
  useEffect(() => {
    if (isLoading || isFinished) return undefined
    const onKey = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      if (feedback === null && currentQ?.type !== 'word_bank' && ['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1
        if (idx < (currentQ?.options?.length || 0)) {
          e.preventDefault()
          selectChoiceInstant(idx)
        }
      } else if (e.key === 'Enter') {
        if (feedback !== null) {
          e.preventDefault()
          handleNext()
        } else {
          const ready =
            currentQ?.type === 'word_bank' ? selectedChips.length > 0 : selectedOption !== null
          if (ready) {
            e.preventDefault()
            handleCheck()
          }
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    isLoading,
    isFinished,
    feedback,
    currentQ,
    selectedChips.length,
    selectedOption,
    selectChoiceInstant,
    handleCheck,
    handleNext,
  ])

  const getQuestionTypeTag = (type) => {
    if (type === 'word_bank') return 'SUSUN SINTAKS'
    if (type === 'output') return 'TEBAK OUTPUT'
    return 'ANALISIS LOGIKA'
  }

  // 1. Snappy Loading Screen
  if (isLoading) {
    return (
      <div className="lesson-pack-overlay">
        <div className="lesson-loading-view">
          <div className="loading-mascot-wrap">
            <CharacterAvatar size={116} emotion="thinking" animated={true} interactive={false} />
            <div className="music-note-icon">
              <LuSparkles size={20} className="icon-indigo" />
            </div>
          </div>

          <h3 className="loading-title">MENYIAPKAN CHECKPOINT ACAK...</h3>
          <p className="loading-quote">"{loadingTip}"</p>
        </div>
      </div>
    )
  }

  // 2. Result Screen (With Passing Grade 55%)
  if (isFinished) {
    const accuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100)
    const outOfHearts = failedReason === 'hearts' || hearts <= 0
    const isPassed = !outOfHearts && accuracy >= PASSING_GRADE
    const minCorrectNeeded = Math.ceil((PASSING_GRADE / 100) * questions.length)

    return (
      <div className="lesson-pack-overlay">
        <div className="lesson-finish-wrap">
          <motion.div
            className={`lesson-finish-card ${isPassed ? 'is-passed' : 'is-failed'}`}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="finish-avatar">
              <CharacterAvatar
                size={126}
                emotion={isPassed ? 'celebrating' : 'oops'}
                animated={true}
                showTooltip={true}
              />
            </div>
            <span className={`finish-badge-pill ${isPassed ? 'is-passed' : 'is-failed'}`}>
              {isPassed ? <LuFlag size={13} /> : <LuX size={13} strokeWidth={3} />}
              {isPassed
                ? `LULUS • PASSING GRADE ${PASSING_GRADE}%`
                : outOfHearts
                ? `NYAWA HABIS • 0/${MAX_HEARTS} NYAWA`
                : `BELUM LULUS • MIN. ${PASSING_GRADE}%`}
            </span>
            <h2>
              {isPassed
                ? `Misi ${langName} Ditaklukkan!`
                : outOfHearts
                ? 'Nyawa Praktikum Habis!'
                : 'Belum Memenuhi Passing Grade'}
            </h2>
            <p>
              {isPassed
                ? `Selamat! Kamu mencapai ${accuracy}% (di atas batas ${PASSING_GRADE}%)${
                    bonusTokenAwarded ? ' (+1 Token Hint bonus!)' : '.'
                  }`
                : outOfHearts
                ? `Ketiga nyawamu habis sebelum checkpoint selesai (${correctCount}/${questions.length} benar). Pelajari penjelasannya lalu coba lagi dengan soal acak baru.`
                : `Akurasimu ${accuracy}% (${correctCount}/${questions.length} benar). Butuh minimal ${PASSING_GRADE}% (min. ${minCorrectNeeded} dari ${questions.length} benar) agar lulus dan membuka checkpoint berikutnya.`}
            </p>

            <div className="finish-stats-row">
              <div className="finish-stat-box">
                <LuZap size={22} className="icon-orange" />
                <strong className={isPassed ? '' : 'stat-val-fail'}>
                  {isPassed ? `+${Math.max(25, earnedXP)} XP` : '+0 XP'}
                </strong>
                <span>Skor Sesi</span>
              </div>
              <div className="finish-stat-box">
                <LuTrophy size={22} className={isPassed ? 'icon-indigo' : 'stat-val-fail'} />
                <strong className={isPassed ? '' : 'stat-val-fail'}>{accuracy}%</strong>
                <span>Akurasi</span>
              </div>
              <div className="finish-stat-box">
                <LuFlame size={22} className={isPassed ? 'icon-emerald' : 'icon-red'} />
                <strong>{correctCount}/{questions.length}</strong>
                <span>Benar</span>
              </div>
            </div>

            <div className="finish-actions-col">
              {isPassed ? (
                <>
                  <button className="btn-studio-secondary" onClick={handleRestartRandomPack}>
                    <LuRefreshCw size={16} /> Latihan Acak Baru
                  </button>
                  {moduleType === 'simulator' && onOpenVisualizer && (
                    <button className="btn-studio-secondary" onClick={onOpenVisualizer}>
                      <LuChartColumn size={16} /> Buka Lab Visualizer
                    </button>
                  )}
                  <button className="btn-studio-primary finish-cta-btn" onClick={onClose}>
                    Kembali ke Peta Belajar <LuArrowRight size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-studio-primary finish-cta-btn" onClick={handleRestartRandomPack}>
                    <LuRefreshCw size={16} />{' '}
                    {outOfHearts ? 'Isi Ulang Nyawa & Coba Lagi' : 'Coba Lagi (Soal Acak Baru)'}
                  </button>
                  <button className="btn-studio-secondary" onClick={onClose}>
                    Kembali ke Peta Belajar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!currentQ) {
    return (
      <div className="lesson-pack-overlay">
        <div className="lesson-finish-wrap">
          <div className="lesson-finish-card is-failed">
            <h2>Soal belum siap</h2>
            <p>Bank soal untuk checkpoint ini gagal dimuat. Coba muat ulang soal acak.</p>
            <div className="finish-actions-col" style={{ marginTop: '1.25rem' }}>
              <button className="btn-studio-primary" onClick={handleRestartRandomPack}>
                <LuRefreshCw size={16} /> Muat Ulang Soal
              </button>
              <button className="btn-studio-secondary" onClick={onClose}>
                Kembali ke Peta Belajar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isPeriksaDisabled =
    currentQ.type === 'word_bank' ? selectedChips.length === 0 : selectedOption === null

  const avatarEmotion =
    feedback === 'correct'
      ? 'celebrating'
      : feedback === 'wrong'
      ? 'oops'
      : isSpeaking
      ? 'speaking'
      : 'thinking'

  const cooldownPct =
    cooldownLeftSec > 0
      ? Math.min(100, Math.round((cooldownLeftSec / (HINT_RECHARGE_COOLDOWN_MS / 1000)) * 100))
      : 0

  return (
    <div className="lesson-pack-overlay">
      {/* Cyber-Studio Checkpoint Topbar */}
      <header className="lesson-topbar">
        <button className="lesson-exit-btn" onClick={onClose} aria-label="Keluar Sesi">
          <LuX size={20} />
        </button>

        {/* Segmented Checkpoint Stepper */}
        <div className="checkpoint-stepper" aria-label="Progres Checkpoint">
          {questions.map((_, idx) => {
            const isDone = idx < qIndex || (idx === qIndex && feedback === 'correct')
            const isActive = idx === qIndex && feedback !== 'correct'
            return (
              <div key={idx} className="stepper-segment-wrap">
                <div
                  className={`stepper-node ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}
                >
                  {isDone ? <LuCheck size={12} strokeWidth={3} /> : idx + 1}
                </div>
                {idx < questions.length - 1 && (
                  <div className={`stepper-line ${idx < qIndex ? 'filled' : ''}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="topbar-right-pills">
          {combo >= 2 && (
            <span className="combo-pill" title="Bonus Combo Beruntun">
              <LuZap size={13} /> x{combo}
            </span>
          )}
          <div className={`bgm-control-group ${bgmEnabled ? 'is-on' : 'is-off'}`}>
            <button
              type="button"
              className={`bgm-toggle-pill ${bgmEnabled ? 'is-on' : 'is-off'}`}
              onClick={handleToggleBgm}
              title={bgmEnabled ? 'Matikan musik pengantar' : 'Nyalakan musik pengantar'}
              aria-label={bgmEnabled ? 'Matikan musik pengantar' : 'Nyalakan musik pengantar'}
            >
              {bgmEnabled ? <LuMusic size={14} /> : <LuVolumeX size={14} />}
              <span>{bgmEnabled ? 'BGM' : 'Mute'}</span>
            </button>
            {bgmEnabled && (
              <div className="bgm-vol-controls" aria-label="Atur volume musik">
                <button
                  type="button"
                  className="bgm-vol-step"
                  onClick={() => handleChangeBgmVolume(Math.max(0.1, bgmVolume - 0.15))}
                  disabled={bgmVolume <= 0.1}
                  title="Kecilkan volume musik"
                  aria-label="Kecilkan volume musik"
                >
                  −
                </button>
                <input
                  type="range"
                  className="bgm-vol-slider"
                  min={10}
                  max={100}
                  step={5}
                  value={Math.round(bgmVolume * 100)}
                  onChange={(e) => handleChangeBgmVolume(Number(e.target.value) / 100)}
                  aria-label="Volume musik pengantar"
                />
                <span className="bgm-vol-pct">{Math.round(bgmVolume * 100)}%</span>
                <button
                  type="button"
                  className="bgm-vol-step"
                  onClick={() => handleChangeBgmVolume(Math.min(1, bgmVolume + 0.15))}
                  disabled={bgmVolume >= 1}
                  title="Besarkan volume musik"
                  aria-label="Besarkan volume musik"
                >
                  +
                </button>
              </div>
            )}
          </div>
          <div className="hint-token-pill" title="Token Hint Tersisa">
            <LuLightbulb size={15} />
            <span>
              {hintState.tokens}/{MAX_HINT_TOKENS}
            </span>
          </div>
          <div className="lesson-hearts-badge">
            <LuHeart size={17} className="icon-red fill-heart" />
            <span>{hearts}</span>
          </div>
        </div>
      </header>

      {/* Main Scrollable Studio Workspace */}
      <main className="lesson-content-area">
        <div key={`${sessionId}-${qIndex}`} className="lesson-container">
          {/* Meta Header */}
          <div className="mission-meta-row">
            <span className="mission-type-pill">{getQuestionTypeTag(currentQ.type)}</span>
            <span className="mission-lang-pill">{langName}</span>
            {moduleTitle && <span className="mission-module-pill">{moduleTitle}</span>}
            {sessionPowerups.xpBoostActive && (
              <span className="mission-passing-pill">2X XP AKTIF</span>
            )}
            {sessionPowerups.extraHeartActive && (
              <span className="mission-passing-pill">PERISAI +1 NYAWA</span>
            )}
            <span className="mission-passing-pill">Min. Lulus {PASSING_GRADE}%</span>
            <span className="mission-cp-counter">
              Checkpoint {qIndex + 1} / {questions.length}
            </span>
          </div>

          <h2 className="lesson-task-heading">{currentQ.title}</h2>

          {/* Interactive 3D Companion Prompt Card */}
          <div className="character-speech-row">
            <div className="speech-avatar">
              <CharacterAvatar
                size={76}
                emotion={avatarEmotion}
                animated={true}
                interactive={true}
              />
            </div>

            <div className="studio-prompt-card">
              <p className="speech-text">{currentQ.prompt}</p>
              <button
                type="button"
                className="speech-audio-btn"
                onClick={(e) => speakText(e, currentQ.prompt)}
                title="Bacakan soal"
                aria-label="Bacakan soal dengan suara"
              >
                <LuVolume2 size={17} />
                <span>Audio</span>
              </button>
            </div>
          </div>

          {/* Optional Code Preview Card */}
          {currentQ.code && (
            <div className="lesson-code-card">
              <div className="lesson-code-header">
                <LuTerminal size={13} /> <span>Cuplikan Kode</span>
              </div>
              <pre>
                <code>{currentQ.code}</code>
              </pre>
            </div>
          )}

          {/* Hint Action Bar (3 Free Uses, Cooldown Only After All 3 Exhausted) */}
          <div className="hint-action-bar">
            <button
              type="button"
              onClick={handleUseHint}
              disabled={feedback !== null || activeHintText !== null}
              className={`btn-use-hint ${
                activeHintText
                  ? 'is-used'
                  : hintState.tokens <= 0
                  ? 'is-cooldown'
                  : 'is-ready'
              }`}
            >
              {cooldownLeftSec > 0 && !activeHintText && hintState.tokens <= 0 && (
                <span className="hint-cooldown-fill" style={{ width: `${cooldownPct}%` }} />
              )}
              <span className="btn-hint-inner">
                {activeHintText ? (
                  <>
                    <LuLightbulb size={14} /> Hint Aktif
                  </>
                ) : hintState.tokens <= 0 ? (
                  <>
                    <LuClock size={14} /> Cooldown {formatTimer(cooldownLeftSec)}
                  </>
                ) : (
                  <>
                    <LuLightbulb size={14} /> Gunakan Hint ({hintState.tokens}/{MAX_HINT_TOKENS})
                  </>
                )}
              </span>
            </button>

            <span className="hint-meta-note">
              {!activeHintText &&
                (hintState.tokens <= 0
                  ? `Semua 3 token terpakai — isi ulang penuh dalam ${formatTimer(cooldownLeftSec)}`
                  : currentQ.type === 'word_bank'
                  ? `Pakai kapan saja · cooldown 60d saat ${MAX_HINT_TOKENS} token habis`
                  : `50/50 eliminasi 2 opsi salah · cooldown 60d saat habis`)}
            </span>
          </div>

          {hintLockNotice && !activeHintText && (
            <div className="hint-lock-notice">{hintLockNotice}</div>
          )}

          {activeHintText && (
            <div className="lesson-hint-banner">
              <LuLightbulb size={16} className="hint-banner-icon" />
              <p>{activeHintText}</p>
            </div>
          )}

          {/* TYPE A: CODE TOKEN BUILDER */}
          {currentQ.type === 'word_bank' && (
            <div className="word-bank-workspace">
              <div className="builder-toolbar">
                <span className="builder-label">Susunan Kode Kamu:</span>
                <div className="builder-actions">
                  <button
                    type="button"
                    className="btn-builder-mini"
                    onClick={handleUndoChip}
                    disabled={selectedChips.length === 0 || feedback !== null}
                    title="Hapus token terakhir"
                  >
                    <LuDelete size={14} /> Hapus
                  </button>
                  <button
                    type="button"
                    className="btn-builder-mini"
                    onClick={handleResetChips}
                    disabled={selectedChips.length === 0 || feedback !== null}
                    title="Ulangi susunan"
                  >
                    <LuRotateCcw size={13} /> Reset
                  </button>
                </div>
              </div>

              <div className={`answer-line-slot ${selectedChips.length > 0 ? 'has-tokens' : ''}`}>
                {selectedChips.length === 0 ? (
                  <span className="placeholder-text">
                    Ketuk potongan kode di bawah untuk merangkai sintaks...
                  </span>
                ) : (
                  <div className="placed-chips-row">
                    {selectedChips.map((chip) => (
                      <button
                        key={chip.id}
                        type="button"
                        className="word-chip chip-placed"
                        onPointerDown={(e) => {
                          if (e.button !== 0 || feedback !== null) return
                          lastChipPointerTs.current = performance.now()
                          handleReturnChip(chip)
                        }}
                        onClick={() => {
                          if (performance.now() - lastChipPointerTs.current < 450) return
                          handleReturnChip(chip)
                        }}
                      >
                        {chip.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedChips.length > 0 && (
                <div className="assembled-preview-bar">
                  <span className="preview-prefix">$</span>
                  <code>{selectedChips.map((c) => c.text).join(' ')}</code>
                </div>
              )}

              <div className="chips-pool-grid">
                {availableChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className={`word-chip chip-available ${
                      hintedChipId === chip.id ? 'chip-hint-highlight' : ''
                    }`}
                    onPointerDown={(e) => {
                      if (e.button !== 0 || feedback !== null) return
                      lastChipPointerTs.current = performance.now()
                      handleChipPlace(chip)
                    }}
                    onClick={() => {
                      if (performance.now() - lastChipPointerTs.current < 450) return
                      handleChipPlace(chip)
                    }}
                  >
                    {chip.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TYPE B: INSTANT ZERO-DELAY CHOICE / PREDICT OUTPUT */}
          {currentQ.type !== 'word_bank' && (
            <div className="choice-options-grid">
              {(currentQ.options || []).map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx
                const isEliminated = eliminatedOptions.includes(oIdx)
                const isRightReveal = feedback !== null && oIdx === currentQ.correctAnswer
                const isWrongPick = feedback === 'wrong' && isSelected && oIdx !== currentQ.correctAnswer

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={feedback !== null || isEliminated}
                    className={`choice-opt-btn ${isSelected ? 'selected' : ''} ${
                      isEliminated ? 'opt-eliminated' : ''
                    } ${isRightReveal ? 'opt-correct' : ''} ${isWrongPick ? 'opt-wrong' : ''}`}
                    onPointerDown={(e) => {
                      if (e.button !== 0 || feedback !== null || isEliminated) return
                      lastOptionPointerTs.current = performance.now()
                      selectChoiceInstant(oIdx)
                    }}
                    onClick={() => {
                      if (performance.now() - lastOptionPointerTs.current < 450) return
                      selectChoiceInstant(oIdx)
                    }}
                  >
                    <span className="choice-num-badge">{String.fromCharCode(65 + oIdx)}</span>
                    <span className="choice-text">{opt}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Action Footer */}
      <footer className="lesson-bottom-footer">
        <div className="footer-inner-bar">
          <button type="button" className="btn-skip-lesson" onClick={handleSkip}>
            LEWATI
          </button>

          <button
            type="button"
            className={`btn-check-lesson ${isPeriksaDisabled ? 'disabled' : 'ready'}`}
            onClick={handleCheck}
            disabled={isPeriksaDisabled || feedback !== null}
          >
            PERIKSA JAWABAN
          </button>
        </div>
      </footer>

      {/* Solid Matte Feedback Drawer (Zero AI-Slop Gradients) */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-drawer ${feedback === 'correct' ? 'drawer-correct' : 'drawer-wrong'}`}
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <div className="feedback-inner">
              <div className="feedback-message">
                <div className="feedback-status-title">
                  {feedback === 'correct' ? (
                    <>
                      <div className="status-circle cyan-circle">
                        <LuCheck size={18} strokeWidth={3} />
                      </div>
                      <h3>Tepat Sekali! {combo >= 2 ? `Combo x${combo}!` : ''}</h3>
                    </>
                  ) : (
                    <>
                      <div className="status-circle rose-circle">
                        <LuX size={18} strokeWidth={3} />
                      </div>
                      <h3>Belum Tepat — Cek Penjelasannya</h3>
                    </>
                  )}
                </div>
                <p className="feedback-expl">{currentQ.explanation}</p>
                {feedback === 'wrong' && currentQ.type === 'word_bank' && currentQ.targetSequence && (
                  <p className="feedback-expl" style={{ marginTop: '0.4rem', color: '#fde68a' }}>
                    Susunan tepat: <code>{currentQ.targetSequence.join(' ')}</code>
                  </p>
                )}
              </div>

              <button
                type="button"
                className={`feedback-continue-btn ${
                  feedback === 'correct' ? 'btn-cyan-emerald' : 'btn-rose-amber'
                }`}
                onClick={handleNext}
              >
                {hearts <= 0 && feedback === 'wrong'
                  ? 'NYAWA HABIS • LIHAT HASIL →'
                  : qIndex < questions.length - 1
                  ? 'LANJUT CHECKPOINT →'
                  : 'LIHAT HASIL →'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
