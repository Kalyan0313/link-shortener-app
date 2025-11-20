class RequestHandler {
  static sendSuccess(res, data = {}, statusCode = 200, message = "Success") {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static sendError(
    res,
    message = "Something went wrong",
    statusCode = 500,
    errors = null
  ) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static sendCreated(res, data = {}, message = "Resource created successfully") {
    return this.sendSuccess(res, data, 201, message);
  }

  static sendNotFound(res, message = "Resource not found") {
    return this.sendError(res, message, 404);
  }

  static sendConflict(res, message = "Resource already exists") {
    return this.sendError(res, message, 409);
  }

  static sendBadRequest(res, message = "Bad request", errors = null) {
    return this.sendError(res, message, 400, errors);
  }

  static sendValidationError(res, errors) {
    return this.sendError(res, "Validation failed", 422, errors);
  }
}

module.exports = RequestHandler;
