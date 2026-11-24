// Real streak management backed by localStorage and real date comparison

const STREAK_KEY = 'kinetix_streak_count'
const LAST_DATE_KEY = 'kinetix_streak_last_date'
const HISTORY_KEY = 'kinetix_streak_history'

// Helper: Format date as YYYY-MM-DD in local time
export const getTodayDateString = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper: Calculate diff in calendar days between two YYYY-MM-DD strings
export const getDayDifference = (dateStr1, dateStr2) => {
  if (!dateStr1 || !dateStr2) return 999
  const d1 = new Date(dateStr1 + 'T00:00:00')
  const d2 = new Date(dateStr2 + 'T00:00:00')
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

// Get current streak state
export const getStreakData = () => {
  try {
    const today = getTodayDateString()
    const storedStreak = localStorage.getItem(STREAK_KEY)
    const lastDate = localStorage.getItem(LAST_DATE_KEY)
    const historyRaw = localStorage.getItem(HISTORY_KEY)
    
    let history = []
    if (historyRaw) {
      try {
        history = JSON.parse(historyRaw)
      } catch {
        history = []
      }
    }

    // Initial streak starts at 0 (not fake). If never set or previously seeded with 5, start at 0
    if (!storedStreak || storedStreak === '5' && !lastDate) {
      const initialStreak = 0
      localStorage.setItem(STREAK_KEY, '0')
      localStorage.removeItem(LAST_DATE_KEY)
      localStorage.setItem(HISTORY_KEY, JSON.stringify([]))
      return {
        streak: 0,
        lastActiveDate: null,
        hasCompletedToday: false,
        history: [],
      }
    }

    const currentStreak = parseInt(storedStreak, 10) || 1
    const diff = getDayDifference(lastDate, today)

    // Check if user missed more than 1 day
    let activeStreak = currentStreak
    let hasCompletedToday = lastDate === today

    if (diff > 1) {
      // Missed yesterday - streak resets to 1 (or 0 until they do a lesson)
      activeStreak = hasCompletedToday ? 1 : 0
      localStorage.setItem(STREAK_KEY, String(activeStreak))
    }

    return {
      streak: activeStreak,
      lastActiveDate: lastDate,
      hasCompletedToday,
      history,
    }
  } catch {
    return {
      streak: 0,
      lastActiveDate: null,
      hasCompletedToday: false,
      history: [],
    }
  }
}

// Record activity (e.g. solving a quiz or stepping on a node or running visualizer)
export const recordDailyActivity = () => {
  try {
    const today = getTodayDateString()
    const currentData = getStreakData()

    if (currentData.hasCompletedToday) {
      return currentData
    }

    const diff = getDayDifference(currentData.lastActiveDate, today)
    let newStreak = currentData.streak

    if (diff === 1) {
      // Completed yesterday, streak continues!
      newStreak += 1
    } else {
      // First day or broke streak
      newStreak = 1
    }

    const newHistory = Array.from(new Set([...currentData.history, today]))

    localStorage.setItem(STREAK_KEY, String(newStreak))
    localStorage.setItem(LAST_DATE_KEY, today)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))

    const updatedData = {
      streak: newStreak,
      lastActiveDate: today,
      hasCompletedToday: true,
      history: newHistory,
    }

    // Dispatch global event for instant sync in Navbar & pages
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('streak-updated', { detail: updatedData }))
    }

    return updatedData
  } catch (err) {
    console.error('Failed to update streak:', err)
    return getStreakData()
  }
}

// Generate current week calendar days with status
export const getWeekStreakStatus = () => {
  const data = getStreakData()
  const now = new Date()
  const dayOfWeek = (now.getDay() + 6) % 7 // Monday = 0, Sunday = 6
  const weekNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek)

  return weekNames.map((name, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${day}`
    
    const isToday = dateStr === getTodayDateString()
    const isPast = d <= now
    const isCompleted = data.history.includes(dateStr)

    return {
      dayName: name,
      dateNum: d.getDate(),
      dateStr,
      isToday,
      isPast,
      isCompleted,
    }
  })
}
