from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        STUDENT = "STUDENT", "Student"
        PROFESSOR = "PROFESSOR", "Professor"

    role = models.CharField(max_length=50, choices=Role.choices, default=Role.ADMIN)

    def save(self, *args, **kwargs):
        if not self.pk:  # If creating a new instance
            self.role = self.role or self.Role.ADMIN  # Default to ADMIN if no role is set
        super().save(*args, **kwargs)

class StudentManager(BaseUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(role=User.Role.STUDENT)


class Student(User):

    base_role = User.Role.STUDENT

    student = StudentManager()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        self.role = User.Role.STUDENT
        return super().save(*args, **kwargs)


@receiver(post_save, sender=Student)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "STUDENT":
        StudentProfile.objects.create(user=instance)

# Student user for debugging : username = weijie, password = 1234 
class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) 
    given_name = models.CharField(max_length=100, blank=True, null=True)
    middle_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    nationality = models.CharField(max_length=100, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    major_chosen = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    transcript = models.FileField(upload_to='transcripts/', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} Profile"


class ProfessorManager(BaseUserManager):
    def get_queryset(self):
        return super().get_queryset().filter(role=User.Role.PROFESSOR)


class Professor(User):

    base_role = User.Role.PROFESSOR

    professors = ProfessorManager()

    class Meta:
        proxy = True

    def save(self, *args, **kwargs):
        self.role = User.Role.PROFESSOR
        return super().save(*args, **kwargs)

@receiver(post_save, sender=Professor)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == "PROFESSOR":
        ProfessorProfile.objects.create(user=instance)

class ProfessorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    professor_name = models.CharField(max_length=255, blank=True, null=True)
    university = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    profile_image = models.FileField(upload_to='professor_profile_images/', blank=True, null=True)
    lab_first_image = models.FileField(upload_to='professor_lab_images/', blank=True, null=True)
    lab_second_image = models.FileField(upload_to='professor_lab_images/', blank=True, null=True)
    lab_third_image = models.FileField(upload_to='professor_lab_images/', blank=True, null=True)
    position_description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} Professor Profile"


class ProfessorProject(models.Model):
    profile = models.ForeignKey(ProfessorProfile, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    modality = models.CharField(max_length=50, blank=True, null=True)  # e.g., Remote/On-site/Hybrid
    location = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.profile.professor_name or self.profile.user.username})"

