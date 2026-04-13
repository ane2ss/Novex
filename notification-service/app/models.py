from django.db import models


class Notification(models.Model):
    TYPE_CHOICES = [
        ("upvote", "Upvote"),
        ("comment", "Comment"),
        ("join_request", "Join Request"),
        ("join_request_update", "Join Request Update"),
    ]
    user_id = models.IntegerField()
    type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    message = models.CharField(max_length=255)
    project_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]