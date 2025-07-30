function errorHandler(err, req, res, _next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const status = err.status || (statusCode >= 500 ? "error" : "fail");

  res.status(statusCode).json({
    status,
    message,
  });
}

module.exports = errorHandler;
