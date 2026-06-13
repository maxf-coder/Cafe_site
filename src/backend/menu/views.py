from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import MenuCategory
from .serializers import MenuCategorySerializer

class MenuCategoryViewSet(ReadOnlyModelViewSet):
    queryset = MenuCategory.objects.filter(is_active=True)
    serializer_class = MenuCategorySerializer