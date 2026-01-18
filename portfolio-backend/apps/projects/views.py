"""
Views for projects
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from apps.core.permissions import IsOwner
from apps.core.enums import Visibility
from .models import Project
from .serializers import (
    ProjectSerializer,
    ProjectCreateUpdateSerializer,
    ProjectPublicSerializer,
    ProjectListSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing projects.
    
    Endpoints:
    - GET /api/projects/ - List all my projects
    - POST /api/projects/ - Create a new project
    - GET /api/projects/{id}/ - Get project details
    - PATCH/PUT /api/projects/{id}/ - Update project
    - DELETE /api/projects/{id}/ - Delete project
    - GET /api/projects/public/ - List public projects
    - GET /api/projects/featured/ - List featured projects
    """
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Return projects for the authenticated user."""
        return Project.objects.filter(user=self.request.user).order_by('display_order', '-start_date')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProjectCreateUpdateSerializer
        return ProjectSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a project."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """
        Get all public projects for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        projects = Project.objects.filter(
            user_id=user_id,
            visibility=Visibility.PUBLIC
        ).order_by('display_order', '-start_date')
        
        serializer = ProjectPublicSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def featured(self, request):
        """
        Get all featured public projects for a specific user.
        
        Query params:
        - user_id: UUID of the user
        """
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        projects = Project.objects.filter(
            user_id=user_id,
            visibility=Visibility.PUBLIC,
            is_featured=True
        ).order_by('display_order', '-start_date')
        
        serializer = ProjectPublicSerializer(projects, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """
        Reorder projects.
        
        Body: { "projects": [{"id": "uuid", "display_order": 0}, ...] }
        """
        projects_data = request.data.get('projects', [])
        
        if not projects_data:
            return Response(
                {'error': 'Liste de projets requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in projects_data:
            project_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                project = Project.objects.get(id=project_id, user=request.user)
                project.display_order = display_order
                project.save(update_fields=['display_order'])
            except Project.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """
        Toggle featured status of a project.
        
        POST /api/projects/{id}/toggle_featured/
        """
        project = self.get_object()
        project.is_featured = not project.is_featured
        project.save(update_fields=['is_featured'])
        
        return Response({
            'message': 'Statut mis en avant modifié',
            'is_featured': project.is_featured
        }, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['delete'])
    def delete_cover(self, request, pk=None):
        """
        Delete cover image of a project.
        
        DELETE /api/projects/{id}/delete_cover/
        """
        project = self.get_object()
        
        if not project.cover_image:
            return Response(
                {'error': 'Aucune image de couverture à supprimer'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project.cover_image.delete(save=True)
        
        return Response({
            'message': 'Image de couverture supprimée'
        }, status=status.HTTP_200_OK)