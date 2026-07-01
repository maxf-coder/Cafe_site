import json
import uuid
from django.core.management.base import BaseCommand
from core.models import Page, PageHero, WideImageSection, VideoSection, TightImageSection, TightImageCard, ReelsSection, ReelItem

JSON_PATH = "/mnt/c/Users/Maxim/Downloads/charity_page_content.json"
PLACEHOLDER = "placeholder.png"


class Command(BaseCommand):
    help = "Import Charity page content from JSON"

    def handle(self, *args, **options):
        with open(JSON_PATH, encoding="utf-8") as f:
            data = json.load(f)

        page_data = data["charity_page"]

        page, created = Page.objects.get_or_create(
            slug="caritate",
            defaults={"id": uuid.uuid4()},
        )
        page.name_ro = "Caritate"
        page.name_en = "Charity"
        page.name_ru = "Благотворительность"
        page.is_published = True
        page.save()

        PageHero.objects.filter(page=page).delete()
        WideImageSection.objects.filter(page=page).delete()
        VideoSection.objects.filter(page=page).delete()
        TightImageSection.objects.filter(page=page).delete()
        ReelsSection.objects.filter(page=page).delete()

        hero_data = page_data["hero_section"]
        PageHero.objects.create(
            id=uuid.uuid4(),
            page=page,
            main_text_ro=hero_data["main_text"]["ro"],
            main_text_en=hero_data["main_text"]["en"],
            main_text_ru=hero_data["main_text"]["ru"],
            secondary_text_ro=hero_data["secondary_text"]["ro"],
            secondary_text_en=hero_data["secondary_text"]["en"],
            secondary_text_ru=hero_data["secondary_text"]["ru"],
            alt_text_ro=hero_data["image_alt"]["ro"],
            alt_text_en=hero_data["image_alt"]["en"],
            alt_text_ru=hero_data["image_alt"]["ru"],
            img_src=PLACEHOLDER,
        )

        for idx, sec in enumerate(page_data.get("wide_image_sections", [])):
            WideImageSection.objects.create(
                id=uuid.uuid4(),
                page=page,
                sort_order=idx,
                is_published=True,
                title_ro=sec["title"]["ro"],
                title_en=sec["title"]["en"],
                title_ru=sec["title"]["ru"],
                short_description_ro=sec["short_description"]["ro"],
                short_description_en=sec["short_description"]["en"],
                short_description_ru=sec["short_description"]["ru"],
                full_description_ro=sec["full_description"]["ro"],
                full_description_en=sec["full_description"]["en"],
                full_description_ru=sec["full_description"]["ru"],
                alt_text_ro=sec["image_alt"]["ro"],
                alt_text_en=sec["image_alt"]["en"],
                alt_text_ru=sec["image_alt"]["ru"],
                img_src=PLACEHOLDER,
            )

        for idx, sec in enumerate(page_data.get("video_sections", [])):
            VideoSection.objects.create(
                id=uuid.uuid4(),
                page=page,
                sort_order=idx,
                is_published=True,
                title_ro=sec["title"]["ro"],
                title_en=sec["title"]["en"],
                title_ru=sec["title"]["ru"],
                video_url=sec["video_url"],
                description_ro=sec["description"]["ro"],
                description_en=sec["description"]["en"],
                description_ru=sec["description"]["ru"],
            )

        for idx, sec in enumerate(page_data.get("tight_image_sections", [])):
            tight_sec = TightImageSection.objects.create(
                id=uuid.uuid4(),
                page=page,
                sort_order=idx,
                is_published=True,
                title_ro=sec["title"]["ro"],
                title_en=sec["title"]["en"],
                title_ru=sec["title"]["ru"],
            )
            for card_idx, card in enumerate(sec.get("cards", [])):
                TightImageCard.objects.create(
                    id=uuid.uuid4(),
                    section=tight_sec,
                    sort_order=card_idx,
                    title_ro=card["title"]["ro"],
                    title_en=card["title"]["en"],
                    title_ru=card["title"]["ru"],
                    short_description_ro=card["short_description"]["ro"],
                    short_description_en=card["short_description"]["en"],
                    short_description_ru=card["short_description"]["ru"],
                    full_description_ro=card["full_description"]["ro"],
                    full_description_en=card["full_description"]["en"],
                    full_description_ru=card["full_description"]["ru"],
                    alt_text_ro=card["image_alt"]["ro"],
                    alt_text_en=card["image_alt"]["en"],
                    alt_text_ru=card["image_alt"]["ru"],
                    img_src=PLACEHOLDER,
                )

        for idx, sec in enumerate(page_data.get("reels_sections", [])):
            reels_sec = ReelsSection.objects.create(
                id=uuid.uuid4(),
                page=page,
                sort_order=idx,
                is_published=True,
                title_ro=sec["title"]["ro"],
                title_en=sec["title"]["en"],
                title_ru=sec["title"]["ru"],
            )
            for reel_idx, reel in enumerate(sec.get("reels", [])):
                ReelItem.objects.create(
                    id=uuid.uuid4(),
                    section=reels_sec,
                    sort_order=reel_idx,
                    video_url=reel["video_url"],
                )

        self.stdout.write(self.style.SUCCESS(f"Imported Charity page (slug: {page.slug})"))
