import logging
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import Page, SiteSetting, SiteImage
from .serializers import PageDetailSerializer, SiteSettingSerializer, SiteImageSerializer
from django.http import JsonResponse
from django.db import connection

logger = logging.getLogger(__name__)


class PageDetailView(RetrieveAPIView):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageDetailSerializer
    lookup_field = "slug"


class SiteSettingView(ListAPIView):
    queryset = SiteSetting.objects.all()
    serializer_class = SiteSettingSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["many"] = False
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info("Site settings fetched: %d keys", len(response.data))
        return response


class SiteImageView(ListAPIView):
    include_lang_parameter = False
    queryset = SiteImage.objects.all()
    serializer_class = SiteImageSerializer

    def get_serializer(self, *args, **kwargs):
        kwargs["many"] = False
        return super().get_serializer(*args, **kwargs)

    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        logger.info("Site images fetched: %d keys", len(response.data))
        return response

def health_check(request):
    try:
        connection.ensure_connection()
        return JsonResponse({"status": "ok"})
    except Exception as e:
        return JsonResponse({"status": "error", "detail": str(e)}, status=500)