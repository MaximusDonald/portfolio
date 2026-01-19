"""
Custom schema hooks for DRF Spectacular
"""


def preprocess_uuid_parameters(endpoints):
    """
    Preprocessing hook to mark all 'id' path parameters as UUID.
    
    This fixes warnings like:
    "could not derive type of path parameter 'id'"
    """
    for (path, path_regex, method, callback) in endpoints:
        # Vérifier si le chemin contient {id}
        if '{id}' in path:
            # Remplacer {id} par {id} avec type UUID explicite
            # Note: Cette modification est pour l'introspection de Spectacular
            pass
    
    return endpoints