import { useMemo, useState } from 'react'
import {
  LuMonitorPlay,
  LuSearch,
  LuCheck,
  LuExternalLink,
  LuChevronLeft,
  LuChevronRight,
  LuCirclePlay,
  LuX,
  LuLoaderCircle,
} from 'react-icons/lu'
import { VIDEO_CATEGORIES, VIDEO_LESSONS } from '../data/videoLessons'
import { playSoundCue } from './AccessibilityToolbar'
import './VideoLearningSection.css'

const WATCHED_KEY = 'kinetix_watched_videos'

const loadWatched = () => {
  try {
    const raw = localStorage.getItem(WATCHED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const hasVideos = (catId) =>
  catId === 'all' || VIDEO_LESSONS.some((x) => x.langId === catId)

function extractYouTubeId(input) {
  const text = String(input || '').trim()
  if (/^[A-Za-z0-9_-]{11}$/.test(text)) return text
  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
  ]
  for (const re of patterns) {
    const m = text.match(re)
    if (m) return m[1]
  }
  return null
}

export default function VideoLearningSection({ defaultLangId = 'all' }) {
  const initialCat = hasVideos(defaultLangId) ? defaultLangId : 'all'
  const [category, setCategory] = useState(initialCat)
  const [searchInput, setSearchInput] = useState('')
  const [ytQuery, setYtQuery] = useState('')
  const [ytResults, setYtResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [watched, setWatched] = useState(loadWatched)
  const [activeVideoObj, setActiveVideoObj] = useState(() => {
    const first = VIDEO_LESSONS.find((x) => initialCat === 'all' || x.langId === initialCat)
    return first || VIDEO_LESSONS[0]
  })
  const [autoplay, setAutoplay] = useState(false)

  const isSearchMode = Boolean(ytQuery)

  const curatedList = useMemo(() => {
    return VIDEO_LESSONS.filter((x) => category === 'all' || x.langId === category)
  }, [category])

  const displayedList = isSearchMode ? ytResults : curatedList
  const activeVideo = activeVideoObj || displayedList[0] || VIDEO_LESSONS[0]
  const activeIdx = displayedList.findIndex((x) => x.youtubeId === activeVideo.youtubeId)
  const isWatched = watched.includes(activeVideo.youtubeId) || watched.includes(activeVideo.id)

  const selectVideo = (video) => {
    setActiveVideoObj(video)
    setAutoplay(true)
    playSoundCue('nav')
  }

  const selectCategory = (catId) => {
    setCategory(catId)
    setYtQuery('')
    setYtResults([])
    setSearchError('')
    const first = VIDEO_LESSONS.find((x) => catId === 'all' || x.langId === catId)
    if (first) {
      setActiveVideoObj(first)
      setAutoplay(false)
    }
    playSoundCue('toggle')
  }

  const clearSearch = () => {
    setSearchInput('')
    setYtQuery('')
    setYtResults([])
    setSearchError('')
    const first = VIDEO_LESSONS.find((x) => category === 'all' || x.langId === category)
    if (first) {
      setActiveVideoObj(first)
      setAutoplay(false)
    }
    playSoundCue('click')
  }

  const handleYouTubeSearch = async (e) => {
    e.preventDefault()
    const raw = searchInput.trim()
    if (!raw) {
      clearSearch()
      return
    }

    playSoundCue('click')
    setSearchError('')

    // Case 1: User pasted a direct YouTube URL or 11-char video ID
    const directId = extractYouTubeId(raw)
    if (directId) {
      setIsSearching(true)
      try {
        let title = 'Video YouTube Pilihanmu'
        let channel = 'YouTube'
        try {
          const o = await fetch(
            `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${directId}&format=json`
          )
          if (o.ok) {
            const meta = await o.json()
            title = meta.title || title
            channel = meta.author_name || channel
          }
        } catch {
          // Use fallback title if oEmbed fails
        }
        const customVid = {
          id: `yt-${directId}`,
          langId: 'youtube',
          youtubeId: directId,
          title,
          channel,
          language: 'YT',
          level: 'Link Langsung',
          summary: 'Diputar langsung dari tautan YouTube yang kamu masukkan.',
        }
        setYtQuery(raw)
        setYtResults([customVid])
        setActiveVideoObj(customVid)
        setAutoplay(true)
      } finally {
        setIsSearching(false)
      }
      return
    }

    // Case 2: Live YouTube keyword search
    setIsSearching(true)
    setYtQuery(raw)
    try {
      const res = await fetch(`/api/yt-search?q=${encodeURIComponent(raw)}`)
      const data = await res.json()
      const list = Array.isArray(data.results) ? data.results : []
      if (list.length > 0) {
        setYtResults(list)
        setActiveVideoObj(list[0])
        setAutoplay(true)
      } else {
        // Fallback: filter local curated list if live search returns empty
        const localMatches = VIDEO_LESSONS.filter((x) =>
          `${x.title} ${x.channel} ${x.summary} ${x.langId}`.toLowerCase().includes(raw.toLowerCase())
        )
        setYtResults(localMatches)
        if (localMatches.length > 0) {
          setActiveVideoObj(localMatches[0])
          setAutoplay(true)
        } else {
          setSearchError(`Tidak ditemukan video untuk "${raw}". Coba kata kunci lain atau tempel link YouTube langsung.`)
        }
      }
    } catch {
      const localMatches = VIDEO_LESSONS.filter((x) =>
        `${x.title} ${x.channel} ${x.summary} ${x.langId}`.toLowerCase().includes(raw.toLowerCase())
      )
      setYtResults(localMatches)
      if (localMatches.length > 0) {
        setActiveVideoObj(localMatches[0])
        setAutoplay(true)
      } else {
        setSearchError('Pencarian YouTube sedang tidak terjangkau. Kamu tetap bisa menempel link YouTube langsung (https://youtu.be/...).')
      }
    } finally {
      setIsSearching(false)
    }
  }

  const goRelative = (delta) => {
    if (!displayedList.length) return
    const base = activeIdx >= 0 ? activeIdx : 0
    const next = displayedList[(base + delta + displayedList.length) % displayedList.length]
    selectVideo(next)
  }

  const toggleWatched = () => {
    const key = activeVideo.youtubeId
    setWatched((prev) => {
      const exists = prev.includes(key) || prev.includes(activeVideo.id)
      const next = exists
        ? prev.filter((x) => x !== key && x !== activeVideo.id)
        : [...prev, key]
      try {
        localStorage.setItem(WATCHED_KEY, JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
    playSoundCue('toggle')
  }

  const watchedInFilter = displayedList.filter(
    (x) => watched.includes(x.youtubeId) || watched.includes(x.id)
  ).length
  const embedSrc = `https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1${
    autoplay ? '&autoplay=1' : ''
  }`

  return (
    <section className="vl-root">
      <header className="vl-header">
        <div>
          <h2>
            <LuMonitorPlay size={22} className="vl-icon" /> Video Belajar
          </h2>
          <p>Cari video apa saja di YouTube, tempel link, atau pilih kurasi dasar di bawah.</p>
        </div>
        <span className="vl-progress">
          {watchedInFilter} / {displayedList.length} Ditonton
        </span>
      </header>

      {/* Live YouTube Search Bar */}
      <form className="vl-yt-search-form" onSubmit={handleYouTubeSearch}>
        <div className="vl-yt-input-wrap">
          <LuSearch size={16} className="vl-search-ico" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari video apa saja di YouTube (mis. belajar laravel, lofi coding) atau tempel link..."
            aria-label="Cari video di YouTube"
          />
          {searchInput && (
            <button
              type="button"
              className="vl-clear-input"
              onClick={clearSearch}
              aria-label="Hapus pencarian"
            >
              <LuX size={15} />
            </button>
          )}
        </div>
        <button type="submit" className="vl-yt-submit-btn" disabled={isSearching}>
          {isSearching ? (
            <>
              <LuLoaderCircle size={15} className="vl-spin" /> Mencari...
            </>
          ) : (
            <>
              <LuSearch size={15} /> Cari YouTube
            </>
          )}
        </button>
      </form>

      {isSearchMode && (
        <div className="vl-search-status-bar">
          <span>
            Hasil YouTube untuk: <strong>&ldquo;{ytQuery}&rdquo;</strong> ({ytResults.length} video)
          </span>
          <button type="button" className="vl-back-curated-btn" onClick={clearSearch}>
            <LuX size={13} /> Kembali ke Kurasi
          </button>
        </div>
      )}

      {searchError && <div className="vl-search-error">{searchError}</div>}

      <div className="vl-toolbar">
        <div className="vl-chips" role="tablist" aria-label="Filter bahasa">
          {VIDEO_CATEGORIES.map((cat) => {
            const count =
              cat.id === 'all'
                ? VIDEO_LESSONS.length
                : VIDEO_LESSONS.filter((x) => x.langId === cat.id).length
            return (
              <button
                key={cat.id}
                type="button"
                className={`vl-chip ${!isSearchMode && category === cat.id ? 'active' : ''}`}
                onClick={() => selectCategory(cat.id)}
              >
                {cat.label} <span className="vl-chip-count">{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="vl-layout">
        <div className="vl-stage">
          <div className="vl-player-frame">
            <iframe
              key={`${activeVideo.youtubeId}-${autoplay}`}
              src={embedSrc}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>

          <div className="vl-now">
            <h3>{activeVideo.title}</h3>
            <div className="vl-meta">
              <span>{activeVideo.channel}</span>
              <span className="vl-pill">
                {activeVideo.language === 'ID'
                  ? 'Bahasa Indonesia'
                  : activeVideo.language === 'EN'
                  ? 'English'
                  : 'YouTube Live'}
              </span>
              <span className="vl-pill vl-pill-level">{activeVideo.level}</span>
            </div>
            <p>{activeVideo.summary}</p>

            <div className="vl-actions">
              <button type="button" className="vl-btn" onClick={() => goRelative(-1)}>
                <LuChevronLeft size={15} /> Sebelumnya
              </button>
              <button type="button" className="vl-btn" onClick={() => goRelative(1)}>
                Berikutnya <LuChevronRight size={15} />
              </button>
              <button
                type="button"
                className={`vl-btn ${isWatched ? 'vl-btn-done' : 'vl-btn-primary'}`}
                onClick={toggleWatched}
              >
                <LuCheck size={15} /> {isWatched ? 'Sudah Ditonton' : 'Tandai Ditonton'}
              </button>
              <a
                className="vl-btn vl-btn-link"
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LuExternalLink size={14} /> YouTube
              </a>
            </div>
          </div>
        </div>

        <aside className="vl-queue" aria-label="Daftar video">
          <h4 className="vl-queue-title">
            {isSearchMode ? 'Hasil Pencarian YouTube' : 'Daftar Video'}{' '}
            <span>{displayedList.length}</span>
          </h4>
          {displayedList.length === 0 && !isSearching && (
            <p className="vl-empty">Tidak ada video yang cocok.</p>
          )}
          {displayedList.map((x) => {
            const playing = x.youtubeId === activeVideo.youtubeId
            const itemWatched = watched.includes(x.youtubeId) || watched.includes(x.id)
            return (
              <button
                key={x.id}
                type="button"
                className={`vl-card ${playing ? 'playing' : ''}`}
                onClick={() => selectVideo(x)}
              >
                <span className="vl-thumb">
                  <img
                    src={`https://i.ytimg.com/vi/${x.youtubeId}/mqdefault.jpg`}
                    alt=""
                    loading="lazy"
                  />
                  {x.duration && <span className="vl-thumb-dur">{x.duration}</span>}
                  {playing && (
                    <span className="vl-thumb-badge">
                      <LuCirclePlay size={12} /> Diputar
                    </span>
                  )}
                </span>
                <span className="vl-card-body">
                  <strong>{x.title}</strong>
                  <small>
                    {x.channel}
                    {x.language !== 'YT' ? ` • ${x.language}` : ''}
                  </small>
                </span>
                {itemWatched && (
                  <span className="vl-watched" title="Sudah ditonton">
                    <LuCheck size={12} />
                  </span>
                )}
              </button>
            )
          })}
        </aside>
      </div>
    </section>
  )
}
