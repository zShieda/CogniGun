from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
import torch
from django.core.files.storage import default_storage
from PIL import Image
import os
from django.http import JsonResponse
from ultralytics import YOLO
import cv2
import numpy as np

# Load the YOLOv9 model
model = YOLO("yolov9c.pt")

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

# Object detection endpoint using YOLOv9
@api_view(['POST'])  # Allow only POST requests
@permission_classes([AllowAny])  # Optional: Use permission as needed
def detect_objects(request):
    try:
        # Get the uploaded image
        image_file = request.FILES['image']
        
        # Convert image to a numpy array and decode it
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        # Run YOLOv9 model on the image
        results = model(img)

        # Collect detection results
        detections = []
        for r in results:
            for i, box in enumerate(r.boxes.xyxy.tolist()):
                detections.append({
                    "xmin": box[0], 
                    "ymin": box[1], 
                    "xmax": box[2], 
                    "ymax": box[3],
                    "confidence": r.boxes.conf[i].item(),
                    "class": r.boxes.cls[i].item()
                })

        # Return the detections as a JSON response
        return JsonResponse({"detections": detections})
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
