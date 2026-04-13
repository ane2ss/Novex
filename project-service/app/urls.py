from django.urls import path
from .views import ProjectListView, ProjectDetailView, MyProjectsView, CategoryListView, HealthView

urlpatterns = [
    path("", ProjectListView.as_view()),
    path("<int:pk>/", ProjectDetailView.as_view()),
    path("mine/", MyProjectsView.as_view()),
    path("categories/", CategoryListView.as_view()),
    path("health/", HealthView.as_view()),
]