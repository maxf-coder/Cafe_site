import uuid
from django.db import models

class MenuCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    sort_order = models.PositiveBigIntegerField(default=0)
    is_active = models.BooleanField(dafault=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order"]
        verbose_name_plural = "Menu categories"

    def __str__(self):
        return self.name