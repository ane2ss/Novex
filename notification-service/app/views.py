from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(user_id=request.user.id)
        serializer = NotificationSerializer(notifications, many=True)
        return Response({"success": True, "data": serializer.data})


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = Notification.objects.filter(pk=pk, user_id=request.user.id).first()
        if not notification:
            return Response({"success": False, "error": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        notification.is_read = True
        notification.save()
        return Response({"success": True, "data": NotificationSerializer(notification).data})


class NotificationClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Notification.objects.filter(user_id=request.user.id).update(is_read=True)
        return Response({"success": True, "data": "All notifications marked as read."})


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "notification-service"})