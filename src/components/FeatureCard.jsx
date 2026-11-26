import { motion } from 'framer-motion'

function FeatureCard({ icon, title, description, mobileDescription, delay = 0 }) {
  return (
    <motion.div
      className="feature-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      {mobileDescription ? (
        <>
          <p className="feature-desc text-desktop">{description}</p>
          <p className="feature-desc text-mobile">{mobileDescription}</p>
        </>
      ) : (
        <p className="feature-desc">{description}</p>
      )}
      <div className="feature-shine" />
    </motion.div>
  )
}

export default FeatureCard
