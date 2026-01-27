# ✨ Itinera — Smart Travel Planner

Itinera is a modern travel planning web application that helps users **discover cities**, express their tastes via **like/dislike (swipe-style)** interactions, and receive **personalized recommendations** based on preferences.

The product is designed to be **simple, clear, and accessible** (including for older users), with a focus on ease-of-use over complexity.

---

## ✅ Key Features

### Personalized City Discovery (Like/Dislike)
- City discovery interface with **like/dislike** interactions
- Preference signals are stored and reused to improve recommendations
- Smooth, mobile-friendly UI

### Preference-Based Recommendations
- Users can specify intent such as **family / couple / friends / solo**
- Tag-based matching to rank cities higher if they share more preference tags with the user
- Recommendation logic can be backed by a graph approach (e.g., Neo4j) when enabled in the backend

### Booking-Friendly Experience
- Clear trip planning flow (browse → decide → plan)
- City detail and itinerary views
- CTA placeholders/links towards **accommodation** and **transport** booking providers  
  (depends on branch / integration status)

---

## 🧱 Architecture (Microservices Focus)

Itinera follows a backend design direction that is **microservice-ready** (can start as a baseline implementation and evolve using a strangler-style approach).

Typical functional modules:
- **User / Profile & Preferences**
- **Recommendations**
- **Itinerary**
- **Content / Places**
- **Analytics (optional)**

> The exact implementation depends on the active branch. Use the branch required by your course deliverable.

---

## ♻️ Green IT (Mandatory Topic)

We reduce resource usage by design:

- **Mobile-first UI** → lighter pages and faster interactions
- Reduced data transfer through:
  - Image optimization strategy (where enabled)
  - Lazy-loading and component-level rendering
  - Avoiding unnecessary re-renders and heavy animations
- Clear, simple navigation → less user time spent searching and reloading

---

## 🕹️ Gamification (Mandatory Topic)

Itinera uses light gamification to improve engagement and personalization:

- Like/dislike interactions build a **taste profile**
- Optional progression ideas (depending on scope/branch):
  - “Explorer” levels based on interactions
  - Badges based on user interests (e.g., history/food/nature)
  - Streaks or milestones (non-intrusive)

Gamification is used to **support personalization**, not to add complexity.

---

## 🧰 Tech Stack

### Frontend
- React + Vite
- (UI library / Tailwind depending on branch)
- Modern component-based architecture

### Backend (depending on branch)
- REST API (FastAPI / Node / etc. depending on implementation)
- Database (MongoDB / PostgreSQL / etc.)
- Optional graph DB for recommendations (Neo4j)

---

## 📁 Repository Structure

> Typical structure (adjust if your branch differs):

.
├── solea-backend/ # Backend/API (name may vary by branch)
├── solea-frontend/ # Web UI (Itinera frontend)
└── README.md


---

## 🚀 Getting Started (Local)

### 1) Clone
```bash
git clone <your-repo-url>
cd <your-repo-folder>
* Frontend
cd solea-frontend
npm install
npm run dev

* Backend (if present)
cd ../solea-backend
# run depends on backend tech
# examples:
npm install && npm run dev
# OR
pip install -r requirements.txt && uvicorn app.main:app --reload
