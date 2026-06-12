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
    prepopulated_fields = {"slug": ("name",)}
    inlines = [MenuProductInline]
