from django.urls import path
from .views import PageDetailView, SiteSettingView, SiteImageView

urlpatterns = [
    path("pages/<slug:slug>/", PageDetailView.as_view(), name="page-detail"),
    path("settings/", SiteSettingView.as_view(), name="settings"),
    path("site-images/", SiteImageView.as_view(), name="site-images/")
]
