from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuCategoryViewSet

router = DefaultRouter()
router.register("categories", MenuCategoryViewSet, basename="menu-categories")

urlpatterns = [
    path("menu/", include(router.urls)),
]
