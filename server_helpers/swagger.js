const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Embark API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js", "models/*js"],
};

const specs = swaggerJsDoc(options);
module.exports = specs;
