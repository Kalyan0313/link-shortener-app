const express = require("express");
const linkController = require("../controllers/link.controller");
const Validator = require("../middlewares/validator");
const ErrorHandler = require("../middlewares/errorHandler");

const router = express.Router();

//Create a new short link
router.post(
  "/links",
  Validator.createLink,
  ErrorHandler.asyncHandler(linkController.createLink.bind(linkController))
);

//Get all links
router.get(
  "/links",
  Validator.validateSearch,
  ErrorHandler.asyncHandler(linkController.getAllLinks.bind(linkController))
);

//Get link details by code
router.get(
  "/links/:code",
  Validator.validateCode,
  ErrorHandler.asyncHandler(linkController.getLinkByCode.bind(linkController))
);

//Delete a link
router.delete(
  "/links/:code",
  Validator.validateCode,
  ErrorHandler.asyncHandler(linkController.deleteLink.bind(linkController))
);

module.exports = router;
