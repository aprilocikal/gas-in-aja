import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuFlame,
  LuSparkles,
  LuCheck,
  LuX,
  LuLock,
  LuPlay,
  LuCode,
  LuTrophy,
  LuHeart,
  LuZap,
} from 'react-icons/lu'
import CharacterAvatar from './CharacterAvatar'
import { playSoundCue } from './AccessibilityToolbar'
import './InteractiveCodingPath.css'

function InteractiveCodingPath({ activeLanguage = 'python', onOpenVisualizer }) {
  // Gamification Stats
  const MAX_HEARTS = 3
  const [xp, setXp] = useState(120)
  const [streak, setStreak] = useState(5)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [outOfHearts, setOutOfHearts] = useState(false)

  // Quiz Modal State
  const [activeLesson, setActiveLesson] = useState(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [lessonComplete, setLessonComplete] = useState(false)

  // Curated Checkpoint Nodes
  const curriculumNodes = [
    {
      id: 1,
      title: 'Unit 1: Fondasi & Variabel',
      desc: 'Mengenal memori, tipe data primitif, dan deklarasi variabel.',
      icon: <LuCode size={22} />,
      status: 'completed',
      xpReward: 15,
      questions: [
        {
          question: 'Pada Python, apakah tipe data dari variabel x = 42.0?',
          code: 'x = 42.0\nprint(type(x))',
          options: ['int (Integer)', 'float (Floating Point)', 'str (String)', 'bool (Boolean)'],
          answer: 1,
          explanation: 'Angka dengan desimal (titik) di Python dikenali secara dinamis sebagai tipe data float.',
        },
        {
          question: 'Manakah deklarasi variabel string yang valid di Python?',
          code: '# pilih yang valid',
          options: ['nama = "Kinetix"', 'string nama = "Kinetix";', 'var nama := "Kinetix"', 'nama <- "Kinetix"'],
          answer: 0,
          explanation: 'Python tidak butuh tipe eksplisit: cukup nama = "Kinetix".',
        },
        {
          question: 'Apa hasil dari 7 // 2 di Python?',
          code: 'print(7 // 2)',
          options: ['3', '3.5', '4', '2'],
          answer: 0,
          explanation: 'Operator // adalah floor division sehingga 7 // 2 = 3.',
        },
      ],
    },
    {
      id: 2,
      title: 'Unit 2: Looping & Percabangan',
      desc: 'Pengulangan while/for dan evaluasi kondisi if-else.',
      icon: <LuZap size={22} />,
      status: 'completed',
      xpReward: 20,
      questions: [
        {
          question: 'Berapa kali loop berikut ini akan dieksekusi?',
          code: 'for i in range(1, 5):\n    print(i)',
          options: ['3 kali', '4 kali (1, 2, 3, 4)', '5 kali (1, 2, 3, 4, 5)', 'Tak terhingga'],
          answer: 1,
          explanation: 'Fungsi range(1, 5) di Python berhenti sebelum batas akhir, sehingga mengembalikan nilai 1, 2, 3, dan 4 (tepat 4 kali).',
        },
        {
          question: 'Kata kunci apa yang menghentikan sebuah loop lebih awal?',
          code: 'for i in range(10):\n    if i == 3:\n        # hentikan loop di sini',
          options: ['break', 'stop', 'exit_loop', 'return_loop'],
          answer: 0,
          explanation: 'break langsung keluar dari loop terdekat.',
        },
        {
          question: 'Apa output dari kode berikut?',
          code: 'x = 5\nif x > 3:\n    print("A")\nelse:\n    print("B")',
          options: ['A', 'B', 'A lalu B', 'Error'],
          answer: 0,
          explanation: 'x > 3 bernilai True sehingga hanya blok if yang dijalankan.',
        },
      ],
    },
    {
      id: 3,
      title: 'Unit 3: Visualisasi Bubble Sort',
      desc: 'Animasi logika penukaran (swap) dan komparasi elemen array.',
      icon: <LuSparkles size={22} />,
      status: 'active',
      xpReward: 30,
      questions: [
        {
          question: 'Pada iterasi Bubble Sort, jika arr[j] = 80 dan arr[j+1] = 25, apa yang harus dilakukan?',
          code: 'if arr[j] > arr[j + 1]:\n    # Lengkapi aksi selanjutnya di sini!',
          options: [
            'Abaikan saja dan lanjut ke elemen berikutnya',
            'Tukar (Swap) posisi kedua elemen agar nilai kecil berada di kiri',
            'Hapus elemen 80 dari array',
            'Hentikan seluruh program',
          ],
          answer: 1,
          explanation: 'Karena 80 > 25, algoritma Bubble Sort menukar posisinya (Swap) agar elemen yang lebih besar terdorong ke arah kanan.',
        },
        {
          question: 'Berapakah kompleksitas waktu terburuk (Worst-case Big-O) dari algoritma Bubble Sort?',
          code: '// Array dalam keadaan terurut terbalik\nint arr[] = {9, 8, 7, 6, 5, 4};',
          options: ['O(1)', 'O(n log n)', 'O(n²)', 'O(n)'],
          answer: 2,
          explanation: 'Bubble Sort membutuhkan dua perulangan bersarang (nested loops), menghasilkan kompleksitas waktu O(n²).',
        },
      ],
    },
    {
      id: 4,
      title: 'Unit 4: Pointer & Manajemen Memori',
      desc: 'Alokasi memori dinamis di C, stack frame, dan dereferensi.',
      icon: <LuFlame size={22} />,
      status: 'locked',
      xpReward: 35,
      questions: [
        {
          question: 'Operator apa yang mengambil alamat memori sebuah variabel di C?',
          code: 'int x = 5;\nint *p = ???;',
          options: ['&x', '*x', '@x', 'addr(x)'],
          answer: 0,
          explanation: 'Operator & mengambil alamat variabel, sedangkan * mendereferensi pointer.',
        },
      ],
    },
    {
      id: 5,
      title: 'Unit 5: Algoritma Esoterik & Turing',
      desc: 'Tantangan logika ekstrim manipulasi pita memori Brainfuck.',
      icon: <LuTrophy size={22} />,
      status: 'locked',
      xpReward: 50,
      questions: [
        {
          question: 'Perintah Brainfuck apa yang menambah nilai sel saat ini?',
          code: '+++',
          options: ['+', '>', '.', '['],
          answer: 0,
          explanation: 'Tanda + menambah nilai byte pada sel yang sedang ditunjuk pointer.',
        },
      ],
    },
  ]

  const handleStartLesson = (node) => {
    if (node.status === 'locked' || !node.questions?.length) return
    setActiveLesson(node)
    setCurrentQIndex(0)
    setSelectedOption(null)
    setFeedback(null)
    setLessonComplete(false)
    setOutOfHearts(hearts <= 0)
    playSoundCue('click')
  }

  const handleRefillHearts = () => {
    setHearts(MAX_HEARTS)
    setOutOfHearts(false)
    setCurrentQIndex(0)
    setSelectedOption(null)
    setFeedback(null)
    setLessonComplete(false)
    playSoundCue('success')
  }

  const handleCheckAnswer = () => {
    const currentQ = activeLesson?.questions?.[currentQIndex]
    if (selectedOption === null || !currentQ || feedback) return
    const isCorrect = selectedOption === currentQ.answer

    if (isCorrect) {
      setFeedback('correct')
      playSoundCue('success')
      setXp((prev) => prev + 15)
    } else {
      setFeedback('wrong')
      playSoundCue('wrong')
      setHearts((prev) => Math.max(0, prev - 1))
    }
  }

  const handleNextQuestion = () => {
    if (hearts <= 0) {
      setOutOfHearts(true)
      playSoundCue('wrong')
      return
    }
    if (currentQIndex < activeLesson.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1)
      setSelectedOption(null)
      setFeedback(null)
    } else {
      setLessonComplete(true)
      playSoundCue('success')
    }
  }

  return (
    <div className="coding-path-wrapper">
      {/* Gamification Top Header Bar */}
      <div className="duo-header glass-card">
        <div className="duo-stats">
          <div className="duo-stat-item" title="Streak Belajar Berturut-turut">
            <LuFlame size={20} className="icon-orange" />
            <span className="stat-num">{streak} Hari</span>
          </div>
          <div className="duo-stat-item" title="Experience Points">
            <LuSparkles size={20} className="icon-violet" />
            <span className="stat-num">{xp} XP</span>
          </div>
          <div className="duo-stat-item" title="Sisa Nyawa Praktikum">
            <LuHeart size={20} className="icon-pink" />
            <span className="stat-num">{hearts}</span>
          </div>
        </div>

        <div className="duo-companion-mini">
          <CharacterAvatar size={50} emotion="happy" animated={false} />
          <div className="companion-speech">
            <span>Ayo taklukkan <strong>Unit 3: Visualisasi Bubble Sort</strong>!</span>
          </div>
        </div>
      </div>

      {/* Roadmap Path */}
      <div className="path-roadmap">
        {curriculumNodes.map((node, idx) => {
          const isLeft = idx % 2 === 0
          return (
            <div
              key={node.id}
              className={`path-node-row ${isLeft ? 'node-left' : 'node-right'}`}
            >
              <div className="path-node-container">
                <motion.button
                  className={`path-node-btn node-${node.status}`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStartLesson(node)}
                >
                  <div className="node-icon">{node.icon}</div>
                  {node.status === 'completed' && (
                    <div className="node-badge-done">
                      <LuCheck size={14} />
                    </div>
                  )}
                  {node.status === 'locked' && (
                    <div className="node-badge-lock">
                      <LuLock size={14} />
                    </div>
                  )}
                  {node.status === 'active' && (
                    <motion.div
                      className="node-ring-pulse"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.button>

                <div className="path-node-card glass-card">
                  <span className="node-xp">+{node.xpReward} XP</span>
                  <h4>{node.title}</h4>
                  <p>{node.desc}</p>
                  {node.status === 'active' && (
                    <div className="node-actions-row">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStartLesson(node)}
                      >
                        <LuPlay size={14} /> Mulai Kuis Interaktif
                      </button>
                      {onOpenVisualizer && (
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={onOpenVisualizer}
                        >
                          Lihat Simulasi Animasi
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Quiz Modal */}
      <AnimatePresence>
        {activeLesson && (
          <div className="duo-modal-overlay">
            <motion.div
              className="duo-modal-card glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Modal Top Header */}
              <div className="modal-top">
                <button
                  className="modal-close-btn"
                  onClick={() => setActiveLesson(null)}
                >
                  <LuX size={20} />
                </button>
                <div className="modal-progress-bar">
                  <div
                    className="modal-progress-fill"
                    style={{
                      width: `${
                        ((currentQIndex + 1) / (activeLesson.questions?.length || 1)) * 100
                      }%`,
                    }}
                  />
                </div>
                <div className="modal-hearts">
                  <LuHeart size={18} className="icon-pink" />
                  <span>{hearts}</span>
                </div>
              </div>

              {outOfHearts ? (
                <div className="quiz-out-of-hearts">
                  <CharacterAvatar size={140} emotion="oops" animated={true} />
                  <h2>Nyawa Habis!</h2>
                  <p>Ketiga nyawamu terpakai. Pulihkan nyawa lalu ulangi unit ini dari awal.</p>
                  <button className="btn btn-primary btn-lg" onClick={handleRefillHearts}>
                    Pulihkan {MAX_HEARTS} Nyawa & Ulangi Unit
                  </button>
                </div>
              ) : !lessonComplete ? (
                <div className="quiz-question-body">
                  <span className="quiz-tag">Tantangan Koding Interaktif</span>
                  <h3 className="quiz-q-title">
                    {activeLesson.questions[currentQIndex].question}
                  </h3>

                  {activeLesson.questions[currentQIndex].code && (
                    <div className="quiz-code-box">
                      <pre>
                        <code>{activeLesson.questions[currentQIndex].code}</code>
                      </pre>
                    </div>
                  )}

                  <div className="quiz-options-list">
                    {activeLesson.questions[currentQIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        className={`quiz-opt-btn ${selectedOption === idx ? 'selected' : ''}`}
                        onClick={() => {
                          if (!feedback) {
                            setSelectedOption(idx)
                            playSoundCue('click')
                          }
                        }}
                      >
                        <span className="opt-key">{String.fromCharCode(65 + idx)}</span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    ))}
                  </div>

                  {/* Feedback Bottom Banner */}
                  {feedback && (
                    <motion.div
                      className={`quiz-feedback-bar ${feedback === 'correct' ? 'fb-correct' : 'fb-wrong'}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                    >
                      <div className="fb-left">
                        {feedback === 'correct' ? (
                          <>
                            <div className="fb-icon-circle green">
                              <LuCheck size={20} />
                            </div>
                            <div>
                              <strong>Luar Biasa, Jawaban Tepat!</strong>
                              <p>{activeLesson.questions[currentQIndex].explanation}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="fb-icon-circle red">
                              <LuX size={20} />
                            </div>
                            <div>
                              <strong>Jawaban Belum Tepat!</strong>
                              <p>{activeLesson.questions[currentQIndex].explanation}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <button className="btn btn-primary" onClick={handleNextQuestion}>
                        Lanjut
                      </button>
                    </motion.div>
                  )}

                  {!feedback && (
                    <div className="quiz-action-bar">
                      <button
                        className="btn btn-primary btn-lg"
                        disabled={selectedOption === null}
                        onClick={handleCheckAnswer}
                      >
                        Periksa Jawaban
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Celebration Completion Screen */
                <div className="quiz-complete-screen">
                  <CharacterAvatar size={160} emotion="happy" animated={true} />
                  <h2>Selamat! Unit Berhasil Diselesaikan!</h2>
                  <p>Kamu telah memahami logika dan mendapatkan <strong>+{activeLesson.xpReward} XP</strong>.</p>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      setActiveLesson(null)
                      playSoundCue('success')
                    }}
                  >
                    Lanjut ke Roadmap
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InteractiveCodingPath
