"""
Serializers for education models
"""
from rest_framework import serializers
from django.utils import timezone

from apps.core.serializers import BaseSerializer
from apps.core.enums import Visibility
from .models import Diploma, Certification


class DiplomaSerializer(BaseSerializer):
    """
    Complete diploma serializer for authenticated owner.
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    
    class Meta:
        model = Diploma
        fields = [
            'id',
            'title',
            'institution',
            'level',
            'field',
            'start_date',
            'end_date',
            'duration_display',
            'honors',
            'description',
            'grade',
            'visibility',
            'display_order',
            'is_published',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'duration_display']
    
    def validate(self, attrs):
        """Validate diploma dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')
        
        if start_date and end_date:
            # Basic format validation (YYYY-MM)
            if len(start_date) != 7 or len(end_date) != 7:
                raise serializers.ValidationError({
                    'start_date': 'Format requis: YYYY-MM',
                    'end_date': 'Format requis: YYYY-MM'
                })
            
            # Check that end_date is after start_date
            if end_date < start_date:
                raise serializers.ValidationError({
                    'end_date': 'La date de fin doit être postérieure à la date de début'
                })
        
        return attrs


class DiplomaCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating diplomas.
    """
    
    class Meta:
        model = Diploma
        fields = [
            'title',
            'institution',
            'level',
            'field',
            'start_date',
            'end_date',
            'honors',
            'description',
            'grade',
            'visibility',
            'display_order',
            'is_published',
        ]
    
    def validate_title(self, value):
        """Validate title."""
        if len(value) < 5:
            raise serializers.ValidationError('Le titre doit contenir au moins 5 caractères.')
        return value
    
    def validate_institution(self, value):
        """Validate institution."""
        if len(value) < 3:
            raise serializers.ValidationError('Le nom de l\'établissement doit contenir au moins 3 caractères.')
        return value

    def validate(self, attrs):
        """Validate diploma dates."""
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if start_date and len(start_date) != 7:
            raise serializers.ValidationError({
                'start_date': 'Format requis: YYYY-MM'
            })

        if end_date and len(end_date) != 7:
            raise serializers.ValidationError({
                'end_date': 'Format requis: YYYY-MM'
            })

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'La date de fin doit être postérieure à la date de début'
            })

        return attrs

    def to_internal_value(self, data):
        """Convert empty strings to sane values for optional fields."""
        new_data = data.copy()

        if 'display_order' in new_data and new_data['display_order'] == '':
            new_data['display_order'] = 0

        return super().to_internal_value(new_data)


class DiplomaPublicSerializer(serializers.ModelSerializer):
    """
    Public diploma serializer (only for public diplomas).
    """
    duration_display = serializers.CharField(source='get_duration_display', read_only=True)
    
    class Meta:
        model = Diploma
        fields = [
            'id',
            'title',
            'institution',
            'level',
            'field',
            'start_date',
            'end_date',
            'duration_display',
            'honors',
            'description',
        ]


class CertificationSerializer(BaseSerializer):
    """
    Complete certification serializer for authenticated owner.
    """
    is_expired = serializers.BooleanField(read_only=True)
    status = serializers.CharField(source='get_status', read_only=True)
    skills_list = serializers.ListField(source='get_skills_list', read_only=True)
    
    class Meta:
        model = Certification
        fields = [
            'id',
            'name',
            'organization',
            'platform',
            'issue_date',
            'expiration_date',
            'does_not_expire',
            'credential_id',
            'credential_url',
            'description',
            'skills_acquired',
            'skills_list',
            'visibility',
            'display_order',
            'is_published',
            'is_expired',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'is_expired',
            'status',
            'skills_list'
        ]
        
    def to_internal_value(self, data):
        # Transformer "" en None pour DateField quand does_not_expire
        if data.get('does_not_expire') in ('true', True, 'True'):
            if data.get('expiration_date') in ('', None, 'null'):
                data['expiration_date'] = None
        return super().to_internal_value(data)
    
    def validate(self, attrs):
        """Validate certification dates."""
        issue_date = attrs.get('issue_date')
        expiration_date = attrs.get('expiration_date')
        does_not_expire = attrs.get('does_not_expire', False)
        
        # If has expiration date, it should be after issue date
        if expiration_date and issue_date:
            if expiration_date <= issue_date:
                raise serializers.ValidationError({
                    'expiration_date': 'La date d\'expiration doit être postérieure à la date d\'obtention'
                })
        
        # If does_not_expire is True, expiration_date should be None
        if does_not_expire and expiration_date:
            raise serializers.ValidationError({
                'expiration_date': 'Une certification sans expiration ne peut pas avoir de date d\'expiration'
            })
        
        return attrs


class CertificationCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating/updating certifications.
    """
    
    class Meta:
        model = Certification
        fields = [
            'name',
            'organization',
            'platform',
            'issue_date',
            'expiration_date',
            'does_not_expire',
            'credential_id',
            'credential_url',
            'description',
            'skills_acquired',
            'visibility',
            'display_order',
            'is_published',
        ]
    
    def validate_name(self, value):
        """Validate certification name."""
        if len(value) < 5:
            raise serializers.ValidationError('Le nom doit contenir au moins 5 caractères.')
        return value

    def validate(self, attrs):
        """Validate certification dates."""
        issue_date = attrs.get('issue_date')
        expiration_date = attrs.get('expiration_date')
        does_not_expire = attrs.get('does_not_expire', False)

        if expiration_date and issue_date:
            if expiration_date <= issue_date:
                raise serializers.ValidationError({
                    'expiration_date': 'La date d\'expiration doit être postérieure à la date d\'obtention'
                })

        if does_not_expire and expiration_date:
            raise serializers.ValidationError({
                'expiration_date': 'Une certification sans expiration ne peut pas avoir de date d\'expiration'
            })

        return attrs

    def to_internal_value(self, data):
        """Convert empty strings to None for DateField and sane values for optional fields."""
        new_data = data.copy()

        if new_data.get('does_not_expire') in ('true', True, 'True'):
            if new_data.get('expiration_date') in ('', None, 'null'):
                new_data['expiration_date'] = None

        if 'expiration_date' in new_data and new_data['expiration_date'] == '':
            new_data['expiration_date'] = None

        if 'display_order' in new_data and new_data['display_order'] == '':
            new_data['display_order'] = 0

        return super().to_internal_value(new_data)


class CertificationPublicSerializer(serializers.ModelSerializer):
    """
    Public certification serializer.
    """
    status = serializers.CharField(source='get_status', read_only=True)
    skills_list = serializers.ListField(source='get_skills_list', read_only=True)
    
    class Meta:
        model = Certification
        fields = [
            'id',
            'name',
            'organization',
            'platform',
            'issue_date',
            'expiration_date',
            'credential_id',
            'credential_url',
            'description',
            'skills_list',
            'status',
        ]