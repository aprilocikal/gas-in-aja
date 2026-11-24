// AuthContext.jsx - Global Firebase Auth state
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/firebaseConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [userData, setUserData] = useState(null) // Firestore data

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      if (!firebaseUser) {
        setUserData(null)
        return
      }
      // Listen to real-time Firestore user data
      const ref = doc(db, 'users', firebaseUser.uid)
      const unsubFirestore = onSnapshot(ref, (snap) => {
        if (snap.exists()) setUserData(snap.data())
      })
      return unsubFirestore
    })
    return unsub
  }, [])

  const logout = () => signOut(auth)

  const updateUserData = async (fields) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, fields)
  }

  return (
    <AuthContext.Provider value={{ user, userData, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
