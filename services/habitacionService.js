const habitacionModel = require("../models/habitacionesModel");

async function listarInfoHabitaciones() {
  const habitacionesRaw = await habitacionModel.obtenerInformacionHabitacion();

  const habitacionInfo = habitacionesRaw.map((h) => ({
    id: h.id,
    descripcion: h.descripcion_habitacion,
    tipoAcomodacion: {
      codigo: h.tipo_codigo,
      detalle: h.tipo_detalle,
    },
    ocupacionMax: h.ocupacion_max,
    precioNoche: parseFloat(h.precio_noche),
    capacidadInstalada: h.capacidad_instalada,
    imagenes: h.imagenes ? JSON.parse(h.imagenes) : [],
  }));

  return habitacionInfo;
}

module.exports = {
  listarInfoHabitaciones,
};
