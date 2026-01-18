"""
URL configuration for skills app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SkillViewSet

app_name = 'skills'

router = DefaultRouter()
router.register(r'', SkillViewSet, basename='skill')

urlpatterns = [
    path('', include(router.urls)),
]