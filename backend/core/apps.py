from django.apps import AppConfig


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'core'

    def ready(self):
        # Registrar signals (auto-recálculo de definitivas al cambiar notas)
        from . import signals  # noqa: F401
