from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'is_staff', 'role']  # Changez 'is_admin' par 'role'
    
    # Ajustez les fieldsets pour inclure vos champs personnalisés
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'employee_number', 'phone_number', 'department')}),
    )
    
    # Optionnel : ajoutez des champs pour la création d'utilisateur
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'employee_number', 'phone_number', 'department')}),
    )

admin.site.register(User, CustomUserAdmin)
