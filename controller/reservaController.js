const reservaService = require("../services/reservaService");

async function crear(req, res) {
  try {
    const resultado = await reservaService.registrarReserva(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    console.error("Error al registrar reserva:", err);
    res.status(500).json({ error: "Error interno al registrar la reserva" });
  }
}

async function listar(req, res) {
  try {
    const reservasObtenidas = await reservaService.listarReservas();
    res.status(201).json(reservasObtenidas);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ error: "Error interno al obtener la reserva" });
  }
}

async function actualizarEstado(req, res) {
  try {
    const { numReserva, nuevoEstado } = req.body;
    const resultado = await reservaService.cambiarEstadoReserva(
      numReserva,
      nuevoEstado
    );
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error al actualizar estado:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  crear,
  listar,
  actualizarEstado,
};
