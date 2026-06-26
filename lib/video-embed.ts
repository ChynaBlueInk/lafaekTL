// lib/video-embed.ts
// Parses YouTube and TikTok URLs and returns embed-ready data

export type VideoType = "youtube" | "tiktok" | "unknown"

export type ParsedVideo = {
  type: VideoType
  id: string
  embedUrl: string
  originalUrl: string
}

/**
 * Extract a YouTube video ID from any standard YouTube URL format:
 *   https://www.youtube.com/watch?v=VIDEOID
 *   https://youtu.be/VIDEOID
 *   https://www.youtube.com/embed/VIDEOID
 *   https://www.youtube.com/shorts/VIDEOID
 */
function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url)

    // youtu.be/VIDEOID
    if (u.hostname === "youtu.be") {
      return u.pathname.replace(/^\//, "").split("/")[0] ?? ""
    }

    // youtube.com/shorts/VIDEOID
    if (u.pathname.startsWith("/shorts/")) {
      return u.pathname.split("/")[2] ?? ""
    }

    // youtube.com/embed/VIDEOID
    if (u.pathname.startsWith("/embed/")) {
      return u.pathname.split("/")[2] ?? ""
    }

    // youtube.com/watch?v=VIDEOID
    return u.searchParams.get("v") ?? ""
  } catch {
    return ""
  }
}

/**
 * Extract a TikTok video ID from standard TikTok URLs:
 *   https://www.tiktok.com/@username/video/VIDEOID
 *   https://vm.tiktok.com/SHORTCODE/
 */
function extractTikTokId(url: string): string {
  try {
    const u = new URL(url)
    const parts = u.pathname.split("/")
    const videoIndex = parts.indexOf("video")
    if (videoIndex !== -1) {
      return parts[videoIndex + 1] ?? ""
    }
    // Short link — can't get embed ID without resolving, return the path
    return u.pathname.replace(/^\//, "").replace(/\/$/, "")
  } catch {
    return ""
  }
}

/**
 * Parse a video URL and return embed data.
 * Returns null if the URL is not a recognised video URL.
 */
export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = raw.trim()
  if (!url) return null

  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")

    // YouTube
    if (host === "youtube.com" || host === "youtu.be") {
      const id = extractYouTubeId(url)
      if (!id) return null
      return {
        type: "youtube",
        id,
        embedUrl: `https://www.youtube.com/embed/${id}`,
        originalUrl: url,
      }
    }

    // TikTok
    if (host === "tiktok.com" || host === "vm.tiktok.com") {
      const id = extractTikTokId(url)
      if (!id) return null
      return {
        type: "tiktok",
        id,
        // TikTok oEmbed embed URL
        embedUrl: `https://www.tiktok.com/embed/v2/${id}`,
        originalUrl: url,
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Returns true if the URL is a supported YouTube or TikTok link.
 */
export function isSupportedVideoUrl(url: string): boolean {
  return parseVideoUrl(url) !== null
}

/**
 * Returns a short label for display e.g. "YouTube" or "TikTok".
 */
export function getVideoPlatformLabel(url: string): string {
  const parsed = parseVideoUrl(url)
  if (!parsed) return ""
  if (parsed.type === "youtube") return "YouTube"
  if (parsed.type === "tiktok") return "TikTok"
  return ""
}