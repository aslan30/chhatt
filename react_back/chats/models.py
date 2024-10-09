from django.conf import settings
from django.core.validators import FileExtensionValidator
from django.db import models as m


class Chat(m.Model):
    sender = m.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=m.CASCADE)
    receiver = m.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=m.CASCADE)
    content = m.TextField()
    file = m.FileField(upload_to='chat_files/', blank=True, null=True,
                       validators=[
                           FileExtensionValidator(
                               allowed_extensions=[
                                   'jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls',
                                   'xlsx', 'ppt', 'pptx', 'mp3', 'wav', 'mp4', 'avi', 'mov',
                                   'zip', 'rar', 'txt', 'csv', 'json', 'xml'
                               ]
                           )
                       ])
    created_at = m.DateTimeField(auto_now_add=True)
    read = m.BooleanField(default=False)
    deleted_for_sender = m.BooleanField(default=False)
    deleted_for_receiver = m.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender} to {self.receiver} at {self.created_at}"

    def is_visible_for_user(self, user):
        return not (self.deleted_for_sender if user == self.sender else self.deleted_for_receiver)

    def delete_for_sender(self):
        self.deleted_for_sender = True
        self.save()

    def delete_for_receiver(self):
        self.deleted_for_receiver = True
        self.save()

    def delete_for_both(self):
        self.deleted_for_sender = True
        self.deleted_for_receiver = True
        self.save()

    def mark_as_read(self):
        self.read = True
        self.save()