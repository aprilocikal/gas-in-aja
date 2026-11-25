import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebaseConfig'
import { useAuth, ensureUserDoc } from '../contexts/AuthContext'

// Browser bawaan aplikasi (Instagram, FB, TikTok, Line, WhatsApp, dll) diblokir oleh Google untuk login
const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || ''
  return /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|TikTok|musical_ly|Bytedance|WhatsApp|Snapchat|; wv\)/i.test(ua)
}

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') ||
  (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
import { LuCode, LuMail, LuLock, LuUser, LuEye, LuEyeOff, LuArrowRight, LuArrowLeft, LuSparkles, LuX } from 'react-icons/lu'
import KinetixLogo from '../components/KinetixLogo'
import './AuthPage.css'

export default function AuthPage({ onAuthSuccess }) {
  const navigate = useNavigate()
  const { user, continueAsGuest, authError, clearAuthError } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-redirect begitu user (akun asli) terdeteksi login — termasuk setelah kembali dari Google redirect
  useEffect(() => {
    if (user && !user.isAnonymous) {
      if (onAuthSuccess) onAuthSuccess(user)
      else navigate('/learn', { replace: true })
    }
  }, [user, navigate, onAuthSuccess])

  // Tampilkan error dari Google redirect (diproses di AuthContext)
  useEffect(() => {
    if (authError) {
      setError(friendlyError(authError))
      clearAuthError()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authError])

  const handleFirestoreUser = (u) => ensureUserDoc(u, displayName)

  // Smart Unified Email Auth: Auto-detects if user exists -> Login, if not -> Register!
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'register') {
        try {
          const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
          try {
            await updateProfile(newUser, { displayName: displayName || 'Koder Baru' })
          } catch (err) {}
          await handleFirestoreUser(newUser)
          if (onAuthSuccess) onAuthSuccess(newUser)
          else navigate('/learn', { replace: true })
          return
        } catch (regErr) {
          // If already registered, automatically log in with the provided password
          if (regErr.code === 'auth/email-already-in-use') {
            const { user: existingUser } = await signInWithEmailAndPassword(auth, email, password)
            await handleFirestoreUser(existingUser)
            if (onAuthSuccess) onAuthSuccess(existingUser)
            else navigate('/learn', { replace: true })
            return
          }
          throw regErr
        }
      } else {
        // In login mode: try login, if account not found, automatically register!
        try {
          const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password)
          await handleFirestoreUser(loggedInUser)
          if (onAuthSuccess) onAuthSuccess(loggedInUser)
          else navigate('/learn', { replace: true })
          return
        } catch (loginErr) {
          if (loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential') {
            // Attempt auto-register if new user
            try {
              const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
              await handleFirestoreUser(newUser)
              if (onAuthSuccess) onAuthSuccess(newUser)
              else navigate('/learn', { replace: true })
              return
            } catch (autoErr) {
              if (autoErr.code === 'auth/email-already-in-use') {
                throw loginErr // Password was wrong for existing account
              }
              throw autoErr
            }
          }
          throw loginErr
        }
      }
    } catch (err) {
      console.error('Email auth error:', err)
      setError(friendlyError(err.code || err.message))
    } finally {
      setLoading(false)
    }
  }

  // Google Sign-In: popup dulu (paling andal di Chrome/Safari modern, termasuk HP),
  // fallback ke redirect hanya jika popup diblokir / tidak didukung.
  const handleGoogleLogin = async () => {
    setError('')
    if (isInAppBrowser()) {
      setError('Login Google tidak didukung di browser bawaan aplikasi (Instagram/WhatsApp/TikTok, dll). Buka link ini di Chrome atau Safari, lalu coba lagi.')
      return
    }
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await handleFirestoreUser(result.user)
      if (onAuthSuccess) onAuthSuccess(result.user)
      else navigate('/learn', { replace: true })
    } catch (err) {
      const code = err?.code || ''
      const shouldRedirect =
        code === 'auth/popup-blocked' ||
        code === 'auth/operation-not-supported-in-environment' ||
        code === 'auth/web-storage-unsupported' ||
        (code === 'auth/cancelled-popup-request' && isMobileDevice())
      if (shouldRedirect) {
        try {
          await signInWithRedirect(auth, googleProvider)
          return // halaman akan pindah ke Google
        } catch (redirErr) {
          console.error('Google redirect error:', redirErr)
          setError(friendlyError(redirErr.code || redirErr.message))
        }
      } else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        console.error('Google login error:', err)
        setError(friendlyError(code || err.message))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGuestMode = () => {
    continueAsGuest()
    if (onAuthSuccess) {
      onAuthSuccess({ uid: 'guest', isAnonymous: true, displayName: 'Tamu (Guest)' })
    } else {
      navigate('/learn', { replace: true })
    }
  }

  const friendlyError = (code) => {
    const map = {
      'auth/email-already-in-use': 'Email ini sudah terdaftar. Memproses login otomatis...',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/weak-password': 'Password minimal 6 karakter.',
      'auth/user-not-found': 'Akun belum terdaftar. Dibuatkan akun baru...',
      'auth/wrong-password': 'Password salah untuk akun ini. Coba periksa kembali.',
      'auth/too-many-requests': 'Terlalu banyak percobaan gagal. Silakan tunggu sebentar.',
      'auth/popup-closed-by-user': 'Jendela login Google ditutup sebelum selesai.',
      'auth/popup-blocked': 'Popup diblokir oleh browser. Izinkan popup untuk login Google.',
      'auth/unauthorized-domain': 'Domain ini belum diizinkan di Firebase (Authentication → Settings → Authorized domains). Sementara gunakan "Mode Tamu".',
      'auth/invalid-credential': 'Email atau password tidak cocok. Silakan coba lagi.',
      'auth/network-request-failed': 'Koneksi internet bermasalah. Periksa jaringan lalu coba lagi.',
      'auth/operation-not-allowed': 'Metode login ini belum diaktifkan di Firebase Console.',
      'auth/internal-error': 'Terjadi gangguan saat login. Coba lagi atau buka di Chrome/Safari.',
      'auth/web-storage-unsupported': 'Browser memblokir penyimpanan/cookie. Aktifkan cookie atau gunakan Chrome.',
      'auth/account-exists-with-different-credential': 'Email ini sudah terdaftar dengan metode login lain. Masuk pakai email & password.',
    }
    return map[code] || (code ? `Gagal login (${code}). Gunakan Mode Tamu jika butuh cepat.` : 'Terjadi kesalahan. Coba lagi.')
  }

  return (
    <div className="auth-root">
      {/* Background Grid */}
      <div className="auth-bg-grid" />

      {/* Floating Back Button on Page Top */}
      <div className="auth-page-topbar">
        <button
          type="button"
          className="btn-auth-back-nav"
          onClick={() => navigate('/')}
        >
          <LuArrowLeft size={18} />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="auth-header">
          <KinetixLogo size={36} showText={true} />
          <p className="auth-tagline">Platform Pembelajaran Programming Interaktif</p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
          >
            Masuk
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => { setMode('register'); setError('') }}
          >
            Daftar
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            className="auth-error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <LuX size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form
          className="auth-form"
          onSubmit={handleEmailSubmit}
        >
          {mode === 'register' && (
            <div className="auth-field">
              <LuUser size={18} className="field-icon" />
              <input
                type="text"
                placeholder="Nama Panggilan"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="nickname"
              />
            </div>
          )}

          <div className="auth-field">
            <LuMail size={18} className="field-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <LuLock size={18} className="field-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="toggle-pass"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <LuEyeOff size={16} /> : <LuEye size={16} />}
            </button>
          </div>

          <button className="btn-auth-submit" type="submit" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>
                {mode === 'login' ? 'Masuk ke Kinetix' : 'Buat Akun Gratis'}
                <LuArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <span>atau lanjutkan dengan</span>
        </div>

        {/* Google Sign-In */}
        <button type="button" className="btn-google-auth" onClick={handleGoogleLogin} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.0 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        {/* Divider for Guest Mode */}
        <div className="auth-divider">
          <span>atau langsung coba</span>
        </div>

        {/* Guest Mode Button */}
        <button
          type="button"
          className="btn-guest-auth"
          onClick={handleGuestMode}
        >
          <LuSparkles size={18} className="icon-guest-spark" />
          <span>Masuk Mode Tamu (Guest Mode)</span>
        </button>

        {/* Footer note */}
        <p className="auth-footer-note">
          Mode tamu memungkinkan langsung mencoba soal dan materi tanpa login.
          Daftar akun untuk menyimpan progres permanen di cloud.
        </p>
      </motion.div>
    </div>
  )
}
