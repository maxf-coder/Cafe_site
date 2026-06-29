import { useState } from 'react';
import Hero from '@/components/shared/Hero';
import MenuCategoryBar from '@/components/menu/MenuCategoryBar';
import MenuSection from '@/components/menu/MenuSection';
import ProductModal from '@/components/menu/ProductModal';
import { useI18n } from '@/i18n/context';
import { useQuery } from '@tanstack/react-query';
import { fetchContentPage } from '@/api/contentPages';
import { fetchMenuCategories } from '@/api/menuCategories';
import type { MenuProduct } from '@/types/api';


export default function Menu() {
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);

  const { lang } = useI18n()

  const { data: page } = useQuery({
    queryKey: ["page", "menu", lang],
    queryFn: () => fetchContentPage("meniu"),
  })

  const { data: menuCategories } = useQuery({
    queryKey: ["menu", lang],
    queryFn: fetchMenuCategories,
  })

  const categoryKeys = menuCategories?.map(c => c.name) || []

  return (
    <div>
      {(page?.hero || false) && <Hero heroData={page.hero}/>}
      <MenuCategoryBar categoryKeys={categoryKeys}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {(menuCategories ?? []).map((categoryData) => (
          <MenuSection
            categoryData={categoryData}
            onProductClick={setSelectedProduct }
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}