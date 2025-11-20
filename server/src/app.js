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

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "*",
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
