"""
Admin configuration for projects app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Project


@admin.register(Project)
class ProjectAdmin(BaseModelAdmin):
    """
    Admin interface for Project model.
    """
    list_display = [
        'title',
        'project_type',
        'status_badge',
        'user',
        'visibility_badge',
        'featured_badge',
        'cover_preview',
        'duration',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'project_type',
        'status',
        'visibility',
        'is_featured',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'short_description',
        'description',
        'technologies',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'cover_preview_large'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations générales', {
            'fields': (
                'title',
                'short_description',
                'description',
                'project_type',
                'status'
            )
        }),
        ('Rôle et équipe', {
            'fields': (
                'role',
                'team_size',
                'organization'
            )
        }),
        ('Période', {
            'fields': (
                'start_date',
                'end_date'
            )
        }),
        ('Aspects techniques', {
            'fields': (
                'technologies',
                'key_features',
                'challenges',
                'solutions'
            )
        }),
        ('Résultats', {
            'fields': (
                'achievements',
                'learning_outcomes'
            )
        }),
        ('Liens', {
            'fields': (
                'github_url',
                'demo_url',
                'video_url',
                'documentation_url'
            )
        }),
        ('Image de couverture', {
            'fields': (
                'cover_image',
                'cover_preview_large'
            )
        }),
        ('Paramètres', {
            'fields': (
                'is_featured',
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
    
    def status_badge(self, obj):
        """Display status as colored badge."""
        colors = {
            'En_cours': 'blue',
            'Termine': 'green',
            'Archive': 'gray'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Statut'
    
    def featured_badge(self, obj):
        """Display featured status."""
        if obj.is_featured:
            return format_html(
                '<span style="background-color: gold; color: black; padding: 3px 10px; border-radius: 3px;">⭐ Mis en avant</span>'
            )
        return '-'
    featured_badge.short_description = 'Mis en avant'
    
    def cover_preview(self, obj):
        """Display small cover image preview in list."""
        if obj.cover_image:
            return format_html(
                '<img src="{}" width="80" height="45" style="border-radius: 5px; object-fit: cover;" />',
                obj.cover_image.url
            )
        return '-'
    cover_preview.short_description = 'Couverture'
    
    def cover_preview_large(self, obj):
        """Display large cover image preview in detail."""
        if obj.cover_image:
            return format_html(
                '<img src="{}" width="400" style="border-radius: 10px;" />',
                obj.cover_image.url
            )
        return 'Aucune image de couverture'
    cover_preview_large.short_description = 'Aperçu de la couverture'
    
    def duration(self, obj):
        """Display duration."""
        return obj.get_duration_display()
    duration.short_description = 'Période'