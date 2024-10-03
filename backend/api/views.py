from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from django.core.files.storage import default_storage
from django.http import JsonResponse
from ultralytics import YOLO
from django.conf import settings
import cv2
import numpy as np
import os
from .models import Profile
from rest_framework.permissions import IsAuthenticated

# Load YOLOv9 model
model = YOLO(os.path.join(settings.BASE_DIR, "runs", "detect", "yolov9_handguns2", "weights", "best.pt"))

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    required_fields = ['username', 'password', 'firstname', 'lastname', 'middlename', 'birthday', 'age', 'address', 'contact_number', 'id_number', 'email']
    
    # Validate input
    for field in required_fields:
        if field not in request.data:
            return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)

    username = request.data['username']
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create user
    user = User.objects.create(
        username=username,
        password=make_password(request.data['password']),
        email=request.data['email']
    )

    # Create profile
    Profile.objects.create(
        user=user,
        firstname=request.data['firstname'],
        lastname=request.data['lastname'],
        middlename=request.data['middlename'],
        birthday=request.data['birthday'],
        age=request.data['age'],
        address=request.data['address'],
        contact_number=request.data['contact_number'],
        id_number=request.data['id_number']
    )

    refresh = RefreshToken.for_user(user)

    return Response({
        'message': 'User registered successfully',
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }, status=status.HTTP_201_CREATED)

# Custom JWT login view (optional)
class CustomTokenObtainPairView(TokenObtainPairView):
    pass

# Object detection endpoint using YOLOv9
@api_view(['POST'])
@permission_classes([AllowAny])
def detect_objects(request):
    try:
        # Save the uploaded image to 'original_images' directory
        image_file = request.FILES['image']
        original_image_path = os.path.join(settings.ORIGINAL_IMAGES_DIR, image_file.name)
        
        with default_storage.open(original_image_path, 'wb+') as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)

        # Load the saved image from disk for processing (not directly from request)
        img = cv2.imread(original_image_path)

        # Perform object detection using YOLOv9
        results = model(img)

        # Extract class names from detection results
        detected_classes = set()
        for r in results:
            for i in range(len(r.boxes)):
                class_id = int(r.boxes.cls[i])
                class_name = r.names[class_id]
                detected_classes.add(class_name)

        # Generate a dynamic filename based on detected classes
        if detected_classes:
            detected_classes_str = "_".join(detected_classes)  # Join all detected classes with underscores
        else:
            detected_classes_str = "no_detection"

        # Draw bounding boxes on the image
        for r in results:
            for i, box in enumerate(r.boxes.xyxy.tolist()):
                # Draw a rectangle around each detected object
                cv2.rectangle(img, (int(box[0]), int(box[1])), (int(box[2]), int(box[3])), (0, 255, 0), 2)

        # Save the image with bounding boxes to 'detected_images' directory
        detected_image_name = f"detected_{detected_classes_str}_{image_file.name}"
        detected_image_path = os.path.join(settings.DETECTED_IMAGES_DIR, detected_image_name)
        cv2.imwrite(detected_image_path, img)

        # Prepare detection data
        detections = []
        for r in results:
            for i, box in enumerate(r.boxes.xyxy.tolist()):
                detections.append({
                    "xmin": box[0],
                    "ymin": box[1],
                    "xmax": box[2],
                    "ymax": box[3],
                    "confidence": float(r.boxes.conf[i]),
                    "class": r.names[int(r.boxes.cls[i])]  # Use class name instead of ID
                })

        # Return response with detections and image URLs
        return JsonResponse({
            "detections": detections,
            "original_image_url": f"{settings.MEDIA_URL}original_images/{image_file.name}",
            "detected_image_url": f"{settings.MEDIA_URL}detected_images/{detected_image_name}"
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def list_images(request):
    original_images = []
    detected_images = []

    original_images_dir = settings.ORIGINAL_IMAGES_DIR
    detected_images_dir = settings.DETECTED_IMAGES_DIR

    # Fetch original images
    for filename in os.listdir(original_images_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            original_images.append(f"{settings.MEDIA_URL}original_images/{filename}")

    # Fetch detected images
    for filename in os.listdir(detected_images_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            detected_images.append(f"{settings.MEDIA_URL}detected_images/{filename}")

    return JsonResponse({
        'original_images': original_images,
        'detected_images': detected_images
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    profile = Profile.objects.get(user=user)

    user_data = {
        'username': user.username,
        'firstname': profile.firstname,
        'lastname': profile.lastname,
        'email': user.email,
        'contact_number': profile.contact_number,
        'address': profile.address,
        'id_number': profile.id_number,
    }

    return Response(user_data)