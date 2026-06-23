import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/context';
import { Phone, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = ['RO', 'EN', 'RU'];

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.menu') },
    { path: '/despre-noi', label: t('nav.about') },
    { path: '/evenimente', label: t('nav.events') },
    { path: '/caritate', label: t('nav.charity') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/ff04397a9_generated_80e908ea.png"
              alt="Fiesta Gastro Cafe"
              className="h-10 md:h-12 w-10 md:w-12 rounded-squircle object-cover"
            />
            <span className="font-heading font-semibold text-lg md:text-xl text-secondary hidden sm:block">
              Fiesta <span className="text-primary">Gastro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-squircle font-body text-sm font-medium transition-all duration-300 ${
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
          <div className="hidden md:flex items-center gap-4">
            {/* Phone */}
            <a
              href="tel:+37360123456"
              className="flex items-center gap-2 text-secondary font-body text-sm font-medium hover:text-primary transition-colors duration-300"
            >
              <Phone className="w-4 h-4" />
              <span className="text-xs text-muted-foreground mr-1">{t('nav.orderNow')}</span>
              +373 60 123456
            </a>

            {/* Language Switcher */}
            <div className="flex items-center bg-accent rounded-squircle p-1 gap-0.5">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l.toLowerCase())}
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
            className="md:hidden p-2 rounded-squircle hover:bg-accent transition-colors"
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
            className="md:hidden bg-background border-t border-border/50 overflow-hidden"
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
                href="tel:+37360123456"
                className="flex items-center gap-2 px-4 py-3 text-secondary font-body text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                +373 60 123456
              </a>

              <div className="flex items-center gap-1 px-4 py-2">
                {languages.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l.toLowerCase()); setMobileOpen(false); }}
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