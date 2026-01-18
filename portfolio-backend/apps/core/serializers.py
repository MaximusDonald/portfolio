"""
Base serializers for the application
"""
from rest_framework import serializers


class BaseSerializer(serializers.ModelSerializer):
    """
    Base serializer with common configurations.
    """
    
    class Meta:
        abstract = True
        read_only_fields = ['id', 'created_at', 'updated_at']


class TimestampSerializer(serializers.Serializer):
    """
    Serializer for timestamp fields only.
    """
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)