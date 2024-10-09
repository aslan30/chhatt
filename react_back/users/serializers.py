from rest_framework import serializers as s

from users.models import User


class RegisterSerializers(s.ModelSerializer):
    password = s.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'profile_picture', 'date_of_birth', 'password', 'email']

    def create(self, validated_data):
        profile_picture = validated_data.get('profile_picture',
                                             'profile_pics/default.jpg')  # Установка значения по умолчанию
        user = User(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            profile_picture=profile_picture,
            date_of_birth=validated_data.get('date_of_birth')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(s.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'profile_picture', 'date_of_birth', 'email', 'password']


class UserUpdateSerializer(s.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'profile_picture', 'email']
        extra_kwargs = {
            'profile_picture': {
                'required': False,
            }
        }

    def update(self, instance: User, validated_data):
        first_name = validated_data.pop('first_name', instance.first_name).capitalize()
        last_name = validated_data.pop('last_name', instance.last_name).capitalize()

        instance.first_name = first_name
        instance.last_name = last_name

        return super().update(instance, validated_data)
