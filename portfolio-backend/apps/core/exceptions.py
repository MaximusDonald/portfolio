"""
Custom exception handler for Django REST Framework
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import Http404


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.
    
    Returns a consistent error response format:
    {
        "error": "Error type",
        "detail": "Error message",
        "field_errors": {
            "field_name": ["Error message"]
        }
    }
    """
    
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    # Handle Django ValidationError
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, 'message_dict'):
            return Response({
                'error': 'Validation Error',
                'detail': 'Invalid data provided',
                'field_errors': exc.message_dict
            }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                'error': 'Validation Error',
                'detail': str(exc)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle 404
    if isinstance(exc, Http404):
        return Response({
            'error': 'Not Found',
            'detail': 'The requested resource was not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # If response is None, return the exception as is
    if response is None:
        return response
    
    # Customize the error response format
    custom_response_data = {
        'error': exc.__class__.__name__,
        'detail': response.data.get('detail', 'An error occurred')
    }
    
    # Add field-specific errors if they exist
    if isinstance(response.data, dict):
        field_errors = {
            key: value for key, value in response.data.items() 
            if key != 'detail'
        }
        if field_errors:
            custom_response_data['field_errors'] = field_errors
    
    response.data = custom_response_data
    return response


class RecruiterTokenInvalidError(Exception):
    """Exception raised when recruiter token is invalid or expired."""
    pass


class PermissionDeniedError(Exception):
    """Exception raised when user doesn't have permission."""
    pass