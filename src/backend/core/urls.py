from django.urls import path
from .views import PageDetailView, SiteSettingsView

urlpatterns = [
    path("page/<slug:slug>/", PageDetailView.as_view(), name="page-detail"),
    path("settings/", SiteSettingsView.as_view(), name="settings"),
]
