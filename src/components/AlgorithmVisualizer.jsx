import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuStepForward,
  LuShuffle,
  LuCode,
  LuTerminal,
  LuLayers,
  LuZap,
  LuSearch,
  LuGamepad2,
  LuTarget,
  LuChartColumn,
  LuLayoutGrid,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import { BinaryHuntGame, SortRushGame } from './VisualizerMiniGames'
import './AlgorithmVisualizer.css'

const formatTapeAscii = (val) => {
  if (val === 0) return 'NUL'
  if (val >= 32 && val <= 126) return `'${String.fromCharCode(val)}'`
  return `0x${val.toString(16).toUpperCase().padStart(2, '0')}`
}

function AlgorithmVisualizer({ onSimulate } = {}) {
  const [selectedAlgo, setSelectedAlgo] = useState('bubblesort') // 'bubblesort' | 'selectionsort' | 'insertionsort' | 'binarysearch' | 'pointers' | 'tape' | 'game_binary' | 'game_sort'
  const [selectedLang, setSelectedLang] = useState('python') // 'python' | 'c' | 'javascript'
  const [diagramMode, setDiagramMode] = useState('bars') // 'bars' | 'blocks'

  // Array State for Sorting & Searching
  const defaultArray = [54, 26, 93, 17, 77, 31, 44, 55, 20]
  const [array, setArray] = useState(defaultArray)
  const [compareIdx, setCompareIdx] = useState([])
  const [swapIdx, setSwapIdx] = useState([])
  const [sortedIdx, setSortedIdx] = useState([])
  const [currentLine, setCurrentLine] = useState(1)
  const [statusMessage, setStatusMessage] = useState('Siap menjalankan simulasi visual.')
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, stepCount: 0 })
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(400) // ms per step

  // Binary Search State
  const [searchTarget, setSearchTarget] = useState(44)
  const [searchPointers, setSearchPointers] = useState({ low: -1, mid: -1, high: -1 })

  // Memory Pointer State (C / Assembly)
  const [pointerAddress, setPointerAddress] = useState('0x7ffee4a10')
  const [pointedValue, setPointedValue] = useState(42)

  // Brainfuck Tape State
  const [tape, setTape] = useState([72, 101, 108, 108, 111, 0, 0, 0])
  const [tapeHead, setTapeHead] = useState(0)

  // Step generator storage
  const stepsHistoryRef = useRef([])
  const currentStepRef = useRef(0)
  const timerRef = useRef(null)

  // 1. Bubble Sort Step Generator
  const generateBubbleSortSteps = (arr) => {
    const list = [...arr]
    const steps = []
    const n = list.length
    let comps = 0
    let swaps = 0

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: [],
      line: 1,
      message: 'Inisialisasi Bubble Sort. Membandingkan pasangan elemen bersebelahan.',
      comparisons: 0,
      swaps: 0,
    })

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comps++
        steps.push({
          array: [...list],
          compare: [j, j + 1],
          swap: [],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          line: 5,
          message: `Bandingkan arr[${j}] (${list[j]}) dengan arr[${j + 1}] (${list[j + 1]}).`,
          comparisons: comps,
          swaps: swaps,
        })

        if (list[j] > list[j + 1]) {
          swaps++
          const temp = list[j]
          list[j] = list[j + 1]
          list[j + 1] = temp

          steps.push({
            array: [...list],
            compare: [],
            swap: [j, j + 1],
            sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
            line: 6,
            message: `KARENA ${temp} > ${list[j]}, tukar posisi (SWAP) elemen arr[${j}] dan arr[${j + 1}]!`,
            comparisons: comps,
            swaps: swaps,
          })
        }
      }
    }

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      line: 7,
      message: 'SELESAI! Seluruh array berhasil diurutkan dengan Bubble Sort.',
      comparisons: comps,
      swaps: swaps,
    })

    return steps
  }

  // 2. Selection Sort Step Generator
  const generateSelectionSortSteps = (arr) => {
    const list = [...arr]
    const steps = []
    const n = list.length
    let comps = 0
    let swaps = 0

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: [],
      line: 1,
      message: 'Inisialisasi Selection Sort. Mencari elemen terkecil di sisa array.',
      comparisons: 0,
      swaps: 0,
    })

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      steps.push({
        array: [...list],
        compare: [i],
        swap: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        line: 3,
        message: `Mulai putaran ke-${i + 1}. Asumsikan elemen indeks [${i}] (${list[i]}) adalah minimum awal.`,
        comparisons: comps,
        swaps: swaps,
      })

      for (let j = i + 1; j < n; j++) {
        comps++
        steps.push({
          array: [...list],
          compare: [minIdx, j],
          swap: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          line: 5,
          message: `Bandingkan nilai minimum saat ini [${minIdx}] (${list[minIdx]}) dengan [${j}] (${list[j]}).`,
          comparisons: comps,
          swaps: swaps,
        })

        if (list[j] < list[minIdx]) {
          minIdx = j
          steps.push({
            array: [...list],
            compare: [minIdx],
            swap: [],
            sorted: Array.from({ length: i }, (_, k) => k),
            line: 6,
            message: `Ditemukan elemen lebih kecil baru: arr[${minIdx}] = ${list[minIdx]}!`,
            comparisons: comps,
            swaps: swaps,
          })
        }
      }

      if (minIdx !== i) {
        swaps++
        const temp = list[i]
        list[i] = list[minIdx]
        list[minIdx] = temp

        steps.push({
          array: [...list],
          compare: [],
          swap: [i, minIdx],
          sorted: Array.from({ length: i + 1 }, (_, k) => k),
          line: 7,
          message: `Tukar elemen minimum terkecil (${list[i]}) ke posisi indeks [${i}].`,
          comparisons: comps,
          swaps: swaps,
        })
      }
    }

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      line: 8,
      message: 'SELESAI! Seluruh array berhasil diurutkan dengan Selection Sort.',
      comparisons: comps,
      swaps: swaps,
    })

    return steps
  }

  // 3. Insertion Sort Step Generator
  const generateInsertionSortSteps = (arr) => {
    const list = [...arr]
    const steps = []
    const n = list.length
    let comps = 0
    let swaps = 0

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: [0],
      line: 1,
      message: 'Inisialisasi Insertion Sort. Elemen pertama arr[0] dianggap sudah terurut.',
      comparisons: 0,
      swaps: 0,
    })

    for (let i = 1; i < n; i++) {
      let key = list[i]
      let j = i - 1

      steps.push({
        array: [...list],
        compare: [i],
        swap: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        line: 3,
        message: `Ambil key = arr[${i}] (${key}) untuk disisipkan ke posisi terurut di sebelah kiri.`,
        comparisons: comps,
        swaps: swaps,
      })

      while (j >= 0 && list[j] > key) {
        comps++
        swaps++
        list[j + 1] = list[j]
        steps.push({
          array: [...list],
          compare: [j, j + 1],
          swap: [j + 1],
          sorted: [],
          line: 5,
          message: `Geser elemen ${list[j]} ke kanan karena lebih besar dari key (${key}).`,
          comparisons: comps,
          swaps: swaps,
        })
        j--
      }
      list[j + 1] = key
      steps.push({
        array: [...list],
        compare: [],
        swap: [j + 1],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        line: 6,
        message: `Sisipkan key (${key}) di posisi indeks [${j + 1}].`,
        comparisons: comps,
        swaps: swaps,
      })
    }

    steps.push({
      array: [...list],
      compare: [],
      swap: [],
      sorted: Array.from({ length: n }, (_, k) => k),
      line: 7,
      message: 'SELESAI! Seluruh array berhasil diurutkan dengan Insertion Sort.',
      comparisons: comps,
      swaps: swaps,
    })

    return steps
  }

  // 4. Binary Search Step Generator
  const generateBinarySearchSteps = (arr, target) => {
    const sorted = [...arr].sort((a, b) => a - b)
    const steps = []
    let low = 0
    let high = sorted.length - 1
    let found = false
    let comps = 0

    steps.push({
      array: [...sorted],
      compare: [],
      swap: [],
      sorted: [],
      pointers: { low, mid: -1, high },
      line: 1,
      message: `Binary Search membutuhkan array terurut. Mencari nilai target: ${target}.`,
      comparisons: 0,
      swaps: 0,
    })

    while (low <= high) {
      comps++
      const mid = Math.floor((low + high) / 2)
      steps.push({
        array: [...sorted],
        compare: [mid],
        swap: [],
        sorted: [],
        pointers: { low, mid, high },
        line: 4,
        message: `Hitung titik tengah: mid = floor((${low} + ${high}) / 2) = ${mid}. Nilai arr[${mid}] = ${sorted[mid]}.`,
        comparisons: comps,
        swaps: 0,
      })

      if (sorted[mid] === target) {
        found = true
        steps.push({
          array: [...sorted],
          compare: [],
          swap: [],
          sorted: [mid],
          pointers: { low, mid, high },
          line: 5,
          message: `BERHASIL DITEMUKAN! Nilai ${target} ditemukan pada indeks [${mid}]!`,
          comparisons: comps,
          swaps: 0,
        })
        break
      } else if (sorted[mid] < target) {
        steps.push({
          array: [...sorted],
          compare: [mid],
          swap: [],
          sorted: [],
          pointers: { low, mid, high },
          line: 7,
          message: `Karena arr[${mid}] (${sorted[mid]}) < ${target}, eliminasi separuh kiri. Ubah low = ${mid + 1}.`,
          comparisons: comps,
          swaps: 0,
        })
        low = mid + 1
      } else {
        steps.push({
          array: [...sorted],
          compare: [mid],
          swap: [],
          sorted: [],
          pointers: { low, mid, high },
          line: 9,
          message: `Karena arr[${mid}] (${sorted[mid]}) > ${target}, eliminasi separuh kanan. Ubah high = ${mid - 1}.`,
          comparisons: comps,
          swaps: 0,
        })
        high = mid - 1
      }
    }

    if (!found) {
      steps.push({
        array: [...sorted],
        compare: [],
        swap: [],
        sorted: [],
        pointers: { low: -1, mid: -1, high: -1 },
        line: 11,
        message: `Target ${target} tidak ditemukan dalam array. Pencarian selesai.`,
        comparisons: comps,
        swaps: 0,
      })
    }

    return steps
  }

  // Reset and rebuild steps based on current selectedAlgo
  const resetSimulation = (sourceArray = array, target = searchTarget) => {
    setIsPlaying(false)
    if (timerRef.current) clearInterval(timerRef.current)

    let steps = []
    if (selectedAlgo === 'bubblesort') {
      steps = generateBubbleSortSteps(sourceArray)
    } else if (selectedAlgo === 'selectionsort') {
      steps = generateSelectionSortSteps(sourceArray)
    } else if (selectedAlgo === 'insertionsort') {
      steps = generateInsertionSortSteps(sourceArray)
    } else if (selectedAlgo === 'binarysearch') {
      steps = generateBinarySearchSteps(sourceArray, target)
    }

    if (steps.length > 0) {
      stepsHistoryRef.current = steps
      currentStepRef.current = 0
      applyStep(steps[0])
    }
    playSoundCue('click')
  }

  // Soft per-step audio feedback (swap sweep, compare tick, found chime)
  const playStepSound = (step) => {
    if (!step) return
    if (step.pointers && step.sorted?.length) playSoundCue('found')
    else if (step.swap?.length) playSoundCue('swap')
    else if (step.compare?.length) playSoundCue('tick')
  }

  // Apply step state
  const applyStep = (stepObj) => {
    if (!stepObj) return
    setArray(stepObj.array)
    setCompareIdx(stepObj.compare || [])
    setSwapIdx(stepObj.swap || [])
    setSortedIdx(stepObj.sorted || [])
    setCurrentLine(stepObj.line || 1)
    setStatusMessage(stepObj.message || '')
    if (stepObj.pointers) setSearchPointers(stepObj.pointers)
    setStats({
      comparisons: stepObj.comparisons || 0,
      swaps: stepObj.swaps || 0,
      stepCount: currentStepRef.current,
    })
  }

  // Shuffle array
  const handleShuffle = () => {
    const shuffled = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 15)
    setArray(shuffled)
    if (selectedAlgo === 'binarysearch') {
      const sorted = [...shuffled].sort((a, b) => a - b)
      setSearchTarget(sorted[Math.floor(sorted.length / 2)])
      resetSimulation(sorted, sorted[Math.floor(sorted.length / 2)])
    } else {
      resetSimulation(shuffled)
    }
  }

  // Next Step forward
  const handleStepForward = () => {
    onSimulate?.()
    if (currentStepRef.current < stepsHistoryRef.current.length - 1) {
      currentStepRef.current += 1
      applyStep(stepsHistoryRef.current[currentStepRef.current])
      playStepSound(stepsHistoryRef.current[currentStepRef.current])
    } else {
      setIsPlaying(false)
      playSoundCue('success')
    }
  }

  // Auto-play timer
  useEffect(() => {
    if (['bubblesort', 'selectionsort', 'insertionsort', 'binarysearch'].includes(selectedAlgo)) {
      resetSimulation()
    }
  }, [selectedAlgo])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        if (currentStepRef.current < stepsHistoryRef.current.length - 1) {
          currentStepRef.current += 1
          applyStep(stepsHistoryRef.current[currentStepRef.current])
          playStepSound(stepsHistoryRef.current[currentStepRef.current])
        } else {
          setIsPlaying(false)
          clearInterval(timerRef.current)
          playSoundCue('success')
        }
      }, speed)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed])

  const togglePlay = () => {
    if (!isPlaying) onSimulate?.()
    if (currentStepRef.current >= stepsHistoryRef.current.length - 1) {
      currentStepRef.current = 0
    }
    setIsPlaying(!isPlaying)
    playSoundCue('click')
  }

  // Code snippets highlighting lines per algorithm
  const codeSnippetsMap = {
    bubblesort: {
      python: [
        { line: 1, code: 'def bubble_sort(arr):' },
        { line: 2, code: '    n = len(arr)' },
        { line: 3, code: '    for i in range(n):' },
        { line: 4, code: '        for j in range(0, n - i - 1):' },
        { line: 5, code: '            if arr[j] > arr[j + 1]:' },
        { line: 6, code: '                arr[j], arr[j+1] = arr[j+1], arr[j] # SWAP' },
        { line: 7, code: '    return arr' },
      ],
      c: [
        { line: 1, code: 'void bubble_sort(int arr[], int n) {' },
        { line: 2, code: '    int i, j, temp;' },
        { line: 3, code: '    for (i = 0; i < n - 1; i++) {' },
        { line: 4, code: '        for (j = 0; j < n - i - 1; j++) {' },
        { line: 5, code: '            if (arr[j] > arr[j + 1]) {' },
        { line: 6, code: '                temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;' },
        { line: 7, code: '            }' },
      ],
      javascript: [
        { line: 1, code: 'function bubbleSort(arr) {' },
        { line: 2, code: '  const n = arr.length;' },
        { line: 3, code: '  for (let i = 0; i < n; i++) {' },
        { line: 4, code: '    for (let j = 0; j < n - i - 1; j++) {' },
        { line: 5, code: '      if (arr[j] > arr[j + 1]) {' },
        { line: 6, code: '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap' },
        { line: 7, code: '      }' },
      ],
    },
    selectionsort: {
      python: [
        { line: 1, code: 'def selection_sort(arr):' },
        { line: 2, code: '    n = len(arr)' },
        { line: 3, code: '    for i in range(n - 1):' },
        { line: 4, code: '        min_idx = i' },
        { line: 5, code: '        for j in range(i + 1, n):' },
        { line: 6, code: '            if arr[j] < arr[min_idx]: min_idx = j' },
        { line: 7, code: '        arr[i], arr[min_idx] = arr[min_idx], arr[i] # SWAP' },
        { line: 8, code: '    return arr' },
      ],
      c: [
        { line: 1, code: 'void selection_sort(int arr[], int n) {' },
        { line: 2, code: '    int i, j, min_idx, temp;' },
        { line: 3, code: '    for (i = 0; i < n - 1; i++) {' },
        { line: 4, code: '        min_idx = i;' },
        { line: 5, code: '        for (j = i + 1; j < n; j++) {' },
        { line: 6, code: '            if (arr[j] < arr[min_idx]) min_idx = j;' },
        { line: 7, code: '        temp = arr[i]; arr[i] = arr[min_idx]; arr[min_idx] = temp;' },
        { line: 8, code: '    }' },
      ],
      javascript: [
        { line: 1, code: 'function selectionSort(arr) {' },
        { line: 2, code: '  for (let i = 0; i < arr.length - 1; i++) {' },
        { line: 3, code: '    let minIdx = i;' },
        { line: 4, code: '    for (let j = i + 1; j < arr.length; j++) {' },
        { line: 5, code: '      if (arr[j] < arr[minIdx]) minIdx = j;' },
        { line: 6, code: '    }' },
        { line: 7, code: '    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];' },
        { line: 8, code: '  }' },
      ],
    },
    insertionsort: {
      python: [
        { line: 1, code: 'def insertion_sort(arr):' },
        { line: 2, code: '    for i in range(1, len(arr)):' },
        { line: 3, code: '        key = arr[i]' },
        { line: 4, code: '        j = i - 1' },
        { line: 5, code: '        while j >= 0 and arr[j] > key:' },
        { line: 6, code: '            arr[j + 1] = arr[j]; j -= 1' },
        { line: 7, code: '        arr[j + 1] = key' },
      ],
      c: [
        { line: 1, code: 'void insertion_sort(int arr[], int n) {' },
        { line: 2, code: '    for (int i = 1; i < n; i++) {' },
        { line: 3, code: '        int key = arr[i]; int j = i - 1;' },
        { line: 4, code: '        while (j >= 0 && arr[j] > key) {' },
        { line: 5, code: '            arr[j + 1] = arr[j]; j = j - 1;' },
        { line: 6, code: '        }' },
        { line: 7, code: '        arr[j + 1] = key;' },
      ],
      javascript: [
        { line: 1, code: 'function insertionSort(arr) {' },
        { line: 2, code: '  for (let i = 1; i < arr.length; i++) {' },
        { line: 3, code: '    let key = arr[i]; let j = i - 1;' },
        { line: 4, code: '    while (j >= 0 && arr[j] > key) {' },
        { line: 5, code: '      arr[j + 1] = arr[j]; j--;' },
        { line: 6, code: '    }' },
        { line: 7, code: '    arr[j + 1] = key;' },
      ],
    },
    binarysearch: {
      python: [
        { line: 1, code: 'def binary_search(arr, target):' },
        { line: 2, code: '    low = 0; high = len(arr) - 1' },
        { line: 3, code: '    while low <= high:' },
        { line: 4, code: '        mid = (low + high) // 2' },
        { line: 5, code: '        if arr[mid] == target: return mid' },
        { line: 6, code: '        elif arr[mid] < target: low = mid + 1' },
        { line: 7, code: '        else: high = mid - 1' },
        { line: 8, code: '    return -1' },
      ],
      c: [
        { line: 1, code: 'int binary_search(int arr[], int n, int target) {' },
        { line: 2, code: '    int low = 0, high = n - 1;' },
        { line: 3, code: '    while (low <= high) {' },
        { line: 4, code: '        int mid = low + (high - low) / 2;' },
        { line: 5, code: '        if (arr[mid] == target) return mid;' },
        { line: 6, code: '        if (arr[mid] < target) low = mid + 1;' },
        { line: 7, code: '        else high = mid - 1;' },
        { line: 8, code: '    }' },
      ],
      javascript: [
        { line: 1, code: 'function binarySearch(arr, target) {' },
        { line: 2, code: '  let low = 0, high = arr.length - 1;' },
        { line: 3, code: '  while (low <= high) {' },
        { line: 4, code: '    const mid = Math.floor((low + high) / 2);' },
        { line: 5, code: '    if (arr[mid] === target) return mid;' },
        { line: 6, code: '    if (arr[mid] < target) low = mid + 1;' },
        { line: 7, code: '    else high = mid - 1;' },
        { line: 8, code: '  }' },
      ],
    },
  }

  const currentSnippetList =
    codeSnippetsMap[selectedAlgo]?.[selectedLang] ||
    codeSnippetsMap.bubblesort[selectedLang]

  const tapeOutputString = tape
    .map((v) => (v >= 32 && v <= 126 ? String.fromCharCode(v) : ''))
    .join('')
  const speedMultiplier = `${(400 / speed).toFixed(1)}x`

  return (
    <div className="algo-visualizer glass-card">
      {/* 1. TOP ALGORITHM & MINI-GAME SELECTOR TABS (Balanced 4x2 Grid) */}
      <div className="algo-topbar">
        <div className="algo-tabs-rail">
          <button
            className={`algo-tab-btn ${selectedAlgo === 'bubblesort' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('bubblesort'); playSoundCue('click') }}
          >
            <LuCode size={15} /> Bubble Sort
          </button>
          <button
            className={`algo-tab-btn ${selectedAlgo === 'selectionsort' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('selectionsort'); playSoundCue('click') }}
          >
            <LuCode size={15} /> Selection Sort
          </button>
          <button
            className={`algo-tab-btn ${selectedAlgo === 'insertionsort' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('insertionsort'); playSoundCue('click') }}
          >
            <LuCode size={15} /> Insertion Sort
          </button>
          <button
            className={`algo-tab-btn ${selectedAlgo === 'binarysearch' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('binarysearch'); playSoundCue('click') }}
          >
            <LuSearch size={15} /> Binary Search
          </button>
          <button
            className={`algo-tab-btn ${selectedAlgo === 'pointers' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('pointers'); playSoundCue('click') }}
          >
            <LuLayers size={15} /> Pointer & Memori C
          </button>
          <button
            className={`algo-tab-btn ${selectedAlgo === 'tape' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('tape'); playSoundCue('click') }}
          >
            <LuTerminal size={15} /> Pita Turing Brainfuck
          </button>
          <button
            className={`algo-tab-btn algo-tab-game ${selectedAlgo === 'game_binary' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('game_binary'); playSoundCue('click') }}
          >
            <LuTarget size={15} /> Game: Tebak Binary
          </button>
          <button
            className={`algo-tab-btn algo-tab-game ${selectedAlgo === 'game_sort' ? 'active' : ''}`}
            onClick={() => { setSelectedAlgo('game_sort'); playSoundCue('click') }}
          >
            <LuGamepad2 size={15} /> Game: Sort Rush
          </button>
        </div>

        {/* Language Switcher for Code View */}
        {['bubblesort', 'selectionsort', 'insertionsort', 'binarysearch'].includes(selectedAlgo) && (
          <div className="lang-switcher">
            <span className="lang-label">Bahasa:</span>
            {['python', 'c', 'javascript'].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLang(lang)
                  playSoundCue('click')
                }}
                className={`lang-pill ${selectedLang === lang ? 'active' : ''}`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. MAIN VISUALIZATION VIEW FOR SORTING & BINARY SEARCH */}
      {['bubblesort', 'selectionsort', 'insertionsort', 'binarysearch'].includes(selectedAlgo) && (
        <div className="algo-content-grid">
          {/* Left Column: Visual Canvas */}
          <div className="bars-section">
            <div className="bars-header">
              <div>
                <h3 className="bars-title">
                  {selectedAlgo === 'binarysearch'
                    ? 'Visualisasi Pembelahan Ruang Pencarian'
                    : 'Status Array & Perpindahan Elemen'}
                </h3>
              </div>
              <div className="bars-header-tools">
                <div className="view-mode-toggle" role="group" aria-label="Mode Diagram">
                  <button
                    type="button"
                    className={`view-mode-btn ${diagramMode === 'bars' ? 'active' : ''}`}
                    onClick={() => { setDiagramMode('bars'); playSoundCue('toggle') }}
                  >
                    <LuChartColumn size={13} /> Grafik Batang
                  </button>
                  <button
                    type="button"
                    className={`view-mode-btn ${diagramMode === 'blocks' ? 'active' : ''}`}
                    onClick={() => { setDiagramMode('blocks'); playSoundCue('toggle') }}
                  >
                    <LuLayoutGrid size={13} /> Blok Memori
                  </button>
                </div>

                <div className="stats-badges">
                  <span className="stat-pill">
                    Komparasi: <strong>{stats.comparisons}</strong>
                  </span>
                  {selectedAlgo !== 'binarysearch' && (
                    <span className="stat-pill">
                      Swap: <strong>{stats.swaps}</strong>
                    </span>
                  )}
                  {selectedAlgo === 'binarysearch' && (
                    <span className="stat-pill">
                      Target: <strong>{searchTarget}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Diagram View A: Bars Canvas with Oscilloscope Guides */}
            {diagramMode === 'bars' ? (
              <div className="bars-stage">
                <div className="stage-grid-lines" aria-hidden="true">
                  <span className="grid-guide" style={{ bottom: '25%' }} />
                  <span className="grid-guide" style={{ bottom: '50%' }} />
                  <span className="grid-guide" style={{ bottom: '75%' }} />
                </div>
                {(() => {
                  const maxBarVal = Math.max(...array, 1)
                  return array.map((val, idx) => {
                    const isComparing = compareIdx.includes(idx)
                    const isSwapping = swapIdx.includes(idx)
                    const isSorted = sortedIdx.includes(idx)
                    const isMid = selectedAlgo === 'binarysearch' && searchPointers.mid === idx
                    const isLow = selectedAlgo === 'binarysearch' && searchPointers.low === idx
                    const isHigh = selectedAlgo === 'binarysearch' && searchPointers.high === idx
                    const isFound = selectedAlgo === 'binarysearch' && isSorted

                    let barClass = 'bar-normal'
                    if (isComparing) barClass = 'bar-comparing'
                    if (isSwapping) barClass = 'bar-swapping'
                    if (isMid && !isSorted) barClass = 'bar-swapping'
                    if (isSorted) barClass = 'bar-sorted'

                    const heightPct = Math.max(10, Math.round((val / maxBarVal) * 100))

                    return (
                      <div key={idx} className="bar-wrapper">
                        {(isMid || isFound) && (
                          <span className={`pointer-badge ${isFound ? 'found-badge' : 'mid-badge'}`}>
                            {isFound ? 'KETEMU' : 'MID'}
                          </span>
                        )}
                        {isLow && !isMid && !isFound && <span className="pointer-badge low-badge">LOW</span>}
                        {isHigh && !isMid && !isFound && <span className="pointer-badge high-badge">HIGH</span>}
                        {selectedAlgo !== 'binarysearch' && isSwapping && (
                          <span className="bar-state-chip chip-swap">SWAP</span>
                        )}
                        {selectedAlgo !== 'binarysearch' && !isSwapping && isComparing && (
                          <span className="bar-state-chip chip-cmp">CMP</span>
                        )}

                        <span className="bar-val">{val}</span>
                        <div className="bar-track">
                          <motion.div
                            className={`bar-fill ${barClass}`}
                            style={{ height: `${heightPct}%` }}
                            layout
                            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
                          />
                        </div>
                        <span className="bar-idx">[{idx}]</span>
                      </div>
                    )
                  })
                })()}
              </div>
            ) : (
              /* Diagram View B: Tactile Memory Node Blocks */
              <div className="blocks-stage">
                {array.map((val, idx) => {
                  const isComparing = compareIdx.includes(idx)
                  const isSwapping = swapIdx.includes(idx)
                  const isSorted = sortedIdx.includes(idx)
                  const isMid = selectedAlgo === 'binarysearch' && searchPointers.mid === idx
                  const isLow = selectedAlgo === 'binarysearch' && searchPointers.low === idx
                  const isHigh = selectedAlgo === 'binarysearch' && searchPointers.high === idx
                  const isFound = selectedAlgo === 'binarysearch' && isSorted

                  let blockState = 'normal'
                  let stateText = 'IDLE'
                  if (isComparing) {
                    blockState = 'comparing'
                    stateText = 'CMP'
                  }
                  if (isSwapping || (isMid && !isSorted)) {
                    blockState = 'swapping'
                    stateText = isMid ? 'MID' : 'SWAP'
                  } else if (isLow && !isSorted) {
                    stateText = 'LOW'
                  } else if (isHigh && !isSorted) {
                    stateText = 'HIGH'
                  }
                  if (isSorted) {
                    blockState = 'sorted'
                    stateText = isFound ? 'KETEMU' : 'OK'
                  }

                  return (
                    <motion.div
                      key={idx}
                      layout
                      className={`memory-node-block state-${blockState}`}
                      transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    >
                      <div className="block-top-row">
                        <span className="block-idx">#{idx}</span>
                        <span className="block-state-tag">{stateText}</span>
                      </div>
                      <strong className="block-val">{val}</strong>
                      <div className="block-meter-track">
                        <div className="block-meter-fill" style={{ width: `${Math.min(100, val)}%` }} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Compact Telemetry Color Legend */}
            <div className="stage-legend">
              {selectedAlgo === 'binarysearch' ? (
                <>
                  <span><i className="leg-dot leg-low" /> Batas Low/High</span>
                  <span><i className="leg-dot leg-swap" /> Titik Tengah (Mid)</span>
                  <span><i className="leg-dot leg-sorted" /> Target Ditemukan</span>
                </>
              ) : (
                <>
                  <span><i className="leg-dot leg-normal" /> Normal</span>
                  <span><i className="leg-dot leg-cmp" /> Bandingkan (CMP)</span>
                  <span><i className="leg-dot leg-swap" /> Tukar (SWAP)</span>
                  <span><i className="leg-dot leg-sorted" /> Terurut</span>
                </>
              )}
            </div>

            {/* Status Commentary Banner */}
            <div className="status-commentary">
              <div className="commentary-icon">
                <LuTerminal size={18} className="icon-cyan" />
              </div>
              <p>{statusMessage}</p>
            </div>

            {/* Studio Playback Controls (Balanced 4-col Dock + Custom Slider) */}
            <div className="algo-controls">
              <div className="control-btn-group">
                <button
                  className="btn btn-primary"
                  onClick={togglePlay}
                  title={isPlaying ? 'Jeda' : 'Jalankan Otomatis'}
                >
                  {isPlaying ? (
                    <>
                      <LuPause size={15} /> Jeda
                    </>
                  ) : (
                    <>
                      <LuPlay size={15} /> Jalankan
                    </>
                  )}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleStepForward}
                  disabled={isPlaying}
                  title="Langkah Berikutnya"
                >
                  <LuStepForward size={15} /> Maju
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => resetSimulation(array, searchTarget)}
                  title="Ulangi dari Langkah Pertama"
                >
                  <LuRotateCcw size={15} /> Reset
                </button>
                <button
                  className="btn btn-outline"
                  onClick={handleShuffle}
                  title="Acak Data Baru"
                >
                  <LuShuffle size={15} /> Acak
                </button>
              </div>

              {/* Speed Slider */}
              <div className="speed-control">
                <span>Kecepatan:</span>
                <input
                  type="range"
                  min="80"
                  max="1000"
                  step="50"
                  value={1080 - speed}
                  onChange={(e) => setSpeed(1080 - Number(e.target.value))}
                  className="sim-slider"
                />
                <span className="speed-badge">{speedMultiplier}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Code Sync Box */}
          <div className="code-sync-section">
            <div className="code-sync-header">
              <span className="code-lang-tag">{selectedLang.toUpperCase()}</span>
              <strong>Sinkronisasi Baris Kode</strong>
            </div>

            <div className="code-editor-mockup">
              <div className="editor-topbar">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="editor-filename">
                  {selectedAlgo}.{selectedLang === 'python' ? 'py' : selectedLang === 'c' ? 'c' : 'js'}
                </span>
                <span className="editor-scroll-hint">← Geser kode →</span>
              </div>
              <div className="code-lines">
                <div className="code-lines-inner">
                  {currentSnippetList.map((lineObj) => {
                    const isActive = currentLine === lineObj.line
                    return (
                      <div
                        key={lineObj.line}
                        className={`code-line-row ${isActive ? 'active-line' : ''}`}
                      >
                        <span className="line-num">{lineObj.line}</span>
                        <span className="line-code">{lineObj.code}</span>
                        {isActive && <span className="line-pointer">&lt;- DIEKSEKUSI</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="algo-info-card">
              <h4>
                <LuZap size={16} className="icon-orange" /> Kompleksitas Algoritma:
              </h4>
              <p>
                {selectedAlgo === 'bubblesort' && (
                  <><strong>O(n²)</strong>. Membandingkan pasangan elemen bertetangga dan menukar posisi hingga elemen terbesar mengapung ke ujung.</>
                )}
                {selectedAlgo === 'selectionsort' && (
                  <><strong>O(n²)</strong>. Menelusuri seluruh subarray untuk menemukan elemen minimum terkecil dan meletakkannya di urutan depan.</>
                )}
                {selectedAlgo === 'insertionsort' && (
                  <><strong>O(n²)</strong>. Mirip menyusun kartu di tangan, menyisipkan elemen ke bagian yang sudah terurut di sebelah kiri.</>
                )}
                {selectedAlgo === 'binarysearch' && (
                  <><strong>O(log n)</strong>. Memotong ruang pencarian menjadi setengah pada setiap langkah komparasi. Sangat efisien untuk dataset besar!</>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. C / ASSEMBLY MEMORY & POINTER VISUALIZER */}
      {selectedAlgo === 'pointers' && (
        <div className="memory-visualizer-wrap">
          <div className="memory-intro">
            <h3>Visualisasi Manajemen Memori & Pointer (C / Low Level)</h3>
            <p>
              Bahasa tingkat rendah seperti <strong>C</strong> dan <strong>Assembly</strong> berinteraksi langsung dengan alamat RAM fisik. Lihat bagaimana pointer bekerja di bawah kap mesin!
            </p>
          </div>

          <div className="memory-diagram">
            {/* Variable Box on Stack */}
            <div className="memory-card stack-card">
              <div className="mem-badge">Stack Memory</div>
              <div className="mem-address">Alamat RAM: 0x7ffee4a10</div>
              <div className="mem-content">
                <span className="mem-label">Variabel: int a</span>
                <input
                  type="number"
                  value={pointedValue}
                  onChange={(e) => setPointedValue(Number(e.target.value))}
                  className="mem-input"
                />
              </div>
              <small>Disimpan langsung di stack frame fungsi main()</small>
            </div>

            {/* Visual Pointer Arrow */}
            <div className="pointer-arrow-wrap">
              <div className="pointer-laser">
                <span className="pointer-pulse-dot" />
              </div>
              <span className="pointer-label">Menunjuk Alamat (&a) -&gt;</span>
            </div>

            {/* Pointer Box */}
            <div className="memory-card pointer-card">
              <div className="mem-badge badge-pointer">Pointer: int *ptr</div>
              <div className="mem-address">Alamat Pointer: 0x7ffee4a18</div>
              <div className="mem-content">
                <span className="mem-label">Nilai Tersimpan (Alamat Sasaran):</span>
                <code className="ptr-val">{pointerAddress}</code>
              </div>
              <div className="deref-result">
                <span>Dereferensi (*ptr):</span>
                <strong className="text-cyan">{pointedValue}</strong>
              </div>
            </div>
          </div>

          <div className="memory-actions">
            <button
              className="btn btn-outline"
              onClick={() => {
                setPointedValue(Math.floor(Math.random() * 90) + 10)
                playSoundCue('log')
                onSimulate?.()
              }}
            >
              Ubah Nilai *ptr Secara Acak
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                const nextAddr = '0x7ffee' + Math.floor(Math.random() * 89999 + 10000).toString(16)
                setPointerAddress(nextAddr)
                playSoundCue('click')
                onSimulate?.()
              }}
            >
              Alokasikan Alamat RAM Baru (malloc)
            </button>
          </div>
        </div>
      )}

      {/* 4. BRAINFUCK TURING TAPE SIMULATOR */}
      {selectedAlgo === 'tape' && (
        <div className="memory-visualizer-wrap tape-visualizer-wrap">
          <div className="memory-intro">
            <h3>Simulasi Pita Memori Mesin Turing (Brainfuck)</h3>
            <p>
              Brainfuck beroperasi pada pita memori tak terbatas dengan pointer sel memori satu byte (0-255). Ketuk sel untuk memindahkan pointer!
            </p>
          </div>

          {/* Live Tape Telemetry Status */}
          <div className="tape-status-bar">
            <div className="tape-stat-chip">
              <span>Output ASCII:</span>
              <code>&quot;{tapeOutputString || '(kosong)'}&quot;</code>
            </div>
            <div className="tape-stat-chip">
              <span>Head:</span>
              <strong>
                Sel #{tapeHead} &middot; {tape[tapeHead]} ({formatTapeAscii(tape[tapeHead])})
              </strong>
            </div>
          </div>

          {/* Interactive Clickable Tape Grid (8 cells on 1 row desktop / 4x2 mobile) */}
          <div className="tape-container">
            {tape.map((val, cellIdx) => {
              const isHead = tapeHead === cellIdx
              const bytePct = Math.round((val / 255) * 100)
              return (
                <button
                  type="button"
                  key={cellIdx}
                  onClick={() => {
                    setTapeHead(cellIdx)
                    playSoundCue('select')
                  }}
                  className={`tape-cell ${isHead ? 'head-active' : ''}`}
                >
                  {isHead && <div className="tape-head-label">HEAD PTR</div>}
                  <div className="cell-num">{val}</div>
                  <div className="cell-char">{formatTapeAscii(val)}</div>
                  <div className="cell-idx">Sel #{cellIdx}</div>
                  <div className="cell-meter-track">
                    <div className="cell-meter-fill" style={{ width: `${bytePct}%` }} />
                  </div>
                </button>
              )
            })}
          </div>

          <div className="tape-actions">
            <button
              className="btn btn-outline"
              disabled={tapeHead === 0}
              onClick={() => {
                setTapeHead((prev) => Math.max(0, prev - 1))
                playSoundCue('click')
              }}
            >
              &lsaquo; Geser Kiri (&lt;)
            </button>
            <button
              className="btn btn-outline"
              disabled={tapeHead === tape.length - 1}
              onClick={() => {
                setTapeHead((prev) => Math.min(tape.length - 1, prev + 1))
                playSoundCue('click')
              }}
            >
              Geser Kanan (&gt;) &rsaquo;
            </button>
            <button
              className="btn btn-tape-inc"
              onClick={() => {
                setTape((prev) => {
                  const n = [...prev]
                  n[tapeHead] = (n[tapeHead] + 1) % 256
                  return n
                })
                playSoundCue('click')
                onSimulate?.()
              }}
            >
              + Tambah (+)
            </button>
            <button
              className="btn btn-tape-dec"
              onClick={() => {
                setTape((prev) => {
                  const n = [...prev]
                  n[tapeHead] = (n[tapeHead] - 1 + 256) % 256
                  return n
                })
                playSoundCue('click')
                onSimulate?.()
              }}
            >
              - Kurang (-)
            </button>
            <button
              className="btn btn-outline tape-reset-btn"
              onClick={() => {
                setTape([72, 101, 108, 108, 111, 0, 0, 0])
                setTapeHead(0)
                playSoundCue('click')
                onSimulate?.()
              }}
            >
              Reset Pita (&quot;Hello&quot;)
            </button>
          </div>
        </div>
      )}

      {/* 5. MINI-GAME A: BINARY SEARCH HUNTER */}
      {selectedAlgo === 'game_binary' && <BinaryHuntGame onSimulate={onSimulate} />}

      {/* 6. MINI-GAME B: SORT RUSH ARENA */}
      {selectedAlgo === 'game_sort' && <SortRushGame onSimulate={onSimulate} />}
    </div>
  )
}

export default AlgorithmVisualizer
