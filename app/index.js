const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
const alojadosRoutes = require("../routes/alojadosRoutes");
const habitacionesRoutes = require("../routes/habitacionesRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../docs/swagger");
const reservaRoutes = require("../routes/reservaRoutes");
app.use(cors());
app.use(express.json());
app.use("/api", alojadosRoutes);
app.use("/api", habitacionesRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", reservaRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`);
});
