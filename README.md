# FarmSync – Crop Recommendation System

FarmSync är en fullstack-applikation som kombinerar maskininlärning och ett modernt webbgränssnitt för att rekommendera grödor baserat på jord- och väderparametrar.  
Projektet innehåller även en MNIST-baserad inloggningskontroll där användaren måste rita en siffra rätt innan systemet kan användas.

---

## Funktioner

- Grödrekommendation  
  Backend använder en tränad Random Forest-modell (`random_forest_crop.joblib`) och en scaler för att förutsäga bästa gröda baserat på NPK-värden, pH, temperatur, luftfuktighet och nederbörd. Resultaten sparas i en SQLite-databas.

- Rit-baserad autentisering  
  Användaren måste rita en siffra som verifieras mot en MNIST-modell innan man får tillgång till appen.

- Frontend i React  
  Interaktivt gränssnitt där användaren kan ställa in jord- och vädervärden via sliders. Resultatet visas tillsammans med en sammanfattning av de värden som användes.

- Databas  
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

### Backend (Flask)

1. Klona repot och gå till servermappen:
   ```bash
   git clone https://github.com/ViktorThorsen/farmsync.git
   cd farmsync/server
   ```
2. Installera beroenden:
   pip install -r requirements.txt
3. Starta servern:
   python api.py
4. Gå till frontendmappen:
   cd farmsync/frontend
5. Installera beroenden:
   npm install
6. Starta frontend:
   npm run dev.
