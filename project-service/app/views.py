from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Project, Category, TeamMember
from .serializers import ProjectSerializer, ProjectCreateSerializer, CategorySerializer, TeamMemberSerializer


class ProjectListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        projects = Project.objects.all()

        # filters
        category = request.query_params.get("category")
        status_filter = request.query_params.get("status")
        level = request.query_params.get("level")
        search = request.query_params.get("search")
        looking = request.query_params.get("looking_for_teammates")

        if category:
            projects = projects.filter(category__slug=category)
        if status_filter:
            projects = projects.filter(status=status_filter)
        if level:
            projects = projects.filter(level=level)
        if search:
            projects = projects.filter(Q(title__icontains=search) | Q(tags__icontains=search))
        
        owner = request.query_params.get("owner")
        if owner:
            projects = projects.filter(Q(owner_id=owner) | Q(team_members__user_id=owner)).distinct()

        if looking:
            projects = projects.filter(looking_for_teammates=True)

        # sorting
        sort = request.query_params.get("sort", "popular")
        if sort == "newest":
            projects = projects.order_by("-created_at")
        else:  # default to popular
            projects = projects.order_by("-upvote_count", "-created_at")

        serializer = ProjectSerializer(projects, many=True)
        return Response({"success": True, "data": serializer.data})

    def post(self, request):
        self.permission_classes = [IsAuthenticated]
        self.check_permissions(request)

        serializer = ProjectCreateSerializer(data=request.data)
        if serializer.is_valid():
            project = serializer.save(owner_id=request.user.id)
            return Response(
                {"success": True, "data": ProjectSerializer(project).data},
                status=status.HTTP_201_CREATED
            )
        return Response({"success": False, "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return None

    def get(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({"success": False, "error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"success": True, "data": ProjectSerializer(project).data})

    def patch(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({"success": False, "error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        if project.owner_id != request.user.id:
            return Response({"success": False, "error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ProjectCreateSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"success": True, "data": ProjectSerializer(project).data})
        return Response({"success": False, "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        project = self.get_object(pk)
        if not project:
            return Response({"success": False, "error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        if project.owner_id != request.user.id:
            return Response({"success": False, "error": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        project.delete()
        return Response({"success": True, "data": "Project deleted."})


class MyProjectsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(owner_id=request.user.id)
        serializer = ProjectSerializer(projects, many=True)
        return Response({"success": True, "data": serializer.data})


class CategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response({"success": True, "data": serializer.data})


class UpvoteCountView(APIView):
    """Internal endpoint called by interaction-service to sync upvote counts."""
    permission_classes = [AllowAny]

    def patch(self, request, pk):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({"success": False, "error": "Project not found."}, status=status.HTTP_404_NOT_FOUND)
        count = request.data.get("upvote_count")
        if count is not None:
            project.upvote_count = int(count)
            project.save(update_fields=["upvote_count"])
        return Response({"success": True, "data": {"upvote_count": project.upvote_count}})


class HealthView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok", "service": "project-service"})