"""
Admin configuration for education app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Diploma, Certification


@admin.register(Diploma)
class DiplomaAdmin(BaseModelAdmin):
    """
    Admin interface for Diploma model.
    """
    list_display = [
        'title',
        'institution',
        'level',
        'user',
        'visibility_badge',
        'duration',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'level',
        'visibility',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'institution',
        'field',
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
        ('Informations du diplôme', {
            'fields': (
                'title',
                'institution',
                'level',
                'field'
            )
        }),
        ('Période', {
            'fields': (
                'start_date',
                'end_date'
            )
        }),
        ('Détails', {
            'fields': (
                'honors',
                'grade',
                'description'
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
    
    def duration(self, obj):
        """Display duration."""
        return obj.get_duration_display()
    duration.short_description = 'Période'


@admin.register(Certification)
class CertificationAdmin(BaseModelAdmin):
    """
    Admin interface for Certification model.
    """
    list_display = [
        'name',
        'organization',
        'user',
        'visibility_badge',
        'status_badge',
        'issue_date',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'visibility',
        'does_not_expire',
        'platform',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'organization',
        'platform',
        'credential_id',
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
        ('Informations de la certification', {
            'fields': (
                'name',
                'organization',
                'platform'
            )
        }),
        ('Dates', {
            'fields': (
                'issue_date',
                'expiration_date',
                'does_not_expire'
            )
        }),
        ('Vérification', {
            'fields': (
                'credential_id',
                'credential_url'
            )
        }),
        ('Détails', {
            'fields': (
                'description',
                'skills_acquired'
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
    
    def status_badge(self, obj):
        """Display certification status."""
        status = obj.get_status()
        colors = {
            'Active': 'green',
            'Expirée': 'red',
            'Valide indéfiniment': 'blue',
            'Sans expiration définie': 'gray'
        }
        color = colors.get(status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            status
        )
    status_badge.short_description = 'Statut'