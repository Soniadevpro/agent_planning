from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, ShiftViewSet, ShiftExchangeRequestViewSet, 
    ShiftChangeLogViewSet, MessageViewSet, NotificationViewSet, 
    AdSettingViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'shifts', ShiftViewSet)
router.register(r'exchange-requests', ShiftExchangeRequestViewSet)
router.register(r'change-logs', ShiftChangeLogViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'ad-settings', AdSettingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



