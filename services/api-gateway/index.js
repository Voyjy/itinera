const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();

// Service URLs (use Docker service names in Docker, localhost for local dev)
const LEGACY_BACKEND_URL = process.env.LEGACY_BACKEND_URL || 'http://legacy-backend:4000';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';
const USERS_SERVICE_URL = process.env.USERS_SERVICE_URL || 'http://users-service:4002';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:4003';
const RECOMMENDATION_SERVICE_URL = process.env.RECOMMENDATION_SERVICE_URL || 'http://recommendation-service:4005';
const CACHE_SERVICE_URL = process.env.CACHE_SERVICE_URL || 'http://cache-service:4006';

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://voluble-scone-617f6ee.netlify.app',
            'http://localhost:5173',
            'http://localhost:3000',
            undefined // allow curl/Postman or same-origin
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn('CORS blocked origin:', origin);
            callback(null, true); // Allow all for development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// JSON body parsing for non-proxied routes
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`🚦 Gateway: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('API Gateway is running 🚀');
});

// ============================================
// MICROSERVICE PROXY ROUTES (ORDER MATTERS!)
// ============================================

// Proxy to Auth Service (MS-2)
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/api/auth'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Auth Service: ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Auth Service proxy error:', err.message);
            res.status(502).json({ error: 'Auth service unavailable' });
        }
    }
}));

// Proxy to Users Service (MS-2)
app.use('/api/users', createProxyMiddleware({
    target: USERS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/api/users'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Users Service: ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Users Service proxy error:', err.message);
            res.status(502).json({ error: 'Users service unavailable' });
        }
    }
}));

// Proxy to Catalog Service - Cities (MS-3)
app.use('/api/cities', createProxyMiddleware({
    target: CATALOG_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/cities': '/api/cities'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Catalog Service (Cities): ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Catalog Service proxy error:', err.message);
            res.status(502).json({ error: 'Catalog service unavailable' });
        }
    }
}));

// Proxy to Catalog Service - Hotels (MS-3)
app.use('/api/hotels', createProxyMiddleware({
    target: CATALOG_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/hotels': '/api/hotels'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Catalog Service (Hotels): ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Catalog Service proxy error:', err.message);
            res.status(502).json({ error: 'Catalog service unavailable' });
        }
    }
}));

// Proxy to Catalog Service - Blogs (MS-3)
app.use('/api/blogs', createProxyMiddleware({
    target: CATALOG_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/blogs': '/api/blogs'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Catalog Service (Blogs): ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Catalog Service proxy error:', err.message);
            res.status(502).json({ error: 'Catalog service unavailable' });
        }
    }
}));

// Proxy to Recommendation Service (MS-1)
app.use('/api/recommendations', createProxyMiddleware({
    target: RECOMMENDATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/recommendations': '/api/recommendations'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Recommendation Service: ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Recommendation Service proxy error:', err.message);
            res.status(502).json({ error: 'Recommendation service unavailable' });
        }
    }
}));

// Proxy to Cache Service (MS-1)
app.use('/api/redis', createProxyMiddleware({
    target: CACHE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/redis': '/api/redis'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Cache Service: ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Cache Service proxy error:', err.message);
            res.status(502).json({ error: 'Cache service unavailable' });
        }
    }
}));

// Proxy static assets to Legacy Backend
app.use('/assets', createProxyMiddleware({
    target: LEGACY_BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/assets': '/assets'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying assets: ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Legacy Backend asset proxy error:', err.message);
            res.status(502).json({ error: 'Asset service unavailable' });
        }
    }
}));

// Proxy all other /api/* routes to Legacy Backend (fallback)
app.use('/api', createProxyMiddleware({
    target: LEGACY_BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api'
    },
    on: {
        proxyReq: (proxyReq, req) => {
            console.log(`➡️  Proxying to Legacy Backend: ${req.method} ${req.path}`);
        },
        error: (err, req, res) => {
            console.error('❌ Legacy Backend proxy error:', err.message);
            res.status(502).json({ error: 'Backend service unavailable' });
        }
    }
}));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
    console.log(`   ➡️  Auth: ${AUTH_SERVICE_URL}`);
    console.log(`   ➡️  Users: ${USERS_SERVICE_URL}`);
    console.log(`   ➡️  Catalog: ${CATALOG_SERVICE_URL}`);
    console.log(`   ➡️  Recommendations: ${RECOMMENDATION_SERVICE_URL}`);
    console.log(`   ➡️  Cache: ${CACHE_SERVICE_URL}`);
    console.log(`   ➡️  Legacy: ${LEGACY_BACKEND_URL}`);
});
