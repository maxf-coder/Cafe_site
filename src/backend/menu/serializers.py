from rest_framework import serializers
from .models import MenuProduct, MenuCategory

class MenuProductSerializer(serializers.ModelSerializer):
    img_src = serializers.SerializerMethodField()

    class Meta:
        model = MenuProduct
        fields = [
            "id", "name", "slug", "price", "weight_g",
            "short_description", "full_description",
            "img_src", "alt_text",
        ]

    def get_img_src(self, obj):
        if obj.img_src:
            return self.context["request"].build_absolute_uri(obj.img_src.url)
        return None
    
class MenuCategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = MenuCategory
        fields = ["id", "name", "slug", "products"]

    def get_products(self, obj):
        qs = obj.products.filter(is_active=True)
        return MenuProductSerializer(qs, many=True, context=self.context).data