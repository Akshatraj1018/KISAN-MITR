import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
import torchvision.transforms as transforms
import numpy as np

# 10 Soil Categories sorted alphabetically
SOIL_CLASSES = [
    "Alluvial Soil",
    "Black Soil",
    "Cinder Soil",
    "Clayey Soil",
    "Laterite Soil",
    "Loamy Soil",
    "Peat Soil",
    "Sandy Loam",
    "Sandy Soil",
    "Yellow Soil"
]

class SoilCNN(nn.Module):
    """
    4-Layer Deep Convolutional Neural Network for Soil Texture & Classification
    Architecture:
      Conv2D(32, 3x3) -> MaxPool(2x2)
      Conv2D(64, 3x3) -> MaxPool(2x2)
      Conv2D(128, 3x3) -> MaxPool(2x2)
      Conv2D(128, 3x3) -> MaxPool(2x2)
      Flatten (18432) -> Dense(512, ReLU) -> Dropout(0.5) -> Dense(10, Softmax)
    """
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)
        self.pool2 = nn.MaxPool2d(2, 2)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3)
        self.pool3 = nn.MaxPool2d(2, 2)
        self.conv4 = nn.Conv2d(128, 128, kernel_size=3)
        self.pool4 = nn.MaxPool2d(2, 2)
        
        self.fc1 = nn.Linear(18432, 512)
        self.dropout = nn.Dropout(0.5)
        self.fc2 = nn.Linear(512, num_classes)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.pool2(F.relu(self.conv2(x)))
        x = self.pool3(F.relu(self.conv3(x)))
        x = self.pool4(F.relu(self.conv4(x)))
        # NHWC format alignment from Keras weight conversion
        x = x.permute(0, 2, 3, 1).contiguous()
        x = x.view(x.size(0), -1)
        x = F.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x

class SoilInferenceEngine:
    def __init__(self, weights_path: str):
        # Prefer Apple Silicon MPS if available, fallback to CPU
        self.device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        self.model = SoilCNN(num_classes=len(SOIL_CLASSES))
        self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
        self.model.to(self.device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(), # Scales [0, 255] to [0.0, 1.0]
        ])

    def predict(self, image: Image.Image):
        """
        Runs forward pass on PIL Image and returns (predicted_class, confidence, probabilities)
        """
        img_rgb = image.convert("RGB")
        tensor = self.transform(img_rgb).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probs = F.softmax(logits, dim=1).cpu().numpy()[0]

        top_idx = int(np.argmax(probs))
        confidence = float(probs[top_idx])
        predicted_class = SOIL_CLASSES[top_idx]

        # Estimate surface moisture from RGB luminescence and saturation
        np_img = np.array(img_rgb.resize((100, 100)))
        brightness = float(np.mean(np_img))
        # Darker soil usually correlates with higher moisture content
        estimated_moisture = max(20.0, min(85.0, 100.0 - (brightness / 255.0) * 80.0))

        return {
            "soil_type": predicted_class,
            "confidence": round(confidence * 100, 2),
            "estimated_moisture_percent": round(estimated_moisture, 1),
            "all_scores": {SOIL_CLASSES[i]: round(float(probs[i]) * 100, 2) for i in range(len(SOIL_CLASSES))}
        }
