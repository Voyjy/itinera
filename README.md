# ✨ Solea — Travel Planner Project

Solea is a modern travel planning web application designed to help users discover cities, plan personalized trips, manage preferences, and get real-time recommendations.

## 🏗️ Architecture Overview

Solea uses a **microservices architecture** with an API Gateway pattern:

```
┌─────────────────┐     ┌──────────────────────────────────────────────────┐
│   Frontend      │     │                  Docker Network                   │
│   (React)       │     │                                                   │
│   :5173         │────▶│  ┌─────────────────┐                             │
└─────────────────┘     │  │   API Gateway   │                             │
                        │  │     :8080       │                             │
                        │  └────────┬────────┘                             │
                        │           │                                       │
                        │     ┌─────┴─────┐                                 │
                        │     │           │                                 │
                        │     ▼           ▼                                 │
                        │  ┌─────────┐ ┌─────────┐ ┌─────────────────┐     │
                        │  │ Rec Svc │ │Cache Svc│ │  Legacy Backend │     │
                        │  │  :4005  │ │  :4006  │ │      :4000      │     │
                        │  └────┬────┘ └────┬────┘ └────────┬────────┘     │
                        │       │           │               │               │
                        │       ▼           ▼               ▼               │
                        │  ┌─────────┐ ┌─────────┐    ┌─────────┐          │
                        │  │  Neo4j  │ │  Redis  │    │ MongoDB │          │
                        │  │  :7687  │ │  :6379  │    │ :27017  │          │
                        │  └─────────┘ └─────────┘    └─────────┘          │
                        └──────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **api-gateway** | 8080 (public) | Routes requests to appropriate microservices |
| **legacy-backend** | 4000 (internal) | Auth, Users, Trips, Cities, Hotels, Blogs |
| **recommendation-service** | 4005 (internal) | Neo4j-based recommendations |
| **cache-service** | 4006 (internal) | Redis caching for drafts, recent cities |

### Routing Rules

- `/api/recommendations/*` → recommendation-service
- `/api/redis/*` → cache-service
- `/api/*` (all other) → legacy-backend
- `/assets/*` → legacy-backend (static files)

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- [Node.js 20+](https://nodejs.org/) (for local frontend dev)

### Run with Docker Compose

```bash
# Clone the repository
cd itinera

# Copy environment file (optional - defaults work for local dev)
cp .env.docker.example .env

# Build and start all services
docker-compose up --build

# Services will be available at:
# - API Gateway: http://localhost:8080
# - Frontend: http://localhost:5173 (run separately)
```

### Run Frontend Separately

```bash
cd solea-frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🔧 Environment Variables

### Docker Compose (default values work for local dev)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://root:rootpassword@mongo:27017/solea?authSource=admin` | MongoDB connection string |
| `REDIS_URL` | `redis://redis:6379` | Redis connection string |
| `NEO4J_URI` | `bolt://neo4j:7687` | Neo4j Bolt protocol URI |
| `NEO4J_USERNAME` | `neo4j` | Neo4j username |
| `NEO4J_PASSWORD` | `password123` | Neo4j password |
| `JWT_SECRET` | `your-super-secret-jwt-key` | JWT signing secret |

### Production (Cloud Services)

For production, set these environment variables to your cloud service credentials:
- MongoDB Atlas
- Redis Cloud
- Neo4j AuraDB

---

## 📁 Folder Structure

```
itinera/
├── solea-frontend/           # React frontend
├── solea-backend/            # Legacy monolith (auth, users, trips, etc.)
├── services/
│   ├── api-gateway/          # BFF - routes to microservices
│   ├── recommendation-service/ # Neo4j recommendations
│   └── cache-service/        # Redis caching
├── docker-compose.yml        # Full stack orchestration
├── .env.docker.example       # Example environment file
└── README.md
```

---

## 📡 API Endpoints

### Auth (Legacy Backend)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user

### Users (Legacy Backend)
- `GET /api/users/profile` — Get profile (JWT required)
- `PUT /api/users/preferences` — Update preferences

### Trips (Legacy Backend)
- `POST /api/trips` — Create trip
- `GET /api/trips/:tripId` — Get trip details
- `POST /api/trips/:tripId/confirm` — Confirm trip

### Cities & Hotels (Legacy Backend)
- `GET /api/cities` — All cities
- `GET /api/cities/continent/:continent` — Cities by continent
- `GET /api/hotels/city/:cityId` — Hotels in city

### Recommendations (Microservice)
- `GET /api/recommendations/city/:cityId` — Similar cities
- `GET /api/recommendations/user/:userId` — Personalized recommendations

### Cache/Redis (Microservice)
- `POST/GET/DELETE /api/redis/draft/:userId` — Trip drafts
- `POST/GET /api/redis/recent/:userId` — Recently viewed
- `POST/GET /api/redis/popular` — Popular cities

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8080/
# Expected: "API Gateway is running 🚀"
```

### Test Recommendations Service
```bash
curl http://localhost:8080/api/recommendations/city/Paris
```

### Test Cache Service
```bash
# Save draft
curl -X POST http://localhost:8080/api/redis/draft/test123 \
  -H "Content-Type: application/json" \
  -d '{"userId": "test123", "draft": {"cities": ["Paris"]}}'

# Get draft
curl http://localhost:8080/api/redis/draft/test123

# Delete draft
curl -X DELETE http://localhost:8080/api/redis/draft/test123
```

---

## 👨‍💼 Author

Made with ❤️ for modern explorers
