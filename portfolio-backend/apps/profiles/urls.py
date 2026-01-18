"""
URL configuration for profiles app
"""
from django.urls import path

from .views import (
    MyProfileView,
    PublicProfileView,
    upload_profile_photo,
    delete_profile_photo,
    check_profile_completeness
)

app_name = 'profiles'

urlpatterns = [
    # Authenticated user's profile
    path('me/', MyProfileView.as_view(), name='my_profile'),
    path('upload-photo/', upload_profile_photo, name='upload_photo'),
    path('delete-photo/', delete_profile_photo, name='delete_photo'),
    path('check-completeness/', check_profile_completeness, name='check_completeness'),
    
    # Public profile
    path('public/<uuid:user_id>/', PublicProfileView.as_view(), name='public_profile'),
]