require("dotenv").config();
const database = require("./src/config/database");

//Database setup script
async function setupDatabase() {
  try {
    await database.setup();
    console.log("Database setup completed successfully");

    // Close connection
    await database.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed", error);
    await database.disconnect();
    process.exit(1);
  }
}

// Run setup
setupDatabase();
