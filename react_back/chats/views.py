from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from chats.models import Chat
from chats.serializers import ChatSerializer
from users.models import User
from users.serializers import UserSerializer


class SendMessageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        content = request.data.get('content', '')
        file = request.FILES.get('file', None)

        chat = Chat(
            sender=request.user,
            receiver_id=request.data.get('receiver'),
            content=content,
            file=file
        )
        chat.save()

        serializer = ChatSerializer(chat)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserMessagesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sender_id = request.query_params.get('sender')
        receiver_id = request.query_params.get('receiver')

        if not sender_id or not receiver_id:
            return Response({"detail": "Требуются id отправителя и получателя."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            current_user = request.user

            if not (User.objects.filter(id=sender_id).exists() and User.objects.filter(id=receiver_id).exists()):
                return Response({"detail": "Неверный id отправителя или получателя."},
                                status=status.HTTP_400_BAD_REQUEST)

            messages = Chat.objects.filter(
                (Q(sender_id=sender_id) & Q(receiver_id=receiver_id)) |
                (Q(sender_id=receiver_id) & Q(receiver_id=sender_id))
            ).prefetch_related('sender', 'receiver')

            for message in messages:
                if message.receiver == current_user and not message.read:
                    message.read = True
                    message.save()

            filtered_messages = [
                message for message in messages if message.is_visible_for_user(current_user)
            ]

            serializer = ChatSerializer(filtered_messages, many=True)

            return Response({'messages': serializer.data}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error fetching messages: {str(e)}")  # Log the error
            return Response({"detail": "Произошла ошибка при загрузке сообщений."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ListChatsAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user_id = request.user.id

        try:
            received_messages = Chat.objects.filter(receiver=current_user_id).values('sender').distinct()
            sent_messages = Chat.objects.filter(sender=current_user_id).values('receiver').distinct()

            all_user_ids = set(
                [msg['sender'] for msg in received_messages] +
                [msg['receiver'] for msg in sent_messages]
            )

            conversations = []
            for user_id in all_user_ids:
                latest_message = Chat.objects.filter(
                    Q(sender=current_user_id, receiver=user_id) |
                    Q(sender=user_id, receiver=current_user_id)
                ).order_by('-created_at').first()

                if latest_message:
                    user_profile = UserSerializer(User.objects.get(id=user_id)).data
                    unread_count = Chat.objects.filter(sender=user_id, receiver=current_user_id, read=False).count()
                    conversations.append({
                        'user_id': user_id,
                        'user_profile': user_profile,
                        'latest_message': latest_message.content,
                        'latest_message_date': latest_message.created_at,
                        'unread_count': unread_count,
                    })

            conversations_sorted = sorted(conversations, key=lambda x: x['latest_message_date'], reverse=True)

            return Response({'conversations': conversations_sorted}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "User не найден."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MarkMessagesReadAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        receiver_id = request.data.get('receiver')
        sender_id = request.data.get('sender')

        if not receiver_id or not sender_id:
            return Response({"detail": "Требуются id отправителя и получателя.."}, status=status.HTTP_400_BAD_REQUEST)

        Chat.objects.filter(sender=receiver_id, receiver=sender_id, read=False).update(read=True)
        return Response({"detail": "Сообщения отмечены как прочитанные."}, status=status.HTTP_200_OK)


class UpdateMessageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, message_id):
        try:
            message = Chat.objects.get(id=message_id, sender=request.user)
            message.content = request.data.get('content', message.content)
            if 'file' in request.FILES:
                message.file = request.FILES['file']
            message.save()

            serializer = ChatSerializer(message)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Chat.DoesNotExist:
            return Response({"detail": "Сообщение не найдено."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteMessageAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):
        try:
            message = get_object_or_404(Chat, id=message_id)
            user = request.user

            delete_type = request.data.get('delete_type', 'self')

            if delete_type == 'both':
                message.delete()
                return Response({"detail": "Сообщение удалено для обоих пользователей.."},
                                status=status.HTTP_204_NO_CONTENT)
            else:
                if user == message.sender:
                    message.deleted_for_sender = True
                elif user == message.receiver:
                    message.deleted_for_receiver = True
                else:
                    return Response({"detail": "У вас нет разрешения на удаление этого сообщения."},
                                    status=status.HTTP_403_FORBIDDEN)

                message.save()

                return Response({"detail": "Сообщение отмечено как удаленное для текущего пользователя."},
                                status=status.HTTP_204_NO_CONTENT)

        except Chat.DoesNotExist:
            return Response({"detail": "Сообщение не найдено."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ClearUserMessagesAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        delete_type = request.query_params.get('delete_type')
        receiver_id = request.query_params.get('receiver_id')
        user = request.user

        try:
            if not receiver_id:
                return Response({"detail": "Требуется ID получателя."}, status=status.HTTP_400_BAD_REQUEST)

            if delete_type == 'both':
                Chat.objects.filter(sender=user, receiver_id=receiver_id).delete()
                Chat.objects.filter(sender_id=receiver_id, receiver=user).delete()
                return Response({"detail": "Все сообщения удалены для обоих пользователей."},
                                status=status.HTTP_204_NO_CONTENT)

            messages_sent = Chat.objects.filter(sender=user, receiver_id=receiver_id)
            messages_received = Chat.objects.filter(sender_id=receiver_id, receiver=user)

            messages_sent.update(deleted_for_sender=True)
            messages_received.update(deleted_for_receiver=True)

            return Response({"detail": "Сообщения помечены как удаленные для текущего пользователя."},
                            status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
