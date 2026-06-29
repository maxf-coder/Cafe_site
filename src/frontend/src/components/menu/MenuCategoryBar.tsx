import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '@/i18n/context';
import type { MenuCategory } from '@/types/api';

export default function MenuCategoryBar( { menuCategories }: { menuCategories: MenuCategory[]}) {
  const [activeCategory, setActiveCategory] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n()
  // On desktop show first 5 inline, rest go in "More" dropdown
  const VISIBLE_COUNT = 5;
  const visibleKeys = menuCategories.slice(0, VISIBLE_COUNT);
  const hiddenKeys = menuCategories.slice(VISIBLE_COUNT);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveCategory(entry.target.id);
        });
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );
    menuCategories.forEach((cat) => {
      const el = document.getElementById(cat.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [menuCategories]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 140;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setDropdownOpen(false);
  };

  const isHiddenActive = hiddenKeys.some((cat) => cat.slug === activeCategory);

  return (
    <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4">

        {/* Mobile: horizontal scroll */}
        <div className="flex md:hidden gap-1 py-3 overflow-x-auto scrollbar-hide">
          {menuCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => scrollTo(cat.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-squircle font-body text-sm font-medium transition-all duration-300 shrink-0 ${
                activeCategory === cat.slug
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Desktop: fixed visible + More dropdown */}
        <div className="hidden md:flex items-center gap-1 py-3">
          {visibleKeys.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => scrollTo(cat.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-squircle font-body text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.slug
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {/* More dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-squircle font-body text-sm font-medium transition-all duration-300 ${
                isHiddenActive || dropdownOpen
                  ? 'bg-secondary text-secondary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {isHiddenActive ? activeCategory : t('menu.more')}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 mt-2 bg-background border border-border rounded-squircle shadow-xl overflow-hidden min-w-[160px] z-50"
                >
                  {hiddenKeys.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => scrollTo(cat.slug)}
                      className={`w-full text-left px-4 py-2.5 font-body text-sm transition-colors duration-200 ${
                        activeCategory === cat.slug
                          ? 'bg-secondary text-secondary-foreground font-semibold'
                          : 'text-foreground hover:bg-accent'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}