import logging
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import Page, SiteSettings
from .serializers import PageDetailSerializer, SiteSettingsSerializer

logger = logging.getLogger(__name__)


class PageDetailView(RetrieveAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageDetailSerializer
    lookup_field = "slug"


class SiteSettingsView(ListAPIView):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["many"] = False
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info("Site settings fetched: %d keys", len(response.data))
        return response
