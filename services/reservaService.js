const reservaModel = require("../models/reservaModel");

async function registrarReserva(data) {
  return await reservaModel.crearReservaCompleta(data);
}

async function listarReservas() {
  return await reservaModel.obtenerReservas();
}

async function cambiarEstadoReserva(numReserva, nuevoEstado) {
  const actualizado = await reservaModel.actualizarEstadoReserva(
    numReserva,
    nuevoEstado
  );
  verificarEstadoValido(actualizado);
  return { success: true, message: "Estado actualizado correctamente" };
}

function verificarEstadoValido(actualizado) {
  if (!actualizado) {
    throw new Error("No se encontró la reserva o no se pudo actualizar.");
  }
}

module.exports = {
  registrarReserva,
  listarReservas,
  cambiarEstadoReserva,
};
