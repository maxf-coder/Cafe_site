from modeltranslation.translator import translator, TranslationOptions
from .models import (
    Page,
    PageHero,
    WideImageSection,
    VideoSection,
    TightImageSection,
    TightImageCard,
    ReelsSection,
    SiteSettings,
)


class PageTranslationOptions(TranslationOptions):
    fields = ("name",)


class PageHeroTranslationOptions(TranslationOptions):
    fields = ("main_text", "secondary_text", "alt_text")


class WideImageSectionTranslationOptions(TranslationOptions):
    fields = ("title", "short_description", "full_description", "alt_text")


class VideoSectionTranslationOptions(TranslationOptions):
    fields = ("title", "description")


class TightImageSectionTranslationOptions(TranslationOptions):
    fields = ("title",)


class TightImageCardTranslationOptions(TranslationOptions):
    fields = ("title", "short_description", "full_description", "alt_text")


class ReelsSectionTranslationOptions(TranslationOptions):
    fields = ("title",)


class SiteSettingsTranslationOptions(TranslationOptions):
    fields = ("value",)


translator.register(Page, PageTranslationOptions)
translator.register(PageHero, PageHeroTranslationOptions)
translator.register(WideImageSection, WideImageSectionTranslationOptions)
translator.register(VideoSection, VideoSectionTranslationOptions)
translator.register(TightImageSection, TightImageSectionTranslationOptions)
translator.register(TightImageCard, TightImageCardTranslationOptions)
translator.register(ReelsSection, ReelsSectionTranslationOptions)
translator.register(SiteSettings, SiteSettingsTranslationOptions)