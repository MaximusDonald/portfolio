from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('professional', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='experience',
            name='is_published',
            field=models.BooleanField(
                default=True,
                help_text="Si désactivé, le contenu reste en brouillon et n'apparaît pas publiquement.",
                verbose_name='Publié',
            ),
        ),
        migrations.AddField(
            model_name='training',
            name='is_published',
            field=models.BooleanField(
                default=True,
                help_text="Si désactivé, le contenu reste en brouillon et n'apparaît pas publiquement.",
                verbose_name='Publié',
            ),
        ),
    ]
