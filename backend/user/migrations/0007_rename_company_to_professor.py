from django.db import migrations

def update_roles_company_to_professor(apps, schema_editor):
    User = apps.get_model('user', 'User')
    User.objects.filter(role='COMPANY').update(role='PROFESSOR')

class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_remove_companyprofile_teacher_id_and_more'),
    ]

    operations = [
        # 1) Rename the model (table) in place
        migrations.RenameModel(
            old_name='CompanyProfile',
            new_name='ProfessorProfile',
        ),

        # 2) Rename columns in place
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_name',
            new_name='professor_name',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_location',
            new_name='university',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_description',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_website',
            new_name='website',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_logo',
            new_name='team_image',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_office_first_image',
            new_name='lab_first_image',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_office_second_image',
            new_name='lab_second_image',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='company_office_third_image',
            new_name='lab_third_image',
        ),
        migrations.RenameField(
            model_name='professorprofile',
            old_name='job_internship_vancancy',
            new_name='position_description',
        ),

        # 3) Update existing users' role values
        migrations.RunPython(update_roles_company_to_professor, migrations.RunPython.noop),
    ]