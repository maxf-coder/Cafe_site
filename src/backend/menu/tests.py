from django.test import TestCase
from rest_framework import status
from .models import MenuCategory, MenuProduct


class MenuCategoryAPITest(TestCase):
    def setUp(self):
        self.cat1 = MenuCategory.objects.create(
            name="Cafele clasice", slug="cafele-clasice", sort_order=1,
        )
        self.cat2 = MenuCategory.objects.create(
            name="Deserturi", slug="deserturi", sort_order=2,
        )
        self.inactive_cat = MenuCategory.objects.create(
            name="Ascuns", slug="ascuns", sort_order=3, is_active=False,
        )
        self.product1 = MenuProduct.objects.create(
            category=self.cat1, name="Espresso", slug="espresso",
            price="10.00", weight_g=30, sort_order=1,
        )
        self.product2 = MenuProduct.objects.create(
            category=self.cat1, name="Cappuccino", slug="cappuccino",
            price="15.00", weight_g=150, sort_order=2,
        )
        self.inactive_product = MenuProduct.objects.create(
            category=self.cat1, name="Ascuns", slug="ascuns-produs",
            price="5.00", sort_order=3, is_active=False,
        )

    def test_category_list_returns_active_categories(self):
        response = self.client.get("/api/v1/menu/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "Cafele clasice")
        self.assertEqual(response.data[1]["name"], "Deserturi")

    def test_category_includes_only_active_products(self):
        response = self.client.get("/api/v1/menu/categories/")
        cat_data = response.data[0]
        self.assertEqual(len(cat_data["products"]), 2)
        product_names = {p["name"] for p in cat_data["products"]}
        self.assertIn("Espresso", product_names)
        self.assertIn("Cappuccino", product_names)
        self.assertNotIn("Ascuns", product_names)

    def test_inactive_category_not_returned(self):
        response = self.client.get("/api/v1/menu/categories/")
        slugs = {c["slug"] for c in response.data}
        self.assertNotIn("ascuns", slugs)

    def test_product_serialized_fields(self):
        response = self.client.get("/api/v1/menu/categories/")
        product = response.data[0]["products"][0]
        expected_fields = {
            "id", "name", "slug", "price", "weight_g",
            "short_description", "full_description",
            "img_src", "alt_text",
        }
        self.assertEqual(set(product.keys()), expected_fields)

    def test_lang_query_parameter_switches_translations(self):
        cat = MenuCategory.objects.create(
            name="Băuturi", name_ro="Băuturi", name_en="Drinks",
            slug="bauturi",
        )
        MenuProduct.objects.create(
            category=cat,
            name="Cafea", name_ro="Cafea", name_en="Coffee",
            slug="cafea", price="10.00",
        )
        response_ro = self.client.get("/api/v1/menu/categories/?lang=ro")
        response_en = self.client.get("/api/v1/menu/categories/?lang=en")
        response_default = self.client.get("/api/v1/menu/categories/")

        def get_product(data, cat_slug):
            cat = next(c for c in data if c["slug"] == cat_slug)
            return cat["products"][0]["name"]

        self.assertEqual(get_product(response_ro.data, "bauturi"), "Cafea")
        self.assertEqual(get_product(response_en.data, "bauturi"), "Coffee")
        self.assertEqual(get_product(response_default.data, "bauturi"), "Cafea")
