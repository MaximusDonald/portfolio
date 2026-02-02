"""
Views for authentication and user management
"""
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import serializers as s
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
    UpdateUserSerializer,
    DeleteAccountSerializer
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns user information along with tokens.
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    View for user registration.
    
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Compte créé avec succès'
        }, status=status.HTTP_201_CREATED)



class LogoutRequestSerializer(s.Serializer):
    """Serializer for logout request"""
    refresh = s.CharField(help_text="Refresh token à blacklister")

class LogoutResponseSerializer(s.Serializer):
    """Serializer for logout response"""
    message = s.CharField()

@extend_schema(
    request=LogoutRequestSerializer,
    responses={
        200: LogoutResponseSerializer,
        400: OpenApiResponse(description="Token invalide ou manquant")
    },
    description="Déconnexion de l'utilisateur et blacklist du refresh token"
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """
    Logout view that blacklists the refresh token.
    
    POST /api/auth/logout/
    Body: { "refresh": "refresh_token" }
    """
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Le token de rafraîchissement est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response(
            {'message': 'Déconnexion réussie'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': 'Token invalide ou déjà révoqué'},
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    View to retrieve and update the authenticated user's profile.
    
    GET /api/auth/profile/
    PATCH /api/auth/profile/
    """
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserSerializer
        return UpdateUserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.UpdateAPIView):
    """
    View for changing user password.
    
    POST /api/auth/change-password/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(
            {'message': 'Mot de passe modifié avec succès'},
            status=status.HTTP_200_OK
        )


# ========== VERIFY TOKEN VIEW - AVEC SCHEMA ==========
class VerifyTokenResponseSerializer(s.Serializer):
    """Serializer for token verification response"""
    valid = s.BooleanField()
    user = UserSerializer()

@extend_schema(
    request=None,
    responses={200: VerifyTokenResponseSerializer},
    description="Vérifier la validité du token JWT"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_token_view(request):
    """
    View to verify if the access token is valid.
    
    GET /api/auth/verify/
    """
    return Response({
        'valid': True,
        'user': UserSerializer(request.user).data
    }, status=status.HTTP_200_OK)


class DeleteAccountRequestSerializer(s.Serializer):
    password = s.CharField(help_text="Mot de passe de confirmation")


class DeleteAccountResponseSerializer(s.Serializer):
    message = s.CharField()


@extend_schema(
    request=DeleteAccountRequestSerializer,
    responses={200: DeleteAccountResponseSerializer},
    description="Supprimer définitivement le compte de l'utilisateur connecté (confirmation par mot de passe)."
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_account_view(request):
    serializer = DeleteAccountSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)

    user = request.user
    user.delete()

    return Response({'message': 'Compte supprimé avec succès'}, status=status.HTTP_200_OK)