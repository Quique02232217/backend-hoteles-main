const reservaModel = require('../models/reservaModel');

async function registrarReserva(data) {
  return await reservaModel.crearReservaCompleta(data);
}

async function listarReservas() {
  return await reservaModel.obtenerReservas();
}

module.exports = { 
  registrarReserva,
  listarReservas
 };
