from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    list_display = ['username', 'email', 'is_staff', 'is_admin']
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('is_admin', 'employee_id', 'phone_number')}),
    )

admin.site.register(User, CustomUserAdmin)
