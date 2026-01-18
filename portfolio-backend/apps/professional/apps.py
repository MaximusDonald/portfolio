"""
Professional app configuration
"""
from django.apps import AppConfig


class ProfessionalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.professional'
    verbose_name = 'Expériences & Formations'