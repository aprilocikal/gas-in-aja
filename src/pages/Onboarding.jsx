import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Sparkles, Zap, Shield, Flame } from 'lucide-react'
import CharacterAvatar from '../components/CharacterAvatar'
import { playSoundCue } from '../components/AccessibilityToolbar'
import './Onboarding.css'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const totalSteps = 3
  const progressPercent = (step / totalSteps) * 100

  const handleFinish = () => {
    playSoundCue('success')
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/learn')
    }, 450)
  }

  const handleNext = () => {
    playSoundCue('click')
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const handleSkip = () => {
    playSoundCue('click')
    handleFinish()
  }

  const handleBack = () => {
    playSoundCue('click')
    if (step > 1) {
      setStep(step - 1)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={`onboarding-page ${isTransitioning ? 'onboarding-exit' : ''}`}>
      {/* Top Header & Progress Bar */}
      <div className="onboarding-topbar">
        <button
          className="onboarding-back-btn"
          onClick={handleBack}
          aria-label="Kembali"
        >
          <ArrowLeft size={22} />
        </button>
        <div className="onboarding-track">
          <motion.div
            className="onboarding-fill"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
        <button
          className="onboarding-skip-btn"
          onClick={handleSkip}
        >
          Lewati
        </button>
      </div>

      {/* Main Content Area */}
      <div className="onboarding-container">
        <AnimatePresence mode="wait">
          {/* STEP 1: WARM GREETING */}
          {step === 1 && (
            <motion.div
              key="step-1"
              className="onboarding-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="onboarding-char-wrap">
                <CharacterAvatar size={150} emotion="happy" animated={true} />
              </div>
              <h2 className="onboarding-heading">
                Halo! Senang banget bisa ketemu kamu!
              </h2>
              <p className="onboarding-subtext">
                Kenalin, aku asisten belajarmu di Kinetix Code. Di sini kita bakal belajar programming dengan santai, visual, dan seru tanpa bikin pusing.
              </p>
            </motion.div>
          )}

          {/* STEP 2: MOTIVATION & CASUAL CHAT */}
          {step === 2 && (
            <motion.div
              key="step-2"
              className="onboarding-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="onboarding-char-wrap">
                <CharacterAvatar size={150} emotion="thinking" animated={true} />
              </div>
              <h2 className="onboarding-heading">
                Semua materi sudah kami siapkan otomatis buat kamu!
              </h2>
              <p className="onboarding-subtext">
                Mulai dari algoritma Bubble Sort 60 FPS, memori pointer C, sampai bahasa tingkat tinggi dan esoterik. Kamu tinggal ikuti jalurnya step-by-step.
              </p>
            </motion.div>
          )}

          {/* STEP 3: "IKLAN" / PROMO SUPER SPLASH (Matches user request) */}
          {step === 3 && (
            <motion.div
              key="step-3"
              className="onboarding-card onboarding-ad-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <div className="ad-badge-top">
                <Sparkles size={16} /> SPONSOR PEMBELAJARAN
              </div>
              <div className="onboarding-char-wrap">
                <CharacterAvatar size={150} emotion="happy" animated={true} />
              </div>
              <h2 className="onboarding-heading ad-heading">
                Kinetix Super • Akses Tanpa Batas!
              </h2>
              <p className="onboarding-subtext">
                Nikmati fitur latihan algoritma tanpa batas nyawa, evaluasi kode otomatis, dan pertahankan streak belajarmu setiap hari.
              </p>

              <div className="ad-perks-list">
                <div className="ad-perk-item">
                  <Flame size={18} className="icon-orange" />
                  <span>Streak Harian Real-time</span>
                </div>
                <div className="ad-perk-item">
                  <Zap size={18} className="icon-cyan" />
                  <span>Visualizer Algoritma 60 FPS</span>
                </div>
                <div className="ad-perk-item">
                  <Shield size={18} className="icon-violet" />
                  <span>Koleksi Seluruh Bahasa Pemrograman</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Sticky Action Button */}
      <div className="onboarding-bottombar">
        <button className="onboarding-cta-btn" onClick={handleNext}>
          {step === totalSteps ? 'Mulai Petualangan Belajar Sekarang' : 'Lanjut'}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
