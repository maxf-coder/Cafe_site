import threading

from django.apps import AppConfig
from storages.backends.s3 import S3Storage

_lock = threading.Lock()
_shared_connection = None


class CoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        from django.core.files.storage import default_storage

        if not isinstance(default_storage, S3Storage):
            return

        global _shared_connection

        session = default_storage._create_session()
        _shared_connection = session.resource(
            "s3",
            region_name=default_storage.region_name,
            use_ssl=default_storage.use_ssl,
            endpoint_url=default_storage.endpoint_url,
            config=default_storage.client_config,
            verify=default_storage.verify,
        )

        default_storage._connections.connection = _shared_connection

        def _shared_connection_getter(self):
            global _shared_connection
            if _shared_connection is None:
                with _lock:
                    if _shared_connection is None:
                        session = self._create_session()
                        _shared_connection = session.resource(
                            "s3",
                            region_name=self.region_name,
                            use_ssl=self.use_ssl,
                            endpoint_url=self.endpoint_url,
                            config=self.client_config,
                            verify=self.verify,
                        )
            return _shared_connection

        S3Storage.connection = property(_shared_connection_getter)
