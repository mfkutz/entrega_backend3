const errors = {
  badRequest: {
    message: "Bad Request",
    statusCode: 400,
    description: "The request could not be understood or was missing required parameters.",
  },
  unauthorized: {
    message: "Unauthorized",
    statusCode: 401,
    description: "Authentication is required or has failed.",
  },
  paymentRequired: {
    message: "Payment Required",
    statusCode: 402,
    description: "Payment is needed to access the resource.",
  },
  forbidden: {
    message: "Forbidden",
    statusCode: 403,
    description: "You do not have permission to access the requested resource.",
  },
  notFound: {
    message: "Resource Not Found",
    statusCode: 404,
    description: "The requested resource could not be found.",
  },
  methodNotAllowed: {
    message: "Method Not Allowed",
    statusCode: 405,
    description: "The HTTP method used is not supported for this endpoint.",
  },
  conflict: {
    message: "Conflict",
    statusCode: 409,
    description:
      "The request could not be processed due to a conflict in the current state of the resource.",
  },
  unprocessableEntity: {
    message: "Unprocessable Entity",
    statusCode: 422,
    description: "The request was well-formed but could not be processed due to semantic errors.",
  },
  tooManyRequests: {
    message: "Too Many Requests",
    statusCode: 429,
    description: "You have exceeded the rate limit.",
  },
  fatal: {
    message: "Internal Server Error",
    statusCode: 500,
    description: "An unexpected error occurred on the server.",
  },
  notImplemented: {
    message: "Not Implemented",
    statusCode: 501,
    description: "The requested functionality is not supported by the server.",
  },
  badGateway: {
    message: "Bad Gateway",
    statusCode: 502,
    description: "Received an invalid response from the upstream server.",
  },
  serviceUnavailable: {
    message: "Service Unavailable",
    statusCode: 503,
    description: "The server is currently unavailable (overloaded or down).",
  },
  gatewayTimeout: {
    message: "Gateway Timeout",
    statusCode: 504,
    description: "The server, acting as a gateway, timed out waiting for an upstream server.",
  },
};

export default errors;
