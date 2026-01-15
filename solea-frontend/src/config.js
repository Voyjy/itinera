// Use environment variable if available, otherwise default to local dev port
// For Docker: set VITE_API_URL=http://localhost:8080
// For local dev: uses port 5000 (legacy backend direct)
export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

