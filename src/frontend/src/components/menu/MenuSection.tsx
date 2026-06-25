import { useI18n } from '@/i18n/context';
import ProductCard from './ProductCard';
import type {MenuItem} from "./ProductCard"

type MenuSectionData = {
  id: string
  items: MenuItem[]
}

export default function MenuSection({ 
    categoryKey, 
    data, 
    onProductClick 
  }: {
    categoryKey: string
    data: MenuSectionData
    onProductClick: (item: MenuItem) => void
  }) 
{
  const { t } = useI18n();

  return (
    <section id={categoryKey} className="scroll-mt-36">
      <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
        {t(`menu.categories.${categoryKey}`)}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {data.items.map((item) => (
          <ProductCard key={item.id} item={item} onClick={onProductClick} />
        ))}
      </div>
    </section>
  );
}