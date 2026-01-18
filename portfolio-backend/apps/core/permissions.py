"""
Custom permissions for Django REST Framework
"""
from rest_framework import permissions

from .enums import Visibility


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow owners of an object to edit it.
    Read permissions are allowed to any request.
    """
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the owner
        return hasattr(obj, 'user') and obj.user == request.user


class IsOwner(permissions.BasePermission):
    """
    Permission to only allow owners of an object to access it.
    """
    
    def has_object_permission(self, request, view, obj):
        return hasattr(obj, 'user') and obj.user == request.user


class VisibilityPermission(permissions.BasePermission):
    """
    Permission based on visibility level.
    
    - Public: Anyone can read
    - Recruteur: Only authenticated users with recruiter token
    - Prive: Only the owner
    """
    
    def has_object_permission(self, request, view, obj):
        # Check if object has visibility field
        if not hasattr(obj, 'visibility'):
            return True
        
        # Public content is visible to everyone
        if obj.visibility == Visibility.PUBLIC:
            return True
        
        # Private content is only visible to the owner
        if obj.visibility == Visibility.PRIVE:
            if not request.user.is_authenticated:
                return False
            return hasattr(obj, 'user') and obj.user == request.user
        
        # Recruiter content requires valid recruiter token or owner
        if obj.visibility == Visibility.RECRUTEUR:
            # Owner can always access
            if request.user.is_authenticated and hasattr(obj, 'user'):
                if obj.user == request.user:
                    return True
            
            # Check for valid recruiter token
            recruiter_token = request.query_params.get('access') or request.META.get('HTTP_X_RECRUITER_TOKEN')
            if recruiter_token:
                # Token validation will be done in recruiter_access app
                from apps.recruiter_access.utils import validate_recruiter_token
                return validate_recruiter_token(recruiter_token)
            
            return False
        
        return False


class IsAuthenticatedOwner(permissions.BasePermission):
    """
    Permission to only allow authenticated users to access their own objects.
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        return hasattr(obj, 'user') and obj.user == request.user