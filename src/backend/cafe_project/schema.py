from drf_spectacular.openapi import AutoSchema
from drf_spectacular.utils import OpenApiParameter


class CafeAutoSchema(AutoSchema):
    def get_override_parameters(self):
        params = super().get_override_parameters()
        params += [
            OpenApiParameter(
                name="lang",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Language code: ro, en, ru (default: ro)",
                enum=["ro", "en", "ru"],
                required=False,
            ),
        ]
        return params