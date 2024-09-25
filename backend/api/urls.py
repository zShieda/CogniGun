from django.urls import path
from .views import register, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import detect_objects

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detect/', detect_objects, name='detect_objects'),
]
