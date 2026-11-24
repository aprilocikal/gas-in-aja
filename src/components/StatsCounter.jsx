import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function AnimatedCounter({ value, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-30px' })

  useEffect(() => {
    if (!isInView) return

    let startTime = null
    const duration = 1800 // 1.8 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Smooth ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    const frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [isInView, value])

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function StatsCounter({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="stat-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-number">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix || ''}
              prefix={stat.prefix || ''}
            />
          </div>
          <div className="stat-label">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default StatsCounter
