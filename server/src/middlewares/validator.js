const { body, param, query, validationResult } = require("express-validator");
const RequestHandler = require("../utils/RequestHandler");

//Request validation middleware
class Validator {
  //Validate create link request
  static createLink = [
    body("targetUrl")
      .notEmpty()
      .withMessage("Target URL is required")
      .trim()
      .isURL({ protocols: ["http", "https"], require_protocol: true })
      .withMessage("Must be a valid HTTP/HTTPS URL"),

    body("customCode")
      .optional()
      .trim()
      .matches(/^[A-Za-z0-9]{6,8}$/)
      .withMessage("Custom code must be 6-8 alphanumeric characters"),

    Validator.handleValidationErrors,
  ];

  //Validate short code parameter
  static validateCode = [
    param("code")
      .notEmpty()
      .withMessage("Code is required")
      .matches(/^[A-Za-z0-9]{6,8}$/)
      .withMessage("Invalid code format"),

    Validator.handleValidationErrors,
  ];

  //Validate search query
  static validateSearch = [
    query("search")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Search term must be 1-200 characters"),

    Validator.handleValidationErrors,
  ];

  //Handle validation errors
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      }));

      return RequestHandler.sendValidationError(res, formattedErrors);
    }

    next();
  }
}

module.exports = Validator;
