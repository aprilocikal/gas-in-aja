import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/firebaseConfig'
import { LuCode, LuMail, LuLock, LuUser, LuEye, LuEyeOff, LuArrowRight, LuX } from 'react-icons/lu'
import KinetixLogo from '../components/KinetixLogo'
import './AuthPage.css'

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFirestoreUser = async (user) => {
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName || 'Koder Baru',
        photoURL: user.photoURL || null,
        xp: 0,
        gems: 100,
        hearts: 5,
        streak: 0,
        lastActiveDate: null,
        selectedLang: 'python',
        completedModules: [],
        createdAt: serverTimestamp(),
      })
    }
    return snap.data() || {}
  }

  const handleEmailRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user, { displayName: displayName || 'Koder Baru' })
      await handleFirestoreUser(user)
      onAuthSuccess(user)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      await handleFirestoreUser(user)
      onAuthSuccess(user)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      await handleFirestoreUser(result.user)
      onAuthSuccess(result.user)
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  const friendlyError = (code) => {
    const map = {
      'auth/email-already-in-use': 'Email ini sudah terdaftar. Silakan login.',
      'auth/invalid-email': 'Format email tidak valid.',
      'auth/weak-password': 'Password minimal 6 karakter.',
      'auth/user-not-found': 'Akun tidak ditemukan. Daftar terlebih dahulu.',
      'auth/wrong-password': 'Password salah. Coba lagi.',
      'auth/too-many-requests': 'Terlalu banyak percobaan. Tunggu sebentar.',
      'auth/popup-closed-by-user': 'Login dibatalkan.',
      'auth/invalid-credential': 'Email atau password salah.',
    }
    return map[code] || 'Terjadi kesalahan. Coba lagi.'
  }

  return (
    <div className="auth-root">
      {/* Background Grid */}
      <div className="auth-bg-grid" />

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
          onSubmit={mode === 'register' ? handleEmailRegister : handleEmailLogin}
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
        <button className="btn-google-auth" onClick={handleGoogleLogin} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
            <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.0 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
            <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
            <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        {/* Footer note */}
        <p className="auth-footer-note">
          Dengan mendaftar, kamu setuju dengan ketentuan penggunaan platform.
          Data tersimpan di Firebase secara aman.
        </p>
      </motion.div>
    </div>
  )
}
