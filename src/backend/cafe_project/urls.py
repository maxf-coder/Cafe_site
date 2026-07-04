from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("tinymce/", include("tinymce.urls")),
    path("api/v1/", include("menu.urls")),
    path("api/v1/", include("core.urls")),
]

if settings.DEBUG:
    from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
    urlpatterns += [
        path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
        path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    ]