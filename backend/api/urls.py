from django.urls import path
from .views import register, CustomTokenObtainPairView, detect_objects, list_images, GPSDataView, get_gps_data, UserProfileView, solenoid_command
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detect/', detect_objects, name='detect_objects'),
    path('images/', list_images, name='list_images'), 
    path('gps-data/', GPSDataView.as_view(), name='gps_data'),
    path('get-gps-data/', get_gps_data, name='get_gps_data'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('solenoid-command/', solenoid_command, name='solenoid-command'),
]
