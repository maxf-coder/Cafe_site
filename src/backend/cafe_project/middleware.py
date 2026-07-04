import logging
from django.utils import translation

logger = logging.getLogger(__name__)


class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        lang = request.GET.get("lang", "ro")
        if lang in ("ro", "en", "ru"):
            translation.activate(lang)

        response = self.get_response(request)

        logger.debug(
            "%s %s → %s [lang=%s]",
            request.method, request.path, response.status_code, lang,
        )
        return response