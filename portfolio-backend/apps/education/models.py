"""
Models for diplomas and certifications
"""
from django.db import models
from django.conf import settings
from django.core.validators import URLValidator

from apps.core.models import BaseModel, VisibilityMixin, OwnedModel
from apps.core.enums import Visibility, DiplomaLevel


class Diploma(BaseModel, VisibilityMixin, OwnedModel):
    """
    Academic diploma model.
    
    Represents educational qualifications (degrees, diplomas).
    Supports visibility control and proof attachments.
    """
    
    # ===== INFORMATIONS DU DIPLÔME =====
    
    title = models.CharField(
        max_length=255,
        verbose_name='Intitulé du diplôme',
        help_text='Ex: Master en Intelligence Artificielle'
    )
    
    institution = models.CharField(
        max_length=255,
        verbose_name='Établissement',
        help_text='Nom de l\'université ou école'
    )
    
    level = models.CharField(
        max_length=20,
        choices=DiplomaLevel.choices,
        verbose_name='Niveau',
        help_text='Niveau du diplôme'
    )
    
    field = models.CharField(
        max_length=200,
        verbose_name='Domaine d\'étude',
        help_text='Ex: Informatique, Data Science, etc.'
    )
    
    # ===== PÉRIODE =====
    
    start_date = models.CharField(
        max_length=7,
        verbose_name='Date de début',
        help_text='Format: YYYY-MM (ex: 2020-09)'
    )
    
    end_date = models.CharField(
        max_length=7,
        verbose_name='Date de fin',
        help_text='Format: YYYY-MM (ex: 2022-06)'
    )
    
    # ===== DÉTAILS =====
    
    honors = models.CharField(
        max_length=100,
        blank=True,
        verbose_name='Mention',
        help_text='Ex: Très Bien, Bien, Assez Bien'
    )
    
    description = models.TextField(
        blank=True,
        verbose_name='Description',
        help_text='Description détaillée du cursus et des compétences acquises'
    )
    
    grade = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Note/GPA',
        help_text='Note finale ou GPA (optionnel)'
    )
    
    # ===== ORDRE D'AFFICHAGE =====
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Diplôme'
        verbose_name_plural = 'Diplômes'
        ordering = ['display_order', '-end_date']
        db_table = 'education_diploma'
    
    def __str__(self):
        return f"{self.title} - {self.institution}"
    
    def get_duration_display(self):
        """Return formatted duration string."""
        return f"{self.start_date} - {self.end_date}"


class Certification(BaseModel, VisibilityMixin, OwnedModel):
    """
    Professional certification model.
    
    Represents professional certifications and courses.
    Includes verification links and expiration dates.
    """
    
    # ===== INFORMATIONS DE LA CERTIFICATION =====
    
    name = models.CharField(
        max_length=255,
        verbose_name='Nom de la certification',
        help_text='Ex: AWS Certified Solutions Architect'
    )
    
    organization = models.CharField(
        max_length=255,
        verbose_name='Organisme',
        help_text='Organisation délivrant la certification'
    )
    
    platform = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Plateforme',
        help_text='Ex: Coursera, Udemy, LinkedIn Learning, etc.'
    )
    
    # ===== DATES =====
    
    issue_date = models.DateField(
        verbose_name='Date d\'obtention',
        help_text='Date à laquelle la certification a été obtenue'
    )
    
    expiration_date = models.DateField(
        blank=True,
        null=True,
        verbose_name='Date d\'expiration',
        help_text='Date d\'expiration (si applicable)'
    )
    
    does_not_expire = models.BooleanField(
        default=False,
        verbose_name='Sans expiration',
        help_text='Cocher si la certification n\'expire jamais'
    )
    
    # ===== VÉRIFICATION =====
    
    credential_id = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='ID de certification',
        help_text='Identifiant unique de la certification'
    )
    
    credential_url = models.URLField(
        blank=True,
        verbose_name='URL de vérification',
        help_text='Lien pour vérifier la certification en ligne'
    )
    
    # ===== DÉTAILS =====
    
    description = models.TextField(
        blank=True,
        verbose_name='Description',
        help_text='Description des compétences acquises'
    )
    
    skills_acquired = models.TextField(
        blank=True,
        verbose_name='Compétences acquises',
        help_text='Liste des compétences obtenues (une par ligne ou séparées par des virgules)'
    )
    
    # ===== ORDRE D'AFFICHAGE =====
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Certification'
        verbose_name_plural = 'Certifications'
        ordering = ['display_order', '-issue_date']
        db_table = 'education_certification'
    
    def __str__(self):
        return f"{self.name} - {self.organization}"
    
    def is_expired(self):
        """Check if the certification is expired."""
        if self.does_not_expire or not self.expiration_date:
            return False
        
        from django.utils import timezone
        return self.expiration_date < timezone.now().date()
    
    def get_status(self):
        """Get certification status (Active, Expired, No Expiration)."""
        if self.does_not_expire:
            return 'Valide indéfiniment'
        
        if not self.expiration_date:
            return 'Sans expiration définie'
        
        if self.is_expired():
            return 'Expirée'
        
        return 'Active'
    
    def get_skills_list(self):
        """Return skills as a list."""
        if not self.skills_acquired:
            return []
        
        # Split by comma or newline
        skills = self.skills_acquired.replace('\n', ',').split(',')
        return [skill.strip() for skill in skills if skill.strip()]