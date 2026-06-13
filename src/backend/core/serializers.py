from rest_framework import serializers
from .models import (
    Page, PageHero,
    WideImageSection, VideoSection,
    TightImageSection, TightImageCard,
    ReelsSection, ReelItem,
    SiteSettings,
)


class PageHeroSerializer(serializers.ModelSerializer):
    img_src = serializers.SerializerMethodField()

    class Meta:
        model = PageHero
        fields = ["main_text", "secondary_text", "img_src", "alt_text"]

    def get_img_src(self, obj):
        if obj.img_src:
            return self.context["request"].build_absolute_uri(obj.img_src.url)
        return None


class WideImageSectionSerializer(serializers.ModelSerializer):
    img_src = serializers.SerializerMethodField()

    class Meta:
        model = WideImageSection
        fields = [
            "id", "title", "short_description",
            "full_description", "img_src", "alt_text",
        ]

    def get_img_src(self, obj):
        if obj.img_src:
            return self.context["request"].build_absolute_uri(obj.img_src.url)
        return None


class VideoSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoSection
        fields = ["id", "title", "video_url", "description"]


class TightImageCardSerializer(serializers.ModelSerializer):
    img_src = serializers.SerializerMethodField()

    class Meta:
        model = TightImageCard
        fields = [
            "title", "short_description",
            "full_description", "img_src", "alt_text",
        ]

    def get_img_src(self, obj):
        if obj.img_src:
            return self.context["request"].build_absolute_uri(obj.img_src.url)
        return None


class TightImageSectionSerializer(serializers.ModelSerializer):
    cards = TightImageCardSerializer(many=True, read_only=True)

    class Meta:
        model = TightImageSection
        fields = ["id", "title", "cards"]


class ReelItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReelItem
        fields = ["video_url"]


class ReelsSectionSerializer(serializers.ModelSerializer):
    reels = ReelItemSerializer(many=True, read_only=True)

    class Meta:
        model = ReelsSection
        fields = ["id", "title", "reels"]


class PageSectionSerializer(serializers.Serializer):
    def to_representation(self, instance):
        if isinstance(instance, WideImageSection):
            return {
                "type": "wide_image",
                "id": str(instance.id),
                "content": WideImageSectionSerializer(
                    instance, context=self.context
                ).data,
            }
        elif isinstance(instance, VideoSection):
            return {
                "type": "video",
                "id": str(instance.id),
                "content": VideoSectionSerializer(
                    instance, context=self.context
                ).data,
            }
        elif isinstance(instance, TightImageSection):
            return {
                "type": "tight_image",
                "id": str(instance.id),
                "content": TightImageSectionSerializer(
                    instance, context=self.context
                ).data,
            }
        elif isinstance(instance, ReelsSection):
            return {
                "type": "reels",
                "id": str(instance.id),
                "content": ReelsSectionSerializer(
                    instance, context=self.context
                ).data,
            }


class PageDetailSerializer(serializers.ModelSerializer):
    hero = PageHeroSerializer(read_only=True)
    sections = PageSectionSerializer(
        many=True, source="published_sections"
    )

    class Meta:
        model = Page
        fields = ["name", "slug", "hero", "sections"]


class SiteSettingsSerializer(serializers.Serializer):
    def to_representation(self, queryset):
        return {item.key: item.value for item in queryset}