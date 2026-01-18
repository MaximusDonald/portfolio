"""
Admin configuration for proofs app
"""
from django.contrib import admin
from django.utils.html import format_html

from apps.core.admin import BaseModelAdmin
from .models import Proof


@admin.register(Proof)
class ProofAdmin(BaseModelAdmin):
    """
    Admin interface for Proof model.
    """
    list_display = [
        'title',
        'proof_type',
        'user',
        'visibility_badge',
        'file_preview',
        'file_size_display',
        'attached_to',
        'display_order',
        'created_at'
    ]
    
    list_filter = [
        'proof_type',
        'visibility',
        'content_type',
        'created_at'
    ]
    
    search_fields = [
        'title',
        'description',
        'file_name',
        'user__email'
    ]
    
    readonly_fields = [
        'id',
        'file_size',
        'file_name',
        'mime_type',
        'created_at',
        'updated_at',
        'file_preview_large'
    ]
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user',)
        }),
        ('Informations', {
            'fields': (
                'title',
                'description',
                'proof_type'
            )
        }),
        ('Fichier', {
            'fields': (
                'file',
                'file_preview_large',
                'file_size',
                'file_name',
                'mime_type'
            )
        }),
        ('Attaché à', {
            'fields': (
                'content_type',
                'object_id'
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
    
    def file_preview(self, obj):
        """Display file preview in list."""
        if obj.is_image() and obj.file:
            return format_html(
                '<img src="{}" width="60" height="60" style="object-fit: cover; border-radius: 5px;" />',
                obj.file.url
            )
        elif obj.is_pdf():
            return '📄 PDF'
        elif obj.is_video():
            return '🎥 Vidéo'
        else:
            return '📎 Document'
    file_preview.short_description = 'Aperçu'
    
    def file_preview_large(self, obj):
        """Display large file preview in detail."""
        if obj.is_image() and obj.file:
            return format_html(
                '<img src="{}" width="400" style="border-radius: 10px;" />',
                obj.file.url
            )
        return 'Aperçu non disponible pour ce type de fichier'
    file_preview_large.short_description = 'Aperçu du fichier'
    
    def attached_to(self, obj):
        """Display what this proof is attached to."""
        if obj.content_object:
            return f"{obj.content_type.model.upper()}: {obj.content_object}"
        return '-'
    attached_to.short_description = 'Attaché à'
    
    def file_size_display(self, obj):
        """Display file size in human-readable format"""
        if obj.file_size:
            size_mb = obj.file_size / (1024 * 1024)
            return f"{size_mb:.2f} MB"
        return "—"
    file_size_display.short_description = "Taille du fichier"