require("dotenv").config();

const config = require("./src/config");
const database = require("./src/config/database");
const app = require("./src/app");
const linkRepository = require("./src/repositories/link.repository");

let server = null;

async function initializeDatabase() {
  try {
    await database.connect();
    linkRepository.initialize();
    console.log("Database initialized");
  } catch (error) {
    console.error("Failed to initialize database", error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    await initializeDatabase();

    // Start server
    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Base URL: ${config.baseUrl}`);
    });

    setupGracefulShutdown();
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

function setupGracefulShutdown() {
  const shutdown = async (signal) => {
    console.log(`${signal} received. Starting graceful shutdown...`);

    // Close server
    if (server) {
      server.close(async () => {
        console.log("HTTP server closed");

        // Close database
        await database.disconnect();
        console.log("Database disconnected");

        console.log("Graceful shutdown completed");
        process.exit(0);
      });
    }

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error("Forced shutdown after timeout");
      process.exit(1);
    }, 30000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception", error);
    shutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection", { reason, promise });
    shutdown("unhandledRejection");
  });
}

// Start server
startServer();

module.exports = app;
