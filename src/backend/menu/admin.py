from django.contrib import admin
from .models import MenuCategory, MenuProduct

@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(MenuProduct)
class MenuProductAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "price", "sort_order", "is_active")
    list_editable = ("sort_order", "is_active")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("category", "is_active")