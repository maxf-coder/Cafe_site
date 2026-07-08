import { useState } from 'react'

interface Props {
  src: string
  alt?: string
  className?: string
  width?: string | number
  height?: string | number
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export default function ImageWithSkeleton({ src, alt, className, ...props }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={className || ''}
      style={{
        background: 'linear-gradient(135deg, #d1d5db 0%, #d1d5db 42%, #f3f4f6 46%, #f3f4f6 54%, #d1d5db 58%, #d1d5db 100%)',
        backgroundSize: '300% 300%',
        animation: loaded ? 'none' : 'shimmer 1.5s ease-in-out infinite',
      }}
    >
      <img
        src={src}
        alt={alt || ""}
        {...props}
        className={`${className || ''} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={(e) => { setLoaded(true); props.onLoad?.(e) }}
      />
    </div>
  )
}