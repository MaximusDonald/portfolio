"""
Models for skills
"""
from django.db import models
from django.conf import settings

from apps.core.models import BaseModel, OwnedModel
from apps.core.enums import SkillCategory, SkillLevel


class Skill(BaseModel, OwnedModel):
    """
    Skill model.
    
    Represents technical and soft skills.
    Can be linked to projects, certifications, and training.
    """
    
    # ===== INFORMATIONS DE LA COMPÉTENCE =====
    
    name = models.CharField(
        max_length=100,
        verbose_name='Nom de la compétence',
        help_text='Ex: Python, React, Leadership, etc.'
    )
    
    category = models.CharField(
        max_length=20,
        choices=SkillCategory.choices,
        default=SkillCategory.LANGAGE,
        verbose_name='Catégorie',
        help_text='Type de compétence'
    )
    
    level = models.CharField(
        max_length=20,
        choices=SkillLevel.choices,
        default=SkillLevel.INTERMEDIAIRE,
        verbose_name='Niveau de maîtrise',
        help_text='Auto-évaluation du niveau'
    )
    
    # ===== DESCRIPTION =====
    
    description = models.TextField(
        blank=True,
        verbose_name='Description',
        help_text='Description de la compétence et contexte d\'utilisation'
    )
    
    # ===== ANNÉES D'EXPÉRIENCE =====
    
    years_of_experience = models.DecimalField(
        max_digits=4,
        decimal_places=1,
        blank=True,
        null=True,
        verbose_name='Années d\'expérience',
        help_text='Nombre d\'années d\'expérience avec cette compétence'
    )
    
    # ===== RELATIONS MANY-TO-MANY =====
    
    related_projects = models.ManyToManyField(
        'projects.Project',
        blank=True,
        related_name='skills',
        verbose_name='Projets associés',
        help_text='Projets dans lesquels cette compétence a été utilisée'
    )
    
    related_certifications = models.ManyToManyField(
        'education.Certification',
        blank=True,
        related_name='skills',
        verbose_name='Certifications associées',
        help_text='Certifications validant cette compétence'
    )
    
    related_trainings = models.ManyToManyField(
        'professional.Training',
        blank=True,
        related_name='skills',
        verbose_name='Formations associées',
        help_text='Formations où cette compétence a été acquise'
    )
    
    # ===== VISIBILITÉ =====
    
    is_primary = models.BooleanField(
        default=False,
        verbose_name='Compétence principale',
        help_text='Cocher pour les compétences principales à mettre en avant'
    )
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Compétence'
        verbose_name_plural = 'Compétences'
        ordering = ['display_order', 'category', 'name']
        unique_together = ['user', 'name']
        db_table = 'skills_skill'
    
    def __str__(self):
        return f"{self.name} ({self.get_level_display()})"
    
    def get_justifications_count(self):
        """Return the total number of justifications."""
        return (
            self.related_projects.count() +
            self.related_certifications.count() +
            self.related_trainings.count()
        )
    
    def get_justifications(self):
        """
        Return all justifications for this skill.
        
        Returns a dict with projects, certifications, and trainings.
        """
        return {
            'projects': list(self.related_projects.values('id', 'title')),
            'certifications': list(self.related_certifications.values('id', 'name')),
            'trainings': list(self.related_trainings.values('id', 'title'))
        }
    
    def has_justifications(self):
        """Check if skill has at least one justification."""
        return self.get_justifications_count() > 0