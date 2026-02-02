"""
Serializers for recruiter access
"""
from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta

from apps.core.serializers import BaseSerializer
from .models import RecruiterLink


class RecruiterLinkSerializer(BaseSerializer):
    """
    Complete recruiter link serializer.
    """
    is_valid = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    time_remaining = serializers.CharField(source='get_time_remaining', read_only=True)
    
    class Meta:
        model = RecruiterLink
        fields = [
            'id',
            'name',
            'description',
            'token',
            'expires_at',
            'is_active',
            'is_valid',
            'is_expired',
            'time_remaining',
            'access_count',
            'last_accessed_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'token',
            'is_valid',
            'is_expired',
            'time_remaining',
            'access_count',
            'last_accessed_at',
            'created_at',
            'updated_at',
        ]


class RecruiterLinkCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating recruiter links.
    """
    duration_hours = serializers.IntegerField(
        write_only=True,
        required=False,
        default=72,
        help_text='Durée de validité en heures (défaut: 72h = 3 jours)'
    )
    
    class Meta:
        model = RecruiterLink
        fields = [
            'name',
            'description',
            'duration_hours',
        ]
    
    def validate_name(self, value):
        """Validate name."""
        if len(value) < 3:
            raise serializers.ValidationError('Le nom doit contenir au moins 3 caractères.')
        return value
    
    def validate_duration_hours(self, value):
        """Validate duration."""
        if value < 1:
            raise serializers.ValidationError('La durée doit être d\'au moins 1 heure.')
        if value > 720:  # 30 days
            raise serializers.ValidationError('La durée ne peut pas dépasser 720 heures (30 jours).')
        return value
    
    def create(self, validated_data):
        """Create link with calculated expiration."""
        duration_hours = validated_data.pop('duration_hours', 72)
        expires_at = timezone.now() + timedelta(hours=duration_hours)
        
        return RecruiterLink.objects.create(
            expires_at=expires_at,
            **validated_data
        )


class RecruiterLinkListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for link lists.
    """
    is_valid = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    time_remaining = serializers.CharField(source='get_time_remaining', read_only=True)
    
    class Meta:
        model = RecruiterLink
        fields = [
            'id',
            'name',
            'description',
            'token',
            'is_active',
            'is_valid',
            'is_expired',
            'time_remaining',
            'access_count',
            'last_accessed_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'token',
            'is_valid',
            'is_expired',
            'time_remaining',
            'access_count',
            'last_accessed_at',
            'created_at',
            'updated_at',
        ]