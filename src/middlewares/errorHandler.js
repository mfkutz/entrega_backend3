import errors from "../utils/errors/dictionaty.errors.js";
import winstonLogger from "../utils/winston.util.js";

function errorHandler(error, req, res, next) {
  const message = `${req.method} ${req.url} - ${error.message.toUpperCase()}`;

  //testing details
  const details = error.details || null;

  if (error.statusCode) {
    winstonLogger.error(message + (details ? ` - Details: ${details}` : ""));
  } else {
    winstonLogger.fatal(message + (details ? ` - Details: ${details}` : ""));
    // sendErrorEmail(message) //here can send email
  }

  const { fatal } = errors;
  return res.status(error.statusCode || fatal.statusCode).json({
    message: error.message || fatal.message,
    details: details,
  });
}

export default errorHandler;
