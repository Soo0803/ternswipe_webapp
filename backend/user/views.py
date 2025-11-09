from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, StudentProfileSerializer, ProfessorProfileSerializer, ProfessorProjectSerializer
from .models import Student, StudentProfile, ProfessorProfile, Professor, ProfessorProject
from rest_framework.authtoken.models import Token
from .matching import get_student_matches, get_project_matches



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

        # Parse JSON fields if they come as strings
        import json
        courses = request.data.get("courses")
        if isinstance(courses, str):
            try:
                courses = json.loads(courses)
            except:
                courses = []
        
        skills = request.data.get("skills")
        if isinstance(skills, str):
            try:
                skills = json.loads(skills)
            except:
                skills = []

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
            # Algorithm fields
            "headline": request.data.get("headline"),
            "summary": request.data.get("summary"),
            "courses": courses if courses else [],
            "skills": skills if skills else [],
            "skills_text": request.data.get("skills_text"),
            "gpa": request.data.get("gpa"),
            "hrs_per_week": request.data.get("hrs_per_week"),
            "avail_start": request.data.get("avail_start"),
            "avail_end": request.data.get("avail_end"),
            "reliability": request.data.get("reliability"),
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
                                # Parse JSON fields if they come as strings
                                required_skills = p.get('required_skills', [])
                                if isinstance(required_skills, str):
                                    try:
                                        required_skills = json.loads(required_skills)
                                    except:
                                        required_skills = []
                                
                                ProfessorProject.objects.create(
                                    profile=profile,
                                    title=p.get('title', ''),
                                    description=p.get('description', ''),
                                    modality=p.get('modality', None),
                                    location=p.get('location', None),
                                    # Algorithm fields
                                    required_skills=required_skills if required_skills else [],
                                    hrs_per_week=p.get('hrs_per_week'),
                                    start_date=p.get('start_date'),
                                    end_date=p.get('end_date'),
                                    capacity=p.get('capacity', 1),
                                    is_open=True,
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


class StudentMatchesAPIView(APIView):
    """Get matching projects for a student"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        limit = int(request.query_params.get('limit', 20))
        
        try:
            # Check if user has a student profile
            from .models import StudentProfile
            try:
                student_profile = StudentProfile.objects.get(user=user)
            except StudentProfile.DoesNotExist:
                return Response({
                    'error': 'Student profile not found. Please complete your registration.',
                    'matches': [],
                    'count': 0
                }, status=status.HTTP_404_NOT_FOUND)
            
            matches = get_student_matches(user.id, limit=limit)
            return Response({
                'matches': matches,
                'count': len(matches)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProjectMatchesAPIView(APIView):
    """Get matching students for a project"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, project_id):
        limit = int(request.query_params.get('limit', 20))
        
        try:
            matches = get_project_matches(project_id, limit=limit)
            return Response({
                'matches': matches,
                'count': len(matches)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AllProjectsAPIView(APIView):
    """Get all open projects for students to browse"""
    
    def get(self, request):
        projects = ProfessorProject.objects.filter(is_open=True).select_related('profile')
        serializer = ProfessorProjectSerializer(projects, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)