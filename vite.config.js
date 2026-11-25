import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

async function searchYouTube(query) {
  const url = `https://www.youtube.com/results?sp=EgIQAQ%253D%253D&search_query=${encodeURIComponent(query)}`
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    },
  })
  if (!res.ok) throw new Error(`YouTube HTTP ${res.status}`)
  const html = await res.text()
  const marker = 'var ytInitialData = '
  const startIdx = html.indexOf(marker)
  if (startIdx === -1) return []
  const jsonStart = startIdx + marker.length
  const endIdx = html.indexOf(';</script>', jsonStart)
  if (endIdx === -1) return []

  const data = JSON.parse(html.slice(jsonStart, endIdx))
  const sections =
    data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer
      ?.contents || []

  const results = []
  const seen = new Set()

  for (const sec of sections) {
    const items = sec?.itemSectionRenderer?.contents || []
    for (const item of items) {
      const v = item?.videoRenderer
      if (!v?.videoId || seen.has(v.videoId)) continue
      seen.add(v.videoId)
      results.push({
        id: `yt-${v.videoId}`,
        langId: 'youtube',
        youtubeId: v.videoId,
        title: v.title?.runs?.map((r) => r.text).join('') || 'Video YouTube',
        channel: v.ownerText?.runs?.[0]?.text || 'YouTube',
        duration: v.lengthText?.simpleText || '',
        language: 'YT',
        level: 'YouTube',
        summary:
          v.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map((r) => r.text).join('') ||
          `Video hasil pencarian YouTube untuk "${query}".`,
      })
      if (results.length >= 12) return results
    }
  }
  return results
}

function attachYouTubeSearchRoute(middlewares) {
  middlewares.use('/api/yt-search', async (req, res) => {
    try {
      const urlObj = new URL(req.url || '/', 'http://localhost')
      const q = (urlObj.searchParams.get('q') || '').trim()
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      if (!q) {
        res.statusCode = 200
        res.end(JSON.stringify({ results: [] }))
        return
      }
      const results = await searchYouTube(q)
      res.statusCode = 200
      res.end(JSON.stringify({ results }))
    } catch (err) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ results: [], error: err?.message || 'Gagal mencari video' }))
    }
  })
}

function youtubeSearchPlugin() {
  return {
    name: 'kinetix-youtube-search',
    configureServer(server) {
      attachYouTubeSearchRoute(server.middlewares)
    },
    configurePreviewServer(server) {
      attachYouTubeSearchRoute(server.middlewares)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), youtubeSearchPlugin()],
})
