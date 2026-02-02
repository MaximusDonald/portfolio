"""
Models for portfolio projects
"""
from django.db import models
from django.conf import settings
from django.core.validators import URLValidator

from apps.core.models import BaseModel, VisibilityMixin, OwnedModel
from apps.core.enums import Visibility, ProjectType, ProjectStatus


class Project(BaseModel, VisibilityMixin, OwnedModel):
    """
    Portfolio project model.
    
    Represents projects (academic, personal, professional).
    Includes technical details, links, and achievements.
    """
    
    # ===== INFORMATIONS GÉNÉRALES =====
    
    title = models.CharField(
        max_length=255,
        verbose_name='Titre du projet',
        help_text='Nom du projet'
    )
    
    short_description = models.CharField(
        max_length=300,
        verbose_name='Description courte',
        help_text='Résumé en une phrase (300 caractères max)'
    )
    
    description = models.TextField(
        verbose_name='Description détaillée',
        help_text='Description complète du projet, contexte et objectifs'
    )
    
    project_type = models.CharField(
        max_length=20,
        choices=ProjectType.choices,
        default=ProjectType.PERSONNEL,
        verbose_name='Type de projet',
        help_text='Académique, Personnel, Professionnel'
    )
    
    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.EN_COURS,
        verbose_name='Statut',
        help_text='En cours, Terminé, Archivé'
    )
    
    # ===== RÔLE ET ÉQUIPE =====
    
    role = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Rôle occupé',
        help_text='Ex: Développeur Full-Stack, Lead Developer, etc.'
    )
    
    team_size = models.PositiveIntegerField(
        blank=True,
        null=True,
        default=1,
        verbose_name='Taille de l\'équipe',
        help_text='Nombre de personnes dans l\'équipe (laisser vide si projet solo)'
    )
    
    organization = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Organisation',
        help_text='Entreprise, université ou organisation (si applicable)'
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
    
    # ===== ASPECTS TECHNIQUES =====
    
    technologies = models.TextField(
        verbose_name='Technologies utilisées',
        help_text='Liste des technologies, langages, frameworks (séparés par des virgules)'
    )
    
    key_features = models.TextField(
        verbose_name='Fonctionnalités clés',
        help_text='Liste des principales fonctionnalités (une par ligne)'
    )
    
    challenges = models.TextField(
        blank=True,
        verbose_name='Défis rencontrés',
        help_text='Difficultés techniques rencontrées et comment elles ont été surmontées'
    )
    
    solutions = models.TextField(
        blank=True,
        verbose_name='Solutions apportées',
        help_text='Solutions techniques mises en place'
    )
    
    # ===== RÉSULTATS =====
    
    achievements = models.TextField(
        blank=True,
        verbose_name='Réalisations/Résultats',
        help_text='Résultats obtenus, impact du projet (chiffrés si possible)'
    )
    
    learning_outcomes = models.TextField(
        blank=True,
        verbose_name='Compétences acquises',
        help_text='Ce que ce projet vous a permis d\'apprendre'
    )
    
    # ===== LIENS =====
    
    github_url = models.URLField(
        blank=True,
        verbose_name='GitHub',
        help_text='Lien vers le repository GitHub'
    )
    
    demo_url = models.URLField(
        blank=True,
        verbose_name='Démo en ligne',
        help_text='Lien vers la démo/application en ligne'
    )
    
    video_url = models.URLField(
        blank=True,
        verbose_name='Vidéo de présentation',
        help_text='Lien vers une vidéo de démonstration (YouTube, Vimeo, etc.)'
    )
    
    documentation_url = models.URLField(
        blank=True,
        verbose_name='Documentation',
        help_text='Lien vers la documentation du projet'
    )
    
    # ===== IMAGE DE COUVERTURE =====
    
    cover_image = models.ImageField(
        upload_to='projects/covers/',
        blank=True,
        null=True,
        verbose_name='Image de couverture',
        help_text='Image principale du projet (1200x630px recommandé)'
    )
    
    # ===== MISE EN AVANT =====
    
    is_featured = models.BooleanField(
        default=False,
        verbose_name='Projet mis en avant',
        help_text='Cocher pour mettre ce projet en avant sur le portfolio'
    )

    is_published = models.BooleanField(
        default=True,
        verbose_name='Publié',
        help_text='Si désactivé, le contenu reste en brouillon et n\'apparaît pas publiquement.'
    )
    
    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name='Ordre d\'affichage',
        help_text='Ordre d\'affichage (0 = premier)'
    )
    
    class Meta:
        verbose_name = 'Projet'
        verbose_name_plural = 'Projets'
        ordering = ['display_order', '-start_date']
        db_table = 'projects_project'
    
    def __str__(self):
        return self.title
    
    def get_duration_display(self):
        """Return formatted duration string."""
        if not self.end_date or self.status == ProjectStatus.EN_COURS:
            return f"{self.start_date} - En cours"
        return f"{self.start_date} - {self.end_date}"
    
    def get_technologies_list(self):
        """Return technologies as a list."""
        if not self.technologies:
            return []
        
        technologies = self.technologies.replace('\n', ',').split(',')
        return [tech.strip() for tech in technologies if tech.strip()]
    
    def get_features_list(self):
        """Return features as a list."""
        if not self.key_features:
            return []
        
        features = self.key_features.replace('\n', '|').replace('•', '|').replace('-', '|').split('|')
        return [feature.strip() for feature in features if feature.strip()]
    
    def get_achievements_list(self):
        """Return achievements as a list."""
        if not self.achievements:
            return []
        
        achievements = self.achievements.replace('\n', '|').replace('•', '|').replace('-', '|').split('|')
        return [achievement.strip() for achievement in achievements if achievement.strip()]
    
    @property
    def has_links(self):
        """Check if project has at least one link."""
        return any([self.github_url, self.demo_url, self.video_url, self.documentation_url])