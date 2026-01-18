"""
Admin configuration for core app
"""
from django.contrib import admin


class BaseModelAdmin(admin.ModelAdmin):
    """
    Base admin class with common configurations.
    """
    readonly_fields = ['id', 'created_at', 'updated_at']
    list_per_page = 25
    date_hierarchy = 'created_at'
    
    def get_list_display(self, request):
        """Add created_at to list_display if not already present."""
        list_display = super().get_list_display(request)
        if 'created_at' not in list_display:
            return list_display + ('created_at',)
        return list_display