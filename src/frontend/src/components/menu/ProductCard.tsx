import { motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';
import { Plus } from 'lucide-react';

export type MenuItem = {
  id: number
  name: { ro: string; en: string; ru: string }
  price: number
  shortDesc: { ro: string; en: string; ru: string }
  fullDesc: { ro: string; en: string; ru: string }
  image: string
  weight: string
}

type ProductCardProps = {
  item: MenuItem
  onClick: (item: ProductCardProps['item']) => void
}


export default function ProductCard({ item, onClick }: ProductCardProps) {
  const { lang } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={() => onClick(item)}
      className="group bg-accent rounded-squircle overflow-hidden cursor-pointer
        hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-t-squircle">
        <img
          src={item.image}
          alt={item.name[lang]}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-semibold text-sm md:text-base text-foreground leading-tight">
            {item.name[lang]}
          </h3>
          <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center
            group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <Plus className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>

        <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {item.shortDesc[lang]}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-heading font-bold text-secondary text-lg">
            {item.price} MDL
          </span>
          {item.weight && (
            <span className="text-xs text-muted-foreground font-body">{item.weight}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}