from rest_framework import serializers
from chats.models import Chat
from users.serializers import UserSerializer


class ChatSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'content', 'created_at', 'file', 'read', 'sender', 'receiver', 'deleted_for_receiver',
                  'deleted_for_sender']
        read_only_fields = ['sender', 'receiver', 'created_at', 'read']

    def update(self, instance, validated_data):
        instance.content = validated_data.get('content', instance.content)
        if 'file' in validated_data:
            if validated_data['file'] is None:
                instance.file.delete(save=False)
                instance.file = None
            else:
                instance.file = validated_data['file']

        instance.save()
        return instance

    def validate(self, data):
        if 'content' in data and len(data['content']) > 500:
            raise serializers.ValidationError("Content is too long. Max length is 500 characters.")
        return data
