import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import AlurBelajar from './pages/AlurBelajar'
import Simulasi from './pages/Simulasi'
import Materi from './pages/Materi'
import Tentang from './pages/Tentang'
import Onboarding from './pages/Onboarding'
import DuolingoLearn from './pages/DuolingoLearn'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#fff', background: '#0a0614', minHeight: '100vh' }}>
          <h2 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>Terjadi Kesalahan Render</h2>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>{this.state.error?.message || 'Error tidak diketahui'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function AppContent() {
  const location = useLocation()
  // Hide standard navbar/footer ONLY on Duolingo app page and Onboarding flow
  const isDuolingoApp = location.pathname === '/learn' || location.pathname === '/belajar'
  const isOnboarding = location.pathname === '/onboarding'
  const hideStandardChrome = isDuolingoApp || isOnboarding

  return (
    <div className="app">
      {/* Scroll to absolute top immediately on every route change */}
      <ScrollToTop />
      {!hideStandardChrome && <Navbar />}
      <main>
        <Routes>
          {/* Beranda (Home Landing page) */}
          <Route path="/" element={<Home />} />
          {/* Alur Belajar (Interactive Flowchart Roadmap) */}
          <Route path="/alur-belajar" element={<AlurBelajar />} />
          {/* Duolingo gamified interactive path */}
          <Route path="/learn" element={<DuolingoLearn />} />
          <Route path="/belajar" element={<DuolingoLearn />} />
          {/* Onboarding friendly flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Standalone Visualizer & Simulations */}
          <Route path="/simulasi" element={<Simulasi />} />
          {/* All 12 Programming Languages Catalog */}
          <Route path="/materi" element={<Materi />} />
          {/* About Competition & Rules */}
          <Route path="/tentang" element={<Tentang />} />
        </Routes>
      </main>
      {!hideStandardChrome && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
