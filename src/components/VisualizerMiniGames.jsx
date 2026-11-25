import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  LuTarget,
  LuGamepad2,
  LuTrophy,
  LuRotateCcw,
  LuZap,
  LuCheck,
  LuTimer,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './VisualizerMiniGames.css'

const createSortedArray = () => {
  const nums = []
  let cur = Math.floor(Math.random() * 6) + 4
  for (let i = 0; i < 16; i += 1) {
    nums.push(cur)
    cur += Math.floor(Math.random() * 6) + 2
  }
  const targetIdx = Math.floor(Math.random() * nums.length)
  return { nums, target: nums[targetIdx] }
}

const createShuffledBlocks = () => {
  const base = [18, 29, 41, 56, 72, 88]
  const arr = [...base]
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Ensure it never starts already sorted
  if (arr.every((v, idx) => idx === 0 || arr[idx - 1] <= v)) {
    ;[arr[0], arr[arr.length - 1]] = [arr[arr.length - 1], arr[0]]
  }
  return { arr, sorted: base }
}

export function BinaryHuntGame({ onSimulate }) {
  const [roundData, setRoundData] = useState(() => createSortedArray())
  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(15)
  const [probes, setProbes] = useState([])
  const [won, setWon] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestScore, setBestScore] = useState(
    () => Number(localStorage.getItem('kinetix_binary_best') || 0)
  )
  const [hintMsg, setHintMsg] = useState(
    'Kotak disortir menaik. Klik kotak tengah (indeks 7 atau 8) untuk membelah pencarian O(log n)!'
  )

  const newRound = () => {
    playSoundCue('click')
    setRoundData(createSortedArray())
    setLow(0)
    setHigh(15)
    setProbes([])
    setWon(false)
    setHintMsg('Temukan angka target dengan jumlah klik sesedikit mungkin!')
  }

  const handleProbe = (idx) => {
    if (won || idx < low || idx > high || probes.some((p) => p.idx === idx)) return
    const val = roundData.nums[idx]
    const nextProbes = [...probes, { idx, val }]
    setProbes(nextProbes)
    onSimulate?.()

    if (val === roundData.target) {
      const stepsUsed = nextProbes.length
      const roundPts = Math.max(20, 120 - (stepsUsed - 1) * 20) + streak * 10
      const nextScore = score + roundPts
      setWon(true)
      setScore(nextScore)
      setStreak((s) => s + 1)
      if (nextScore > bestScore) {
        setBestScore(nextScore)
        localStorage.setItem('kinetix_binary_best', String(nextScore))
      }
      setHintMsg(`Ketemu di indeks #${idx} dalam ${stepsUsed} langkah (+${roundPts} Poin)!`)
      playSoundCue('success')
    } else if (val < roundData.target) {
      const nextLow = Math.max(low, idx + 1)
      setLow(nextLow)
      setHintMsg(`Nilai [${idx}] = ${val} terlalu KECIL -> Target ada di KANAN (#${nextLow}..#${high})`)
      playSoundCue('select')
    } else {
      const nextHigh = Math.min(high, idx - 1)
      setHigh(nextHigh)
      setHintMsg(`Nilai [${idx}] = ${val} terlalu BESAR -> Target ada di KIRI (#${low}..#${nextHigh})`)
      playSoundCue('select')
    }
  }

  return (
    <div className="mini-game-wrap">
      <div className="mg-header-row">
        <div>
          <span className="mg-eyebrow">
            <LuTarget size={13} /> MINI-GAME BINARY SEARCH
          </span>
          <h3>Tebak Binary: Buru Target RAM!</h3>
        </div>
        <div className="mg-stats-row">
          <div className="mg-stat-pill">
            <LuZap size={13} className="icon-indigo" />
            <span>Skor: <strong>{score}</strong></span>
          </div>
          <div className="mg-stat-pill">
            <LuTrophy size={13} className="icon-orange" />
            <span>Rekor: <strong>{bestScore}</strong></span>
          </div>
        </div>
      </div>

      <div className="mg-target-banner">
        <div className="mg-target-left">
          <span>Cari Angka Target:</span>
          <strong className="mg-target-num">{roundData.target}</strong>
        </div>
        <div className="mg-target-right">
          <span>Langkah: <strong>{probes.length}</strong> (Ideal &le; 4)</span>
          <button type="button" className="mg-btn-reset" onClick={newRound}>
            <LuRotateCcw size={13} /> {won ? 'Ronde Berikutnya' : 'Acak Ulang'}
          </button>
        </div>
      </div>

      <div className="binary-boxes-grid">
        {roundData.nums.map((val, idx) => {
          const probed = probes.find((p) => p.idx === idx)
          const isMatch = won && val === roundData.target
          const isEliminated = idx < low || idx > high
          const isSuggestedMid = !won && !isEliminated && idx === Math.floor((low + high) / 2)

          return (
            <button
              key={idx}
              type="button"
              disabled={won || isEliminated || Boolean(probed)}
              onClick={() => handleProbe(idx)}
              className={`bh-cell ${isMatch ? 'is-match' : ''} ${
                probed && !isMatch ? 'is-probed' : ''
              } ${isEliminated && !probed ? 'is-eliminated' : ''} ${
                isSuggestedMid ? 'is-mid-hint' : ''
              }`}
            >
              <span className="bh-idx">#{idx}</span>
              <strong className="bh-val">{probed || won ? val : '?'}</strong>
              <span className="bh-state">
                {isMatch ? 'COCOK' : probed ? (val < roundData.target ? 'Terlalu Kecil' : 'Terlalu Besar') : isEliminated ? 'Dibuang' : 'Terurut'}
              </span>
            </button>
          )
        })}
      </div>

      <div className={`mg-feedback-strip ${won ? 'is-won' : ''}`}>
        {won ? <LuCheck size={16} /> : <LuTarget size={16} />}
        <span>{hintMsg}</span>
      </div>
    </div>
  )
}

