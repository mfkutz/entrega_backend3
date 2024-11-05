import errors from "../utils/errors/dictionaty.errors.js";
import winstonLogger from "../utils/winston.util.js";

function errorHandler(error, req, res, next) {
  // console.log(error);

  const message = `${req.method} ${req.url} - ${error.message.toUpperCase()}`;
  if (error.statusCode) {
    winstonLogger.error(message);
  } else {
    winstonLogger.fatal(message);
    // sendErrorEmail(message) //aqui podriamos enviar un correo informando el error
    // console.log(error);
  }

  const { fatal } = errors;
  return res
    .status(error.statusCode || fatal.statusCode)
    .json({ message: error.message || fatal.message });
}

export default errorHandler;
