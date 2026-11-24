import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LuMoon,
  LuGlobe,
  LuOrbit,
  LuZap,
  LuPlay,
  LuPause,
  LuRotateCcw,
  LuBookmarkPlus,
  LuCheck,
} from 'react-icons/lu'
import { playSoundCue } from './AccessibilityToolbar'
import './InteractiveSimulation.css'

function GravitySimulation({ onLogExperiment }) {
  const canvasRef = useRef(null)
  const [mass, setMass] = useState(50)
  const [gravity, setGravity] = useState(9.8)
  const [isRunning, setIsRunning] = useState(false)
  const [loggedAnim, setLoggedAnim] = useState(false)
  const animRef = useRef(null)
  const ballRef = useRef({ y: 70, vy: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = (canvas.width = canvas.offsetWidth)
    const H = (canvas.height = canvas.offsetHeight)

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Cyber dark background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
      bgGrad.addColorStop(0, '#0a0c12')
      bgGrad.addColorStop(1, '#050508')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, W, H)

      // Ambient orange glow at top-center
      const ambient = ctx.createRadialGradient(W / 2, 0, 10, W / 2, 0, W * 0.7)
      ambient.addColorStop(0, 'rgba(249, 115, 22, 0.12)')
      ambient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = ambient
      ctx.fillRect(0, 0, W, H)

      // Tech Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1
      for (let i = 0; i < W; i += 36) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, H)
        ctx.stroke()
      }
      for (let i = 0; i < H; i += 36) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(W, i)
        ctx.stroke()
      }

      // Ground plane
      const groundY = H - 45
      ctx.fillStyle = '#0f111a'
      ctx.fillRect(0, groundY, W, 45)

      // Neon orange ground laser line
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 2
      ctx.shadowColor = '#f97316'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.moveTo(0, groundY)
      ctx.lineTo(W, groundY)
      ctx.stroke()
      ctx.shadowBlur = 0 // reset

      const ball = ballRef.current
      const radius = 16 + mass * 0.22

      // Ball shadow on ground
      const groundDist = Math.max(0, groundY - ball.y)
      const shadowAlpha = Math.max(0.05, 0.4 * (1 - groundDist / (groundY - 70)))
      ctx.fillStyle = `rgba(249, 115, 22, ${shadowAlpha})`
      ctx.beginPath()
      ctx.ellipse(W / 2, groundY + 2, radius * 0.9, radius * 0.22, 0, 0, Math.PI * 2)
      ctx.fill()

      // Glowing Ball Gradient (Deep Neon Orange)
      const ballGrad = ctx.createRadialGradient(
        W / 2 - radius * 0.35,
        ball.y - radius * 0.35,
        radius * 0.1,
        W / 2,
        ball.y,
        radius
      )
      ballGrad.addColorStop(0, '#ffedd5')
      ballGrad.addColorStop(0.3, '#fb923c')
      ballGrad.addColorStop(0.7, '#ea580c')
      ballGrad.addColorStop(1, '#9a3412')

      ctx.save()
      ctx.shadowColor = 'rgba(249, 115, 22, 0.7)'
      ctx.shadowBlur = 20
      ctx.fillStyle = ballGrad
      ctx.beginPath()
      ctx.arc(W / 2, ball.y, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Force Vector Arrow (Laser Orange/Red)
      if (isRunning && ball.y < groundY - radius) {
        const arrowLen = Math.min(100, gravity * 4.5)
        ctx.strokeStyle = '#ff9248'
        ctx.lineWidth = 3
        ctx.shadowColor = '#ff5722'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(W / 2, ball.y + radius + 4)
        ctx.lineTo(W / 2, ball.y + radius + 4 + arrowLen)
        ctx.stroke()

        // Arrow head
        ctx.fillStyle = '#ff9248'
        ctx.beginPath()
        ctx.moveTo(W / 2, ball.y + radius + 12 + arrowLen)
        ctx.lineTo(W / 2 - 6, ball.y + radius + arrowLen)
        ctx.lineTo(W / 2 + 6, ball.y + radius + arrowLen)
        ctx.fill()
        ctx.shadowBlur = 0

        // Label
        ctx.fillStyle = '#fdba74'
        ctx.font = '600 12px Inter, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(`F = ${(mass * gravity * 0.1).toFixed(1)} N`, W / 2 + 14, ball.y + radius + arrowLen / 2)
      }

      // High-tech HUD Overlay Box
      ctx.fillStyle = 'rgba(15, 17, 26, 0.85)'
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(16, 16, 190, 85, 10)
      ctx.fill()
      ctx.stroke()

      // HUD Accent bar
      ctx.fillStyle = '#f97316'
      ctx.fillRect(16, 24, 3, 68)

      // HUD Text
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('MASSA BENDA', 28, 35)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.fillText(`${mass} kg`, 125, 35)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('GRAVITASI (g)', 28, 55)
      ctx.fillStyle = '#fb923c'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.fillText(`${gravity.toFixed(1)} m/s²`, 125, 55)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText('KECEPATAN (v)', 28, 75)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 12px Inter, sans-serif'
      ctx.fillText(`${Math.abs(ball.vy).toFixed(1)} m/s`, 125, 75)
    }

    function update() {
      const ball = ballRef.current
      const radius = 16 + mass * 0.22
      const groundY = H - 45

      if (isRunning) {
        ball.vy += gravity * 0.03
        ball.y += ball.vy

        if (ball.y + radius >= groundY) {
          ball.y = groundY - radius
          ball.vy *= -0.62
          if (Math.abs(ball.vy) < 0.5) {
            ball.vy = 0
          }
        }
      }

      draw()
      animRef.current = requestAnimationFrame(update)
    }

    animRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animRef.current)
  }, [mass, gravity, isRunning])

  function handleReset() {
    ballRef.current = { y: 70, vy: 0 }
    setIsRunning(false)
  }

  return (
    <div className="simulation-container">
      <div className="sim-canvas-wrap">
        <canvas ref={canvasRef} className="sim-canvas" />
      </div>
      <div className="sim-controls">
        <div className="sim-controls-header">
          <span className="sim-badge">Laboratorium Fisika</span>
          <h3 className="sim-controls-title">Kontrol Parameter</h3>
        </div>

        <div className="sim-control-group">
          <div className="sim-label-row">
            <span>Massa Objek (m)</span>
            <strong className="orange-highlight">{mass} kg</strong>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={mass}
            onChange={(e) => setMass(Number(e.target.value))}
            className="sim-slider"
          />
        </div>

        <div className="sim-control-group">
          <div className="sim-label-row">
            <span>Percepatan Gravitasi (g)</span>
            <strong className="orange-highlight">{gravity.toFixed(1)} m/s²</strong>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            step="0.1"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="sim-slider"
          />
          <div className="gravity-presets">
            <button
              onClick={() => setGravity(1.6)}
              className={`preset-btn ${gravity === 1.6 ? 'preset-active' : ''}`}
            >
              <LuMoon size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -2 }} />
              Bulan (1.6)
            </button>
            <button
              onClick={() => setGravity(9.8)}
              className={`preset-btn ${gravity === 9.8 ? 'preset-active' : ''}`}
            >
              <LuGlobe size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -2 }} />
              Bumi (9.8)
            </button>
            <button
              onClick={() => setGravity(24.8)}
              className={`preset-btn ${gravity === 24.8 ? 'preset-active' : ''}`}
            >
              <LuOrbit size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: -2 }} />
              Jupiter (24.8)
            </button>
          </div>
        </div>

        <div className="sim-actions">
          <motion.button
            className="btn btn-primary"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setIsRunning(!isRunning)
              playSoundCue('click')
            }}
          >
            {isRunning ? (
              <>
                <LuPause size={16} /> Jeda Simulasi
              </>
            ) : (
              <>
                <LuPlay size={16} /> Jalankan Simulasi
              </>
            )}
          </motion.button>
          <motion.button
            className="btn btn-outline"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              handleReset()
              playSoundCue('click')
            }}
          >
            <LuRotateCcw size={16} /> Reset Posisi
          </motion.button>
        </div>

        {onLogExperiment && (
          <div style={{ marginTop: '0.85rem' }}>
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
                  topic: 'Hukum Newton II (Fisika Mekanika)',
                  var1: `${mass} kg (Massa)`,
                  var2: `${gravity.toFixed(1)} m/s² (Gravitasi)`,
                  result: `F = ${(mass * gravity).toFixed(1)} N, a = ${gravity.toFixed(1)} m/s²`,
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

        <div className="sim-info">
          <div className="sim-info-header">
            <span className="info-icon">
              <LuZap size={16} className="icon-orange" />
            </span>
            <strong>Konsep Fisika: Hukum Newton II</strong>
          </div>
          <p>
            Persamaan fundamental <strong>F = m · a</strong>. Saat benda jatuh bebas tanpa hambatan udara, percepatan (a) sama dengan percepatan gravitasi (g).
          </p>
        </div>
      </div>
    </div>
  )
}

export default GravitySimulation
