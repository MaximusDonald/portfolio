"""
Serializers for proofs
"""
from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from apps.core.serializers import BaseSerializer
from .models import Proof


class ProofSerializer(BaseSerializer):
    """
    Complete proof serializer.
    """
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    file_extension = serializers.CharField(source='get_file_extension', read_only=True)
    is_image = serializers.BooleanField(read_only=True)
    is_video = serializers.BooleanField(read_only=True)
    is_pdf = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Proof
        fields = [
            'id',
            'title',
            'description',
            'proof_type',
            'file',
            'file_url',
            'file_size',
            'file_size_display',
            'file_name',
            'file_extension',
            'mime_type',
            'is_image',
            'is_video',
            'is_pdf',
            'visibility',
            'display_order',
            'content_type',
            'object_id',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'file_url',
            'file_size',
            'file_size_display',
            'file_name',
            'file_extension',
            'mime_type',
            'is_image',
            'is_video',
            'is_pdf',
            'created_at',
            'updated_at',
        ]
    
    def get_file_url(self, obj):
        """Return the file URL."""
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class ProofCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating proofs.
    """
    content_type_model = serializers.CharField(write_only=True)
    
    class Meta:
        model = Proof
        fields = [
            'title',
            'description',
            'proof_type',
            'file',
            'visibility',
            'display_order',
            'content_type_model',
            'object_id',
        ]
    
    def validate_content_type_model(self, value):
        """Validate and convert model name to ContentType."""
        # Map model names to app labels
        model_mapping = {
            'diploma': ('education', 'diploma'),
            'certification': ('education', 'certification'),
            'project': ('projects', 'project'),
            'experience': ('professional', 'experience'),
            'training': ('professional', 'training'),
        }
        
        if value.lower() not in model_mapping:
            raise serializers.ValidationError(
                f'Type de contenu non valide. Valeurs acceptées: {", ".join(model_mapping.keys())}'
            )
        
        return value.lower()
    
    def validate(self, attrs):
        """Validate that the object exists and belongs to the user."""
        content_type_model = attrs.pop('content_type_model')
        object_id = attrs.get('object_id')
        user = self.context['request'].user
        
        # Get ContentType
        model_mapping = {
            'diploma': ('education', 'diploma'),
            'certification': ('education', 'certification'),
            'project': ('projects', 'project'),
            'experience': ('professional', 'experience'),
            'training': ('professional', 'training'),
        }
        
        app_label, model = model_mapping[content_type_model]
        content_type = ContentType.objects.get(app_label=app_label, model=model)
        
        # Check if object exists and belongs to user
        model_class = content_type.model_class()
        try:
            obj = model_class.objects.get(id=object_id, user=user)
        except model_class.DoesNotExist:
            raise serializers.ValidationError({
                'object_id': 'L\'objet spécifié n\'existe pas ou ne vous appartient pas.'
            })
        
        attrs['content_type'] = content_type
        return attrs
    
    def validate_file(self, value):
        """Validate file based on proof type."""
        # Basic validation - additional validation in model
        if not value:
            raise serializers.ValidationError('Le fichier est requis.')
        
        return value


class ProofPublicSerializer(serializers.ModelSerializer):
    """
    Public proof serializer (respects visibility).
    """
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    
    class Meta:
        model = Proof
        fields = [
            'id',
            'title',
            'description',
            'proof_type',
            'file_url',
            'file_size_display',
        ]
    
    def get_file_url(self, obj):
        """Return file URL only if allowed by visibility."""
        request = self.context.get('request')
        
        # Check visibility
        if obj.visibility == 'Prive':
            return None
        
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None