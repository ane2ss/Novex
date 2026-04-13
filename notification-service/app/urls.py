from django.urls import path
from .views import NotificationListView, NotificationReadView, NotificationClearView, HealthView

urlpatterns = [
    path("", NotificationListView.as_view()),
    path("<int:pk>/read/", NotificationReadView.as_view()),
    path("clear/", NotificationClearView.as_view()),
    path("health/", HealthView.as_view()),
]