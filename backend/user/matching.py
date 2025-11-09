"""
Matching algorithm implementation for student-project matching.
This is a simplified version that works with Django models.
"""
from typing import List, Dict, Optional
from datetime import date
from django.db.models import Q
from .models import StudentProfile, ProfessorProject
import json


def calculate_skill_coverage(student_skills: List[str], required_skills: List[str]) -> float:
    """Calculate skill coverage percentage (0.0 to 1.0)"""
    if not required_skills:
        return 1.0
    if not student_skills:
        return 0.0
    
    student_skills_lower = [s.lower().strip() for s in student_skills]
    required_skills_lower = [s.lower().strip() for s in required_skills]
    
    matching = len(set(student_skills_lower) & set(required_skills_lower))
    return matching / len(required_skills_lower) if required_skills_lower else 0.0


def calculate_availability_overlap(
    student_start: Optional[date],
    student_end: Optional[date],
    project_start: Optional[date],
    project_end: Optional[date],
    student_hrs: Optional[int],
    project_hrs: Optional[int]
) -> float:
    """Calculate availability overlap (0.0 to 1.0)"""
    # Date overlap
    if not student_start or not student_end or not project_start or not project_end:
        date_overlap = 0.5  # Default if dates missing
    else:
        overlap_start = max(student_start, project_start)
        overlap_end = min(student_end, project_end)
        if overlap_end <= overlap_start:
            date_overlap = 0.0
        else:
            student_days = (student_end - student_start).days + 1
            project_days = (project_end - project_start).days + 1
            overlap_days = (overlap_end - overlap_start).days + 1
            total_days = max((max(student_end, project_end) - min(student_start, project_start)).days + 1, 1)
            date_overlap = overlap_days / total_days if total_days > 0 else 0.0
    
    # Hours overlap
    if not student_hrs or not project_hrs or student_hrs <= 0 or project_hrs <= 0:
        hrs_overlap = 0.5
    else:
        diff = abs(student_hrs - project_hrs)
        hrs_overlap = max(0.0, 1.0 - diff / max(student_hrs, project_hrs))
    
    return 0.6 * date_overlap + 0.4 * hrs_overlap


def calculate_student_potential(gpa: Optional[float], reliability: Optional[float]) -> float:
    """Calculate student potential score (0.0 to 1.0)"""
    # Normalize GPA (assuming 0-4.0 scale, convert to 0-1)
    gpa_norm = (gpa / 4.0) if gpa and gpa > 0 else 0.5
    reliability_norm = float(reliability) if reliability else 0.5
    
    return 0.6 * gpa_norm + 0.4 * reliability_norm


def calculate_match_score(
    student: StudentProfile,
    project: ProfessorProject,
    skill_coverage: float,
    availability: float,
    potential: float
) -> Dict:
    """Calculate overall match score for a student-project pair"""
    # Text similarity (simplified - in production, use embeddings)
    # For now, use skill coverage as a proxy
    text_similarity = skill_coverage
    
    # Fit score
    fit = 0.35 * text_similarity + 0.50 * skill_coverage + 0.15 * availability
    
    # Acceptance probability (simplified)
    p_accept = 0.65 * text_similarity + 0.35 * availability
    
    # Performance score
    perf = 0.6 * potential + 0.4 * skill_coverage
    
    # Overall score (weighted)
    score = 0.35 * p_accept + 0.45 * perf + 0.20 * fit
    
    # Apply coverage gate (minimum skill coverage required)
    if skill_coverage < 0.3:
        score *= 0.5  # Reduce score significantly if low coverage
    elif skill_coverage < 0.5:
        score *= 0.85  # Slight reduction
    
    return {
        'score': round(score, 4),
        'fit': round(fit, 4),
        'p_accept': round(p_accept, 4),
        'perf': round(perf, 4),
        'skill_coverage': round(skill_coverage, 4),
        'availability': round(availability, 4),
        'potential': round(potential, 4),
    }


