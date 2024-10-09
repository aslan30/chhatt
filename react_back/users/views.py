from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from users.models import User
from users.serializers import RegisterSerializers, UserSerializer, UserUpdateSerializer


# Create your views here.


class RegisterAPIView(APIView):
    def post(self, request):
        register_serializer = RegisterSerializers(data=request.data)

        if register_serializer.is_valid():
            register_serializer.save()
            return Response(register_serializer.data, status=status.HTTP_201_CREATED)
        return Response(register_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UpdateUserAPIView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListAPIView(generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()

        search_query = self.request.query_params.get('search', '')
        if search_query:
            queryset = queryset.filter(
                first_name__icontains=search_query
            ) | queryset.filter(
                last_name__icontains=search_query
            )

        return queryset

    def get(self, request: Request, *args, **kwargs):
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 5))
        if limit <= 0:
            limit = 5
        start_index = (page - 1) * limit
        end_index = start_index + limit

        queryset = self.get_queryset()
        all_users = list(queryset)
        paginated_users = all_users[start_index:end_index]

        serializer = self.get_serializer(paginated_users, many=True)
        response_data = {
            'result': serializer.data,
            'count': len(all_users),
            'page': page,
            'limit': limit
        }

        return Response(response_data)


class VerifyPasswordAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Требуется ввести пароль'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=request.user.username, password=password)
        if user is not None:
            return Response({'status': 'OK'}, status=status.HTTP_200_OK)
        return Response({'error': 'Неверный пароль'}, status=status.HTTP_400_BAD_REQUEST)


class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
