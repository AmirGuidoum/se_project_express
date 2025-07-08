const logger = require("../utils/loggers");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    status,
    message: statusCode === 500 ? "Internal Server Error" : err.message,
  });
};

module.exports = errorHandler;
