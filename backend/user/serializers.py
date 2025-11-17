from rest_framework import serializers
from .models import User, StudentProfile, ProfessorProfile, ProfessorProject

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'role')  # Include only the fields you need to return
        read_only_fields = ('id',)


class StudentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = (
            'given_name',
            'middle_name',
            'last_name',
            'nationality',
            'age',
            'language',
            'graduation_year',
            'major_chosen',
            'location',
            'phone_number',
            'transcript',
            'resume',
            # Algorithm fields
            'headline',
            'summary',
            'courses',
            'skills',
            'skills_text',
            'gpa',
            'hrs_per_week',
            'avail_start',
            'avail_end',
            'reliability',
        )


class ProfessorProfileSerializer(serializers.ModelSerializer):
    projects = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # Backward-compatible aliases for existing frontend fields
    company_name = serializers.CharField(source='professor_name', allow_blank=True, allow_null=True, required=False)
    company_location = serializers.CharField(source='university', allow_blank=True, allow_null=True, required=False)
    company_description = serializers.CharField(source='description', allow_blank=True, allow_null=True, required=False)
    company_website = serializers.CharField(source='website', allow_blank=True, allow_null=True, required=False)
    company_logo = serializers.FileField(source='profile_image', allow_empty_file=True, required=False)
    company_office_first_image = serializers.FileField(source='lab_first_image', allow_empty_file=True, required=False)
    company_office_second_image = serializers.FileField(source='lab_second_image', allow_empty_file=True, required=False)
    company_office_third_image = serializers.FileField(source='lab_third_image', allow_empty_file=True, required=False)
    job_internship_vancancy = serializers.CharField(source='position_description', allow_blank=True, allow_null=True, required=False)

    class Meta:
        model = ProfessorProfile
        fields = (
            # New canonical fields
            'id', 'user', 'professor_name', 'university', 'description', 'website',
            'profile_image', 'lab_first_image', 'lab_second_image', 'lab_third_image', 'position_description',
            'projects',
            # Backward-compatible aliases used by current frontend
            'company_name', 'company_location', 'company_description', 'company_website',
            'company_logo', 'company_office_first_image', 'company_office_second_image', 'company_office_third_image',
            'job_internship_vancancy',
        )


class ProfessorProjectSerializer(serializers.ModelSerializer):
    professor_name = serializers.CharField(source='profile.professor_name', read_only=True)
    university = serializers.CharField(source='profile.university', read_only=True)
    profile_image = serializers.FileField(source='profile.profile_image', read_only=True)
    
    class Meta:
        model = ProfessorProject
        fields = (
            'id', 'profile', 'title', 'description', 'modality', 'location', 'created_at',
            # Algorithm fields
            'required_skills',
            'hrs_per_week',
            'start_date',
            'end_date',
            'capacity',
            'is_open',
            # Profile fields
            'professor_name',
            'university',
            'profile_image',
        )