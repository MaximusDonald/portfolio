"""
Utility functions for the core app
"""
import os
from datetime import datetime
from django.utils.text import slugify


def generate_filename(instance, filename):
    """
    Generate a unique filename for uploaded files.
    
    Format: uploads/{model_name}/{year}/{month}/{slug}-{timestamp}.{ext}
    """
    ext = filename.split('.')[-1]
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    model_name = instance.__class__.__name__.lower()
    
    # Get year and month for organizing files
    now = datetime.now()
    year = now.strftime('%Y')
    month = now.strftime('%m')
    
    # Create a slug from the original filename
    name = os.path.splitext(filename)[0]
    slug = slugify(name)
    
    # Generate the final filename
    new_filename = f"{slug}-{timestamp}.{ext}"
    
    return os.path.join('uploads', model_name, year, month, new_filename)


def get_client_ip(request):
    """
    Get the client's IP address from the request.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def validate_file_extension(filename, allowed_extensions):
    """
    Validate that a file has an allowed extension.
    
    Args:
        filename: The name of the file
        allowed_extensions: List of allowed extensions (e.g., ['pdf', 'jpg'])
    
    Returns:
        bool: True if valid, False otherwise
    """
    ext = filename.split('.')[-1].lower()
    return ext in [ext.lower() for ext in allowed_extensions]


def validate_file_size(file, max_size_mb):
    """
    Validate that a file is not larger than max_size_mb.
    
    Args:
        file: The uploaded file object
        max_size_mb: Maximum size in megabytes
    
    Returns:
        bool: True if valid, False otherwise
    """
    max_size_bytes = max_size_mb * 1024 * 1024
    return file.size <= max_size_bytes


def get_allowed_visibilities(request):
    """
    Return list of allowed visibilities based on request.
    Always includes PUBLIC.
    Includes RECRUTEUR if a valid token is provided in 'access' query param.
    """
    from apps.core.enums import Visibility
    
    visibilities = [Visibility.PUBLIC]
    
    token = request.query_params.get('access')
    if token:
        try:
            # Import inside function to avoid circular imports
            from apps.recruiter_access.utils import validate_recruiter_token
            if validate_recruiter_token(token):
                visibilities.append(Visibility.RECRUTEUR)
        except ImportError:
            pass
            
    return visibilities