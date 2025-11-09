
from django.urls import path
from .views import (
    LoginUser, StudentRegisterView, ProfessorRegisterView, 
    ProfessorJobListAPIView, ProfessorProjectListCreateAPIView,
    StudentMatchesAPIView, ProjectMatchesAPIView, AllProjectsAPIView
)

urlpatterns = [
    path('login/', LoginUser.as_view(), name='user-login'),
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/professor/', ProfessorRegisterView.as_view(), name='register-professor'),
    path("professor/jobs/", ProfessorJobListAPIView.as_view(), name="professor-job-list"),
    path("professor/projects/", ProfessorProjectListCreateAPIView.as_view(), name="professor-projects"),
    path("professor/<int:profile_id>/projects/", ProfessorProjectListCreateAPIView.as_view(), name="professor-profile-projects"),
    # Matching endpoints
    path("student/matches/", StudentMatchesAPIView.as_view(), name="student-matches"),
    path("project/<int:project_id>/matches/", ProjectMatchesAPIView.as_view(), name="project-matches"),
    path("projects/", AllProjectsAPIView.as_view(), name="all-projects"),
]