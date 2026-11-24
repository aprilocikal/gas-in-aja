import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LuCpu,
  LuCode,
  LuBrain,
  LuRotateCw,
  LuArrowRight,
  LuCheck,
  LuLayers,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './LanguageTierFlashcards.css'

export default function LanguageTierFlashcards() {
  const [flippedCards, setFlippedCards] = useState({
    low: false,
    high: false,
    esoteric: false,
  })

  const toggleFlip = (cardId) => {
    playSoundCue('click')
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  const cardsData = [
    {
      id: 'low',
      badge: 'Level Rendah',
      title: 'Sistem & Bare Metal',
      languages: 'Assembly x86, C, C++, Rust',
      color: '#ef4444',
      icon: <LuCpu size={32} />,
      frontSummary: 'Kendali langsung atas memori fisik, register CPU, dan instruksi mesin tanpa layer abstraksi runtime.',
      frontBullets: [
        'Manipulasi Alamat Hexadecimal (&a)',
        'Stack Frame vs Heap Buffer Dinamis',
        'Kontrol Register CPU (RAX, RBX, Syscall)',
      ],
      backCode: `// Manipulasi Pointer C
int a = 42;
int *ptr = &a; // simpan alamat
*ptr = 99;     // dereferensi nilai
printf("%d", a); // Output: 99`,
      backExplanation: 'Memungkinkan optimasi perangkat keras ultra cepat, firmware, kernel OS, dan engine game 3D.',
      linkPath: '/materi',
      linkLabel: 'Pelajari Bahasa Low-Level',
    },
    {
      id: 'high',
      badge: 'Level Tinggi (Populer)',
      title: 'Modern & Produktif',
      languages: 'Python, JavaScript, TypeScript, Go',
      color: '#8b5cf6',
      icon: <LuCode size={32} />,
      frontSummary: 'Bahasa ekspresif dengan sintaks bersih, ekosistem masif, dan eksekusi dinamis untuk web, app & AI.',
      frontBullets: [
        'Bubble Sort & Sorting Visual 60 FPS',
        'Asynchronous Event Loop & Promise',
        'Goroutine & Concurrency Model',
      ],
      backCode: `# Python Bubble Sort Swap
if arr[j] > arr[j + 1]:
    arr[j], arr[j + 1] = arr[j + 1], arr[j]
# Elemen terbesar mengapung ke kanan!`,
      backExplanation: 'Pilihan terbaik untuk pemula membangun aplikasi dunia nyata, analisis data, dan antarmuka interaktif.',
      linkPath: '/materi',
      linkLabel: 'Pelajari Bahasa Modern',
    },
    {
      id: 'esoteric',
      badge: 'Tersulit & Esoterik',
      title: 'Tantangan Logika Ekstrem',
      languages: 'Haskell, Brainfuck, Prolog, Malbolge',
      color: '#ec4899',
      icon: <LuBrain size={32} />,
      frontSummary: 'Menguji batas kemampuan nalar komputasi manusia dengan bahasa berparadigma non-konvensional.',
      frontBullets: [
        'Simulasi Pita Memori Turing Brainfuck',
        'Rekursi Fungsional Murni & Monad Haskell',
        'Pemrograman Deklaratif Logika Prolog',
      ],
      backCode: `;; Brainfuck Memory Tape:
;; +++>++  (Isi sel 0=3, sel 1=2)
;; [ - < + > ] (Pindahkan nilai)
;; Pita sel memori bergerak dinamis!`,
      backExplanation: 'Membuktikan konsep Turing-Completeness dan melatih pola pikir komputasional tingkat mahir.',
      linkPath: '/materi',
      linkLabel: 'Uji Logika Esoterik',
    },
  ]

  return (
    <div className="flashcards-wrapper">
      <div className="flashcards-grid">
        {cardsData.map((card) => {
          const isFlipped = flippedCards[card.id]
          return (
            <div
              key={card.id}
              className={`flashcard-scene ${isFlipped ? 'is-flipped' : ''}`}
              onClick={() => toggleFlip(card.id)}
            >
              <div className="flashcard-inner">
                {/* FRONT SIDE */}
                <div
                  className="flashcard-face flashcard-front glass-card"
                  style={{ borderColor: isFlipped ? card.color : 'rgba(139, 92, 246, 0.2)' }}
                >
                  <div className="card-top-action">
                    <span
                      className="card-tier-pill"
                      style={{ color: card.color, borderColor: card.color, background: `${card.color}15` }}
                    >
                      {card.badge}
                    </span>
                    <button
                      className="btn-flip-hint"
                      type="button"
                      title="Klik untuk membalik kartu"
                    >
                      <LuRotateCw size={14} /> Balik
                    </button>
                  </div>

                  <div className="card-icon-hero" style={{ color: card.color }}>
                    {card.icon}
                  </div>

                  <h3 className="card-face-title">{card.title}</h3>
                  <span className="card-languages-tag">{card.languages}</span>

                  <p className="card-front-desc">{card.frontSummary}</p>

                  <ul className="card-front-bullets">
                    {card.frontBullets.map((bullet, idx) => (
                      <li key={idx}>
                        <LuCheck size={14} style={{ color: card.color }} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="card-bottom-click-cta">
                    <span>Klik kartu untuk melihat contoh kode</span>
                  </div>
                </div>

                {/* BACK SIDE */}
                <div
                  className="flashcard-face flashcard-back glass-card"
                  style={{ borderColor: card.color }}
                >
                  <div className="card-top-action">
                    <span className="card-back-badge" style={{ color: card.color }}>
                      Contoh Kode & Memori
                    </span>
                    <button className="btn-flip-hint" type="button">
                      <LuRotateCw size={14} /> Balik Depan
                    </button>
                  </div>

                  <div className="code-snippet-box">
                    <pre><code>{card.backCode}</code></pre>
                  </div>

                  <p className="card-back-explanation">{card.backExplanation}</p>

                  <Link
                    to={card.linkPath}
                    className="btn-card-explore"
                    style={{ background: card.color }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{card.linkLabel}</span>
                    <LuArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
