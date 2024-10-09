from datetime import date
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator


class User(AbstractUser):
    date_of_birth = models.DateField('Date of birth', null=True, blank=True)
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True,
        default='profile_pics/default.jpg',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    role = models.ForeignKey('Role', on_delete=models.CASCADE, null=True, blank=True)

    def get_age(self):
        if self.date_of_birth:
            today = date.today()
            age = today.year - self.date_of_birth.year - (
                        (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
            return age
        return None


class Role(models.Model):
    name = models.CharField('Name', max_length=70, unique=True)
    name_en = models.CharField('Name_en', max_length=75, unique=True)

    def __str__(self):
        return f"{self.id} - {self.name}"
