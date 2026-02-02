from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0002_alter_project_team_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_published',
            field=models.BooleanField(
                default=True,
                help_text="Si désactivé, le contenu reste en brouillon et n'apparaît pas publiquement.",
                verbose_name='Publié',
            ),
        ),
    ]
