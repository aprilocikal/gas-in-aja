// AuthContext.jsx - Global Firebase Auth state with Guest Mode support
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading, null = logged out
  const [userData, setUserData] = useState(null) // Firestore data
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem('kinetix_is_guest') === 'true')
  const [guestData, setGuestData] = useState(() => ({
    xp: parseInt(localStorage.getItem('kinetix_guest_xp') || '0', 10),
    gems: parseInt(localStorage.getItem('kinetix_guest_gems') || '0', 10),
    hearts: 5,
    streak: parseInt(localStorage.getItem('kinetix_streak_count') || '0', 10),
    selectedLang: localStorage.getItem('kinetix_guest_lang') || 'python',
    completedModules: JSON.parse(localStorage.getItem('kinetix_guest_modules') || '[]'),
  }))

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setUserData(null)
        return
      }
      // If user signed in with real account, turn off guest mode
      setIsGuest(false)
      localStorage.removeItem('kinetix_is_guest')

      // Listen to real-time Firestore user data
      const ref = doc(db, 'users', firebaseUser.uid)
      const unsubFirestore = onSnapshot(ref, (snap) => {
        if (snap.exists()) setUserData(snap.data())
      })
      return unsubFirestore
    })
    return unsub
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
    if (isGuest) {
      if (fields.xp !== undefined) localStorage.setItem('kinetix_guest_xp', String(fields.xp))
      if (fields.gems !== undefined) localStorage.setItem('kinetix_guest_gems', String(fields.gems))
      if (fields.selectedLang !== undefined) localStorage.setItem('kinetix_guest_lang', fields.selectedLang)
      if (fields.completedModules !== undefined) localStorage.setItem('kinetix_guest_modules', JSON.stringify(fields.completedModules))
      setGuestData((prev) => ({ ...prev, ...fields }))
      return
    }
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, fields)
  }

  const effectiveUser = user || (isGuest ? {
    uid: 'guest',
    isAnonymous: true,
    displayName: 'Tamu (Guest)',
    email: 'Mode Tamu',
  } : null)

  const effectiveUserData = user ? userData : (isGuest ? guestData : null)

  return (
    <AuthContext.Provider value={{
      user: effectiveUser,
      userData: effectiveUserData,
      isGuest,
      continueAsGuest,
      logout,
      updateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
