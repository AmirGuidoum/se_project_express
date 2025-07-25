const AppError = require("../utils/AppError");

class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

class ServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}
class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ServerError,
  UnauthorizedError,
  ConflictError,
  errorHandler,
};
