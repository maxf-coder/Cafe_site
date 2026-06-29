import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/i18n/context';
import type { TightImageContent, TightImageCard } from '@/types/api';

function TightCard({ card }: { card: TightImageCard }) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-accent rounded-squircle overflow-hidden group">
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={card.img_src}
          alt={card.alt_text}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 md:p-6 space-y-3">
        {card.title && (
          <h3 className="font-heading font-bold text-lg md:text-xl text-foreground">{card.title}</h3>
        )}
        <AnimatePresence mode="wait">
          <motion.p
            key={expanded ? 'full' : 'short'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-body text-sm text-muted-foreground leading-relaxed"
          >
            {expanded && card.full_description ? card.full_description : card.short_description}
          </motion.p>
        </AnimatePresence>
        {card.full_description && (
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
  );
}

export default function TightImageGrid({ content }: { content: TightImageContent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
    >
      {content.title && (
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">{content.title}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {content.cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TightCard card={card} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
