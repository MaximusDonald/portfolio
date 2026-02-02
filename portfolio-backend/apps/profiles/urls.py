"""
URL configuration for profiles app
"""
from django.urls import path

from .views import (
    MyProfileView,
    PublicProfileBySlugView,
    PublicProfileView,
    DefaultProfileView,
    PortfolioExportView,
    PortfolioImportView,
    upload_profile_photo,
    delete_profile_photo,
    check_profile_completeness
)

app_name = 'profiles'

urlpatterns = [
    # Authenticated user's profile
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('export/', PortfolioExportView.as_view(), name='portfolio_export'),
    path('import/', PortfolioImportView.as_view(), name='portfolio_import'),
    path('upload-photo/', upload_profile_photo, name='upload_photo'),
    path('delete-photo/', delete_profile_photo, name='delete_photo'),
    path('check-completeness/', check_profile_completeness, name='check_completeness'),
    
    # Public profile
    path('public/default/', DefaultProfileView.as_view(), name='default_profile'),
    path('public/<uuid:user_id>/', PublicProfileView.as_view(), name='public_profile'),
    path('public/slug/<str:slug>/', PublicProfileBySlugView.as_view(), name='public-profile-slug'),
]