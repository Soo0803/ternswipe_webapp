
from django.urls import path
from .views import LoginUser, StudentRegisterView, ProfessorRegisterView, ProfessorJobListAPIView, ProfessorProjectListCreateAPIView

urlpatterns = [
    path('login/', LoginUser.as_view(), name='user-login'),  # API endpoint for login
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/professor/', ProfessorRegisterView.as_view(), name='register-professor'),
    path("professor/jobs/", ProfessorJobListAPIView.as_view(), name="professor-job-list"),
    path("professor/projects/", ProfessorProjectListCreateAPIView.as_view(), name="professor-projects"),
    path("professor/<int:profile_id>/projects/", ProfessorProjectListCreateAPIView.as_view(), name="professor-profile-projects"),
]