"""
Views for experiences and training
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.core.permissions import IsOwner
from apps.core.enums import Visibility
from .models import Experience, Training
from .serializers import (
    ExperienceSerializer,
    ExperienceCreateUpdateSerializer,
    ExperiencePublicSerializer,
    TrainingSerializer,
    TrainingCreateUpdateSerializer,
    TrainingPublicSerializer,
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
            visibility=Visibility.PUBLIC
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
            visibility=Visibility.PUBLIC
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