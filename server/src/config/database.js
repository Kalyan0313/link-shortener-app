const { Pool } = require("pg");

class Database {
  constructor() {
    this.pool = null;
  }

  //Initialize database connection
  async connect() {
    try {
      // Validate DATABASE_URL
      if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE URL not found.");
      }

      const connectionTimeout =
        parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000; // 10 seconds default

      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.NODE_ENV === "production"
            ? {
                rejectUnauthorized: false,
              }
            : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: connectionTimeout,
        statement_timeout: 30000,
        query_timeout: 30000,
      });

      const client = await this.pool.connect();
      console.log("Database connected successfully");
      client.release();

      this.pool.on("error", (err) => {
        console.error("Unexpected database pool error", err);
      });

      return this.pool;
    } catch (error) {
      if (error.code === "ETIMEDOUT" || error.message.includes("timeout")) {
        console.error("Database connection timed out.");
      } else if (error.code === "ECONNREFUSED") {
        console.error("Database connection refused.");
      } else if (error.code === "ENOTFOUND") {
        console.error("Database host not found.");
      } else {
        console.error("Database connection failed.");
      }
      throw error;
    }
  }

  getPool() {
    if (!this.pool) {
      throw new Error("Database not initialized. Call connect() first.");
    }
    return this.pool;
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.end();
      console.log("Database disconnected");
    }
  }

  async setup() {
    try {
      if (!this.pool) {
        await this.connect();
      }

      const createLinksTable = `
        CREATE TABLE IF NOT EXISTS links (
          id SERIAL PRIMARY KEY,
          short_code VARCHAR(8) UNIQUE NOT NULL,
          target_url TEXT NOT NULL,
          total_clicks INTEGER DEFAULT 0,
          last_clicked TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_short_code ON links(short_code);
        CREATE INDEX IF NOT EXISTS idx_created_at ON links(created_at DESC);
      `;

      await this.pool.query(createLinksTable);

      return true;
    } catch (error) {
      console.error("Failed to setup database", error);
      throw error;
    }
  }
}

const database = new Database();

module.exports = database;
