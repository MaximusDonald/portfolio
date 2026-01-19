"""
Views for skills
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Count, Q
from drf_spectacular.utils import extend_schema, extend_schema_view
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from apps.core.permissions import IsOwner
from apps.core.enums import SkillCategory, SkillLevel
from .models import Skill
from .serializers import (
    SkillSerializer,
    SkillCreateUpdateSerializer,
    SkillPublicSerializer,
    SkillListSerializer,
    SkillGroupedSerializer,
)


@extend_schema_view(
    list=extend_schema(description="Liste de toutes mes compétences"),
    retrieve=extend_schema(
        description="Récupérer une compétence par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Skill ID')
        ]
    ),
    create=extend_schema(description="Créer une nouvelle compétence"),
    update=extend_schema(
        description="Mettre à jour une compétence",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Skill ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'une compétence",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Skill ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer une compétence",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Skill ID')
        ]
    )
)
class SkillViewSet(viewsets.ModelViewSet):
    """ViewSet for managing skills."""
    permission_classes = [IsAuthenticated, IsOwner]
    
    def get_queryset(self):
        """Return skills for the authenticated user."""
        return Skill.objects.filter(user=self.request.user).order_by('display_order', 'category', 'name')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return SkillListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return SkillCreateUpdateSerializer
        return SkillSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a skill."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public(self, request):
        """Get all public skills for a specific user."""
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        skills = Skill.objects.filter(user_id=user_id).order_by('display_order', 'category', 'name')
        
        serializer = SkillPublicSerializer(skills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def grouped(self, request):
        """Get skills grouped by category for a specific user."""
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        grouped_skills = []
        
        for category_code, category_name in SkillCategory.choices:
            skills = Skill.objects.filter(
                user_id=user_id,
                category=category_code
            ).order_by('display_order', 'name')
            
            if skills.exists():
                grouped_skills.append({
                    'category': category_code,
                    'category_display': category_name,
                    'skills': SkillPublicSerializer(skills, many=True).data,
                    'count': skills.count()
                })
        
        serializer = SkillGroupedSerializer(grouped_skills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def primary(self, request):
        """Get primary skills only for a specific user."""
        user_id = request.query_params.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'user_id est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        skills = Skill.objects.filter(
            user_id=user_id,
            is_primary=True
        ).order_by('display_order', 'name')
        
        serializer = SkillPublicSerializer(skills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder skills."""
        skills_data = request.data.get('skills', [])
        
        if not skills_data:
            return Response(
                {'error': 'Liste de compétences requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in skills_data:
            skill_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                skill = Skill.objects.get(id=skill_id, user=request.user)
                skill.display_order = display_order
                skill.save(update_fields=['display_order'])
            except Skill.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)
    
    @extend_schema(
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Skill ID')
        ]
    )
    @action(detail=True, methods=['post'])
    def toggle_primary(self, request, pk=None):
        """Toggle primary status of a skill."""
        skill = self.get_object()
        skill.is_primary = not skill.is_primary
        skill.save(update_fields=['is_primary'])
        
        return Response({
            'message': 'Statut compétence principale modifié',
            'is_primary': skill.is_primary
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get statistics about user's skills."""
        skills = self.get_queryset()
        
        by_category = {}
        for category_code, category_name in SkillCategory.choices:
            count = skills.filter(category=category_code).count()
            if count > 0:
                by_category[category_name] = count
        
        by_level = {}
        for level_code, level_name in SkillLevel.choices:
            count = skills.filter(level=level_code).count()
            if count > 0:
                by_level[level_name] = count
        
        return Response({
            'total': skills.count(),
            'primary': skills.filter(is_primary=True).count(),
            'by_category': by_category,
            'by_level': by_level,
            'with_justifications': skills.filter(
                Q(related_projects__isnull=False) |
                Q(related_certifications__isnull=False) |
                Q(related_trainings__isnull=False)
            ).distinct().count()
        }, status=status.HTTP_200_OK)