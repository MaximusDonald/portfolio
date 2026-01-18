"""
Admin configuration for recruiter access app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import RecruiterLink


@admin.register(RecruiterLink)
class RecruiterLinkAdmin(BaseModelAdmin):
    """
    Admin interface for RecruiterLink model.
    """
    list_display = [
        'name',
        'user',
        'status_badge',
        'expires_at',
        'time_remaining_display',
        'access_count',
        'last_accessed_at',
        'created_at'
    ]
    
    list_filter = [
        'is_active',
        'created_at',
        'expires_at'
    ]
    
    search_fields = [
        'name',
        'description',
        'token',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'token',
        'access_count',
        'last_accessed_at',
        'created_at',
        'updated_at',
        'full_url_display'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations', {
            'fields': (
                'name',
                'description'
            )
        }),
        ('Token', {
            'fields': (
                'token',
                'full_url_display'
            )
        }),
        ('Validité', {
            'fields': (
                'expires_at',
                'is_active'
            )
        }),
        ('Statistiques', {
            'fields': (
                'access_count',
                'last_accessed_at'
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
    
    def status_badge(self, obj):
        """Display link status as colored badge."""
        if not obj.is_active:
            return format_html(
                '<span style="background-color: gray; color: white; padding: 3px 10px; border-radius: 3px;">Révoqué</span>'
            )
        elif obj.is_expired():
            return format_html(
                '<span style="background-color: red; color: white; padding: 3px 10px; border-radius: 3px;">Expiré</span>'
            )
        else:
            return format_html(
                '<span style="background-color: green; color: white; padding: 3px 10px; border-radius: 3px;">Actif</span>'
            )
    status_badge.short_description = 'Statut'
    
    def time_remaining_display(self, obj):
        """Display time remaining."""
        return obj.get_time_remaining()
    time_remaining_display.short_description = 'Temps restant'
    
    def full_url_display(self, obj):
        """Display full URL with copy button."""
        url = obj.get_full_url('https://your-portfolio.com')
        return format_html(
            '<input type="text" value="{}" style="width: 100%;" readonly onclick="this.select();" />',
            url
        )
    full_url_display.short_description = 'URL complète'
    
    actions = ['revoke_selected', 'activate_selected']
    
    def revoke_selected(self, request, queryset):
        """Action to revoke selected links."""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} lien(s) révoqué(s).')
    revoke_selected.short_description = 'Révoquer les liens sélectionnés'
    
    def activate_selected(self, request, queryset):
        """Action to activate selected links."""
        count = 0
        for link in queryset:
            if not link.is_expired():
                link.is_active = True
                link.save()
                count += 1
        self.message_user(request, f'{count} lien(s) activé(s).')
    activate_selected.short_description = 'Activer les liens sélectionnés (si non expirés)'