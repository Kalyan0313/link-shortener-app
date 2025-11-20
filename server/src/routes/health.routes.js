const express = require("express");
const healthController = require("../controllers/health.controller");
const ErrorHandler = require("../middlewares/errorHandler");

const router = express.Router();

//System health check
router.get(
  "/healthz",
  ErrorHandler.asyncHandler(healthController.checkHealth.bind(healthController))
);

module.exports = router;
