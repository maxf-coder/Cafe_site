import uuid
from django.db import models


class SiteSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=50, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=200, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def __str__(self):
        return self.key
    

class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class PageHero(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.OneToOneField(Page, on_delete=models.CASCADE, related_name="hero")
    main_text = models.CharField(max_length=50)
    secondary_text = models.CharField(max_length=150, blank=True, default="")
    img_src = models.ImageField(upload_to="heroes/", null=True, blank=True)
    alt_text = models.CharField(max_length=200, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Hero for {self.page.name}"
    

class PageSection(models.Model):
    SECTION_TYPES = [
        ("wide_image", "Wide Image"),
        ("tight_image", "Tight Image"),
        ("video", "Video"),
        ("reels", "Reels Carousel"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="sections")
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    sort_order = models.PositiveIntegerField(default=0)
    content = models.JSONField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.section_type} - {self.page.name}"