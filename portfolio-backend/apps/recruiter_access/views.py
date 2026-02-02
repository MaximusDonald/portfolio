"""
Views for recruiter access management
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema, extend_schema_view
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from .models import RecruiterLink
from .serializers import (
    RecruiterLinkSerializer,
    RecruiterLinkCreateSerializer,
    RecruiterLinkListSerializer,
)


@extend_schema_view(
    list=extend_schema(description="Liste de tous mes liens recruteur"),
    retrieve=extend_schema(
        description="Récupérer un lien recruteur par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    ),
    create=extend_schema(description="Générer un nouveau lien recruteur"),
    update=extend_schema(
        description="Mettre à jour un lien recruteur",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'un lien",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer un lien recruteur",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    )
)
class RecruiterLinkViewSet(viewsets.ModelViewSet):
    """ViewSet for managing recruiter access links."""
    permission_classes = [IsAuthenticated]
    
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
    
    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """Revoke a recruiter link."""
        link = self.get_object()
        link.revoke()
        
        return Response({
            'message': 'Lien révoqué avec succès',
            'is_active': link.is_active
        }, status=status.HTTP_200_OK)
    
    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='RecruiterLink ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Reactivate a recruiter link (if not expired)."""
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
        """Validate a recruiter token (public endpoint)."""
        token = request.data.get('token')
        
        if not token:
            return Response(
                {'error': 'Token requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            link = RecruiterLink.objects.get(token=token)
            
            if not link.is_active:
                return Response({
                    'valid': False,
                    'message': 'Ce lien a été désactivé.'
                }, status=status.HTTP_200_OK)
                
            if link.is_expired():
                return Response({
                    'valid': False,
                    'expired': True,
                    'message': 'Ce lien a expiré.'
                }, status=status.HTTP_200_OK)
            
            # Increment access counter
            link.increment_access()
            
            return Response({
                'valid': True,
                'user_id': str(link.user.id)
            }, status=status.HTTP_200_OK)
            
        except RecruiterLink.DoesNotExist:
            return Response({
                'valid': False,
                'message': 'Lien invalide.'
            }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active and valid links."""
        links = self.get_queryset().filter(is_active=True)
        valid_links = [link for link in links if link.is_valid()]
        
        serializer = RecruiterLinkListSerializer(valid_links, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get statistics about recruiter links."""
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