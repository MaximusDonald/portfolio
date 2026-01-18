"""
Views for Profile management
"""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import Profile
from .serializers import (
    ProfileSerializer,
    PublicProfileSerializer,
    ProfileUpdateSerializer
)


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update the authenticated user's profile.
    
    GET /api/profile/me/
    PATCH /api/profile/me/
    PUT /api/profile/me/
    """
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProfileSerializer
        return ProfileUpdateSerializer
    
    def get_object(self):
        """Get the profile of the authenticated user."""
        return self.request.user.profile


class PublicProfileView(generics.RetrieveAPIView):
    """
    View to retrieve a public profile by user ID.
    
    GET /api/profile/public/{user_id}/
    """
    permission_classes = [AllowAny]
    serializer_class = PublicProfileSerializer
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'
    
    def get_queryset(self):
        return Profile.objects.select_related('user').all()
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view counter."""
        instance = self.get_object()
        
        # Increment views (only for non-owner requests)
        if not request.user.is_authenticated or request.user != instance.user:
            instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    """
    Upload profile photo endpoint.
    
    POST /api/profile/upload-photo/
    """
    profile = request.user.profile
    
    if 'photo' not in request.FILES:
        return Response(
            {'error': 'Aucune photo fournie'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Delete old photo if exists
    if profile.photo:
        profile.photo.delete(save=False)
    
    # Save new photo
    profile.photo = request.FILES['photo']
    profile.save()
    
    return Response({
        'message': 'Photo de profil mise à jour',
        'photo_url': request.build_absolute_uri(profile.photo.url) if profile.photo else None
    }, status=status.HTTP_200_OK)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_photo(request):
    """
    Delete profile photo endpoint.
    
    DELETE /api/profile/delete-photo/
    """
    profile = request.user.profile
    
    if not profile.photo:
        return Response(
            {'error': 'Aucune photo à supprimer'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    profile.photo.delete(save=True)
    
    return Response({
        'message': 'Photo de profil supprimée'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_profile_completeness(request):
    """
    Check if the user's profile is complete.
    
    GET /api/profile/check-completeness/
    """
    profile = request.user.profile
    is_complete = profile.check_profile_completeness()
    
    return Response({
        'is_complete': is_complete,
        'profile_views': profile.profile_views
    }, status=status.HTTP_200_OK)