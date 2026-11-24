import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LuCode,
  LuCpu,
  LuLayers,
  LuBinary,
  LuArrowDown,
  LuCheck,
  LuSparkles,
  LuPlay,
  LuArrowRight,
  LuTerminal,
  LuBrain,
  LuBookOpen,
} from 'react-icons/lu'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './AlurBelajar.css'

export default function AlurBelajar() {
  const [selectedPhase, setSelectedPhase] = useState(1)
  const [activeFilter, setActiveFilter] = useState('all')

  const flowchartPhases = [
    {
      id: 1,
      phaseNumber: 'FASE 01',
      title: 'Fondasi Logika & Sintaks Modern',
      category: 'beginner',
      language: 'Python & JavaScript',
      difficulty: 'Tingkat Pemula',
      icon: <LuCode size={26} />,
      badgeColor: '#06b6d4',
      description: 'Membangun intuisi pemrograman: deklarasi variabel, percabangan logika if-else, struktur loop, dan pemanggilan fungsi modular.',
      keyConcepts: [
        'Tipe data primitif vs koleksi (List, Array, Object)',
        'Iterasi & loop control flow (for, while, break)',
        'Rekursi dasar & Call Stack pemanggilan fungsi',
        'Struktur data dasar: Array dinamis & Hash Map',
      ],
      outputSkill: 'Mampu menyusun logika algoritma dasar dan memecahkan studi kasus modular.',
    },
    {
      id: 2,
      phaseNumber: 'FASE 02',
      title: 'Algoritma Sorting & Visualisasi Eksekusi',
      category: 'algorithms',
      language: 'Python, C, JavaScript',
      difficulty: 'Tingkat Menengah',
      icon: <LuSparkles size={26} />,
      badgeColor: '#f59e0b',
      description: 'Melihat secara visual bagaimana algoritma Bubble Sort, Selection Sort, dan Binary Search membandingkan serta menukar elemen secara sinkron baris demi baris.',
      keyConcepts: [
        'Mekanisme perbandingan adjacent elements (arr[j] > arr[j+1])',
        'Operasi swap memori dan pengapungan nilai maksimum',
        'Analisis asimtotik Big-O: Waktu O(n^2) dan Ruang O(1)',
        'Optimasi early exit dengan flag is_swapped',
      ],
      outputSkill: 'Memahami efisiensi algoritma dan mampu menganalisis kompleksitas komputasi.',
    },
    {
      id: 3,
      phaseNumber: 'FASE 03',
      title: 'Manajemen Memori Fisik & Pointer C',
      category: 'systems',
      language: 'Bahasa C & C++',
      difficulty: 'Tingkat Lanjutan',
      icon: <LuLayers size={26} />,
      badgeColor: '#8b5cf6',
      description: 'Menyingkap misteri di balik abstraksi bahasa tinggi: mengendalikan alamat memori RAM (0x7ffee...), operator dereferensi (*ptr), dan alokasi Stack vs Heap.',
      keyConcepts: [
        'Operator alamat (&) dan operator dereferensi (*)',
        'Stack Frame fungsi lokal vs Heap dinamis (malloc/free)',
        'Pointer arithmetic & traversal array via memory offset',
        'Pencegahan Memory Leak dan Segmentation Fault',
      ],
      outputSkill: 'Menguasai kontrol penuh atas alokasi memori fisik dan performa perangkat lunak tingkat tinggi.',
    },
    {
      id: 4,
      phaseNumber: 'FASE 04',
      title: 'Instruksi Bare Metal & Register CPU',
      category: 'lowlevel',
      language: 'Assembly (x86-64 NASM)',
      difficulty: 'Tingkat Rendah (Bare Metal)',
      icon: <LuCpu size={26} />,
      badgeColor: '#ef4444',
      description: 'Berkomunikasi langsung dengan prosesor silikon tanpa perantara kompiler: manipulasi register 64-bit dan trigger panggilan sistem operasi (syscall).',
      keyConcepts: [
        'Arsitektur register umum: RAX (akumulator), RBX, RDI, RSI',
        'Instruksi dasar MOV, ADD, SUB, CMP, JMP',
        'Linux Syscall Interface (sys_write, sys_exit via syscall)',
        'Data section vs Text section pada file executable ELF',
      ],
      outputSkill: 'Memahami cara sistem operasi dan prosesor fisik mengeksekusi instruksi biner mesin.',
    },
    {
      id: 5,
      phaseNumber: 'FASE 05',
      title: 'Logika Esoterik & Mesin Turing Universal',
      category: 'esoteric',
      language: 'Brainfuck, Haskell, Prolog',
      difficulty: 'Tantangan Ekstrem',
      icon: <LuBrain size={26} />,
      badgeColor: '#ec4899',
      description: 'Mendobrak batasan paradigma imperatif: eksplorasi pita memori sel tak hingga dan pembuktian Turing-Completeness dengan sintaks minimalis ekstrem.',
      keyConcepts: [
        'Model komputasi Pita Turing 30.000 byte dan pointer sel',
        'Instruksi 8 karakter Brainfuck (+ - < > [ ] . ,)',
        'Paradigma fungsional murni tanpa efek samping (Pure Haskell)',
        'Pemrograman deklaratif berbasis relasi & predikat (Prolog)',
      ],
      outputSkill: 'Mengembangkan abstraksi berpikir tingkat tinggi untuk memecahkan persoalan komputasi abstrak.',
    },
  ]

  const activePhaseData = flowchartPhases.find((p) => p.id === selectedPhase) || flowchartPhases[0]

  return (
    <div className="alur-page">
      {/* ===== HERO SECTION (Seamless Background matching Home) ===== */}
      <section className="alur-hero">
        <div className="container">
          <div className="alur-hero-content">
            <span className="tag-pill">PETA JALAN PEMROGRAMAN KOMPREHENSIF</span>
            <h1 className="alur-title">
              Alur Belajar & Kurikulum Komputasi
            </h1>
            <p className="alur-subtitle">
              Dari pemula menulis sintaks pertama, visualisasi algoritma 60 FPS, kendali pointer memori RAM, hingga instruksi bare metal CPU.
            </p>
            <div className="alur-hero-actions">
              <Link to="/onboarding" className="btn btn-primary btn-lg">
                <LuPlay size={18} fill="currentColor" /> Mulai Belajar Sekarang
              </Link>
              <Link to="/simulasi" className="btn btn-outline btn-lg">
                Coba Visualizer Algoritma <LuArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FLOWCHART ROADMAP CONTAINER ===== */}
      <section className="section flowchart-section">
        <div className="container">
          <div className="flowchart-layout-grid">
            {/* Left: The Visual Flowchart Tree */}
            <div className="flowchart-tree-column">
              <h3 className="column-label">Tahapan Kurikulum Berjenjang</h3>

              <div className="flowchart-nodes-list">
                {flowchartPhases.map((phase, idx) => {
                  const isSelected = selectedPhase === phase.id
                  return (
                    <div key={phase.id} className="flowchart-step-block">
                      <motion.div
                        className={`flowchart-card ${isSelected ? 'active' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedPhase(phase.id)
                          playSoundCue('click')
                        }}
                      >
                        <div
                          className="flow-icon-wrap"
                          style={{
                            background: `rgba(${phase.id === 1 ? '6, 182, 212' : phase.id === 2 ? '245, 158, 11' : phase.id === 3 ? '139, 92, 246' : phase.id === 4 ? '239, 68, 68' : '236, 72, 153'}, 0.15)`,
                            color: phase.badgeColor,
                            borderColor: phase.badgeColor,
                          }}
                        >
                          {phase.icon}
                        </div>

                        <div className="flow-card-info">
                          <div className="flow-card-meta">
                            <span className="flow-phase-num">{phase.phaseNumber}</span>
                            <span className="flow-phase-diff">{phase.difficulty}</span>
                          </div>
                          <h4 className="flow-card-title">{phase.title}</h4>
                          <span className="flow-card-lang">{phase.language}</span>
                        </div>

                        <div className="flow-card-arrow">
                          <LuArrowRight size={18} />
                        </div>
                      </motion.div>

                      {/* Connecting Line & Arrow between stages */}
                      {idx < flowchartPhases.length - 1 && (
                        <div className="flowchart-connector">
                          <div className="connector-line" />
                          <div className="connector-arrow">
                            <LuArrowDown size={18} />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Detailed Deep-Dive Card of Selected Phase */}
            <div className="flowchart-detail-column">
              <div className="detail-sticky-card glass-card">
                <div className="detail-header">
                  <span
                    className="detail-badge"
                    style={{
                      background: `rgba(139, 92, 246, 0.15)`,
                      color: activePhaseData.badgeColor,
                      borderColor: activePhaseData.badgeColor,
                    }}
                  >
                    {activePhaseData.phaseNumber} • {activePhaseData.difficulty}
                  </span>
                  <h2>{activePhaseData.title}</h2>
                  <span className="detail-languages">Bahasa Utama: <strong>{activePhaseData.language}</strong></span>
                </div>

                <p className="detail-desc">{activePhaseData.description}</p>

                <div className="detail-concepts-block">
                  <h4>Materi Fundamental yang Dikuasai:</h4>
                  <ul className="concepts-list">
                    {activePhaseData.keyConcepts.map((concept, i) => (
                      <li key={i}>
                        <LuCheck size={16} className="text-accent" />
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail-output-block">
                  <strong>Hasil Pembelajaran:</strong>
                  <p>{activePhaseData.outputSkill}</p>
                </div>

                <div className="detail-actions">
                  <Link to="/onboarding" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                    <LuPlay size={16} fill="currentColor" /> Masuk ke Sesi Belajar Fase Ini
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
