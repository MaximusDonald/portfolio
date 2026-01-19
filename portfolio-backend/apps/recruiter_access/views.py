"""
Views for recruiter access management
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from .models import RecruiterLink
from .serializers import (
    RecruiterLinkSerializer,
    RecruiterLinkCreateSerializer,
    RecruiterLinkListSerializer,
)


class RecruiterLinkViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing recruiter access links.
    
    Endpoints:
    - GET /api/recruiter-access/ - List all my links
    - POST /api/recruiter-access/ - Generate a new link
    - GET /api/recruiter-access/{id}/ - Get link details
    - PATCH/PUT /api/recruiter-access/{id}/ - Update link
    - DELETE /api/recruiter-access/{id}/ - Delete link
    - POST /api/recruiter-access/{id}/revoke/ - Revoke link
    - POST /api/recruiter-access/validate/ - Validate a token
    """
    permission_classes = [IsAuthenticated]
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                'id',
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description='RecruiterLink ID'
            )
        ]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                'id',
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description='RecruiterLink ID'
            )
        ]
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                'id',
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description='RecruiterLink ID'
            )
        ]
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)
    
    @extend_schema(
        parameters=[
            OpenApiParameter(
                'id',
                OpenApiTypes.UUID,
                OpenApiParameter.PATH,
                description='RecruiterLink ID'
            )
        ]
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def get_queryset(self):
        """Return links for the authenticated user."""
        return RecruiterLink.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return RecruiterLinkListSerializer
        elif self.action == 'create':
            return RecruiterLinkCreateSerializer
        return RecruiterLinkSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a link."""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """
        Revoke a recruiter link.
        
        POST /api/recruiter-access/{id}/revoke/
        """
        link = self.get_object()
        link.revoke()
        
        return Response({
            'message': 'Lien révoqué avec succès',
            'is_active': link.is_active
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Reactivate a recruiter link (if not expired).
        
        POST /api/recruiter-access/{id}/activate/
        """
        link = self.get_object()
        
        if link.is_expired():
            return Response(
                {'error': 'Ce lien a expiré et ne peut pas être réactivé'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        link.is_active = True
        link.save(update_fields=['is_active'])
        
        return Response({
            'message': 'Lien réactivé avec succès',
            'is_active': link.is_active
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes=[])
    def validate(self, request):
        """
        Validate a recruiter token (public endpoint).
        
        POST /api/recruiter-access/validate/
        Body: { "token": "..." }
        """
        token = request.data.get('token')
        
        if not token:
            return Response(
                {'error': 'Token requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from .utils import validate_recruiter_token
        
        is_valid = validate_recruiter_token(token)
        
        return Response({
            'valid': is_valid
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """
        Get only active and valid links.
        
        GET /api/recruiter-access/active/
        """
        links = self.get_queryset().filter(is_active=True)
        
        # Filter only non-expired links
        valid_links = [link for link in links if link.is_valid()]
        
        serializer = RecruiterLinkListSerializer(valid_links, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """
        Get statistics about recruiter links.
        
        GET /api/recruiter-access/statistics/
        """
        links = self.get_queryset()
        
        total = links.count()
        active = links.filter(is_active=True).count()
        expired = sum(1 for link in links if link.is_expired())
        total_accesses = sum(link.access_count for link in links)
        
        return Response({
            'total_links': total,
            'active_links': active,
            'expired_links': expired,
            'total_accesses': total_accesses,
        }, status=status.HTTP_200_OK)