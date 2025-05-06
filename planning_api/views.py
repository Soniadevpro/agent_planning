from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import (
    User, Shift, ShiftExchangeRequest, 
    ShiftChangeLog, Message, Notification, AdSetting
)
from .serializers import (
    UserSerializer, ShiftSerializer, 
    ShiftExchangeRequestSerializer,ShiftChangeLogSerializer, MessageSerializer,
    NotificationSerializer, AdSettingSerializer
)
from .permissions import IsAdminOrReadOnly, IsOwnerOrAdmin

class UserViewSet(viewsets.ModelViewSet):
    """
    Gestion des utilisateurs avec fonctionnalités étendues
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Personnalisation des permissions selon l'action
        """
        if self.action in ['create', 'destroy']:
            permission_classes = [IsAdminOrReadOnly]
        elif self.action in ['update', 'partial_update']:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Endpoint pour récupérer les informations de l'utilisateur connecté
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def reset_password_request(self, request):
        """
        Génération d'un token de réinitialisation de mot de passe
        """
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        
        if user:
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            
            send_mail(
                'Réinitialisation de mot de passe RATP Planning',
                f'Cliquez sur ce lien pour réinitialiser votre mot de passe : {reset_link}',
                'noreply@agentplanning.com',
                [email],
                fail_silently=False,
            )
            return Response({"message": "Un email de réinitialisation a été envoyé"}, status=status.HTTP_200_OK)
        
        return Response({"error": "Aucun utilisateur trouvé avec cet email"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        """
        Réinitialisation effective du mot de passe
        """
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        email = request.data.get('email')

        user = User.objects.filter(email=email).first()
        
        if user and default_token_generator.check_token(user, token):
            user.set_password(new_password)
            user.last_password_change = timezone.now()
            user.save()
            return Response({"message": "Mot de passe réinitialisé avec succès"}, status=status.HTTP_200_OK)
        
        return Response({"error": "Lien de réinitialisation invalide"}, status=status.HTTP_400_BAD_REQUEST)

class ShiftViewSet(viewsets.ModelViewSet):
    """
    Gestion des créneaux de travail
    """
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        """
        Filtrage des créneaux selon le rôle
        """
        user = self.request.user
        if user.role == 'admin':
            return Shift.objects.all()
        return Shift.objects.filter(user=user)

    @action(detail=False, methods=['get'])
    def team_shifts(self, request):
        """
        Récupération des créneaux de l'équipe
        """
        if request.user.role not in ['admin', 'supervisor']:
            return Response({"error": "Accès non autorisé"}, status=status.HTTP_403_FORBIDDEN)
        
        department = request.query_params.get('department')
        queryset = Shift.objects.filter(user__department=department)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ShiftExchangeRequestViewSet(viewsets.ModelViewSet):
    """
    Gestion des demandes d'échange de créneaux
    """
    queryset = ShiftExchangeRequest.objects.all()
    serializer_class = ShiftExchangeRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtrage des demandes selon le rôle
        """
        user = self.request.user
        if user.role == 'admin':
            return ShiftExchangeRequest.objects.all()
        return ShiftExchangeRequest.objects.filter(
            requesting_user=user
        ) | ShiftExchangeRequest.objects.filter(
            target_user=user
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        Approbation d'une demande d'échange
        """
        exchange_request = self.get_object()
        
        if request.user not in [exchange_request.target_user, exchange_request.requesting_user]:
            return Response({"error": "Non autorisé"}, status=status.HTTP_403_FORBIDDEN)
        
        exchange_request.status = 'pending_admin'
        exchange_request.save()
        
        return Response({"message": "Demande transmise à l'administrateur"})
    
    
    
class ShiftChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Gestion des logs de modification de créneaux
    """
    queryset = ShiftChangeLog.objects.all()
    serializer_class = ShiftChangeLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtre les logs selon le rôle de l'utilisateur
        """
        user = self.request.user
        if user.is_staff or user.role == 'admin':
            return ShiftChangeLog.objects.all()
        return ShiftChangeLog.objects.filter(user=user)

class MessageViewSet(viewsets.ModelViewSet):
    """
    Gestion des messages internes
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtrage des messages
        """
        user = self.request.user
        return Message.objects.filter(
            sender=user
        ) | Message.objects.filter(
            recipient=user
        )

class NotificationViewSet(viewsets.ModelViewSet):
    """
    Gestion des notifications
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Récupération des notifications de l'utilisateur
        """
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """
        Marquer toutes les notifications comme lues
        """
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "Toutes les notifications marquées comme lues"})

class AdSettingViewSet(viewsets.ModelViewSet):
    """
    Gestion des paramètres publicitaires
    """
    queryset = AdSetting.objects.all()
    serializer_class = AdSettingSerializer
    permission_classes = [IsAdminOrReadOnly]

    