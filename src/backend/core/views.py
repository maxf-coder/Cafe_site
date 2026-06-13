from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import Page, SiteSettings
from .serializers import PageDetailSerializer, SiteSettingsSerializer

class PageDetailView(RetrieveAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageDetailSerializer
    lookup_field = "slug"

class SiteSettingsView(ListAPIView):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    