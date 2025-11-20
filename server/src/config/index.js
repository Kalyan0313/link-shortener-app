module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  baseUrl:
    process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,

  // Database configuration
  databaseUrl: process.env.DATABASE_URL,

  // Frontend configuration
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Application settings
  minCodeLength: parseInt(process.env.MIN_CODE_LENGTH) || 6,
  maxCodeLength: parseInt(process.env.MAX_CODE_LENGTH) || 8,
  shortCodeLength: parseInt(process.env.SHORT_CODE_LENGTH) || 6,
  maxUrlLength: parseInt(process.env.MAX_URL_LENGTH) || 2048,
};
