# planning_api/permissions.py
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Les admins ont tous les droits
        if request.user.is_authenticated and request.user.role == 'admin':
            return True
        
        # Les autres utilisateurs ont un accès en lecture seule
        return request.method in permissions.SAFE_METHODS

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # L'admin a tous les droits
        if request.user.is_authenticated and request.user.role == 'admin':
            return True
        
        # Un utilisateur peut accéder à ses propres données
        return obj.user == request.user