import winstonLogger from "../utils/winston.util.js";

function winston(req, res, next) {
  try {
    req.logger = winstonLogger;

    // Check IP in x-forwarded-for header or direct connection
    const forwardedIp = req.headers["x-forwarded-for"]?.split(",")[0];
    const directIp = req.connection.remoteAddress;

    req.logger.http(
      `Direct IP: ${directIp}, Forwarded IP: ${forwardedIp || "N/A"} - ${req.method} ${
        req.url
      } - ${new Date().toLocaleDateString()}`
    );

    return next();
  } catch (error) {
    return next(error);
  }
}

export default winston;
