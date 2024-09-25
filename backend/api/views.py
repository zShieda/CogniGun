
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
import torch
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
from PIL import Image
import os


model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

# Custom registration view
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access for registration
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if the username already exists
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create the new user
    user = User.objects.create(username=username, password=make_password(password))
    
    # Optionally, create JWT token for the user upon successful registration
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'message': 'User registered successfully',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

# Custom JWT login view (optional)
class CustomTokenObtainPairView(TokenObtainPairView):
    # You can customize the JWT login behavior here if needed
    pass

def detect_objects(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided.'}, status=400)

    # Save the uploaded image temporarily
    image_file = request.FILES['image']
    file_path = default_storage.save('tmp/' + image_file.name, image_file)
    img = Image.open(file_path)

    # Perform object detection using YOLOv9
    results = model(img)

    # Delete the temporary image file
    os.remove(file_path)

    # Extract results (bounding boxes, labels, etc.)
    detections = results.pandas().xyxy[0].to_dict(orient="records")
    return Response({'detections': detections})
