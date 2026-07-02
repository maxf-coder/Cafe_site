import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useQuery } from '@tanstack/react-query';
import { fetchImages } from '@/api/images';
import { useEffect } from 'react';


export default function AppLayout() {
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
      { (images?.logo?.src && <link rel="icon" href={images.logo.src} />) || (<link rel="icon" href="/images/placeholderLogo.png" />) }
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