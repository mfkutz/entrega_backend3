import winstonLogger from "../utils/winston.util.js";

function winston(req, res, next) {
  try {
    req.logger = winstonLogger;
    req.logger.http(`${req.method} ${req.url} - ${new Date().toLocaleDateString()}`);
    return next();
  } catch (error) {
    return next(error);
  }
}

export default winston;
