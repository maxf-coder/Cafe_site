from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path("tinymce/", include("tinymce.urls")),
    path("api/", include("menu.urls")),
    path("api/", include("core.urls")),
]

if settings.DEBUG:
    from drf_specular.views import SpecularAPIView, SpecularSwaggerView
    urlpatterns += [
        path("api/schema/", SpecularAPIView.as_view(), name="schema"),
        path("api/docs", SpecularSwaggerView.as_view(url_name="schema")),
    ]