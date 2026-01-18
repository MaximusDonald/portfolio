"""
Profiles app configuration
"""
from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.profiles'
    verbose_name = 'Profils Portfolio'
    
    def ready(self):
        """Import signals when the app is ready."""
        import apps.profiles.signals