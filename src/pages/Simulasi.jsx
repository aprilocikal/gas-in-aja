import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LuCode,
  LuFileSpreadsheet,
  LuDownload,
  LuTrash2,
  LuZap,
  LuTerminal,
  LuSparkles,
  LuCheck,
} from 'react-icons/lu'
import AlgorithmVisualizer from '../components/AlgorithmVisualizer'
import InteractiveCodingPath from '../components/InteractiveCodingPath'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './Simulasi.css'

function Simulasi() {
  const [searchParams] = useSearchParams()
  const langParam = searchParams.get('lang') || 'python'

  // Log Data / Algorithm Benchmark State
  const [benchmarkLogs, setBenchmarkLogs] = useState([
    {
      id: 1,
      time: '10:14:02',
      algorithm: 'Bubble Sort (Worst Case)',
      inputSize: 'N = 8 elemen',
      metric: '36 Komparasi, 28 Swaps',
      complexity: 'O(n²)',
    },
    {
      id: 2,
      time: '10:18:45',
      algorithm: 'Pointer Dereferensi C',
      inputSize: 'Alamat: 0x7ffee4a10',
      metric: 'Direct RAM Access (1 cycle)',
      complexity: 'O(1)',
    },
  ])

  const handleExportCSV = () => {
    if (benchmarkLogs.length === 0) return
    const headers = 'ID,Waktu,Algoritma / Mekanisme,Ukuran Input / Alamat,Metrik Operasi,Kompleksitas Asimtotik\n'
    const rows = benchmarkLogs
      .map(
        (l, idx) =>
          `"${idx + 1}","${l.time}","${l.algorithm}","${l.inputSize}","${l.metric}","${l.complexity}"`
      )
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `kinetix-benchmark-algoritma-${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    playSoundCue('success')
  }

  const handleClearLogs = () => {
    setBenchmarkLogs([])
    playSoundCue('click')
  }

  return (
    <div className="simulasi-page">
      {/* Hero Section */}
      <section className="simulasi-hero">
        <div className="container">
          <motion.h1
            className="section-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Visualisasi & Simulasi <br />
            <span className="gradient-text">Eksekusi Kode Realtime</span>
          </motion.h1>

          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Amati bagaimana setiap baris instruksi Python, C, dan JavaScript dieksekusi oleh mesin. Pahami penukaran array, manipulasi pointer RAM, dan kompleksitas waktu secara visual.
          </motion.p>
        </div>
      </section>

      {/* Main Visualizer Stage */}
      <section className="section">
        <div className="container">
          {/* Algorithm Visualizer Core Component */}
          <AlgorithmVisualizer />

          {/* Gamified Coding Path Section */}
          <div style={{ marginTop: '5rem' }}>
            <h2 className="section-title">
              Peta Petualangan <span className="gradient-text">Koding Interaktif</span>
            </h2>
            <p className="section-subtitle">
              Selesaikan tantangan kode bertahap, kumpulkan XP, pertahankan streak harian, dan buktikan pemahaman logikamu!
            </p>

            <InteractiveCodingPath
              activeLanguage={langParam}
              onOpenVisualizer={() => {
                window.scrollTo({ top: 400, behavior: 'smooth' })
                playSoundCue('click')
              }}
            />
          </div>

          {/* Benchmark & Experiment Data Logger */}
          <div className="lab-logger-section glass-card" style={{ marginTop: '5rem' }}>
            <div className="logger-header">
              <div className="logger-header-left">
                <div className="logger-icon-badge">
                  <LuFileSpreadsheet size={24} className="icon-cyan" />
                </div>
                <div>
                  <div className="logger-badge-row">
                    <span className="log-count-badge">{benchmarkLogs.length} Titik Data</span>
                  </div>
                  <h3>Catatan Benchmark & Analisis Algoritma</h3>
                  <p>Rekam jumlah perbandingan, swap, dan analisis kompleksitas Big-O untuk laporan praktikum.</p>
                </div>
              </div>

              <div className="logger-header-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleExportCSV}
                  disabled={benchmarkLogs.length === 0}
                  title="Unduh tabel hasil pengamatan dalam format CSV"
                >
                  <LuDownload size={15} /> Unduh CSV Laporan
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleClearLogs}
                  disabled={benchmarkLogs.length === 0}
                  title="Kosongkan tabel pengamatan"
                >
                  <LuTrash2 size={15} /> Bersihkan
                </button>
              </div>
            </div>

            {benchmarkLogs.length === 0 ? (
              <div className="logger-empty">
                <p>Belum ada data benchmark yang direkam. Jalankan simulasi algoritma di atas untuk menganalisis performa.</p>
              </div>
            ) : (
              <div className="logger-table-wrap">
                <table className="logger-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Waktu</th>
                      <th>Algoritma / Modul</th>
                      <th>Ukuran Input</th>
                      <th>Metrik Operasi</th>
                      <th>Kompleksitas Big-O</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkLogs.map((log, idx) => (
                      <tr key={log.id}>
                        <td className="col-num">{idx + 1}</td>
                        <td className="col-time">{log.time}</td>
                        <td className="col-topic"><strong>{log.algorithm}</strong></td>
                        <td className="col-var">{log.inputSize}</td>
                        <td className="col-var">{log.metric}</td>
                        <td className="col-result">
                          <span className="result-pill">{log.complexity}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Simulasi
