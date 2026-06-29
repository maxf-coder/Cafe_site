export type SiteSettings = {
    [key: string]: string;
}

export type SiteImages = {
    [key: string]: {
        src: string,
        alt: string,
    } | null;
}

export type PageHero  = {
  main_text: string;
  secondary_text: string;
  img_src: string;
  alt_text: string;
}

type SectionType = 'wide_image' | 'tight_image' | 'video' | 'reels';

export type WideImageContent = {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  img_src: string;
  alt_text: string;
}

type TightImageCard = {
  title: string;
  short_description: string;
  full_description: string;
  img_src: string;
  alt_text: string;
}

export type TightImageContent = {
  id: string;
  title: string;
  cards: TightImageCard[];
}

export type VideoContent = {
  id: string;
  title: string;
  video_url: string;
  description: string;
}

export type ReelItem = {
  video_url: string;
}

export type ReelsContent = {
  id: string;
  title: string;
  reels: ReelItem[];
}

type SectionContent = WideImageContent | TightImageContent | VideoContent | ReelsContent;

export type PageSection = {
  id: string;
  type: SectionType;
  content: SectionContent;
}

export type ContentPageResponse = {
  name: string;
  slug: string;
  hero: PageHero | null;
  sections: PageSection[];
}

export type MenuProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  weight_g: number | null;
  short_description: string;
  full_description: string;
  img_src: string;
  alt_text: string;
}

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  products: MenuProduct[];
}