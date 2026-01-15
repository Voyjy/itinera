# ✨ Solea — Travel Planner Project

Solea is a modern travel planning web application designed to help users discover cities, plan personalized trips, manage preferences, and get real-time recommendations.

## 🏗️ Architecture Overview

Solea uses a **microservices architecture** with an API Gateway pattern:

```
┌─────────────────┐     ┌──────────────────────────────────────────────────────────┐
│   Frontend      │     │                    Docker Network                         │
│   (React)       │     │                                                           │
│   :5173         │────▶│  ┌─────────────────┐                                     │
└─────────────────┘     │  │   API Gateway   │                                     │
                        │  │     :8080       │                                     │
                        │  └────────┬────────┘                                     │
                        │           │                                               │
                        │  ┌────────┼────────┬─────────┬─────────┐                 │
                        │  ▼        ▼        ▼         ▼         ▼                 │
                        │ ┌────┐ ┌────┐ ┌────────┐ ┌────────┐ ┌────────────────┐  │
                        │ │Auth│ │User│ │Rec Svc │ │Cache   │ │Legacy Backend  │  │
                        │ │Svc │ │Svc │ │        │ │Svc     │ │                │  │
                        │ │4001│ │4002│ │  4005  │ │  4006  │ │     4000       │  │
                        │ └──┬─┘ └──┬─┘ └───┬────┘ └───┬────┘ └───────┬────────┘  │
                        │    │      │       │          │              │            │
                        │    └──────┴───────┴──────────┴──────────────┘            │
                        │                          │                               │
                        │    ┌─────────┐    ┌─────────┐    ┌─────────┐            │
                        │    │ MongoDB │    │  Redis  │    │  Neo4j  │            │
                        │    │ :27017  │    │  :6379  │    │  :7687  │            │
                        │    └─────────┘    └─────────┘    └─────────┘            │
                        └──────────────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **api-gateway** | 8080 (public) | Routes requests to appropriate microservices |
| **auth-service** | 4001 (internal) | User registration and login (MS-2) |
| **users-service** | 4002 (internal) | User profile, preferences, trips (MS-2) |
| **recommendation-service** | 4005 (internal) | Neo4j-based recommendations (MS-1) |
| **cache-service** | 4006 (internal) | Redis caching for drafts, recent cities (MS-1) |
| **legacy-backend** | 4000 (internal) | Trips, Cities, Hotels, Blogs |

### Routing Rules

| Route | Service | Phase |
|-------|---------|-------|
| `/api/auth/*` | auth-service | MS-2 |
| `/api/users/*` | users-service | MS-2 |
| `/api/recommendations/*` | recommendation-service | MS-1 |
| `/api/redis/*` | cache-service | MS-1 |
| `/api/*` (fallback) | legacy-backend | - |
| `/assets/*` | legacy-backend | - |

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
| `JWT_SECRET` | `your-super-secret-jwt-key` | JWT signing secret (shared across auth/users services) |

### Production (Cloud Services)

For production, set these environment variables to your cloud service credentials:
- MongoDB Atlas
- Redis Cloud
- Neo4j AuraDB

---

## 📁 Folder Structure

```
itinera/
├── solea-frontend/               # React frontend
├── solea-backend/                # Legacy monolith (trips, cities, hotels, blogs)
├── services/
│   ├── api-gateway/              # BFF - routes to microservices
│   ├── auth-service/             # User auth (register, login) - MS-2
│   ├── users-service/            # User profile, preferences, trips - MS-2
│   ├── recommendation-service/   # Neo4j recommendations - MS-1
│   └── cache-service/            # Redis caching - MS-1
├── docker-compose.yml            # Full stack orchestration
├── .env.docker.example           # Example environment file
└── README.md
```

---

## 📡 API Endpoints

### Auth (auth-service - MS-2)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user, returns JWT token

### Users (users-service - MS-2)
- `GET /api/users/profile` — Get profile (JWT required)
- `PUT /api/users/preferences` — Update preferences
- `GET /api/users/:id/trips` — Get user's trips

### Recommendations (recommendation-service - MS-1)
- `GET /api/recommendations/city/:cityId` — Similar cities
- `GET /api/recommendations/user/:userId` — Personalized recommendations

### Cache/Redis (cache-service - MS-1)
- `POST/GET/DELETE /api/redis/draft/:userId` — Trip drafts
- `POST/GET /api/redis/recent/:userId` — Recently viewed
- `POST/GET /api/redis/popular` — Popular cities

### Trips (Legacy Backend)
- `POST /api/trips` — Create trip
- `GET /api/trips/:tripId` — Get trip details
- `POST /api/trips/:tripId/confirm` — Confirm trip

### Cities & Hotels (Legacy Backend)
- `GET /api/cities` — All cities
- `GET /api/cities/continent/:continent` — Cities by continent
- `GET /api/hotels/city/:cityId` — Hotels in city

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8080/
# Expected: "API Gateway is running 🚀"
```

### Test Auth Service (MS-2)
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
# Returns: {"token": "...", "user": {...}}
```

### Test Users Service (MS-2)
```bash
# Get profile (use token from login)
curl http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer <your-token>"

# Update preferences
curl -X PUT http://localhost:8080/api/users/preferences \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"tags": ["beach", "romantic", "historic"]}'
```

### Test Recommendations Service (MS-1)
```bash
curl http://localhost:8080/api/recommendations/city/Paris
```

### Test Cache Service (MS-1)
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

## 📋 Migration Phases

### MS-1 (Completed)
- ✅ API Gateway (BFF)
- ✅ Recommendation Service (Neo4j)
- ✅ Cache Service (Redis)

### MS-2 (Completed)
- ✅ Auth Service (register, login)
- ✅ Users Service (profile, preferences, trips)

### Future Phases
- MS-3: Trip Service
- MS-4: City/Hotel/Blog Services
- MS-5: Itinerary Service (new)

---

## 👨‍💼 Author

Made with ❤️ for modern explorers
