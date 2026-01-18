"""
Admin configuration for skills app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Skill


@admin.register(Skill)
class SkillAdmin(BaseModelAdmin):
    """
    Admin interface for Skill model.
    """
    list_display = [
        'name',
        'category',
        'level_badge',
        'user',
        'primary_badge',
        'years_of_experience',
        'justifications_badge',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'category',
        'level',
        'is_primary',
        'created_at'
    ]
    
    search_fields = [
        'name',
        'description',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'justifications_count_display'
    ]
    
    filter_horizontal = [
        'related_projects',
        'related_certifications',
        'related_trainings'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations de la compétence', {
            'fields': (
                'name',
                'category',
                'level',
                'description',
                'years_of_experience'
            )
        }),
        ('Justifications', {
            'fields': (
                'related_projects',
                'related_certifications',
                'related_trainings',
                'justifications_count_display'
            )
        }),
        ('Paramètres', {
            'fields': (
                'is_primary',
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
    
    def level_badge(self, obj):
        """Display level as colored badge."""
        colors = {
            'Debutant': '#90caf9',
            'Intermediaire': '#66bb6a',
            'Avance': '#ffa726',
            'Expert': '#ef5350'
        }
        color = colors.get(obj.level, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_level_display()
        )
    level_badge.short_description = 'Niveau'
    
    def primary_badge(self, obj):
        """Display primary status."""
        if obj.is_primary:
            return format_html(
                '<span style="background-color: gold; color: black; padding: 3px 10px; border-radius: 3px;">⭐ Principale</span>'
            )
        return '-'
    primary_badge.short_description = 'Principale'
    
    def justifications_badge(self, obj):
        """Display justifications count."""
        count = obj.get_justifications_count()
        if count > 0:
            return format_html(
                '<span style="background-color: #4caf50; color: white; padding: 3px 10px; border-radius: 3px;">{} justification(s)</span>',
                count
            )
        return format_html(
            '<span style="background-color: #f44336; color: white; padding: 3px 10px; border-radius: 3px;">Aucune</span>'
        )
    justifications_badge.short_description = 'Justifications'
    
    def justifications_count_display(self, obj):
        """Display detailed justifications count."""
        justifications = obj.get_justifications()
        html = '<ul style="margin: 0; padding-left: 20px;">'
        html += f'<li>Projets: {len(justifications["projects"])}</li>'
        html += f'<li>Certifications: {len(justifications["certifications"])}</li>'
        html += f'<li>Formations: {len(justifications["trainings"])}</li>'
        html += f'</ul><strong>Total: {obj.get_justifications_count()}</strong>'
        return format_html(html)
    justifications_count_display.short_description = 'Détail des justifications'