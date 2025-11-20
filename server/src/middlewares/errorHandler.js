const RequestHandler = require("../utils/RequestHandler");

class ErrorHandler {
  static handle(err, req, res, next) {
    console.error("Unhandled error", {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // Database errors
    if (err.code === "23505") {
      return RequestHandler.sendConflict(res, "Resource already exists");
    }

    if (err.code === "23503") {
      return RequestHandler.sendBadRequest(res, "Invalid reference");
    }

    if (err.code === "22P02") {
      return RequestHandler.sendBadRequest(res, "Invalid input format");
    }

    if (err.name === "ValidationError") {
      return RequestHandler.sendValidationError(res, err.errors);
    }

    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";

    return RequestHandler.sendError(res, message, statusCode);
  }

  static notFound(req, res, next) {
    return RequestHandler.sendNotFound(
      res,
      `Route ${req.originalUrl} not found`
    );
  }

  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = ErrorHandler;
