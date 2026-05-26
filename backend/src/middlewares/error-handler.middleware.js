/**
 * Global Error Handling Middleware
 * Catch all errors passed via next(err) and return a standardized JSON response
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.stack}`);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    message,
    status: statusCode
  };

  // Include stack trace only in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Handle Prisma specific errors if needed
  if (err.code === 'P2002') {
    response.message = 'Unique constraint failed on one or more fields';
    response.status = 409;
  }

  res.status(response.status).json(response);
};

module.exports = errorHandler;
