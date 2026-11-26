import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuArrowRight,
  LuChevronRight,
  LuTerminal,
  LuPlay,
  LuClock,
  LuLayers,
} from 'react-icons/lu'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './AlurBelajar.css'

const CURRICULUM_PHASES = [
  {
    id: 1,
    index: '01',
    phaseLabel: 'FASE 01',
    title: 'Fondasi Logika & Sintaks Modern',
    languages: ['Python', 'JavaScript'],
    difficulty: 'Pemula',
    duration: '4 Modul • ~3 Jam',
    focus: 'Control Flow & Struktur Data Dasar',
    description:
      'Membangun intuisi pemrograman dari nol: deklarasi variabel, percabangan if-else, iterasi, hingga pemanggilan fungsi modular dan rekursi.',
    mobileDescription:
      'Dasar variabel, percabangan, loop, fungsi, dan rekursi dari nol.',
    codeFilename: 'stack_frame.py',
    codeSnippet: `def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Call stack: 4 -> 3 -> 2 -> 1
print(factorial(4))  # 24`,
    keyConcepts: [
      {
        title: 'Tipe data primitif vs koleksi',
        detail: 'Membedakan integer, boolean, string dengan List, Array, dan Object.',
      },
      {
        title: 'Iterasi & loop control flow',
        detail: 'Mengendalikan eksekusi berulang menggunakan for, while, break, dan continue.',
      },
      {
        title: 'Rekursi dasar & Call Stack',
        detail: 'Memahami bagaimana fungsi memanggil dirinya sendiri dan menumpuk frame eksekusi.',
      },
      {
        title: 'Struktur data inti',
        detail: 'Operasi insert, lookup, dan traversal pada Array dinamis serta Hash Map.',
      },
    ],
    outputSkill:
      'Mampu menyusun logika algoritma dasar, membaca alur eksekusi fungsi, dan memecahkan studi kasus modular secara mandiri.',
  },
  {
    id: 2,
    index: '02',
    phaseLabel: 'FASE 02',
    title: 'Algoritma Sorting & Visualisasi Eksekusi',
    languages: ['Python', 'C', 'JavaScript'],
    difficulty: 'Menengah',
    duration: '5 Modul • ~4 Jam',
    focus: 'Kompleksitas & Analisis Big-O',
    description:
      'Mengamati langkah demi langkah bagaimana Bubble Sort, Selection Sort, dan Binary Search membandingkan serta menukar elemen secara sinkron.',
    mobileDescription:
      'Visualisasi Bubble Sort, Selection Sort, Binary Search, dan Big-O.',
    codeFilename: 'bubble_sort.py',
    codeSnippet: `for i in range(len(arr)):
    swapped = False
    for j in range(0, len(arr) - i - 1):
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
            swapped = True
    if not swapped:
        break  # Early exit O(n)`,
    keyConcepts: [
      {
        title: 'Perbandingan elemen bersebelahan',
        detail: 'Mekanisme evaluasi arr[j] > arr[j + 1] pada setiap pass iterasi.',
      },
      {
        title: 'Operasi swap & in-place sorting',
        detail: 'Pertukaran nilai di memori tanpa mengalokasikan array tambahan.',
      },
      {
        title: 'Analisis asimtotik Big-O',
        detail: 'Mengukur pertumbuhan waktu O(n²), O(n log n), serta ruang O(1).',
      },
      {
        title: 'Optimasi early exit',
        detail: 'Memotong iterasi berlebih menggunakan flag boolean saat array sudah terurut.',
      },
    ],
    outputSkill:
      'Memahami trade-off efisiensi algoritma dan mampu menganalisis kompleksitas waktu serta ruang pada kode nyata.',
  },
  {
    id: 3,
    index: '03',
    phaseLabel: 'FASE 03',
    title: 'Manajemen Memori Fisik & Pointer C',
    languages: ['C', 'C++'],
    difficulty: 'Lanjutan',
    duration: '5 Modul • ~5 Jam',
    focus: 'RAM Addressing, Stack & Heap',
    description:
      'Membuka lapisan abstraksi bahasa tingkat tinggi: membaca alamat memori RAM secara langsung, dereferensi pointer, dan mengelola alokasi Heap.',
    mobileDescription:
      'Alamat memori RAM, pointer dereferensi, serta Stack vs Heap.',
    codeFilename: 'memory_ptr.c',
    codeSnippet: `int value = 42;
int *ptr = &value;      // Simpan alamat RAM
*ptr = 99;              // Ubah langsung di alamatnya

int *buf = malloc(4 * sizeof(int));
free(buf);              // Cegah memory leak`,
    keyConcepts: [
      {
        title: 'Operator alamat (&) & dereferensi (*)',
        detail: 'Mengakses lokasi byte di memori fisik dan memodifikasi nilainya melalui pointer.',
      },
      {
        title: 'Stack Frame vs Heap dinamis',
        detail: 'Perbedaan lifetime variabel lokal dengan alokasi manual malloc dan free.',
      },
      {
        title: 'Pointer arithmetic & offset',
        detail: 'Navigasi elemen array secara langsung menggunakan pergeseran alamat memori.',
      },
      {
        title: 'Keamanan memori dasar',
        detail: 'Mendeteksi dan mencegah Memory Leak, Dangling Pointer, serta Segmentation Fault.',
      },
    ],
    outputSkill:
      'Menguasai kontrol penuh atas alokasi memori fisik dan memahami akar performa perangkat lunak sistem.',
  },
  {
    id: 4,
    index: '04',
    phaseLabel: 'FASE 04',
    title: 'Instruksi Bare Metal & Register CPU',
    languages: ['x86-64 NASM'],
    difficulty: 'Tingkat Rendah',
    duration: '4 Modul • ~5 Jam',
    focus: 'Arsitektur Register & Linux Syscall',
    description:
      'Berinteraksi langsung dengan prosesor tanpa perantara runtime: memindahkan data antar register 64-bit dan memicu syscall sistem operasi.',
    mobileDescription:
      'Register CPU 64-bit, instruksi dasar Assembly, dan Linux syscall.',
    codeFilename: 'hello.asm',
    codeSnippet: `section .text
global _start
_start:
    mov rax, 1          ; sys_write
    mov rdi, 1          ; stdout
    mov rsi, msg        ; pointer buffer
    mov rdx, 13         ; panjang byte
    syscall`,
    keyConcepts: [
      {
        title: 'Register umum x86-64',
        detail: 'Peran RAX (akumulator), RBX, RDI, RSI, dan RDX dalam konvensi pemanggilan.',
      },
      {
        title: 'Instruksi inti prosesor',
        detail: 'Manipulasi nilai dan alur lompatan dengan MOV, ADD, SUB, CMP, dan JMP.',
      },
      {
        title: 'Linux Syscall Interface',
        detail: 'Memanggil layanan kernel seperti sys_write dan sys_exit lewat instruksi syscall.',
      },
      {
        title: 'Struktur biner ELF',
        detail: 'Pemisahan section .data, .bss, dan .text pada file executable Linux.',
      },
    ],
    outputSkill:
      'Memahami bagaimana instruksi mesin dieksekusi oleh CPU dan bagaimana program berkomunikasi dengan kernel OS.',
  },
  {
    id: 5,
    index: '05',
    phaseLabel: 'FASE 05',
    title: 'Logika Esoterik & Mesin Turing Universal',
    languages: ['Brainfuck', 'Haskell', 'Prolog'],
    difficulty: 'Ekstrem',
    duration: '3 Modul • ~4 Jam',
    focus: 'Paradigma Fungsional, Deklaratif & Turing Tape',
    description:
      'Keluar dari pola pikir imperatif: mengeksplorasi pita memori 30.000 sel, fungsi murni tanpa side-effect, dan penalaran berbasis predikat.',
    mobileDescription:
      'Pita Turing Brainfuck, fungsional murni Haskell, dan logika Prolog.',
    codeFilename: 'turing_tape.bf',
    codeSnippet: `+++++ +++++       ; Cell[0] = 10
[ > +++++ ++ < - ] ; Loop: Cell[1] = 70 ('F')
> ++ .            ; Tambah 2 -> 'H', cetak ASCII`,
    keyConcepts: [
      {
        title: 'Model Pita Turing 30.000 byte',
        detail: 'Menggeser pointer sel dan memanipulasi byte hanya dengan 8 simbol Brainfuck.',
      },
      {
        title: 'Pembuktian Turing-Completeness',
        detail: 'Memahami batas minimal instruksi yang dibutuhkan untuk komputasi universal.',
      },
      {
        title: 'Pemrograman fungsional murni',
        detail: 'Immutability, higher-order functions, dan pattern matching di Haskell.',
      },
      {
        title: 'Pemrograman logika deklaratif',
        detail: 'Menyusun fakta, aturan, dan resolusi query berbasis relasi di Prolog.',
      },
    ],
    outputSkill:
      'Mengembangkan fleksibilitas abstraksi berpikir lintas paradigma untuk memecahkan persoalan komputasi kompleks.',
  },
]

