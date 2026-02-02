"""
Serializers for projects
"""
from rest_framework import serializers

from apps.core.serializers import BaseSerializer
from apps.core.enums import Visibility, ProjectStatus
from .models import Project


class ProjectSerializer(BaseSerializer):
    """
    Complete project serializer for authenticated owner.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    features_list = serializers.ListField(source='get_features_list', read_only=True)
    achievements_list = serializers.ListField(source='get_achievements_list', read_only=True)
    has_links = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'short_description',
            'description',
            'project_type',
            'status',
            'role',
            'team_size',
            'organization',
            'start_date',
            'end_date',
            'duration_display',
            'technologies',
            'technologies_list',
            'key_features',
            'features_list',
            'challenges',
            'solutions',
            'achievements',
            'achievements_list',
            'learning_outcomes',
            'github_url',
            'demo_url',
            'video_url',
            'documentation_url',
            'has_links',
            'cover_image',
            'is_featured',
            'is_published',
            'visibility',
            'display_order',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'duration_display',
            'technologies_list',
            'features_list',
            'achievements_list',
            'has_links'
        ]
    
    def validate(self, attrs):
        """Validate project dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        status = attrs.get('status')
        
        # Validate date format
        if start_date and len(start_date) != 7:
            raise serializers.ValidationError({
                'start_date': 'Format requis: YYYY-MM'
            })
        
        if end_date and len(end_date) != 7:
            raise serializers.ValidationError({
                'end_date': 'Format requis: YYYY-MM'
            })
        
        # Check that end_date is after start_date
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être postérieure à la date de début'
            })
        
        # If status is "En_cours", end_date should be empty
        if status == ProjectStatus.EN_COURS and end_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être vide pour un projet en cours'
            })
        
        return attrs
    
    def validate_cover_image(self, value):
        """Validate cover image."""
        if value:
            # Max 5MB
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    'La taille de l\'image ne doit pas dépasser 5 MB.'
                )
            
            # Check file extension
            valid_extensions = ['jpg', 'jpeg', 'png', 'webp']
            ext = value.name.split('.')[-1].lower()
            if ext not in valid_extensions:
                raise serializers.ValidationError(
                    f'Format non autorisé. Formats acceptés: {", ".join(valid_extensions)}'
                )
        
        return value


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating projects.
    """
    
    class Meta:
        model = Project
        fields = [
            'title',
            'short_description',
            'description',
            'project_type',
            'status',
            'role',
            'team_size',
            'organization',
            'start_date',
            'end_date',
            'technologies',
            'key_features',
            'challenges',
            'solutions',
            'achievements',
            'learning_outcomes',
            'github_url',
            'demo_url',
            'video_url',
            'documentation_url',
            'cover_image',
            'is_featured',
            'is_published',
            'visibility',
            'display_order',
        ]
    
    def validate_title(self, value):
        """Validate title."""
        if len(value) < 5:
            raise serializers.ValidationError('Le titre doit contenir au moins 5 caractères.')
        return value
    
    def validate_short_description(self, value):
        """Validate short description."""
        if len(value) < 20:
            raise serializers.ValidationError('La description courte doit contenir au moins 20 caractères.')
        if len(value) > 300:
            raise serializers.ValidationError('La description courte ne doit pas dépasser 300 caractères.')
        return value
    
    def validate_description(self, value):
        """Validate description."""
        if len(value) < 50:
            raise serializers.ValidationError('La description détaillée doit contenir au moins 50 caractères.')
        return value

    def validate(self, attrs):
        """Validate project dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        status = attrs.get('status')

        # Validate date format
        if start_date and len(start_date) != 7:
            raise serializers.ValidationError({'start_date': 'Format requis: YYYY-MM'})

        if end_date and len(end_date) != 7:
            raise serializers.ValidationError({'end_date': 'Format requis: YYYY-MM'})

        # Check that end_date is after start_date
        if end_date and start_date and end_date < start_date:
            raise serializers.ValidationError({'end_date': 'La date de fin doit être postérieure à la date de début'})

        # If status is "En_cours", end_date should be empty
        if status == ProjectStatus.EN_COURS and end_date:
            raise serializers.ValidationError({'end_date': 'La date de fin doit être vide pour un projet en cours'})

        return attrs

    def to_internal_value(self, data):
        """Convert empty strings to None for optional specific fields."""
        new_data = data.copy()
        
        # Handle optional integer fields
        if 'team_size' in new_data and new_data['team_size'] == '':
            new_data['team_size'] = None
        
        # Handle display_order if empty
        if 'display_order' in new_data and new_data['display_order'] == '':
            new_data['display_order'] = 0
            
        return super().to_internal_value(new_data)


class ProjectPublicSerializer(serializers.ModelSerializer):
    """
    Public project serializer.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    features_list = serializers.ListField(source='get_features_list', read_only=True)
    achievements_list = serializers.ListField(source='get_achievements_list', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'short_description',
            'description',
            'project_type',
            'status',
            'role',
            'team_size',
            'organization',
            'start_date',
            'end_date',
            'duration_display',
            'technologies_list',
            'features_list',
            'challenges',
            'solutions',
            'achievements_list',
            'learning_outcomes',
            'github_url',
            'demo_url',
            'video_url',
            'documentation_url',
            'cover_image',
            'is_featured',
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for project lists.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    
    class Meta:
        model = Project
        fields = [
            'id',
            'title',
            'short_description',
            'project_type',
            'status',
            'start_date',
            'duration_display',
            'technologies_list',
            'github_url',
            'demo_url',
            'cover_image',
            'is_featured',
            'is_published',
            'visibility',
        ]