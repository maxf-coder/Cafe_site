from django.test import TestCase
from rest_framework import status
from .models import (
    Page, PageHero,
    WideImageSection, VideoSection,
    TightImageSection, TightImageCard,
    ReelsSection, ReelItem,
)


class PageAPITest(TestCase):
    def setUp(self):
        self.page = Page.objects.create(
            name="Despre noi", slug="despre-noi",
        )
        self.hero = PageHero.objects.create(
            page=self.page,
            main_text="Povestea Noastră",
            secondary_text="Bine ați venit",
        )

    def test_page_detail_returns_200_for_published_page(self):
        response = self.client.get(f"/api/v1/pages/{self.page.slug}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("name", response.data)
        self.assertIn("slug", response.data)
        self.assertIn("hero", response.data)
        self.assertIn("sections", response.data)
        self.assertEqual(response.data["name"], "Despre noi")
        self.assertEqual(response.data["hero"]["main_text"], "Povestea Noastră")

    def test_page_detail_404_for_invalid_slug(self):
        response = self.client.get("/api/v1/pages/nonexistent/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unpublished_page_returns_404(self):
        unpublished = Page.objects.create(
            name="Ascuns", slug="ascuns", is_published=False,
        )
        response = self.client.get(f"/api/v1/pages/{unpublished.slug}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SectionTypeDispatchTest(TestCase):
    def setUp(self):
        self.page = Page.objects.create(name="Test", slug="test")
        PageHero.objects.create(page=self.page, main_text="Hero")
        self.wide = WideImageSection.objects.create(
            page=self.page, title="Wide",
            short_description="Short", full_description="<p>Full</p>",
            sort_order=1, is_published=True,
        )
        self.video = VideoSection.objects.create(
            page=self.page, title="Video",
            video_url="https://youtube.com/watch?v=test",
            sort_order=2, is_published=True,
        )
        self.tight = TightImageSection.objects.create(
            page=self.page, title="Tight", sort_order=3, is_published=True,
        )
        TightImageCard.objects.create(
            section=self.tight, title="Card",
            short_description="Card desc",
            sort_order=1,
        )
        self.reels = ReelsSection.objects.create(
            page=self.page, title="Reels", sort_order=4, is_published=True,
        )
        ReelItem.objects.create(
            section=self.reels, video_url="https://youtube.com/shorts/test",
            sort_order=1,
        )

    def test_section_types_are_dispatched_correctly(self):
        response = self.client.get(f"/api/v1/pages/{self.page.slug}/")
        sections = response.data["sections"]
        self.assertEqual(len(sections), 4)

        type_map = {s["type"]: s["content"] for s in sections}

        self.assertIn("wide_image", type_map)
        self.assertIn("img_src", type_map["wide_image"])
        self.assertIn("full_description", type_map["wide_image"])

        self.assertIn("video", type_map)
        self.assertIn("video_url", type_map["video"])

        self.assertIn("tight_image", type_map)
        self.assertIn("cards", type_map["tight_image"])
        self.assertEqual(len(type_map["tight_image"]["cards"]), 1)

        self.assertIn("reels", type_map)
        self.assertIn("reels", type_map["reels"])
        self.assertEqual(len(type_map["reels"]["reels"]), 1)

    def test_unpublished_sections_excluded(self):
        WideImageSection.objects.create(
            page=self.page, title="Unpublished",
            short_description="Nope", sort_order=5, is_published=False,
        )
        response = self.client.get(f"/api/v1/pages/{self.page.slug}/")
        self.assertEqual(len(response.data["sections"]), 4)
