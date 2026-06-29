import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import type { WideImageContent } from '@/types/api';

export default function WideImageSection({ content }: { content: WideImageContent }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      <div className="bg-accent rounded-squircle overflow-hidden group">
        <div className="aspect-[16/7] overflow-hidden">
          <img
            src={content.img_src}
            alt={content.alt_text}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-5 md:p-6 space-y-3">
          {content.title && (
            <h3 className="font-heading font-bold text-lg md:text-xl text-foreground">{content.title}</h3>
          )}
          <AnimatePresence mode="wait">
            <motion.p
              key={expanded ? 'full' : 'short'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-body text-sm text-muted-foreground leading-relaxed"
            >
              {expanded && content.full_description ? content.full_description : content.short_description}
            </motion.p>
          </AnimatePresence>
          {content.full_description && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}
