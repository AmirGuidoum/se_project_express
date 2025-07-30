const AppError = require("../../utils/AppError");

class ServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500);
  }
}

module.exports = ServerError;
