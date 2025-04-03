from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone



class User(AbstractUser):
    """
    Extension du modèle utilisateur de Django avec des champs spécifiques
    """
    is_admin = models.BooleanField(default=False)
    employee_id = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=20,blank=True,null=True)
    
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
    def __str__(self):
        return f"{self.username} ({'Administrateur' if self.is_admin else 'Agent'})"
    
    
class Shift(models.Model):
    """
    Modèle représentant un créneau de travail
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shifts')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Créneau"
        verbose_name_plural = "Créneaux"
    
    def __str__(self):
        return f"{self.user.username} - {self.start_timestrftime('%d/%m/%Y %H:%M')} à {self.end_time.strftime('%H:%M')}"



class ShiftExchangeRequest(models.Model):
    """
    Modèle représentant une demande d'échange de créneau
    """
    STATUS_CHOICES = (
        ('pending_agent', 'En attente de réponse de l\'agent'),
        ('pending_admin', 'En attente de réponse de l\'administrateur'),
        ('accepted', 'Acceptée'),
        ('rejected', 'Rejetée'),
        ('cancelled', 'Annulée'),
    )
    
    
    requesting_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    requesting_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='outgoing_requests')
    
    
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    target_shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='incoming_requests')
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_agent')
    
    
    request_message = models.TextField(blank=True)
    response_message = models.TextField(blank=True)
    
    admin_message = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        verbose_name = 'Demande d\'échange'
        verbose_name_plural = 'Demandes d\'échange'
    
    def __str__(self):
        return f"Échange #{self.id}: {self.requesting_user.username} <-> {self.target_user.username} ({self.status})"
    
    
    
    
class ShiftChangeLog(models.Model):
    """
    Journal des modifications de planning
    
    """
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shift_changes')
    shift = models.ForeignKey(Shift, on_delete=models.CASCADE, related_name='changes')
    exchange_request = models.ForeignKey(ShiftExchangeRequest, on_delete=models.SET_NULL, null=True, blank=True, related_name='changes')
    
    
    old_start_time = models.DateTimeField()
    old_end_time = models.DateTimeField()
    new_start_time = models.DateTimeField()
    new_end_time = models.DateTimeField()
    
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='changes_made')
    change_reason = models.CharField(max_length=255, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Historique de modification'
        verbose_name_plural = 'Historique des modifications'
    
    def __str__(self):
        return f"Modification #{self.id} pour {self.user.username}"
    
    
    
    
    
class Message (models.Model):
    """
    Message pour le système de messagerie interne
    """
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages', null=True, blank=True)
    subject = models.CharField(max_length=255)
    content = models.TextField()
    
    is_read = models.BooleanField(default=False)
    is_global = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
    
    def __str__(self):
        return f"Message de {self.sender.username} à {self.recipient.username} - {self.sent_at.strftime('%d/%m/%Y %H:%M')}"
    
    
    
    
    
    
class Notification(models.Model):
    """
    Notification pour les utilisateurs
    """
    TYPE_CHOICES = (
        ('exchange_request', 'Demande d\'échange'),
        ('exchange_response', 'Réponse à la demande d\'échange'),
        ('admin_decision', 'Décision administrative'),
        ('message', 'Nouveau message'),
        ('system', 'Notification système'),
        ('other', 'Autre'),     
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    related_exchange = models.ForeignKey(ShiftExchangeRequest, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    related_message = models.ForeignKey(Message, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
    def __str__(self):
        return f"Notification pour {self.user.username}: {self.title}"
    
    
    
    
class AdSetting(models.Model):
    """

    Configuration pour l'affichage des publicités
    """
    name = models.CharField(max_length=100)
    ad_code = models.TextField() #code adsens ou autre code javascript fourni par le réseau publicitaire
    location = models.CharField(max_length=100) #emplacement de la pub header sidebar footer
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Configuration publicitaire'
        verbose_name_plural = 'Configurations publicitaires'
    def __str__(self):
        return f"{self.name} ({'Actif' if self.is_active else 'Inactif'})"