def get_student_matches(student_id: int, limit: int = 20) -> List[Dict]:
    """
    Get matching projects for a student.
    Returns list of projects with match scores, sorted by score.
    """
    try:
        student_profile = StudentProfile.objects.get(user_id=student_id)
    except StudentProfile.DoesNotExist:
        return []
    
    # Get student data
    student_skills = student_profile.skills or []
    student_hrs = student_profile.hrs_per_week or 0
    student_start = student_profile.avail_start
    student_end = student_profile.avail_end
    student_gpa = float(student_profile.gpa) if student_profile.gpa else None
    student_reliability = float(student_profile.reliability) if student_profile.reliability else None
    
    # Calculate potential once
    potential = calculate_student_potential(student_gpa, student_reliability)
    
    # Get all open projects
    projects = ProfessorProject.objects.filter(is_open=True).select_related('profile')
    
    matches = []
    for project in projects:
        # Calculate features
        required_skills = project.required_skills or []
        skill_coverage = calculate_skill_coverage(student_skills, required_skills)
        availability = calculate_availability_overlap(
            student_start, student_end,
            project.start_date, project.end_date,
            student_hrs, project.hrs_per_week
        )
        
        # Calculate match score
        match_data = calculate_match_score(
            student_profile, project, skill_coverage, availability, potential
        )
        
        # Get project details
        project_data = {
            'project_id': project.id,
            'title': project.title,
            'description': project.description,
            'professor_name': project.profile.professor_name or project.profile.user.username,
            'university': project.profile.university,
            'required_skills': required_skills,
            'hrs_per_week': project.hrs_per_week,
            'start_date': project.start_date.isoformat() if project.start_date else None,
            'end_date': project.end_date.isoformat() if project.end_date else None,
            'capacity': project.capacity,
            'modality': project.modality,
            'location': project.location,
            'profile_image': project.profile.profile_image.url if project.profile.profile_image else None,
        }
        
        # Combine match data with project data
        project_data.update(match_data)
        matches.append(project_data)
    
    # Sort by score (descending)
    matches.sort(key=lambda x: x['score'], reverse=True)
    
    return matches[:limit]


def get_project_matches(project_id: int, limit: int = 20) -> List[Dict]:
    """
    Get matching students for a project.
    Returns list of students with match scores, sorted by score.
    """
    try:
        project = ProfessorProject.objects.get(id=project_id)
    except ProfessorProject.DoesNotExist:
        return []
    
    # Get project data
    required_skills = project.required_skills or []
    project_hrs = project.hrs_per_week or 0
    project_start = project.start_date
    project_end = project.end_date
    
    # Get all students with profiles
    students = StudentProfile.objects.all().select_related('user')
    
    matches = []
    for student in students:
        # Calculate features
        student_skills = student.skills or []
        skill_coverage = calculate_skill_coverage(student_skills, required_skills)
        availability = calculate_availability_overlap(
            student.avail_start, student.avail_end,
            project_start, project_end,
            student.hrs_per_week or 0, project_hrs
        )
        potential = calculate_student_potential(
            float(student.gpa) if student.gpa else None,
            float(student.reliability) if student.reliability else None
        )
        
        # Calculate match score
        match_data = calculate_match_score(
            student, project, skill_coverage, availability, potential
        )
        
        # Get student details
        student_data = {
            'student_id': student.user.id,
            'username': student.user.username,
            'email': student.user.email,
            'given_name': student.given_name,
            'last_name': student.last_name,
            'headline': student.headline,
            'summary': student.summary,
            'skills': student_skills,
            'courses': student.courses or [],
            'gpa': float(student.gpa) if student.gpa else None,
            'hrs_per_week': student.hrs_per_week,
            'major_chosen': student.major_chosen,
            'graduation_year': student.graduation_year,
        }
        
        # Combine match data with student data
        student_data.update(match_data)
        matches.append(student_data)
    
    # Sort by score (descending)
    matches.sort(key=lambda x: x['score'], reverse=True)
    
    return matches[:limit]

