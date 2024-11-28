import { __dirname } from "../path.js";

console.log("this", __dirname);

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Ecommerce",
      description: "Documentation of API",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};

export default swaggerOptions;
