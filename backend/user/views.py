from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import UserSerializer, StudentProfileSerializer, ProfessorProfileSerializer, ProfessorProjectSerializer
from .models import Student, StudentProfile, ProfessorProfile, Professor, ProfessorProject
from rest_framework.authtoken.models import Token



class LoginUser(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            # Get or create token for the user
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({
                "token": token.key,
                "user": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class StudentRegisterView(APIView):
    def post(self, request):
        user_data = {
            "username": request.data.get("username"),
            "email": request.data.get("email"),
            "password": request.data.get("password"),
            "role": "STUDENT",  # Ensure role is set
        }

        profile_data = {
            "given_name": request.data.get("given_name"),
            "middle_name": request.data.get("middle_name"),
            "last_name": request.data.get("last_name"),
            "nationality": request.data.get("nationality"),
            "age": request.data.get("age"),
            "language": request.data.get("language"),
            "graduation_year": request.data.get("graduation_year"),
            "major_chosen": request.data.get("major_chosen"),
            "location": request.data.get("location"),
            "phone_number": request.data.get("phone_number"),
            "transcript": request.FILES.get("transcript"),
            "resume": request.FILES.get("resume"),
        }

        user_serializer = UserSerializer(data=user_data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            student = Student.objects.get(id=user.id)  # Get the student instance created by signal

            profile, _ = StudentProfile.objects.get_or_create(user=student)
            profile_serializer = StudentProfileSerializer(profile, data=profile_data, partial=True)

            if profile_serializer.is_valid():
                profile_serializer.save()
                return Response({"message": "Student registered successfully"}, status=status.HTTP_201_CREATED)

            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class ProfessorRegisterView(APIView):
    def post(self, request):
        try:
            user_data = {
                "username": request.data.get("username"),
                "email": request.data.get("email"),
                "password": request.data.get("password"),
                "role": "PROFESSOR",
            }

            # Accept both canonical professor fields and legacy company_* keys
            profile_data = {
                # canonical
                "professor_name": request.data.get("professor_name") or request.data.get("company_name"),
                "university": request.data.get("university") or request.data.get("company_location"),
                "description": request.data.get("description") or request.data.get("company_description"),
                "website": request.data.get("website") or request.data.get("company_website"),
                "team_image": request.FILES.get("team_image") or request.FILES.get("company_logo"),
                "lab_first_image": request.FILES.get("lab_first_image") or request.FILES.get("company_office_first_image"),
                "lab_second_image": request.FILES.get("lab_second_image") or request.FILES.get("company_office_second_image"),
                "lab_third_image": request.FILES.get("lab_third_image") or request.FILES.get("company_office_third_image"),
                "position_description": request.data.get("position_description") or request.data.get("job_internship_vancancy"),
            }

            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                professor = Professor.objects.get(id=user.id)

                profile, _ = ProfessorProfile.objects.get_or_create(user=professor)  # Created by signal
                profile_serializer = ProfessorProfileSerializer(profile, data=profile_data, partial=True)
                if profile_serializer.is_valid():
                    profile = profile_serializer.save()

                    # Optional: handle multiple projects from payload JSON list under 'projects'
                    projects = request.data.get('projects')
                    if projects:
                        # Expect projects as list of dicts if using JSON; if multipart, it may be a JSON string
                        import json
                        if isinstance(projects, str):
                            try:
                                projects = json.loads(projects)
                            except Exception:
                                projects = []
                        if isinstance(projects, list):
                            for p in projects:
                                ProfessorProject.objects.create(
                                    profile=profile,
                                    title=p.get('title', ''),
                                    description=p.get('description', ''),
                                    modality=p.get('modality', None),
                                    location=p.get('location', None),
                                )
                    return Response({"message": "Professor registered successfully"}, status=status.HTTP_201_CREATED)

                return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Professor registration error:", str(e))
            import traceback
            traceback.print_exc()
            return Response({"error": "Internal server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class ProfessorJobListAPIView(APIView):
    def get(self, request):
        profiles = ProfessorProfile.objects.all()
        serializer = ProfessorProfileSerializer(profiles, many=True, context={'request': request})
        return Response(serializer.data)


class ProfessorProjectListCreateAPIView(APIView):
    def get(self, request, profile_id=None):
        qs = ProfessorProject.objects.all()
        if profile_id:
            qs = qs.filter(profile_id=profile_id)
        serializer = ProfessorProjectSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request, profile_id=None):
        data = request.data.copy()
        if profile_id:
            data['profile'] = profile_id
        serializer = ProfessorProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)