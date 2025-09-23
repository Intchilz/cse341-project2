// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('🔥 ERROR:', err.message); // log in terminal

  // If error already has a statusCode, use it. Otherwise 500.
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // You can include stack trace only in development:
    //...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
