import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll window instantly to the absolute top on every route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  return null
}
