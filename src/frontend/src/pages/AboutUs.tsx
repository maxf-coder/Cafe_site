import { useI18n } from '@/i18n/context';
import ContentPageHero from '@/components/content/ContentPageHero';
import ContentGrid from '@/components/content/ContentGrid';
import VideoSection from '@/components/content/VideoSection';
import ReelsCarousel from '@/components/content/ReelsCarousel';
import { aboutData } from '@/lib/contentData';
import type { Section } from '@/components/content/ContentCard';

const reels = [
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/98364e493_generated_image.png', label: 'Chef în acțiune', youtubeId: null },
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/f7cdd5deb_generated_image.png', label: 'Terasă de vară', youtubeId: null },
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/8b4f35f21_generated_image.png', label: 'Cocktailuri artizanale', youtubeId: null },
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/c85442175_generated_image.png', label: 'Salate proaspete', youtubeId: null },
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/861290246_generated_image.png', label: 'Comunitate', youtubeId: null },
  { thumbnail: 'https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/98364e493_generated_image.png', label: 'Bucătăria noastră', youtubeId: null },
];

export default function AboutUs() {
  const { t, lang } = useI18n();

  const videoTitles = {
    ro: 'Vizitați-ne', en: 'Visit Us', ru: 'Посетите нас',
  };
  const videoSubtitles = {
    ro: 'O privire în atmosfera caldă a cafenelei noastre',
    en: 'A glimpse into the warm atmosphere of our café',
    ru: 'Взгляд на тёплую атмосферу нашего кафе',
  };
  const reelsTitles = {
    ro: 'Momente din viața noastră', en: 'Moments from Our Life', ru: 'Моменты из нашей жизни',
  };

  return (
    <div>
      <ContentPageHero
        image="https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/b51b8cfb3_generated_1da8bb42.png"
        title={t('nav.about')}
      />
      <ContentGrid sections={aboutData.sections as Section[]} />

      <VideoSection
        title={videoTitles[lang]}
        subtitle={videoSubtitles[lang]}
        youtubeId="dQw4w9WgXcQ"
        thumbnailUrl="https://media.base44.com/images/public/6a0982e2e3691dc690c8f67d/b51b8cfb3_generated_1da8bb42.png"
      />

      <ReelsCarousel title={reelsTitles[lang]} reels={reels} />
    </div>
  );
}