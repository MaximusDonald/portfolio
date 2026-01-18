"""
File validators for proofs
"""
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible


@deconstructible
class FileValidator:
    """
    Validator for file size and extension.
    """
    
    def __init__(self, max_size_mb=10, allowed_extensions=None):
        """
        Initialize validator.
        
        Args:
            max_size_mb: Maximum file size in megabytes
            allowed_extensions: List of allowed extensions (e.g., ['pdf', 'jpg'])
        """
        self.max_size_mb = max_size_mb
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.allowed_extensions = allowed_extensions or []
    
    def __call__(self, file):
        """Validate file."""
        # Check file size
        if file.size > self.max_size_bytes:
            raise ValidationError(
                f'La taille du fichier ne doit pas dépasser {self.max_size_mb} MB. '
                f'Taille actuelle: {file.size / (1024 * 1024):.2f} MB.'
            )
        
        # Check file extension
        if self.allowed_extensions:
            ext = file.name.split('.')[-1].lower()
            if ext not in [e.lower() for e in self.allowed_extensions]:
                raise ValidationError(
                    f'Extension de fichier non autorisée. '
                    f'Extensions acceptées: {", ".join(self.allowed_extensions)}'
                )
    
    def __eq__(self, other):
        return (
            isinstance(other, FileValidator) and
            self.max_size_mb == other.max_size_mb and
            self.allowed_extensions == other.allowed_extensions
        )


# Predefined validators
validate_image = FileValidator(
    max_size_mb=5,
    allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'gif']
)

validate_video = FileValidator(
    max_size_mb=50,
    allowed_extensions=['mp4', 'webm', 'avi', 'mov']
)

validate_pdf = FileValidator(
    max_size_mb=10,
    allowed_extensions=['pdf']
)

validate_document = FileValidator(
    max_size_mb=10,
    allowed_extensions=['pdf', 'doc', 'docx', 'txt']
)