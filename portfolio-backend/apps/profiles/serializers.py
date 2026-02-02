"""
Serializers for Profile model
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from typing import Optional

from apps.core.serializers import BaseSerializer
from .models import Profile

User = get_user_model()


class ProfileSerializer(BaseSerializer):
    """
    Complete profile serializer for authenticated owner.
    """
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    display_email = serializers.CharField(source='get_display_email', read_only=True)
    social_links = serializers.DictField(source='get_social_links', read_only=True)
    portfolio_slug = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Profile
        fields = [
            # IDs & relations
            'id',
            'user_email',
            'user_full_name',
            'portfolio_slug',
            
            # Personal info
            'photo',
            'professional_title',
            'bio',
            'tagline',
            
            # Contact
            'professional_email',
            'phone',
            'location',
            'display_email',
            
            # Social links
            'website_url',
            'github_url',
            'linkedin_url',
            'twitter_url',
            'social_links',
            
            # Availability
            'availability',
            'availability_date',
            
            # Preferences
            'show_email',
            'show_phone',
            'show_location',
            'public_template',
            
            # Metadata
            'is_profile_complete',
            'profile_views',
            
            # Custom Empty Messages
            'empty_about_text',
            'empty_skills_text',
            'empty_experience_text',
            'empty_projects_text',
            'empty_education_text',

            # Custom Traits
            'trait_1_title', 'trait_1_description',
            'trait_2_title', 'trait_2_description',
            'trait_3_title', 'trait_3_description',
            
            # Timestamps
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user_email',
            'user_full_name',
            'display_email',
            'social_links',
            'is_profile_complete',
            'profile_views',
            'created_at',
            'updated_at',
        ]
    
    def validate_photo(self, value):
        """Validate photo file size and format."""
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


class PublicProfileSerializer(serializers.ModelSerializer):
    """
    Public profile serializer (filtered based on privacy settings).
    """
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_id = serializers.CharField(source='user.id', read_only=True)
    email = serializers.SerializerMethodField()
    phone_display = serializers.SerializerMethodField()
    location_display = serializers.SerializerMethodField()
    social_links = serializers.DictField(source='get_social_links', read_only=True)
    portfolio_slug = serializers.CharField(read_only=True)
    public_url = serializers.CharField(read_only=True)
    public_template = serializers.CharField(read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id',
            'user_id',
            'user_full_name',
            'portfolio_slug',
            'public_url',
            'photo',
            'professional_title',
            'bio',
            'tagline',
            'email',
            'phone_display',
            'location_display',
            'social_links',
            'availability',
            'availability_date',
            'public_template',
            
            # Fields needed by the frontend UI
            'professional_email',
            'phone',
            'location',
            'show_email',
            'show_phone',
            'show_location',

            # Custom Empty Messages
            'empty_about_text',
            'empty_skills_text',
            'empty_experience_text',
            'empty_projects_text',
            'empty_education_text',

            # Custom Traits
            'trait_1_title', 'trait_1_description',
            'trait_2_title', 'trait_2_description',
            'trait_3_title', 'trait_3_description',
        ]
    
    def get_email(self, obj: Profile) -> Optional[str]:
        """Return email only if show_email is True."""
        if obj.show_email:
            return obj.get_display_email()
        return None

    def get_phone_display(self, obj: Profile) -> Optional[str]:
        """Return phone only if show_phone is True."""
        if obj.show_phone:
            return obj.phone
        return None
    
    def get_location_display(self, obj: Profile) -> Optional[str]:
        """Return location only if show_location is True."""
        if obj.show_location:
            return obj.location
        return None


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating profile information.
    """
    
    class Meta:
        model = Profile
        fields = [
            'portfolio_slug',
            'photo',
            'professional_title',
            'bio',
            'tagline',
            'professional_email',
            'phone',
            'location',
            'website_url',
            'github_url',
            'linkedin_url',
            'twitter_url',
            'availability',
            'availability_date',
            'show_email',
            'show_phone',
            'show_location',
            'public_template',
        ]
    
    def to_internal_value(self, data):
        # Convert empty strings to None for DateFields
        # We work on a copy to avoid mutating the original data
        new_data = data.copy()
        
        # Date fields typically raise validation error on empty string
        if 'availability_date' in new_data and new_data['availability_date'] == '':
            new_data['availability_date'] = None
            
        return super().to_internal_value(new_data)
        
    def validate_phone(self, value):
        """Allow empty phone number despite regex validator."""
        if not value:
            return ""
        return value

    def validate_professional_title(self, value):
        """Validate professional title length."""
        if value and len(value) < 5:
            raise serializers.ValidationError(
                'Le titre professionnel doit contenir au moins 5 caractères.'
            )
        return value
    
    def validate_bio(self, value):
        """Validate bio length."""
        if value and len(value) < 50:
            raise serializers.ValidationError(
                'La biographie doit contenir au moins 50 caractères.'
            )
        return value
        
    def validate(self, attrs):
        """Debug validation errors."""
        # This method is called after individual field validation
        return attrs