from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Upvote, Comment, JoinRequest
from .serializers import UpvoteSerializer, CommentSerializer, JoinRequestSerializer
import pika
import json
import os


def publish_event(event_type, data):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=os.environ.get("RABBITMQ_HOST", "localhost"),
                credentials=pika.PlainCredentials(
                    os.environ.get("RABBITMQ_USER", "guest"),
                    os.environ.get("RABBITMQ_PASS", "guest"),
                )
            )
        )
        channel = connection.channel()
        channel.exchange_declare(exchange='events', exchange_type='fanout', durable=True)
        channel.basic_publish(
            exchange="events",
            routing_key="",
            body=json.dumps({"type": event_type, "data": data}),
            properties=pika.BasicProperties(delivery_mode=2),
        )
        connection.close()
    except Exception as e:
        print(f"RabbitMQ publish failed: {e}")


def sync_upvote_count(project_id):
    """Tell the project-service the current upvote count for a project."""
    try:
        count = Upvote.objects.filter(project_id=project_id).count()
        project_url = os.environ.get("PROJECT_SERVICE_URL", "http://localhost:8002")
        import requests as req_lib
        req_lib.patch(
            f"{project_url}/api/projects/{project_id}/upvote-count/",
            json={"upvote_count": count},
            timeout=3,
        )
    except Exception as e:
        print(f"Failed to sync upvote count: {e}")


class UpvoteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        if Upvote.objects.filter(user_id=request.user.id, project_id=project_id).exists():
            return Response({"success": False, "error": "Already upvoted."}, status=status.HTTP_400_BAD_REQUEST)
        
        project_owner_id = request.data.get("project_owner_id")
        upvote = Upvote.objects.create(user_id=request.user.id, project_id=project_id)
        sync_upvote_count(project_id)
        
        publish_event("upvote", {
            "project_id": project_id,
            "user_id": request.user.id,
            "username": request.user.username,
            "project_owner_id": project_owner_id,
        })
        return Response({"success": True, "data": UpvoteSerializer(upvote).data}, status=status.HTTP_201_CREATED)

    def delete(self, request, project_id):
        upvote = Upvote.objects.filter(user_id=request.user.id, project_id=project_id).first()
        if not upvote:
            return Response({"success": False, "error": "Upvote not found."}, status=status.HTTP_404_NOT_FOUND)
        upvote.delete()
        sync_upvote_count(project_id)
        publish_event("upvote_removed", {
            "project_id": project_id,
            "user_id": request.user.id,
        })
        return Response({"success": True, "data": "Upvote removed."})
 
 
class MyUpvotesView(APIView):
    permission_classes = [IsAuthenticated]
 
    def get(self, request):
        upvotes = Upvote.objects.filter(user_id=request.user.id).values_list("project_id", flat=True)
        return Response({"success": True, "data": list(upvotes)})


class CommentListView(APIView):
    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, project_id):
        comments = Comment.objects.filter(project_id=project_id, parent=None)
        serializer = CommentSerializer(comments, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request, project_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save(
                user_id=request.user.id,
                user_username=request.user.username,
                project_id=project_id
            )
            project_owner_id = request.data.get("project_owner_id")
            publish_event("comment", {
                "project_id": project_id,
                "user_id": request.user.id,
                "username": request.user.username,
                "comment_id": comment.id,
                "project_owner_id": project_owner_id,
            })
            return Response({"success": True, "data": CommentSerializer(comment).data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class CommentDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        comment = Comment.objects.filter(pk=pk, user_id=request.user.id).first()
        if not comment:
            return Response({"success": False, "error": "Comment not found."}, status=status.HTTP_404_NOT_FOUND)
        comment.delete()
        return Response({"success": True, "data": "Comment deleted."})


class JoinRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, project_id):
        if JoinRequest.objects.filter(user_id=request.user.id, project_id=project_id).exists():
            return Response({"success": False, "error": "Already sent a request."}, status=status.HTTP_400_BAD_REQUEST)
        project_owner_id = request.data.get("project_owner_id")
        if not project_owner_id:
            return Response({"success": False, "error": "project_owner_id required."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = JoinRequestSerializer(data=request.data)
        if serializer.is_valid():
            join_request = serializer.save(
                user_id=request.user.id,
                user_username=request.user.username,
                project_id=project_id,
                project_owner_id=project_owner_id,
            )
            publish_event("join_request", {
                "project_id": project_id,
                "user_id": request.user.id,
                "username": request.user.username,
                "project_owner_id": project_owner_id,
            })
            return Response({"success": True, "data": JoinRequestSerializer(join_request).data}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class JoinRequestUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        join_request = JoinRequest.objects.filter(pk=pk, project_owner_id=request.user.id).first()
        if not join_request:
            return Response({"success": False, "error": "Request not found."}, status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get("status")
        if new_status not in ["accepted", "declined"]:
            return Response({"success": False, "error": "Status must be accepted or declined."}, status=status.HTTP_400_BAD_REQUEST)
        join_request.status = new_status
        join_request.save()
        publish_event("join_request_update", {
            "project_id": join_request.project_id,
            "user_id": join_request.user_id,
            "status": new_status,
        })
        return Response({"success": True, "data": JoinRequestSerializer(join_request).data})


class MyJoinRequestsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        requests = JoinRequest.objects.filter(project_owner_id=request.user.id)
        serializer = JoinRequestSerializer(requests, many=True)
        return Response({"success": True, "data": serializer.data})


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "interaction-service"})