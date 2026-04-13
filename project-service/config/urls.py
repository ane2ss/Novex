from django.urls import path, include

urlpatterns = [
    path("api/projects/", include("app.urls")),
]