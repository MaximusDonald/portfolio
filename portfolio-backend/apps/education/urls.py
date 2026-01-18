"""
URL configuration for education app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DiplomaViewSet, CertificationViewSet

app_name = 'education'

router = DefaultRouter()
router.register(r'diplomas', DiplomaViewSet, basename='diploma')
router.register(r'certifications', CertificationViewSet, basename='certification')

urlpatterns = [
    path('', include(router.urls)),
]