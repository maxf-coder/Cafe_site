from django.contrib import admin
from .models import MenuCategory, MenuProduct
from adminsortable2.admin import SortableAdminMixin, SortableStackedInline

class MenuProductInline(SortableStackedInline):
    model = MenuProduct
    extra = 0
    prepopulated_fields = {"slug": ("name",)}

@admin.register(MenuCategory)
class MenuCategoryAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ("name", "slug", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    inlines = [MenuProductInline]

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ("slug",)
        return ()

    def get_prepopulated_fields(self, request, obj=None):
        if obj:
            return {}
        return {"slug": ("name",)}
