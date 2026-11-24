import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Clock, ChevronRight } from 'lucide-react'
import './MateriCard.css'

function MateriCard({ materi, delay = 0 }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const handleStart = () => {
    if (materi.simId) {
      navigate(`/simulasi?topic=${materi.simId}`)
    } else {
      navigate('/simulasi')
    }
  }

  return (
    <motion.div
      className="materi-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8 }}
      style={{ '--card-accent': materi.warna }}
    >
      <div className="materi-card-header">
        <div className="materi-icon-wrap">
          <span className="materi-icon">{materi.icon}</span>
        </div>
        <div className="materi-badges">
          <span className="materi-badge badge-kategori">{materi.kategori}</span>
          <span className="materi-badge badge-tingkat">{materi.tingkat}</span>
        </div>
      </div>

      <h3 className="materi-title">{materi.judul}</h3>
      <p className="materi-desc">{materi.deskripsi}</p>

      <div className="materi-footer">
        <div className="materi-meta">
          <Clock size={14} />
          <span>{materi.durasi}</span>
        </div>

        <motion.button
          className="materi-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
        >
          {materi.simulasi ? (
            <>
              <Play size={16} /> Mulai
            </>
          ) : (
            <>
              Buka <ChevronRight size={16} />
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="materi-card-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default MateriCard
