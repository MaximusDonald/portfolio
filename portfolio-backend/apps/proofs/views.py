# ==========================================
# apps/proofs/views.py
# ==========================================
"""
Views for proofs
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.contenttypes.models import ContentType
from drf_spectacular.utils import extend_schema, extend_schema_view
from drf_spectacular.openapi import OpenApiParameter, OpenApiTypes

from apps.core.permissions import IsOwner
from apps.core.enums import Visibility
from .models import Proof
from .serializers import (
    ProofSerializer,
    ProofCreateSerializer,
    ProofPublicSerializer,
)


@extend_schema_view(
    list=extend_schema(description="Liste de toutes mes preuves"),
    retrieve=extend_schema(
        description="Récupérer une preuve par son ID",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Proof ID')
        ]
    ),
    create=extend_schema(description="Upload une nouvelle preuve"),
    update=extend_schema(
        description="Mettre à jour une preuve",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Proof ID')
        ]
    ),
    partial_update=extend_schema(
        description="Mise à jour partielle d'une preuve",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Proof ID')
        ]
    ),
    destroy=extend_schema(
        description="Supprimer une preuve",
        parameters=[
            OpenApiParameter('id', OpenApiTypes.UUID, OpenApiParameter.PATH, description='Proof ID')
        ]
    )
)
class ProofViewSet(viewsets.ModelViewSet):
    """ViewSet for managing proofs."""
    permission_classes = [IsAuthenticated, IsOwner]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        """Return proofs for the authenticated user."""
        return Proof.objects.filter(user=self.request.user).order_by('display_order', 'created_at')
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return ProofCreateSerializer
        return ProofSerializer
    
    def perform_create(self, serializer):
        """Set the user when creating a proof."""
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def for_object(self, request):
        """Get all proofs for a specific object."""
        content_type_name = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        if not content_type_name or not object_id:
            return Response(
                {'error': 'content_type et object_id sont requis'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        model_mapping = {
            'diploma': ('education', 'diploma'),
            'certification': ('education', 'certification'),
            'project': ('projects', 'project'),
            'experience': ('professional', 'experience'),
            'training': ('professional', 'training'),
        }
        
        if content_type_name.lower() not in model_mapping:
            return Response(
                {'error': 'Type de contenu non valide'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        app_label, model = model_mapping[content_type_name.lower()]
        content_type = ContentType.objects.get(app_label=app_label, model=model)
        
        proofs = self.get_queryset().filter(
            content_type=content_type,
            object_id=object_id
        )
        
        serializer = self.get_serializer(proofs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reorder proofs."""
        proofs_data = request.data.get('proofs', [])
        
        if not proofs_data:
            return Response(
                {'error': 'Liste de preuves requise'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        for item in proofs_data:
            proof_id = item.get('id')
            display_order = item.get('display_order')
            
            try:
                proof = Proof.objects.get(id=proof_id, user=request.user)
                proof.display_order = display_order
                proof.save(update_fields=['display_order'])
            except Proof.DoesNotExist:
                continue
        
        return Response({'message': 'Ordre mis à jour'}, status=status.HTTP_200_OK)