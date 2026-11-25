import React, { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SplashIntro from './components/SplashIntro'
import Home from './pages/Home'
import AlurBelajar from './pages/AlurBelajar'
import Simulasi from './pages/Simulasi'
import Materi from './pages/Materi'
import Tentang from './pages/Tentang'
import Onboarding from './pages/Onboarding'
import LearnHub from './pages/LearnHub'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

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
            style={{ padding: '0.75rem 1.5rem', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: '9999px', cursor: 'pointer', fontWeight: 600 }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Guard: routes that require auth
function RequireAuth({ children }) {
  const { user } = useAuth()
  // user=undefined means still loading; user=null means logged out
  if (user === undefined) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0a1a' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    )
  }
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function AppContent() {
  const location = useLocation()
  const isLearnApp = location.pathname === '/learn' || location.pathname === '/belajar'
  const isOnboarding = location.pathname === '/onboarding'
  const isAuth = location.pathname === '/auth'
  const hideStandardChrome = isLearnApp || isOnboarding || isAuth

  return (
    <div className="app">
      <ScrollToTop />
      {!hideStandardChrome && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alur-belajar" element={<AlurBelajar />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/learn"
            element={
              <RequireAuth>
                <LearnHub />
              </RequireAuth>
            }
          />
          <Route
            path="/belajar"
            element={
              <RequireAuth>
                <LearnHub />
              </RequireAuth>
            }
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/simulasi" element={<Simulasi />} />
          <Route path="/materi" element={<Materi />} />
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
      <AuthProvider>
        <SplashIntro />
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
