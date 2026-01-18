"""
URL configuration for recruiter access app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import RecruiterLinkViewSet

app_name = 'recruiter_access'

router = DefaultRouter()
router.register(r'', RecruiterLinkViewSet, basename='recruiter_link')

urlpatterns = [
    path('', include(router.urls)),
]