try {
  require('dotenv').config();
} catch {
  // dotenv is optional at runtime if environment variables are injected externally.
}

const express = require('express');
const cors = require('cors');

const db = require('./db');
const projectsRoutes = require('./routes/projects.routes');
const servicesRoutes = require('./routes/services.routes');
const productsRoutes = require('./routes/products.routes');
const contactsRoutes = require('./routes/contacts.routes');
const uploadsRoutes = require('./routes/uploads.routes');
const adminAuth = require('./middleware/adminAuth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { createFixedWindowRateLimit } = require('./middleware/rateLimit');

const app = express();
const serviceName = 'Kyoru Studio API';
const DB_READINESS_TIMEOUT_MS = 3_000;
const CONTACT_BODY_LIMIT = '32kb';

app.disable('x-powered-by');

// Render currently forwards requests through one trusted reverse proxy. Keep this
// value aligned with the deployment topology so req.ip cannot be spoofed.
const configuredTrustProxyHops = Number.parseInt(
  String(process.env.TRUST_PROXY_HOPS || '1'),
  10,
);
const trustProxyHops =
  Number.isInteger(configuredTrustProxyHops) &&
  configuredTrustProxyHops >= 0 &&
  configuredTrustProxyHops <= 10
    ? configuredTrustProxyHops
    : 1;
app.set('trust proxy', trustProxyHops);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin is not allowed by the CORS policy');
    error.status = 403;
    error.code = 'CORS_ORIGIN_DENIED';
    return callback(error);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-token'],
  optionsSuccessStatus: 204,
};

function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  res.setHeader('X-Frame-Options', 'DENY');

  if (process.env.NODE_ENV === 'production' && req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  }

  return next();
}

function preventSensitiveResponseCaching(req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  return next();
}

const contactRateLimit = createFixedWindowRateLimit({
  windowMs: 15 * 60 * 1_000,
  max: 10,
  message: 'Too many contact requests. Please try again later.',
});

app.use(securityHeaders);
app.use('/api/admin', preventSensitiveResponseCaching);
app.use('/api/contacts', preventSensitiveResponseCaching);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// Reject unauthenticated admin requests before parsing JSON bodies. Route-level
// guards remain in place as defense in depth.
app.use('/api/admin', adminAuth);

// Limit contact abuse before parsing its body. Other JSON admin payloads retain
// the existing 1 MiB ceiling for backward compatibility.
app.post('/api/contacts', contactRateLimit);
app.use('/api/contacts', express.json({ limit: CONTACT_BODY_LIMIT }));
app.use(express.json({ limit: '1mb' }));

function withTimeout(promise, timeoutMs, code) {
  let timeoutHandle;
  const timeout = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      const error = new Error('Operation timed out');
      error.code = code;
      reject(error);
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutHandle));
}

function safeErrorMetadata(error) {
  return {
    name: typeof error?.name === 'string' ? error.name : 'Error',
    code: typeof error?.code === 'string' ? error.code : undefined,
  };
}

function livenessHandler(req, res) {
  return res.json({
    ok: true,
    service: serviceName,
  });
}

// Backward-compatible liveness endpoint. It intentionally does not query PostgreSQL.
app.get('/api/health', livenessHandler);
app.get('/api/health/live', livenessHandler);

app.get('/api/health/ready', async (req, res) => {
  try {
    await withTimeout(
      db.testConnection(),
      DB_READINESS_TIMEOUT_MS,
      'DATABASE_READINESS_TIMEOUT',
    );

    return res.json({
      ok: true,
      service: serviceName,
      database: 'reachable',
    });
  } catch (error) {
    console.error(
      '[health:ready] Database readiness check failed',
      safeErrorMetadata(error),
    );

    return res.status(503).json({
      ok: false,
      error: 'Service temporarily unavailable',
    });
  }
});

app.use('/api', projectsRoutes);
app.use('/api', servicesRoutes);
app.use('/api', productsRoutes);
app.use('/api', contactsRoutes);
app.use('/api', uploadsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number.parseInt(String(process.env.PORT || '3001'), 10);
const safePort = Number.isInteger(port) && port > 0 ? port : 3001;
let serverInstance = null;
let shuttingDown = false;

async function startServer() {
  try {
    await withTimeout(
      db.testConnection(),
      DB_READINESS_TIMEOUT_MS,
      'DATABASE_STARTUP_TIMEOUT',
    );
    console.log('[db] Connection ready');
  } catch (error) {
    console.warn('[db] Connection check failed', safeErrorMetadata(error));
  }

  serverInstance = app.listen(safePort, () => {
    console.log(`[server] Kyoru Studio API listening on port ${safePort}`);
    console.log('[server] Allowed CORS origins:', allowedOrigins);
  });
}

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[server] Received ${signal}, shutting down...`);

  try {
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(resolve));
    }
    await db.disconnect();
  } finally {
    process.exit(0);
  }
}

function registerShutdownHandlers() {
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
      void shutdown(signal);
    });
  }
}

if (require.main === module) {
  registerShutdownHandlers();
  void startServer();
}

module.exports = {
  app,
  startServer,
};
