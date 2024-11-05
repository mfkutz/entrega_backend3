import { createLogger, format, addColors, transports } from "winston";
const { colorize, simple, timestamp } = format;
const { Console, File } = transports;

const levels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  fatal: "red",
  error: "yellow",
  warn: "magenta",
  info: "blue",
  http: "white",
  debug: "green",
};

addColors(colors);

const winstonLogger = createLogger({
  levels,
  format: format.combine(timestamp(), colorize(), simple()),
  transports: [
    new Console({ level: "http" }),
    new File({ level: "error", filename: "./src/log/errors.log" }),
    new File({ level: "info", filename: "./src/log/info.log" }),
  ],
});

export default winstonLogger;
