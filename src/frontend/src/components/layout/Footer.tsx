import { useI18n } from '@/i18n/context';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { FaInstagram, FaFacebook, FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { useQuery } from '@tanstack/react-query';
import { fetchSettings } from '@/api/settings';
import { fetchImages } from '@/api/images';
import ImageWithSkeleton from '../shared/ImageWithSkeleton';

export default function Footer() {
  const { t, lang } = useI18n();

  const { data: settings } = useQuery({
    queryKey: ["settings", lang],
    queryFn: fetchSettings,
  })

  const {data: images} = useQuery({
      queryKey: ["images"],
      queryFn: fetchImages,
      staleTime: Infinity,
    })

  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ImageWithSkeleton
                src={images?.logo?.src || "/images/placeholderLogo.png"}
                alt={images?.logo?.alt || ""}
                width="48"
                height="48"
                loading="lazy"
                className="h-12 w-12 rounded-squircle object-cover"
              />
              <span className="font-heading font-semibold text-xl text-white">
                Fiesta Gastro
              </span>
            </div>
            <p className="text-secondary-foreground/70 text-sm font-body leading-relaxed">
              {settings?.mission || ""}
            </p>
          </div>

          {/* Contacts */}
          <div className="space-y-4">
            <h2 className="font-heading font-semibold text-lg text-white">{t('footer.contacts')}</h2>
            <div className="space-y-3">
              <a href={`tel:${settings?.phone || ""}`} className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-white transition-colors duration-300">
                <div className="w-9 h-9 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                {settings?.phone || ""}
              </a>
              <a href={`mailto:${settings?.email || ""}`} className="flex items-center gap-3 text-sm text-secondary-foreground/80 hover:text-white transition-colors duration-300">
                <div className="w-9 h-9 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                {settings?.email || ""}
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
                  <p className="whitespace-pre-wrap">{settings?.working_days}</p>
                  <p className="whitespace-pre-wrap">{settings?.weekend_days}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{settings?.address || ""}</p>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-heading font-semibold text-lg text-white">{t('footer.social')}</h3>
            <div className="flex gap-3">
              <a href={`${settings?.instagram_link || ""}`} className="w-10 h-10 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-105">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href={`${settings?.facebook_link || ""}`} className="w-10 h-10 rounded-squircle bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 hover:scale-105">
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Credits */}
        {settings?.disclaimer && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="bg-white/5 rounded-squircle p-6 md:p-8 max-w-2xl mx-auto text-center space-y-4">
              <p className="text-secondary-foreground/60 text-xs font-body leading-relaxed italic">
                "{settings.disclaimer}"
              </p>

              {settings.developer_name && (
                <div className="flex items-center justify-center gap-2 text-xs text-secondary-foreground/50 font-body">
                  <span className="w-8 h-px bg-white/10" />
                  {t('footer.builtBy')} <span className="text-primary font-semibold">{settings.developer_name}</span>
                  <span className="w-8 h-px bg-white/10" />
                </div>
              )}

              <div className="flex justify-center gap-3">
                {settings.developer_github && (
                  <a href={settings.developer_github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-secondary-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
                    <FaGithub className="w-4 h-4" />
                  </a>
                )}
                {settings.developer_linkedin && (
                  <a href={settings.developer_linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-secondary-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                )}
                {settings.developer_email && (
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${settings.developer_email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email"
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-secondary-foreground/60 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300">
                    <FaEnvelope className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <p className="text-secondary-foreground/50 text-xs font-body">{settings?.footer_copyright || ""}</p>
        </div>
      </div>
    </footer>
  );
}