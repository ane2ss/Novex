from django.urls import path
from .views import (
    UpvoteView, CommentListView, CommentDetailView,
    JoinRequestView, JoinRequestUpdateView, MyJoinRequestsView, HealthView,
    MyUpvotesView
)

urlpatterns = [
    path("upvote/<int:project_id>/", UpvoteView.as_view()),
    path("upvotes/mine/", MyUpvotesView.as_view()),
    path("comments/<int:project_id>/", CommentListView.as_view()),
    path("comments/detail/<int:pk>/", CommentDetailView.as_view()),
    path("join/<int:project_id>/", JoinRequestView.as_view()),
    path("join-requests/<int:pk>/", JoinRequestUpdateView.as_view()),
    path("join-requests/mine/", MyJoinRequestsView.as_view()),
    path("health/", HealthView.as_view()),
]