"""
URL configuration for professional app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ExperienceViewSet, TrainingViewSet

app_name = 'professional'

router = DefaultRouter()
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'trainings', TrainingViewSet, basename='training')

urlpatterns = [
    path('', include(router.urls)),
]