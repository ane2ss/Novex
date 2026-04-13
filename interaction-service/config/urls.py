from django.urls import path, include

urlpatterns = [
    path("api/interactions/", include("app.urls")),
]