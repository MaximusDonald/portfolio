"""
Serializers for skills
"""
from rest_framework import serializers

from apps.core.serializers import BaseSerializer
from .models import Skill


class SkillSerializer(BaseSerializer):
    """
    Complete skill serializer for authenticated owner.
    """
    justifications_count = serializers.IntegerField(
        source='get_justifications_count',
        read_only=True
    )
    justifications = serializers.DictField(
        source='get_justifications',
        read_only=True
    )
    has_justifications = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Skill
        fields = [
            'id',
            'name',
            'category',
            'level',
            'description',
            'years_of_experience',
            'related_projects',
            'related_certifications',
            'related_trainings',
            'is_primary',
            'display_order',
            'justifications_count',
            'justifications',
            'has_justifications',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'justifications_count',
            'justifications',
            'has_justifications'
        ]


class SkillCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating skills.
    """
    
    class Meta:
        model = Skill
        fields = [
            'name',
            'category',
            'level',
            'description',
            'years_of_experience',
            'related_projects',
            'related_certifications',
            'related_trainings',
            'is_primary',
            'display_order',
        ]
    
    def validate_name(self, value):
        """Validate skill name."""
        if len(value) < 2:
            raise serializers.ValidationError('Le nom doit contenir au moins 2 caractères.')
        return value
    
    def validate_years_of_experience(self, value):
        """Validate years of experience."""
        if value is not None and value < 0:
            raise serializers.ValidationError('Le nombre d\'années ne peut pas être négatif.')
        if value is not None and value > 50:
            raise serializers.ValidationError('Le nombre d\'années semble incorrect (max: 50).')
        return value
    
    def validate(self, attrs):
        """Validate that related items belong to the user."""
        user = self.context['request'].user
        
        # Validate related projects
        related_projects = attrs.get('related_projects', [])
        for project in related_projects:
            if project.user != user:
                raise serializers.ValidationError({
                    'related_projects': 'Vous ne pouvez lier que vos propres projets.'
                })
        
        # Validate related certifications
        related_certifications = attrs.get('related_certifications', [])
        for cert in related_certifications:
            if cert.user != user:
                raise serializers.ValidationError({
                    'related_certifications': 'Vous ne pouvez lier que vos propres certifications.'
                })
        
        # Validate related trainings
        related_trainings = attrs.get('related_trainings', [])
        for training in related_trainings:
            if training.user != user:
                raise serializers.ValidationError({
                    'related_trainings': 'Vous ne pouvez lier que vos propres formations.'
                })
        
        return attrs


class SkillPublicSerializer(serializers.ModelSerializer):
    """
    Public skill serializer.
    """
    
    class Meta:
        model = Skill
        fields = [
            'id',
            'name',
            'category',
            'level',
            'description',
            'years_of_experience',
            'is_primary',
        ]


class SkillListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for skill lists.
    """
    justifications_count = serializers.IntegerField(
        source='get_justifications_count',
        read_only=True
    )
    
    class Meta:
        model = Skill
        fields = [
            'id',
            'name',
            'category',
            'level',
            'years_of_experience',
            'is_primary',
            'justifications_count',
        ]


class SkillGroupedSerializer(serializers.Serializer):
    """
    Serializer for grouped skills by category.
    """
    category = serializers.CharField()
    category_display = serializers.CharField()
    skills = SkillPublicSerializer(many=True)
    count = serializers.IntegerField()