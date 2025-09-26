# FarmSync – Crop Recommendation System

FarmSync är en fullstack-applikation som kombinerar maskininlärning och ett modernt webbgränssnitt för att rekommendera grödor baserat på jord- och väderparametrar.  
Projektet innehåller även en MNIST-baserad inloggningskontroll där användaren måste rita en siffra rätt innan systemet kan användas.
https://farmsync.viktorthorsen.se/

---

## Funktioner

- **Grödrekommendation**  
  Backend använder en tränad Random Forest-modell (`random_forest_crop.joblib`) och en scaler för att förutsäga bästa gröda baserat på NPK-värden, pH, temperatur, luftfuktighet och nederbörd. Resultaten sparas i en SQLite-databas.

- **Rit-baserad autentisering**  
  Användaren måste rita en siffra som verifieras mot en MNIST-modell innan man får tillgång till appen.

- **Frontend i React**  
  Interaktivt gränssnitt där användaren kan ställa in jord- och vädervärden via sliders. Resultatet visas tillsammans med en sammanfattning av de värden som användes.

- **Databas**  
  SQLite används för att spara alla förutsägelser tillsammans med inskickade parametrar och användarnamn.

---

## Arkitektur

- **Backend**: Flask (Python), med modeller laddade via `joblib`.  
  Endpoints:

  - `POST /api/predict` – beräknar rekommenderad gröda.
  - `POST /api/mnist/check` – kontrollerar inritad siffra mot MNIST-modell.

- **Frontend**: React + Vite.
  - `App.jsx`: Huvudkomponent med UI för parametrar och prediktion.
  - `DrawingGate.jsx`: Canvas-komponent för att rita siffror.
  - `main.jsx`: Bootstrap av React-appen.

---

## Installation

```bash
# 1. Klona repot
git clone https://github.com/ViktorThorsen/farmsync.git
cd farmsync

# 2. Installera backend (Flask)
cd server
pip install -r requirements.txt

# 3. Starta backend-servern
python api.py
# API körs på http://127.0.0.1:5000

#4. Hämta modellen för AI check på:
url https://drive.google.com/file/d/1H361sWNAUbbMuNn7GO1-p048MFrQhWDR/view?usp=sharing
#5. Ladda ned modellen och lägg modellfilen i farmsync-clean/server/models, se till att den har namnet mnist_et.joblib

# 5. Installera frontend (React)
cd ../frontend
npm install

# 6. Starta frontend
npm run dev
# Frontend körs på http://localhost:5173 (eller den port Vite anger)
```
