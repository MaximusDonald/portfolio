"""
Models for recruiter access links
"""
import secrets
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

from apps.core.models import BaseModel


class RecruiterLink(BaseModel):
    """
    Temporary secure link for recruiters.
    
    Allows recruiters to access 'Recruteur' visibility content
    without authentication for a limited time.
    """
    
    # ===== UTILISATEUR =====
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='recruiter_links',
        verbose_name='Utilisateur',
        help_text='Propriétaire du portfolio'
    )
    
    # ===== TOKEN =====
    
    token = models.CharField(
        max_length=64,
        unique=True,
        verbose_name='Token',
        help_text='Token sécurisé unique'
    )
    
    # ===== INFORMATIONS =====
    
    name = models.CharField(
        max_length=200,
        verbose_name='Nom du lien',
        help_text='Nom descriptif pour identifier ce lien (ex: Lien pour Google)'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Description',
        help_text='Note ou contexte de ce lien'
    )
    
    # ===== VALIDITÉ =====
    
    expires_at = models.DateTimeField(
        verbose_name='Date d\'expiration',
        help_text='Date et heure d\'expiration du lien'
    )
    
    is_active = models.BooleanField(
        default=True,
        verbose_name='Actif',
        help_text='Le lien peut être désactivé manuellement'
    )
    
    # ===== TRACKING =====
    
    access_count = models.PositiveIntegerField(
        default=0,
        verbose_name='Nombre d\'accès',
        help_text='Nombre de fois que ce lien a été utilisé'
    )
    
    last_accessed_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name='Dernier accès',
        help_text='Date du dernier accès avec ce lien'
    )
    
    class Meta:
        verbose_name = 'Lien Recruteur'
        verbose_name_plural = 'Liens Recruteurs'
        ordering = ['-created_at']
        db_table = 'recruiter_access_link'
    
    def __str__(self):
        return f"{self.name} ({self.user.email})"
    
    @classmethod
    def generate_token(cls):
        """Generate a secure random token."""
        return secrets.token_urlsafe(48)
    
    def is_valid(self):
        """Check if the link is still valid."""
        if not self.is_active:
            return False
        
        if timezone.now() > self.expires_at:
            return False
        
        return True
    
    def is_expired(self):
        """Check if the link has expired."""
        return timezone.now() > self.expires_at
    
    def revoke(self):
        """Revoke the link (make it inactive)."""
        self.is_active = False
        self.save(update_fields=['is_active'])
    
    def increment_access(self):
        """Increment access counter and update last access time."""
        if not self.last_accessed_at:
            self.last_accessed_at = timezone.now()
            self.save(update_fields=['last_accessed_at'])
        if timezone.now() > self.last_accessed_at + timedelta(seconds=10): 
            self.access_count += 1
            self.last_accessed_at = timezone.now()
            self.save(update_fields=['access_count', 'last_accessed_at'])
    
    def get_full_url(self, base_url):
        """
        Get the full URL with token.
        
        Args:
            base_url: Base URL of the portfolio (e.g., 'https://portfolio.com')
        
        Returns:
            Full URL with token parameter
        """
        return f"{base_url}?access={self.token}"
    
    def get_time_remaining(self):
        """Get time remaining until expiration."""
        if self.is_expired():
            return "Expiré"
        
        remaining = self.expires_at - timezone.now()
        days = remaining.days
        hours = remaining.seconds // 3600
        
        if days > 0:
            return f"{days} jour(s)"
        elif hours > 0:
            return f"{hours} heure(s)"
        else:
            minutes = remaining.seconds // 60
            return f"{minutes} minute(s)"
    
    def save(self, *args, **kwargs):
        """Override save to auto-generate token."""
        if not self.token:
            self.token = self.generate_token()
        super().save(*args, **kwargs)