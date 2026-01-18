"""
Base models and mixins for the application
"""
from django.db import models
from django.conf import settings
import uuid

from .enums import Visibility


class BaseModel(models.Model):
    """
    Abstract base model with common fields.
    
    All models in the application should inherit from this.
    Provides:
    - UUID as primary key
    - created_at and updated_at timestamps
    - Soft delete capability (optional)
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Identifiant unique UUID"
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Date de modification"
    )
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


class VisibilityMixin(models.Model):
    """
    Mixin to add visibility control to models.
    
    Provides:
    - visibility field (Public, Recruteur, Prive)
    - Helper methods to check visibility
    - Query methods for filtering by visibility
    """
    
    visibility = models.CharField(
        max_length=20,
        choices=Visibility.choices,
        default=Visibility.PUBLIC,
        verbose_name="Visibilité",
        help_text="Niveau de visibilité du contenu"
    )
    
    class Meta:
        abstract = True
    
    def is_public(self):
        """Check if the content is publicly visible."""
        return self.visibility == Visibility.PUBLIC
    
    def is_recruiter_only(self):
        """Check if the content is visible only to recruiters."""
        return self.visibility == Visibility.RECRUTEUR
    
    def is_private(self):
        """Check if the content is private."""
        return self.visibility == Visibility.PRIVE
    
    @classmethod
    def public_objects(cls):
        """Get all public objects."""
        return cls.objects.filter(visibility=Visibility.PUBLIC)
    
    @classmethod
    def recruiter_objects(cls):
        """Get all recruiter-visible objects (Public + Recruteur)."""
        return cls.objects.filter(
            visibility__in=[Visibility.PUBLIC, Visibility.RECRUTEUR]
        )


class OwnedModel(models.Model):
    """
    Mixin for models that belong to a user.
    
    Provides:
    - user foreign key
    - Helper method to check ownership
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='%(class)s_set',
        verbose_name="Utilisateur"
    )
    
    class Meta:
        abstract = True
    
    def is_owned_by(self, user):
        """Check if the object is owned by the given user."""
        return self.user == user