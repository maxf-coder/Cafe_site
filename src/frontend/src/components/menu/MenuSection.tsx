import ProductCard from './ProductCard';
import type { MenuCategory } from '@/types/api';
import type { MenuProduct } from '@/types/api';

export default function MenuSection({ 
    categoryData,
    onProductClick ,
  }: {
    categoryData: MenuCategory
    onProductClick: (product: MenuProduct) => void
  }) 
{


  return (
    <section id={categoryData.id} className="scroll-mt-36">
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
        {categoryData.name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categoryData.products.map((product) => (
          <ProductCard key={product.id} product={product} onClick={onProductClick} />
        ))}
      </div>
    </section>
  );
}