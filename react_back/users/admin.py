from django.contrib import admin
from django.contrib.admin import ModelAdmin
from users.models import User, Role


# Register your models here.


class UserAdmin(ModelAdmin):
    list_display = ['id', 'username', 'role']


admin.site.register(User, UserAdmin),
admin.site.register(Role)