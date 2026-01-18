"""
URL configuration for proofs app
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import ProofViewSet

app_name = 'proofs'

router = DefaultRouter()
router.register(r'', ProofViewSet, basename='proof')

urlpatterns = [
    path('', include(router.urls)),
]