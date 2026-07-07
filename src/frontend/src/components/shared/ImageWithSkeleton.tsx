import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  width?: string
  height?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export default function ImageWithSkeleton({ src, alt, className, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: props.width && props.height ? `${props.width}/${props.height}` : undefined }}>
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 
          bg-[length:200%_100%] animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => { setLoaded(true); props.onLoad?.(e) }}
        {...props}
      />
    </div>
  )
}