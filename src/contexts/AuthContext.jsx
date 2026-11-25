// AuthContext.jsx - Global Firebase Auth state with Guest Mode support
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth'
import { doc, onSnapshot, updateDoc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

const AuthContext = createContext(null)

const DEFAULT_USER_DATA = {
  xp: 0,
  gems: 0,
  hearts: 5,
  streak: 0,
  lastActiveDate: null,
  selectedLang: 'python',
  completedModules: [],
}

// Pastikan dokumen user ada di Firestore (dipanggil otomatis setiap login, termasuk Google redirect)
export async function ensureUserDoc(u, fallbackName) {
  if (!u || u.isAnonymous) return
  try {
    const ref = doc(db, 'users', u.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: u.uid,
        email: u.email || null,
        displayName: u.displayName || fallbackName || 'Koder Baru',
        photoURL: u.photoURL || null,
        ...DEFAULT_USER_DATA,
        createdAt: serverTimestamp(),
      })
    }
  } catch (err) {
    console.warn('Firestore profile sync warning (non-fatal):', err)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out
  const [userData, setUserData] = useState(null) // Firestore data
  const [authError, setAuthError] = useState('')
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('kinetix_is_guest') === 'true')
  const [guestData, setGuestData] = useState(() => {
    let modules = []
    try {
      modules = JSON.parse(localStorage.getItem('kinetix_guest_modules') || '[]')
    } catch {
      modules = []
    }
    return {
      xp: parseInt(localStorage.getItem('kinetix_guest_xp') || '0', 10),
      gems: parseInt(localStorage.getItem('kinetix_guest_gems') || '0', 10),
      hearts: 5,
      streak: parseInt(localStorage.getItem('kinetix_streak_count') || '0', 10),
      selectedLang: localStorage.getItem('kinetix_guest_lang') || 'python',
      completedModules: modules,
    }
  })

  // Tangani hasil login Google via redirect (dipakai di HP / saat popup diblokir)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) ensureUserDoc(result.user)
      })
      .catch((err) => {
        console.warn('Google redirect result error:', err)
        if (err?.code && err.code !== 'auth/no-auth-event') setAuthError(err.code)
      })
  }, [])

  useEffect(() => {
    let unsubFirestore = null

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // Bersihkan listener Firestore sebelumnya
      if (unsubFirestore) {
        unsubFirestore()
        unsubFirestore = null
      }

      if (!firebaseUser) {
        setUser(null)
        setUserData(null)
        return
      }

      // Login akun asli -> matikan mode tamu
      setIsGuest(false)
      localStorage.removeItem('kinetix_is_guest')
      setUser(firebaseUser)

      await ensureUserDoc(firebaseUser)

      const ref = doc(db, 'users', firebaseUser.uid)
      unsubFirestore = onSnapshot(
        ref,
        (snap) => {
          setUserData(snap.exists() ? { ...DEFAULT_USER_DATA, ...snap.data() } : { ...DEFAULT_USER_DATA })
        },
        (err) => {
          console.warn('Firestore listener error:', err)
          setUserData((prev) => prev || { ...DEFAULT_USER_DATA })
        }
      )
    })

    return () => {
      unsub()
      if (unsubFirestore) unsubFirestore()
    }
  }, [])

  const continueAsGuest = () => {
    setIsGuest(true)
    localStorage.setItem('kinetix_is_guest', 'true')
  }

  const logout = async () => {
    setIsGuest(false)
    localStorage.removeItem('kinetix_is_guest')
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Error signing out:', err)
    }
    setUser(null)
    setUserData(null)
  }

  const updateUserData = async (fields) => {
    if (isGuest && !user) {
      if (fields.xp !== undefined) localStorage.setItem('kinetix_guest_xp', String(fields.xp))
      if (fields.gems !== undefined) localStorage.setItem('kinetix_guest_gems', String(fields.gems))
      if (fields.selectedLang !== undefined) localStorage.setItem('kinetix_guest_lang', fields.selectedLang)
      if (fields.completedModules !== undefined) localStorage.setItem('kinetix_guest_modules', JSON.stringify(fields.completedModules))
      setGuestData((prev) => ({ ...prev, ...fields }))
      return
    }
    if (!user) return
    try {
      const ref = doc(db, 'users', user.uid)
      await updateDoc(ref, fields)
    } catch (err) {
      // Dokumen belum ada / gagal -> coba merge
      try {
        await setDoc(doc(db, 'users', user.uid), fields, { merge: true })
      } catch (err2) {
        console.warn('Gagal menyimpan progres:', err2)
      }
    }
  }

  // Selama Firebase masih memuat (user === undefined) tapi mode tamu aktif, langsung pakai tamu
  const effectiveUser = user
    ? user
    : isGuest
    ? { uid: 'guest', isAnonymous: true, displayName: 'Tamu (Guest)', email: 'Mode Tamu' }
    : user // undefined (loading) atau null

  const effectiveUserData = user ? userData : isGuest ? guestData : null

  return (
    <AuthContext.Provider value={{
      user: effectiveUser,
      userData: effectiveUserData,
      isGuest: !user && isGuest,
      authError,
      clearAuthError: () => setAuthError(''),
      continueAsGuest,
      logout,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
