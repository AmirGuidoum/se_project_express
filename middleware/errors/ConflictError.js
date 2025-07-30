const AppError = require("../../utils/AppError");

class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

module.exports = ConflictError;
