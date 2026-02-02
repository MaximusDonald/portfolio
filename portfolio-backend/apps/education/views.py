"""
Views for diplomas and certifications
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema, extend_schema_view
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from apps.core.permissions import IsOwner, VisibilityPermission
from apps.core.enums import Visibility
from apps.core.utils import get_allowed_visibilities
from .models import Diploma, Certification
from .serializers import (
    DiplomaSerializer,
    DiplomaCreateUpdateSerializer,
    DiplomaPublicSerializer,
    CertificationSerializer,
    CertificationCreateUpdateSerializer,
    CertificationPublicSerializer,
)


# ========== DIPLOMA VIEWSET ==========
@extend_schema_view(
    list=extend_schema(description="Liste de tous mes diplômes"),
    retrieve=extend_schema(
        description="Récupérer un diplôme par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Diploma ID')
        ]
    ),
    create=extend_schema(description="Créer un nouveau diplôme"),
    update=extend_schema(
        description="Mettre à jour un diplôme",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Diploma ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'un diplôme",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Diploma ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer un diplôme",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Diploma ID')
        ]
    )
)
class DiplomaViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing diplomas.
    
    Endpoints:
    - GET /api/education/diplomas/ - List all my diplomas
    - POST /api/education/diplomas/ - Create a new diploma
    - GET /api/education/diplomas/{id}/ - Get diploma details
    - PATCH/PUT /api/education/diplomas/{id}/ - Update diploma
    - DELETE /api/education/diplomas/{id}/ - Delete diploma
    - GET /api/education/diplomas/public/ - List public diplomas
    """
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        """Return diplomas for the authenticated user."""
        return Diploma.objects.filter(user=self.request.user).order_by('display_order', '-end_date')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return DiplomaCreateUpdateSerializer
        return DiplomaSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a diploma."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """
        Get all public diplomas for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        diplomas = Diploma.objects.filter(
            user_id=user_id,
            visibility__in=get_allowed_visibilities(request),
            is_published=True,
        ).order_by('display_order', '-end_date')
        
        serializer = DiplomaPublicSerializer(diplomas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder diplomas.
        
        Body: { "diplomas": [{"id": "uuid", "display_order": 0}, ...] }
        """
        diplomas_data = request.data.get('diplomas', [])
        
        if not diplomas_data:
            return Response(
                {'error': 'Liste de diplômes requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in diplomas_data:
            diploma_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                diploma = Diploma.objects.get(id=diploma_id, user=request.user)
                diploma.display_order = display_order
                diploma.save(update_fields=['display_order'])
            except Diploma.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Diploma ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def toggle_publish(self, request, pk=None):
        """Toggle published status of a diploma."""
        diploma = self.get_object()
        diploma.is_published = not diploma.is_published
        diploma.save(update_fields=['is_published'])

        return Response({
            'message': 'Statut de publication modifié',
            'is_published': diploma.is_published
        }, status=status.HTTP_200_OK)


# ========== CERTIFICATION VIEWSET ==========
@extend_schema_view(
    list=extend_schema(description="Liste de toutes mes certifications"),
    retrieve=extend_schema(
        description="Récupérer une certification par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Certification ID')
        ]
    ),
    create=extend_schema(description="Créer une nouvelle certification"),
    update=extend_schema(
        description="Mettre à jour une certification",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Certification ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'une certification",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Certification ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer une certification",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Certification ID')
        ]
    )
)
class CertificationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing certifications.
    
    Endpoints:
    - GET /api/education/certifications/ - List all my certifications
    - POST /api/education/certifications/ - Create a new certification
    - GET /api/education/certifications/{id}/ - Get certification details
    - PATCH/PUT /api/education/certifications/{id}/ - Update certification
    - DELETE /api/education/certifications/{id}/ - Delete certification
    - GET /api/education/certifications/public/ - List public certifications
    - POST /api/education/certifications/{id}/toggle_publish/ - Toggle publish status of a certification
    """
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        """Return certifications for the authenticated user."""
        return Certification.objects.filter(user=self.request.user).order_by('display_order', '-issue_date')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return CertificationCreateUpdateSerializer
        return CertificationSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a certification."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """
        Get all public certifications for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        certifications = Certification.objects.filter(
            user_id=user_id,
            visibility__in=get_allowed_visibilities(request),
            is_published=True,
        ).order_by('display_order', '-issue_date')
        
        serializer = CertificationPublicSerializer(certifications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder certifications.
        
        Body: { "certifications": [{"id": "uuid", "display_order": 0}, ...] }
        """
        certifications_data = request.data.get('certifications', [])
        
        if not certifications_data:
            return Response(
                {'error': 'Liste de certifications requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in certifications_data:
            cert_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                cert = Certification.objects.get(id=cert_id, user=request.user)
                cert.display_order = display_order
                cert.save(update_fields=['display_order'])
            except Certification.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Certification ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def toggle_publish(self, request, pk=None):
        """Toggle published status of a certification."""
        cert = self.get_object()
        cert.is_published = not cert.is_published
        cert.save(update_fields=['is_published'])

        return Response({
            'message': 'Statut de publication modifié',
            'is_published': cert.is_published
        }, status=status.HTTP_200_OK)