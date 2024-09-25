from django.urls import path
from .views import register, CustomTokenObtainPairView, detect_objects
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detect/', detect_objects, name='detect_objects'),
]
