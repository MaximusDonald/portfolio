"""
Models for professional experiences and training
"""
from django.db import models
from django.conf import settings

from apps.core.models import BaseModel, VisibilityMixin, OwnedModel
from apps.core.enums import Visibility, ExperienceType, TrainingType


class Experience(BaseModel, VisibilityMixin, OwnedModel):
    """
    Professional experience model.
    
    Represents work experiences: internships, jobs, freelance, etc.
    """
    
    # ===== INFORMATIONS DE L'EXPÉRIENCE =====
    
    position = models.CharField(
        max_length=200,
        verbose_name='Poste occupé',
        help_text='Ex: Développeur Full-Stack'
    )
    
    company = models.CharField(
        max_length=200,
        verbose_name='Entreprise/Organisation',
        help_text='Nom de l\'entreprise ou organisation'
    )
    
    company_url = models.URLField(
        blank=True,
        verbose_name='Site web de l\'entreprise',
        help_text='URL du site web de l\'entreprise'
    )
    
    location = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Localisation',
        help_text='Ville, Pays'
    )
    
    experience_type = models.CharField(
        max_length=20,
        choices=ExperienceType.choices,
        verbose_name='Type d\'expérience',
        help_text='Stage, Emploi, Freelance, etc.'
    )
    
    # ===== PÉRIODE =====
    
    start_date = models.CharField(
        max_length=7,
        verbose_name='Date de début',
        help_text='Format: YYYY-MM (ex: 2021-03)'
    )
    
    end_date = models.CharField(
        max_length=7,
        blank=True,
        verbose_name='Date de fin',
        help_text='Format: YYYY-MM. Laisser vide si en cours'
    )
    
    is_current = models.BooleanField(
        default=False,
        verbose_name='Poste actuel',
        help_text='Cocher si vous occupez toujours ce poste'
    )
    
    # ===== MISSIONS ET RÉALISATIONS =====
    
    description = models.TextField(
        verbose_name='Description du poste',
        help_text='Présentation générale du poste et contexte'
    )
    
    missions = models.TextField(
        verbose_name='Missions principales',
        help_text='Liste des missions (une par ligne ou séparées par des puces)'
    )
    
    achievements = models.TextField(
        blank=True,
        verbose_name='Réalisations/Résultats',
        help_text='Résultats concrets obtenus (chiffrés si possible)'
    )
    
    # ===== COMPÉTENCES =====
    
    technologies = models.TextField(
        blank=True,
        verbose_name='Technologies utilisées',
        help_text='Liste des technologies, langages, outils (séparés par des virgules)'
    )
    
    # ===== ORDRE D'AFFICHAGE =====
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Expérience professionnelle'
        verbose_name_plural = 'Expériences professionnelles'
        ordering = ['display_order', '-start_date']
        db_table = 'professional_experience'
    
    def __str__(self):
        return f"{self.position} - {self.company}"
    
    def get_duration_display(self):
        """Return formatted duration string."""
        if self.is_current:
            return f"{self.start_date} - Actuellement"
        return f"{self.start_date} - {self.end_date}" if self.end_date else self.start_date
    
    def get_missions_list(self):
        """Return missions as a list."""
        if not self.missions:
            return []
        
        # Split by newline or bullet points
        missions = self.missions.replace('\n', '|').replace('•', '|').replace('-', '|').split('|')
        return [mission.strip() for mission in missions if mission.strip()]
    
    def get_achievements_list(self):
        """Return achievements as a list."""
        if not self.achievements:
            return []
        
        achievements = self.achievements.replace('\n', '|').replace('•', '|').replace('-', '|').split('|')
        return [achievement.strip() for achievement in achievements if achievement.strip()]
    
    def get_technologies_list(self):
        """Return technologies as a list."""
        if not self.technologies:
            return []
        
        technologies = self.technologies.replace('\n', ',').split(',')
        return [tech.strip() for tech in technologies if tech.strip()]


class Training(BaseModel, VisibilityMixin, OwnedModel):
    """
    Complementary training model.
    
    Represents additional training, courses, workshops, bootcamps.
    """
    
    # ===== INFORMATIONS DE LA FORMATION =====
    
    title = models.CharField(
        max_length=255,
        verbose_name='Titre de la formation',
        help_text='Ex: Bootcamp React Avancé'
    )
    
    organization = models.CharField(
        max_length=200,
        verbose_name='Organisme',
        help_text='Organisation ou plateforme proposant la formation'
    )
    
    training_type = models.CharField(
        max_length=20,
        choices=TrainingType.choices,
        default=TrainingType.EN_LIGNE,
        verbose_name='Type de formation',
        help_text='En ligne, Présentiel, Hybride'
    )
    
    url = models.URLField(
        blank=True,
        verbose_name='URL de la formation',
        help_text='Lien vers la page de la formation'
    )
    
    # ===== PÉRIODE =====
    
    start_date = models.CharField(
        max_length=7,
        verbose_name='Date de début',
        help_text='Format: YYYY-MM'
    )
    
    end_date = models.CharField(
        max_length=7,
        blank=True,
        verbose_name='Date de fin',
        help_text='Format: YYYY-MM. Laisser vide si en cours'
    )
    
    is_ongoing = models.BooleanField(
        default=False,
        verbose_name='Formation en cours',
        help_text='Cocher si la formation est toujours en cours'
    )
    
    duration_hours = models.PositiveIntegerField(
        blank=True,
        null=True,
        verbose_name='Durée (heures)',
        help_text='Durée totale de la formation en heures'
    )
    
    # ===== CONTENU =====
    
    description = models.TextField(
        verbose_name='Description',
        help_text='Description du contenu de la formation'
    )
    
    skills_acquired = models.TextField(
        blank=True,
        verbose_name='Compétences acquises',
        help_text='Liste des compétences acquises (une par ligne ou séparées par des virgules)'
    )
    
    # ===== CERTIFICATION =====
    
    has_certificate = models.BooleanField(
        default=False,
        verbose_name='Certificat obtenu',
        help_text='Cocher si un certificat a été délivré'
    )
    
    certificate_url = models.URLField(
        blank=True,
        verbose_name='URL du certificat',
        help_text='Lien vers le certificat en ligne (si disponible)'
    )
    
    # ===== ORDRE D'AFFICHAGE =====
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Formation complémentaire'
        verbose_name_plural = 'Formations complémentaires'
        ordering = ['display_order', '-start_date']
        db_table = 'professional_training'
    
    def __str__(self):
        return f"{self.title} - {self.organization}"
    
    def get_duration_display(self):
        """Return formatted duration string."""
        if self.is_ongoing:
            return f"{self.start_date} - En cours"
        return f"{self.start_date} - {self.end_date}" if self.end_date else self.start_date
    
    def get_skills_list(self):
        """Return skills as a list."""
        if not self.skills_acquired:
            return []
        
        skills = self.skills_acquired.replace('\n', ',').split(',')
        return [skill.strip() for skill in skills if skill.strip()]