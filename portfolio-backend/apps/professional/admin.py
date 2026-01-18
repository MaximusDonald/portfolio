"""
Admin configuration for professional app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Experience, Training


@admin.register(Experience)
class ExperienceAdmin(BaseModelAdmin):
    """
    Admin interface for Experience model.
    """
    list_display = [
        'position',
        'company',
        'experience_type',
        'user',
        'visibility_badge',
        'current_badge',
        'duration',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'experience_type',
        'visibility',
        'is_current',
        'created_at'
    ]
    
    search_fields = [
        'position',
        'company',
        'location',
        'description',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations du poste', {
            'fields': (
                'position',
                'company',
                'company_url',
                'location',
                'experience_type'
            )
        }),
        ('Période', {
            'fields': (
                'start_date',
                'end_date',
                'is_current'
            )
        }),
        ('Missions et réalisations', {
            'fields': (
                'description',
                'missions',
                'achievements',
                'technologies'
            )
        }),
        ('Paramètres', {
            'fields': (
                'visibility',
                'display_order'
            )
        }),
        ('Métadonnées', {
            'fields': (
                'id',
                'created_at',
                'updated_at'
            )
        }),
    )
    
    def visibility_badge(self, obj):
        """Display visibility as colored badge."""
        colors = {
            'Public': 'green',
            'Recruteur': 'orange',
            'Prive': 'red'
        }
        color = colors.get(obj.visibility, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_visibility_display()
        )
    visibility_badge.short_description = 'Visibilité'
    
    def current_badge(self, obj):
        """Display current status."""
        if obj.is_current:
            return format_html(
                '<span style="background-color: green; color: white; padding: 3px 10px; border-radius: 3px;">En cours</span>'
            )
        return '-'
    current_badge.short_description = 'Statut'
    
    def duration(self, obj):
        """Display duration."""
        return obj.get_duration_display()
    duration.short_description = 'Période'


@admin.register(Training)
class TrainingAdmin(BaseModelAdmin):
    """
    Admin interface for Training model.
    """
    list_display = [
        'title',
        'organization',
        'training_type',
        'user',
        'visibility_badge',
        'certificate_badge',
        'duration',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'training_type',
        'visibility',
        'is_ongoing',
        'has_certificate',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'organization',
        'description',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations de la formation', {
            'fields': (
                'title',
                'organization',
                'training_type',
                'url'
            )
        }),
        ('Période', {
            'fields': (
                'start_date',
                'end_date',
                'is_ongoing',
                'duration_hours'
            )
        }),
        ('Contenu', {
            'fields': (
                'description',
                'skills_acquired'
            )
        }),
        ('Certification', {
            'fields': (
                'has_certificate',
                'certificate_url'
            )
        }),
        ('Paramètres', {
            'fields': (
                'visibility',
                'display_order'
            )
        }),
            ('Métadonnées', {
                'fields': (
                    'id',
                    'created_at',
                    'updated_at'
            )
        }),
    )
    
    def visibility_badge(self, obj):
        """Display visibility as colored badge."""
        colors = {
            'Public': 'green',
            'Recruteur': 'orange',
            'Prive': 'red'
        }
        color = colors.get(obj.visibility, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_visibility_display()
        )
    visibility_badge.short_description = 'Visibilité'

    def certificate_badge(self, obj):
        """Display certificate status."""
        if obj.has_certificate:
            return format_html(
                '<span style="background-color: green; color: white; padding: 3px 10px; border-radius: 3px;">✓</span>'
            )
        return '-'
    certificate_badge.short_description = 'Certificat'

    def duration(self, obj):
        """Display duration."""
        return obj.get_duration_display()
    duration.short_description = 'Période'