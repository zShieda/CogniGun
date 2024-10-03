import torch
from roboflow import Roboflow
from ultralytics import YOLO

def main():
    # Check for GPU availability
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Set up Roboflow
    try:
    
        rf = Roboflow(api_key="jTTyTyLU3UjXUX6uaPJK")
        project = rf.workspace("handguns").project("cognigun")
        version = project.version(16)
        dataset = version.download("yolov9")
                
    except Exception as e:
        print(f"Error setting up Roboflow: {e}")
        raise

    # Load model and train
    model = YOLO('yolov9c.pt').to(device)
    
    print("Starting training...")
    try:
        results = model.train(
            data=dataset.location + '/data.yaml',
            epochs=100,
            imgsz=640,  # Reduced from 640
            batch=4,    # Reduced from 16
            name='yolov9_handguns',
            save_period=10,
            device=device,
            workers=4,  # Reduced from 8
            amp=False,   # Enable mixed precision training
            patience=10  # Early stopping patience
            
            
        )
        print("Training complete.")
    except Exception as e:
        print(f"Error during training: {e}")
        raise

    # Evaluate the model
    try:
        results = model.val()
        print(f"Validation results: {results}")
    except Exception as e:
        print(f"Error during validation: {e}")

    # Export the model
    try:
        model.export(format="onnx")
        print("Model exported successfully.")
    except Exception as e:
        print(f"Error exporting model: {e}")

if __name__ == '__main__':
    main()








                