import { useState, useEffect, useMemo } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { LuShield, LuTrophy, LuUser, LuZap, LuTrendingUp } from 'react-icons/lu'
import { db } from '../firebase/firebaseConfig'
import './RealtimeLeaderboard.css'

const COMMUNITY_LADDER = [
  { uid: 'seed-1', name: 'Budi Santoso', xp: 2100, lang: 'Python' },
  { uid: 'seed-2', name: 'Siti Rahma', xp: 1650, lang: 'C++' },
  { uid: 'seed-3', name: 'Devan Putra', xp: 1120, lang: 'Rust' },
  { uid: 'seed-4', name: 'Farhan Code', xp: 740, lang: 'Assembly' },
  { uid: 'seed-5', name: 'Rina Wijaya', xp: 460, lang: 'JavaScript' },
  { uid: 'seed-6', name: 'Bagus Pratama', xp: 280, lang: 'Go (Golang)' },
  { uid: 'seed-7', name: 'Tania Kusuma', xp: 160, lang: 'C Language' },
  { uid: 'seed-8', name: 'Aldi Mahendra', xp: 90, lang: 'Java' },
  { uid: 'seed-9', name: 'Fajar Nugroho', xp: 45, lang: 'Haskell' },
  { uid: 'seed-10', name: 'Nadia Putri', xp: 15, lang: 'Python' },
]

export default function RealtimeLeaderboard({
  currentUser,
  currentXP = 0,
  currentLangName = 'Python',
  isGuest = false,
}) {
  const [liveUsers, setLiveUsers] = useState([])
  const [isLiveConnected, setIsLiveConnected] = useState(false)

  useEffect(() => {
    let unsub = null
    try {
      const q = query(collection(db, 'users'), orderBy('xp', 'desc'), limit(25))
      unsub = onSnapshot(
        q,
        (snapshot) => {
          const rows = []
          snapshot.forEach((docSnap) => {
            const data = docSnap.data()
            rows.push({
              uid: docSnap.id,
              name: data.displayName || 'Koder',
              xp: typeof data.xp === 'number' ? data.xp : 0,
              lang: data.selectedLang ? data.selectedLang.toUpperCase() : 'Python',
              isUser: false,
            })
          })
          setLiveUsers(rows)
          setIsLiveConnected(true)
        },
        () => {
          setIsLiveConnected(false)
        }
      )
    } catch {
      setIsLiveConnected(false)
    }

    return () => {
      if (typeof unsub === 'function') unsub()
    }
  }, [])

  const { rankedList, myEntry, nextAbove } = useMemo(() => {
    const mergedMap = new Map()

    COMMUNITY_LADDER.forEach((entry) => {
      mergedMap.set(entry.uid, { ...entry, isUser: false })
    })

    liveUsers.forEach((entry) => {
      mergedMap.set(entry.uid, { ...entry, isUser: false })
    })

    const myUid = currentUser?.uid && currentUser.uid !== 'guest' ? currentUser.uid : 'local-current-user'
    mergedMap.set(myUid, {
      uid: myUid,
      name: currentUser?.displayName || (isGuest ? 'Kamu (Mode Tamu)' : 'Kamu'),
      xp: currentXP,
      lang: currentLangName,
      isUser: true,
    })

    const sorted = Array.from(mergedMap.values()).sort((a, b) => {
      if (b.xp !== a.xp) return b.xp - a.xp
      if (a.isUser !== b.isUser) return a.isUser ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    const withRanks = sorted.map((item, idx) => ({ ...item, rank: idx + 1 }))
    const me = withRanks.find((item) => item.isUser) || withRanks[withRanks.length - 1]
    const above = me && me.rank > 1 ? withRanks[me.rank - 2] : null

    return { rankedList: withRanks, myEntry: me, nextAbove: above }
  }, [liveUsers, currentUser, currentXP, currentLangName, isGuest])

  const topThree = rankedList.slice(0, 3)
  const topTen = rankedList.slice(0, 10)

  return (
    <div className="duo-subview-wrap leaderboard-view">
      <div className="subview-header lb-header-flex">
        <div>
          <h2>
            <LuShield size={22} className="icon-inline" /> Papan Skor Real-Time
          </h2>
          <p>Peringkat disusun otomatis berdasarkan XP aktual secara dinamis.</p>
        </div>
        <span className={`lb-live-pill ${isLiveConnected ? 'live-on' : 'live-local'}`}>
          <span className="lb-live-dot" />
          {isLiveConnected ? 'LIVE REAL-TIME' : 'LIVE LOKAL'}
        </span>
      </div>

      {/* User Rank Summary Banner */}
      {myEntry && (
        <div className="lb-my-rank-banner">
          <div className="lb-my-rank-left">
            <span className="lb-rank-badge-big">#{myEntry.rank}</span>
            <div>
              <strong>Peringkat Kamu Saat Ini</strong>
              <small>
                {nextAbove
                  ? `Butuh ${Math.max(1, nextAbove.xp - myEntry.xp + 1)} XP lagi untuk menyalip ${nextAbove.name}!`
                  : 'Luar biasa! Kamu memuncaki papan skor minggu ini!'}
              </small>
            </div>
          </div>
          <div className="lb-my-xp-chip">
            <LuZap size={15} /> {myEntry.xp} XP
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {topThree.length >= 3 && (
        <div className="lb-podium-grid">
          {[topThree[1], topThree[0], topThree[2]].map((p) => {
            const tierClass = p.rank === 1 ? 'podium-gold' : p.rank === 2 ? 'podium-silver' : 'podium-bronze'
            return (
              <div
                key={p.uid}
                className={`lb-podium-card ${tierClass} ${p.isUser ? 'podium-is-me' : ''}`}
              >
                <span className="podium-crown">
                  {p.rank === 1 ? <LuTrophy size={18} /> : `#${p.rank}`}
                </span>
                <div className="podium-avatar">
                  <LuUser size={18} />
                </div>
                <strong className="podium-name">{p.name}</strong>
                <small className="podium-lang">{p.lang}</small>
                <span className="podium-xp">{p.xp} XP</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Top 10 Dynamic Ranking List */}
      <div className="leaderboard-table glass-card">
        <div className="lb-list-caption">
          <LuTrendingUp size={15} />
          <span>Top 10 Peringkat Teratas</span>
        </div>
        {topTen.map((entry) => (
          <div
            key={entry.uid}
            className={`lb-row ${entry.isUser ? 'lb-user-row' : ''}`}
          >
            <span className={`lb-rank ${entry.rank <= 3 ? `rank-top-${entry.rank}` : ''}`}>
              #{entry.rank}
            </span>
            <span className="lb-avatar">
              <LuUser size={17} />
            </span>
            <div className="lb-name-col">
              <strong>
                {entry.name} {entry.isUser && <span className="you-tag">KAMU</span>}
              </strong>
              <small>{entry.lang}</small>
            </div>
            <span className="lb-xp">{entry.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  )
}
