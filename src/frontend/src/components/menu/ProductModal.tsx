import { useI18n } from '@/i18n/context';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuProduct } from '@/types/api';
import ImageWithSkeleton from '../shared/ImageWithSkeleton';

export default function ProductModal({ product, onClose }: { product: MenuProduct, onClose: () => void}) {
  const { t } = useI18n();

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-background rounded-t-[2rem] sm:rounded-squircle w-full sm:max-w-lg
            max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-foreground/20 backdrop-blur-sm
              flex items-center justify-center text-white hover:bg-foreground/40 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image */}
          <div className="aspect-[4/3] w-full overflow-hidden rounded-t-[2rem] sm:rounded-t-squircle">
            <ImageWithSkeleton
              src={product.img_src}
              alt={product.alt_text}
              width="600"
              height="450"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground">
                {product.name}
              </h3>
              <span className="font-heading font-bold text-xl text-secondary shrink-0">
                {product.price} MDL
              </span>
            </div>

            {product.weight_g && (
              <span className="inline-block text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full font-body">
                {product.weight_g} g
              </span>
            )}

            <div
              className="prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-primary [&_a]:underline [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:bg-accent"
              dangerouslySetInnerHTML={{ __html: product.full_description}}
            />

            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-primary-foreground font-body font-semibold text-sm
                rounded-squircle hover:bg-primary/90 transition-colors duration-300 mt-4"
            >
              {t('common.close')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}