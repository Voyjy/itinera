# ✨ Itinera — Travel Planner Project

Solea is a modern travel planning web application designed to help users discover cities, plan personalized trips, manage preferences, and get real-time recommendations.

## 🏗️ Architecture Overview

Solea uses a **microservices architecture** with an API Gateway pattern:

```
┌─────────────────┐     ┌─────────────────────────────────────────────────────────────┐
│   Frontend      │     │                      Docker Network                          │
│   (React)       │     │                                                              │
│   :5173         │────▶│  ┌─────────────────┐                                        │
└─────────────────┘     │  │   API Gateway   │                                        │
                        │  │     :8080       │                                        │
                        │  └────────┬────────┘                                        │
                        │           │                                                  │
                        │  ┌────────┼────────┬─────────┬─────────┬─────────┬────────┐ │
                        │  ▼        ▼        ▼         ▼         ▼         ▼        ▼ │
                        │ ┌────┐ ┌────┐ ┌───────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌─────┐│
                        │ │Auth│ │User│ │Catalog│ │Trips │ │Rec Svc │ │Cache   │ │Asset││
                        │ │Svc │ │Svc │ │ Svc   │ │ Svc  │ │        │ │Svc     │ │ Svc ││
                        │ │4001│ │4002│ │ 4003  │ │ 4004 │ │  4005  │ │  4006  │ │4007 ││
                        │ └──┬─┘ └──┬─┘ └───┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └──┬──┘│
                        │    │      │       │        │         │          │        │
                        │    └──────┴───────┴────────┴─────────┴──────────┘          │
                        │                          │                                   │
                        │    ┌─────────┐    ┌─────────┐    ┌─────────┐                │
                        │    │ MongoDB │    │  Redis  │    │  Neo4j  │                │
                        │    │ :27017  │    │  :6379  │    │  :7687  │                │
                        │    └─────────┘    └─────────┘    └─────────┘                │
                        └─────────────────────────────────────────────────────────────┘
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| **api-gateway** | 8080 (public) | Routes requests to appropriate microservices |
| **auth-service** | 4001 (internal) | User registration and login (MS-2) |
| **users-service** | 4002 (internal) | User profile, preferences (MS-2) |
| **catalog-service** | 4003 (internal) | Cities, hotels, blogs (MS-3) |
| **trips-service** | 4004 (internal) | Trip CRUD, confirm trips (MS-4) |
| **recommendation-service** | 4005 (internal) | Neo4j-based recommendations (MS-1) |
| **cache-service** | 4006 (internal) | Redis caching for drafts, recent cities (MS-1) |
| **assets-service** | 4007 (internal) | Static file serving (MS-5) |

### Routing Rules

| Route | Service | Phase |
|-------|---------|-------|
| `/api/auth/*` | auth-service | MS-2 |
| `/api/users/*` | users-service | MS-2 |
| `/api/cities/*` | catalog-service | MS-3 |
| `/api/hotels/*` | catalog-service | MS-3 |
| `/api/blogs/*` | catalog-service | MS-3 |
| `/api/trips/*` | trips-service | MS-4 |
| `/api/recommendations/*` | recommendation-service | MS-1 |
| `/api/redis/*` | cache-service | MS-1 |
| `/assets/*` | assets-service | MS-5 |

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

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://root:rootpassword@mongo:27017/solea?authSource=admin` | MongoDB connection |
| `REDIS_URL` | `redis://redis:6379` | Redis connection |
| `NEO4J_URI` | `bolt://neo4j:7687` | Neo4j Bolt protocol |
| `NEO4J_USERNAME` | `neo4j` | Neo4j username |
| `NEO4J_PASSWORD` | `password123` | Neo4j password |
| `JWT_SECRET` | `your-super-secret-jwt-key` | JWT signing secret |

---

## 📁 Folder Structure

```
itinera/
├── solea-frontend/               # React frontend
├── solea-backend/                # Assets directory (mounted to assets-service)
├── services/
│   ├── api-gateway/              # BFF - routes to microservices
│   ├── auth-service/             # User auth (MS-2)
│   ├── users-service/            # User profile, preferences (MS-2)
│   ├── catalog-service/          # Cities, hotels, blogs (MS-3)
│   ├── trips-service/            # Trip CRUD, confirm (MS-4)
│   ├── assets-service/           # Static file serving (MS-5)
│   ├── recommendation-service/   # Neo4j recommendations (MS-1)
│   └── cache-service/            # Redis caching (MS-1)
├── docker-compose.yml
└── README.md
```

---

## 📡 API Endpoints

### Auth (auth-service)
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, returns JWT

### Users (users-service)
- `GET /api/users/profile` — Get profile (JWT required)
- `PUT /api/users/preferences` — Update preferences
- `GET /api/users/:id/trips` — Get user's trips

### Catalog (catalog-service)
- `GET /api/cities` — All cities
- `GET /api/cities/continent/:continent` — Cities by continent
- `GET /api/cities/:cityId` — City details
- `GET /api/hotels` — All hotels
- `GET /api/hotels/city/:cityId` — Hotels by city
- `GET /api/hotels/:hotelId` — Hotel details
- `GET /api/blogs` — All blogs
- `GET /api/blogs/:blogId` — Blog details

### Recommendations (recommendation-service)
- `GET /api/recommendations/city/:cityId` — Similar cities
- `GET /api/recommendations/user/:userId` — Personalized recommendations

### Cache (cache-service)
- `POST/GET/DELETE /api/redis/draft/:userId` — Trip drafts
- `POST/GET /api/redis/recent/:userId` — Recently viewed
- `POST/GET /api/redis/popular` — Popular cities

### Trips (trips-service)
- `POST /api/trips` — Create trip (JWT required)
- `POST /api/trips/:tripId/cities` — Add city to trip
- `POST /api/trips/:tripId/hotels` — Add hotel to trip
- `GET /api/trips/:tripId` — Get trip by ID
- `POST /api/trips/:tripId/confirm` — Confirm trip

---

## 🧪 Testing

```bash
# Gateway health
curl http://localhost:8080/

# Cities (MS-3)
curl http://localhost:8080/api/cities
curl http://localhost:8080/api/cities/continent/Europe

# Hotels (MS-3)
curl http://localhost:8080/api/hotels
curl http://localhost:8080/api/hotels/city/<cityId>

# Blogs (MS-3)
curl http://localhost:8080/api/blogs

# Auth (MS-2)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Assets
curl -I http://localhost:8080/assets/Europe/Paris.jpg
```

---

## 📋 Migration Phases

| Phase | Status | Services |
|-------|--------|----------|
| MS-1 | ✅ Done | recommendation-service, cache-service |
| MS-2 | ✅ Done | auth-service, users-service |
| MS-3 | ✅ Done | catalog-service (cities, hotels, blogs) |
| MS-4 | ✅ Done | trips-service |
| MS-5 | ✅ Done | assets-service (legacy backend removed) |

---

## 👨‍💼 Author

Made with ❤️ for modern explorers
