from django.contrib import admin
from .models import SiteSettings, Page, PageHero, PageSection

@admin.register(SiteSettings)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "description")

class PageHeroInline(admin.StackedInline):
    model = PageHero
    can_delete = False

class PageSectionInline(admin.StackedInline):
    model = PageSection
    extra = 0

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published")
    prepopulated_fields = {"slug": ("name",)}
    inlines = PageHeroInline, PageSectionInline