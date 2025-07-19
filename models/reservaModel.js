const pool = require("../models/db");
const { generarCodigoReserva } = require("../utils/utils");

async function crearReservaCompleta(data) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const titular = {
      id: data.idTitular,
      nombre: data.nombreTitular,
      email: data.emailTitular,
      telefono: data.telefonoTitular,
    };

    const detalle = data.detalles[0]; // puedes hacer un forEach si hay varios después
    const fechaLlegada = detalle.fechaDeLlegada;
    const fechaSalida = detalle.fechaDeSalida;
    const horaEstimada = detalle.horaEstimadaLlegada;
    const cupos = parseInt(detalle.numeroPersonas) || 0;
    const idAcomodacion = detalle.idAcomodacion;
    const totalPago = data.totalPago || 0;

    const numReserva = generarCodigoReserva();

    // 1. Insertar persona si no existe
    const [personaExistente] = await conn.query(
      "SELECT * FROM personas WHERE id_persona = ?",
      [titular.id]
    );
    if (personaExistente.length === 0) {
      await conn.query(
        `INSERT INTO personas (id_persona, tipo_id, razon_social, nombre1, fecha_nacimiento, ref_genero, nacionalidad)
          VALUES (?, 'C', ?, ?, CURDATE(), 'GENERO_MASCULINO', 1)`,
        [titular.id, titular.nombre, titular.nombre]
      );

      await conn.query(
        `INSERT INTO personas_det (id_persona, direccion, email, telefono)
          VALUES (?, 'Sin dirección', ?, ?)`,
        [titular.id, titular.email, titular.telefono]
      );
    }

    // 2. Insertar solicitud de alojamiento
    await conn.query(
      `INSERT INTO solicitudes_alojamiento
          (num_solicitud, id_titular, fecha_check_in, fecha_check_out, noches, hora_estimada_llegada, total_pago, monto_pagado, estado, fecha_creacion)
          VALUES (?, ?, ?, ?, DATEDIFF(?, ?), ?, ?, ?, ?, NOW())`,
      [
        numReserva,
        titular.id,
        fechaLlegada,
        fechaSalida,
        fechaSalida,
        fechaLlegada,
        horaEstimada,
        totalPago,
        0,
        "PENDIENTE",
      ]
    );

    const precioNoche = cupos > 0 ? totalPago / cupos : 0;

    // 3. Insertar detalle de solicitud
    await conn.query(
      `INSERT INTO solicitudes_alojamiento_det
          (id_acomodacion, num_solicitud, cantidad_personas, precio_noche_actual, subtotal, notas, fecha_creacion)
          VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        idAcomodacion,
        numReserva,
        cupos,
        precioNoche,
        totalPago,
        `Reserva acomodación: ${idAcomodacion}, ${cupos} persona(s), con fecha de entrada ${fechaLlegada} y fecha de salida ${fechaSalida}, con hora estimada de llegada ${horaEstimada}`,
      ]
    );

    await conn.commit();
    return {
      success: true,
      message: "Reserva creada correctamente",
      numReserva,
    };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
async function obtenerReservas() {
  const conn = await pool.getConnection();

  try {
    const [resultados] = await conn.query(
      `SELECT 
        s.num_solicitud AS numReserva,
        p.id_persona AS idTitular,
        p.nombre1 AS nombreTitular,
        pd.email AS emailTitular,
        pd.telefono AS telefonoTitular,
        s.fecha_check_in AS fecha,
        s.fecha_check_out AS fecha_salida,
        s.hora_estimada_llegada AS hora,
        s.total_pago AS totalPago,
        s.estado,
        d.id_acomodacion,
        d.cantidad_personas AS cuposReservados,
        d.notas AS detalle
      FROM solicitudes_alojamiento s
      JOIN personas p ON s.id_titular = p.id_persona
      JOIN personas_det pd ON p.id_persona = pd.id_persona
      JOIN solicitudes_alojamiento_det d ON s.num_solicitud = d.num_solicitud
    `
    );

    return resultados.map((r) => ({
      numReserva: r.numReserva,
      titular: {
        id: r.idTitular,
        nombre: r.nombreTitular,
        email: r.emailTitular,
        telefono: r.telefonoTitular,
      },
      detalle: r.detalle,
      fecha: r.fecha,
      hora: r.hora,
      cuposReservados: r.cuposReservados,
      totalPago: r.totalPago,
      estado: r.estado,
    }));
  } finally {
    conn.release();
  }
}

async function actualizarEstadoReserva(numReserva, nuevoEstado) {
  const conn = await pool.getConnection();
  try {
    const [resultado] = await conn.query(
      `UPDATE solicitudes_alojamiento 
       SET estado = ?, fecha_actualizacion = NOW()
       WHERE num_solicitud = ?`,
      [nuevoEstado, numReserva]
    );
    return resultado.affectedRows > 0;
  } finally {
    conn.release();
  }
}

module.exports = {
  crearReservaCompleta,
  obtenerReservas,
  actualizarEstadoReserva,
};
