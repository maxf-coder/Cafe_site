import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useQuery } from '@tanstack/react-query';
import { fetchImages } from '@/api/images';
import { Helmet } from 'react-helmet-async'
import { useI18n } from "@/i18n/context"
import { useEffect } from 'react';
import RestaurantSchema from '@/components/seo/RestaurantSchema'


export default function AppLayout() {
  const { lang } = useI18n()
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname]);

  const { data: images } = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
    staleTime: Infinity,
  });

  return (
    <>
      <RestaurantSchema />
      <Helmet>
        <html lang={lang} />
        <link rel="icon" href={images?.logo?.src || "/images/placeholderLogo.png"} />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}