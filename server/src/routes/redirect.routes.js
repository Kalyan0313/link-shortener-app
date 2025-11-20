const express = require("express");
const redirectController = require("../controllers/redirect.controller");
const ErrorHandler = require("../middlewares/errorHandler");
const Validator = require("../middlewares/validator");

const router = express.Router();

//Redirect to target URL
router.get(
  "/:code",
  Validator.validateCode,
  ErrorHandler.asyncHandler(
    redirectController.redirect.bind(redirectController)
  )
);

module.exports = router;
