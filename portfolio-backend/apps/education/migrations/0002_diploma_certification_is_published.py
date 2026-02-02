from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('education', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='diploma',
            name='is_published',
            field=models.BooleanField(
                default=True,
                help_text="Si désactivé, le contenu reste en brouillon et n'apparaît pas publiquement.",
                verbose_name='Publié',
            ),
        ),
        migrations.AddField(
            model_name='certification',
            name='is_published',
            field=models.BooleanField(
                default=True,
                help_text="Si désactivé, le contenu reste en brouillon et n'apparaît pas publiquement.",
                verbose_name='Publié',
            ),
        ),
    ]
