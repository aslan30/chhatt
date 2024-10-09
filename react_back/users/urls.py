from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from users.views import RegisterAPIView, CurrentUserAPIView, UserListAPIView, UserDetailView, UpdateUserAPIView, \
    VerifyPasswordAPIView

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('current_user/', CurrentUserAPIView.as_view(), name='current_user'),
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('update_user/', UpdateUserAPIView.as_view(), name='update_user'),
    path('verify_password/', VerifyPasswordAPIView.as_view(), name='verify_password'),
]
