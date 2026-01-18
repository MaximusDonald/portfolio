"""
Enums and constant choices for the application
"""
from django.db import models


class Visibility(models.TextChoices):
    """
    Visibility levels for content.
    
    - PUBLIC: Accessible to everyone
    - RECRUTEUR: Accessible only via recruiter link
    - PRIVE: Accessible only to the owner
    """
    PUBLIC = 'Public', 'Public'
    RECRUTEUR = 'Recruteur', 'Recruteur'
    PRIVE = 'Prive', 'Privé'


class DiplomaLevel(models.TextChoices):
    """
    Academic diploma levels
    """
    BTS = 'BTS', 'BTS'
    DUT = 'DUT', 'DUT'
    LICENCE = 'Licence', 'Licence'
    LICENCE_PRO = 'Licence_Pro', 'Licence Professionnelle'
    MASTER = 'Master', 'Master'
    MASTER_PRO = 'Master_Pro', 'Master Professionnel'
    INGENIEUR = 'Ingenieur', 'Ingénieur'
    DOCTORAT = 'Doctorat', 'Doctorat'
    AUTRE = 'Autre', 'Autre'


class ProjectType(models.TextChoices):
    """
    Types of projects
    """
    ACADEMIQUE = 'Academique', 'Académique'
    PERSONNEL = 'Personnel', 'Personnel'
    PROFESSIONNEL = 'Professionnel', 'Professionnel'


class ProjectStatus(models.TextChoices):
    """
    Status of projects
    """
    EN_COURS = 'En_cours', 'En cours'
    TERMINE = 'Termine', 'Terminé'
    ARCHIVE = 'Archive', 'Archivé'


class SkillCategory(models.TextChoices):
    """
    Categories of skills
    """
    LANGAGE = 'Langage', 'Langage de programmation'
    FRAMEWORK = 'Framework', 'Framework'
    OUTIL = 'Outil', 'Outil'
    SOFT_SKILL = 'Soft_Skill', 'Compétence transversale'
    AUTRE = 'Autre', 'Autre'


class SkillLevel(models.TextChoices):
    """
    Skill proficiency levels
    """
    DEBUTANT = 'Debutant', 'Débutant'
    INTERMEDIAIRE = 'Intermediaire', 'Intermédiaire'
    AVANCE = 'Avance', 'Avancé'
    EXPERT = 'Expert', 'Expert'


class ExperienceType(models.TextChoices):
    """
    Types of professional experiences
    """
    STAGE = 'Stage', 'Stage'
    EMPLOI = 'Emploi', 'Emploi'
    FREELANCE = 'Freelance', 'Freelance'
    ALTERNANCE = 'Alternance', 'Alternance'
    BENEVOLAT = 'Benevolat', 'Bénévolat'


class TrainingType(models.TextChoices):
    """
    Types of training/formations
    """
    EN_LIGNE = 'En_ligne', 'En ligne'
    PRESENTIEL = 'Presentiel', 'Présentiel'
    HYBRIDE = 'Hybride', 'Hybride'


class ProofType(models.TextChoices):
    """
    Types of proof files
    """
    IMAGE = 'image', 'Image'
    VIDEO = 'video', 'Vidéo'
    PDF = 'pdf', 'PDF'
    DOCUMENT = 'document', 'Document'