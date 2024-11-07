/* export class CustomError {
  static newError({ message, statusCode }, details) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.details = details;
    throw error;
  }
} */

export class CustomError {
  static newError({ message, statusCode }, customMessage = null, details = null) {
    const error = new Error(customMessage || message);
    error.statusCode = statusCode;
    if (details) error.details = details;
    throw error;
  }
}
