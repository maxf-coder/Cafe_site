import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import type { Lang } from "@/i18n/context"
import { Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '@/api/settings';
import { fetchImages } from '@/api/images';

const languages = ['RO', 'EN', 'RU'];

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const {data: settings} = useQuery({
    queryKey: ["settings", lang],
    queryFn: fetchSettings,
  })

  const {data: images} = useQuery({
    queryKey: ["images"],
    queryFn: fetchImages,
    staleTime: Infinity,
  })

  const navLinks = [
    { path: '/', label: t('nav.menu') },
    { path: '/content/despre-noi', label: t('nav.about') },
    { path: '/content/evenimente', label: t('nav.events') },
    { path: '/content/caritate', label: t('nav.charity') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={images?.logo?.src || "/images/placeholderLogo.png"}
              alt={images?.logo?.alt || ""}
              className="h-10 lg:h-12 w-10 lg:w-12 rounded-squircle object-cover"
            />
            <span className="font-heading font-semibold text-lg lg:text-xl text-secondary hidden sm:block">
              Fiesta <span className="text-primary">Gastro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-squircle font-body text-sm font-medium transition-all duration-300 text-center ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-accent hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Phone */}
            <a
              href={`tel:${settings?.phone || ""}`}
              className="flex items-center gap-2 text-secondary font-body text-sm font-medium hover:text-primary transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="text-xs text-muted-foreground mr-1">{t('nav.orderNow')}</span>
              {settings?.phone || ""}
            </a>

            {/* Language Switcher */}
            <div className="flex items-center bg-accent rounded-squircle p-1 gap-0.5">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l.toLowerCase() as Lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-body font-semibold transition-all duration-300 ${
                    lang === l.toLowerCase()
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-squircle hover:bg-accent transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-squircle font-body text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <a
                href={`tel:${settings?.phone || ""}`}
                className="flex items-center gap-2 px-4 py-3 text-secondary font-body text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                {settings?.phone || ""}
              </a>

              <div className="flex items-center gap-1 px-4 py-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l.toLowerCase() as Lang); setMobileOpen(false); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-body font-semibold transition-all duration-300 ${
                      lang === l.toLowerCase()
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-muted-foreground'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}