"""
Settings selector based on environment
"""
import os
from decouple import config

# Déterminer l'environnement
ENVIRONMENT = config('DJANGO_ENVIRONMENT', default='development')

if ENVIRONMENT == 'production':
    from .production import *
else:
    from .development import *