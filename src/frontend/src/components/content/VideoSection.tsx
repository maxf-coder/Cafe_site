import { useState } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VideoSection(
    { title, subtitle, youtubeId, thumbnailUrl }:
    { title: string, subtitle: string, youtubeId: string, thumbnailUrl: string }
) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">{title}</h2>
          )}
          {subtitle && (
            <p className="font-body text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative aspect-video w-full rounded-squircle overflow-hidden bg-foreground/10 shadow-lg group">
        {playing && youtubeId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title || 'Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={thumbnailUrl}
              alt={title || 'Video'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/20 transition-colors duration-300" />
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play video"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 backdrop-blur-sm
                flex items-center justify-center shadow-xl
                transition-all duration-300 hover:scale-110 hover:bg-primary group-hover:shadow-primary/40">
                <Play className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="white" />
              </div>
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}