from django.db import models


class Upvote(models.Model):
    user_id = models.IntegerField()
    project_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user_id", "project_id"]


class Comment(models.Model):
    user_id = models.IntegerField()
    project_id = models.IntegerField()
    content = models.TextField()
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]


class JoinRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]
    ROLE_CHOICES = [
        ("developer", "Developer"),
        ("designer", "Designer"),
        ("marketing", "Marketing"),
        ("other", "Other"),
    ]
    user_id = models.IntegerField()
    project_id = models.IntegerField()
    project_owner_id = models.IntegerField()
    message = models.TextField(blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="developer")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user_id", "project_id"]