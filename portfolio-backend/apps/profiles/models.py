"""
Profile model for portfolio information
"""
from django.db import models
from django.conf import settings
from django.core.validators import URLValidator, RegexValidator

from apps.core.models import BaseModel
from apps.core.utils import generate_filename


class Profile(BaseModel):
    """
    User profile model containing portfolio information.
    
    One-to-One relationship with User model.
    Contains all public-facing portfolio information.
    """
    
    # Relation One-to-One avec User
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile',
        verbose_name='Utilisateur'
    )
    
    # ===== INFORMATIONS PERSONNELLES =====
    
    photo = models.ImageField(
        upload_to=generate_filename,
        blank=True,
        null=True,
        verbose_name='Photo de profil',
        help_text='Photo professionnelle (format recommandé: 400x400px)'
    )
    
    professional_title = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Titre professionnel',
        help_text='Ex: Développeur Full-Stack, Data Scientist, etc.'
    )
    
    bio = models.TextField(
        blank=True,
        verbose_name='Biographie',
        help_text='Courte présentation professionnelle'
    )
    
    tagline = models.CharField(
        max_length=150,
        blank=True,
        verbose_name='Phrase d\'accroche',
        help_text='Phrase courte et percutante'
    )
    
    # ===== COORDONNÉES =====
    
    professional_email = models.EmailField(
        blank=True,
        verbose_name='Email professionnel',
        help_text='Email de contact professionnel (peut être différent du compte)'
    )
    
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Le numéro de téléphone doit être au format: '+999999999'. Jusqu'à 15 chiffres."
    )
    
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True,
        verbose_name='Téléphone',
        help_text='Numéro de téléphone professionnel'
    )
    
    location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Localisation',
        help_text='Ville, Pays'
    )
    
    # ===== LIENS EXTERNES =====
    
    website_url = models.URLField(
        blank=True,
        verbose_name='Site web personnel',
        help_text='URL de votre site web ou portfolio'
    )
    
    github_url = models.URLField(
        blank=True,
        verbose_name='GitHub',
        help_text='URL de votre profil GitHub'
    )
    
    linkedin_url = models.URLField(
        blank=True,
        verbose_name='LinkedIn',
        help_text='URL de votre profil LinkedIn'
    )
    
    twitter_url = models.URLField(
        blank=True,
        verbose_name='Twitter/X',
        help_text='URL de votre profil Twitter'
    )
    
    # ===== DISPONIBILITÉ =====
    
    AVAILABILITY_CHOICES = [
        ('disponible_stage', 'Disponible pour un stage'),
        ('disponible_emploi', 'Disponible pour un emploi'),
        ('disponible_freelance', 'Disponible en freelance'),
        ('disponible_projet', 'Disponible pour des projets'),
        ('non_disponible', 'Non disponible actuellement'),
    ]
    
    availability = models.CharField(
        max_length=30,
        choices=AVAILABILITY_CHOICES,
        default='non_disponible',
        verbose_name='Disponibilité',
        help_text='Statut de disponibilité actuel'
    )
    
    availability_date = models.DateField(
        blank=True,
        null=True,
        verbose_name='Date de disponibilité',
        help_text='Date à partir de laquelle vous êtes disponible'
    )
    
    # ===== PRÉFÉRENCES =====
    
    show_email = models.BooleanField(
        default=True,
        verbose_name='Afficher l\'email',
        help_text='Afficher l\'email professionnel sur le portfolio public'
    )
    
    show_phone = models.BooleanField(
        default=False,
        verbose_name='Afficher le téléphone',
        help_text='Afficher le téléphone sur le portfolio public'
    )
    
    show_location = models.BooleanField(
        default=True,
        verbose_name='Afficher la localisation',
        help_text='Afficher la localisation sur le portfolio public'
    )
    
    # ===== MÉTADONNÉES =====
    
    is_profile_complete = models.BooleanField(
        default=False,
        verbose_name='Profil complet',
        help_text='Indique si le profil est suffisamment rempli'
    )
    
    profile_views = models.PositiveIntegerField(
        default=0,
        verbose_name='Nombre de vues',
        help_text='Nombre de fois que le profil a été consulté'
    )
    
    class Meta:
        verbose_name = 'Profil'
        verbose_name_plural = 'Profils'
        ordering = ['-created_at']
        db_table = 'profiles_profile'
    
    def __str__(self):
        return f"Profil de {self.user.get_full_name() or self.user.email}"
    
    def get_display_email(self):
        """Return the email to display (professional or user email)."""
        return self.professional_email or self.user.email
    
    def get_social_links(self):
        """Return a dictionary of all social links."""
        return {
            'website': self.website_url,
            'github': self.github_url,
            'linkedin': self.linkedin_url,
            'twitter': self.twitter_url,
        }
    
    def check_profile_completeness(self):
        """
        Check if the profile has minimum required information.
        Updates is_profile_complete field.
        """
        required_fields = [
            self.professional_title,
            self.bio,
            self.location,
        ]
        
        # At least 2 out of 3 required fields must be filled
        filled_count = sum(1 for field in required_fields if field)
        self.is_profile_complete = filled_count >= 2
        self.save(update_fields=['is_profile_complete'])
        
        return self.is_profile_complete
    
    def increment_views(self):
        """Increment the profile view counter."""
        self.profile_views += 1
        self.save(update_fields=['profile_views'])
    
    def save(self, *args, **kwargs):
        """Override save to auto-check completeness."""
        super().save(*args, **kwargs)
        
        # Check completeness after save (avoid recursion)
        if 'update_fields' not in kwargs:
            self.check_profile_completeness()