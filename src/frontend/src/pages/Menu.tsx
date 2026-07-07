import { useState } from 'react';
import Hero from '@/components/shared/Hero';
import MenuCategoryBar from '@/components/menu/MenuCategoryBar';
import MenuSection from '@/components/menu/MenuSection';
import ProductModal from '@/components/menu/ProductModal';
import Loader from '@/components/shared/Loader';
import ErrorState from '@/components/shared/ErrorState';
import SEOHelmet from '@/components/seo/SEOHelmet';
import { useI18n } from '@/i18n/context';
import { useQuery } from '@tanstack/react-query';
import { fetchContentPage } from '@/api/contentPages';
import { fetchMenuCategories } from '@/api/menuCategories';
import type { MenuProduct } from '@/types/api';


export default function Menu() {
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct | null>(null);

  const { lang, t } = useI18n()

  const { data: page, isLoading: pageLoading, isError: pageError, refetch: refetchPage } = useQuery({
    queryKey: ["page", "menu", lang],
    queryFn: () => fetchContentPage("meniu"),
  })

  const { data: menuCategories, isLoading: menuLoading, isError: menuError, refetch: refetchMenu } = useQuery({
    queryKey: ["menu", lang],
    queryFn: fetchMenuCategories,
  })

  if (pageLoading || menuLoading) return <Loader />

  if (pageError || menuError) return (
    <ErrorState
      message={menuError ? t('error.menu') : t('error.page')}
      onRetry={() => { refetchPage(); refetchMenu(); }}
    />
  )

  return (
    <>
      <SEOHelmet
        title="Meniu"
        description="Vezi meniul nostru complet cu preparate delicioase și băuturi răcoritoare."
        type="restaurant.menu"
      />
      
      <div>
        {(page?.hero || false) && <Hero heroData={page.hero}/>}
        <MenuCategoryBar menuCategories={menuCategories ?? []}/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
          {(menuCategories ?? []).map((categoryData) => (
            <MenuSection
              key={categoryData.slug}
              categoryData={categoryData}
              onProductClick={setSelectedProduct }
            />
          ))}
        </div>

        {selectedProduct && (
          <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </>
  );
}