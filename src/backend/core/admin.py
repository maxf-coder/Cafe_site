from django.contrib import admin
from adminsortable2.admin import SortableAdminMixin, SortableTabularInline, SortableStackedInline
from .models import (
    SiteSettings,
    Page,
    PageHero,
    WideImageSection,
    VideoSection,
    TightImageCard,
    TightImageSection,
    ReelItem,
    ReelsSection,
)

@admin.register(SiteSettings)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("key", "description")

class PageHeroInline(admin.StackedInline):
    model = PageHero
    can_delete = False



@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PageHeroInline]


@admin.register(WideImageSection)
class WideImageSectionAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("page", "title", "sort_order", "is_published")
    list_filter = ("page", )


@admin.register(VideoSection)
class VideoSectionAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("page", "title", "video_url", "sort_order", "is_published")
    list_filter = ("page", )


class TightImageCardInline(SortableStackedInline):
    model = TightImageCard
    extra = 0


@admin.register(TightImageSection)
class TightImageSectionAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("page", "title", "sort_order", "is_published")
    list_filter = ("page", )
    inlines = [TightImageCardInline]


class ReelItemInline(SortableStackedInline):
    model = ReelItem
    extra = 0


@admin.register(ReelsSection)
class ReelsSectionAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("page", "title", "sort_order", "is_published")
    list_filter = ("page", )
    inlines = [ReelItemInline]