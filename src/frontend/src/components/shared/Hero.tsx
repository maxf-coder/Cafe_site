import { motion } from 'framer-motion';
import type { PageHero } from '@/types/api';
import ImageWithSkeleton from './ImageWithSkeleton';

export default function Hero( { heroData }: {heroData: PageHero}) {
  return (
    <section className="relative h-[30vh] md:h-[40vh] lg:h-[50vh] xl:h-[60vh] 2xl:h-[70vh] overflow-hidden">
      <ImageWithSkeleton
        src={heroData.img_src}
        alt={heroData.alt_text}
        fetchPriority="high"
        width="1920"
        height="1080"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/30 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-center px-4"
        >
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
            {heroData.main_text}
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow hidden md:block">
            {heroData.secondary_text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}