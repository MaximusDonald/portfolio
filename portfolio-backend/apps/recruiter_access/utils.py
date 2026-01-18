"""
Utility functions for recruiter access
"""
from .models import RecruiterLink


def validate_recruiter_token(token):
    """
    Validate a recruiter access token.
    
    Args:
        token: The token string to validate
    
    Returns:
        bool: True if token is valid, False otherwise
    """
    if not token:
        return False
    
    try:
        link = RecruiterLink.objects.get(token=token)
        
        # Check if link is valid
        if not link.is_valid():
            return False
        
        # Increment access counter
        link.increment_access()
        
        return True
    except RecruiterLink.DoesNotExist:
        return False


def get_recruiter_link_by_token(token):
    """
    Get RecruiterLink instance by token.
    
    Args:
        token: The token string
    
    Returns:
        RecruiterLink instance or None
    """
    try:
        link = RecruiterLink.objects.get(token=token)
        if link.is_valid():
            return link
        return None
    except RecruiterLink.DoesNotExist:
        return None