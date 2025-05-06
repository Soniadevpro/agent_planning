# planning_api/management/commands/create_test_data.py
from django.core.management.base import BaseCommand
from django.utils import timezone
from planning_api.models import User, Shift, ShiftExchangeRequest
from datetime import timedelta

class Command(BaseCommand):
    help = 'Crée des données de test pour l\'application Agent Planning'

    def handle(self, *args, **kwargs):
        # Suppression des données existantes
        User.objects.all().delete()
        Shift.objects.all().delete()
        ShiftExchangeRequest.objects.all().delete()

        # Création de l'admin
        admin_user = User.objects.create_superuser(
            username='admin_ratp',
            email='admin@ratp.fr',
            password='AdminRatp2024!',
            role='admin',
            first_name='Pascal',
            last_name='Dupont',
            employee_number='ADMIN001',
            department='metro'
        )
        self.stdout.write(self.style.SUCCESS(f'Admin créé : {admin_user.username}'))

        # Données des agents
        agents_data = [
            {
                'username': 'jean.martin',
                'email': 'jean.martin@ratp.fr',
                'password': 'AgentRatp2024!',
                'role': 'agent',
                'first_name': 'Jean',
                'last_name': 'Martin',
                'employee_number': 'AG001',
                'department': 'metro'
            },
            {
                'username': 'marie.dupuis',
                'email': 'marie.dupuis@ratp.fr',
                'password': 'AgentRatp2024!',
                'role': 'agent',
                'first_name': 'Marie',
                'last_name': 'Dupuis',
                'employee_number': 'AG002',
                'department': 'bus'
            },
            {
                'username': 'thomas.leroy',
                'email': 'thomas.leroy@ratp.fr',
                'password': 'AgentRatp2024!',
                'role': 'supervisor',
                'first_name': 'Thomas',
                'last_name': 'Leroy',
                'employee_number': 'SUP001',
                'department': 'rer'
            }
        ]

        # Création des utilisateurs
        users = {}
        for agent_data in agents_data:
            user = User.objects.create_user(**agent_data)
            users[agent_data['username']] = user
            self.stdout.write(self.style.SUCCESS(f'Utilisateur créé : {user.username}'))

        # Création des créneaux
        shifts_data = [
            {
                'user': users['jean.martin'],
                'start_time': timezone.now() + timedelta(days=1, hours=8),
                'end_time': timezone.now() + timedelta(days=1, hours=16),
                'description': 'Service métro ligne 1'
            },
            {
                'user': users['marie.dupuis'],
                'start_time': timezone.now() + timedelta(days=2, hours=14),
                'end_time': timezone.now() + timedelta(days=2, hours=22),
                'description': 'Service bus ligne 42'
            },
            {
                'user': users['thomas.leroy'],
                'start_time': timezone.now() + timedelta(days=3, hours=6),
                'end_time': timezone.now() + timedelta(days=3, hours=14),
                'description': 'Supervision RER A'
            }
        ]

        # Création des créneaux
        for shift_data in shifts_data:
            shift = Shift.objects.create(**shift_data)
            self.stdout.write(self.style.SUCCESS(f'Créneau créé : {shift.user.username} - {shift.description}'))

        # Création d'une demande d'échange
        jean_shift = Shift.objects.filter(user=users['jean.martin']).first()
        marie_shift = Shift.objects.filter(user=users['marie.dupuis']).first()

        exchange_request = ShiftExchangeRequest.objects.create(
            requesting_user=users['jean.martin'],
            requesting_shift=jean_shift,
            target_user=users['marie.dupuis'],
            target_shift=marie_shift,
            status='pending_agent',
            request_message="Pouvons-nous échanger nos créneaux ?"
        )
        self.stdout.write(self.style.SUCCESS(f'Demande d\'échange créée : {exchange_request}'))