import logging
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import MenuCategory
from .serializers import MenuCategorySerializer

logger = logging.getLogger(__name__)


class MenuCategoryViewSet(ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.filter(is_active=True)
    serializer_class = MenuCategorySerializer

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info("Menu categories fetched: %d items", len(response.data))
        return response
