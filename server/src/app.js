const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const apiRoutes = require("./routes/api.routes");
const redirectRoutes = require("./routes/redirect.routes");
const healthRoutes = require("./routes/health.routes");

const ErrorHandler = require("./middlewares/errorHandler");
const { apiLimiter, redirectLimiter } = require("./middlewares/rateLimiter");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS - Allow multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://bitly-assignment.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/", healthRoutes);
app.use("/api", apiLimiter.limit(), apiRoutes);
app.use("/", redirectLimiter.limit(), redirectRoutes);

// Error handling
app.use(ErrorHandler.notFound);
app.use(ErrorHandler.handle);

module.exports = app;
