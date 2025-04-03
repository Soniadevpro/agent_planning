from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Shift, ShiftExchangeRequest, ShiftChangeLog, Message, Notification, AdSetting
from .serializers import (
    UserSerializer,
    ShiftSerializer,
    ShiftExchangeRequestSerializer,
    ShiftChangeLogSerializer,
    MessageSerializer,
    NotificationSerializer,
    AdSettingSerializer,
)



class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
   
    def me(self, request):
        """ Endpoint pour récupérer les informations de l'utilisateur connecté"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    

class ShiftViewSet(viewsets.ModelViewSet):
    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """ Filtre les shifts pour n'afficher que ceux de l'utilisateur connecté ou pour tous les utilisateurs si l'utilisateur est un admin """
        user = self.request.user
        if user.is_staff:
            return Shift.objects.all()
        return Shift.objects.filter(user=user)
    
    
    @action(detail=False, methods=['get'])
    def team(self, request):
        """Endpoint pour récupérer tous les shifts de l'équipe."""
        # Cette logique dépendra de comment vous définissez "équipe"
        # Par exemple, tous les shifts pour la même location/jour
        shifts = Shift.objects.all()
        serializer = self.get_serializer(shifts, many=True)
        return Response(serializer.data)
    
class ShiftExchangeRequestViewSet(viewsets.ModelViewSet):
    queryset = ShiftExchangeRequest.objects.all()
    serializer_class = ShiftExchangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtre les demandes d'échange pour n'afficher que celles impliquant l'utilisateur."""
        user = self.request.user
        if user.is_staff:
            return ShiftExchangeRequest.objects.all()
        return ShiftExchangeRequest.objects.filter(
            requesting_user=user
        ) | ShiftExchangeRequest.objects.filter(
            requested_shift__user=user
        )
        
        
class ShiftChangeLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ShiftChangeLog.objects.all()
    serializer_class = ShiftChangeLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
         """Filtre les logs pour n'afficher que ceux des shifts de l'utilisateur."""
         user = self.request.user
         if user.is_staff:
             return ShiftChangeLog.objects.all()
         return ShiftChangeLog.objects.filter(shift__user=user)
     

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Filtre les messages pour n'afficher que ceux envoyés ou reçus par l'utilisateur."""
        user = self.request.user
        return Message.objects.filter(sender=user) | Message.objects.filter(receiver=user)
    
    
class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """ N'affiche que les notifications de l'utilisateur connecté """
        return Notification.objects.filter(user=self.request.user)
    
    
    @action(detail=False, methods=['post'])
    def mark_as_read(self,request, pk=None):
        """ Marque une notification comme lue """
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    

class AdSettingViewSet(viewsets.ModelViewSet):
    queryset = AdSetting.objects.all()
    serializer_class = AdSettingSerializer
    permission_classes = [permissions.IsAdminUser]  # Seuls les administrateurs peuvent gérer les publicités

    