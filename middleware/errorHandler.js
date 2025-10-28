// middleware/errorHandler.js
export default function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err.message || err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
