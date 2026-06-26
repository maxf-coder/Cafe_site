import { useState } from 'react';
import { useI18n } from '@/i18n/context';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export type Section = {
    id: number
    type: 'wide-image' | 'small-image'
    image: string
    title: { ro: string; en: string; ru: string }
    shortText: { ro: string; en: string; ru: string }
    fullText: { ro: string; en: string; ru: string }
}

export default function ContentCard({ section }: { section: Section}) {
  const { lang, t } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const isWide = section.type === 'wide-image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`bg-accent rounded-squircle overflow-hidden group ${
        isWide ? 'col-span-1 sm:col-span-2' : 'col-span-1'
      }`}
    >
      {/* Image */}
      <div className={`overflow-hidden ${isWide ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
        <img
          src={section.image}
          alt={section.title[lang]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 space-y-3">
        <h3 className="font-heading font-bold text-lg md:text-xl text-foreground">
          {section.title[lang]}
        </h3>

        <AnimatePresence mode="wait">
          <motion.p
            key={expanded ? 'full' : 'short'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-body text-sm text-muted-foreground leading-relaxed"
          >
            {expanded ? section.fullText[lang] : section.shortText[lang]}
          </motion.p>
        </AnimatePresence>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-primary font-body text-sm font-semibold
            hover:text-primary/80 transition-colors duration-300 group/btn"
        >
          {expanded ? t('common.showLess') : t('common.showMore')}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
    </motion.div>
  );
}