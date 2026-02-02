"""
Views for Profile management
"""
from django.db import transaction
from django.utils import timezone
import datetime
from rest_framework import generics, status, serializers as s
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import Profile
from .serializers import (
    ProfileSerializer,
    PublicProfileSerializer,
    ProfileUpdateSerializer
)

from apps.projects.models import Project
from apps.projects.serializers import ProjectSerializer

from apps.education.models import Diploma, Certification
from apps.education.serializers import DiplomaSerializer, CertificationSerializer

from apps.professional.models import Experience, Training
from apps.professional.serializers import ExperienceSerializer, TrainingSerializer

from apps.skills.models import Skill
from apps.skills.serializers import SkillSerializer


class MyProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update the authenticated user's profile.
    
    GET /api/profile/me/
    PATCH /api/profile/me/
    PUT /api/profile/me/
    """
    permission_classes = [IsAuthenticated]
    # Ajout de JSONParser pour les requêtes PATCH/PUT standard
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProfileSerializer
        return ProfileUpdateSerializer
    
    def get_object(self):
        """Get the profile of the authenticated user."""
        return self.request.user.profile


class PortfolioExportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile

        projects = Project.objects.filter(user=request.user).order_by('display_order', '-start_date')
        skills = Skill.objects.filter(user=request.user).order_by('display_order', 'category', 'name')
        diplomas = Diploma.objects.filter(user=request.user).order_by('display_order', '-end_date')
        certifications = Certification.objects.filter(user=request.user).order_by('display_order', '-issue_date')
        experiences = Experience.objects.filter(user=request.user).order_by('display_order', '-start_date')
        trainings = Training.objects.filter(user=request.user).order_by('display_order', '-start_date')

        return Response({
            'schema_version': 1,
            'exported_at': timezone.now().isoformat(),
            'profile': ProfileSerializer(profile).data,
            'projects': ProjectSerializer(projects, many=True).data,
            'skills': SkillSerializer(skills, many=True).data,
            'diplomas': DiplomaSerializer(diplomas, many=True).data,
            'certifications': CertificationSerializer(certifications, many=True).data,
            'experiences': ExperienceSerializer(experiences, many=True).data,
            'trainings': TrainingSerializer(trainings, many=True).data,
        }, status=status.HTTP_200_OK)


class PortfolioImportView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request):
        payload = request.data or {}

        import_mode = request.query_params.get('mode') or payload.get('import_mode') or 'merge'
        if import_mode not in ('merge', 'replace'):
            return Response(
                {'error': 'import_mode invalide (valeurs: merge, replace)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if payload.get('schema_version') != 1:
            return Response(
                {'error': 'schema_version invalide ou non supporté'},
                status=status.HTTP_400_BAD_REQUEST
            )

        def _pick(data: dict, allowed: list[str]):
            return {k: data.get(k) for k in allowed if k in data}

        def _parse_date(value):
            if not value:
                return None
            if isinstance(value, datetime.date):
                return value
            if isinstance(value, str):
                try:
                    return datetime.date.fromisoformat(value)
                except ValueError:
                    return value
            return value

        profile_allowed = [
            'portfolio_slug',
            'professional_title',
            'bio',
            'tagline',
            'professional_email',
            'phone',
            'location',
            'website_url',
            'github_url',
            'linkedin_url',
            'twitter_url',
            'availability',
            'availability_date',
            'show_email',
            'show_phone',
            'show_location',
            'public_template',
            'empty_about_text',
            'empty_skills_text',
            'empty_experience_text',
            'empty_projects_text',
            'empty_education_text',
            'trait_1_title', 'trait_1_description',
            'trait_2_title', 'trait_2_description',
            'trait_3_title', 'trait_3_description',
        ]

        project_allowed = [
            'title', 'short_description', 'description', 'project_type', 'status',
            'role', 'team_size', 'organization', 'start_date', 'end_date',
            'technologies', 'key_features', 'challenges', 'solutions',
            'achievements', 'learning_outcomes',
            'github_url', 'demo_url', 'video_url', 'documentation_url',
            'is_featured', 'is_published', 'visibility', 'display_order',
        ]

        diploma_allowed = [
            'title', 'institution', 'level', 'field',
            'start_date', 'end_date',
            'honors', 'description', 'grade',
            'visibility', 'display_order', 'is_published',
        ]

        certification_allowed = [
            'name', 'organization', 'platform',
            'issue_date', 'expiration_date', 'does_not_expire',
            'credential_id', 'credential_url',
            'description', 'skills_acquired',
            'visibility', 'display_order', 'is_published',
        ]

        experience_allowed = [
            'position', 'company', 'company_url', 'location',
            'experience_type', 'start_date', 'end_date', 'is_current',
            'description', 'missions', 'achievements', 'technologies',
            'visibility', 'display_order', 'is_published',
        ]

        training_allowed = [
            'title', 'organization', 'training_type', 'url',
            'start_date', 'end_date', 'is_ongoing', 'duration_hours',
            'description', 'skills_acquired',
            'has_certificate', 'certificate_url',
            'visibility', 'display_order', 'is_published',
        ]

        skill_allowed = [
            'name', 'category', 'level', 'description', 'years_of_experience',
            'is_primary', 'display_order',
        ]

        with transaction.atomic():
            if import_mode == 'replace':
                # Purge totale du contenu portfolio (ne supprime pas le compte ni le Profile)
                # On supprime d'abord les skills pour éviter des effets de bord sur les M2M.
                Skill.objects.filter(user=request.user).delete()
                Project.objects.filter(user=request.user).delete()
                Diploma.objects.filter(user=request.user).delete()
                Certification.objects.filter(user=request.user).delete()
                Experience.objects.filter(user=request.user).delete()
                Training.objects.filter(user=request.user).delete()

            # Profile
            profile_data = payload.get('profile') or {}
            profile_update = _pick(profile_data, profile_allowed)
            if 'availability_date' in profile_update:
                profile_update['availability_date'] = _parse_date(profile_update.get('availability_date'))
            Profile.objects.filter(pk=request.user.profile.pk).update(**profile_update)

            # Projects
            for item in payload.get('projects') or []:
                item_id = item.get('id')
                defaults = _pick(item, project_allowed)
                if item_id:
                    Project.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Project.objects.create(user=request.user, **defaults)

            # Education
            for item in payload.get('diplomas') or []:
                item_id = item.get('id')
                defaults = _pick(item, diploma_allowed)
                if item_id:
                    Diploma.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Diploma.objects.create(user=request.user, **defaults)

            for item in payload.get('certifications') or []:
                item_id = item.get('id')
                defaults = _pick(item, certification_allowed)
                if 'issue_date' in defaults:
                    defaults['issue_date'] = _parse_date(defaults.get('issue_date'))
                if 'expiration_date' in defaults:
                    defaults['expiration_date'] = _parse_date(defaults.get('expiration_date'))
                if item_id:
                    Certification.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Certification.objects.create(user=request.user, **defaults)

            # Professional
            for item in payload.get('experiences') or []:
                item_id = item.get('id')
                defaults = _pick(item, experience_allowed)
                if item_id:
                    Experience.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Experience.objects.create(user=request.user, **defaults)

            for item in payload.get('trainings') or []:
                item_id = item.get('id')
                defaults = _pick(item, training_allowed)
                if item_id:
                    Training.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Training.objects.create(user=request.user, **defaults)

            # Skills (create/update first, then set M2M)
            skills_payload = payload.get('skills') or []
            for item in skills_payload:
                item_id = item.get('id')
                defaults = _pick(item, skill_allowed)
                if item_id:
                    Skill.objects.update_or_create(id=item_id, user=request.user, defaults=defaults)
                else:
                    Skill.objects.create(user=request.user, **defaults)

            # restore M2M relationships for skills
            for item in skills_payload:
                skill_id = item.get('id')
                if not skill_id:
                    continue
                try:
                    skill = Skill.objects.get(id=skill_id, user=request.user)
                except Skill.DoesNotExist:
                    continue

                project_ids = item.get('related_projects') or []
                cert_ids = item.get('related_certifications') or []
                training_ids = item.get('related_trainings') or []

                skill.related_projects.set(Project.objects.filter(user=request.user, id__in=project_ids))
                skill.related_certifications.set(Certification.objects.filter(user=request.user, id__in=cert_ids))
                skill.related_trainings.set(Training.objects.filter(user=request.user, id__in=training_ids))

        return Response({'message': 'Import terminé', 'import_mode': import_mode}, status=status.HTTP_200_OK)


class PublicProfileView(generics.RetrieveAPIView):
    """
    View to retrieve a public profile by user ID.
    
    GET /api/profile/public/{user_id}/
    """
    permission_classes = [AllowAny]
    serializer_class = PublicProfileSerializer
    lookup_field = 'user__id'
    lookup_url_kwarg = 'user_id'
    
    def get_queryset(self):
        return Profile.objects.select_related('user').all()
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view counter."""
        instance = self.get_object()
        
        # Increment views (only for non-owner requests)
        if not request.user.is_authenticated or request.user != instance.user:
            instance.increment_views()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# ========== PUBLIC PROFILE BY SLUG - AVEC SCHEMA ==========
