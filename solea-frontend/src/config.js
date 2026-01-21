// Use environment variable if available, otherwise default to legacy backend port
// When running with Docker Compose, set VITE_API_URL=http://localhost:8080
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

