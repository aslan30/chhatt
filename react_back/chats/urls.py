from django.urls import path
from chats.views import SendMessageAPIView, UserMessagesAPIView, ListChatsAPIView, MarkMessagesReadAPIView, \
    UpdateMessageAPIView, DeleteMessageAPIView, ClearUserMessagesAPIView

urlpatterns = [
    path('send/', SendMessageAPIView.as_view(), name='send_message'),
    path('messages/', UserMessagesAPIView.as_view(), name='user_messages'),
    path('list_chats/', ListChatsAPIView.as_view(), name='list_chats'),
    path('chats/mark_read/', MarkMessagesReadAPIView.as_view(), name='mark_messages_read'),
    path('messages/update/<int:message_id>/', UpdateMessageAPIView.as_view(), name='update_message'),
    path('messages/delete/<int:message_id>/', DeleteMessageAPIView.as_view(), name='delete_message'),
    path('messages/clear/', ClearUserMessagesAPIView.as_view(), name='clear_user_messages'),
]
