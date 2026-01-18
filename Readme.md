# 🏗️ BACKEND DJANGO - ARCHITECTURE & DÉMARRAGE


## 📋 VISION D'ENSEMBLE

🗂️ Architecture (apps Django)
portfolio_backend/
├── config/                      # Configuration Django principale
│   ├── settings/
│   │   ├── base.py             # Settings communs
│   │   ├── development.py      # Settings dev
│   │   └── production.py       # Settings prod
│   ├── urls.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/               # 🔐 Gestion utilisateurs & authentification
│   │   ├── models.py           # User personnalisé
│   │   ├── serializers.py
│   │   ├── views.py            # Login, logout, refresh token
│   │   └── permissions.py
│   │
│   ├── core/                   # 🎯 Modèles et utils partagés
│   │   ├── models.py           # BaseModel, VisibilityMixin
│   │   ├── permissions.py      # Permissions réutilisables
│   │   ├── enums.py           # Enums (Visibility, etc.)
│   │   └── utils.py
│   │
│   ├── profiles/               # 👤 Profil utilisateur
│   │   ├── models.py           # Profile (one-to-one avec User)
│   │   ├── serializers.py
│   │   └── views.py
│   │
│   ├── education/              # 🎓 Diplômes & Certifications
│   │   ├── models.py           # Diploma, Certification
│   │   ├── serializers.py
│   │   └── views.py
│   │
│   ├── professional/           # 💼 Expériences & Formations
│   │   ├── models.py           # Experience, Training
│   │   ├── serializers.py
│   │   └── views.py
│   │
│   ├── projects/               # 🚀 Projets portfolio
│   │   ├── models.py           # Project
│   │   ├── serializers.py
│   │   └── views.py
│   │
│   ├── skills/                 # 🛠️ Compétences
│   │   ├── models.py           # Skill
│   │   ├── serializers.py
│   │   └── views.py
│   │
│   ├── proofs/                 # 📁 Preuves (fichiers)
│   │   ├── models.py           # Proof (polymorphique)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── storage.py          # Stockage sécurisé
│   │
│   └── recruiter_access/       # 🔗 Liens recruteur temporaires
│       ├── models.py           # RecruiterLink
│       ├── serializers.py
│       ├── views.py
│       └── permissions.py      # Validation token recruteur
│
├── media/                      # Fichiers uploadés (local dev)
├── static/                     # Fichiers statiques
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── manage.py

🎯 ORDRE D'IMPLÉMENTATION
Voici l'ordre logique pour construire le backend étape par étape :
Phase 1 : Fondations (Jours 1-3)

✅ Setup initial : Configuration Django + DRF + JWT
✅ App core : Modèles de base, mixins, enums, permissions
✅ App accounts : User personnalisé + authentification JWT

Phase 2 : Données métier (Jours 4-8)

✅ App profiles : Profil utilisateur
✅ App education : Diplômes + Certifications
✅ App professional : Expériences + Formations
✅ App projects : Projets portfolio
✅ App skills : Compétences (avec relations M2M)

Phase 3 : Fonctionnalités avancées (Jours 9-12)

✅ App proofs : Système de preuves polymorphique + upload sécurisé
✅ App recruiter_access : Génération de liens temporaires
✅ Endpoints publics : Portfolio public (GET seul)
✅ Tests & documentation : Swagger + tests API



🎯 APP core - FONDATIONS DU BACKEND

📚 RÔLE DE L'APP core
L'app core centralise tout ce qui est partagé entre les autres apps :

Modèles de base : BaseModel avec UUID, timestamps
Mixins : VisibilityMixin pour gérer Public/Recruteur/Privé
Enums : Choix constants (Visibility, DiplomaLevel, etc.)
Permissions : Permissions réutilisables DRF
Exceptions : Gestionnaire d'erreurs API personnalisé
Utils : Fonctions utilitaires


📁 STRUCTURE DE L'APP core
apps/core/
├── __init__.py
├── apps.py
├── admin.py
├── models.py           # BaseModel, VisibilityMixin
├── enums.py            # Enums (Visibility, etc.)
├── permissions.py      # Permissions DRF
├── exceptions.py       # Gestionnaire d'exceptions
├── serializers.py      # Serializers de base
├── utils.py            # Fonctions utilitaires
└── migrations/
    └── __init__.py



🔐 APP accounts - AUTHENTIFICATION JWT
L'app accounts qui gère l'authentification et les utilisateurs.

📚 RÔLE DE L'APP accounts
L'app accounts gère :

