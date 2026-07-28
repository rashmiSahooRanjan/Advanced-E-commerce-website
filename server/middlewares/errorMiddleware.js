// The existing Error class in js have a message property but no status code, so we create our own error class to include status code for better error handling in our application. This way we can throw errors with specific status codes and handle them accordingly in our error middleware.

class FlintError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`;
    err = new FlintError(message, 400);
  }

  if (err.name === "jsonWebTokenError") {
    const message = "Invalid token, please login again.";
    err = new FlintError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired, please login again.";
    err = new FlintError(message, 401);
  }

  if (err.code === "23505") {
    const field = err.constraint?.replace(/_key$/, "")?.split("_")?.at(-1);
    err = new FlintError(
      `Duplicate value entered for ${field} field, please choose another value.`,
      400,
    );
  }

  console.log(err);

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((val) => val.message)
        .join(", ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default FlintError;
