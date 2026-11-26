import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Terminal,
  Code,
  Layers,
  Cpu,
} from 'lucide-react'
import {
  LuFlame,
  LuZap,
  LuSparkles,
  LuCode,
  LuTerminal,
  LuLayers,
  LuCpu,
  LuBinary,
  LuBookOpen,
  LuSlidersHorizontal,
  LuCheckCheck,
} from 'react-icons/lu'
import { getStreakData } from '../utils/streakManager'
import CharacterAvatar from '../components/CharacterAvatar'
import AlgorithmVisualizer from '../components/AlgorithmVisualizer'
import LanguageTierFlashcards from '../components/LanguageTierFlashcards'
import StatsCounter from '../components/StatsCounter'
import FeatureCard from '../components/FeatureCard'
import './Home.css'

function Home() {
  const programmingFeatures = [
    {
      icon: <LuCode size={28} className="icon-cyan" />,
      title: 'Visualisasi Algoritma 60 FPS',
      description: 'Lihat bagaimana Bubble Sort, Binary Search, dan sorting lainnya memindahkan elemen secara nyata dan sinkron dengan baris kode.',
      mobileDescription: 'Lihat sorting & search bergerak 60 FPS sinkron baris kode.',
    },
    {
      icon: <LuLayers size={28} className="icon-violet" />,
      title: 'Simulator Pointer & RAM C',
      description: 'Pahami konsep pointer, dereferensi, dan alokasi memori Stack vs Heap yang selama ini dianggap rumit oleh mahasiswa/pelajar.',
      mobileDescription: 'Visualisasi pointer, alamat RAM, dan Stack vs Heap.',
    },
    {
      icon: <LuSparkles size={28} className="icon-orange" />,
      title: 'Gamifikasi Belajar Interaktif',
      description: 'Raih XP points, pertahankan streak harian, dan taklukkan kuis interaktif tebak output program dengan umpan balik instan.',
      mobileDescription: 'Kumpulkan XP, jaga streak harian, dan latihan kuis instan.',
    },
    {
      icon: <LuCpu size={28} className="icon-cyan" />,
      title: 'Semua Tingkatan Bahasa',
      description: 'Tersedia mulai dari Low-Level (Assembly x86, C, Rust), High-Level (Python, JS, Go), hingga bahasa tersulit esoterik (Haskell, Brainfuck, Malbolge).',
      mobileDescription: 'Dari Assembly & C, Python & JS, hingga Brainfuck.',
    },
    {
      icon: <Terminal size={28} className="icon-pink" />,
      title: 'Alur Onboarding Karakter',
      description: 'Ditemani asisten karakter virtual yang ramah dan siap memandu penyesuaian materi sesuai tingkat kemahiranmu.',
      mobileDescription: 'Dipandu karakter virtual sesuai level belajarmu.',
    },
    {
      icon: <LuZap size={28} className="icon-orange" />,
      title: 'Benchmark & Data Logger',
      description: 'Hitung komparasi, swap, dan ekspor analisis asimtotik Big-O ke format CSV untuk laporan praktikum koding.',
      mobileDescription: 'Catat swap, komparasi, dan ekspor data Big-O ke CSV.',
    },
  ]

  return (
    <div className="home">
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
        </div>

        <div className="container hero-content">
          {/* Left Column: Smaller, concise & clean text */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">
              Belajar Coding & Algoritma, <br />
              <span className="gradient-text">Secara Visual & Nyata.</span>
            </h1>

            <p className="hero-subtitle">
              Pahami logika program, simulasi memori pointer, dan kuasai algoritma dengan alur belajar gamifikasi yang menyenangkan.
            </p>

            <div className="hero-actions">
              <Link to="/onboarding" className="btn btn-primary">
                <Play size={16} fill="currentColor" /> Mulai Belajar
              </Link>
              <Link to="/simulasi" className="btn btn-outline">
                Visualizer <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Character Avatar without bubbles/orbits */}
          <motion.div
            className="hero-avatar-column"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="hero-avatar-card">
              <div className="avatar-graphic-wrap">
                <CharacterAvatar size={240} emotion="happy" animated={true} showTooltip={true} />
              </div>
              <div className="avatar-speech-tag">
                <span>Hai! Aku siap memandu kamu belajar koding dan algoritma hari ini.</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES HIGHLIGHT ===== */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2>Mengapa Belajar di Kinetix Code?</h2>
          </div>

          <div className="features-grid">
            {programmingFeatures.map((feat, i) => (
              <FeatureCard key={i} {...feat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIVE ALGORITHM VISUALIZER SHOWCASE ON HOME ===== */}
      <section className="section home-visualizer-section">
        <div className="container">
          <div className="section-header">
            <h2>Simulasi Visual Algoritma Realtime</h2>
          </div>

          <div className="home-visualizer-embed">
            <AlgorithmVisualizer />
          </div>
        </div>
      </section>

      {/* ===== 3 TIER PROGRAMMING LANGUAGES FLASHCARDS ===== */}
      <section className="section language-tiers-section">
        <div className="container">
          <div className="section-header">
            <h2>Dari Level Bare Metal Hingga Tersulit</h2>
          </div>

          <LanguageTierFlashcards />
        </div>
      </section>
    </div>
  )
}

export default Home
