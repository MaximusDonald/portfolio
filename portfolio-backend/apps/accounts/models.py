"""
Custom User model for authentication
"""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid


class UserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifier
    instead of username.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        if not email:
            raise ValueError('L\'adresse email doit être fournie')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superutilisateur doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superutilisateur doit avoir is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """
    Custom User model using email as the primary identifier.
    
    Fields:
    - id: UUID primary key
    - email: Unique email address (used for login)
    - first_name: User's first name
    - last_name: User's last name
    - is_active: Account activation status
    - is_staff: Staff status
    - is_superuser: Superuser status
    - created_at: Account creation timestamp
    - updated_at: Last update timestamp
    """
    
    # ID unique (UUID)
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Identifiant unique de l'utilisateur"
    )
    
    # Email as username
    email = models.EmailField(
        unique=True,
        verbose_name='Adresse email',
        help_text="Adresse email utilisée pour la connexion"
    )
    
    # Désactiver le champ username par défaut
    username = None
    
    # Champs personnalisés
    first_name = models.CharField(
        max_length=150,
        blank=True,
        verbose_name='Prénom'
    )
    
    last_name = models.CharField(
        max_length=150,
        blank=True,
        verbose_name='Nom'
    )
    
    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Date de création'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Date de modification'
    )
    
    # Manager personnalisé
    objects = UserManager()
    
    # Email est l'identifiant de connexion
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Pas de champs supplémentaires requis pour createsuperuser
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-created_at']
        db_table = 'accounts_user'
    
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.email
    
    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name or self.email.split('@')[0]