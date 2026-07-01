from django.contrib import admin
from .models import MenuCategory, MenuProduct
from adminsortable2.admin import SortableAdminMixin, SortableStackedInline

class MenuProductInline(SortableStackedInline):
    model = MenuProduct
    extra = 0
    fieldsets = [
        ("Data", {
            "classes": ("collapse",),
            "fields": (
                "name_ro", "name_en", "name_ru",
                "slug", "price", "weight_g", "is_active", "sort_order",
                "short_description_ro", "short_description_en", "short_description_ru",
                "full_description_ro", "full_description_en", "full_description_ru",
                "img_src", "alt_text_ro", "alt_text_en", "alt_text_ru",
            ),
        }),
    ]

@admin.register(MenuCategory)
class MenuCategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("name", "slug", "sort_order", "is_active")
    list_editable = ("is_active", )
    inlines = [MenuProductInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ("slug",)
        return ()

    def get_prepopulated_fields(self, request, obj=None):
        if obj:
            return {}
        return {"slug": ("name_ro",)}
