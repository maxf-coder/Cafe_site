import uuid
from django.db import models
from django_summernote.fields import SummernoteTextField

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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name="sections")
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.__class__.__name__} - {self.page.name}"
    

class WideImageSection(PageSection):
    title = models.CharField(max_length=200)
    short_description = models.TextField(max_length=300)
    full_description = SummernoteTextField()
    image = models.ImageField(upload_to="sections/wide_image/", null=True, blank=True)
    alt_text = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return f"Wide Image - {self.title}"


class VideoSection(PageSection):
    title = models.CharField(max_length=200)
    video_url = models.URLField()
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Video - {self.title}" 
    

class TightImageSection(PageSection):
    title = models.CharField(max_length=200, blank=True, default='')

    def __str__(self):
        return f"Tight Image - {self.title}"
    

class TightImageCard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(TightImageSection, on_delete=models.CASCADE, related_name="cards")
    title = models.CharField(max_length=200)
    short_description = models.TextField(max_length=300)
    full_description = SummernoteTextField()
    image = models.ImageField(upload_to="sections/tight_image/", null=True, blank=True)
    alt_text = models.CharField(max_length=200, blank=True, default="")
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return self.title


class ReelsSection(PageSection):
    title = models.CharField(max_length=200, blank=True, default="")

    def __str__(self):
        return f"Reels - {self.title}"
    

class ReelItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(ReelsSection, on_delete=models.CASCADE, related_name="reels")
    video_url = models.URLField()
    sort_order = models.PositiveIntegerField(default=0)
    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f'Reel - {self.sort_order}'