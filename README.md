# 🌾 Agro-Pulse: Predictive Crop Epidemic Tracker

An intelligent bio-surveillance radar system for proactive agricultural disease detection and contagion containment.

---

## 🏛️ System Architecture

```text
agro-pulse/
├── client/          # Frontend: React.js, Leaflet.js, Turf.js
├── server/          # API Gateway: Node.js, Express, Twilio, Plant.id fallback
└── ml-service/      # Intelligence: Python, FastAPI, EfficientNetB0 / PyTorch
```

### Key Workflow

1. **Diagnosis:** Farmer uploads leaf photo $\rightarrow$ Gateway calls local Python AI (`EfficientNetB0`).
2. **Smart Fallback:** If confidence is low or crop is non-potato $\rightarrow$ auto-routes to `Plant.id API`.
3. **Contagion Radar:** If an infectious disease (e.g. Late Blight) is detected $\rightarrow$ fetches real-time wind vector via Open-Meteo API.
4. **Bio-Surveillance:** Calculates downwind contagion blast radius and broadcasts preemptive warnings.

---

## 🚀 Getting Started

### 1. ML Service (Python FastAPI)

```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

The service loads `ml-service/best_model.pth` when it exists. To train it, put labeled
images in `ml-service/dataset/early_blight`, `ml-service/dataset/late_blight`, and
`ml-service/dataset/healthy`, then run `python train_colab.py`. Without a checkpoint,
the service uses its deterministic image-analysis fallback and reports that no trained
model is loaded.

### 2. Backend Gateway (Node.js Express)

```bash
cd server
npm install
npm run dev
```

### 3. Frontend (React + Leaflet)

```bash
cd client
npm install
npm run dev
```
