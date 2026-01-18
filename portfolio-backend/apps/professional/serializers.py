"""
Serializers for professional models
"""
from rest_framework import serializers

from apps.core.serializers import BaseSerializer
from apps.core.enums import Visibility
from .models import Experience, Training


class ExperienceSerializer(BaseSerializer):
    """
    Complete experience serializer for authenticated owner.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    missions_list = serializers.ListField(source='get_missions_list', read_only=True)
    achievements_list = serializers.ListField(source='get_achievements_list', read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    
    class Meta:
        model = Experience
        fields = [
            'id',
            'position',
            'company',
            'company_url',
            'location',
            'experience_type',
            'start_date',
            'end_date',
            'is_current',
            'duration_display',
            'description',
            'missions',
            'missions_list',
            'achievements',
            'achievements_list',
            'technologies',
            'technologies_list',
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
            'missions_list',
            'achievements_list',
            'technologies_list'
        ]
    
    def validate(self, attrs):
        """Validate experience dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        is_current = attrs.get('is_current', False)
        
        # If is_current, end_date should be empty
        if is_current and end_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être vide pour un poste actuel'
            })
        
        # If not current, end_date should be provided
        if not is_current and not end_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin est requise pour un poste terminé'
            })
        
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
        
        return attrs


class ExperienceCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating experiences.
    """
    
    class Meta:
        model = Experience
        fields = [
            'position',
            'company',
            'company_url',
            'location',
            'experience_type',
            'start_date',
            'end_date',
            'is_current',
            'description',
            'missions',
            'achievements',
            'technologies',
            'visibility',
            'display_order',
        ]
    
    def validate_position(self, value):
        """Validate position."""
        if len(value) < 3:
            raise serializers.ValidationError('Le poste doit contenir au moins 3 caractères.')
        return value
    
    def validate_company(self, value):
        """Validate company."""
        if len(value) < 2:
            raise serializers.ValidationError('Le nom de l\'entreprise doit contenir au moins 2 caractères.')
        return value


class ExperiencePublicSerializer(serializers.ModelSerializer):
    """
    Public experience serializer.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    missions_list = serializers.ListField(source='get_missions_list', read_only=True)
    achievements_list = serializers.ListField(source='get_achievements_list', read_only=True)
    technologies_list = serializers.ListField(source='get_technologies_list', read_only=True)
    
    class Meta:
        model = Experience
        fields = [
            'id',
            'position',
            'company',
            'company_url',
            'location',
            'experience_type',
            'start_date',
            'end_date',
            'is_current',
            'duration_display',
            'description',
            'missions_list',
            'achievements_list',
            'technologies_list',
        ]


class TrainingSerializer(BaseSerializer):
    """
    Complete training serializer for authenticated owner.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    skills_list = serializers.ListField(source='get_skills_list', read_only=True)
    
    class Meta:
        model = Training
        fields = [
            'id',
            'title',
            'organization',
            'training_type',
            'url',
            'start_date',
            'end_date',
            'is_ongoing',
            'duration_display',
            'duration_hours',
            'description',
            'skills_acquired',
            'skills_list',
            'has_certificate',
            'certificate_url',
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
            'skills_list'
        ]
    
    def validate(self, attrs):
        """Validate training dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        is_ongoing = attrs.get('is_ongoing', False)
        
        # If is_ongoing, end_date should be empty
        if is_ongoing and end_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être vide pour une formation en cours'
            })
        
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
        
        return attrs


class TrainingCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating training.
    """
    
    class Meta:
        model = Training
        fields = [
            'title',
            'organization',
            'training_type',
            'url',
            'start_date',
            'end_date',
            'is_ongoing',
            'duration_hours',
            'description',
            'skills_acquired',
            'has_certificate',
            'certificate_url',
            'visibility',
            'display_order',
        ]
    
    def validate_title(self, value):
        """Validate title."""
        if len(value) < 5:
            raise serializers.ValidationError('Le titre doit contenir au moins 5 caractères.')
        return value


class TrainingPublicSerializer(serializers.ModelSerializer):
    """
    Public training serializer.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    skills_list = serializers.ListField(source='get_skills_list', read_only=True)
    
    class Meta:
        model = Training
        fields = [
            'id',
            'title',
            'organization',
            'training_type',
            'url',
            'start_date',
            'end_date',
            'is_ongoing',
            'duration_display',
            'duration_hours',
            'description',
            'skills_list',
            'has_certificate',
            'certificate_url',
        ]