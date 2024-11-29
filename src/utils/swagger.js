import { __dirname } from "../path.js";

const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Final Backend III - Coderhouse",
      description: "Documentation of API",
      version: "1.0.0",
    },
  },
  apis: [`${__dirname}/docs/*.yaml`],
};

/* export const swaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link {
      content: url('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png');
      height: 40px;
      width: 30px
    }
  `,
}; */

export const swaggerUiOptions = {
  customCss: `
    .topbar-wrapper .link {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 0;
    }
    .topbar-wrapper .link::before {
      content: 'API Specification DOC '; 
      font-size: 30px;
      font-weight: bold;
      color: #fff; 
    }
    .topbar-wrapper .link svg {
      display: none;
    }
  `,
};

export default swaggerOptions;