class PublicProfileBySlugView(generics.RetrieveAPIView):
    """
    Accès public à un portfolio via son slug
    GET /api/profile/public/slug/<str:slug>/
    """
    permission_classes = [AllowAny]
    serializer_class = PublicProfileSerializer
    lookup_field = 'portfolio_slug'
    lookup_url_kwarg = 'slug'
    
    def get_queryset(self):
        return Profile.objects.select_related('user').all()
    
    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view counter."""
        instance = self.get_object()
        
        # Optionnel : incrémenter un compteur de vues publiques
        # instance.increment_public_views()  # à implémenter si souhaité
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# ========== UPLOAD PROFILE PHOTO - AVEC SCHEMA ==========
class PhotoUploadResponseSerializer(s.Serializer):
    """Response for photo upload"""
    message = s.CharField()
    photo_url = s.URLField(allow_null=True)

@extend_schema(
    request={
        'multipart/form-data': {
            'type': 'object',
            'properties': {
                'photo': {
                    'type': 'string',
                    'format': 'binary',
                    'description': 'Image de profil (JPG, PNG, WEBP, max 5MB)'
                }
            }
        }
    },
    responses={
        200: PhotoUploadResponseSerializer,
        400: OpenApiResponse(description="Aucune photo fournie ou format invalide")
    },
    description="Upload d'une photo de profil"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_photo(request):
    """
    Upload profile photo endpoint.
    
    POST /api/profile/upload-photo/
    """
    profile = request.user.profile
    
    if 'photo' not in request.FILES:
        return Response(
            {'error': 'Aucune photo fournie'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Delete old photo if exists
    if profile.photo:
        profile.photo.delete(save=False)
    
    # Save new photo
    profile.photo = request.FILES['photo']
    profile.save()
    
    return Response({
        'message': 'Photo de profil mise à jour',
        'photo_url': request.build_absolute_uri(profile.photo.url) if profile.photo else None
    }, status=status.HTTP_200_OK)


# ========== DELETE PROFILE PHOTO - AVEC SCHEMA ==========
class PhotoDeleteResponseSerializer(s.Serializer):
    """Response for photo deletion"""
    message = s.CharField()

@extend_schema(
    request=None,
    responses={
        200: PhotoDeleteResponseSerializer,
        400: OpenApiResponse(description="Aucune photo à supprimer")
    },
    description="Suppression de la photo de profil"
)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_photo(request):
    """
    Delete profile photo endpoint.
    
    DELETE /api/profile/delete-photo/
    """
    profile = request.user.profile
    
    if not profile.photo:
        return Response(
            {'error': 'Aucune photo à supprimer'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    profile.photo.delete(save=True)
    
    return Response({
        'message': 'Photo de profil supprimée'
    }, status=status.HTTP_200_OK)


# ========== CHECK PROFILE COMPLETENESS - AVEC SCHEMA ==========
class ProfileCompletenessResponseSerializer(s.Serializer):
    """Response for profile completeness check"""
    is_complete = s.BooleanField()
    profile_views = s.IntegerField()

@extend_schema(
    request=None,
    responses={200: ProfileCompletenessResponseSerializer},
    description="Vérifier si le profil est complet"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_profile_completeness(request):
    """
    Check if the user's profile is complete.
    
    GET /api/profile/check-completeness/
    """
    profile = request.user.profile
    is_complete = profile.check_profile_completeness()
    
    return Response({
        'is_complete': is_complete,
        'profile_views': profile.profile_views
    }, status=status.HTTP_200_OK)


class DefaultProfileView(generics.RetrieveAPIView):
    """
    View to retrieve the default public profile (first found).
    Useful for single-user sites.
    """
    permission_classes = [AllowAny]
    serializer_class = PublicProfileSerializer
    
    def get_object(self):
        profile = Profile.objects.select_related('user').first()
        if not profile:
            from django.http import Http404
            raise Http404("Aucun profil configuré")
        
        # Increment views (only for non-owner/anonymous)
        request = self.request
        if not request.user.is_authenticated or request.user != profile.user:
            profile.increment_views()
            
        return profile