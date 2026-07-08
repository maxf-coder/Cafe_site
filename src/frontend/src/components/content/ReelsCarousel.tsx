import { useRef, useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReelsContent } from '@/types/api';
import type { ReelItem } from '@/types/api';
import { getYoutubeEmbedingUrl, getYoutubeId, getYoutubeTumbnailUrl } from '@/utils/YoutubeVideos';
import YoutubeThumbnail from '@/components/shared/YoutubeThumbnail';
import ImageWithSkeleton from '../shared/ImageWithSkeleton';

export default function ReelsCarousel({ content }: { content: ReelsContent}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);


  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        {content.title && (
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground">{content.title}</h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-9 h-9 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300
              flex items-center justify-center text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-9 h-9 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300
              flex items-center justify-center text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reel strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {content.reels.map((reel, idx) => (
          <div
            key={idx}
            className="shrink-0 relative cursor-pointer group"
            style={{ scrollSnapAlign: 'start', width: '180px' }}
            onClick={() => setActiveReel(reel)}
          >
            <div className="aspect-[9/16] w-full rounded-squircle overflow-hidden bg-accent shadow-md
              transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <YoutubeThumbnail
                videoUrl={reel.video_url}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-foreground/20 rounded-squircle group-hover:bg-foreground/10 transition-colors duration-300" />
              {/* play */}
              <div className="absolute inset-0 flex items-end justify-center pb-5">
                <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center
                  shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-4 h-4 text-primary ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {activeReel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 backdrop-blur-sm"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-[min(90vw,380px)] aspect-[9/16] rounded-squircle overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {getYoutubeId(activeReel.video_url) ? (
              <iframe
                className="w-full h-full"
                src={getYoutubeEmbedingUrl(activeReel.video_url)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <ImageWithSkeleton src={getYoutubeTumbnailUrl(activeReel.video_url)} className="w-full h-full object-cover" />
            )}
            <button
              onClick={() => setActiveReel(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-lg font-bold hover:bg-black/80 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}