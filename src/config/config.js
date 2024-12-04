/* import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program.option("-m, --mode <string>", "Define mode server", "dev");

program.parse();

const { mode } = program.opts();

let path;

switch (mode) {
  case "development":
  case "dev":
    path = ".env.development";
    break;

  case "testing":
  case "test":
    path = ".env.testing";
    break;

  case "production":
  case "prod":
    path = ".env";
    break;
}

dotenv.config({ path });

export const config = {
  PORT: process.env.PORT || process.env.LOCAL,
  MODE: process.env.MODE,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SIGN_COOKIE: process.env.SIGN_COOKIE,
  PASSWORD_USERS_MOCK: process.env.PASSWORD_USERS_MOCK,
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    from: process.env.MAILER_FROM,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  },
}; */

import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

// Opciones de la línea de comandos
program.option("-m, --mode <string>", "Define mode server", "dev");

program.parse();

const { mode } = program.opts();

let path;

// Cargar el archivo .env adecuado solo en entornos que no sean producción
if (process.env.NODE_ENV !== "production") {
  switch (mode) {
    case "development":
    case "dev":
      path = ".env.development";
      break;

    case "testing":
    case "test":
      path = ".env.testing";
      break;

    default:
      path = ".env";
      break;
  }

  dotenv.config({ path });
} else {
  console.log("En producción, no se carga el archivo .env, usamos las variables de entorno definidas en el entorno.");
}

export const config = {
  PORT: process.env.PORT || process.env.LOCAL,
  MODE: process.env.MODE,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SIGN_COOKIE: process.env.SIGN_COOKIE,
  PASSWORD_USERS_MOCK: process.env.PASSWORD_USERS_MOCK,
  mailer: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    from: process.env.MAILER_FROM,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASSWORD,
    },
  },
};
