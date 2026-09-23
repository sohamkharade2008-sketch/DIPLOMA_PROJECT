import os
import sys
import io
from PIL import Image
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

client = TestClient(app)

def create_dummy_leaf_image():
    """Create an in-memory green leaf test image"""
    img = Image.new('RGB', (100, 100), color=(34, 139, 34))
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    return buf

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "AgroScan AI"
    assert "demoMode" in data

def test_diseases_catalog():
    response = client.get("/api/diseases")
    assert response.status_code == 200
    diseases = response.json()
    assert len(diseases) > 0
    assert any("Tomato" in d["plant"] for d in diseases)

def test_user_registration_and_login():
    test_email = f"tester_{os.getpid()}@example.com"
    # Register
    reg_resp = client.post("/api/auth/register", json={
        "name": "Test Agronomist",
        "email": test_email,
        "password": "Password123!"
    })
    assert reg_resp.status_code == 201
    reg_data = reg_resp.json()
    assert "access_token" in reg_data
    token = reg_data["access_token"]
    
    # Me endpoint
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == test_email

    # Login
    login_resp = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "Password123!"
    })
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()

def test_prediction_workflow():
    img_buf = create_dummy_leaf_image()
    files = {"file": ("test_leaf.jpg", img_buf, "image/jpeg")}
    
    # Upload and analyze
    response = client.post("/api/predictions", files=files)
    assert response.status_code == 201
    pred_data = response.json()
    assert "plant" in pred_data
    assert "disease" in pred_data
    assert "confidence" in pred_data
    assert pred_data["confidence"] > 0
    assert pred_data["isDemoPrediction"] is True
    assert "imageUrl" in pred_data
    pred_id = pred_data["id"]

    # Retrieve by ID
    get_resp = client.get(f"/api/predictions/{pred_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == pred_id

if __name__ == "__main__":
    print("Running AgroScan AI Backend Test Suite...")
    test_health_endpoint()
    print("[PASS] Health endpoint OK")
    test_diseases_catalog()
    print("[PASS] Disease catalog OK")
    test_user_registration_and_login()
    print("[PASS] User auth (Register, Login, Me) OK")
    test_prediction_workflow()
    print("[PASS] Prediction upload, AI demo analysis & retrieval OK")
    print("All backend tests passed successfully!")
