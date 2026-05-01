from rest_framework import serializers
from .models import Upvote, Comment, JoinRequest


class UpvoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Upvote
        fields = ["id", "user_id", "project_id", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "user_id", "user_username", "project_id", "content", "parent", "replies", "created_at", "updated_at"]
        read_only_fields = ["user_id", "user_username", "project_id", "created_at", "updated_at"]

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class JoinRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = JoinRequest
        fields = ["id", "user_id", "user_username", "project_id", "project_owner_id", "message", "role", "status", "created_at"]
        read_only_fields = ["user_id", "user_username", "project_id", "project_owner_id", "status", "created_at"]