Modèle User (déjà créé, on va l'améliorer)
Authentification JWT (login, logout, refresh token)
Gestion du profil utilisateur (changement de mot de passe)
Endpoints API pour l'authentification


📁 STRUCTURE DE L'APP accounts
apps/accounts/
├── __init__.py
├── apps.py
├── models.py              # User model (déjà créé)
├── serializers.py         # Auth serializers
├── views.py               # Auth views
├── urls.py                # Auth endpoints
├── admin.py               # Admin configuration
├── permissions.py         # Permissions spécifiques
└── migrations/
    ├── __init__.py
    └── 0001_initial.py



👤 APP profiles - PROFIL PORTFOLIO
L'app profiles gère le profil portfolio professionnel de l'utilisateur.

📚 RÔLE DE L'APP profiles
L'app profiles gère :

Informations du profil (photo, titre, bio, localisation)
Liens externes (GitHub, LinkedIn, portfolio, réseaux sociaux)
Disponibilité (recherche stage, emploi, freelance)
Coordonnées (email professionnel, téléphone)
Relation One-to-One avec le modèle User


📁 STRUCTURE DE L'APP profiles
apps/profiles/
├── __init__.py
├── apps.py
├── models.py              # Profile model
├── serializers.py         # Profile serializers
├── views.py               # Profile views
├── urls.py                # Profile endpoints
├── admin.py               # Admin configuration
├── signals.py             # Auto-création du profil
└── migrations/
    └── __init__.py


🎓 APP education - DIPLÔMES & CERTIFICATIONS

📚 RÔLE DE L'APP education
L'app education gère :

Diplômes (Licence, Master, Doctorat, etc.)
Certifications (certifications professionnelles)
Système de visibilité (Public, Recruteur, Privé)
Preuves associées (diplômes scannés, certificats - on les gérera dans l'app proofs)


📁 STRUCTURE DE L'APP education
apps/education/
├── __init__.py
├── apps.py
├── models.py              # Diploma, Certification
├── serializers.py         # Serializers
├── views.py               # CRUD views
├── urls.py                # Education endpoints
├── admin.py               # Admin configuration
└── migrations/
    └── __init__.py



💼 APP professional - EXPÉRIENCES & FORMATIONS
L'app professional gère les expériences professionnelles et les formations complémentaires.

📚 RÔLE DE L'APP professional
L'app professional gère :

Expériences professionnelles (stages, emplois, freelance, alternance)
Formations complémentaires (cours en ligne, ateliers, bootcamps)
Système de visibilité (Public, Recruteur, Privé)
Preuves associées (attestations, lettres de recommandation)


📁 STRUCTURE DE L'APP professional
apps/professional/
├── __init__.py
├── apps.py
├── models.py              # Experience, Training
├── serializers.py         # Serializers
├── views.py               # CRUD views
├── urls.py                # Professional endpoints
├── admin.py               # Admin configuration
└── migrations/
    └── __init__.py



🚀 APP projects - PROJETS PORTFOLIO
L'app projects gère les projets du portfolio (académiques, personnels, professionnels).

📚 RÔLE DE L'APP projects
L'app projects gère :

Projets (académiques, personnels, professionnels)
Détails techniques (technologies, fonctionnalités, défis)
Liens (GitHub, démo, vidéo)
Système de visibilité (Public, Recruteur, Privé)
Preuves associées (captures d'écran, vidéos, rapports)


📁 STRUCTURE DE L'APP projects
apps/projects/
├── __init__.py
├── apps.py
├── models.py              # Project
├── serializers.py         # Serializers
├── views.py               # CRUD views
├── urls.py                # Projects endpoints
├── admin.py               # Admin configuration
└── migrations/
    └── __init__.py



🛠️ APP skills - COMPÉTENCES PORTFOLIO

L'app skills gère les compétences avec des relations Many-to-Many vers les projets, certifications et formations.
📚 RÔLE DE L'APP skills
L'app skills gère :

Compétences (langages, frameworks, outils, soft skills)
Catégorisation (par type de compétence)
Niveau de maîtrise (débutant, intermédiaire, avancé, expert)
Relations M2M avec projets, certifications, formations
Justification des compétences

📁 STRUCTURE DE L'APP skillsapps/skills/
├── __init__.py
├── apps.py
├── models.py              # Skill
├── serializers.py         # Serializers
├── views.py               # CRUD views
├── urls.py                # Skills endpoints
├── admin.py               # Admin configuration
└── migrations/
    └── __init__.py


📁 APP proofs - SYSTÈME DE PREUVES POLYMORPHIQUE
L'app proofs gère le système de preuves (fichiers attachés aux diplômes, certifications, projets, etc.).

📚 RÔLE DE L'APP proofs
L'app proofs gère :

Upload sécurisé de fichiers (images, vidéos, PDF, documents)
Relations polymorphiques (une preuve peut être liée à n'importe quel modèle)
Gestion de la visibilité (Public, Recruteur, Privé)
Validation des fichiers (taille, format)
URLs sécurisées pour les fichiers sensibles


📁 STRUCTURE DE L'APP proofs
apps/proofs/
├── __init__.py
├── apps.py
├── models.py              # Proof (polymorphic)
├── serializers.py         # Serializers
├── views.py               # Upload/Delete views
├── urls.py                # Proofs endpoints
├── admin.py               # Admin configuration
├── validators.py          # File validators
└── migrations/
    └── __init__.py




🔗 APP recruiter_access - LIENS RECRUTEUR TEMPORAIRES

La dernière app : recruiter_access gère les liens temporaires sécurisés pour les recruteurs.

📚 RÔLE DE L'APP recruiter_access
L'app recruiter_access gère :

Génération de liens sécurisés avec tokens uniques
Expiration temporaire (durée configurable)
Révocation manuelle des liens
Validation côté backend des tokens
Tracking des accès (optionnel)
📁 STRUCTURE DE L'APP recruiter_accessapps/recruiter_access/
├── __init__.py
├── apps.py
├── models.py              # RecruiterLink
├── serializers.py         # Serializers
├── views.py               # Generate/Revoke views
├── urls.py                # Recruiter endpoints
├── admin.py               # Admin configuration
├── utils.py               # Token validation
└── migrations/
    └── __init__.py