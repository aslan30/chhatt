# Generated by Django 5.1 on 2024-09-15 08:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='read',
            field=models.BooleanField(default=False),
        ),
    ]
