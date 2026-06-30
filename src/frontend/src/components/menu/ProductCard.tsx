import { motion } from 'framer-motion';
import type {MenuProduct} from "@/types/api"

type ProductCardProps = {
  product: MenuProduct
  onClick: (item: ProductCardProps['product']) => void
}


export default function ProductCard({ product, onClick }: ProductCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      onClick={() => onClick(product)}
      className="group bg-accent rounded-squircle overflow-hidden cursor-pointer
        hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-t-squircle">
        <img
          src={product.img_src}
          alt={product.alt_text}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading font-semibold text-sm md:text-base text-foreground leading-tight">
            {product.name}
          </h2>
        </div>

        <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.short_description}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-heading font-bold text-secondary text-lg">
            {product.price} MDL
          </span>
          {product.weight_g && (
            <span className="text-xs text-muted-foreground font-body">{product.weight_g} g</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}