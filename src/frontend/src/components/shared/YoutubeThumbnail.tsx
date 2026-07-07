import { useState, useEffect, useCallback } from 'react'
import { getYoutubeId, getYoutubeTumbnailUrl } from '@/utils/YoutubeVideos'
import type { ThumbnailSize } from '@/utils/YoutubeVideos'
import ImageWithSkeleton from './ImageWithSkeleton'

interface Props {
  videoUrl: string
  sizes?: ThumbnailSize[]
  className?: string
  alt?: string
}

export default function YoutubeThumbnail({ videoUrl, sizes = ['maxresdefault', 'sddefault', 'hqdefault'], className, alt }: Props) {
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    setAttempt(0)
  }, [videoUrl])

  const youtubeId = getYoutubeId(videoUrl)

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (e.currentTarget.naturalWidth > 120) return
    setAttempt(prev => Math.min(prev + 1, sizes.length - 1))
  }, [sizes.length])

  if (!youtubeId) return null

  const src = getYoutubeTumbnailUrl(videoUrl, sizes[Math.min(attempt, sizes.length - 1)])

  return (
    <ImageWithSkeleton
      src={src}
      alt={alt || ''}
      width="480"
      height="360"
      loading="lazy"
      className={className}
      onLoad={handleLoad}
    />
  )
}
