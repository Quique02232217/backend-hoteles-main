const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Hotel API",
    version: "1.0.0",
    description:
      "API para gestion de habitaciones, check-in y servicios de hotel",
  },
  servers: [
    {
      url: "https://backend-hoteles-main-production.up.railway.app/",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
