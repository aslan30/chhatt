# Generated by Django 5.1 on 2024-09-28 22:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0004_alter_chat_file'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='deleted_for_sender',
            field=models.BooleanField(default=False),
        ),
    ]