export default function AlurBelajar() {
  const [selectedPhase, setSelectedPhase] = useState(1)

  const activePhase =
    CURRICULUM_PHASES.find((p) => p.id === selectedPhase) || CURRICULUM_PHASES[0]
  const nextPhase = CURRICULUM_PHASES.find((p) => p.id === selectedPhase + 1)

  const handleSelectPhase = (id) => {
    setSelectedPhase(id)
    playSoundCue('click')
  }

  return (
    <div className="alur-page">
      {/* ===== EDITORIAL HEADER ===== */}
      <section className="alur-header">
        <div className="container">
          <div className="alur-header-grid">
            <div className="alur-header-copy">
              <div className="alur-eyebrow">
                <span>KURIKULUM KINETIX</span>
                <span className="eyebrow-sep">/</span>
                <span>5 TAHAP BERJENJANG</span>
              </div>
              <h1 className="alur-title">Alur Belajar & Silabus Komputasi</h1>
              <p className="alur-subtitle">
                <span className="text-desktop">
                  Jalur terstruktur dari sintaks pertama dan visualisasi algoritma, hingga
                  manajemen memori RAM, register x86-64, dan teori mesin Turing.
                </span>
                <span className="text-mobile">
                  5 fase belajar dari dasar sintaks, sorting, memori C, hingga Assembly.
                </span>
              </p>
            </div>

            <div className="alur-header-actions">
              <Link to="/onboarding" className="alur-btn-primary">
                <LuPlay size={15} fill="currentColor" />
                <span>Mulai Belajar</span>
              </Link>
              <Link to="/simulasi" className="alur-btn-secondary">
                <span>Buka Visualizer</span>
                <LuArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="alur-meta-strip">
            <div className="meta-strip-item">
              <span className="meta-strip-val">05</span>
              <span className="meta-strip-label">Fase Kurikulum</span>
            </div>
            <div className="meta-strip-divider" />
            <div className="meta-strip-item">
              <span className="meta-strip-val">21</span>
              <span className="meta-strip-label">Modul Praktik</span>
            </div>
            <div className="meta-strip-divider" />
            <div className="meta-strip-item">
              <span className="meta-strip-val">8+</span>
              <span className="meta-strip-label">Bahasa & Paradigma</span>
            </div>
            <div className="meta-strip-divider" />
            <div className="meta-strip-item">
              <span className="meta-strip-val">~21 Jam</span>
              <span className="meta-strip-label">Total Estimasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CURRICULUM WORKSPACE ===== */}
      <section className="alur-workspace">
        <div className="container">
          <div className="alur-split-grid">
            {/* LEFT: Clean Vertical Track */}
            <aside className="track-column" aria-label="Daftar Fase Kurikulum">
              <div className="track-column-head">
                <span className="track-label">DAFTAR FASE</span>
                <span className="track-progress-text">
                  {activePhase.index} / 0{CURRICULUM_PHASES.length}
                </span>
              </div>

              <div className="track-list" role="tablist">
                {CURRICULUM_PHASES.map((phase, idx) => {
                  const isSelected = phase.id === selectedPhase
                  const isCompletedStep = phase.id < selectedPhase
                  const isLast = idx === CURRICULUM_PHASES.length - 1

                  return (
                    <button
                      key={phase.id}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      className={`track-item ${isSelected ? 'is-active' : ''} ${
                        isCompletedStep ? 'is-passed' : ''
                      }`}
                      onClick={() => handleSelectPhase(phase.id)}
                    >
                      <div className="track-rail">
                        <span className="track-node">{phase.index}</span>
                        {!isLast && <span className="track-line" />}
                      </div>

                      <div className="track-body">
                        <div className="track-top-row">
                          <span className="track-diff">{phase.difficulty}</span>
                          <span className="track-dur">{phase.duration.split('•')[0].trim()}</span>
                        </div>
                        <h3 className="track-title">{phase.title}</h3>
                        <div className="track-langs">
                          {phase.languages.map((lang) => (
                            <span key={lang} className="track-lang-tag">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>

                      <LuChevronRight size={16} className="track-chevron" />
                    </button>
                  )
                })}
              </div>
            </aside>

            {/* RIGHT: Detailed Syllabus Inspector */}
            <div className="syllabus-column">
              <AnimatePresence mode="wait">
                <motion.article
                  key={activePhase.id}
                  className="syllabus-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  {/* Top Bar */}
                  <div className="syllabus-topbar">
                    <div className="syllabus-breadcrumb">
                      <span className="crumb-code">{activePhase.phaseLabel}</span>
                      <span className="crumb-sep">/</span>
                      <span className="crumb-focus">{activePhase.focus}</span>
                    </div>
                    <span className="syllabus-level-tag">{activePhase.difficulty}</span>
                  </div>

                  {/* Title & Overview */}
                  <div className="syllabus-head">
                    <h2>{activePhase.title}</h2>
                    <p className="syllabus-desc text-desktop">{activePhase.description}</p>
                    <p className="syllabus-desc text-mobile">{activePhase.mobileDescription}</p>

                    <div className="syllabus-specs">
                      <div className="spec-item">
                        <LuTerminal size={14} />
                        <span>{activePhase.languages.join(', ')}</span>
                      </div>
                      <div className="spec-item">
                        <LuClock size={14} />
                        <span>{activePhase.duration}</span>
                      </div>
                      <div className="spec-item">
                        <LuLayers size={14} />
                        <span>{activePhase.keyConcepts.length} Topik Inti</span>
                      </div>
                    </div>
                  </div>

                  {/* Code Preview Block */}
                  <div className="syllabus-code-box">
                    <div className="code-box-header">
                      <span className="code-filename">{activePhase.codeFilename}</span>
                      <span className="code-caption">Cuplikan Materi</span>
                    </div>
                    <pre className="code-box-pre">
                      <code>{activePhase.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Structured Topic List */}
                  <div className="syllabus-topics">
                    <h4 className="syllabus-section-title">Materi yang Dipelajari</h4>
                    <ol className="topics-list">
                      {activePhase.keyConcepts.map((item, i) => (
                        <li key={i} className="topic-row">
                          <span className="topic-num">0{i + 1}</span>
                          <div className="topic-content">
                            <span className="topic-name">{item.title}</span>
                            <span className="topic-detail text-desktop">{item.detail}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Target Outcome */}
                  <div className="syllabus-outcome">
                    <span className="outcome-label">Target Kompetensi</span>
                    <p>{activePhase.outputSkill}</p>
                  </div>

                  {/* Footer Actions */}
                  <div className="syllabus-footer">
                    <Link to="/onboarding" className="alur-btn-primary syllabus-cta">
                      <LuPlay size={14} fill="currentColor" />
                      <span>Mulai {activePhase.phaseLabel}</span>
                    </Link>

                    {nextPhase && (
                      <button
                        type="button"
                        className="syllabus-next-btn"
                        onClick={() => handleSelectPhase(nextPhase.id)}
                      >
                        <span>Lanjut ke {nextPhase.phaseLabel}</span>
                        <LuArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
