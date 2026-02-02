"""
Models for proofs and file attachments
"""
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from apps.core.models import BaseModel, VisibilityMixin, OwnedModel
from apps.core.enums import Visibility, ProofType
from apps.core.utils import generate_filename
from .validators import validate_image, validate_video, validate_pdf, validate_document


class Proof(BaseModel, VisibilityMixin, OwnedModel):
    """
    Proof model for file attachments.
    
    Uses Django's ContentTypes framework for polymorphic relations.
    Can be attached to any model (Diploma, Certification, Project, etc.).
    """
    
    # ===== RELATION POLYMORPHIQUE =====
    
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        verbose_name='Type de contenu',
        help_text='Type d\'objet auquel cette preuve est attachée'
    )
    
    object_id = models.UUIDField(
        verbose_name='ID de l\'objet',
        help_text='ID de l\'objet auquel cette preuve est attachée'
    )
    
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # ===== INFORMATIONS DU FICHIER =====
    
    title = models.CharField(
        max_length=200,
        verbose_name='Titre',
        help_text='Titre descriptif du fichier'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Description',
        help_text='Description optionnelle du fichier'
    )
    
    proof_type = models.CharField(
        max_length=20,
        choices=ProofType.choices,
        verbose_name='Type de preuve',
        help_text='Type de fichier (image, vidéo, PDF, document)'
    )
    
    # ===== FICHIER =====
    
    file = models.FileField(
        upload_to=generate_filename,
        verbose_name='Fichier',
        help_text='Fichier de la preuve'
    )
    
    file_size = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Taille du fichier',
        help_text='Taille du fichier en octets'
    )
    
    file_name = models.CharField(
        max_length=255,
        blank=True,
        verbose_name='Nom du fichier original',
        help_text='Nom du fichier tel qu\'uploadé'
    )
    
    mime_type = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Type MIME',
        help_text='Type MIME du fichier'
    )
    
    # ===== ORDRE D'AFFICHAGE =====
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Preuve'
        verbose_name_plural = 'Preuves'
        ordering = ['display_order', 'created_at']
        db_table = 'proofs_proof'
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
        ]
    
    def __str__(self):
        return f"{self.title} ({self.get_proof_type_display()})"
    
    def save(self, *args, **kwargs):
        """Override save to store file metadata."""
        if self.file:
            # Store file size
            self.file_size = self.file.size
            
            # Store original filename
            if not self.file_name:
                self.file_name = self.file.name
            
            # Store MIME type (approximate based on extension)
            ext = self.file.name.split('.')[-1].lower()
            mime_types = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp',
                'mp4': 'video/mp4',
                'webm': 'video/webm',
                'avi': 'video/x-msvideo',
                'mov': 'video/quicktime',
                'pdf': 'application/pdf',
                'doc': 'application/msword',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'txt': 'text/plain',
            }
            self.mime_type = mime_types.get(ext, 'application/octet-stream')
        
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        """Override delete to remove file from storage."""
        # Delete the file from storage
        if self.file:
            self.file.delete(save=False)
        
        super().delete(*args, **kwargs)
    
    def get_file_size_display(self):
        """Return human-readable file size."""
        if not self.file_size:
            return 'N/A'
        
        size = self.file_size
        for unit in ['o', 'Ko', 'Mo', 'Go']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} To"
    
    def get_file_extension(self):
        """Return file extension."""
        if self.file_name:
            return self.file_name.split('.')[-1].lower()
        return ''

    @property
    def is_image(self):
        """Check if proof is an image."""
        return self.proof_type == ProofType.IMAGE

    @property
    def is_video(self):
        """Check if proof is a video."""
        return self.proof_type == ProofType.VIDEO

    @property
    def is_pdf(self):
        """Check if proof is a PDF."""
        return self.proof_type == ProofType.PDF

    @property
    def is_document(self):
        """Check if proof is a document."""
        return self.proof_type == ProofType.DOCUMENT