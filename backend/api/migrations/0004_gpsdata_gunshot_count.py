# Generated by Django 5.1 on 2024-10-07 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_gpsdata'),
    ]

    operations = [
        migrations.AddField(
            model_name='gpsdata',
            name='gunshot_count',
            field=models.IntegerField(default=1),
        ),
    ]