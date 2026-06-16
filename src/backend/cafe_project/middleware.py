from django.utils import translation

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        lang = request.GET.get("lang", "ro")
        if lang in ("ro", "en", "ru"):
            translation.activate(lang)
        return self.get_response(request)