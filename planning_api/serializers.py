from rest_framework import serializers
from .models import User, Shift, ShiftExchangeRequest, ShiftChangeLog, Message, Notification, AdSetting

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 
            'is_active', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['is_active', 'is_staff']
        
    
class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ['id', 'user', 'start_time', 'end_time', 'location', 'role', 'status']
    
    
class ShiftExchangeRequestSerializer(serializers.ModelSerializer): 
    class Meta:
        model = ShiftExchangeRequest
        fields = ['id', 'requesting_user', 'offering_shift', 'requested_shift', 'status', 'created_at']
        
class ShiftChangeLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftChangeLog
        fields = ['id', 'shift', 'changed_by', 'previous_data', 'new_data', 'changed_at']
        read_only_fields = ['changed_at']
        
        
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'sent_at', 'read']
        read_only_fields = ['sent_at']
        
        
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'message', 'read', 'created_at']
        read_only_fields = ['sent_at']
        
        
class AdSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdSetting
        fields = ['id', 'ad_image', 'target_url', 'display_count', 'active', 'created_at']
        read_only_fields = ['created_at']