const database = require("../config/database");

class HealthController {
  constructor() {
    this.startTime = Date.now();
  }

  async checkHealth(req, res) {
    try {
      // Check database connection
      const pool = database.getPool();
      await pool.query("SELECT 1");

      const uptime = Math.floor((Date.now() - this.startTime) / 1000);

      const healthData = {
        ok: true,
        version: "1.0.0",
        uptime: `${uptime}s`,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        database: "connected",
      };

      return res.status(200).json(healthData);
    } catch (error) {
      console.error("Health check failed", error);

      return res.status(503).json({
        ok: false,
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Service unavailable",
      });
    }
  }
}

const healthController = new HealthController();

module.exports = healthController;
