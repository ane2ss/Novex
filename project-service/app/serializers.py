from rest_framework import serializers
from .models import Project, Category, TeamMember


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ["id", "user_id", "role", "joined_at"]


class ProjectSerializer(serializers.ModelSerializer):
    team_members = TeamMemberSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id", "owner_id", "title", "short_description", "description",
            "category", "category_name", "status", "level", "cover_image",
            "video_url", "github_url", "demo_url", "tags",
            "looking_for_teammates", "upvote_count", "team_members",
            "created_at", "updated_at"
        ]
        read_only_fields = ["owner_id", "upvote_count", "created_at", "updated_at"]


class ProjectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            "title", "short_description", "description", "category",
            "status", "level", "cover_image", "video_url", "github_url",
            "demo_url", "tags", "looking_for_teammates"
        ]