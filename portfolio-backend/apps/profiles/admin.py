"""
Admin configuration for profiles app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(BaseModelAdmin):
    """
    Admin interface for Profile model.
    """
    list_display = [
        'user',
        'professional_title',
        'location',
        'availability',
        'is_profile_complete',
        'profile_views',
        'photo_preview',
        'created_at'
    ]
    
    list_filter = [
        'availability',
        'is_profile_complete',
        'show_email',
        'show_phone',
        'created_at'
    ]
    
    search_fields = [
        'user__email',
        'user__first_name',
        'user__last_name',
        'professional_title',
        'location'
    ]
    
    readonly_fields = [
        'id',
        'user',
        'is_profile_complete',
        'profile_views',
        'created_at',
        'updated_at',
        'photo_preview_large'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user', 'id')
        }),
        ('Informations personnelles', {
            'fields': (
                'photo',
                'photo_preview_large',
                'professional_title',
                'tagline',
                'bio'
            )
        }),
        ('Coordonnées', {
            'fields': (
                'professional_email',
                'phone',
                'location'
            )
        }),
        ('Liens externes', {
            'fields': (
                'website_url',
                'github_url',
                'linkedin_url',
                'twitter_url'
            )
        }),
        ('Disponibilité', {
            'fields': (
                'availability',
                'availability_date'
            )
        }),
        ('Paramètres de visibilité', {
            'fields': (
                'show_email',
                'show_phone',
                'show_location'
            )
        }),
        ('Métadonnées', {
            'fields': (
                'is_profile_complete',
                'profile_views',
                'created_at',
                'updated_at'
            )
        }),
    )
    
    def photo_preview(self, obj):
        """Display small photo preview in list."""
        if obj.photo:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.photo.url
            )
        return '-'
    photo_preview.short_description = 'Photo'
    
    def photo_preview_large(self, obj):
        """Display large photo preview in detail."""
        if obj.photo:
            return format_html(
                '<img src="{}" width="200" height="200" style="border-radius: 10px;" />',
                obj.photo.url
            )
        return 'Aucune photo'
    photo_preview_large.short_description = 'Aperçu de la photo'