export function SortRushGame({ onSimulate }) {
  const [puzzle, setPuzzle] = useState(() => createShuffledBlocks())
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [swaps, setSwaps] = useState(0)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [bestSwaps, setBestSwaps] = useState(() => {
    const saved = localStorage.getItem('kinetix_sort_best')
    return saved ? Number(saved) : null
  })
  const timerRef = useRef(null)

  const isSolved = puzzle.arr.every((v, i) => v === puzzle.sorted[i])
  const correctSlots = puzzle.arr.filter((v, i) => v === puzzle.sorted[i]).length

  useEffect(() => {
    if (!isRunning || isSolved) {
      if (timerRef.current) clearInterval(timerRef.current)
      return undefined
    }
    timerRef.current = setInterval(() => {
      setElapsedSec((s) => s + 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, isSolved])

  const resetPuzzle = () => {
    playSoundCue('click')
    setPuzzle(createShuffledBlocks())
    setSelectedIdx(null)
    setSwaps(0)
    setElapsedSec(0)
    setIsRunning(false)
  }

  const handleBlockTap = (idx) => {
    if (isSolved) return
    if (!isRunning) setIsRunning(true)

    if (selectedIdx === null) {
      setSelectedIdx(idx)
      playSoundCue('select')
      return
    }
    if (selectedIdx === idx) {
      setSelectedIdx(null)
      playSoundCue('unpop')
      return
    }

    const nextArr = [...puzzle.arr]
    ;[nextArr[selectedIdx], nextArr[idx]] = [nextArr[idx], nextArr[selectedIdx]]
    const nextSwaps = swaps + 1
    setPuzzle({ ...puzzle, arr: nextArr })
    setSelectedIdx(null)
    setSwaps(nextSwaps)
    onSimulate?.()

    const nowSolved = nextArr.every((v, i) => v === puzzle.sorted[i])
    if (nowSolved) {
      setIsRunning(false)
      playSoundCue('fanfare')
      if (bestSwaps === null || nextSwaps < bestSwaps) {
        setBestSwaps(nextSwaps)
        localStorage.setItem('kinetix_sort_best', String(nextSwaps))
      }
    } else {
      playSoundCue('swap')
    }
  }

  return (
    <div className="mini-game-wrap">
      <div className="mg-header-row">
        <div>
          <span className="mg-eyebrow">
            <LuGamepad2 size={13} /> MINI-GAME SORTING ARENA
          </span>
          <h3>Sort Rush: Urutkan Blok Secepatnya!</h3>
        </div>
        <div className="mg-stats-row">
          <div className="mg-stat-pill">
            <LuTimer size={13} className="icon-indigo" />
            <span>Waktu: <strong>{elapsedSec}d</strong></span>
          </div>
          <div className="mg-stat-pill">
            <span>Swap: <strong>{swaps}</strong></span>
          </div>
          {bestSwaps !== null && (
            <div className="mg-stat-pill">
              <LuTrophy size={13} className="icon-orange" />
              <span>Rekor: <strong>{bestSwaps} swap</strong></span>
            </div>
          )}
        </div>
      </div>

      <div className="mg-target-banner">
        <div className="mg-target-left">
          <span>Posisi Tepat:</span>
          <strong className="mg-target-num">
            {correctSlots}/{puzzle.arr.length}
          </strong>
        </div>
        <div className="mg-target-right">
          <span>Ketuk 2 blok untuk menukar posisinya (terkecil &rarr; terbesar)</span>
          <button type="button" className="mg-btn-reset" onClick={resetPuzzle}>
            <LuRotateCcw size={13} /> Acak Ronde Baru
          </button>
        </div>
      </div>

      <div className="sort-rush-grid">
        {puzzle.arr.map((val, idx) => {
          const isPicked = selectedIdx === idx
          const isInPlace = val === puzzle.sorted[idx]
          const fillPct = Math.max(20, Math.round((val / 95) * 100))

          return (
            <motion.button
              key={val}
              layout
              type="button"
              disabled={isSolved}
              onClick={() => handleBlockTap(idx)}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className={`sr-block-btn ${isPicked ? 'is-picked' : ''} ${
                isInPlace ? 'is-in-place' : ''
              }`}
            >
              <div className="sr-block-top">
                <span className="sr-slot-idx">#{idx}</span>
                {isInPlace && (
                  <span className="sr-check-dot" title="Posisi benar">
                    <LuCheck size={11} strokeWidth={3} />
                  </span>
                )}
              </div>
              <strong className="sr-block-val">{val}</strong>
              <div className="sr-bar-track">
                <div className="sr-bar-fill" style={{ width: `${fillPct}%` }} />
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className={`mg-feedback-strip ${isSolved ? 'is-won' : ''}`}>
        {isSolved ? <LuTrophy size={16} /> : <LuGamepad2 size={16} />}
        <span>
          {isSolved
            ? `Selesai dalam ${swaps} swap dan ${elapsedSec} detik! Mantap!`
            : selectedIdx !== null
            ? `Blok #${selectedIdx} (${puzzle.arr[selectedIdx]}) dipilih — ketuk blok kedua untuk menukar.`
            : 'Pilih dua angka untuk menukar hingga urut menaik dari #0 sampai #5.'}
        </span>
      </div>
    </div>
  )
}
