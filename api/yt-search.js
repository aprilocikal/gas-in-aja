// Vercel Serverless Function: GET /api/yt-search?q=...
export default async function handler(req, res) {
  const q = String(req.query?.q || '').trim()
  if (!q) {
    return res.status(200).json({ results: [] })
  }

  try {
    const url = `https://www.youtube.com/results?sp=EgIQAQ%253D%253D&search_query=${encodeURIComponent(q)}`
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
    })

    if (!response.ok) {
      return res.status(502).json({ results: [], error: `YouTube HTTP ${response.status}` })
    }

    const html = await response.text()
    const marker = 'var ytInitialData = '
    const startIdx = html.indexOf(marker)
    if (startIdx === -1) {
      return res.status(200).json({ results: [] })
    }
    const jsonStart = startIdx + marker.length
    const endIdx = html.indexOf(';</script>', jsonStart)
    if (endIdx === -1) {
      return res.status(200).json({ results: [] })
    }

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
            `Video hasil pencarian YouTube untuk "${q}".`,
        })
        if (results.length >= 12) break
      }
      if (results.length >= 12) break
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    return res.status(200).json({ results })
  } catch (err) {
    return res.status(500).json({ results: [], error: err?.message || 'Gagal mencari video' })
  }
}
