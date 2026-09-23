# AgroScan AI 🌿

> **Smart Plant Leaf Disease Detection & Agricultural Diagnostic Platform**  
> A full-stack web application designed for farmers, researchers, and agronomists to diagnose plant diseases instantly using computer vision and deep learning.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture & Folder Structure](#-architecture--folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Quick Start](#-installation--quick-start)
  - [1. Backend Setup](#1-backend-setup-fastapi)
  - [2. Frontend Setup](#2-frontend-setup-react--vite)
- [Environment Variables](#-environment-variables)
- [AI Model Integration & Demo Mode](#-ai-model-integration--demo-mode)
  - [How to add a trained model](#how-to-add-a-trained-model)
  - [How Demo Mode works](#how-demo-mode-works)
- [MongoDB Configuration](#-mongodb-configuration)
- [REST API Endpoints](#-rest-api-endpoints)
- [Running Automated Tests](#-running-automated-tests)
- [Agricultural Disclaimer](#-agricultural-disclaimer)

---

## 🌟 Overview

**AgroScan AI** simplifies crop pathology diagnosis. By analyzing foliage photos with deep learning, it detects early fungal, bacterial, and environmental stress symptoms, computes calibrated confidence scores, and delivers actionable prevention advice to protect crop yield.

---

## 🚀 Key Features

- **Instant Leaf Diagnosis**: Drag-and-drop or capture leaf photos (JPG, PNG, WEBP up to 10MB) with deep image validation.
- **Deep Learning / CNN Classification**: Architecture ready for custom TensorFlow/Keras `.h5` models.
- **Standalone Demo Prediction Engine**: Demonstrates the full application workflow even before model training, with full transparency (clearly flagged as `isDemoPrediction: true`).
- **Confidence-Aware Reporting**: Calibrated status alerts:
  - $\ge 80\%$: High confidence diagnosis.
  - $50\% - 79\%$: Moderate confidence warning.
  - $< 50\%$: Low certainty notice.
- **Persistent Scan History**: Securely save evaluations, filter by crop type or health status, search by symptoms, sort, and delete records.
- **Interactive Dashboard**: Aggregated user analytics (Total scans, healthy vs diseased ratios, average confidence).
- **Disease Encyclopedia**: Searchable catalog of crop diseases with key diagnostic signs and management steps.
- **JWT & Password Security**: Encrypted bcrypt passwords and token authentication.
- **Zero-Setup Database Fallback**: Built-in resilient fallback storage allowing immediate evaluation even without local MongoDB.

---

## 🛠 Technology Stack

### Frontend
- **React.js 18** + **Vite**
- **Tailwind CSS** (Custom Agricultural Palette: Forest greens, Earth browns, Emeralds)
- **React Router v6**
- **Axios** (With JWT Bearer interceptors)
- **Lucide React** (Modern iconography)

### Backend
- **Python 3.10+ / Python 3.14**
- **FastAPI** + **Uvicorn**
- **Pydantic v2** & **Pydantic Settings**
- **Motor** & **PyMongo** (MongoDB Atlas & local support)
- **Bcrypt** + **Python-Jose** (JWT authentication)
- **Pillow** & **NumPy** (Image preprocessing)

---

## 📁 Architecture & Folder Structure

```text
DIPLOMA_PROJECT/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app factory, CORS, static mounts
│   │   ├── config.py                # Environment & application settings
│   │   ├── database.py              # MongoDB Motor client + fallback storage
│   │   ├── models/                  # Data structures
│   │   ├── schemas/
│   │   │   └── schemas.py           # Pydantic request/response schemas
│   │   ├── routes/
│   │   │   ├── auth.py              # Register, login, profile endpoints
│   │   │   ├── predictions.py       # Leaf upload, analysis, history, deletion
│   │   │   ├── diseases.py          # Encyclopedia catalog
│   │   │   └── health.py            # Health probe
│   │   ├── services/
│   │   │   ├── auth_service.py      # JWT & bcrypt security
│   │   │   ├── storage_service.py   # Secure file validation & uploads
│   │   │   └── disease_service.py   # Disease database access
│   │   └── middleware/
│   │       └── auth_guard.py        # Token protection guard
│   ├── ai/
│   │   ├── model_loader.py          # Singleton Keras model loader
│   │   ├── predictor.py             # Predictor coordinator (Demo mode vs Keras)
│   │   ├── preprocessing.py         # Image resizing (224x224) & normalization
│   │   └── class_names.json         # Plant & disease pathology data
│   ├── models/
│   │   └── plant_disease_model.h5   # Slot for trained Keras model
│   ├── uploads/                     # Local storage for leaf images
│   ├── run.py                       # Backend startup script
│   ├── test_api.py                  # Backend test suite
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Navbar, Footer, ImageUploader, ConfidenceBar, etc.
│   │   ├── pages/                   # Home, Upload, PredictionDetail, History, Dashboard, etc.
│   │   ├── context/                 # AuthContext
│   │   ├── services/                # Axios API services
│   │   ├── App.jsx                  # React routing
│   │   ├── main.jsx                 # React root
│   │   └── index.css                # Tailwind directives
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite config & API proxies
│   └── tailwind.config.js           # Agricultural theme tokens
│
├── README.md
└── .gitignore
```

---

## ⚡ Prerequisites

- **Node.js**: v18.0 or higher
- **Python**: v3.10+ (Tested on Python 3.14)
- **MongoDB** (Optional for testing; built-in memory fallback will activate if MongoDB is offline)

---

## 💻 Installation & Quick Start

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Or on Windows: `py -m pip install -r requirements.txt`)*

3. Configure environment settings (optional, defaults provided):
   ```bash
   cp .env.example .env
   ```

4. Start the FastAPI server:
   ```bash
   python run.py
   ```
   *(Or `py run.py` / `uvicorn app.main:app --reload --port 8000`)*

The backend server will run at: **`http://127.0.0.1:8000`**  
Interactive Swagger API documentation: **`http://127.0.0.1:8000/docs`**

---

### 2. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```

Open your browser and navigate to: **`http://localhost:5173`**

---

## 🔐 Environment Variables

The backend `.env` supports the following configurations:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend port | `8000` |
| `MONGODB_URI` | MongoDB connection string (Local or MongoDB Atlas) | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Name of the database | `plant_disease_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `<secret>` |
| `ACCESS_TOKEN_EXPIRE_MINUTES`| Expiration for user sessions | `1440` (24h) |
| `DEMO_MODE` | Toggle between Demo Prediction and TensorFlow Model | `true` |
| `MODEL_PATH` | Relative path to Keras model file | `models/plant_disease_model.h5` |
| `CONFIDENCE_THRESHOLD` | Threshold for high confidence diagnosis | `0.80` (80%) |
| `UPLOAD_DIR` | Image uploads destination | `uploads` |
| `MAX_UPLOAD_SIZE_MB` | Maximum allowed image file size | `10` |

---

## 🤖 AI Model Integration & Demo Mode

### How to add a trained model
1. Train a CNN image classifier (e.g. ResNet, MobileNet, or custom CNN on PlantVillage dataset) with output shape corresponding to the classes in `backend/ai/class_names.json`.
2. Save the trained Keras model as `plant_disease_model.h5`.
3. Place the file at:
   ```text
   backend/models/plant_disease_model.h5
   ```
4. Set `DEMO_MODE=false` in `backend/.env`.
5. Restart the backend server. The model loader will automatically load weights into memory.

### How Demo Mode works
- When `DEMO_MODE=true` (or when TensorFlow/the model file is absent), the system activates the **Demo Prediction Engine**.
- It analyzes the foliage photo's color ratios, greenness index, and texture metrics to deterministically produce realistic disease predictions.
- **Transparency**: Every demo response is marked with `"isDemoPrediction": true` and displayed with a **Demo Prediction** tag in the UI so users are never misled.

---

## 🗄 MongoDB Configuration

AgroScan AI supports both local MongoDB instances and **MongoDB Atlas** cloud clusters:

### Using MongoDB Atlas:
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
3. Paste it into `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   DATABASE_NAME=plant_disease_db
   ```

---

## 📡 REST API Endpoints

### Authentication
- `POST /api/auth/register`: Register new agronomist account.
- `POST /api/auth/login`: Authenticate and receive JWT access token.
- `GET /api/auth/me`: Retrieve current authenticated profile.

### Plant Disease Diagnostics
- `POST /api/predictions`: Upload leaf image (`multipart/form-data`) and execute AI analysis.
- `GET /api/predictions`: Retrieve filterable, paginated scan history.
- `GET /api/predictions/stats`: Retrieve dashboard analytics (totals, health ratios, confidence averages).
- `GET /api/predictions/{id}`: Detailed diagnosis view with symptoms and prevention advice.
- `DELETE /api/predictions/{id}`: Delete diagnostic scan and remove uploaded image.

### Pathology Encyclopedia & System
- `GET /api/diseases`: List all plant disease profiles or filter by crop.
- `GET /api/diseases/{id}`: Detailed pathology info for a specific condition.
- `GET /api/health`: Health status, demo mode flag, and database connectivity.

---

## 🧪 Running Automated Tests

Run the complete backend integration test suite with:

```bash
cd backend
python test_api.py
```

Expected output:
```text
Running AgroScan AI Backend Test Suite...
[PASS] Health endpoint OK
[PASS] Disease catalog OK
[PASS] User auth (Register, Login, Me) OK
[PASS] Prediction upload, AI demo analysis & retrieval OK
All backend tests passed successfully!
```

---

## ⚠️ Agricultural Disclaimer

> **Important**: This application provides visual AI estimates for educational and preliminary screening purposes. It is not a substitute for in-person laboratory testing or professional agronomic advice. Always consult a certified crop consultant or agricultural extension officer before applying chemical treatments.
