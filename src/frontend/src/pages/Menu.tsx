import { useState } from 'react';
import MenuHero from '@/components/menu/MenuHero';
import MenuCategoryBar from '@/components/menu/MenuCategoryBar';
import MenuSection from '@/components/menu/MenuSection';
import ProductModal from '@/components/menu/ProductModal';
import { menuData } from '@/lib/menuData';
import type { MenuItem } from '@/components/menu/ProductCard';

const categoryOrder = ['appetizers', 'salads', 'soups', 'main_courses', 'pasta', 'desserts', 'drinks'] as const;

export default function Menu() {
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  return (
    <div>
      <MenuHero />
      <MenuCategoryBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {categoryOrder.map((key) => (
          <MenuSection
            key={key}
            categoryKey={key}
            data={menuData[key]}
            onProductClick={setSelectedProduct }
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal item={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}