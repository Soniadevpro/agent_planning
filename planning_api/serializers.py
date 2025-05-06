from rest_framework import serializers
from .models import User, Shift, ShiftExchangeRequest, ShiftChangeLog, Message, Notification, AdSetting

# planning_api/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    confirm_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'department', 'employee_number', 
            'phone_number', 'hire_date', 'password', 'confirm_password'
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        # Validation du mot de passe
        if 'password' in attrs:
            password = attrs.get('password')
            confirm_password = attrs.pop('confirm_password', None)

            if password != confirm_password:
                raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})

            try:
                validate_password(password)
            except ValidationError as e:
                raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password', None)
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user
        
    
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
        fields = ['id', 'user', 'shift', 'old_start_time', 'old_end_time', 
                  'new_start_time', 'new_end_time', 'changed_by', 
                  'change_reason', 'created_at']
        read_only_fields = ['created_at']
        
        
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