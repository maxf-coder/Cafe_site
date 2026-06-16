from django.contrib import admin
from adminsortable2.admin import SortableAdminBase, SortableStackedInline
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

@admin.register(WideImageSection)
class WideImageSectionAdmin(admin.ModelAdmin):
    list_display = ("page", "title", "is_published")
    list_filter = ("page", )
    exclude = ("sort_order", )

@admin.register(VideoSection)
class VideoSectionAdmin(admin.ModelAdmin):
    list_display = ("page", "title", "video_url", "is_published")
    list_filter = ("page", )
    exclude = ("sort_order", )

class TightImageCardInline(SortableStackedInline):
    model = TightImageCard
    extra = 0

@admin.register(TightImageSection)
class TightImageSectionAdmin(SortableAdminBase, admin.ModelAdmin):
    list_display = ("page", "title", "is_published")
    list_filter = ("page", )
    exclude = ("sort_order", )
    inlines = [TightImageCardInline]


class ReelItemInline(SortableStackedInline):
    model = ReelItem
    extra = 0

@admin.register(ReelsSection)
class ReelsSectionAdmin(SortableAdminBase, admin.ModelAdmin):
    list_display = ("page", "title", "is_published")
    list_filter = ("page", )
    exclude = ("sort_order", )
    inlines = [ReelItemInline]

class WideImageSectionInline(admin.TabularInline):
    model = WideImageSection
    extra = 0
    fields = ("sort_order", "title", "is_published")
    ordering = ("sort_order", )

class VideoSectionInline(admin.TabularInline):
    model = VideoSection
    extra = 0
    fields = ("sort_order", "title", "is_published")
    ordering = ("sort_order", )

class TightImageSectionInline(admin.TabularInline):
    model = TightImageSection
    extra = 0
    fields = ("sort_order", "title", "is_published")
    ordering = ("sort_order",)

class ReelsSectionInline(admin.TabularInline):
    model = ReelsSection
    extra = 0
    fields = ("sort_order", "title", "is_published")
    ordering = ("sort_order",)

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_published")
    inlines = [
        PageHeroInline,
        WideImageSectionInline,
        VideoSectionInline,
        TightImageSectionInline,
        ReelsSectionInline,
    ]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ("slug",)
        return ()

    def get_prepopulated_fields(self, request, obj=None):
        if obj:
            return {}
        return {"slug": ("name",)}

    def has_delete_permission(self, request, obj=None):
        return False

