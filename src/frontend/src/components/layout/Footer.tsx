import { useI18n } from '@/i18n/context';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { FaInstagram, FaFacebook } from 'react-icons/fa'

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/ff04397a9_generated_80e908ea.png"
                alt="Fiesta Gastro Cafe"
                className="h-12 w-12 rounded-squircle object-cover"
              />
              <span className="font-heading font-semibold text-xl text-white">
                Fiesta Gastro
              </span>
            </div>
            <p className="text-secondary-foreground/70 text-sm font-body leading-relaxed">
              Example Mission
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">{t('footer.contacts')}</h3>
            <div className="space-y-3">
              <a href="tel:+37360123456" className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-white transition-colors duration-300">
                <div className="w-9 h-9 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                +37360123456
              </a>
              <a href="mailto:contact@fiestagastro.md" className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-white transition-colors duration-300">
                <div className="w-9 h-9 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                Example email
              </a>
            </div>
          </div>

          {/* Schedule & Address */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">{t('footer.schedule')}</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p>example weekends days</p>
                  <p>example working days</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <p>Example address</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">{t('footer.social')}</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-105">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-105">
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-secondary-foreground/50 text-xs font-body">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}