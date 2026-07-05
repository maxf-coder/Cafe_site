import logging
from django.db.models import Prefetch
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import MenuCategory, MenuProduct
from .serializers import MenuCategorySerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


logger = logging.getLogger(__name__)

@method_decorator(cache_page(300), name='dispatch')
class MenuCategoryViewSet(ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.filter(is_active=True).prefetch_related(
        Prefetch("products", queryset=MenuProduct.objects.filter(is_active=True))
    )
    serializer_class = MenuCategorySerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info("Menu categories fetched: %d items", len(response.data))
        return response
