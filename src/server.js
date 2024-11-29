import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import { connectDB } from "./config/db.connect.js";
import { config } from "./config/config.js";
import compression from "express-compression";
import { initializePassport } from "./config/passport.config.js";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import winstonLogger from "./utils/winston.util.js";
import loggerWinston from "./middlewares/winston.logger.mid.js";
import swaggerOptions, { swaggerUiOptions } from "./utils/swagger.js";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

const app = express();
const PORT = config.PORT;

//Express config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SIGN_COOKIE));
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);
app.use(loggerWinston);

//Passport config
initializePassport();
app.use(passport.initialize());

//Documentation Swagger
const specs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", serve, setup(specs, swaggerUiOptions));

//Routes
app.use("/api", routes);
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", message: "The route you are looking for does not exist" });
});

//Connect to DB
connectDB();

//Errors Manager "next(error)"
app.use(errorHandler);

app.listen(PORT, () => {
  winstonLogger.info(`Server online PORT:${PORT} Mode Server: [[ ${config.MODE} ]]`);
});
