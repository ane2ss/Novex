from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    STATUS_CHOICES = [
        ("idea", "Idea"),
        ("in_progress", "In Progress"),
        ("launched", "Launched"),
    ]
    LEVEL_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    owner_id = models.IntegerField()  # references User in auth-service
    title = models.CharField(max_length=200)
    short_description = models.CharField(max_length=300)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="projects")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="idea")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="beginner")
    cover_image = models.URLField(blank=True)
    video_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    demo_url = models.URLField(blank=True)
    tags = models.CharField(max_length=255, blank=True)  # comma separated
    looking_for_teammates = models.BooleanField(default=False)
    upvote_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-upvote_count", "-created_at"]

    def __str__(self):
        return self.title


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ("developer", "Developer"),
        ("designer", "Designer"),
        ("marketing", "Marketing"),
        ("other", "Other"),
    ]
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="team_members")
    user_id = models.IntegerField()  # references User in auth-service
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="developer")
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["project", "user_id"]