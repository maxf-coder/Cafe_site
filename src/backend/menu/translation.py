from modeltranslation.translator import translator, TranslationOptions
from .models import MenuCategory, MenuProduct


class MenuCategoryTranslationOptions(TranslationOptions):
    fields = ("name",)


class MenuProductTranslationOptions(TranslationOptions):
    fields = ("name", "short_description", "full_description", "alt_text")


translator.register(MenuCategory, MenuCategoryTranslationOptions)
translator.register(MenuProduct, MenuProductTranslationOptions)
