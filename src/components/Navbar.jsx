import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { LuCode } from 'react-icons/lu'
import KinetixLogo from './KinetixLogo'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/alur-belajar', label: 'Alur Belajar' },
    { path: '/simulasi', label: 'Visualizer Algoritma' },
    { path: '/materi', label: 'Katalog Bahasa' },
    { path: '/tentang', label: 'Tentang' },
  ]

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <KinetixLogo size={36} showText={true} />
        </Link>

        {/* Desktop nav */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  className="nav-link-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <Link to="/onboarding" className="btn btn-primary navbar-cta">
          Mulai Belajar
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mobile-links-container">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`navbar-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/onboarding" className="btn btn-primary btn-mobile-cta">
                Mulai Belajar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
