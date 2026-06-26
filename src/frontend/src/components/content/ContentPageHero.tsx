import { motion } from 'framer-motion';

export default function ContentPageHero({ image, title }: { image: string, title: string}) {
  return (
    <section className="relative h-[35vh] md:h-[45vh] overflow-hidden">
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white text-center px-4 drop-shadow-lg"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}