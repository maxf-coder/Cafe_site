export type ThumbnailSize = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default'

export function getYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?&]+)/,
    /(?:youtube\.com\/embed\/)([^?&]+)/,
    /(?:youtube\.com\/shorts\/)([^?&]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYoutubeEmbedingUrl(video_url: string){
  const youtubeId = getYoutubeId(video_url)
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`
}

export function getYoutubeTumbnailUrl(video_url: string, size: ThumbnailSize = 'maxresdefault'){
  const youtubeId = getYoutubeId(video_url)
  if (!youtubeId) return ''
  return `https://img.youtube.com/vi/${youtubeId}/${size}.jpg`
}