"""
Views for diplomas and certifications
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.core.permissions import IsOwner, VisibilityPermission
from apps.core.enums import Visibility
from .models import Diploma, Certification
from .serializers import (
    DiplomaSerializer,
    DiplomaCreateUpdateSerializer,
    DiplomaPublicSerializer,
    CertificationSerializer,
    CertificationCreateUpdateSerializer,
    CertificationPublicSerializer,
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
            visibility=Visibility.PUBLIC
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
        
        # Update display_order for each diploma
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
            visibility=Visibility.PUBLIC
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
        
        # Update display_order for each certification
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