"""
Views for experiences and training
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from drf_spectacular.utils import extend_schema, extend_schema_view
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from apps.core.permissions import IsOwner
from apps.core.enums import Visibility
from apps.core.utils import get_allowed_visibilities
from .models import Experience, Training
from .serializers import (
    ExperienceSerializer,
    ExperienceCreateUpdateSerializer,
    ExperiencePublicSerializer,
    TrainingSerializer,
    TrainingCreateUpdateSerializer,
    TrainingPublicSerializer,
)


# ========== EXPERIENCE VIEWSET ==========
@extend_schema_view(
    list=extend_schema(description="Liste de toutes mes expériences professionnelles"),
    retrieve=extend_schema(
        description="Récupérer une expérience par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Experience ID')
        ]
    ),
    create=extend_schema(description="Créer une nouvelle expérience"),
    update=extend_schema(
        description="Mettre à jour une expérience",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Experience ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'une expérience",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Experience ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer une expérience",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Experience ID')
        ]
    )
)
class ExperienceViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing professional experiences.
    
    Endpoints:
    - GET /api/professional/experiences/ - List all my experiences
    - POST /api/professional/experiences/ - Create a new experience
    - GET /api/professional/experiences/{id}/ - Get experience details
    - PATCH/PUT /api/professional/experiences/{id}/ - Update experience
    - DELETE /api/professional/experiences/{id}/ - Delete experience
    - GET /api/professional/experiences/public/ - List public experiences
    """
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        """Return experiences for the authenticated user."""
        return Experience.objects.filter(user=self.request.user).order_by('display_order', '-start_date')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return ExperienceCreateUpdateSerializer
        return ExperienceSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating an experience."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """
        Get all public experiences for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        experiences = Experience.objects.filter(
            user_id=user_id,
            visibility__in=get_allowed_visibilities(request),
            is_published=True,
        ).order_by('display_order', '-start_date')
        
        serializer = ExperiencePublicSerializer(experiences, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder experiences.
        
        Body: { "experiences": [{"id": "uuid", "display_order": 0}, ...] }
        """
        experiences_data = request.data.get('experiences', [])
        
        if not experiences_data:
            return Response(
                {'error': 'Liste d\'expériences requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in experiences_data:
            exp_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                exp = Experience.objects.get(id=exp_id, user=request.user)
                exp.display_order = display_order
                exp.save(update_fields=['display_order'])
            except Experience.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Experience ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def toggle_publish(self, request, pk=None):
        """Toggle published status of an experience."""
        exp = self.get_object()
        exp.is_published = not exp.is_published
        exp.save(update_fields=['is_published'])

        return Response({
            'message': 'Statut de publication modifié',
            'is_published': exp.is_published
        }, status=status.HTTP_200_OK)


# ========== TRAINING VIEWSET ==========
@extend_schema_view(
    list=extend_schema(description="Liste de toutes mes formations complémentaires"),
    retrieve=extend_schema(
        description="Récupérer une formation par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Training ID')
        ]
    ),
    create=extend_schema(description="Créer une nouvelle formation"),
    update=extend_schema(
        description="Mettre à jour une formation",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Training ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'une formation",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Training ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer une formation",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Training ID')
        ]
    )
)
class TrainingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing training/formations.
    
    Endpoints:
    - GET /api/professional/trainings/ - List all my trainings
    - POST /api/professional/trainings/ - Create a new training
    - GET /api/professional/trainings/{id}/ - Get training details
    - PATCH/PUT /api/professional/trainings/{id}/ - Update training
    - DELETE /api/professional/trainings/{id}/ - Delete training
    - GET /api/professional/trainings/public/ - List public trainings
    - POST /api/professional/trainings/{id}/toggle_publish/ - Toggle publish status
    """
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        """Return trainings for the authenticated user."""
        return Training.objects.filter(user=self.request.user).order_by('display_order', '-start_date')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action in ['create', 'update', 'partial_update']:
            return TrainingCreateUpdateSerializer
        return TrainingSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a training."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """
        Get all public trainings for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        trainings = Training.objects.filter(
            user_id=user_id,
            visibility__in=get_allowed_visibilities(request),
            is_published=True,
        ).order_by('display_order', '-start_date')
        
        serializer = TrainingPublicSerializer(trainings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder trainings.
        
        Body: { "trainings": [{"id": "uuid", "display_order": 0}, ...] }
        """
        trainings_data = request.data.get('trainings', [])
        
        if not trainings_data:
            return Response(
                {'error': 'Liste de formations requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in trainings_data:
            training_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                training = Training.objects.get(id=training_id, user=request.user)
                training.display_order = display_order
                training.save(update_fields=['display_order'])
            except Training.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Training ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def toggle_publish(self, request, pk=None):
        """Toggle published status of a training."""
        training = self.get_object()
        training.is_published = not training.is_published
        training.save(update_fields=['is_published'])

        return Response({
            'message': 'Statut de publication modifié',
            'is_published': training.is_published
        }, status=status.HTTP_200_OK)