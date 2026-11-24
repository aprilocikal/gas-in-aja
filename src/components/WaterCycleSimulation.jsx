import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  LuSun,
  LuCloud,
  LuCloudRain,
  LuDroplets,
  LuThermometer,
  LuBookmarkPlus,
  LuCheck,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './WaterCycleSimulation.css'

function WaterCycleSimulation({ onLogExperiment }) {
  const [temperature, setTemperature] = useState(25)
  const [humidity, setHumidity] = useState(60)
  const [showInfo, setShowInfo] = useState(null)
  const [loggedAnim, setLoggedAnim] = useState(false)

  const evapRate = Math.min(100, Math.max(0, (temperature - 10) * 3))
  const condRate = Math.min(100, humidity * 1.2)
  const rainChance = humidity > 70 && temperature > 15

  const stages = [
    {
      id: 'evaporasi',
      title: 'Evaporasi',
      icon: <LuSun size={20} className="icon-orange" />,
      color: '#f97316',
      desc: 'Proses penguapan air dari permukaan (laut, sungai, danau) akibat radiasi termal matahari. Molekul air bertransformasi dari fase cair menjadi uap gas.',
      value: `${evapRate.toFixed(0)}%`,
    },
    {
      id: 'kondensasi',
      title: 'Kondensasi',
      icon: <LuCloud size={20} style={{ color: '#93c5fd' }} />,
      color: '#60a5fa',
      desc: 'Uap air membubung ke troposfer yang bersuhu rendah, mengalami pendinginan adiabatik, dan mengembun menjadi droplet mikro pembentuk awan.',
      value: `${condRate.toFixed(0)}%`,
    },
    {
      id: 'presipitasi',
      title: 'Presipitasi',
      icon: <LuCloudRain size={20} style={{ color: '#38bdf8' }} />,
      color: '#38bdf8',
      desc: 'Agregasi droplet awan mencapai massa kritis yang tidak lagi tertopang arus konveksi udara, lalu jatuh sebagai hujan.',
      value: rainChance ? 'Hujan Aktif' : 'Stabil',
    },
    {
      id: 'koleksi',
      title: 'Infiltrasi & Aliran',
      icon: <LuDroplets size={20} style={{ color: '#06b6d4' }} />,
      color: '#06b6d4',
      desc: 'Air hujan mengalir melalui DAS (Daerah Aliran Sungai) dan infiltrasi ke akuifer tanah menuju perairan terbuka.',
      value: 'Sirkulasi Tertutup',
    },
  ]

  return (
    <div className="water-cycle-sim">
      <div className="water-cycle-visual">
        <div className="cycle-scene">
          {/* Sun */}
          <motion.div
            className="cycle-sun-wrap"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LuSun size={48} className="sun-icon-svg" />
          </motion.div>

          {/* Clouds */}
          <motion.div
            className="cycle-cloud-wrap cloud-1"
            animate={{ x: [0, 25, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: Math.max(0.3, condRate / 100) }}
          >
            <LuCloud size={54} className="cloud-icon-svg" />
          </motion.div>
          <motion.div
            className="cycle-cloud-wrap cloud-2"
            animate={{ x: [0, -20, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: Math.max(0.2, condRate / 130) }}
          >
            <LuCloud size={62} className="cloud-icon-svg-dim" />
          </motion.div>

          {/* Rain */}
          {rainChance && (
            <div className="cycle-rain">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="raindrop-wrap"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 170, opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.12,
                    ease: 'easeIn',
                  }}
                >
                  <LuDroplets size={14} className="rain-icon-svg" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Evaporation arrows */}
          <div className="cycle-evap">
            {evapRate > 15 &&
              [...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="evap-particle"
                  initial={{ y: 0, opacity: 0.8 }}
                  animate={{ y: -110, opacity: 0 }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    delay: i * 0.35,
                  }}
                />
              ))}
          </div>

          {/* Water body */}
          <motion.div
            className="cycle-water"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Mountain */}
          <div className="cycle-mountain" />
        </div>
      </div>

      <div className="water-cycle-controls">
        <div className="sim-controls-header">
          <span className="sim-badge">Termodinamika Atmosfer</span>
          <h3>
            <LuThermometer size={20} style={{ display: 'inline', marginRight: 6, verticalAlign: -2 }} />
            Parameter Lingkungan
          </h3>
        </div>

        <div className="sim-control-group">
          <div className="sim-label-row">
            <span>Temperatur Lingkungan</span>
            <strong className="orange-highlight">{temperature}°C</strong>
          </div>
          <input
            type="range"
            min="0"
            max="45"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="sim-slider"
          />
        </div>

        <div className="sim-control-group">
          <div className="sim-label-row">
            <span>Kelembaban Udara (Relative Humidity)</span>
            <strong className="orange-highlight">{humidity}%</strong>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={humidity}
            onChange={(e) => setHumidity(Number(e.target.value))}
            className="sim-slider"
          />
        </div>

        {onLogExperiment && (
          <div style={{ marginBottom: '1.25rem' }}>
            <motion.button
              className="btn btn-outline"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderColor: loggedAnim ? 'rgba(16, 185, 129, 0.5)' : 'rgba(249, 115, 22, 0.35)',
                color: loggedAnim ? '#34d399' : 'var(--text-main)',
                background: loggedAnim ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onLogExperiment({
                  topic: 'Termodinamika Siklus Air',
                  var1: `${temperature}°C (Suhu)`,
                  var2: `${humidity}% (Kelembaban)`,
                  result: `Evaporasi: ${evapRate.toFixed(0)}%, Kondensasi: ${condRate.toFixed(0)}%, Status: ${rainChance ? 'Presipitasi (Hujan)' : 'Stabil (Uap)'}`,
                })
                playSoundCue('log')
                setLoggedAnim(true)
                setTimeout(() => setLoggedAnim(false), 1600)
              }}
            >
              {loggedAnim ? (
                <>
                  <LuCheck size={16} /> Data Berhasil Dicatat ke Log!
                </>
              ) : (
                <>
                  <LuBookmarkPlus size={16} className="icon-orange" /> Catat Titik Data Eksperimen
                </>
              )}
            </motion.button>
          </div>
        )}

        <div className="cycle-stages">
          {stages.map((stage) => (
            <motion.div
              key={stage.id}
              className={`cycle-stage ${showInfo === stage.id ? 'stage-expanded' : ''}`}
              onClick={() => setShowInfo(showInfo === stage.id ? null : stage.id)}
              whileHover={{ scale: 1.01 }}
            >
              <div className="stage-header">
                <span className="stage-icon-wrap">{stage.icon}</span>
                <div className="stage-info">
                  <strong>{stage.title}</strong>
                  <span className="stage-value" style={{ color: stage.color }}>
                    {stage.value}
                  </span>
                </div>
                {showInfo === stage.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <AnimatePresence>
                {showInfo === stage.id && (
                  <motion.p
                    className="stage-desc"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {stage.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WaterCycleSimulation
